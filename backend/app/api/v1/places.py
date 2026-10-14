from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.place import Place
from backend.app.schemas.place import PlaceResponse, PlaceProximityResponse, PlaceCreate
from backend.app.services.spatial_search import search_nearby_places
from backend.app.services.routing import calculate_travel_metrics

router = APIRouter(prefix="/places", tags=["Places Discovery"])

@router.get("/nearby", response_model=List[PlaceProximityResponse])
async def get_nearby_places(
    lat: float = Query(..., description="Latitude of user or center point (e.g. 7.2906 for Kandy)"),
    lng: float = Query(..., description="Longitude of user or center point (e.g. 80.6337 for Kandy)"),
    radius_km: float = Query(60.0, ge=1.0, le=400.0, description="Search radius in kilometers"),
    max_travel_time_mins: Optional[int] = Query(None, description="Max travel time in minutes"),
    category: Optional[str] = Query(None, description="Category filter (heritage, nature, tea_agriculture, wildlife, food_local)"),
    sub_category: Optional[str] = Query(None, description="Sub-category filter"),
    access_feasibility: Optional[str] = Query(None, description="Vehicle feasibility filter (car, 4wd_only, tuk_tuk_track, foot_trail)"),
    limit: int = Query(100, ge=1, le=300),
    db: AsyncSession = Depends(get_db)
):
    """
    FR-1.1, FR-1.2, FR-1.3, FR-1.4:
    Topography-aware proximity discovery engine.
    Calculates driving travel times accounting for hill-country switchbacks rather than straight-line distance.
    """
    return await search_nearby_places(
        db=db,
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        max_travel_time_mins=max_travel_time_mins,
        category=category,
        sub_category=sub_category,
        access_feasibility=access_feasibility,
        limit=limit
    )

@router.get("/search-geocoding")
async def search_geocoding(
    q: str = Query(..., min_length=2, description="Hotel name, guesthouse, street, or town in Sri Lanka"),
    db: AsyncSession = Depends(get_db)
):
    """
    FR-1.1: Free, open search for ANY starting point (hotel, previous stay, landmark, town)
    Combines local CeylonWander database with free OpenStreetMap Nominatim Sri Lanka geocoding.
    """
    import urllib.parse
    import httpx

    results = []
    seen_names = set()

    # 1. Search local DB places
    local_query = select(Place).where(Place.name.ilike(f"%{q}%")).limit(5)
    local_res = await db.execute(local_query)
    for p in local_res.scalars().all():
        seen_names.add(p.name.lower())
        results.append({
          "name": p.name,
          "display_name": f"{p.name}, {p.district}",
          "latitude": p.latitude,
          "longitude": p.longitude,
          "type": p.category,
          "source": "database"
        })

    # 2. Query free OpenStreetMap Nominatim for Sri Lanka (hotels, guest houses, stays, towns)
    try:
        encoded_q = urllib.parse.quote(q)
        url = f"https://nominatim.openstreetmap.org/search?q={encoded_q}&countrycodes=lk&format=json&addressdetails=1&limit=6"
        headers = {"User-Agent": "CeylonWander/1.0 (ceylonwander@app.local)"}
        
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                for item in data:
                    item_name = item.get("name") or item.get("display_name", "").split(",")[0]
                    if item_name.lower() in seen_names:
                        continue
                    seen_names.add(item_name.lower())
                    
                    item_type = item.get("type", "location")
                    if item.get("class") == "tourism" and item.get("type") in ["hotel", "guest_house", "motel", "hostel", "chalet"]:
                        item_type = "hotel"
                    elif item.get("class") == "place":
                        item_type = "town"

                    results.append({
                        "name": item_name,
                        "display_name": item.get("display_name"),
                        "latitude": float(item["lat"]),
                        "longitude": float(item["lon"]),
                        "type": item_type,
                        "source": "osm_nominatim"
                    })
    except Exception as e:
        # Gracefully handle network timeouts without breaking user experience
        pass

    return results

@router.get("", response_model=List[PlaceResponse])
async def list_places(
    category: Optional[str] = None,
    district: Optional[str] = None,
    limit: int = 250,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """List places with optional filtering by category or district."""
    query = select(Place)
    if category:
        query = query.where(Place.category == category)
    if district:
        query = query.where(Place.district == district)
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{place_id}", response_model=PlaceResponse)
async def get_place_by_id(
    place_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    FR-2.1 to FR-2.5:
    Fetch complete place profile with structured dual pricing, cultural dress codes, 
    optimal visit windows (puja timings/weather), and access feasibility.
    """
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()
    if not place:
        # Also check by slug
        result = await db.execute(select(Place).where(Place.slug == place_id))
        place = result.scalar_one_or_none()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

@router.post("", response_model=PlaceResponse, status_code=201)
async def create_place(
    place_in: PlaceCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Add a new place to the CeylonWander database with dual pricing,
    cultural dress etiquette, visit windows, and coordinates.
    """
    import re
    import uuid

    place_dict = place_in.model_dump()
    if not place_dict.get("slug"):
        slug_base = re.sub(r'[^a-z0-9]+', '-', place_dict["name"].lower()).strip('-')
        place_dict["slug"] = f"{slug_base}-{str(uuid.uuid4())[:6]}"
    
    if not place_dict.get("id"):
        place_dict["id"] = str(uuid.uuid4())

    place = Place(**place_dict)
    db.add(place)
    await db.commit()
    await db.refresh(place)
    return place

@router.post("/seed", status_code=200)
async def seed_database_endpoint():
    """
    Seed or refresh the database with 100+ curated nationwide Sri Lanka places,
    regions, and smart corridor loops.
    """
    from backend.ingestion.nationwide_scraper import run_ingestion_pipeline
    total = await run_ingestion_pipeline(seed_first=True, scrape_osm=True)
    return {
        "status": "success", 
        "message": f"Database successfully populated with {total} nationwide places across all 9 provinces of Sri Lanka",
        "total_places": total
    }

