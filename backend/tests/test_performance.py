import time
import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_spatial_query_latency():
    """
    NFR-1: Spatial queries must respond in < 150 ms.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Warmup
        await client.get("/api/v1/places/nearby?lat=7.2906&lng=80.6337&radius_km=25")

        latencies = []
        for _ in range(20):
            t0 = time.perf_counter()
            resp = await client.get("/api/v1/places/nearby?lat=7.2906&lng=80.6337&radius_km=25")
            dt_ms = (time.perf_counter() - t0) * 1000.0
            assert resp.status_code == 200
            latencies.append(dt_ms)

        avg_latency = sum(latencies) / len(latencies)
        p95_latency = sorted(latencies)[int(len(latencies) * 0.95)]
        print(f"\n⚡ Spatial Proximity Latency: Avg={avg_latency:.2f}ms, P95={p95_latency:.2f}ms")
        assert p95_latency < 150.0, f"P95 latency was {p95_latency}ms, exceeding 150ms limit"
