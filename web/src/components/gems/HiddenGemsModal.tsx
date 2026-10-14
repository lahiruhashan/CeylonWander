'use client';

import React from 'react';
import { X, Sparkles, MapPin, Compass } from 'lucide-react';
import Link from 'next/link';

interface HiddenGemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoordinates?: (coords: [number, number]) => void;
}

interface GemSpot {
  id: string;
  name: string;
  region: string;
  crowdLevel: 'Virtually Empty' | 'Very Low (<10 people)' | 'Moderate at Sunset';
  coords: [number, number]; // [lng, lat]
  icon: string;
  badge: string;
  alternativeTo: string;
  description: string;
  insiderSecret: string;
}

const GEMS_DATA: GemSpot[] = [
  {
    id: 'yapahuwa',
    name: 'Yapahuwa Rock Fortress',
    region: 'North-Western Province (near Maho)',
    crowdLevel: 'Virtually Empty',
    coords: [80.3128, 7.8286],
    icon: '🏰',
    badge: '13th-Century Sacred Citadel',
    alternativeTo: 'Crowded midday Sigiriya Rock queues',
    description: 'A colossal 100-meter sheer granite rock fortress that served as the capital of Sri Lanka in 1272. Features a jaw-dropping ornamental stone staircase flanked by guardian stone lions reminiscent of Angkor Wat.',
    insiderSecret: 'You will often have the entire stone stairway and summit stupa ruins completely to yourself. Entrance is only LKR 1,500.'
  },
  {
    id: 'pidurangala',
    name: 'Pidurangala Rock Sunrise',
    region: 'Cultural Triangle (Sigiriya)',
    crowdLevel: 'Moderate at Sunset',
    coords: [80.7631, 7.9658],
    icon: '🌄',
    badge: '360° Panorama of Lion Rock',
    alternativeTo: '$36 Sigiriya foreign ticket fees',
    description: 'Rising directly adjacent to Sigiriya, this ancient monastic rock offers the single most breathtaking photographic perspective of Sigiriya Lion Rock rising out of the green canopy.',
    insiderSecret: 'Begin climbing at 5:00 AM with a headlamp. Reach the summit flat boulder at 5:45 AM for dawn mist swirling through the jungle valley.'
  },
  {
    id: 'delft_island',
    name: 'Delft Island (Neduntheevu)',
    region: 'Jaffna Archipelago (Palk Strait)',
    crowdLevel: 'Very Low (<10 people)',
    coords: [79.6894, 9.5136],
    icon: '🏝️',
    badge: 'Wild Ponies & Coral Walls',
    alternativeTo: 'Commercial southern tourist beaches',
    description: 'A remote, windswept coral island 30km off the northern coast. Home to descendants of wild horses left by Portuguese and Dutch colonial administrators, giant baobab trees, and coral-slab houses.',
    insiderSecret: 'Take the free morning Navy passenger ferry (RDS Vada Tharagai) from Kurikadduwan jetty at 8:30 AM.'
  },
  {
    id: 'riverston',
    name: 'Riverston & Mini World’s End',
    region: 'Knuckles Mountain Range (Matale)',
    crowdLevel: 'Virtually Empty',
    coords: [80.7303, 7.5256],
    icon: '⛰️',
    badge: 'Pristine Cloud Forest Ridge',
    alternativeTo: 'Crowded Horton Plains ticket lines',
    description: 'A sharp mountain ridge dropping vertically into the Thelgamuwa valley. Misty eucalyptus winds, dwarf pygmy trees, and cool 18°C mountain air without the tour buses.',
    insiderSecret: 'Combine with a dip in the crystal-clear natural rock pools of Thelgamuwa Oya river.'
  },
  {
    id: 'diyaluma_pools',
    name: 'Upper Diyaluma Natural Infinity Pools',
    region: 'Koslanda / Haputale foothills',
    crowdLevel: 'Very Low (<10 people)',
    coords: [81.0317, 6.7328],
    icon: '🏊',
    badge: '220m Cliff Plunge Pools',
    alternativeTo: 'Busy Ravana Falls roadside view',
    description: 'A series of natural freshwater rock pools carved into smooth granite directly at the precipice of Sri Lanka’s second-highest waterfall (220 meters).',
    insiderSecret: 'Do not hike up from the bottom road; take a tuk-tuk to Makaldenya village at the top and walk an easy 25-minute flat trail through lemongrass.'
  },
  {
    id: 'ridi_viharaya',
    name: 'Ridi Viharaya (The Silver Temple)',
    region: 'Kurunegala foothills',
    crowdLevel: 'Virtually Empty',
    coords: [80.4439, 7.5458],
    icon: '🛕',
    badge: '2nd-Century BC Silver Cavern',
    alternativeTo: 'Commercialized souvenir markets',
    description: 'An ancient cave temple built inside a mountain cavern where King Dutugemunu discovered rich veins of silver in the 2nd century BC to fund the great Ruwanwelisaya stupa. Features original Kandyan mural frescoes.',
    insiderSecret: 'The temple grounds are surrounded by peaceful jackfruit groves and rock pools where Buddhist monks chant evening pirith.'
  }
];

export default function HiddenGemsModal({ isOpen, onClose, onSelectCoordinates }: HiddenGemsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
            <span>🎒 Secret Sri Lanka</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Hidden Gems & Off-The-Beaten-Path</span>
            <span className="text-lg">🌿</span>
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
            Escape the mass tourist buses and explore peaceful, untouched alternatives across the island.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-gray-800 text-xs">
          {GEMS_DATA.map(gem => (
            <div
              key={gem.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-emerald-50 shrink-0">{gem.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-950">{gem.name}</h3>
                    <span className="text-xs text-emerald-700 font-semibold">{gem.region}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                    {gem.crowdLevel}
                  </span>
                  {onSelectCoordinates ? (
                    <button
                      onClick={() => {
                        onSelectCoordinates(gem.coords);
                        onClose();
                      }}
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <MapPin size={12} />
                      <span>Fly to Map</span>
                    </button>
                  ) : (
                    <Link
                      href="/explore"
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Compass size={12} />
                      <span>Map</span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50/50 p-2 rounded-xl text-[11px] text-emerald-950 font-medium">
                <strong>Alternative to:</strong> {gem.alternativeTo}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {gem.description}
              </p>

              <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-amber-950 flex items-start gap-1.5 text-[11px]">
                <Sparkles size={13} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Insider Secret:</strong> {gem.insiderSecret}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            🌿 Respect local customs and leave no plastic footprint at these serene sites.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
