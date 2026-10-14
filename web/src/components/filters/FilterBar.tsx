'use client';

import React from 'react';
import { Sliders, Download, Plus, MapPin, ChevronDown, Flame, Sparkles } from 'lucide-react';
import { SRI_LANKA_REGIONS } from '@/data/regions_data';
import { HOT_TOPICS } from '@/data/hot_topics_data';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  radiusKm: number;
  onChangeRadius: (radius: number) => void;
  maxTravelTime: number | null;
  onChangeMaxTravelTime: (time: number | null) => void;
  selectedRegionId: string;
  onSelectRegion: (regId: string) => void;
  selectedHotTopicId?: string | null;
  onSelectHotTopic?: (topicId: string | null) => void;
  onOpenOfflinePacks: () => void;
  onOpenLoops: () => void;
  onOpenAddPlace: () => void;
  onOpenSequencer: () => void;
  onOpenTukTukFare?: () => void;
  placesCount: number;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'All Places', icon: '✨' },
  { id: 'heritage', label: 'Heritage & Sacred', icon: '🏛️' },
  { id: 'nature', label: 'Nature & Hiking', icon: '🌿' },
  { id: 'coastal', label: 'Beaches & Coast', icon: '🏖️' },
  { id: 'tea_agriculture', label: 'Tea & Estates', icon: '🍃' },
  { id: 'wildlife', label: 'Wildlife & Marine', icon: '🐘' },
  { id: 'food_local', label: 'Local Food', icon: '🍛' },
];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  radiusKm,
  onChangeRadius,
  maxTravelTime,
  onChangeMaxTravelTime,
  selectedRegionId,
  onSelectRegion,
  selectedHotTopicId,
  onSelectHotTopic,
  onOpenOfflinePacks,
  onOpenLoops,
  onOpenAddPlace,
  onOpenSequencer,
  onOpenTukTukFare,
  placesCount,
}: FilterBarProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-30 px-3 sm:px-4 py-2.5 shadow-sm space-y-2.5">
      {/* Top Bar Row 1: Brand, Comprehensive Region Dropdown & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Stats */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-center justify-center text-white font-black shadow-md text-xs">
            CW
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-emerald-950 tracking-tight leading-none">
              CeylonWander
            </h1>
            <span className="text-[10px] text-emerald-700 font-bold">
              Sri Lanka Database ({placesCount} places)
            </span>
          </div>
        </div>

        {/* Region Dropdown Selector Covering All 9 Provinces */}
        <div className="relative flex items-center flex-1 max-w-[340px] sm:max-w-[380px] min-w-[220px]">
          <div className="relative w-full flex items-center bg-emerald-50/50 hover:bg-white border border-emerald-300 hover:border-emerald-600 rounded-xl px-2.5 py-1.5 shadow-xs transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 focus-within:bg-white">
            <MapPin size={14} className="text-emerald-700 mr-1.5 shrink-0" />
            <select
              value={selectedRegionId}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-emerald-950 focus:outline-none cursor-pointer pr-6 appearance-none truncate"
              title="Select region across Sri Lanka"
            >
              {SRI_LANKA_REGIONS.map((group) => (
                <optgroup
                  key={group.province}
                  label={`${group.icon} ${group.province}`}
                  className="font-bold text-emerald-950 bg-emerald-100"
                >
                  {group.regions.map((reg) => (
                    <option
                      key={reg.id}
                      value={reg.id}
                      className="font-normal text-emerald-900 bg-white py-1"
                    >
                      {reg.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown size={13} className="text-emerald-600 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Right action shortcuts */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Tuk-Tuk Fare Calculator Button */}
          {onOpenTukTukFare && (
            <button
              onClick={onOpenTukTukFare}
              title="Calculate honest Tuk-Tuk and Taxi fares"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-xl text-xs font-black shadow-xs transition-colors"
            >
              <span>🛺</span>
              <span className="hidden sm:inline">Fair</span>
              <span>Fare</span>
            </button>
          )}

          {/* Trip Sequencer Button */}
          <button
            onClick={onOpenSequencer}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors ring-2 ring-emerald-500/30"
          >
            <span>🚩</span>
            <span className="hidden sm:inline">Sequence</span>
            <span>Route</span>
          </button>

          {/* + Add Place button */}
          <button
            onClick={onOpenAddPlace}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Place</span>
          </button>

          <button
            onClick={onOpenLoops}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
          >
            <span>🔄</span>
            <span className="hidden lg:inline">Loops</span>
          </button>

          <button
            onClick={onOpenOfflinePacks}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Download size={12} />
            <span className="hidden lg:inline">Offline</span>
          </button>
        </div>
      </div>

      {/* Row 2: Hot Topics / Trending Experiences as Clickables */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-xl shrink-0 shadow-xs">
          <Flame size={13} className="text-emerald-700 fill-emerald-600 animate-pulse" />
          <span>Hot Topics:</span>
        </div>

        {/* All Highlights Reset Button */}
        <button
          onClick={() => onSelectHotTopic?.(null)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
            !selectedHotTopicId
              ? 'bg-emerald-800 text-white shadow-xs ring-1 ring-emerald-500 font-bold'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
          }`}
        >
          <Sparkles size={11} className={!selectedHotTopicId ? 'text-emerald-200' : 'text-emerald-600'} />
          <span>All Highlights</span>
        </button>

        {/* Clickable Hot Topics Chips */}
        {HOT_TOPICS.map((topic) => {
          const isActive = selectedHotTopicId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onSelectHotTopic?.(isActive ? null : topic.id)}
              title={topic.description}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-sm ring-2 ring-emerald-400 font-bold scale-[1.02]'
                  : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 hover:border-emerald-400'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
              {isActive && (
                <span className="text-[9px] bg-black/20 text-white rounded-full px-1.5 py-0.2 font-black">
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Row 3: Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs font-bold ring-1 ring-emerald-500'
                : 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/90 border border-emerald-200/60'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Row 4: Search Radius & Travel Time Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-900 flex items-center gap-1 text-[11px]">
            <Sliders size={12} className="text-emerald-700" />
            Radius:
          </span>
          <div className="flex items-center gap-1">
            {[15, 30, 60, 100, 250].map((r) => (
              <button
                key={r}
                onClick={() => onChangeRadius(r)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  radiusKm === r
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                {r === 250 ? '250km (All)' : `${r}km`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-900 text-[11px]">Max Drive:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeMaxTravelTime(null)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                maxTravelTime === null
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              Any
            </button>
            <button
              onClick={() => onChangeMaxTravelTime(30)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                maxTravelTime === 30
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              &lt; 30m
            </button>
            <button
              onClick={() => onChangeMaxTravelTime(60)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                maxTravelTime === 60
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              &lt; 1h
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
