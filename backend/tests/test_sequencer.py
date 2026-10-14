import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_visit_sequence_from_kandy():
    """
    Test generating an optimized visit sequence starting from Kandy Lake (7.2906, 80.6337).
    Should return sequential stops with cumulative drive times and route geometry.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "start_lat": 7.2906,
            "start_lng": 80.6337,
            "start_name": "Kandy Lake Hotel",
            "max_stops": 4
        }
        resp = await client.post("/api/v1/loops/sequence", json=payload)
        assert resp.status_code == 200
        data = resp.json()

        assert data["total_stops"] >= 2
        assert data["total_distance_km"] > 0
        assert data["total_driving_time_mins"] > 0
        assert data["total_trip_duration_mins"] > data["total_driving_time_mins"]
        assert len(data["route_geometry"]) == len(data["stops"]) + 1 # includes start point
        assert len(data["corridor_summary"]) > 0

        # Verify stop numbering is sequential
        for idx, stop in enumerate(data["stops"], start=1):
            assert stop["stop_number"] == idx
            assert stop["leg_driving_km"] >= 0
            assert stop["leg_driving_time_mins"] >= 0
            assert stop["recommended_stay_mins"] > 0
            assert "pricing" in stop
            assert "dress_code" in stop

@pytest.mark.asyncio
async def test_visit_sequence_category_filter():
    """Verify sequence respects category filter (e.g. heritage only)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "start_lat": 7.2906,
            "start_lng": 80.6337,
            "start_name": "Kandy Railway Station",
            "max_stops": 3,
            "category": "heritage"
        }
        resp = await client.post("/api/v1/loops/sequence", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        for stop in data["stops"]:
            assert stop["category"] == "heritage"
