from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class RegionBase(BaseModel):
    id: str
    name: str
    province: str
    description: Optional[str] = ""
    center_lat: float
    center_lng: float
    bounding_box: Dict[str, float] = Field(default_factory=dict)
    offline_pack_size_mb: float = 25.0
    offline_pack_version: str = "1.0.0"
    offline_pack_url: Optional[str] = ""
    total_places: int = 0
    emergency_contacts: List[Dict[str, str]] = Field(default_factory=list)

class RegionCreate(RegionBase):
    pass

class RegionResponse(RegionBase):
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class OfflinePackManifest(BaseModel):
    region_id: str
    region_name: str
    version: str
    size_mb: float
    places_count: int
    download_url: str
    generated_at: datetime
    places: List[Any]
    emergency_contacts: List[Dict[str, str]]
