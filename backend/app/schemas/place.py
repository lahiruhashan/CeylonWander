from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, List, Any
from datetime import datetime

class LocalNames(BaseModel):
    en: Optional[str] = None
    si: Optional[str] = None
    ta: Optional[str] = None

class PricingTier(BaseModel):
    foreign_adult_lkr: Optional[int] = None
    foreign_adult_usd: Optional[float] = None
    saarc_adult_lkr: Optional[int] = None
    local_adult_lkr: Optional[int] = None
    child_concession: Optional[str] = None
    notes: Optional[str] = None

class DressCode(BaseModel):
    shoulders_covered: bool = False
    knees_covered: bool = False
    footwear_removed: bool = False
    headwear_removed: bool = False
    hot_pavement_warning: bool = False
    photo_rules: Optional[str] = None
    notes: Optional[str] = None

class BestTimeToVisit(BaseModel):
    recommended_window: Optional[str] = None
    reason: Optional[str] = None
    puja_times: List[str] = []
    avoid_hours: Optional[str] = None

class PlaceImage(BaseModel):
    url: str
    caption: Optional[str] = None
    credit: Optional[str] = None

class PlaceBase(BaseModel):
    name: str
    slug: Optional[str] = None
    local_names: Optional[Dict[str, str]] = Field(default_factory=dict)
    description: Optional[str] = ""
    category: str # heritage, nature, tea_agriculture, wildlife, food_local
    sub_category: str # temple, waterfall, viewpoint, etc.
    latitude: float
    longitude: float
    elevation_m: int = 0
    district: str = "Kandy"
    province: str = "Central Province"
    pricing: Optional[PricingTier] = Field(default_factory=PricingTier)
    dress_code: Optional[DressCode] = Field(default_factory=DressCode)
    best_time_to_visit: Optional[BestTimeToVisit] = Field(default_factory=BestTimeToVisit)
    access_feasibility: str = "car" # car, 4wd_only, tuk_tuk_track, foot_trail
    parking_available: bool = True
    images: List[PlaceImage] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    verified: bool = True

class PlaceCreate(PlaceBase):
    pass

class PlaceResponse(PlaceBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PlaceProximityResponse(PlaceResponse):
    straight_line_distance_km: float
    estimated_driving_km: float
    estimated_driving_time_mins: int
    elevation_diff_m: Optional[int] = None
    is_switchback_corridor: bool = False
    corridor_warning: Optional[str] = None
    routing_source: str = "topography_engine" # "osrm" or "terrain_fallback"
