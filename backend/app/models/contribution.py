from sqlalchemy import Column, String, JSON, DateTime
from datetime import datetime, timezone
import uuid
from backend.app.database import Base

class CommunityContribution(Base):
    __tablename__ = "community_contributions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    place_id = Column(String(36), nullable=True, index=True)
    place_name = Column(String(200), nullable=False)
    
    # "new_place", "condition_update", "pricing_update", "dress_code_update"
    contribution_type = Column(String(50), nullable=False, index=True)
    
    # Payload details: e.g. { "condition": "Trail slippery due to rain", "counter_status": "Cash only today" }
    details = Column(JSON, default=dict)
    
    # "pending", "approved", "rejected"
    status = Column(String(20), default="pending", index=True)
    
    submitter_name = Column(String(100), default="Anonymous Wanderer")
    submitter_email = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
