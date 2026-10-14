'use client';

import React, { useEffect, useState } from 'react';
import { Place } from '@/types';
import { fetchCorridorSuggestions } from '@/services/api';
import { 
  X, Clock, DollarSign, ShieldAlert, Car, 
  AlertTriangle, Navigation, Layers
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
  onOpenReport: (place: Place) => void;
  onStartSequence?: (place: Place) => void;
}

export default function PlaceDetailModal({
  place,
  onClose,
  onSelectPlace,
  onOpenReport,
  onStartSequence,
}: PlaceDetailModalProps) {
  const [corridorPlaces, setCorridorPlaces] = useState<Place[]>([]);
  const [loadingCorridor, setLoadingCorridor] = useState(false);

  const placeId = place?.id;

  useEffect(() => {
    if (!placeId) return;
    setLoadingCorridor(true);
    fetchCorridorSuggestions(placeId)
      .then((data) => setCorridorPlaces(data))
      .catch(() => setCorridorPlaces([]))
      .finally(() => setLoadingCorridor(false));
  }, [placeId]);

  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:max-w-2xl max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* Header / Hero */}
        <div className="relative bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold tracking-wider uppercase mb-1">
            <span>{place.district}</span>
            <span>•</span>
            <span>{place.province}</span>
            <span>•</span>
            <span>{place.elevation_m}m ASL</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">{place.name}</h2>
          
          {place.local_names && (
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-emerald-100 font-medium">
              {place.local_names.si && <span>සිංහල: {place.local_names.si}</span>}
              {place.local_names.ta && <span>தமிழ்: {place.local_names.ta}</span>}
            </div>
          )}

          {/* Travel Time & Topography Badge */}
          {place.estimated_driving_time_mins && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-100">
              <Navigation size={14} className="text-emerald-400" />
              <span>Drive: ~{place.estimated_driving_time_mins} mins ({place.estimated_driving_km} km)</span>
              <span className="text-gray-400">|</span>
              <span className="text-emerald-300">Direct: {place.straight_line_distance_km} km</span>
              {place.is_switchback_corridor && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Switchbacks
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-gray-100">
          {/* Corridor Warning Alert if present */}
          {place.corridor_warning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <span>{place.corridor_warning}</span>
            </div>
          )}

          {/* Description */}
          {place.description && (
            <div className="text-sm text-gray-700 leading-relaxed pt-2">
              {place.description}
            </div>
          )}

          {/* FR-2.2 Pricing Transparency Breakdown */}
          <div className="pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-3">
              <DollarSign size={16} className="text-emerald-600" />
              Dual-Pricing Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-2xl text-center">
                <span className="text-xs text-emerald-800 font-medium block">Foreign National</span>
                <span className="text-lg font-extrabold text-emerald-950 block mt-0.5">
                  {place.pricing.foreign_adult_lkr ? `LKR ${place.pricing.foreign_adult_lkr.toLocaleString()}` : 'Free'}
                </span>
                {place.pricing.foreign_adult_usd && (
                  <span className="text-xs text-emerald-700">~${place.pricing.foreign_adult_usd} USD</span>
                )}
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-2xl text-center">
                <span className="text-xs text-blue-800 font-medium block">SAARC Passport</span>
                <span className="text-lg font-extrabold text-blue-950 block mt-0.5">
                  {place.pricing.saarc_adult_lkr ? `LKR ${place.pricing.saarc_adult_lkr.toLocaleString()}` : 'Free'}
                </span>
                <span className="text-xs text-blue-600">ID Required</span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl text-center">
                <span className="text-xs text-amber-800 font-medium block">Sri Lankan Citizen</span>
                <span className="text-lg font-extrabold text-amber-950 block mt-0.5">
                  {place.pricing.local_adult_lkr ? `LKR ${place.pricing.local_adult_lkr.toLocaleString()}` : 'Free'}
                </span>
                <span className="text-xs text-amber-600">NIC Required</span>
              </div>
            </div>
            {place.pricing.notes && (
              <p className="text-xs text-gray-500 mt-2 italic">{place.pricing.notes}</p>
            )}
          </div>

          {/* FR-2.3 Cultural & Dress Etiquette Flags */}
          <div className="pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-3">
              <ShieldAlert size={16} className="text-amber-600" />
              Cultural & Dress Etiquette
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                place.dress_code.shoulders_covered 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900 font-medium' 
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                <span>{place.dress_code.shoulders_covered ? '⚠️' : '✓'}</span>
                <span>Shoulders covered</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                place.dress_code.knees_covered 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900 font-medium' 
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                <span>{place.dress_code.knees_covered ? '⚠️' : '✓'}</span>
                <span>Knees covered below joint</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                place.dress_code.footwear_removed 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900 font-medium' 
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                <span>{place.dress_code.footwear_removed ? '👞' : '👟'}</span>
                <span>Footwear removed at shrine</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                place.dress_code.hot_pavement_warning 
                  ? 'bg-red-50/60 border-red-200 text-red-900 font-medium' 
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                <span>{place.dress_code.hot_pavement_warning ? '🔥' : '☀️'}</span>
                <span>Hot granite pavement warning</span>
              </div>
            </div>

            {place.dress_code.photo_rules && (
              <div className="mt-2.5 p-3 bg-gray-50 rounded-xl text-xs text-gray-700 border border-gray-200/80">
                <span className="font-semibold text-gray-900">Photography Rules: </span>
                {place.dress_code.photo_rules}
              </div>
            )}
          </div>

          {/* FR-2.4 & FR-2.5 Visit Timing & Access Feasibility */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-2">
                <Clock size={16} className="text-blue-600" />
                Optimal Visit Window
              </h3>
              <p className="text-xs text-gray-800 font-semibold">
                {place.best_time_to_visit.recommended_window || 'Anytime during daylight'}
              </p>
              {place.best_time_to_visit.reason && (
                <p className="text-xs text-gray-600 mt-1">{place.best_time_to_visit.reason}</p>
              )}
              {place.best_time_to_visit.puja_times && place.best_time_to_visit.puja_times.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase py-0.5">Thevava Puja:</span>
                  {place.best_time_to_visit.puja_times.map((pt, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-blue-100/70 text-blue-800 rounded-md font-medium">
                      {pt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-2">
                <Car size={16} className="text-purple-600" />
                Access Feasibility
              </h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                {place.access_feasibility.replace('_', ' ')}
              </span>
              <p className="text-xs text-gray-600 mt-1.5">
                Parking: {place.parking_available ? 'Available on-site' : 'No dedicated parking; tuk-tuk dropoff advised'}
              </p>
            </div>
          </div>

          {/* FR-3.1 Sequential Stop Suggestions ("Smart Loops") */}
          <div className="pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-3">
              <Layers size={16} className="text-emerald-600" />
              Nearby Stops Along Same Corridor
            </h3>
            
            {loadingCorridor ? (
              <p className="text-xs text-gray-400">Loading corridor recommendations...</p>
            ) : corridorPlaces.length > 0 ? (
              <div className="space-y-2">
                {corridorPlaces.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectPlace(c)}
                    className="p-3 rounded-2xl border border-gray-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{c.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        ~{c.estimated_driving_time_mins} mins drive ({c.estimated_driving_km} km) along corridor
                      </p>
                    </div>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-100/70 px-2 py-1 rounded-lg">
                      View Stop →
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No direct micro-stops mapped yet.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenReport(place)}
            className="text-xs font-medium text-gray-600 hover:text-emerald-700 underline flex items-center gap-1"
          >
            <span>Flag Condition / Fee</span>
          </button>
          
          <div className="flex items-center gap-2">
            {onStartSequence && (
              <button
                onClick={() => {
                  onStartSequence(place);
                  onClose();
                }}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>🚩</span>
                <span>Plan Sequence from Here</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
