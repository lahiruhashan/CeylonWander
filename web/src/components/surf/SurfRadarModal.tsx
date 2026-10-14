'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles } from 'lucide-react';

interface SurfRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SurfCoast = 'south' | 'east';

interface SurfSpot {
  name: string;
  location: string;
  skillLevel: 'Beginner Friendly' | 'Intermediate' | 'Advanced Reef';
  waveType: string;
  bottom: string;
  season: string;
  rentalCost: string;
  insiderTip: string;
}

const SURF_SPOTS: Record<SurfCoast, SurfSpot[]> = {
  south: [
    {
      name: 'Weligama Beach Break',
      location: 'South Coast (near Galle & Mirissa)',
      skillLevel: 'Beginner Friendly',
      waveType: 'Mellow sandy rolling peelers, 2–4ft',
      bottom: '100% Soft Sand (Zero reef hazards)',
      season: 'November to April (Peak Dec – March)',
      rentalCost: 'LKR 500 – 800/hr ($1.80 – $2.50)',
      insiderTip: 'The ultimate beginner spot in Asia. Over 40 surf schools along the beach. Paddle out during sunrise (6:30 AM) for glassy water before afternoon sea breezes pick up.'
    },
    {
      name: 'Hiriketiya Horseshoe Bay',
      location: 'South Coast (Dickwella)',
      skillLevel: 'Intermediate',
      waveType: 'Left-hand point break & beach break, 3–6ft',
      bottom: 'Reef point with sandy inner bay',
      season: 'November to April',
      rentalCost: 'LKR 800 – 1,000/hr',
      insiderTip: 'A picturesque horseshoe cove surrounded by palm trees. The left point breaks fast over reef, while the middle bay offers gentle reforms for intermediates.'
    },
    {
      name: 'Midigama (Rams Right & Lazy Left)',
      location: 'South Coast (between Ahangama & Weligama)',
      skillLevel: 'Advanced Reef',
      waveType: 'Shallow barrelling right & long peeling left',
      bottom: 'Sharp coral & sea urchin reef',
      season: 'November to April',
      rentalCost: 'LKR 600 – 900/hr',
      insiderTip: 'Rams Right is for experienced tube riders only: breaks in 3 feet of water over live coral. Wear reef booties to protect against sea urchins.'
    },
    {
      name: 'Mirissa Point',
      location: 'Mirissa Bay headland',
      skillLevel: 'Intermediate',
      waveType: 'Clean right-hand reef point break, 3–5ft',
      bottom: 'Reef and boulders',
      season: 'November to April',
      rentalCost: 'LKR 700 – 900/hr',
      insiderTip: 'Gorgeous sunset session spot. Watch out for shallow urchin clusters at low tide near the harbor rock wall.'
    }
  ],
  east: [
    {
      name: 'Arugam Bay Main Point',
      location: 'East Coast (Pottuvil)',
      skillLevel: 'Intermediate',
      waveType: 'World-famous mechanical right-hand sand point, 4–8ft',
      bottom: 'Sand & cobblestone reef',
      season: 'May to October (Peak July & August)',
      rentalCost: 'LKR 800 – 1,200/hr',
      insiderTip: 'World Surf League (WSL) qualifying spot. Rides can extend up to 400 meters all the way into the bay on good south swell days.'
    },
    {
      name: 'Whiskey Point',
      location: 'East Coast (North of Arugam Bay)',
      skillLevel: 'Beginner Friendly',
      waveType: 'Peeling right point off rock headland, 3–5ft',
      bottom: 'Pure sand bank',
      season: 'May to October',
      rentalCost: 'LKR 700 – 1,000/hr',
      insiderTip: 'Mellow, forgiving rights. Easy paddle out through the rip alongside the big granite rock.'
    },
    {
      name: 'Peanut Farm',
      location: 'East Coast (South of Arugam Bay)',
      skillLevel: 'Intermediate',
      waveType: 'Two section right: fast outer point into sandy inner bay',
      bottom: 'Sand & scattered boulders',
      season: 'May to October',
      rentalCost: 'LKR 800 – 1,000/hr',
      insiderTip: 'Accessible via a 20-minute dirt track tuk-tuk ride through jungle. Keep an eye out for wild elephants and peacocks along the path.'
    },
    {
      name: 'Elephant Rock',
      location: 'East Coast (South of Arugam Bay)',
      skillLevel: 'Beginner Friendly',
      waveType: 'Gentle wrapping rights around a scenic cliff',
      bottom: 'Sand bank',
      season: 'May to October',
      rentalCost: 'Bring your own board or hire from tuk-tuk',
      insiderTip: 'Climb Elephant Rock after surfing for an iconic sunset panorama across the wild coastal lagoon.'
    }
  ]
};

export default function SurfRadarModal({ isOpen, onClose }: SurfRadarModalProps) {
  const [coast, setCoast] = useState<SurfCoast>('south');

  if (!isOpen) return null;

  const spots = SURF_SPOTS[coast];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-cyan-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">
            <span>🏄 Endless Summer Swell Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Surf Spot & Wave Season Navigator</span>
            <span className="text-lg">🌊</span>
          </h2>
          <p className="text-xs text-sky-200/90 mt-1 max-w-xl">
            Sri Lanka offers year-round world-class surf. When the South Coast is blown out, the East Coast is glassy blue perfection.
          </p>
        </div>

        {/* Coast Toggle */}
        <div className="bg-sky-50/70 p-3.5 border-b border-sky-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCoast('south')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                coast === 'south'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-white text-sky-950 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <span>🏖️ South Coast (Nov – April)</span>
            </button>
            <button
              onClick={() => setCoast('east')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                coast === 'east'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-white text-sky-950 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <span>☀️ East Coast (May – Oct)</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-sky-900 hidden sm:inline">
            {coast === 'south' ? 'Weligama • Hiriketiya • Midigama' : 'Arugam Bay • Whiskey Point'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* Season Highlights Banner */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-800 tracking-wider block">
                Current Coast Status
              </span>
              <h3 className="text-base font-black text-sky-950 mt-0.5">
                {coast === 'south' ? 'South Coast: Golden Winter Season' : 'East Coast: Prime Summer Right-Hand Points'}
              </h3>
              <p className="text-xs text-sky-800 mt-1">
                {coast === 'south'
                  ? 'Best swell directions from SW/S with light morning offshore winds from 6:00 AM to 10:30 AM.'
                  : 'Reliable Indian Ocean trade winds creating ultra-long, mechanical right-hand point breaks.'}
              </p>
            </div>
            <span className="text-3xl hidden sm:block">{coast === 'south' ? '🏄‍♂️' : '🌊'}</span>
          </div>

          {/* Spots Grid */}
          <div className="space-y-4">
            {spots.map((spot, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-sky-400 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-gray-100 pb-2.5">
                  <div>
                    <h4 className="font-extrabold text-base text-gray-950">{spot.name}</h4>
                    <span className="text-xs text-gray-500 font-semibold">{spot.location}</span>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg self-start sm:self-auto ${
                    spot.skillLevel === 'Beginner Friendly'
                      ? 'bg-emerald-100 text-emerald-900'
                      : spot.skillLevel === 'Intermediate'
                      ? 'bg-sky-100 text-sky-900'
                      : 'bg-red-100 text-red-900'
                  }`}>
                    {spot.skillLevel}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5 text-[11px] text-gray-700">
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block">Wave Type:</strong>
                    <span>{spot.waveType}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block">Seabed:</strong>
                    <span>{spot.bottom}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <strong className="text-gray-900 block">Board Rental:</strong>
                    <span>{spot.rentalCost}</span>
                  </div>
                </div>

                <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-200 text-sky-950 flex items-start gap-1.5 text-[11px]">
                  <Sparkles size={13} className="text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Insider Surf Tip:</strong> {spot.insiderTip}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Surf Safety & Etiquette Rules */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2 text-[11px] text-amber-950">
            <h4 className="font-black text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-amber-700" />
              <span>Sri Lanka Surf Etiquette & Reef Safety:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90">
              <li><strong>Do not drop in:</strong> The surfer closest to the curl/peak has absolute right of way.</li>
              <li><strong>Sea Urchins:</strong> Common on southern shallow reefs. If pricked, soak in warm vinegar or fresh lime juice to dissolve calcium spines.</li>
              <li><strong>Rip Currents:</strong> If caught, never paddle straight against the current back to shore; paddle parallel to the beach until free.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            🏄 Board rentals are available on the sand at all listed spots. No advance booking necessary.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Surf Radar
          </button>
        </div>
      </div>
    </div>
  );
}
