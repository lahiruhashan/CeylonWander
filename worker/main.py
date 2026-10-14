import math
import time
import urllib.parse
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx

from worker.places_data import NATIONWIDE_PLACES, NATIONWIDE_REGIONS

app = FastAPI(
    title="CeylonWander Edge API",
    description="Offline-first, topography-aware travel discovery engine running on Cloudflare Workers",
    version="1.0.0"
)

# Enable CORS for Cloudflare Pages and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def calculate_topography_metrics(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
    origin_elev: int = 500,
    dest_elev: int = 500
) -> Dict[str, Any]:
    """
    Computes topography-aware driving distance and time for Sri Lanka terrain.
    Accounts for steep mountain hairpins vs. flat coastal plains.
    """
    straight_line_km = haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    elev_diff = abs(dest_elev - origin_elev)
    avg_elev = (dest_elev + origin_elev) / 2.0
    is_hill_country = avg_elev > 450 or elev_diff > 250

    if is_hill_country:
        # Mountain roads: winding ratio ~1.42x, average speed ~28 km/h
        winding_factor = 1.42
        avg_speed_kmh = 28.0
        warning = f"Hill country winding road (~{round(straight_line_km * winding_factor, 1)} km driving vs {straight_line_km} km direct)."
    else:
        # Coastal & plains roads: winding ratio ~1.22x, average speed ~45 km/h
        winding_factor = 1.22
        avg_speed_kmh = 45.0
        warning = None

    est_km = round(straight_line_km * winding_factor, 1)
    driving_mins = max(2, round((est_km / avg_speed_kmh) * 60))

    return {
        "straight_line_km": straight_line_km,
        "estimated_driving_km": est_km,
        "estimated_driving_time_mins": driving_mins,
        "elevation_diff_m": elev_diff,
        "is_switchback_corridor": is_hill_country,
        "corridor_warning": warning,
        "routing_source": "cloudflare_edge_topography"
    }

# ----------------- SCHEMAS -----------------

class SequenceRequest(BaseModel):
    start_lat: float
    start_lng: float
    start_name: Optional[str] = "Starting Location"
    max_stops: int = Field(default=4, ge=2, le=8)
    category: Optional[str] = None
    target_hours: Optional[float] = None

class ContributionRequest(BaseModel):
    place_id: Optional[str] = None
    place_name: str
    contribution_type: str = "road_condition"
    details: str
    submitter_name: Optional[str] = "Anonymous Traveler"
    submitter_email: Optional[str] = None

# In-memory contributions list for edge session
COMMUNITY_CONTRIBUTIONS: List[Dict[str, Any]] = []

# ----------------- ROUTES -----------------

@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "app": "CeylonWander Edge API",
        "platform": "Cloudflare Python Workers",
        "total_places": len(NATIONWIDE_PLACES),
        "total_regions": len(NATIONWIDE_REGIONS),
        "edge_ready": True
    }

@app.get("/api/v1/places/nearby")
async def get_nearby_places(
    lat: float = Query(..., description="Latitude of user or center"),
    lng: float = Query(..., description="Longitude of user or center"),
    radius_km: float = Query(60.0, ge=1.0, le=400.0),
    max_travel_time_mins: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    sub_category: Optional[str] = Query(None),
    access_feasibility: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=300)
):
    """
    Topography-aware proximity search running in-memory at Cloudflare edge.
    Sub-5ms query response time across all Sri Lanka visit locations.
    """
    results = []

    for p in NATIONWIDE_PLACES:
        if category and category != 'all' and p.get("category") != category:
            continue
        if sub_category and p.get("sub_category") != sub_category:
            continue
        if access_feasibility and p.get("access_feasibility") != access_feasibility:
            continue

        p_lat = p["latitude"]
        p_lng = p["longitude"]
        sl_dist = haversine_distance(lat, lng, p_lat, p_lng)

        if sl_dist > radius_km:
            continue

        metrics = calculate_topography_metrics(
            origin_lat=lat,
            origin_lng=lng,
            dest_lat=p_lat,
            dest_lng=p_lng,
            origin_elev=500,
            dest_elev=p.get("elevation_m", 500)
        )

        if max_travel_time_mins and metrics["estimated_driving_time_mins"] > max_travel_time_mins:
            continue

        enriched = dict(p)
        enriched.update({
            "straight_line_distance_km": metrics["straight_line_km"],
            "estimated_driving_km": metrics["estimated_driving_km"],
            "estimated_driving_time_mins": metrics["estimated_driving_time_mins"],
            "elevation_diff_m": metrics["elevation_diff_m"],
            "is_switchback_corridor": metrics["is_switchback_corridor"],
            "corridor_warning": metrics["corridor_warning"],
            "routing_source": metrics["routing_source"]
        })
        results.append(enriched)

    # Sort nearest first
    results.sort(key=lambda x: x["straight_line_distance_km"])
    return results[:limit]

@app.get("/api/v1/places/search-geocoding")
async def search_geocoding(
    q: str = Query(..., min_length=2, description="Hotel, guesthouse or town in Sri Lanka")
):
    """
    Search local curated places first, and query OpenStreetMap Nominatim for Sri Lanka stays.
    """
    results = []
    seen = set()

    # 1. Match local curated places
    q_lower = q.lower()
    for p in NATIONWIDE_PLACES:
        if q_lower in p["name"].lower() or (p.get("local_names") and q_lower in str(p["local_names"]).lower()):
            seen.add(p["name"].lower())
            results.append({
                "name": p["name"],
                "display_name": f"{p['name']}, {p.get('district', 'Sri Lanka')}",
                "latitude": p["latitude"],
                "longitude": p["longitude"],
                "type": p.get("category", "place"),
                "source": "database"
            })
            if len(results) >= 5:
                break

    # 2. Query free OpenStreetMap Nominatim for Sri Lanka
    try:
        encoded_q = urllib.parse.quote(q)
        url = f"https://nominatim.openstreetmap.org/search?q={encoded_q}&countrycodes=lk&format=json&addressdetails=1&limit=6"
        headers = {"User-Agent": "CeylonWander/1.0 (ceylonwander@app.local)"}

        async with httpx.AsyncClient(timeout=2.5) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                for item in resp.json():
                    name = item.get("name") or item.get("display_name", "").split(",")[0]
                    if name.lower() not in seen:
                        seen.add(name.lower())
                        results.append({
                            "name": name,
                            "display_name": item.get("display_name"),
                            "latitude": float(item["lat"]),
                            "longitude": float(item["lon"]),
                            "type": item.get("type", "landmark"),
                            "source": "osm_nominatim"
                        })
    except Exception:
        pass

    return results

@app.post("/api/v1/loops/sequence")
async def create_visit_sequence(req: SequenceRequest):
    """
    Greedy nearest-neighbor sequence algorithm accounting for topography travel times.
    """
    candidates = []
    for p in NATIONWIDE_PLACES:
        if req.category and req.category != 'all' and p.get("category") != req.category:
            continue
        dist = haversine_distance(req.start_lat, req.start_lng, p["latitude"], p["longitude"])
        if dist <= 120.0:  # within day-trip reach
            candidates.append((dist, p))

    candidates.sort(key=lambda x: x[0])
    selected_pool = [c[1] for c in candidates[:15]]

    if not selected_pool:
        # Fallback to closest 4 anywhere
        all_sorted = sorted(NATIONWIDE_PLACES, key=lambda p: haversine_distance(req.start_lat, req.start_lng, p["latitude"], p["longitude"]))
        selected_pool = all_sorted[:req.max_stops]

    # Build sequence
    stops = []
    unvisited = list(selected_pool)
    current_lat, current_lng = req.start_lat, req.start_lng
    current_elev = 500

    cum_driving_mins = 0
    cum_trip_mins = 0
    total_km = 0.0
    route_geometry = [[req.start_lng, req.start_lat]]

    for stop_num in range(1, min(req.max_stops, len(unvisited)) + 1):
        # Pick nearest unvisited
        nearest_idx = 0
        best_time = 999999
        best_metrics = None

        for idx, p in enumerate(unvisited):
            m = calculate_topography_metrics(
                current_lat, current_lng,
                p["latitude"], p["longitude"],
                current_elev, p.get("elevation_m", 500)
            )
            if m["estimated_driving_time_mins"] < best_time:
                best_time = m["estimated_driving_time_mins"]
                best_metrics = m
                nearest_idx = idx

        next_place = unvisited.pop(nearest_idx)
        stay_mins = 60 if next_place.get("category") == "heritage" else 45
        if next_place.get("sub_category") in ["fortress", "safari"]:
            stay_mins = 120

        cum_driving_mins += best_metrics["estimated_driving_time_mins"]
        cum_trip_mins += best_metrics["estimated_driving_time_mins"] + stay_mins
        total_km += best_metrics["estimated_driving_km"]

        stops.append({
            "stop_number": stop_num,
            "place_id": next_place["id"],
            "name": next_place["name"],
            "category": next_place.get("category", "heritage"),
            "sub_category": next_place.get("sub_category", "attraction"),
            "latitude": next_place["latitude"],
            "longitude": next_place["longitude"],
            "elevation_m": next_place.get("elevation_m", 500),
            "district": next_place.get("district", "Sri Lanka"),
            "leg_driving_km": best_metrics["estimated_driving_km"],
            "leg_driving_time_mins": best_metrics["estimated_driving_time_mins"],
            "recommended_stay_mins": stay_mins,
            "cumulative_driving_mins": cum_driving_mins,
            "cumulative_trip_mins": cum_trip_mins,
            "pricing": next_place.get("pricing", {}),
            "dress_code": next_place.get("dress_code", {}),
            "best_time_to_visit": next_place.get("best_time_to_visit", {}),
            "access_feasibility": next_place.get("access_feasibility", "car"),
            "corridor_warning": best_metrics["corridor_warning"]
        })

        route_geometry.append([next_place["longitude"], next_place["latitude"]])
        current_lat = next_place["latitude"]
        current_lng = next_place["longitude"]
        current_elev = next_place.get("elevation_m", 500)

    return {
        "start_location": {
            "name": req.start_name or "Starting Location",
            "latitude": req.start_lat,
            "longitude": req.start_lng
        },
        "total_stops": len(stops),
        "total_distance_km": round(total_km, 1),
        "total_driving_time_mins": cum_driving_mins,
        "total_trip_duration_mins": cum_trip_mins,
        "stops": stops,
        "route_geometry": route_geometry,
        "corridor_summary": f"Scenic loop with {len(stops)} stops covering {round(total_km, 1)} km through Sri Lanka corridor."
    }

@app.get("/api/v1/loops")
async def list_loops():
    return [
        {
            "id": "kandy-three-temples",
            "title": "Three Ancient Temples Loop (Gadaladeniya, Embekke, Lankathilaka)",
            "region_id": "kandy-hub",
            "duration_category": "half_day",
            "estimated_travel_time_mins": 90,
            "total_distance_km": 28.5,
            "stops": [],
            "corridor_tips": "Scenic secondary road loop through rice paddies."
        },
        {
            "id": "sigiriya-pidurangala-loop",
            "title": "Sigiriya Royal Citadel & Pidurangala Sunrise Corridor",
            "region_id": "cultural-triangle",
            "duration_category": "full_day",
            "estimated_travel_time_mins": 45,
            "total_distance_km": 14.0,
            "stops": [],
            "corridor_tips": "Climb Pidurangala for 5:45 AM sunrise; explore Sigiriya in afternoon."
        }
    ]

@app.get("/api/v1/regions")
async def list_regions():
    return NATIONWIDE_REGIONS

@app.post("/api/v1/contributions", status_code=201)
async def submit_contribution(c: ContributionRequest):
    record = {
        "id": f"contrib-{int(time.time())}",
        "place_id": c.place_id,
        "place_name": c.place_name,
        "contribution_type": c.contribution_type,
        "details": c.details,
        "submitter_name": c.submitter_name,
        "status": "pending",
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    COMMUNITY_CONTRIBUTIONS.append(record)
    return record

@app.get("/api/v1/contributions")
async def list_contributions():
    return COMMUNITY_CONTRIBUTIONS

# ----------------- CLOUDFLARE ASGI EXPORT -----------------
try:
    from workers import asgi
    Default = asgi.entrypoint(app)
except ImportError:
    # Allows testing locally with: uvicorn worker.main:app
    pass

