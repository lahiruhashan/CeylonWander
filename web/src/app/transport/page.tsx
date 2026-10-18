'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Navigation, 
  Train, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { VERIFIED_PRICES } from '@/data/verified_prices_data';

export default function TransportPage() {
  const [calcKm, setCalcKm] = useState<number>(7);
  const [isHilly, setIsHilly] = useState<boolean>(false);

  // Tuk-tuk fare calculations based on verified fuel regulations
  const baseFare = 120;
  const perKm = 95;
  const rawFare = baseFare + (calcKm > 1 ? (calcKm - 1) * perKm : 0);
  const adjustedFare = isHilly ? rawFare * 1.3 : rawFare;
  const minLkr = Math.round(adjustedFare * 0.95 / 50) * 50;
  const maxLkr = Math.round(adjustedFare * 1.15 / 50) * 50;
  const minUsd = (minLkr / 305).toFixed(2);
  const maxUsd = (maxLkr / 305).toFixed(2);

  const tukTukVerified = VERIFIED_PRICES.find(p => p.id === 'price-tuktuk-base-meter');

  return (
    <div className="min-h-screen bg-[#05140e] text-neutral-200">
      {/* Top Banner Navigation */}
      <Navbar pageSubtitle="Move Guide · Phase 2" />

      {/* Hero Header */}
      <section className="py-10 md:py-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-300 mb-4">
            <Navigation size={14} /> Phase 2 of 4: Island Transit & Route Physics
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            The Island Transit Copilot: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">
              True Speeds, Trains & Fair Tuk-Tuk Fares
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            Google Maps assumes standard 60 km/h driving speeds. In Sri Lanka’s Central Highlands, steep hairpin switchbacks and tea trucks slash real-world speeds to 24 km/h. Plan with authentic island physics.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Mountain Real Speed</span>
              <span className="text-amber-400 font-bold text-base">22 - 28 km/h</span>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Expressway Limit</span>
              <span className="text-emerald-400 font-bold text-base">100 km/h (E01/E03)</span>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Tuk-Tuk Flat Benchmark</span>
              <span className="text-white font-bold text-base">Rs 95 - 100 / km</span>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Kandy-Ella Elevation</span>
              <span className="text-sky-400 font-bold text-base">500m → 1,895m</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* Mountain Switchback Reality Warning */}
        <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">The Central Highland &ldquo;Map Distortion&rdquo; Rule</h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                A 75 km drive between Kandy and Nuwara Eliya looks like 1 hour on Western maps. In reality, climbing 1,400 meters through Ramboda Pass switchbacks requires <strong className="text-amber-300">2.5 to 3.5 hours</strong>. 
                Never plan more than 120 km of mountain travel in a single day, or you will spend your entire holiday staring at brake lights on single-lane passes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="bg-neutral-950/70 p-3 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-neutral-400 block">Kandy → Nuwara Eliya</span>
                  <strong className="text-white">76 km · ~2.5 - 3.2 hrs</strong>
                </div>
                <div className="bg-neutral-950/70 p-3 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-neutral-400 block">Nuwara Eliya → Ella</span>
                  <strong className="text-white">56 km · ~2.0 - 2.5 hrs</strong>
                </div>
                <div className="bg-neutral-950/70 p-3 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-neutral-400 block">Colombo → Galle (E01)</span>
                  <strong className="text-emerald-400">125 km · ~1.8 hrs (Expressway)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Fair Tuk-Tuk Fare Calculator */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Interactive Tuk-Tuk Fair Fare Meter</h2>
                {tukTukVerified && (
                  <VerifiedBadge 
                    verifiedOn={tukTukVerified.verifiedOn} 
                    sourceType={tukTukVerified.sourceType} 
                    sourceName={tukTukVerified.sourceName} 
                    sourceUrl={tukTukVerified.sourceUrl} 
                  />
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Outside Colombo, three-wheelers do not run meters. Use our fuel-benchmarked calculator to know the honest price before stepping in.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders and Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-neutral-300">Trip Distance</label>
                  <span className="text-lg font-black text-emerald-400">{calcKm} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={35}
                  value={calcKm}
                  onChange={(e) => setCalcKm(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                  <span>1 km (short hop)</span>
                  <span>15 km (town to town)</span>
                  <span>35 km (long run)</span>
                </div>
              </div>

              {/* Hill Terrain Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                <div>
                  <span className="font-bold text-sm text-white block">Steep Mountain Switchbacks?</span>
                  <span className="text-[11px] text-neutral-400">
                    Kandy, Nuwara Eliya, Ella, Haputale (+30% fuel compensation)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHilly(!isHilly)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isHilly ? 'bg-amber-500' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      isHilly ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Haggling advice */}
              <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-3.5 text-xs text-neutral-300 space-y-1">
                <span className="font-bold text-emerald-400 block">💡 Local Haggling Rule:</span>
                <p>
                  Always negotiate and agree upon the total fare in Rupees <em>before</em> putting your bags inside. If a driver quotes double, politely say: &ldquo;Rs {maxLkr} is the fair meter rate, ayubowan.&rdquo;
                </p>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-xl">
              <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                Honest Benchmark Range
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight my-2">
                Rs {minLkr.toLocaleString()} – {maxLkr.toLocaleString()}
              </div>
              <span className="text-sm font-semibold text-neutral-300 block">
                Approx. ${minUsd} – ${maxUsd} USD
              </span>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1 text-left">
                <div className="flex justify-between">
                  <span>First km base:</span>
                  <span className="text-white font-mono">Rs {baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate per additional km:</span>
                  <span className="text-white font-mono">Rs {perKm} {isHilly ? '(+30% hill)' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Urban alternative:</span>
                  <span className="text-emerald-400 font-semibold">PickMe / Uber in Colombo & Kandy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenic Railway Deep Dive */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Train size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">The Legendary Rail Routes: Where to Sit</h2>
              <span className="text-xs text-sky-400">Elevation physics, panoramic tea estates & ticket tactics</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kandy to Ella */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Kandy → Ella Main Line</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">6.5 - 7.5 hrs</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Regarded as one of the world&rsquo;s most breathtaking rail journeys, crossing Pattipola summit (1,895m elevation).
              </p>
              <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 text-xs space-y-2">
                <div>
                  <strong className="text-emerald-400 block">Where to sit (Kandy to Nuwara Eliya / Nanu Oya):</strong>
                  <span className="text-neutral-300">Right side of the train for dramatic tea estate valleys and waterfalls.</span>
                </div>
                <div>
                  <strong className="text-amber-400 block">Where to sit (Nanu Oya to Ella):</strong>
                  <span className="text-neutral-300">Left side of the train for the Nine Arch Bridge approach and Southern plains drop-off.</span>
                </div>
                <div>
                  <strong className="text-white block">Tickets:</strong>
                  <span className="text-neutral-400">Reserved 2nd/3rd class open 30 days prior online via Sri Lanka Railways. Unreserved 3rd class can be bought at the station on travel morning (prepare to stand).</span>
                </div>
              </div>
            </div>

            {/* Colombo to Galle */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Colombo → Galle Coastal Line</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">2.0 - 2.5 hrs</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Skims the Indian Ocean shoreline so closely that sea spray occasionally hits open train windows.
              </p>
              <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 text-xs space-y-2">
                <div>
                  <strong className="text-teal-400 block">Where to sit (Colombo to Galle):</strong>
                  <span className="text-neutral-300">Right side facing the direction of travel for uninterrupted ocean waves and sunsets.</span>
                </div>
                <div>
                  <strong className="text-teal-400 block">Where to sit (Galle to Colombo):</strong>
                  <span className="text-neutral-300">Left side facing the front of the train for coastal views.</span>
                </div>
                <div>
                  <strong className="text-white block">Best train:</strong>
                  <span className="text-neutral-400">The 06:50 &lsquo;Ruhunu Kumari&rsquo; express or the 14:40 express from Colombo Fort.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Self-Drive Tuk-Tuk & IDP Rules */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Self-Drive Tuk-Tuk Legal Requirements</h2>
              <span className="text-xs text-amber-400">An IDP alone is NOT legally valid in Sri Lanka</span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Renting a three-wheeler to drive yourself around Sri Lanka has exploded in popularity. However, foreign drivers must follow strict legal procedures to avoid police confiscation and invalidating collision insurance:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1.5">
              <span className="font-bold text-white block">1. Home Driving License + IDP</span>
              <p className="text-neutral-400">
                You must possess a valid car driving license from your home country and an International Driving Permit (1949 or 1968 Geneva convention).
              </p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1.5">
              <span className="font-bold text-amber-400 block">2. AAC Endorsement (Mandatory)</span>
              <p className="text-neutral-400">
                You must have your IDP endorsed by the <strong>Automobile Association of Ceylon (AAC)</strong> in Colombo, or obtain a temporary driving permit from DMT Werahera.
              </p>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1.5">
              <span className="font-bold text-emerald-400 block">3. Rental Agency Clearance</span>
              <p className="text-neutral-400">
                Reputable self-drive providers (like tuktukrental.com) handle this paperwork in advance so you can pick up the vehicle legal and fully insured.
              </p>
            </div>
          </div>
        </div>

        {/* Phase Navigation CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/arrival"
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500">Back to Phase 1</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                ← Airport Arrival & Touts
              </h4>
            </div>
          </Link>

          <Link
            href="/stay"
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-400">Proceed to Phase 3</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Stay, Monsoon Radar & Etiquette →
              </h4>
            </div>
            <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
