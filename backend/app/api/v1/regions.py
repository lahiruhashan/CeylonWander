from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from backend.app.database import get_db
from backend.app.models.region import Region
from backend.app.schemas.region import RegionResponse
from backend.app.services.offline_pack import generate_offline_manifest

router = APIRouter(prefix="/regions", tags=["Regions & Offline Packs"])

@router.get("", response_model=List[RegionResponse])
async def list_regions(db: AsyncSession = Depends(get_db)):
    """FR-4.1: List available regional data packs (e.g. Kandy Hub, Ella-Badulla, Nuwara Eliya)."""
    result = await db.execute(select(Region))
    return result.scalars().all()

@router.get("/{region_id}", response_model=RegionResponse)
async def get_region(region_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Region).where(Region.id == region_id))
    region = result.scalar_one_or_none()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region

@router.get("/{region_id}/pack", response_model=Dict[str, Any])
async def download_offline_pack(region_id: str, db: AsyncSession = Depends(get_db)):
    """
    FR-4.1 & NFR-2:
    One-tap download of specific town packages containing vector map tiles/GeoJSON,
    structured POIs, emergency numbers, pricing, and etiquette flags.
    """
    try:
        return await generate_offline_manifest(db, region_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
