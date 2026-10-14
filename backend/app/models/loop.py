from sqlalchemy import Column, String, Float, Integer, JSON, DateTime
from datetime import datetime, timezone
import uuid
from backend.app.database import Base

class ItineraryLoop(Base):
    __tablename__ = "itinerary_loops"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True)
    region_id = Column(String(50), nullable=False, index=True)
    summary = Column(String, default="")
    
    # "half_day", "full_day", "multi_day"
    duration_category = Column(String(50), default="half_day")
    estimated_travel_time_mins = Column(Integer, default=120)
    total_distance_km = Column(Float, default=15.0)
    
    # Sequential stops along corridor to avoid mountain switchback backtracking
    # [{ "place_id": "...", "order": 1, "name": "...", "recommended_duration_mins": 90, "transit_to_next_mins": 20 }]
    stops = Column(JSON, default=list)
    
    # Tips for navigating this corridor
    corridor_tips = Column(String, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
