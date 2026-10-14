'use client';

import React, { useState } from 'react';
import { X, Sun, CloudRain } from 'lucide-react';

interface MonsoonRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTHS = [
  { num: 1, name: 'January', season: 'maha_transition' },
  { num: 2, name: 'February', season: 'dry_golden' },
  { num: 3, name: 'March', season: 'dry_golden' },
  { num: 4, name: 'April', season: 'inter_monsoon' },
  { num: 5, name: 'May', season: 'yala' },
  { num: 6, name: 'June', season: 'yala' },
  { num: 7, name: 'July', season: 'yala' },
  { num: 8, name: 'August', season: 'yala' },
  { num: 9, name: 'September', season: 'yala' },
  { num: 10, name: 'October', season: 'inter_monsoon' },
  { num: 11, name: 'November', season: 'maha' },
  { num: 12, name: 'December', season: 'maha' },
];

export default function MonsoonRadarModal({ isOpen, onClose }: MonsoonRadarModalProps) {
  // Default to current calendar month (0-indexed to 1-indexed)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  if (!isOpen) return null;

  const currentMonthData = MONTHS.find((m) => m.num === selectedMonth) || MONTHS[0];
  const season = currentMonthData.season;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
            <span>🇱🇰 Microclimate & Monsoon Compass</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Where is it Sunny Right Now?</span>
            <span className="text-lg">☀️</span>
          </h2>
          <p className="text-xs text-amber-100/90 mt-1 max-w-lg">
            Sri Lanka has two opposite monsoons. When the South coast is raining, the East coast is sunny and calm!
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* Month Selector Bar */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 block">
              Select Your Travel Month:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {MONTHS.map((m) => (
                <button
                  key={m.num}
                  onClick={() => setSelectedMonth(m.num)}
                  className={`py-2 px-1.5 rounded-xl text-center font-bold text-xs transition-all border ${
                    selectedMonth === m.num
                      ? 'bg-amber-500 text-amber-950 border-amber-600 shadow-sm font-black ring-2 ring-amber-400/40'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {m.name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Recommendation Card based on selected month */}
          {season === 'yala' ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Active Monsoon: Yala (South-West)
                </span>
                <span className="text-xs font-bold text-amber-800">{currentMonthData.name}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {/* Where to go */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                    <Sun size={15} className="text-amber-500 fill-amber-400" />
                    <span>GO HERE: East Coast & Cultural Triangle</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-700">
                    <li><strong>Arugam Bay:</strong> Peak world-class surfing season, right-hand point breaks.</li>
                    <li><strong>Trincomalee & Nilaveli:</strong> Calm turquoise sea, Pigeon Island snorkeling.</li>
                    <li><strong>Cultural Triangle:</strong> Sigiriya, Dambulla, Anuradhapura dry and warm.</li>
                  </ul>
                </div>

                {/* Where to avoid / take caution */}
                <div className="bg-white p-3.5 rounded-xl border border-red-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-red-800 font-black text-xs">
                    <CloudRain size={15} className="text-blue-500" />
                    <span>ROUGH SEAS: South & West Coasts</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-700">
                    <li><strong>Galle, Mirissa, Bentota:</strong> High monsoon swells, red warning flags on beaches.</li>
                    <li><strong>Whale watching:</strong> Closed in Mirissa due to choppy seas.</li>
                    <li>Expect frequent afternoon and evening rain bursts.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : season === 'maha' || season === 'maha_transition' ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-300 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded-md">
                  Active Monsoon: Maha (North-East)
                </span>
                <span className="text-xs font-bold text-blue-800">{currentMonthData.name}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {/* Where to go */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                    <Sun size={15} className="text-amber-500 fill-amber-400" />
                    <span>GO HERE: South & South-West Coasts</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-700">
                    <li><strong>Galle Fort, Weligama, Mirissa, Hiriketiya:</strong> Flat turquoise waters, sunny skies.</li>
                    <li><strong>Blue Whale Watching:</strong> Peak season out of Mirissa harbor.</li>
                    <li><strong>Beginner Surfing:</strong> Weligama sandy bottom bay is idyllic.</li>
                  </ul>
                </div>

                {/* Where to avoid / take caution */}
                <div className="bg-white p-3.5 rounded-xl border border-red-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-red-800 font-black text-xs">
                    <CloudRain size={15} className="text-blue-500" />
                    <span>WET SEASON: East & North Coasts</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-700">
                    <li><strong>Arugam Bay & Trincomalee:</strong> Monsoon rains, most surf camps and beach cafes closed.</li>
                    <li><strong>Jaffna:</strong> Occasional heavy north-easterly depressions.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : season === 'dry_golden' ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  🌟 Peak Golden Season (Nationwide Sunshine)
                </span>
                <span className="text-xs font-bold text-emerald-800">{currentMonthData.name}</span>
              </div>
              <p className="text-[11px] text-emerald-950 leading-relaxed">
                February and March are considered the finest travel months in Sri Lanka. 
                Both hill country trails and southern coastal waters enjoy prime, dry sunshine.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                  <strong>Adam&apos;s Peak (Sri Pada):</strong> Peak pilgrimage season; clear night climbs to watch the sacred triangular shadow at sunrise.
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                  <strong>Hill Country Hiking:</strong> Ella Rock and Horton Plains offer maximum visibility before afternoon clouds form.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300 p-4.5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Inter-Monsoon Transition
                </span>
                <span className="text-xs font-bold text-amber-800">{currentMonthData.name}</span>
              </div>
              <p className="text-[11px] text-amber-950 leading-relaxed">
                Warm and sunny mornings nationwide, followed by sudden localized afternoon convective thunderstorms. 
                Plan outdoor hikes and temple walks between <strong>6:30 AM and 1:00 PM</strong>.
              </p>
            </div>
          )}

          {/* Microclimate Golden Rules */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
              Essential Microclimate Rules for Hikers
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-[11px] text-gray-700">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <strong>Horton Plains (World&apos;s End):</strong> Arrive at the ticket counter by <strong>6:00 AM–6:30 AM</strong>. By 9:30 AM, a dense wall of white cloud consistently covers the 880m vertical cliff drop.
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <strong>Knuckles & Sinharaja:</strong> Bring leech socks during wet transitions; salt or lime paste stops leech bites on forest trails.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
