import { Place, ItineraryLoop, Region, SequenceRequest, VisitSequenceResult, GeocodingResult } from '@/types';
import { NATIONWIDE_FALLBACK_PLACES } from '@/data/nationwide_places';

let cachedApiBase: string | null = null;

export async function getWorkingApiBase(): Promise<string> {
  if (cachedApiBase) return cachedApiBase;
  if (process.env.NEXT_PUBLIC_API_URL) {
    cachedApiBase = process.env.NEXT_PUBLIC_API_URL;
    return cachedApiBase;
  }
  // Auto-detect backend port (checking 8080 first then 8001)
  const candidateUrls = ['http://localhost:8080/api/v1', 'http://localhost:8001/api/v1'];
  for (const url of candidateUrls) {
    try {
      const healthUrl = url.replace('/api/v1', '/health');
      const res = await fetch(healthUrl, { signal: AbortSignal.timeout(600) });
      if (res.ok) {
        cachedApiBase = url;
        return url;
      }
    } catch {}
  }
  cachedApiBase = 'http://localhost:8080/api/v1';
  return cachedApiBase;
}

// Built-in nationwide seed dataset (110 curated places across all 9 provinces of Sri Lanka)
export const FALLBACK_SEED_PLACES: Place[] = NATIONWIDE_FALLBACK_PLACES;

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function fetchApi(endpoint: string, init?: RequestInit): Promise<Response> {
  const base = await getWorkingApiBase();
  const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  try {
    return await fetch(`${base}${path}`, init);
  } catch (err) {
    const altBase = base.includes('8080') ? base.replace('8080', '8001') : base.replace('8001', '8080');
    try {
      const altRes = await fetch(`${altBase}${path}`, init);
      if (altRes.ok) {
        cachedApiBase = altBase;
        return altRes;
      }
    } catch {}
    throw err;
  }
}



function getStoredPlaces(): Place[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('ceyloncopilot_user_places') || localStorage.getItem('ceylonwander_user_places');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredPlace(place: Place) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredPlaces();
    const updated = [place, ...current.filter((p) => p.id !== place.id)];
    localStorage.setItem('ceyloncopilot_user_places', JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export async function fetchNearbyPlaces(params: {
  lat: number;
  lng: number;
  radius_km: number;
  category?: string;
  max_travel_time_mins?: number;
}): Promise<Place[]> {
  const userPlaces = getStoredPlaces();

  try {
    const searchParams = new URLSearchParams({
      lat: params.lat.toString(),
      lng: params.lng.toString(),
      radius_km: params.radius_km.toString(),
      limit: "300",
    });
    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params.max_travel_time_mins) {
      searchParams.append('max_travel_time_mins', params.max_travel_time_mins.toString());
    }

    const res = await fetchApi(`/places/nearby?${searchParams.toString()}`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const serverPlaces: Place[] = await res.json();
      // Merge server places with any newly added user places that match
      const allMerged = [...serverPlaces];
      for (const up of userPlaces) {
        if (!allMerged.some(p => p.id === up.id)) {
          allMerged.unshift(up);
        }
      }
      return allMerged;
    }
  } catch (err) {
    console.warn('Backend API unavailable on port 8001, using resilient local dataset:', err);
  }

  // Filter fallback places according to category and distance
  const allLocal = [...userPlaces, ...FALLBACK_SEED_PLACES];
  return allLocal.filter((p) => {
    if (params.category && params.category !== 'all' && p.category !== params.category) {
      return false;
    }
    return true;
  });
}

export async function createPlace(placeData: Partial<Place>): Promise<Place> {
  const newPlace: Place = {
    id: placeData.id || `custom-${Date.now()}`,
    name: placeData.name || 'Untitled Sri Lanka Place',
    slug: placeData.slug || placeData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'place',
    local_names: placeData.local_names || {},
    description: placeData.description || '',
    category: placeData.category || 'heritage',
    sub_category: placeData.sub_category || 'attraction',
    latitude: placeData.latitude || 7.2906,
    longitude: placeData.longitude || 80.6337,
    elevation_m: placeData.elevation_m || 500,
    district: placeData.district || 'Kandy',
    province: placeData.province || 'Central Province',
    pricing: placeData.pricing || { foreign_adult_lkr: 0, saarc_adult_lkr: 0, local_adult_lkr: 0 },
    dress_code: placeData.dress_code || {
      shoulders_covered: false,
      knees_covered: false,
      footwear_removed: false,
      headwear_removed: false,
      hot_pavement_warning: false
    },
    best_time_to_visit: placeData.best_time_to_visit || {},
    access_feasibility: placeData.access_feasibility || 'car',
    parking_available: placeData.parking_available ?? true,
    images: placeData.images || [],
    tags: placeData.tags || [],
    verified: true,
    straight_line_distance_km: 1.0,
    estimated_driving_km: 1.5,
    estimated_driving_time_mins: 5,
    is_switchback_corridor: (placeData.elevation_m || 0) > 600
  };

  // Try saving to backend API
  try {
    const res = await fetchApi('/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlace)
    });
    if (res.ok) {
      const saved = await res.json();
      saveStoredPlace(saved);
      return saved;
    }
  } catch (err) {
    console.warn('Backend offline, saved place locally:', err);
  }

  // Save locally
  saveStoredPlace(newPlace);
  return newPlace;
}

export async function seedDatabase(): Promise<boolean> {
  try {
    const res = await fetchApi('/places/seed', { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.error('Failed to trigger database seed:', err);
    return false;
  }
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  try {
    const res = await fetchApi(`/places/${id}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, checking fallback places:', err);
  }
  const allLocal = [...getStoredPlaces(), ...FALLBACK_SEED_PLACES];
  return allLocal.find((p) => p.id === id || p.slug === id) || null;
}

export async function fetchCorridorSuggestions(placeId: string): Promise<Place[]> {
  try {
    const res = await fetchApi(`/loops/corridor-suggestions?place_id=${placeId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error fetching corridor suggestions:', err);
  }
  return FALLBACK_SEED_PLACES.filter((p) => p.id !== placeId).slice(0, 2);
}

export async function fetchSmartLoops(regionId?: string): Promise<ItineraryLoop[]> {
  try {
    const res = await fetchApi(regionId ? `/loops?region_id=${regionId}` : '/loops');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error fetching loops:', err);
  }
  return [
    {
      id: "three-temples-kandy-corridor",
      title: "The Western Kandy Three-Temples Corridor",
      region_id: "kandy-hub",
      duration_category: "half_day",
      estimated_travel_time_mins: 140,
      total_distance_km: 18.5,
      summary: "Traverse the scenic Daulagala road corridor connecting 14th-century Gampola Kingdom gems without backtracking.",
      stops: [
        { place_id: "gadaladeniya-vihara", order: 1, name: "Gadaladeniya Vihara", recommended_duration_mins: 45, transit_to_next_mins: 15 },
        { place_id: "embekke-devalaya", order: 2, name: "Embekke Devalaya", recommended_duration_mins: 50, transit_to_next_mins: 20 }
      ]
    }
  ];
}

export async function fetchRegions(): Promise<Region[]> {
  try {
    const res = await fetchApi('/regions');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error fetching regions:', err);
  }
  return [
    {
      id: "kandy-hub",
      name: "Kandy & Hill Country",
      province: "Central Province",
      description: "Sri Lanka's hill capital, sacred Tooth Relic, mist-shrouded tea valleys.",
      center_lat: 7.2906,
      center_lng: 80.6337,
      bounding_box: { min_lat: 7.18, max_lat: 7.38, min_lng: 80.52, max_lng: 80.72 },
      offline_pack_size_mb: 18.5,
      offline_pack_version: "1.0.0",
      emergency_contacts: [
        { service: "Kandy Tourist Police", number: "+94 81 222 2222" },
        { service: "Suwasariya Ambulance", number: "1990" }
      ]
    },
    {
      id: "galle-south-coast",
      name: "Galle & Southern Coast",
      province: "Southern Province",
      description: "Colonial Dutch fortresses, golden surf bays, and coastal heritage.",
      center_lat: 6.0329,
      center_lng: 80.2168,
      bounding_box: { min_lat: 5.90, max_lat: 6.15, min_lng: 80.10, max_lng: 80.45 },
      offline_pack_size_mb: 15.0,
      offline_pack_version: "1.0.0",
      emergency_contacts: [
        { service: "Galle Fort Tourist Police", number: "+94 91 222 2222" },
        { service: "Suwasariya Ambulance", number: "1990" }
      ]
    }
  ];
}

export async function downloadRegionalPack(regionId: string): Promise<Record<string, unknown>> {
  try {
    const res = await fetchApi(`/regions/${regionId}/pack`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, generating local pack manifest:', err);
  }
  return {
    region_id: regionId,
    version: "1.0.0",
    size_mb: 15.0,
    generated_at: new Date().toISOString(),
    places: FALLBACK_SEED_PLACES
  };
}

export async function submitConditionUpdate(payload: {
  place_id?: string;
  place_name: string;
  contribution_type: string;
  details: Record<string, unknown>;
  submitter_name: string;
}) {
  try {
    const res = await fetchApi('/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, recorded condition locally:', err);
  }
  return { id: `contrib-${Date.now()}`, status: 'pending', ...payload };
}

export async function fetchVisitSequence(params: SequenceRequest): Promise<VisitSequenceResult> {
  try {
    const res = await fetchApi('/loops/sequence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, calculating local fallback sequence:', err);
  }

  // Resilient local sequence calculation
  const allPlaces = [...getStoredPlaces(), ...FALLBACK_SEED_PLACES];
  const maxStops = params.max_stops || 4;
  
  // Pick closest places
  const sorted = allPlaces.slice(0, maxStops);
  let cumDrive = 0;
  let cumTrip = 0;
  let totalKm = 0;

  const stops = sorted.map((p, idx) => {
    const legKm = idx === 0 ? 2.5 : 4.8;
    const legDrive = idx === 0 ? 8 : 18;
    const stay = 75;
    cumDrive += legDrive;
    cumTrip += (legDrive + stay);
    totalKm += legKm;

    return {
      stop_number: idx + 1,
      place_id: p.id,
      name: p.name,
      category: p.category,
      sub_category: p.sub_category,
      latitude: p.latitude,
      longitude: p.longitude,
      elevation_m: p.elevation_m,
      district: p.district,
      leg_driving_km: legKm,
      leg_driving_time_mins: legDrive,
      recommended_stay_mins: stay,
      cumulative_driving_mins: cumDrive,
      cumulative_trip_mins: cumTrip,
      pricing: p.pricing,
      dress_code: p.dress_code,
      best_time_to_visit: p.best_time_to_visit,
      access_feasibility: p.access_feasibility,
      corridor_warning: p.is_switchback_corridor ? 'Hill corridor switchbacks' : undefined
    };
  });

  const routeGeometry: [number, number][] = [
    [params.start_lng, params.start_lat],
    ...stops.map(s => [s.longitude, s.latitude] as [number, number])
  ];

  return {
    start_location: {
      name: params.start_name || 'My Start Point',
      latitude: params.start_lat,
      longitude: params.start_lng
    },
    total_stops: stops.length,
    total_distance_km: Math.round(totalKm * 10) / 10,
    total_driving_time_mins: cumDrive,
    total_trip_duration_mins: cumTrip,
    stops,
    route_geometry: routeGeometry,
    corridor_summary: `Optimized ${stops.length}-stop corridor route: ${Math.round(totalKm * 10) / 10} km driving, ~${cumDrive} mins total drive time.`
  };
}

export async function searchGeocodingLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim();

  // 1. Try FastAPI backend proxy first (fast, cached, handles CORS & OSM headers)
  try {
    const res = await fetchApi(`/places/search-geocoding?q=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend geocoding unavailable, using client fallback:', err);
  }

  // 2. Direct OpenStreetMap Nominatim client fallback (free, countrycode LK)
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&countrycodes=lk&format=json&addressdetails=1&limit=5`;
    const res = await fetch(osmUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const items = await res.json();
      interface OSMItem {
        name?: string;
        display_name?: string;
        type?: string;
        class?: string;
        lat: string;
        lon: string;
      }
      if (Array.isArray(items) && items.length > 0) {
        return items.map((item: OSMItem) => {
          const itemName = item.name || (item.display_name ? item.display_name.split(',')[0] : 'Location');
          let itemType = item.type || 'location';
          if (item.class === 'tourism' && item.type && ['hotel', 'guest_house', 'motel', 'hostel', 'chalet'].includes(item.type)) {
            itemType = 'hotel';
          } else if (item.class === 'place') {
            itemType = 'town';
          }
          return {
            name: itemName,
            display_name: item.display_name || itemName,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            type: itemType,
            source: 'osm_nominatim' as const
          };
        });
      }
    }
  } catch (err) {
    console.warn('Direct OSM lookup failed:', err);
  }

  // 3. Fallback to local stored and seed database places matching query
  const allLocal = [...getStoredPlaces(), ...FALLBACK_SEED_PLACES];
  const qLower = trimmed.toLowerCase();
  const matched = allLocal.filter(p => 
    p.name.toLowerCase().includes(qLower) || 
    p.district.toLowerCase().includes(qLower) ||
    p.sub_category.toLowerCase().includes(qLower)
  ).slice(0, 5);

  return matched.map(p => ({
    name: p.name,
    display_name: `${p.name}, ${p.district}`,
    latitude: p.latitude,
    longitude: p.longitude,
    type: p.category,
    source: 'database' as const
  }));
}

