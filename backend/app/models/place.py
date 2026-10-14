from sqlalchemy import Column, String, Float, Integer, Boolean, JSON, DateTime
from datetime import datetime, timezone
import uuid
from backend.app.database import Base

class Place(Base):
    __tablename__ = "places"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True)
    
    # Multilingual: { "si": "දළදා මාළිගාව", "ta": "தலதா மாளிகை", "en": "Temple of the Sacred Tooth Relic" }
    local_names = Column(JSON, default=dict)
    description = Column(String, default="")
    
    # Taxonomy
    category = Column(String(50), nullable=False, index=True) # heritage, nature, tea_agriculture, wildlife, food_local
    sub_category = Column(String(50), nullable=False, index=True) # temple, waterfall, viewpoint, etc.
    
    # Spatial coordinates
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    elevation_m = Column(Integer, default=0) # Hill-country elevation
    
    district = Column(String(100), default="Kandy", index=True)
    province = Column(String(100), default="Central Province", index=True)
    
    # Practical intelligence: FR-2.2 Pricing Transparency
    # e.g. { "foreign_adult_lkr": 3000, "foreign_adult_usd": 10, "saarc_adult_lkr": 1500, "local_adult_lkr": 100, "notes": "Cash only at foreign counter" }
    pricing = Column(JSON, default=dict)
    
    # Cultural & Dress Etiquette: FR-2.3
    # e.g. { "shoulders_covered": true, "knees_covered": true, "footwear_removed": true, "headwear_removed": true, "hot_pavement_warning": true, "photo_rules": "No posing with back to Buddha" }
    dress_code = Column(JSON, default=dict)
    
    # Optimal Visit Window & Timing: FR-2.4
    # e.g. { "recommended_window": "6:30 AM - 9:00 AM", "reason": "Valley mist burns off", "puja_times": ["05:30", "09:30", "18:30"] }
    best_time_to_visit = Column(JSON, default=dict)
    
    # Access Feasibility: FR-2.5 (car, 4wd_only, tuk_tuk_track, foot_trail)
    access_feasibility = Column(String(50), default="car")
    parking_available = Column(Boolean, default=True)
    
    # Media & Community
    images = Column(JSON, default=list) # [{ "url": "...", "caption": "...", "credit": "Wikimedia Commons" }]
    tags = Column(JSON, default=list)
    verified = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
