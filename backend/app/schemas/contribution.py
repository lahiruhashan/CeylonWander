from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class CommunityContributionBase(BaseModel):
    place_id: Optional[str] = None
    place_name: str
    contribution_type: str # "new_place", "condition_update", "pricing_update", "dress_code_update"
    details: Dict[str, Any] = Field(default_factory=dict)
    submitter_name: str = "Anonymous Wanderer"
    submitter_email: Optional[str] = None

class CommunityContributionCreate(CommunityContributionBase):
    pass

class CommunityContributionResponse(CommunityContributionBase):
    id: str
    status: str # "pending", "approved", "rejected"
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
