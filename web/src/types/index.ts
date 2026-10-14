export type CategoryType = 
  | 'heritage'
  | 'nature'
  | 'tea_agriculture'
  | 'wildlife'
  | 'food_local'
  | 'coastal';

export type AccessType = 'car' | '4wd_only' | 'tuk_tuk_track' | 'tuk_tuk_only' | 'foot_trail' | 'hike_only';

export interface PricingTier {
  foreign_adult_lkr?: number;
  foreign_adult_usd?: number;
  saarc_adult_lkr?: number;
  local_adult_lkr?: number;
  child_concession?: string;
  notes?: string;
}

export interface DressCode {
  shoulders_covered: boolean;
  knees_covered: boolean;
  footwear_removed: boolean;
  headwear_removed: boolean;
  hot_pavement_warning: boolean;
  photo_rules?: string;
  notes?: string;
}

export interface BestTimeToVisit {
  recommended_window?: string;
  reason?: string;
  puja_times?: string[];
  avoid_hours?: string;
}

export interface PlaceImage {
  url: string;
  caption?: string;
  credit?: string;
}

export interface Place {
  id: string;
  name: string;
  slug?: string;
  local_names?: {
    en?: string;
    si?: string;
    ta?: string;
  };
  description?: string;
  category: CategoryType;
  sub_category: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  district: string;
  province: string;
  pricing: PricingTier;
  dress_code: DressCode;
  best_time_to_visit: BestTimeToVisit;
  access_feasibility: AccessType;
  parking_available: boolean;
  images: PlaceImage[];
  tags: string[];
  verified?: boolean;
  // Computed proximity metrics
  straight_line_distance_km?: number;
  estimated_driving_km?: number;
  estimated_driving_time_mins?: number;
  elevation_diff_m?: number;
  is_switchback_corridor?: boolean;
  corridor_warning?: string;
  routing_source?: string;
}

export interface LoopStop {
  place_id: string;
  order: number;
  name: string;
  recommended_duration_mins: number;
  transit_to_next_mins: number;
  tips?: string;
}

export interface ItineraryLoop {
  id: string;
  title: string;
  slug?: string;
  region_id: string;
  summary?: string;
  duration_category: 'half_day' | 'full_day';
  estimated_travel_time_mins: number;
  total_distance_km: number;
  stops: LoopStop[];
  corridor_tips?: string;
}

export interface Region {
  id: string;
  name: string;
  province: string;
  description?: string;
  center_lat: number;
  center_lng: number;
  bounding_box: {
    min_lat: number;
    max_lat: number;
    min_lng: number;
    max_lng: number;
  };
  offline_pack_size_mb: number;
  offline_pack_version: string;
  offline_pack_url?: string;
  emergency_contacts: Array<{ service: string; number: string }>;
}

export interface SequenceStop {
  stop_number: number;
  place_id: string;
  name: string;
  category: CategoryType;
  sub_category: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  district: string;
  leg_driving_km: number;
  leg_driving_time_mins: number;
  recommended_stay_mins: number;
  cumulative_driving_mins: number;
  cumulative_trip_mins: number;
  pricing: PricingTier;
  dress_code: DressCode;
  best_time_to_visit: BestTimeToVisit;
  access_feasibility: AccessType;
  corridor_warning?: string;
}

export interface VisitSequenceResult {
  start_location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  total_stops: number;
  total_distance_km: number;
  total_driving_time_mins: number;
  total_trip_duration_mins: number;
  stops: SequenceStop[];
  route_geometry: [number, number][]; // [[lng, lat], ...]
  corridor_summary: string;
}

export interface SequenceRequest {
  start_lat: number;
  start_lng: number;
  start_name?: string;
  max_stops?: number;
  category?: string;
  target_hours?: number;
}

export interface GeocodingResult {
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  type: string;
  source: 'database' | 'osm_nominatim';
}

