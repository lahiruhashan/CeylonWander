from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class LoopStop(BaseModel):
    place_id: str
    order: int
    name: str
    recommended_duration_mins: int = 60
    transit_to_next_mins: int = 15
    tips: Optional[str] = None

class ItineraryLoopBase(BaseModel):
    title: str
    slug: Optional[str] = None
    region_id: str
    summary: Optional[str] = ""
    duration_category: str = "half_day" # half_day, full_day
    estimated_travel_time_mins: int = 120
    total_distance_km: float = 15.0
    stops: List[LoopStop] = Field(default_factory=list)
    corridor_tips: Optional[str] = ""

class ItineraryLoopCreate(ItineraryLoopBase):
    pass

class ItineraryLoopResponse(ItineraryLoopBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class VisitSequenceRequest(BaseModel):
    start_lat: float
    start_lng: float
    start_name: Optional[str] = "My Starting Location"
    max_stops: int = Field(default=4, ge=2, le=8)
    category: Optional[str] = None
    target_hours: Optional[float] = None # e.g. 4.0 or 8.0

class SequenceStopItem(BaseModel):
    stop_number: int
    place_id: str
    name: str
    category: str
    sub_category: str
    latitude: float
    longitude: float
    elevation_m: int
    district: str
    leg_driving_km: float
    leg_driving_time_mins: int
    recommended_stay_mins: int
    cumulative_driving_mins: int
    cumulative_trip_mins: int
    pricing: Dict[str, Any] = Field(default_factory=dict)
    dress_code: Dict[str, Any] = Field(default_factory=dict)
    best_time_to_visit: Dict[str, Any] = Field(default_factory=dict)
    access_feasibility: str = "car"
    corridor_warning: Optional[str] = None

class VisitSequenceResponse(BaseModel):
    start_location: Dict[str, Any]
    total_stops: int
    total_distance_km: float
    total_driving_time_mins: int
    total_trip_duration_mins: int
    stops: List[SequenceStopItem]
    route_geometry: List[List[float]] # [[lng, lat], ...] for map polyline
    corridor_summary: str
