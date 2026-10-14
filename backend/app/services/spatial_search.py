import math
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.place import Place
from backend.app.services.routing import haversine_distance, calculate_travel_metrics
from backend.app.schemas.place import PlaceProximityResponse

async def search_nearby_places(
    db: AsyncSession,
    lat: float,
    lng: float,
    radius_km: float = 25.0,
    max_travel_time_mins: Optional[int] = None,
    category: Optional[str] = None,
    sub_category: Optional[str] = None,
    access_feasibility: Optional[str] = None,
    limit: int = 50
) -> List[PlaceProximityResponse]:
    """
    Search places near a coordinate with topography-aware metrics and filters.
    Prefilters using a bounding box box query (high performance, <150ms),
    then computes true travel metrics.
    """
    # 1 deg lat ~= 111 km
    lat_delta = radius_km / 111.0
    # 1 deg lng ~= 111 * cos(lat) km
    lng_delta = radius_km / (111.0 * max(0.1, math.cos(math.radians(lat))))

    min_lat, max_lat = lat - lat_delta, lat + lat_delta
    min_lng, max_lng = lng - lng_delta, lng + lng_delta

    query = select(Place).where(
        Place.latitude.between(min_lat, max_lat),
        Place.longitude.between(min_lng, max_lng)
    )

    if category:
        query = query.where(Place.category == category)
    if sub_category:
        query = query.where(Place.sub_category == sub_category)
    if access_feasibility:
        query = query.where(Place.access_feasibility == access_feasibility)

    result = await db.execute(query)
    places = result.scalars().all()

    enriched_places = []
    use_fast_terrain = radius_km > 60.0

    for p in places:
        sl_dist = haversine_distance(lat, lng, p.latitude, p.longitude)
        if sl_dist > radius_km:
            continue

        metrics = await calculate_travel_metrics(
            origin_lat=lat,
            origin_lng=lng,
            dest_lat=p.latitude,
            dest_lng=p.longitude,
            dest_elev=p.elevation_m or 500,
            force_fallback=use_fast_terrain
        )

        # Optional filter by travel time
        if max_travel_time_mins and metrics["estimated_driving_time_mins"] > max_travel_time_mins:
            continue

        resp_dict = {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "local_names": p.local_names or {},
            "description": p.description or "",
            "category": p.category,
            "sub_category": p.sub_category,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "elevation_m": p.elevation_m,
            "district": p.district,
            "province": p.province,
            "pricing": p.pricing or {},
            "dress_code": p.dress_code or {},
            "best_time_to_visit": p.best_time_to_visit or {},
            "access_feasibility": p.access_feasibility,
            "parking_available": p.parking_available,
            "images": p.images or [],
            "tags": p.tags or [],
            "verified": p.verified,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "straight_line_distance_km": metrics["straight_line_km"],
            "estimated_driving_km": metrics["estimated_driving_km"],
            "estimated_driving_time_mins": metrics["estimated_driving_time_mins"],
            "elevation_diff_m": metrics["elevation_diff_m"],
            "is_switchback_corridor": metrics["is_switchback_corridor"],
            "corridor_warning": metrics["corridor_warning"],
            "routing_source": metrics["routing_source"]
        }
        enriched_places.append(PlaceProximityResponse(**resp_dict))

    # Sort primarily by realistic travel time, not raw straight-line
    enriched_places.sort(key=lambda x: x.estimated_driving_time_mins)
    return enriched_places[:limit]

async def generate_visit_sequence(
    db: AsyncSession,
    start_lat: float,
    start_lng: float,
    start_name: str = "Starting Location",
    max_stops: int = 4,
    category: Optional[str] = None,
    target_hours: Optional[float] = None
) -> Dict[str, Any]:
    """
    Topography-Aware Trip Sequencer:
    Given a starting point, finds the optimal sequence of places to visit,
    avoiding mountain switchback backtracking and calculating exact leg drive times.
    """
    # 1. Fetch candidates within 50 km bounding box
    radius_km = 55.0
    lat_delta = radius_km / 111.0
    lng_delta = radius_km / (111.0 * max(0.1, math.cos(math.radians(start_lat))))

    query = select(Place).where(
        Place.latitude.between(start_lat - lat_delta, start_lat + lat_delta),
        Place.longitude.between(start_lng - lng_delta, start_lng + lng_delta)
    )
    if category:
        query = query.where(Place.category == category)

    res = await db.execute(query)
    all_candidates = list(res.scalars().all())

    if not all_candidates:
        # Fallback to any places in DB
        res = await db.execute(select(Place).limit(20))
        all_candidates = list(res.scalars().all())

    # Map stay recommendations based on place sub_category
    stay_durations = {
        "temple": 75,
        "park": 105,
        "archaeological_site": 120,
        "museum": 60,
        "viewpoint": 40,
        "hiking": 90,
        "monument": 45,
        "ruins": 50,
    }

    visited_ids = set()
    ordered_stops = []
    route_coords = [[start_lng, start_lat]]

    curr_lat = start_lat
    curr_lng = start_lng
    curr_elev = 500

    cumulative_drive_mins = 0
    cumulative_trip_mins = 0
    total_km = 0.0

    target_total_mins = int(target_hours * 60) if target_hours else 9999

    for stop_idx in range(1, max_stops + 1):
        best_candidate = None
        best_metrics = None
        lowest_cost = float("inf")

        for cand in all_candidates:
            if cand.id in visited_ids:
                continue

            metrics = await calculate_travel_metrics(
                origin_lat=curr_lat,
                origin_lng=curr_lng,
                dest_lat=cand.latitude,
                dest_lng=cand.longitude,
                origin_elev=curr_elev,
                dest_elev=cand.elevation_m or 500
            )

            drive_mins = metrics["estimated_driving_time_mins"]
            road_km = metrics["estimated_driving_km"]

            # Heuristic cost: driving time + penalty for severe uphill/downhill reverses
            elev_diff = abs((cand.elevation_m or 500) - curr_elev)
            cost = drive_mins + (elev_diff / 100.0) * 2.0

            if cost < lowest_cost:
                lowest_cost = cost
                best_candidate = cand
                best_metrics = metrics

        if not best_candidate:
            break

        # Check if adding this stop exceeds target time significantly
        stay_mins = stay_durations.get(best_candidate.sub_category, 60)
        leg_drive = best_metrics["estimated_driving_time_mins"]
        leg_km = best_metrics["estimated_driving_km"]

        if stop_idx > 2 and (cumulative_trip_mins + leg_drive + stay_mins > target_total_mins):
            break

        visited_ids.add(best_candidate.id)
        cumulative_drive_mins += leg_drive
        cumulative_trip_mins += (leg_drive + stay_mins)
        total_km += leg_km

        stop_item = {
            "stop_number": stop_idx,
            "place_id": best_candidate.id,
            "name": best_candidate.name,
            "category": best_candidate.category,
            "sub_category": best_candidate.sub_category,
            "latitude": best_candidate.latitude,
            "longitude": best_candidate.longitude,
            "elevation_m": best_candidate.elevation_m or 500,
            "district": best_candidate.district,
            "leg_driving_km": leg_km,
            "leg_driving_time_mins": leg_drive,
            "recommended_stay_mins": stay_mins,
            "cumulative_driving_mins": cumulative_drive_mins,
            "cumulative_trip_mins": cumulative_trip_mins,
            "pricing": best_candidate.pricing or {},
            "dress_code": best_candidate.dress_code or {},
            "best_time_to_visit": best_candidate.best_time_to_visit or {},
            "access_feasibility": best_candidate.access_feasibility,
            "corridor_warning": best_metrics.get("corridor_warning")
        }
        ordered_stops.append(stop_item)
        route_coords.append([best_candidate.longitude, best_candidate.latitude])

        # Advance current position
        curr_lat = best_candidate.latitude
        curr_lng = best_candidate.longitude
        curr_elev = best_candidate.elevation_m or 500

    hours = cumulative_trip_mins // 60
    mins = cumulative_trip_mins % 60
    duration_str = f"{hours}h {mins}m" if hours > 0 else f"{mins} mins"

    summary = (
        f"Optimized {len(ordered_stops)}-stop corridor sequence from {start_name}: "
        f"{round(total_km, 1)} km road travel, ~{cumulative_drive_mins} mins driving, "
        f"total itinerary {duration_str}."
    )

    return {
        "start_location": {
            "name": start_name,
            "latitude": start_lat,
            "longitude": start_lng
        },
        "total_stops": len(ordered_stops),
        "total_distance_km": round(total_km, 1),
        "total_driving_time_mins": cumulative_drive_mins,
        "total_trip_duration_mins": cumulative_trip_mins,
        "stops": ordered_stops,
        "route_geometry": route_coords,
        "corridor_summary": summary
    }
