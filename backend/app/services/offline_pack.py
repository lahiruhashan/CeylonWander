from typing import Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.place import Place
from backend.app.models.region import Region
from datetime import datetime, timezone
import json

async def generate_offline_manifest(db: AsyncSession, region_id: str) -> Dict[str, Any]:
    """
    Generates an offline regional data bundle manifest (FR-4.1, NFR-2).
    Includes POIs, structured pricing, etiquette, emergency contacts,
    and GeoJSON features for offline vector map rendering.
    """
    reg_result = await db.execute(select(Region).where(Region.id == region_id))
    region = reg_result.scalar_one_or_none()
    if not region:
        raise ValueError(f"Region {region_id} not found")

    bbox = region.bounding_box or {}
    min_lat = bbox.get("min_lat", region.center_lat - 0.3)
    max_lat = bbox.get("max_lat", region.center_lat + 0.3)
    min_lng = bbox.get("min_lng", region.center_lng - 0.3)
    max_lng = bbox.get("max_lng", region.center_lng + 0.3)

    query = select(Place).where(
        Place.latitude.between(min_lat, max_lat),
        Place.longitude.between(min_lng, max_lng)
    )
    places_result = await db.execute(query)
    places = places_result.scalars().all()

    # Build GeoJSON feature collection
    geojson_features = []
    place_summaries = []

    for p in places:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [p.longitude, p.latitude]
            },
            "properties": {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "sub_category": p.sub_category,
                "elevation_m": p.elevation_m,
                "pricing": p.pricing,
                "dress_code": p.dress_code,
                "best_time_to_visit": p.best_time_to_visit,
                "access_feasibility": p.access_feasibility
            }
        }
        geojson_features.append(feature)
        place_summaries.append({
            "id": p.id,
            "name": p.name,
            "local_names": p.local_names,
            "category": p.category,
            "sub_category": p.sub_category,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "elevation_m": p.elevation_m,
            "pricing": p.pricing,
            "dress_code": p.dress_code,
            "best_time_to_visit": p.best_time_to_visit,
            "access_feasibility": p.access_feasibility,
            "description": p.description,
            "images": p.images
        })

    geojson = {
        "type": "FeatureCollection",
        "features": geojson_features
    }

    manifest = {
        "region_id": region.id,
        "region_name": region.name,
        "province": region.province,
        "version": region.offline_pack_version,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_places": len(place_summaries),
        "emergency_contacts": region.emergency_contacts or [
            {"service": "Tourist Police (Sri Lanka)", "number": "1912"},
            {"service": "General Emergency / Police", "number": "119"},
            {"service": "Suwasariya Ambulance", "number": "1990"}
        ],
        "geojson": geojson,
        "places": place_summaries
    }

    raw_json = json.dumps(manifest)
    size_mb = round(len(raw_json.encode('utf-8')) / (1024 * 1024), 3)
    manifest["size_mb"] = max(0.1, size_mb)
    return manifest
