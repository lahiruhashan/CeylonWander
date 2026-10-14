from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.loop import ItineraryLoop
from backend.app.models.place import Place
from backend.app.schemas.loop import (
    ItineraryLoopResponse, 
    ItineraryLoopCreate, 
    VisitSequenceRequest, 
    VisitSequenceResponse
)
from backend.app.schemas.place import PlaceProximityResponse
from backend.app.services.routing import calculate_travel_metrics
from backend.app.services.spatial_search import generate_visit_sequence

router = APIRouter(prefix="/loops", tags=["Smart Loops & Corridors"])

@router.post("/sequence", response_model=VisitSequenceResponse)
async def create_visit_sequence(
    request: VisitSequenceRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Given a starting GPS or town location, calculates the optimal sequence of
    places to visit, computing realistic hill-country driving times and stay durations.
    """
    return await generate_visit_sequence(
        db=db,
        start_lat=request.start_lat,
        start_lng=request.start_lng,
        start_name=request.start_name or "Starting Location",
        max_stops=request.max_stops,
        category=request.category,
        target_hours=request.target_hours
    )

@router.get("", response_model=List[ItineraryLoopResponse])
async def list_loops(
    region_id: Optional[str] = None,
    duration_category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """FR-3.2: List pre-calculated scenic loops that minimize backtracking on narrow mountain roads."""
    query = select(ItineraryLoop)
    if region_id:
        query = query.where(ItineraryLoop.region_id == region_id)
    if duration_category:
        query = query.where(ItineraryLoop.duration_category == duration_category)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/corridor-suggestions", response_model=List[PlaceProximityResponse])
async def get_corridor_suggestions(
    place_id: str = Query(..., description="ID of anchor attraction (e.g. Royal Botanical Gardens)"),
    max_detour_km: float = Query(12.0, description="Max deviation along same corridor in km"),
    limit: int = Query(3, ge=1, le=10),
    db: AsyncSession = Depends(get_db)
):
    """
    FR-3.1 Sequential Stop Suggestions:
    When viewing a major attraction, suggests micro-attractions located along the same physical road corridor.
    """
    anchor_res = await db.execute(select(Place).where(Place.id == place_id))
    anchor = anchor_res.scalar_one_or_none()
    if not anchor:
        raise HTTPException(status_code=404, detail="Anchor place not found")

    # Find places nearby that are NOT the anchor place
    query = select(Place).where(
        Place.id != anchor.id,
        Place.latitude.between(anchor.latitude - 0.15, anchor.latitude + 0.15),
        Place.longitude.between(anchor.longitude - 0.15, anchor.longitude + 0.15)
    )
    res = await db.execute(query)
    candidates = res.scalars().all()

    suggestions = []
    for c in candidates:
        metrics = await calculate_travel_metrics(
            origin_lat=anchor.latitude,
            origin_lng=anchor.longitude,
            dest_lat=c.latitude,
            dest_lng=c.longitude,
            origin_elev=anchor.elevation_m,
            dest_elev=c.elevation_m
        )
        if metrics["estimated_driving_km"] <= max_detour_km:
            resp_dict = {
                "id": c.id,
                "name": c.name,
                "slug": c.slug,
                "local_names": c.local_names or {},
                "description": c.description or "",
                "category": c.category,
                "sub_category": c.sub_category,
                "latitude": c.latitude,
                "longitude": c.longitude,
                "elevation_m": c.elevation_m,
                "district": c.district,
                "province": c.province,
                "pricing": c.pricing or {},
                "dress_code": c.dress_code or {},
                "best_time_to_visit": c.best_time_to_visit or {},
                "access_feasibility": c.access_feasibility,
                "parking_available": c.parking_available,
                "images": c.images or [],
                "tags": c.tags or [],
                "verified": c.verified,
                "created_at": c.created_at,
                "updated_at": c.updated_at,
                "straight_line_distance_km": metrics["straight_line_km"],
                "estimated_driving_km": metrics["estimated_driving_km"],
                "estimated_driving_time_mins": metrics["estimated_driving_time_mins"],
                "elevation_diff_m": metrics["elevation_diff_m"],
                "is_switchback_corridor": metrics["is_switchback_corridor"],
                "corridor_warning": f"Convenient stop along corridor: ~{metrics['estimated_driving_time_mins']} mins from {anchor.name}",
                "routing_source": metrics["routing_source"]
            }
            suggestions.append(PlaceProximityResponse(**resp_dict))

    suggestions.sort(key=lambda x: x.estimated_driving_time_mins)
    return suggestions[:limit]

@router.get("/{loop_id}", response_model=ItineraryLoopResponse)
async def get_loop(loop_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ItineraryLoop).where(ItineraryLoop.id == loop_id))
    loop = result.scalar_one_or_none()
    if not loop:
        raise HTTPException(status_code=404, detail="Itinerary loop not found")
    return loop
