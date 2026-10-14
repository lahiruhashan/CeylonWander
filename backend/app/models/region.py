from sqlalchemy import Column, String, Float, Integer, JSON, DateTime
from datetime import datetime, timezone
from backend.app.database import Base

class Region(Base):
    __tablename__ = "regions"

    id = Column(String(50), primary_key=True) # e.g. "kandy-central", "ella-badulla", "nuwara-eliya"
    name = Column(String(100), nullable=False)
    province = Column(String(100), nullable=False)
    description = Column(String, default="")
    
    # Geographic center & bounding box
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    bounding_box = Column(JSON, default=dict) # { "min_lat": ..., "min_lng": ..., "max_lat": ..., "max_lng": ... }
    
    # Offline Bundle specifications (FR-4.1)
    offline_pack_size_mb = Column(Float, default=25.0)
    offline_pack_version = Column(String(20), default="1.0.0")
    offline_pack_url = Column(String(255), default="")
    total_places = Column(Integer, default=0)
    
    # Emergency local numbers (Police tourist division, mountain rescue, hospitals)
    emergency_contacts = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
