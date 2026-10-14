'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, RotateCcw } from 'lucide-react';

interface PackingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  category: 'temple' | 'highland' | 'tropical' | 'electronics' | 'health';
  name: string;
  reason: string;
  essential: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Temple
  { id: 'temple_white', category: 'temple', name: 'White or light-colored top & trousers/long skirt', reason: 'Covers shoulders and knees below joints. White is traditionally revered and welcomed at all shrines.', essential: true },
  { id: 'thick_socks', category: 'temple', name: 'Pair of thick white socks', reason: 'Shoes are removed at temple gates. Midday granite stones heat up to over 50°C and burn bare soles!', essential: true },
  { id: 'sarong_shawl', category: 'temple', name: 'Light cotton sarong / wrap shawl', reason: 'Instant modesty wrap if entering a sacred shrine on short notice.', essential: true },

  // Highlands
  { id: 'warm_fleece', category: 'highland', name: 'Warm fleece jacket / sweater', reason: 'Nuwara Eliya, Horton Plains, and Adam’s Peak drop to 10°C–14°C at night and before dawn.', essential: true },
  { id: 'windbreaker', category: 'highland', name: 'Lightweight rain/windbreaker jacket', reason: 'Highland cloud forests experience rapid mist showers and windy train carriage doors.', essential: true },
  { id: 'hiking_shoes', category: 'highland', name: 'Trail running shoes with lugged grip', reason: 'Red mountain clay on Ella Rock and Pidurangala turns slick after rain.', essential: true },

  // Tropical & Beach
  { id: 'reef_sunscreen', category: 'tropical', name: 'Reef-safe high SPF sunscreen (SPF 50+)', reason: 'Sri Lanka is 6–9 degrees north of the equator; UV index frequently reaches extreme 11+.', essential: true },
  { id: 'polarized_shades', category: 'tropical', name: 'Polarized sunglasses', reason: 'Cuts through water glare on whale safari boats and bright coastal roads.', essential: false },
  { id: 'dry_bag', category: 'tropical', name: '10L or 15L waterproof dry bag', reason: 'Protects cameras and phones during monsoon downpours and open surf boats.', essential: false },

  // Electronics
  { id: 'uk_adapter', category: 'electronics', name: 'UK 3-pin Type G & Round Type D plug adapter', reason: 'Sri Lanka primarily uses square 3-pin Type G sockets with occasional round Type D in older guesthouses.', essential: true },
  { id: 'power_bank', category: 'electronics', name: '10,000 – 20,000mAh Power Bank', reason: 'All-day train rides, offline GPS navigation, and rural dead-zones quickly drain smartphone batteries.', essential: true },

  // Health & Rainforest
  { id: 'leech_socks', category: 'health', name: 'Leech socks / Dettol spray', reason: 'High-rising tightly woven socks prevent forest land leeches from penetrating during rainforest hikes in Sinharaja & Knuckles.', essential: true },
  { id: 'deet_repellent', category: 'health', name: 'Mosquito repellent with DEET / Picaridin', reason: 'Essential for dusk protection against tropical dengue mosquitoes.', essential: true },
  { id: 'electrolytes', category: 'health', name: 'Electrolyte rehydration powder packets', reason: 'Replenishes lost mineral salts quickly in humid coastal heat and steep summit climbs.', essential: false },
];

export default function PackingChecklistModal({ isOpen, onClose }: PackingChecklistModalProps) {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ceylon_packing_checklist');
        if (saved) setCheckedIds(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checkedIds, [id]: !checkedIds[id] };
    setCheckedIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ceylon_packing_checklist', JSON.stringify(updated));
    }
  };

  const handleReset = () => {
    setCheckedIds({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ceylon_packing_checklist');
    }
  };

  if (!isOpen) return null;

  const totalCount = CHECKLIST_ITEMS.length;
  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPct = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
            <span>🧳 Trip Preparedness</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Dynamic Weather-Aware Packing Checklist</span>
            <span className="text-lg">🎒</span>
          </h2>
          <p className="text-xs text-teal-200/90 mt-1 max-w-xl">
            Never get turned away at sacred temple gates or freeze in high-altitude tea plantations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-emerald-50/70 p-4 border-b border-emerald-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-950">Packing Progress:</span>
              <span className="text-emerald-800">{checkedCount} of {totalCount} packed ({progressPct}%)</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            title="Reset Checklist"
            className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-gray-500 hover:text-emerald-950 border border-emerald-200 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-gray-800 text-xs">
          {CHECKLIST_ITEMS.map(item => {
            const isChecked = !!checkedIds[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/60 border-emerald-300 opacity-75'
                    : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-xs'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-700 hover:scale-110 transition-transform shrink-0"
                >
                  {isChecked ? (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  ) : (
                    <Circle size={18} className="text-gray-300" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-xs ${isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {item.name}
                    </span>
                    {item.essential && (
                      <span className="text-[9px] uppercase font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">
                        Essential
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            ✅ Progress is automatically saved in your browser.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
}
