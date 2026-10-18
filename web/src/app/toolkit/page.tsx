'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import TukTukFareModal from '@/components/calculator/TukTukFareModal';
import BudgetCalculatorModal from '@/components/budget/BudgetCalculatorModal';
import ConnectivityModal from '@/components/connectivity/ConnectivityModal';
import SelfDriveModal from '@/components/driving/SelfDriveModal';
import SurfRadarModal from '@/components/surf/SurfRadarModal';
import PackingChecklistModal from '@/components/checklist/PackingChecklistModal';
import HealthFieldGuideModal from '@/components/health/HealthFieldGuideModal';
import HiddenGemsModal from '@/components/gems/HiddenGemsModal';

const TOOLKIT_FAQS = [
  {
    q: 'How much should a tuk-tuk cost outside Colombo in Sri Lanka?',
    a: 'Outside Colombo, tuk-tuks rarely use meters. Official fuel-regulated benchmarks: Base fare is ~LKR 120 for the 1st kilometer, and ~LKR 95–100 per subsequent kilometer on flat coastal roads. In steep hill country (Kandy, Nuwara Eliya, Ella), add roughly 30% for high fuel consumption on mountain switchbacks. An 8 km coastal ride should cost around LKR 800–900 (~$2.75 USD), not the LKR 2,500 tourist quote.'
  },
  {
    q: 'Can I legally drive a car or tuk-tuk in Sri Lanka with an International Driving Permit (IDP)?',
    a: 'No. An IDP is NOT legally valid on its own in Sri Lanka. You must obtain an official endorsement from the Automobile Association of Ceylon (AAC) in Colombo, or a temporary driving license from the Department of Motor Traffic (DMT). Driving without this endorsement invalidates your insurance and leads to heavy police fines.'
  },
  {
    q: 'What is the nationwide emergency number for medical assistance in Sri Lanka?',
    a: 'Dial 1990 for the 1990 Suwa Seriya free government ambulance service. It is fully operational 24/7 across the entire island, staffed with trained emergency paramedics, and dispatch operators speak English, Sinhala, and Tamil. Average urban dispatch time is under 12 minutes.'
  },
  {
    q: 'Where is the best place to buy a tourist SIM card in Sri Lanka?',
    a: 'Directly in the arrivals hall of Bandaranaike International Airport (CMB) immediately after exiting customs. Both Dialog Axiata and SLT-Mobitel operate 24/7 official counters offering government-regulated tourist SIM/eSIM data plans (30GB–50GB for ~$8–$11 USD). You will need your passport for registration.'
  }
];

export default function ToolkitPage() {
  const [showTukTuk, setShowTukTuk] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showConnectivity, setShowConnectivity] = useState(false);
  const [showSelfDrive, setShowSelfDrive] = useState(false);
  const [showSurf, setShowSurf] = useState(false);
  const [showPacking, setShowPacking] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [showGems, setShowGems] = useState(false);

  // Quick Tuk-Tuk Simulator state on page
  const [calcKm, setCalcKm] = useState(7);
  const [calcHill, setCalcHill] = useState(false);

  const getFare = () => {
    const base = 120;
    const perKm = 95;
    let total = base + (calcKm > 1 ? (calcKm - 1) * perKm : 0);
    if (calcHill) total *= 1.3;
    const minLkr = Math.round(total * 0.95 / 50) * 50;
    const maxLkr = Math.round(total * 1.15 / 50) * 50;
    const minUsd = (minLkr / 305).toFixed(2);
    const maxUsd = (maxLkr / 305).toFixed(2);
    return { minLkr, maxLkr, minUsd, maxUsd };
  };

  const fare = getFare();

  return (
    <div className="min-h-screen bg-[#05140e] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Unified Navigation */}
      <Navbar pageSubtitle="Traveler Field Toolkit" />

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-6">
          <Sparkles size={13} />
          <span>Essential On-The-Ground Field Utilities</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-serif">
          The Overseas Traveler <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Sri Lanka Field Toolkit
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Everything overseas visitors need in their pocket: regulated tuk-tuk meter prices, multi-currency budget calculators, 
          airport SIM guides, self-drive driving laws, and 1-tap free emergency dispatch.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10 space-y-12">
        {/* Live Tuk-Tuk Simulator Card */}
        <div className="bg-gradient-to-br from-[#0c2e20] to-[#061810] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider block">
                🛺 Anti-Gouging Benchmark
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif mt-1">
                Tuk-Tuk Fair Fare Calculator
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                Outside Colombo, three-wheelers do not use meters. Use our live fuel-regulated benchmark accounting for hill switchbacks.
              </p>
            </div>

            <button
              onClick={() => setShowTukTuk(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-xs transition-all shadow-md shrink-0"
            >
              Open Full Fare Tool →
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-bold text-xs mb-1.5">
                  <span className="text-gray-300">Trip Distance:</span>
                  <span className="text-emerald-400 font-mono text-sm">{calcKm} kilometers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  value={calcKm}
                  onChange={(e) => setCalcKm(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCalcHill(false)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    !calcHill
                      ? 'bg-emerald-500 text-[#032317] border-emerald-500 shadow-md'
                      : 'bg-black/30 text-gray-400 border-white/10'
                  }`}
                >
                  🏖️ Flat Coast (Galle, Mirissa)
                </button>
                <button
                  onClick={() => setCalcHill(true)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    calcHill
                      ? 'bg-emerald-500 text-[#032317] border-emerald-500 shadow-md'
                      : 'bg-black/30 text-gray-400 border-white/10'
                  }`}
                >
                  ⛰️ Hill Country (+30%)
                </button>
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Honest Meter Benchmark
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                LKR {fare.minLkr.toLocaleString()} – {fare.maxLkr.toLocaleString()}
              </div>
              <span className="text-xs font-bold text-emerald-300 block">
                ~${fare.minUsd} – ${fare.maxUsd} USD
              </span>
              <p className="text-[10px] text-gray-400 pt-1">
                Official fuel benchmark • Never accept 3x inflated quotes
              </p>
            </div>
          </div>
        </div>

        {/* 8 Field Tool Launch Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Budget */}
          <div
            onClick={() => setShowBudget(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">💰</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Budget & Cost Calculator
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Backpacker, Flashpacker, and Luxury daily cash requirements with real USD, EUR, GBP, & AUD conversion.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>Calculate Budget</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 2: SIM & eSIM */}
          <div
            onClick={() => setShowConnectivity(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">📶</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Airport SIM & eSIM Guide
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dialog vs. Mobitel 30-day tourist data packages at CMB Airport arrivals hall & mountain dead-zone radar.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>Inspect Telco Plans</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 3: Self-Drive Rules */}
          <div
            onClick={() => setShowSelfDrive(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">🛺</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Self-Drive Tuk-Tuk & Car
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Crucial Automobile Association of Ceylon (AAC) endorsement law, private bus right-of-way, and gear safety.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>View Road Rules</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 4: Surf Radar */}
          <div
            onClick={() => setShowSurf(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">🏄</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Surf Spot & Wave Navigator
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              South Coast (Weligama, Hiriketiya) Nov–Apr vs. East Coast (Arugam Bay, Whiskey Point) May–Oct.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>Check Swell Radar</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 5: Hidden Gems */}
          <div
            onClick={() => setShowGems(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">🎒</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Hidden Gems Directory
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Low-crowd alternatives: Yapahuwa rock citadel, Pidurangala sunrise, Delft Island wild ponies, and Upper Diyaluma pools.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>Discover Secrets</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 6: Packing Checklist */}
          <div
            onClick={() => setShowPacking(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">🧳</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Weather Packing Checklist
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Temple modest wear, thick white socks for 50°C stone floors, Nuwara Eliya evening fleece, and leech socks.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>Open Checklist</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 7: Health & 1990 */}
          <div
            onClick={() => setShowHealth(true)}
            className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl backdrop-blur-md cursor-pointer hover:shadow-xl transition-all space-y-3 group"
          >
            <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">🏥</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Health, Leeches & 1990
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Harmless land leech management, safe drinking water rules, 24/7 private hospitals, and 1-tap 1990 ambulance copy.
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 pt-1">
              <span>Read Health Guide</span>
              <ArrowRight size={12} />
            </span>
          </div>

          {/* Card 8: Explorer Map */}
          <Link
            href="/explore"
            className="bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-400/30 p-5 rounded-3xl cursor-pointer hover:shadow-xl transition-all space-y-3 group block"
          >
            <span className="text-3xl p-2 bg-white/10 rounded-2xl inline-block">🗺️</span>
            <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
              Interactive Vector Map
            </h3>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Explore 110+ curated destinations across Sri Lanka with true topography routing and regional town packs.
            </p>
            <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1 pt-1">
              <span>Launch Vector Map</span>
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        {/* SEO FAQs */}
        <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Sri Lanka Traveler Utilities & Road Smarts
            </h3>
          </div>

          <div className="space-y-4">
            {TOOLKIT_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-start gap-2">
                  <span className="text-emerald-400">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <TukTukFareModal isOpen={showTukTuk} onClose={() => setShowTukTuk(false)} />
      <BudgetCalculatorModal isOpen={showBudget} onClose={() => setShowBudget(false)} />
      <ConnectivityModal isOpen={showConnectivity} onClose={() => setShowConnectivity(false)} />
      <SelfDriveModal isOpen={showSelfDrive} onClose={() => setShowSelfDrive(false)} />
      <SurfRadarModal isOpen={showSurf} onClose={() => setShowSurf(false)} />
      <PackingChecklistModal isOpen={showPacking} onClose={() => setShowPacking(false)} />
      <HealthFieldGuideModal isOpen={showHealth} onClose={() => setShowHealth(false)} />
      <HiddenGemsModal isOpen={showGems} onClose={() => setShowGems(false)} />

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>CeylonCopilot 🇱🇰 • Cloudflare Colombo Edge</span>
          <div className="flex items-center gap-4 text-gray-400 font-semibold">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/explore" className="hover:text-white">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-white">Itineraries</Link>
            <Link href="/train" className="hover:text-white">Scenic Train</Link>
            <Link href="/wildlife" className="hover:text-white">Safaris</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
