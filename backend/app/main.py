from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.api.v1.places import router as places_router
from backend.app.api.v1.loops import router as loops_router
from backend.app.api.v1.regions import router as regions_router
from backend.app.api.v1.contributions import router as contributions_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Offline-first, topography-aware travel discovery engine engineered specifically for Sri Lanka.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Routers
app.include_router(places_router, prefix=settings.API_V1_STR)
app.include_router(loops_router, prefix=settings.API_V1_STR)
app.include_router(regions_router, prefix=settings.API_V1_STR)
app.include_router(contributions_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8001, reload=True)
