'use client';

import React, { useState } from 'react';
import { X, Users, Calendar } from 'lucide-react';

interface BudgetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TravelTier = 'backpacker' | 'flashpacker' | 'luxury';
type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD';

const CURRENCY_RATES: Record<Currency, { symbol: string; rateToUsd: number }> = {
  USD: { symbol: '$', rateToUsd: 1.0 },
  EUR: { symbol: '€', rateToUsd: 0.92 },
  GBP: { symbol: '£', rateToUsd: 0.78 },
  AUD: { symbol: 'A$', rateToUsd: 1.52 },
};

const TIER_DATA: Record<TravelTier, {
  name: string;
  icon: string;
  usdPerDay: number;
  tagline: string;
  lodging: string;
  transport: string;
  food: string;
  activities: string;
}> = {
  backpacker: {
    name: 'Backpacker / Solo Traveler',
    icon: '🎒',
    usdPerDay: 40,
    tagline: 'Hostels, scenic trains, local rice & curry, and DIY peak hikes',
    lodging: 'Hostel dorms & family guesthouses ($12 – $20/night)',
    transport: 'Scenic trains (2nd/3rd class) & public red buses ($2 – $5/day)',
    food: 'Local roadside kades, hoppers, and rice & curry packets ($5 – $10/day)',
    activities: 'Free or low-cost highlights: Pidurangala rock ($3), Little Adam’s Peak, public beaches'
  },
  flashpacker: {
    name: 'Flashpacker / Mid-Range Comfort',
    icon: '🧳',
    usdPerDay: 95,
    tagline: 'Boutique heritage villas, private AC car/tuk-tuk mix, safari & cafes',
    lodging: 'Boutique hotel with pool or colonial tea cottage ($50 – $90/night)',
    transport: 'Occasional private AC intercity transfers & reserved 2nd class trains ($20 – $35/day)',
    food: 'Mix of coastal artisan cafes, fresh seafood BBQs & local curries ($20 – $30/day)',
    activities: 'Sigiriya Rock citadel ($36), Minneriya/Udawalawe elephant safari, surf lessons'
  },
  luxury: {
    name: 'Luxury / Private Chauffeur',
    icon: '🥂',
    usdPerDay: 280,
    tagline: '5-star heritage tea bungalows, dedicated English chauffeur, bespoke safaris',
    lodging: 'Luxury restored tea estate (e.g. Ceylon Tea Trails, Amangalla) ($200 – $450+/night)',
    transport: 'Dedicated private luxury SUV with chauffeur-guide throughout ($70 – $95/day)',
    food: 'High-end dining, vineyard tea tastings, five-star hotel cuisine ($50 – $80/day)',
    activities: 'Private chartered wildlife jeeps, private boat safaris, VIP monument access'
  }
};

const BENCHMARKS = [
  { item: 'King Coconut (Thambili) on roadside', lkr: 'LKR 150 – 200', usd: '~$0.55' },
  { item: 'Cold Lion Lager (625ml bottle in cafe)', lkr: 'LKR 650 – 900', usd: '~$2.50' },
  { item: 'Local Rice & Curry lunchtime packet', lkr: 'LKR 450 – 700', usd: '~$1.80' },
  { item: '1-Hour Surfboard rental in Weligama', lkr: 'LKR 500 – 800', usd: '~$2.20' },
  { item: 'Sigiriya Rock Fortress foreign ticket', lkr: 'LKR 11,200', usd: '$36.00' },
  { item: 'Private Dedicated Chauffeur/Day (all-in)', lkr: 'LKR 18,000 – 23,000', usd: '~$60 – $75' },
];

export default function BudgetCalculatorModal({ isOpen, onClose }: BudgetCalculatorModalProps) {
  const [tier, setTier] = useState<TravelTier>('flashpacker');
  const [days, setDays] = useState(10);
  const [travelers, setTravelers] = useState(2);
  const [currency, setCurrency] = useState<Currency>('USD');

  if (!isOpen) return null;

  const currentTier = TIER_DATA[tier];
  const totalUsd = currentTier.usdPerDay * days * travelers;
  const currencyInfo = CURRENCY_RATES[currency];
  const convertedTotal = Math.round(totalUsd * currencyInfo.rateToUsd);
  const perPersonConverted = Math.round((totalUsd * currencyInfo.rateToUsd) / travelers);
  const lkrTotal = Math.round(totalUsd * 305);

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
            <span>💰 Real-World Financial Planning</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Travel Budget & Cost Estimator</span>
            <span className="text-lg">🇱🇰</span>
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
            Calculated with honest foreign entrance tariffs, driver allowances, realistic meals, and cash exchange reality.
          </p>
        </div>

        {/* Currency & Tier Bar */}
        <div className="bg-emerald-50/70 p-3.5 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Tiers */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-emerald-200">
            {(['backpacker', 'flashpacker', 'luxury'] as TravelTier[]).map(t => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  tier === t
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <span>{TIER_DATA[t].icon}</span>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>

          {/* Currencies */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-gray-500 mr-1">Currency:</span>
            {(['USD', 'EUR', 'GBP', 'AUD'] as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  currency === c
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-emerald-100 border border-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* Controls: Days and Travelers */}
          <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div>
              <div className="flex justify-between font-bold text-xs mb-1.5">
                <span className="text-gray-700 flex items-center gap-1">
                  <Calendar size={13} className="text-emerald-700" /> Trip Duration:
                </span>
                <span className="text-emerald-800 font-black">{days} Days</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full accent-emerald-700 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-xs mb-1.5">
                <span className="text-gray-700 flex items-center gap-1">
                  <Users size={13} className="text-emerald-700" /> Travelers:
                </span>
                <span className="text-emerald-800 font-black">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={travelers}
                onChange={e => setTravelers(Number(e.target.value))}
                className="w-full accent-emerald-700 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Grand Total Card */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                Estimated Total Trip Budget ({days} Days • {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'})
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                {currencyInfo.symbol}{convertedTotal.toLocaleString()} {currency}
              </div>
              <span className="text-xs text-emerald-200 font-medium block mt-0.5">
                ~{currencyInfo.symbol}{perPersonConverted.toLocaleString()} per traveler • LKR {lkrTotal.toLocaleString()}
              </span>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm text-right shrink-0">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Daily Rate</span>
              <span className="text-base font-extrabold text-white">
                ~{currencyInfo.symbol}{Math.round(currentTier.usdPerDay * currencyInfo.rateToUsd)}/person/day
              </span>
            </div>
          </div>

          {/* Tier Specific Detail */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-950">{currentTier.name}</h4>
                <p className="text-[11px] text-emerald-800">{currentTier.tagline}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <strong className="text-gray-900 block">🏨 Accommodation:</strong>
                <span className="text-gray-600">{currentTier.lodging}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <strong className="text-gray-900 block">🚗 Transportation:</strong>
                <span className="text-gray-600">{currentTier.transport}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <strong className="text-gray-900 block">🍛 Dining & Drinks:</strong>
                <span className="text-gray-600">{currentTier.food}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <strong className="text-gray-900 block">🎟️ Activities & Safaris:</strong>
                <span className="text-gray-600">{currentTier.activities}</span>
              </div>
            </div>
          </div>

          {/* Real Sri Lanka On-the-Ground Price Benchmarks */}
          <div className="space-y-2">
            <h4 className="font-black text-xs uppercase tracking-wider text-gray-700">
              On-The-Ground Price Reality Benchmarks:
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
              {BENCHMARKS.map((b, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{b.item}</span>
                  <div className="text-right shrink-0">
                    <strong className="text-emerald-900 block">{b.lkr}</strong>
                    <span className="text-[10px] text-gray-400 font-bold">{b.usd}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            💡 Card payments (Visa/Mastercard) are accepted at hotels/supermarkets; keep LKR cash for tuk-tuks & entry gates.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
