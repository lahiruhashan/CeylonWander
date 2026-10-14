'use client';

import React from 'react';
import Link from 'next/link';
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
  onOpenScenicTrain?: () => void;
  onOpenMonsoonRadar?: () => void;
  onOpenPoyaCalendar?: () => void;
  onOpenScamRadar?: () => void;
  onOpenMultiDayPlanner?: () => void;
  onOpenWildlifeSafari?: () => void;
  onOpenFoodDecoder?: () => void;
  onOpenConnectivity?: () => void;
  onOpenBudget?: () => void;
  onOpenSurfRadar?: () => void;
  onOpenSelfDrive?: () => void;
  onOpenChecklist?: () => void;
  onOpenHealthGuide?: () => void;
  onOpenHiddenGems?: () => void;
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
  onOpenScenicTrain,
  onOpenMonsoonRadar,
  onOpenPoyaCalendar,
  onOpenScamRadar,
  onOpenMultiDayPlanner,
  onOpenWildlifeSafari,
  onOpenFoodDecoder,
  onOpenConnectivity,
  onOpenBudget,
  onOpenSurfRadar,
  onOpenSelfDrive,
  onOpenChecklist,
  onOpenHealthGuide,
  onOpenHiddenGems,
  placesCount,
}: FilterBarProps) {
  return (
    <div className="bg-[#05140e]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 px-3 sm:px-4 py-2.5 shadow-xl space-y-2.5 text-white">
      {/* Top Bar Row 1: Brand, Comprehensive Region Dropdown & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Stats */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-[#032317] font-black shadow-md text-xs">
            CW
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-none font-serif">
              CeylonWander
            </h1>
            <span className="text-[10px] text-emerald-400 font-bold">
              Sri Lanka Database ({placesCount} places)
            </span>
          </div>
        </Link>

        {/* Global Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-xs font-semibold text-gray-300">
          <Link href="/" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Home</Link>
          <Link href="/itinerary" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Itineraries</Link>
          <Link href="/train" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Train</Link>
          <Link href="/wildlife" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Safaris</Link>
          <Link href="/culture" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Culture</Link>
          <Link href="/food" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Food</Link>
          <Link href="/toolkit" className="px-2 py-0.5 rounded-lg hover:text-white hover:bg-white/5 transition-all">Toolkit</Link>
        </nav>

        {/* Region Dropdown Selector Covering All 9 Provinces */}
        <div className="relative flex items-center flex-1 max-w-[320px] sm:max-w-[360px] min-w-[200px]">
          <div className="relative w-full flex items-center bg-[#0a2318] hover:bg-[#0f2e21] border border-white/15 hover:border-emerald-500/50 rounded-xl px-2.5 py-1.5 shadow-inner transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
            <MapPin size={14} className="text-emerald-400 mr-1.5 shrink-0" />
            <select
              value={selectedRegionId}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-6 appearance-none truncate"
              title="Select region across Sri Lanka"
            >
              {SRI_LANKA_REGIONS.map((group) => (
                <optgroup
                  key={group.province}
                  label={`${group.icon} ${group.province}`}
                  className="font-bold text-white bg-[#05140e]"
                >
                  {group.regions.map((reg) => (
                    <option
                      key={reg.id}
                      value={reg.id}
                      className="font-normal text-gray-200 bg-[#0a2318] py-1"
                    >
                      {reg.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown size={13} className="text-gray-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Right action shortcuts */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Tuk-Tuk Fare Calculator Button */}
          {onOpenTukTukFare && (
            <button
              onClick={onOpenTukTukFare}
              title="Calculate honest Tuk-Tuk and Taxi fares"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#1a0f02] rounded-xl text-xs font-black shadow-md transition-all hover:scale-105"
            >
              <span>🛺</span>
              <span className="hidden sm:inline">Fair</span>
              <span>Fare</span>
            </button>
          )}

          {/* Trip Sequencer Button */}
          <button
            onClick={onOpenSequencer}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-[#032317] rounded-xl text-xs font-black shadow-md transition-all hover:scale-105"
          >
            <span>🚩</span>
            <span className="hidden sm:inline">Sequence</span>
            <span>Route</span>
          </button>

          {/* Scenic Train Button */}
          {onOpenScenicTrain && (
            <button
              onClick={onOpenScenicTrain}
              title="Scenic Train (Kandy-Ella & Coastal) Guide"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <span>🚂</span>
              <span className="hidden xl:inline">Train</span>
            </button>
          )}

          {/* Monsoon Weather Button */}
          {onOpenMonsoonRadar && (
            <button
              onClick={onOpenMonsoonRadar}
              title="Where is it Sunny? Seasonal Monsoon Guide"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <span>☀️</span>
              <span className="hidden xl:inline">Weather</span>
            </button>
          )}

          {/* Poya Day Button */}
          {onOpenPoyaCalendar && (
            <button
              onClick={onOpenPoyaCalendar}
              title="Full Moon Poya & Sacred Holidays Guide"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <span>🌕</span>
              <span className="hidden xl:inline">Poya</span>
            </button>
          )}

          {/* Scam Radar Button */}
          {onOpenScamRadar && (
            <button
              onClick={onOpenScamRadar}
              title="Street-Smart Scam Radar & Sinhala Phrases"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <span>🛡️</span>
              <span className="hidden xl:inline">Scam Radar</span>
            </button>
          )}

          {/* + Add Place button */}
          <button
            onClick={onOpenAddPlace}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-bold transition-all"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Place</span>
          </button>

          <button
            onClick={onOpenLoops}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            <span>🔄</span>
            <span className="hidden lg:inline">Loops</span>
          </button>

          <button
            onClick={onOpenOfflinePacks}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            <Download size={12} />
            <span className="hidden lg:inline">Offline</span>
          </button>
        </div>
      </div>

      {/* Row 1.5: Overseas Traveler Toolkit Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-950/60 border border-emerald-500/20 px-2 py-1 rounded-lg shrink-0">
          Field Tools:
        </span>

        {onOpenMultiDayPlanner && (
          <button
            onClick={onOpenMultiDayPlanner}
            title="Multi-Day Itinerary Generator (3, 7, 10, 14 Days)"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-emerald-950 text-gray-200 hover:text-white border border-white/10 hover:border-emerald-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🗺️</span>
            <span>Itinerary</span>
          </button>
        )}

        {onOpenWildlifeSafari && (
          <button
            onClick={onOpenWildlifeSafari}
            title="National Park Wildlife & Safari Calendar"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-emerald-950 text-gray-200 hover:text-white border border-white/10 hover:border-emerald-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🐘</span>
            <span>Safaris</span>
          </button>
        )}

        {onOpenFoodDecoder && (
          <button
            onClick={onOpenFoodDecoder}
            title="Sri Lankan Food & Street Eatery Decoder"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-amber-950/50 text-gray-200 hover:text-white border border-white/10 hover:border-amber-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🍛</span>
            <span>Food Guide</span>
          </button>
        )}

        {onOpenBudget && (
          <button
            onClick={onOpenBudget}
            title="Travel Budget & Real-Cost Calculator"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-emerald-950 text-gray-200 hover:text-white border border-white/10 hover:border-emerald-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>💰</span>
            <span>Budget</span>
          </button>
        )}

        {onOpenSurfRadar && (
          <button
            onClick={onOpenSurfRadar}
            title="Surf Spot & Wave Season Navigator"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-sky-950/50 text-gray-200 hover:text-white border border-white/10 hover:border-sky-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🏄</span>
            <span>Surf Radar</span>
          </button>
        )}

        {onOpenHiddenGems && (
          <button
            onClick={onOpenHiddenGems}
            title="Hidden Gems & Off-The-Beaten-Path Directory"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-emerald-950 text-gray-200 hover:text-white border border-white/10 hover:border-emerald-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🎒</span>
            <span>Secret Gems</span>
          </button>
        )}

        {onOpenConnectivity && (
          <button
            onClick={onOpenConnectivity}
            title="Airport SIM, eSIM & Mountain Dead-Zones"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-blue-950/50 text-gray-200 hover:text-white border border-white/10 hover:border-blue-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>📶</span>
            <span>SIM / Data</span>
          </button>
        )}

        {onOpenSelfDrive && (
          <button
            onClick={onOpenSelfDrive}
            title="Self-Drive Tuk-Tuk & Car Rental Rules"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-amber-950/50 text-gray-200 hover:text-white border border-white/10 hover:border-amber-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🛺</span>
            <span>Self-Drive</span>
          </button>
        )}

        {onOpenChecklist && (
          <button
            onClick={onOpenChecklist}
            title="Dynamic Weather-Aware Packing Checklist"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-teal-950/50 text-gray-200 hover:text-white border border-white/10 hover:border-teal-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🧳</span>
            <span>Packing</span>
          </button>
        )}

        {onOpenHealthGuide && (
          <button
            onClick={onOpenHealthGuide}
            title="Health, Leech Protocol & 1990 Ambulance"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0a2318] hover:bg-rose-950/50 text-gray-200 hover:text-white border border-white/10 hover:border-rose-500/40 rounded-xl font-bold whitespace-nowrap transition-all shrink-0"
          >
            <span>🏥</span>
            <span>Health & 1990</span>
          </button>
        )}
      </div>

      {/* Row 2: Hot Topics / Trending Experiences as Clickables */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-xl shrink-0">
          <Flame size={13} className="text-amber-400 fill-amber-400 animate-pulse" />
          <span>Hot Topics:</span>
        </div>

        {/* All Highlights Reset Button */}
        <button
          onClick={() => onSelectHotTopic?.(null)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
            !selectedHotTopicId
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-[#032317] font-black shadow-md'
              : 'bg-[#0a2318] text-gray-300 hover:bg-[#0f2e21] border border-white/10'
          }`}
        >
          <Sparkles size={11} className={!selectedHotTopicId ? 'text-[#032317]' : 'text-emerald-400'} />
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
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-[#032317] font-black shadow-md scale-[1.02]'
                  : 'bg-[#0a2318] hover:bg-[#0f2e21] text-gray-300 border border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
              {isActive && (
                <span className="text-[9px] bg-black/30 text-white rounded-full px-1.5 py-0.2 font-black">
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
                ? 'bg-emerald-500 text-[#032317] font-black shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Row 4: Search Radius & Travel Time Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-300 flex items-center gap-1 text-[11px]">
            <Sliders size={12} className="text-emerald-400" />
            Radius:
          </span>
          <div className="flex items-center gap-1">
            {[15, 30, 60, 100, 250].map((r) => (
              <button
                key={r}
                onClick={() => onChangeRadius(r)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                  radiusKm === r
                    ? 'bg-emerald-500 text-[#032317] font-black shadow-xs'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {r === 250 ? '250km (All)' : `${r}km`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-300 text-[11px]">Max Drive:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeMaxTravelTime(null)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                maxTravelTime === null
                  ? 'bg-emerald-500 text-[#032317] font-black shadow-xs'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              Any
            </button>
            <button
              onClick={() => onChangeMaxTravelTime(30)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                maxTravelTime === 30
                  ? 'bg-emerald-500 text-[#032317] font-black shadow-xs'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              &lt; 30m
            </button>
            <button
              onClick={() => onChangeMaxTravelTime(60)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                maxTravelTime === 60
                  ? 'bg-emerald-500 text-[#032317] font-black shadow-xs'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
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
