from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.contribution import CommunityContribution
from backend.app.schemas.contribution import (
    CommunityContributionCreate, 
    CommunityContributionResponse
)

router = APIRouter(prefix="/contributions", tags=["Community & Contributions"])

@router.post("", response_model=CommunityContributionResponse, status_code=201)
async def submit_contribution(
    contribution_in: CommunityContributionCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    FR-5.1 & FR-5.2:
    Users can suggest unlisted hidden gems, report road condition changes (e.g. 'Trail slippery'),
    or update ticket counters. Submissions enter the review queue.
    """
    contribution = CommunityContribution(
        place_id=contribution_in.place_id,
        place_name=contribution_in.place_name,
        contribution_type=contribution_in.contribution_type,
        details=contribution_in.details,
        submitter_name=contribution_in.submitter_name,
        submitter_email=contribution_in.submitter_email,
        status="pending"
    )
    db.add(contribution)
    await db.commit()
    await db.refresh(contribution)
    return contribution

@router.get("", response_model=List[CommunityContributionResponse])
async def list_contributions(
    status: Optional[str] = Query(None, description="Filter by status: pending, approved, rejected"),
    place_id: Optional[str] = Query(None, description="Filter by place ID"),
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List community contributions for administrative review or active condition chips."""
    query = select(CommunityContribution)
    if status:
        query = query.where(CommunityContribution.status == status)
    if place_id:
        query = query.where(CommunityContribution.place_id == place_id)
    query = query.order_by(CommunityContribution.created_at.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/{contribution_id}/status", response_model=CommunityContributionResponse)
async def update_contribution_status(
    contribution_id: str,
    status: str = Query(..., pattern="^(approved|rejected|pending)$"),
    db: AsyncSession = Depends(get_db)
):
    """Moderate a community submission (approve/reject)."""
    result = await db.execute(select(CommunityContribution).where(CommunityContribution.id == contribution_id))
    contribution = result.scalar_one_or_none()
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    contribution.status = status
    await db.commit()
    await db.refresh(contribution)
    return contribution
