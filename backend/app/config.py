from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "CeylonCopilot"
    API_V1_STR: str = "/api/v1"
    
    # Database config: default to SQLite aiosqlite for zero-setup local dev/tests, or Postgres+PostGIS
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite+aiosqlite:///./ceyloncopilot.db"
    )
    
    # OSRM Routing URL for true travel time
    OSRM_ROUTING_URL: str = os.getenv(
        "OSRM_ROUTING_URL", 
        "https://router.project-osrm.org"
    )
    
    # CORS Origins
    CORS_ORIGINS: List[str] = ["*"]
    
    # Speed assumptions (km/h) for fallback travel time calculation in Sri Lanka topography
    FALLBACK_SPEED_HIGHWAY_KMH: float = 65.0
    FALLBACK_SPEED_RURAL_KMH: float = 35.0
    FALLBACK_SPEED_HILL_COUNTRY_KMH: float = 22.0
    # Mountain switchback winding factor (actual road km vs straight-line distance)
    HILL_COUNTRY_SWITCHBACK_FACTOR: float = 1.95
    PLAINS_SWITCHBACK_FACTOR: float = 1.35
    
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
