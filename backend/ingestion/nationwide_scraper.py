"""
CeylonWander Nationwide Destination Scraper & Ingestion Engine
Continuously scrapes, enriches, and ingests visit locations across Sri Lanka.
Can run as a one-shot ingestion job or as a background daemon process.
"""

import sys
import os
import time
import argparse
import asyncio
import logging
import math
import re
import urllib.parse
from typing import List, Dict, Any, Optional

import httpx
from sqlalchemy import select, func

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.database import AsyncSessionLocal, engine, Base
from backend.app.models.place import Place
from backend.app.models.region import Region
from backend.ingestion.nationwide_places_data import NATIONWIDE_PLACES, NATIONWIDE_REGIONS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("nationwide_scraper")

OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"
# Entire Sri Lanka Bounding Box (South, West, North, East)
SRI_LANKA_BBOX = "5.91,79.69,9.85,81.88"

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def detect_district_province(lat: float, lon: float) -> tuple[str, str]:
    """Determine Sri Lankan district and province from coordinates."""
    # North
    if lat >= 9.4:
        return "Jaffna", "Northern Province"
    elif lat >= 8.8 and lon < 80.2:
        return "Mannar", "Northern Province"
    elif lat >= 8.8:
        return "Kilinochchi", "Northern Province"
    # East
    elif lon >= 81.1 and lat >= 8.4:
        return "Trincomalee", "Eastern Province"
    elif lon >= 81.4 and lat >= 7.6:
        return "Batticaloa", "Eastern Province"
    elif lon >= 81.5:
        return "Ampara", "Eastern Province"
    # North Central
    elif lat >= 8.1 and lon < 80.7:
        return "Anuradhapura", "North Central Province"
    elif lat >= 7.8 and lon >= 80.8:
        return "Polonnaruwa", "North Central Province"
    # North Western
    elif lat >= 7.8 and lon < 80.0:
        return "Puttalam", "North Western Province"
    elif lat >= 7.3 and lon < 80.4:
        return "Kurunegala", "North Western Province"
    # Central
    elif lat >= 7.6 and lon >= 80.5:
        return "Matale", "Central Province"
    elif lat >= 7.1 and lon >= 80.5 and lon <= 80.8:
        return "Kandy", "Central Province"
    elif lat >= 6.8 and lon >= 80.5 and lon <= 80.9:
        return "Nuwara Eliya", "Central Province"
    # Uva
    elif lat >= 6.7 and lon > 80.9:
        return "Badulla", "Uva Province"
    elif lat >= 6.4 and lon > 81.0:
        return "Monaragala", "Uva Province"
    # Sabaragamuwa
    elif lat >= 7.0 and lon < 80.5:
        return "Kegalle", "Sabaragamuwa Province"
    elif lat >= 6.4 and lon < 80.8:
        return "Ratnapura", "Sabaragamuwa Province"
    # Western
    elif lat >= 7.0 and lon < 80.1:
        return "Gampaha", "Western Province"
    elif lat >= 6.8 and lon < 80.0:
        return "Colombo", "Western Province"
    elif lat >= 6.4 and lon < 80.2:
        return "Kalutara", "Western Province"
    # Southern
    elif lon < 80.3:
        return "Galle", "Southern Province"
    elif lon < 80.7:
        return "Matara", "Southern Province"
    else:
        return "Hambantota", "Southern Province"

def classify_tags(tags: Dict[str, str]) -> tuple[str, str]:
    tourism = tags.get("tourism", "")
    historic = tags.get("historic", "")
    natural = tags.get("natural", "")
    leisure = tags.get("leisure", "")
    amenity = tags.get("amenity", "")

    if amenity == "place_of_worship" or historic in ["temple", "archaeological_site", "ruins", "monument"]:
        return "heritage", historic or "temple"
    elif natural in ["waterfall", "peak", "beach"]:
        if natural == "beach":
            return "coastal", "beach"
        return "nature", natural
    elif tourism in ["viewpoint", "theme_park"]:
        return "nature", tourism
    elif tourism == "museum":
        return "heritage", "museum"
    elif leisure in ["park", "nature_reserve"]:
        return "nature", "park"
    elif "tea" in tags.get("name", "").lower():
        return "tea_agriculture", "plantation"
    else:
        return "heritage", "attraction"

def generate_cultural_pricing_metadata(name: str, category: str, sub_category: str) -> tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    name_lower = name.lower()
    is_temple = any(w in name_lower for w in ["temple", "vihara", "kovil", "stupa", "dagoba", "maligawa", "shrine", "devalaya"])
    
    # Dress code
    dress_code = {
        "shoulders_covered": is_temple,
        "knees_covered": is_temple,
        "footwear_removed": is_temple,
        "headwear_removed": is_temple,
        "hot_pavement_warning": is_temple,
        "photo_rules": "Respectful photography permitted in public areas." if not is_temple else "Remove footwear; never pose with your back turned directly to Buddha representations.",
        "notes": "Modest clothing recommended." if is_temple else "Comfortable walking wear."
    }

    # Pricing
    if is_temple:
        pricing = {
            "foreign_adult_lkr": 500,
            "foreign_adult_usd": 1.7,
            "saarc_adult_lkr": 500,
            "local_adult_lkr": 0,
            "notes": "Free for religious veneration or nominal preservation fee."
        }
    elif category == "nature" and sub_category in ["park", "marine"]:
        pricing = {
            "foreign_adult_lkr": 10500,
            "foreign_adult_usd": 35.0,
            "saarc_adult_lkr": 6000,
            "local_adult_lkr": 150,
            "notes": "Wildlife Conservation national park entrance ticket."
        }
    else:
        pricing = {
            "foreign_adult_lkr": 0,
            "foreign_adult_usd": 0.0,
            "saarc_adult_lkr": 0,
            "local_adult_lkr": 0,
            "notes": "Free public access."
        }

    # Best time to visit
    best_time = {
        "recommended_window": "7:30 AM - 10:30 AM or 4:00 PM - 6:00 PM",
        "reason": "Pleasant morning shade and soft directional lighting.",
        "puja_times": ["06:00 AM", "11:00 AM", "06:00 PM"] if is_temple else []
    }

    return pricing, dress_code, best_time

async def seed_master_dataset(session) -> int:
    """Load the 105+ verified nationwide places and regions into SQLite."""
    logger.info("📍 Seeding nationwide regions...")
    for r_data in NATIONWIDE_REGIONS:
        existing = await session.execute(select(Region).where(Region.id == r_data["id"]))
        if not existing.scalar_one_or_none():
            session.add(Region(**r_data))

    logger.info(f"🏛️ Seeding master dataset of {len(NATIONWIDE_PLACES)} nationwide places...")
    inserted_count = 0
    for p_data in NATIONWIDE_PLACES:
        res = await session.execute(select(Place).where((Place.id == p_data["id"]) | (Place.slug == p_data["slug"])))
        existing = res.scalar_one_or_none()
        if not existing:
            session.add(Place(**p_data))
            inserted_count += 1
        else:
            for k, v in p_data.items():
                setattr(existing, k, v)
    
    await session.commit()
    logger.info(f"✅ Master dataset loaded: {len(NATIONWIDE_PLACES)} verified locations available.")
    return inserted_count

async def scrape_overpass_places(session) -> int:
    """Scrape OpenStreetMap Overpass API for tourist attractions across Sri Lanka."""
    query = f"""
    [out:json][timeout:35];
    (
      node["tourism"~"attraction|viewpoint|museum"]({SRI_LANKA_BBOX});
      node["historic"~"monument|ruins|archaeological_site|temple"]({SRI_LANKA_BBOX});
      node["natural"~"waterfall|beach|peak"]({SRI_LANKA_BBOX});
    );
    out 80;
    """
    logger.info("📡 Connecting to OpenStreetMap Overpass API for Sri Lanka destinations...")
    new_places_added = 0
    headers = {"User-Agent": "CeylonWanderScraper/1.0 (https://ceylonwander.local)"}
    try:
        async with httpx.AsyncClient(timeout=45.0, headers=headers) as client:
            resp = await client.post(OVERPASS_API_URL, data={"data": query})
            if resp.status_code != 200:
                logger.warning(f"Overpass API returned status {resp.status_code}")
                return 0
            
            data = resp.json()
            elements = data.get("elements", [])
            logger.info(f"Retrieved {len(elements)} raw elements from Overpass.")

            # Load existing places to prevent duplicates
            existing_res = await session.execute(select(Place))
            existing_places = existing_res.scalars().all()

            for elem in elements:
                tags = elem.get("tags", {})
                name = tags.get("name") or tags.get("name:en")
                if not name or len(name.strip()) < 3:
                    continue
                name = name.strip()

                lat = float(elem.get("lat", 0))
                lon = float(elem.get("lon", 0))
                if lat == 0 or lon == 0:
                    continue

                # Check proximity duplicate (< 400 meters)
                duplicate = False
                for ep in existing_places:
                    if haversine_distance_m(lat, lon, ep.latitude, ep.longitude) < 400 or ep.name.lower() == name.lower():
                        duplicate = True
                        break
                if duplicate:
                    continue

                slug = slugify(name)
                place_id = f"osm-{elem.get('id', slug)}"
                cat, sub_cat = classify_tags(tags)
                district, province = detect_district_province(lat, lon)
                pricing, dress_code, best_time = generate_cultural_pricing_metadata(name, cat, sub_cat)

                place_record = Place(
                    id=place_id,
                    name=name,
                    slug=slug,
                    local_names={
                        "en": name,
                        "si": tags.get("name:si", name),
                        "ta": tags.get("name:ta", name)
                    },
                    description=tags.get("description") or f"Iconic {sub_cat.replace('_', ' ')} located in {district}, {province}.",
                    category=cat,
                    sub_category=sub_cat,
                    latitude=lat,
                    longitude=lon,
                    elevation_m=int(tags.get("ele", 50)),
                    district=district,
                    province=province,
                    pricing=pricing,
                    dress_code=dress_code,
                    best_time_to_visit=best_time,
                    access_feasibility="car",
                    parking_available=True,
                    images=[],
                    tags=["osm-scraped", cat, sub_cat, district.lower()],
                    verified=True
                )
                session.add(place_record)
                existing_places.append(place_record)
                new_places_added += 1

            if new_places_added > 0:
                await session.commit()
                logger.info(f"✨ Successfully ingested {new_places_added} newly discovered places into SQLite!")
            else:
                logger.info("ℹ️ All scraped elements are already present in the database.")

    except Exception as e:
        logger.warning(f"Overpass scraping encountered an issue (using existing dataset): {e}")

    return new_places_added

async def run_ingestion_pipeline(seed_first: bool = True, scrape_osm: bool = True):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        if seed_first:
            await seed_master_dataset(session)
        if scrape_osm:
            await scrape_overpass_places(session)
        
        # Count total places
        total_res = await session.execute(select(func.count(Place.id)))
        total_count = total_res.scalar()
        logger.info(f"📊 Total CeylonWander places in database: {total_count}")
        return total_count

async def main():
    parser = argparse.ArgumentParser(description="CeylonWander Nationwide Destination Scraper")
    parser.add_argument("--seed", action="store_true", default=True, help="Seed 105+ verified nationwide places")
    parser.add_argument("--scrape", action="store_true", default=True, help="Scrape live OpenStreetMap Overpass places")
    parser.add_argument("--daemon", action="store_true", help="Run continuously in background with interval")
    parser.add_argument("--interval", type=int, default=3600, help="Scraper cycle interval in seconds (default: 3600)")
    args = parser.parse_args()

    logger.info("🇱🇰 CeylonWander Nationwide Destination Engine starting...")
    
    if args.daemon:
        logger.info(f"🔄 Daemon mode active. Running every {args.interval} seconds in background.")
        while True:
            try:
                await run_ingestion_pipeline(seed_first=args.seed, scrape_osm=args.scrape)
            except Exception as e:
                logger.error(f"Error during daemon cycle: {e}")
            logger.info(f"💤 Sleeping for {args.interval}s until next ingestion cycle...")
            await asyncio.sleep(args.interval)
    else:
        await run_ingestion_pipeline(seed_first=args.seed, scrape_osm=args.scrape)

if __name__ == "__main__":
    asyncio.run(main())
