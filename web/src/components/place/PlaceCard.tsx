'use client';

import React from 'react';
import { Place } from '@/types';
import { Navigation, DollarSign, ShieldAlert, Mountain } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected: boolean;
  onSelect: (place: Place) => void;
  onStartSequence?: (place: Place) => void;
}

export default function PlaceCard({ place, isSelected, onSelect, onStartSequence }: PlaceCardProps) {
  return (
    <div
      onClick={() => onSelect(place)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
        isSelected
          ? 'bg-[#0a3322] border-emerald-400 shadow-xl shadow-black/40 ring-2 ring-emerald-400/30'
          : 'bg-[#0a2318]/70 border-white/10 hover:border-emerald-500/40 hover:bg-[#0d2e20] shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span className="bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
              {place.category.replace('_', ' ')}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 font-semibold">{place.district}</span>
          </div>
          <h3 className="text-sm font-bold text-white leading-snug">{place.name}</h3>
          {place.local_names?.si && (
            <p className="text-xs text-emerald-400/80 font-medium mt-0.5">{place.local_names.si}</p>
          )}
        </div>

        {/* Travel Time Badge (FR-1.3) */}
        {place.estimated_driving_time_mins !== undefined && (
          <div className="shrink-0 text-right bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-xl shadow-xs">
            <div className="text-xs font-extrabold text-emerald-300 flex items-center justify-end gap-1 font-mono">
              <Navigation size={12} className="text-emerald-400" />
              <span>~{place.estimated_driving_time_mins} min</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium block">
              {place.estimated_driving_km} km
            </span>
          </div>
        )}
      </div>

      {/* Hill Country Terrain Warning */}
      {place.is_switchback_corridor && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-xl border border-amber-500/30">
          <Mountain size={12} className="text-amber-400 shrink-0" />
          <span>Hill country switchback corridor road</span>
        </div>
      )}

      {/* Key Intel Tags: Dual pricing & Dress code */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px]">
        {/* Pricing badge */}
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-200 font-medium flex items-center gap-0.5">
          <DollarSign size={11} className="text-emerald-400" />
          <span>Foreign: {place.pricing?.foreign_adult_lkr ? `LKR ${place.pricing.foreign_adult_lkr}` : 'Free'}</span>
        </span>

        {/* Dress code badge */}
        {place.dress_code?.shoulders_covered && (
          <span className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-300 font-medium flex items-center gap-0.5">
            <ShieldAlert size={11} className="text-amber-400" />
            <span>Dress Etiquette</span>
          </span>
        )}

        {/* Access feasibility */}
        <span className="text-gray-600">•</span>
        <span className="text-gray-400 font-medium capitalize">{place.access_feasibility.replace('_', ' ')}</span>

        {onStartSequence && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartSequence(place);
            }}
            title="Start trip sequence from here"
            className="ml-auto text-[10px] text-emerald-300 hover:text-white font-bold bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-1"
          >
            <span>🚩</span>
            <span>Sequence</span>
          </button>
        )}
      </div>
    </div>
  );
}
