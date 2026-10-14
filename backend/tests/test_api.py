import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.database import engine, Base

@pytest.fixture(autouse=True, scope="session")
def setup_db():
    async def init():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(init())
    yield

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["app"] == "CeylonWander"

@pytest.mark.asyncio
async def test_places_nearby_kandy():
    """Verify proximity search from Kandy city center (7.2906, 80.6337)"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/places/nearby?lat=7.2906&lng=80.6337&radius_km=15")
        assert response.status_code == 200
        places = response.json()
        assert len(places) > 0
        
        # Verify first place has required travel metrics & structured metadata
        p = places[0]
        assert "straight_line_distance_km" in p
        assert "estimated_driving_km" in p
        assert "estimated_driving_time_mins" in p
        assert "pricing" in p
        assert "dress_code" in p
        assert "best_time_to_visit" in p
        assert "access_feasibility" in p

@pytest.mark.asyncio
async def test_dual_pricing_and_dress_code():
    """Verify Temple of the Tooth has explicit dual pricing and dress rules"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/places/temple-of-the-tooth")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)"
        
        pricing = data["pricing"]
        assert pricing["foreign_adult_lkr"] == 3000
        assert pricing["saarc_adult_lkr"] == 1500
        assert pricing["local_adult_lkr"] == 0
        
        dress = data["dress_code"]
        assert dress["shoulders_covered"] is True
        assert dress["knees_covered"] is True
        assert dress["footwear_removed"] is True
        assert dress["hot_pavement_warning"] is True

@pytest.mark.asyncio
async def test_smart_loops_corridor():
    """Verify smart loops and corridor sequential suggestions"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Get loops
        response = await client.get("/api/v1/loops")
        assert response.status_code == 200
        loops = response.json()
        assert len(loops) >= 2

        # Test sequential corridor suggestions from Royal Botanical Gardens
        corr_resp = await client.get("/api/v1/loops/corridor-suggestions?place_id=peradeniya-botanical-gardens")
        assert corr_resp.status_code == 200
        suggestions = corr_resp.json()
        assert len(suggestions) > 0
        # Gadaladeniya or Tea Museum should be recommended along corridor
        names = [s["slug"] for s in suggestions]
        assert "gadaladeniya-vihara" in names or "ceylon-tea-museum-hantana" in names

@pytest.mark.asyncio
async def test_offline_bundle_manifest():
    """Verify regional offline pack generator (FR-4.1, NFR-2)"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/regions/kandy-hub/pack")
        assert response.status_code == 200
        pack = response.json()
        assert pack["region_id"] == "kandy-hub"
        assert pack["size_mb"] < 40.0 # NFR-2
        assert "geojson" in pack
        assert "emergency_contacts" in pack
        assert len(pack["places"]) > 0

@pytest.mark.asyncio
async def test_community_contribution():
    """Verify community condition update submission and moderation queue (FR-5.1, FR-5.2)"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Submit a condition update
        payload = {
            "place_id": "hanthana-mountain-range",
            "place_name": "Hanthana Mountain Range",
            "contribution_type": "condition_update",
            "details": {
                "condition": "Trail slippery due to rain; leeches active",
                "severity": "warning"
            },
            "submitter_name": "Ella Trekker"
        }
        create_resp = await client.post("/api/v1/contributions", json=payload)
        assert create_resp.status_code == 201
        contrib = create_resp.json()
        assert contrib["status"] == "pending"
        cid = contrib["id"]

        # Moderate (approve)
        mod_resp = await client.patch(f"/api/v1/contributions/{cid}/status?status=approved")
        assert mod_resp.status_code == 200
        assert mod_resp.json()["status"] == "approved"

@pytest.mark.asyncio
async def test_search_geocoding_starting_point():
    """Verify free geocoding and starting point lookup for hotels and landmarks"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Search for database place
        response = await client.get("/api/v1/places/search-geocoding?q=Temple")
        assert response.status_code == 200
        items = response.json()
        assert len(items) > 0
        first = items[0]
        assert "name" in first
        assert "latitude" in first
        assert "longitude" in first
        assert "display_name" in first

