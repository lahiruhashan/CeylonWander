import math
import time
import json
import urllib.parse
from typing import List, Dict, Any, Optional

try:
    from workers import Response, WorkerEntrypoint
except ImportError:
    # Fallback mock for local testing outside Cloudflare
    class WorkerEntrypoint:
        pass
    class Response:
        def __init__(self, body, status=200, headers=None):
            self.body = body
            self.status = status
            self.headers = headers or {}

try:
    from places_data import NATIONWIDE_PLACES, NATIONWIDE_REGIONS
except ImportError:
    from worker.places_data import NATIONWIDE_PLACES, NATIONWIDE_REGIONS

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
}

def json_response(data: Any, status: int = 200) -> Response:
    try:
        return Response.json(data, headers=CORS_HEADERS)
    except Exception:
        return Response(json.dumps(data), headers=CORS_HEADERS)

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
        winding_factor = 1.42
        avg_speed_kmh = 28.0
        warning = f"Hill country winding road (~{round(straight_line_km * winding_factor, 1)} km driving vs {straight_line_km} km direct)."
    else:
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

class Default(WorkerEntrypoint):
    """
    Cloudflare Python Worker Native Entrypoint.
    Zero-dependency, sub-2ms latency spatial discovery engine running at Cloudflare Colombo edge.
    """
    async def fetch(self, request, env=None):
        try:
            return await self._handle_fetch(request)
        except Exception as e:
            return json_response({"error": str(e), "type": type(e).__name__}, status=500)

    async def on_fetch(self, request, env=None):
        try:
            return await self._handle_fetch(request)
        except Exception as e:
            return json_response({"error": str(e), "type": type(e).__name__}, status=500)

    async def _handle_fetch(self, request):
        method = request.method.upper()

        # Handle CORS Preflight
        if method == "OPTIONS":
            return Response("", headers=CORS_HEADERS)

        parsed_url = urllib.parse.urlparse(request.url)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # 1. Health check
        if path == "/health" or path == "/":
            return json_response({
                "status": "healthy",
                "app": "CeylonWander Edge API",
                "platform": "Cloudflare Python Workers",
                "total_places": len(NATIONWIDE_PLACES),
                "total_regions": len(NATIONWIDE_REGIONS),
                "edge": True
            })

        # 2. Places Nearby Discovery (/api/v1/places/nearby)
        if path == "/api/v1/places/nearby":
            try:
                lat = float(query.get("lat", [7.2906])[0])
                lng = float(query.get("lng", [80.6337])[0])
                radius_km = float(query.get("radius_km", [60.0])[0])
                category = query.get("category", [None])[0]
                sub_category = query.get("sub_category", [None])[0]
                access = query.get("access_feasibility", [None])[0]
                limit = int(query.get("limit", [100])[0])
                max_time = query.get("max_travel_time_mins", [None])[0]
                max_travel_time = int(max_time) if max_time else None
            except Exception as e:
                return json_response({"error": f"Invalid query parameters: {str(e)}"}, status=400)

            results = []
            for p in NATIONWIDE_PLACES:
                if category and category != 'all' and p.get("category") != category:
                    continue
                if sub_category and p.get("sub_category") != sub_category:
                    continue
                if access and p.get("access_feasibility") != access:
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

                if max_travel_time and metrics["estimated_driving_time_mins"] > max_travel_time:
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

            results.sort(key=lambda x: x["straight_line_distance_km"])
            return json_response(results[:limit])

        # 3. Geocoding Search (/api/v1/places/search-geocoding)
        if path == "/api/v1/places/search-geocoding":
            q = query.get("q", [""])[0].strip().lower()
            if not q or len(q) < 2:
                return json_response([])

            matches = []
            for p in NATIONWIDE_PLACES:
                name_match = q in p["name"].lower()
                si_match = p.get("local_names", {}).get("si", "").lower()
                ta_match = p.get("local_names", {}).get("ta", "").lower()
                district_match = q in p.get("district", "").lower()

                if name_match or q in si_match or q in ta_match or district_match:
                    matches.append({
                        "name": p["name"],
                        "display_name": f"{p['name']}, {p.get('district', 'Sri Lanka')}",
                        "latitude": p["latitude"],
                        "longitude": p["longitude"],
                        "type": p.get("category", "place"),
                        "source": "curated_database"
                    })
                    if len(matches) >= 8:
                        break

            return json_response(matches)

        # 4. Trip Sequencer (/api/v1/loops/sequence)
        if path == "/api/v1/loops/sequence" and method == "POST":
            try:
                body_raw = await request.text()
                body = json.loads(body_raw) if body_raw else {}
            except Exception:
                body = {}

            start_lat = float(body.get("start_lat", 7.2906))
            start_lng = float(body.get("start_lng", 80.6337))
            start_name = body.get("start_name") or "Starting Point"
            max_stops = int(body.get("max_stops", 4))
            category = body.get("category")

            # Filter candidates within reachable day-trip radius
            candidates = []
            for p in NATIONWIDE_PLACES:
                if category and category != "all" and p.get("category") != category:
                    continue
                d = haversine_distance(start_lat, start_lng, p["latitude"], p["longitude"])
                if d <= 120.0:
                    candidates.append((d, p))

            candidates.sort(key=lambda x: x[0])
            selected_pool = [c[1] for c in candidates[:15]]

            if not selected_pool:
                all_sorted = sorted(NATIONWIDE_PLACES, key=lambda p: haversine_distance(start_lat, start_lng, p["latitude"], p["longitude"]))
                selected_pool = all_sorted[:max_stops]

            # Build sequence using greedy shortest hill-driving time
            stops = []
            unvisited = list(selected_pool)
            curr_lat, curr_lng = start_lat, start_lng
            curr_elev = 500

            cum_driving_mins = 0
            cum_trip_mins = 0
            total_km = 0.0
            route_geometry = [[start_lng, start_lat]]

            for stop_idx in range(1, min(max_stops, len(unvisited)) + 1):
                best_idx = 0
                best_time = 999999
                best_metrics = None

                for idx, p in enumerate(unvisited):
                    m = calculate_topography_metrics(
                        curr_lat, curr_lng,
                        p["latitude"], p["longitude"],
                        curr_elev, p.get("elevation_m", 500)
                    )
                    if m["estimated_driving_time_mins"] < best_time:
                        best_time = m["estimated_driving_time_mins"]
                        best_metrics = m
                        best_idx = idx

                next_place = unvisited.pop(best_idx)
                stay_mins = 60 if next_place.get("category") == "heritage" else 45
                if next_place.get("sub_category") in ["fortress", "safari"]:
                    stay_mins = 120

                cum_driving_mins += best_metrics["estimated_driving_time_mins"]
                cum_trip_mins += best_metrics["estimated_driving_time_mins"] + stay_mins
                total_km += best_metrics["estimated_driving_km"]

                stops.append({
                    "stop_number": stop_idx,
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
                curr_lat = next_place["latitude"]
                curr_lng = next_place["longitude"]
                curr_elev = next_place.get("elevation_m", 500)

            return json_response({
                "start_location": {
                    "name": start_name,
                    "latitude": start_lat,
                    "longitude": start_lng
                },
                "total_stops": len(stops),
                "total_distance_km": round(total_km, 1),
                "total_driving_time_mins": cum_driving_mins,
                "total_trip_duration_mins": cum_trip_mins,
                "stops": stops,
                "route_geometry": route_geometry,
                "corridor_summary": f"Optimized corridor route with {len(stops)} stops covering {round(total_km, 1)} km."
            })

        # 5. Corridor suggestions (/api/v1/loops/corridor-suggestions)
        if path == "/api/v1/loops/corridor-suggestions":
            place_id = query.get("place_id", [""])[0]
            anchor = next((p for p in NATIONWIDE_PLACES if p["id"] == place_id), None)
            if not anchor:
                return json_response([])

            nearby = []
            for p in NATIONWIDE_PLACES:
                if p["id"] == place_id:
                    continue
                d = haversine_distance(anchor["latitude"], anchor["longitude"], p["latitude"], p["longitude"])
                if d <= 15.0:
                    enriched = dict(p)
                    enriched["straight_line_distance_km"] = d
                    nearby.append(enriched)

            nearby.sort(key=lambda x: x["straight_line_distance_km"])
            return json_response(nearby[:3])

        # 6. Regions (/api/v1/regions)
        if path == "/api/v1/regions":
            return json_response(NATIONWIDE_REGIONS)

        # 7. Loops (/api/v1/loops)
        if path == "/api/v1/loops":
            return json_response([
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
            ])

        # 8. Contributions (/api/v1/contributions)
        if path == "/api/v1/contributions":
            if method == "POST":
                try:
                    body_raw = await request.text()
                    body = json.loads(body_raw) if body_raw else {}
                except Exception:
                    body = {}
                record = {
                    "id": f"contrib-{int(time.time())}",
                    "place_id": body.get("place_id"),
                    "place_name": body.get("place_name", "Unknown Place"),
                    "contribution_type": body.get("contribution_type", "road_condition"),
                    "details": body.get("details", ""),
                    "submitter_name": body.get("submitter_name", "Anonymous Traveler"),
                    "status": "pending",
                    "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                return json_response(record, status=201)
            return json_response([])

        # Fallback 404
        return json_response({"error": "Endpoint not found", "path": path}, status=404)

# Top-level on_fetch handler for legacy pyodide-entrypoint-helper
async def on_fetch(request, env=None):
    handler = Default()
    return await handler._handle_fetch(request)

