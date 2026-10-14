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
      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
          : 'bg-white border-emerald-100/90 hover:border-emerald-400 hover:shadow-sm hover:bg-emerald-50/20'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200/70">
              {place.category.replace('_', ' ')}
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{place.district}</span>
          </div>
          <h3 className="text-sm font-bold text-emerald-950 leading-snug">{place.name}</h3>
          {place.local_names?.si && (
            <p className="text-xs text-emerald-800/70 font-medium mt-0.5">{place.local_names.si}</p>
          )}
        </div>

        {/* Travel Time Badge (FR-1.3) */}
        {place.estimated_driving_time_mins !== undefined && (
          <div className="shrink-0 text-right bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-xl shadow-xs">
            <div className="text-xs font-extrabold text-emerald-950 flex items-center justify-end gap-1">
              <Navigation size={12} className="text-emerald-700" />
              <span>~{place.estimated_driving_time_mins} min</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold block">
              {place.estimated_driving_km} km
            </span>
          </div>
        )}
      </div>

      {/* Hill Country Terrain Warning */}
      {place.is_switchback_corridor && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
          <Mountain size={12} className="text-amber-600 shrink-0" />
          <span>Hill country switchback corridor road</span>
        </div>
      )}

      {/* Key Intel Tags: Dual pricing & Dress code */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-100/80 text-[11px]">
        {/* Pricing badge */}
        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/70 text-emerald-900 font-semibold flex items-center gap-0.5">
          <DollarSign size={11} className="text-emerald-700" />
          <span>Foreign: {place.pricing?.foreign_adult_lkr ? `LKR ${place.pricing.foreign_adult_lkr}` : 'Free'}</span>
        </span>

        {/* Dress code badge */}
        {place.dress_code?.shoulders_covered && (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-center gap-0.5">
            <ShieldAlert size={11} className="text-amber-700" />
            <span>Dress Etiquette</span>
          </span>
        )}

        {/* Access feasibility */}
        <span className="text-emerald-300">•</span>
        <span className="text-emerald-800 font-medium capitalize">{place.access_feasibility.replace('_', ' ')}</span>

        {onStartSequence && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartSequence(place);
            }}
            title="Start trip sequence from here"
            className="ml-auto text-[10px] text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>🚩</span>
            <span>Sequence</span>
          </button>
        )}
      </div>
    </div>
  );
}
