import math
import time
import httpx
from typing import Dict, Any, Optional
from backend.app.config import settings

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points on earth in kilometers."""
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# Simple circuit breaker state for external OSRM
_osrm_circuit_open_until: float = 0.0
_http_client: Optional[httpx.AsyncClient] = None

def get_routing_client() -> httpx.AsyncClient:
    global _http_client
    if _http_client is None or _http_client.is_closed:
        _http_client = httpx.AsyncClient(timeout=0.4, limits=httpx.Limits(max_keepalive_connections=20, max_connections=50))
    return _http_client

async def calculate_travel_metrics(
    origin_lat: float, 
    origin_lng: float, 
    dest_lat: float, 
    dest_lng: float,
    origin_elev: int = 500,
    dest_elev: int = 500,
    force_fallback: bool = False
) -> Dict[str, Any]:
    """
    Computes road distance and travel time.
    First tries OSRM router. If unreachable, circuit-breaker opens or falls back to 
    topography-aware hill-country model (NFR-3).
    """
    global _osrm_circuit_open_until
    straight_line_km = haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    elev_diff = abs(dest_elev - origin_elev)
    avg_elev = (dest_elev + origin_elev) / 2.0
    is_hill_country = avg_elev > 450 or elev_diff > 250

    now = time.time()
    can_try_osrm = (
        not force_fallback and 
        bool(settings.OSRM_ROUTING_URL) and 
        now > _osrm_circuit_open_until
    )

    if can_try_osrm:
        try:
            client = get_routing_client()
            url = f"{settings.OSRM_ROUTING_URL}/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=false"
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("code") == "Ok" and data.get("routes"):
                    route = data["routes"][0]
                    road_distance_km = round(route["distance"] / 1000.0, 2)
                    duration_mins = max(1, round(route["duration"] / 60.0))
                    
                    warning = None
                    if is_hill_country and road_distance_km > straight_line_km * 1.5:
                        warning = f"Hill country switchback road: {road_distance_km} km vs {round(straight_line_km, 1)} km straight-line."
                        
                    return {
                        "straight_line_km": round(straight_line_km, 2),
                        "estimated_driving_km": road_distance_km,
                        "estimated_driving_time_mins": duration_mins,
                        "elevation_diff_m": elev_diff,
                        "is_switchback_corridor": is_hill_country,
                        "corridor_warning": warning,
                        "routing_source": "osrm"
                    }
        except Exception:
            # Trip circuit breaker for 30s to prevent stalling during connectivity drops (NFR-3)
            _osrm_circuit_open_until = now + 30.0

    # Topography Fallback Model (NFR-3)
    if is_hill_country:
        winding_factor = settings.HILL_COUNTRY_SWITCHBACK_FACTOR
        avg_speed_kmh = settings.FALLBACK_SPEED_HILL_COUNTRY_KMH
        warning = f"Topography Warning: Mountain switchbacks apply. Driving time estimated at ~{avg_speed_kmh} km/h."
    else:
        winding_factor = settings.PLAINS_SWITCHBACK_FACTOR
        avg_speed_kmh = settings.FALLBACK_SPEED_RURAL_KMH
        warning = None

    estimated_road_km = round(straight_line_km * winding_factor, 2)
    # Extra time for elevation climbs
    grade_penalty_mins = (elev_diff / 100.0) * 3.0 # +3 mins per 100m elevation gain
    duration_mins = max(1, round((estimated_road_km / avg_speed_kmh) * 60.0 + grade_penalty_mins))

    return {
        "straight_line_km": round(straight_line_km, 2),
        "estimated_driving_km": estimated_road_km,
        "estimated_driving_time_mins": duration_mins,
        "elevation_diff_m": elev_diff,
        "is_switchback_corridor": is_hill_country,
        "corridor_warning": warning,
        "routing_source": "terrain_fallback"
    }
