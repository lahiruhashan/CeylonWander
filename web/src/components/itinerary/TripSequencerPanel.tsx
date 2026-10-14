'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VisitSequenceResult, GeocodingResult } from '@/types';
import { fetchVisitSequence, searchGeocodingLocations } from '@/services/api';
import { 
  X, Navigation, Sparkles, RotateCw, Flag, Search, Hotel, MapPin, LocateFixed, Check, Loader2, ExternalLink
} from 'lucide-react';

interface TripSequencerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  startCoords: [number, number]; // [lng, lat]
  startName: string;
  onSelectPlaceById: (placeId: string) => void;
  onSequenceUpdated: (result: VisitSequenceResult | null) => void;
  onChangeStartPoint?: (coords: [number, number], name: string) => void;
}

const POPULAR_HOTEL_PRESETS: Array<{ name: string; display_name: string; coords: [number, number]; type: string }> = [
  {
    name: "Queen's Hotel",
    display_name: "Queen's Hotel, Kandy Lake, Central Province",
    coords: [80.6383, 7.2935],
    type: "hotel"
  },
  {
    name: "The Grand Hotel",
    display_name: "The Grand Hotel, Nuwara Eliya, Central Province",
    coords: [80.7654, 6.9682],
    type: "hotel"
  },
  {
    name: "Galle Fort Hotel",
    display_name: "Galle Fort Hotel, Church Street, Galle",
    coords: [80.2168, 6.0305],
    type: "hotel"
  },
  {
    name: "98 Acres Resort & Spa",
    display_name: "98 Acres Resort & Spa, Ella, Uva Province",
    coords: [81.0543, 6.8654],
    type: "hotel"
  },
  {
    name: "Heritance Kandalama",
    display_name: "Heritance Kandalama, Dambulla / Sigiriya corridor",
    coords: [80.7061, 7.8767],
    type: "hotel"
  },
  {
    name: "Cinnamon Grand Colombo",
    display_name: "Cinnamon Grand Colombo, Galle Road, Colombo",
    coords: [79.8485, 6.9181],
    type: "hotel"
  },
  {
    name: "Sigiriya Village Hotel",
    display_name: "Sigiriya Village Hotel, Sigiriya, Matale",
    coords: [80.7512, 7.9540],
    type: "hotel"
  }
];

export default function TripSequencerPanel({
  isOpen,
  onClose,
  startCoords,
  startName,
  onSelectPlaceById,
  onSequenceUpdated,
  onChangeStartPoint,
}: TripSequencerPanelProps) {
  const [maxStops, setMaxStops] = useState<number>(4);
  const [category, setCategory] = useState<string>('all');
  const [result, setResult] = useState<VisitSequenceResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Starting position search & dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const items = await searchGeocodingLocations(searchQuery);
        setSearchResults(items);
      } catch (err) {
        console.error('Error during geocoding search:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const calculateSequence = async (coords = startCoords, name = startName) => {
    setLoading(true);
    try {
      const res = await fetchVisitSequence({
        start_lat: coords[1],
        start_lng: coords[0],
        start_name: name,
        max_stops: maxStops,
        category: category === 'all' ? undefined : category,
      });
      setResult(res);
      onSequenceUpdated(res);
    } catch (err) {
      console.error('Error generating sequence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStartLocation = (coords: [number, number], name: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    onChangeStartPoint?.(coords, name);
    calculateSequence(coords, name);
  };

  const handleUseCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          handleSelectStartLocation(coords, 'My Current GPS Location');
        },
        () => {
          alert('Could not retrieve current GPS position. Please check location permissions.');
        }
      );
    }
  };

  const handleOpenInGoogleMaps = () => {
    if (!result || result.stops.length === 0) return;
    const origin = `${startCoords[1]},${startCoords[0]}`;
    const lastStop = result.stops[result.stops.length - 1];
    const destination = `${lastStop.latitude},${lastStop.longitude}`;
    const waypoints = result.stops
      .slice(0, -1)
      .map((s) => `${s.latitude},${s.longitude}`)
      .join('|');

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${
      waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
    }&travelmode=driving`;
    window.open(gmapsUrl, '_blank');
  };

  useEffect(() => {
    if (isOpen) {
      calculateSequence();
    } else {
      onSequenceUpdated(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startCoords[0], startCoords[1], maxStops, category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-white shadow-2xl border-l border-emerald-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 relative shrink-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-semibold uppercase tracking-wider mb-1">
          <Sparkles size={14} className="text-emerald-300" />
          <span>Topography Route Sequencer</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight">Visit Sequence Planner</h2>
        
        {/* Searchable Starting Position Dropdown */}
        <div className="mt-3 relative" ref={dropdownRef}>
          <label className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider mb-1 block">
            Starting Point (Hotel / Accommodation / Landmark)
          </label>

          <div 
            onClick={() => setIsDropdownOpen(true)}
            className="flex items-center justify-between gap-2 bg-emerald-900/90 hover:bg-emerald-900 border border-emerald-400/50 p-2.5 rounded-xl cursor-pointer shadow-inner transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Flag size={14} className="text-amber-400" />
              </div>
              <div className="min-w-0 flex-1 truncate">
                <span className="text-xs font-bold text-white truncate block">{startName}</span>
                <span className="text-[10px] text-emerald-300/80 block truncate">
                  {startCoords[1].toFixed(4)}°N, {startCoords[0].toFixed(4)}°E • Tap to search hotel
                </span>
              </div>
            </div>

            <button 
              type="button"
              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg border border-emerald-500/30 shrink-0 flex items-center gap-1"
            >
              <Search size={11} />
              <span>Change</span>
            </button>
          </div>

          {/* Interactive Search Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 text-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Search Input Bar */}
              <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type any hotel, guesthouse, or stay..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                {isSearching ? (
                  <Loader2 size={15} className="animate-spin text-emerald-600 shrink-0" />
                ) : searchQuery ? (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
                  >
                    <X size={13} />
                  </button>
                ) : null}
              </div>

              {/* Free Geocoding Badge Notice */}
              <div className="px-3 py-1.5 bg-emerald-50/70 border-b border-emerald-100/60 flex items-center justify-between text-[10px] text-emerald-800">
                <span className="flex items-center gap-1 font-semibold">
                  <span>🆓 Free OpenStreetMap Sri Lanka Search</span>
                </span>
                <span className="text-emerald-600 font-medium">Any Hotel / Stay</span>
              </div>

              {/* Quick Actions & Suggestions */}
              <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                {/* Device Location Option */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <LocateFixed size={13} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Use Current GPS Location</span>
                    <span className="text-[10px] text-gray-400 block">Start route from your live device position</span>
                  </div>
                </button>

                {/* Search Results (if typing) */}
                {searchQuery.trim().length >= 2 ? (
                  <div>
                    <div className="px-3.5 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.length === 0 && !isSearching ? (
                      <div className="p-4 text-center text-xs text-gray-500">
                        No locations found for &quot;{searchQuery}&quot;. Try typing the town name or hotel keyword.
                      </div>
                    ) : (
                      searchResults.map((item, idx) => (
                        <button
                          key={`${item.latitude}-${item.longitude}-${idx}`}
                          type="button"
                          onClick={() => handleSelectStartLocation([item.longitude, item.latitude], item.name)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 flex items-start gap-2.5 transition-colors group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                            {item.type === 'hotel' ? <Hotel size={13} /> : <MapPin size={13} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-900 truncate">{item.name}</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold bg-gray-100 text-gray-600 shrink-0">
                                {item.type}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 line-clamp-1 block">
                              {item.display_name}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  /* Popular Sri Lankan Hotel Presets */
                  <div>
                    <div className="px-3.5 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Popular Hotels & Stays</span>
                      <span className="text-[9px] text-gray-400 font-normal">Click to start here</span>
                    </div>

                    {POPULAR_HOTEL_PRESETS.map((preset) => {
                      const isCurrent = startName.toLowerCase().includes(preset.name.toLowerCase());
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleSelectStartLocation(preset.coords, preset.name)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 flex items-start gap-2.5 transition-colors group"
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isCurrent 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white'
                          }`}>
                            <Hotel size={13} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 truncate">{preset.name}</span>
                              {isCurrent && <Check size={13} className="text-emerald-600 shrink-0 ml-1" />}
                            </div>
                            <span className="text-[10px] text-gray-500 block truncate">
                              {preset.display_name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Sequencer Controls Bar */}
      <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-950">Stops:</span>
          <div className="flex items-center gap-1">
            {[2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setMaxStops(num)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  maxStops === num
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-1 rounded-lg border border-gray-200 bg-white text-[11px] font-semibold text-gray-700 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="heritage">Heritage Only</option>
            <option value="nature">Nature Only</option>
            <option value="tea_agriculture">Tea Only</option>
          </select>

          <button
            onClick={() => calculateSequence()}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700"
          >
            <RotateCw size={12} className={loading ? 'animate-spin text-emerald-600' : ''} />
            <span className="hidden sm:inline">Recalc</span>
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xs animate-pulse space-y-2">
            <Navigation className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="font-medium text-gray-600">Sequencing stops along mountain corridors...</p>
            <p className="text-[11px] text-gray-400">Minimizing switchback curves and calculating driving times</p>
          </div>
        ) : !result || result.stops.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No sequence could be calculated from this point. Try expanding the stop count.
          </div>
        ) : (
          <div className="relative pl-3 space-y-4">
            {/* Timeline Origin */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-md shrink-0 ring-4 ring-amber-100">
                🚩
              </div>
              <div className="pt-0.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Origin</span>
                <h4 className="text-xs font-bold text-gray-900">{startName}</h4>
                <p className="text-[11px] text-gray-500">Departure Point</p>
              </div>
            </div>

            {/* Stops */}
            {result.stops.map((stop) => (
              <React.Fragment key={stop.place_id}>
                {/* Connecting Transit Leg */}
                <div className="my-1 pl-3.5 border-l-2 border-dashed border-emerald-400 ml-3 py-1 text-[11px] text-gray-600">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Navigation size={11} className="text-emerald-700" />
                    <span className="font-bold">Drive: ~{stop.leg_driving_time_mins} mins</span>
                    <span className="text-emerald-600">({stop.leg_driving_km} km)</span>
                    {stop.corridor_warning && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] px-1 rounded font-medium">⛰️ switchback</span>
                    )}
                  </div>
                </div>

                {/* Stop Card */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center text-xs shadow-md shrink-0 ring-4 ring-emerald-100">
                    {stop.stop_number}
                  </div>

                  <div 
                    onClick={() => onSelectPlaceById(stop.place_id)}
                    className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                          Stop #{stop.stop_number} • {stop.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">{stop.name}</h4>
                        <span className="text-[11px] text-gray-500">{stop.district} • {stop.elevation_m}m ASL</span>
                      </div>
                      
                      <div className="text-right shrink-0 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        <span className="text-[10px] text-gray-400 block font-semibold">Stay</span>
                        <span className="text-xs font-bold text-gray-800">~{stop.recommended_stay_mins}m</span>
                      </div>
                    </div>

                    {/* Pricing & Etiquette preview */}
                    <div className="flex flex-wrap gap-2 text-[10px] pt-1 border-t border-gray-100">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                        {stop.pricing.foreign_adult_lkr ? `LKR ${stop.pricing.foreign_adult_lkr}` : 'Free'}
                      </span>
                      {stop.dress_code.shoulders_covered && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200/50">
                          Dress Code
                        </span>
                      )}
                      {stop.dress_code.hot_pavement_warning && (
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium">
                          🔥 Hot stone
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Footer Trip Metrics Summary */}
      {result && result.stops.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Total Distance</span>
              <span className="text-sm font-black text-gray-900">{result.total_distance_km} km</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Total Driving</span>
              <span className="text-sm font-black text-emerald-800">~{result.total_driving_time_mins}m</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Total Day Trip</span>
              <span className="text-sm font-black text-blue-900">
                {Math.floor(result.total_trip_duration_mins / 60)}h {result.total_trip_duration_mins % 60}m
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-600 text-center italic">
            {result.corridor_summary}
          </p>

          <button
            onClick={handleOpenInGoogleMaps}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <ExternalLink size={14} />
            <span>Open Turn-by-Turn in Google Maps</span>
          </button>
        </div>
      )}
    </div>
  );
}
