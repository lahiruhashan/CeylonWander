'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  HelpCircle,
  ShieldCheck,
  Tag
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { VERIFIED_PRICES } from '@/data/verified_prices_data';

type Currency = 'LKR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'INR';

const RATES: Record<Currency, { rate: number; symbol: string }> = {
  LKR: { rate: 1, symbol: 'Rs ' },
  USD: { rate: 1 / 305, symbol: '$' },
  EUR: { rate: 1 / 330, symbol: '€' },
  GBP: { rate: 1 / 390, symbol: '£' },
  AUD: { rate: 1 / 200, symbol: 'A$' },
  INR: { rate: 1 / 3.65, symbol: '₹' },
};

export default function PricesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currency, setCurrency] = useState<Currency>('USD');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'airport', label: 'Airport & Transfers' },
    { id: 'transit', label: 'Transit & Trains' },
    { id: 'sim', label: 'SIM Cards & Data' },
    { id: 'entrance', label: 'Heritage & Temples' },
    { id: 'safari', label: 'Safaris & Jeeps' },
    { id: 'food', label: 'Food & Dining' },
  ];

  const filteredPrices = VERIFIED_PRICES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes ? item.notes.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (minLkr: number, maxLkr: number) => {
    const { rate, symbol } = RATES[currency];
    if (currency === 'LKR') {
      if (minLkr === maxLkr) return `Rs ${minLkr.toLocaleString()}`;
      return `Rs ${minLkr.toLocaleString()} – ${maxLkr.toLocaleString()}`;
    }
    const convertedMin = minLkr * rate;
    const convertedMax = maxLkr * rate;
    if (minLkr === maxLkr) {
      return `${symbol}${convertedMin >= 10 ? convertedMin.toFixed(0) : convertedMin.toFixed(2)}`;
    }
    return `${symbol}${convertedMin >= 10 ? convertedMin.toFixed(0) : convertedMin.toFixed(2)} – ${symbol}${convertedMax >= 10 ? convertedMax.toFixed(0) : convertedMax.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-[#05140e] text-neutral-200">
      {/* Top Banner Navigation */}
      <header className="border-b border-white/10 bg-[#081c14]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-neutral-950 font-black text-sm shadow-md">
              CC
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                CeylonCopilot
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block -mt-1 tracking-wider uppercase">
                Fair-Price Meter · Field Database
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <Link href="/arrival" className="text-neutral-400 hover:text-white transition-colors hidden sm:inline">
              Arrive
            </Link>
            <Link href="/transport" className="text-neutral-400 hover:text-white transition-colors hidden sm:inline">
              Move
            </Link>
            <Link href="/stay" className="text-neutral-400 hover:text-white transition-colors hidden sm:inline">
              Stay
            </Link>
            <Link href="/departure" className="text-neutral-400 hover:text-white transition-colors hidden sm:inline">
              Leave
            </Link>
            <Link href="/" className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-all font-bold">
              Home Map
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-10 md:py-14 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-4">
            <Tag size={14} /> Ground Truth & Price Transparency
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Sri Lanka Fair-Price Meter <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Verified Tourist Price Database
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            Eliminate guesswork, rip-offs, and aggressive tout quotes. Every entry below is timestamped with verification dates and primary source citations (official gazettes, operator rates, or recent field checks).
          </p>

          {/* Currency Switcher Toolbar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-300">Display Currency:</span>
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                {(['USD', 'EUR', 'GBP', 'AUD', 'INR', 'LKR'] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      currency === cur
                        ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-400">
              Exchange baseline: <span className="font-mono text-emerald-400 font-bold">1 USD ≈ 305 LKR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Table and Filter Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Search and Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search e.g. Sigiriya, PickMe, SIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>Showing {filteredPrices.length} verified price benchmarks</span>
          <span className="text-[11px] text-emerald-400">✓ 90-day verification freshness policy</span>
        </div>

        {/* Price Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between hover:border-neutral-700 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </h3>
                  <VerifiedBadge
                    verifiedOn={item.verifiedOn}
                    sourceType={item.sourceType}
                    sourceName={item.sourceName}
                    sourceUrl={item.sourceUrl}
                  />
                </div>

                {/* Primary Price Badge */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">
                    {formatPrice(item.amountMinLkr, item.amountMaxLkr)}
                  </span>
                  <span className="text-xs text-neutral-400 font-normal">
                    / {item.unit}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mb-2">
                  {item.description}
                </p>

                {item.notes && (
                  <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mb-3">
                    💡 {item.notes}
                  </p>
                )}
              </div>

              {/* Source & Date Footer */}
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>
                  Source: <strong className="text-neutral-300">{item.sourceName}</strong>
                </span>
                <span className="font-mono text-neutral-500">
                  {item.verifiedOn}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredPrices.length === 0 && (
          <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
            <HelpCircle size={32} className="mx-auto text-neutral-600 mb-2" />
            <h3 className="text-base font-bold text-white">No matching prices found</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Try searching for &ldquo;taxi&rdquo;, &ldquo;sim&rdquo;, &ldquo;bus&rdquo;, or reset your filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-1.5 rounded-xl bg-neutral-800 text-xs font-bold text-white hover:bg-neutral-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Dual-Pricing Transparency Explainer */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-xs space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck size={18} className="text-emerald-400" />
            Understanding Legal Dual-Pricing in Sri Lanka
          </div>
          <p className="text-neutral-400 leading-relaxed">
            In Sri Lanka, government-managed archaeological sites (Sigiriya, Polonnaruwa, Dambulla, Anuradhapura) and National Parks charge regulated foreign tourist tariffs that differ from local citizen subsidies. 
            These funds directly support the Central Cultural Fund and Wildlife Conservation department.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            <strong className="text-amber-400">Where dual-pricing is NOT acceptable:</strong> Private cafes, local diners, supermarkets, and metered taxis. Always demand a printed menu or receipt with Sri Lankan Rupee prices. If a restaurant has no printed prices, ask first before ordering.
          </p>
        </div>
      </main>
    </div>
  );
}
