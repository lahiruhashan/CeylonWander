import httpx
import json
from typing import List, Dict, Any

OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"

# Central Province Bounding Box (South, West, North, East)
CENTRAL_PROVINCE_BBOX = "6.75,80.45,8.10,81.15"

def build_central_province_query(bbox: str = CENTRAL_PROVINCE_BBOX) -> str:
    """
    Overpass QL query targeting:
    - tourism=attraction|viewpoint|museum|theme_park
    - historic=monument|ruins|archaeological_site|temple
    - leisure=park|nature_reserve
    """
    return f"""
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|viewpoint|museum|theme_park"]({bbox});
      node["historic"~"monument|ruins|archaeological_site|temple"]({bbox});
      node["leisure"~"park|nature_reserve"]({bbox});
      way["tourism"~"attraction|viewpoint|museum"]({bbox});
      way["historic"~"ruins|archaeological_site|temple"]({bbox});
    );
    out center;
    """

async def fetch_osm_places(bbox: str = CENTRAL_PROVINCE_BBOX) -> List[Dict[str, Any]]:
    """Fetch nodes/ways from OpenStreetMap Overpass API for Sri Lanka."""
    query = build_central_province_query(bbox)
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(OVERPASS_API_URL, data={"data": query})
        resp.raise_for_status()
        data = resp.json()
        elements = data.get("elements", [])
        print(f"Retrieved {len(elements)} elements from Overpass OSM")
        return elements

if __name__ == "__main__":
    import asyncio
    asyncio.run(fetch_osm_places())
