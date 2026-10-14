'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface TukTukFareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VehicleType = 'tuktuk' | 'car' | 'van';
type TerrainType = 'flat' | 'hill';
type TimeOfDay = 'day' | 'night';

export default function TukTukFareModal({ isOpen, onClose }: TukTukFareModalProps) {
  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [vehicle, setVehicle] = useState<VehicleType>('tuktuk');
  const [terrain, setTerrain] = useState<TerrainType>('flat');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  if (!isOpen) return null;

  // Pricing Model (Updated for Sri Lanka current fuel & market rates)
  // Tuk-Tuk: ~100-120 LKR base 1st km, ~90-100 LKR per next km
  // Car: ~200-250 LKR base, ~130-150 LKR per next km
  // Van: ~350 LKR base, ~180-220 LKR per next km
  // Hill country add ~25-30% for steep incline switchbacks
  // Night (10pm-5am) add 15%
  const calculateFare = () => {
    let baseFare = 120;
    let perKm = 95;

    if (vehicle === 'car') {
      baseFare = 220;
      perKm = 140;
    } else if (vehicle === 'van') {
      baseFare = 350;
      perKm = 190;
    }

    const terrainMultiplier = terrain === 'hill' ? 1.3 : 1.0;
    const nightMultiplier = timeOfDay === 'night' ? 1.15 : 1.0;

    let total = baseFare;
    if (distanceKm > 1) {
      total += (distanceKm - 1) * perKm;
    }

    total = total * terrainMultiplier * nightMultiplier;

    const minFair = Math.round(total * 0.95 / 50) * 50;
    const maxFair = Math.round(total * 1.15 / 50) * 50;
    const usdMin = (minFair / 305).toFixed(2);
    const usdMax = (maxFair / 305).toFixed(2);

    return { minFair, maxFair, usdMin, usdMax };
  };

  const { minFair, maxFair, usdMin, usdMax } = calculateFare();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
            <span>🇱🇰 Sri Lanka Fair-Fare Estimator</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Tuk-Tuk & Taxi Price Meter</h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Know the honest local rate before negotiating. Avoid 3x tourist markups!
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-gray-800">
          {/* Distance Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Travel Distance (km)
              </label>
              <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {distanceKm} km
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-700 h-2 bg-gray-200 rounded-lg cursor-pointer"
            />

            {/* Quick preset buttons */}
            <div className="flex gap-1.5 mt-2">
              {[
                { label: 'Short Hop (2 km)', km: 2 },
                { label: 'Town Trip (5 km)', km: 5 },
                { label: 'Beach/Temple (10 km)', km: 10 },
                { label: 'Hill Pass (20 km)', km: 20 },
              ].map((p) => (
                <button
                  key={p.km}
                  onClick={() => setDistanceKm(p.km)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-colors ${
                    distanceKm === p.km
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type Selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
              Vehicle Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tuktuk', label: 'Tuk-Tuk', icon: '🛺', desc: 'Standard 3-wheeler' },
                { id: 'car', label: 'Mini Car / Taxi', icon: '🚗', desc: 'Alto / WagonR A/C' },
                { id: 'van', label: 'Van / Large', icon: '🚐', desc: 'Luggage / 4+ pax' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVehicle(v.id as VehicleType)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    vehicle === v.id
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl block mb-0.5">{v.icon}</span>
                  <span className="text-xs font-bold text-gray-900 block">{v.label}</span>
                  <span className="text-[10px] text-gray-500 block truncate">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terrain & Time Controls */}
          <div className="grid grid-cols-2 gap-3">
            {/* Terrain */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">
                Terrain / Incline
              </label>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setTerrain('flat')}
                  className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    terrain === 'flat'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🏙️ Flat / Coast
                </button>
                <button
                  onClick={() => setTerrain('hill')}
                  className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    terrain === 'hill'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  ⛰️ Hill Country
                </button>
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">
                Time of Day
              </label>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setTimeOfDay('day')}
                  className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    timeOfDay === 'day'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  ☀️ Day (6am-10pm)
                </button>
                <button
                  onClick={() => setTimeOfDay('night')}
                  className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    timeOfDay === 'night'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🌙 Night (+15%)
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-4 rounded-2xl shadow-lg border border-emerald-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Honest Local Price Range
              </span>
              <span className="text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200 font-semibold">
                Meter Standard
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                LKR {minFair.toLocaleString()} – {maxFair.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-emerald-200">
                (~${usdMin} – ${usdMax} USD)
              </span>
            </div>

            <p className="text-[11px] text-emerald-100/90 mt-2 leading-relaxed">
              {terrain === 'hill'
                ? 'Includes +30% incline fuel factor for steep mountain switchbacks (e.g. Nuwara Eliya, Ella, Kandy).'
                : 'Standard coastal and city meter benchmark based on current regulated fuel rates.'}
            </p>
          </div>

          {/* Quick Sri Lanka Negotiation Tips */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle size={15} className="text-amber-700 shrink-0" />
              <span>Sri Lanka Tuk-Tuk Survival Tips:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-900 leading-normal">
              <li>
                <strong>Always ask:</strong> <span className="font-mono bg-amber-100 px-1 rounded font-bold">&quot;Meter eka daanawadha?&quot;</span> (Will you turn on the meter?) before getting in.
              </li>
              <li>
                <strong>Outside train stations (Kandy, Ella):</strong> Drivers often demand 3x–4x. Walk 50 meters away from the exit to find metered tuk-tuks.
              </li>
              <li>
                <strong>In Colombo & Kandy:</strong> You can also check the local <strong>PickMe</strong> or <strong>Uber</strong> app for an exact metered baseline.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
