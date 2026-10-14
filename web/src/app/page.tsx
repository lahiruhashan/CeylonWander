'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, CheckCircle2, ArrowRight, Train, CloudSun, Calendar, ShieldAlert } from 'lucide-react';
import TukTukFareModal from '@/components/calculator/TukTukFareModal';
import ScenicTrainModal from '@/components/train/ScenicTrainModal';
import MonsoonRadarModal from '@/components/weather/MonsoonRadarModal';
import PoyaCalendarModal from '@/components/culture/PoyaCalendarModal';
import ScamRadarModal from '@/components/safety/ScamRadarModal';

export default function LandingPage() {
  const [showTukTukModal, setShowTukTukModal] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [showMonsoonModal, setShowMonsoonModal] = useState(false);
  const [showPoyaModal, setShowPoyaModal] = useState(false);
  const [showScamModal, setShowScamModal] = useState(false);

  // Quick interactive fare preview state on landing page
  const [previewKm, setPreviewKm] = useState(6);
  const [previewTerrain, setPreviewTerrain] = useState<'flat' | 'hill'>('hill');

  const calcPreviewFare = () => {
    const base = 120;
    const perKm = 95;
    let total = base + (previewKm > 1 ? (previewKm - 1) * perKm : 0);
    if (previewTerrain === 'hill') total *= 1.3;
    const minLkr = Math.round(total * 0.95 / 50) * 50;
    const maxLkr = Math.round(total * 1.15 / 50) * 50;
    const usdMin = (minLkr / 305).toFixed(2);
    const usdMax = (maxLkr / 305).toFixed(2);
    return { minLkr, maxLkr, usdMin, usdMax };
  };

  const previewFare = calcPreviewFare();

  return (
    <div className="min-h-screen bg-[#f7faf7] text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-center justify-center text-white font-black shadow-md text-sm">
              CW
            </div>
            <div>
              <span className="text-base font-extrabold text-emerald-950 tracking-tight block leading-none">
                CeylonWander <span className="text-xs">🇱🇰</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold tracking-wide uppercase">
                Sri Lanka Travel Engine
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-600">
            <a href="#traveler-toolkit" className="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Traveler Toolkit</span>
            </a>
            <a href="#why-us" className="hover:text-emerald-800 transition-colors">Why CeylonWander</a>
            <a href="#tuktuk-tool" className="hover:text-emerald-800 transition-colors">Tuk-Tuk Tool</a>
            <a href="#corridors" className="hover:text-emerald-800 transition-colors">Corridors</a>
            <a href="#etiquette" className="hover:text-emerald-800 transition-colors">Temple Rules</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTukTukModal(true)}
              className="px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-xs transition-colors flex items-center gap-1"
            >
              <span>🛺</span>
              <span className="hidden sm:inline">Fair</span>
              <span>Fare</span>
            </button>

            <Link
              href="/explore"
              className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 group"
            >
              <span>Launch Map</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/60 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold uppercase tracking-wider mb-6 shadow-xs animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live on Cloudflare Colombo Edge • 110+ Curated Spots</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.15] mb-6">
            Travel Sri Lanka without the{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              mountain delays, scams, or guesswork.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            The first discovery engine engineered for Sri Lanka’s real topography: 
            true hill-country switchback drive times, transparent 3-tier dual ticket prices (Foreign vs. Local), 
            sacred dress etiquette, and offline town bundles.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <Link
              href="/explore"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <Compass size={18} className="group-hover:rotate-45 transition-transform" />
              <span>Launch Interactive Map (100% Free)</span>
              <ArrowRight size={15} />
            </Link>

            <button
              onClick={() => setShowTukTukModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl text-sm font-bold border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>🛺</span>
              <span>Open Tuk-Tuk Fare Meter</span>
            </button>
          </div>

          {/* Quick Traveler Tools Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-3xl mx-auto">
            <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider mr-1">
              Field Tools:
            </span>
            <button
              onClick={() => setShowTrainModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-105"
            >
              <span>🚂</span>
              <span>Scenic Train Copilot</span>
            </button>
            <button
              onClick={() => setShowMonsoonModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-105"
            >
              <span>🌦️</span>
              <span>Monsoon Radar</span>
            </button>
            <button
              onClick={() => setShowPoyaModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-105"
            >
              <span>🌕</span>
              <span>Poya Calendar</span>
            </button>
            <button
              onClick={() => setShowScamModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-105"
            >
              <span>🛡️</span>
              <span>Scam Radar & Phrases</span>
            </button>
          </div>

          {/* Key Value Stat Chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-4xl mx-auto">
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-xl mb-1 block">⛰️</span>
              <h4 className="text-xs font-bold text-gray-900">Switchback Topography</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">True driving times instead of misleading straight-lines.</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-xl mb-1 block">💸</span>
              <h4 className="text-xs font-bold text-gray-900">3-Tier Dual Pricing</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Explicit Foreign USD vs SAARC vs Local LKR rates.</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-xl mb-1 block">🛕</span>
              <h4 className="text-xs font-bold text-gray-900">Temple Etiquette</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Shoulder/knee rules, shoe counters & hot stone warnings.</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-xl mb-1 block">📶</span>
              <h4 className="text-xs font-bold text-gray-900">Offline Mountain Packs</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Lightweight &lt;25MB town packs for signal dead zones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Tuk-Tuk Fare Tool Preview */}
      <section id="tuktuk-tool" className="py-16 bg-gradient-to-b from-white to-[#f4f9f4] border-y border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Explainer */}
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                <span>🛺 Traveler Essential</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight leading-snug">
                Never pay 3x tourist markups on Tuk-Tuks.
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Outside Colombo, three-wheelers rarely use meters. Our tool calculates regulated local fuel-standard rates 
                accounting for hill switchbacks so you know the honest price before you negotiate.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => setShowTukTukModal(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Open Full Fare Calculator</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl shadow-xl border border-emerald-200 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Quick Fare Simulator
                </span>
                <span className="text-[11px] text-gray-500 font-medium">Standard Tuk-Tuk</span>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-700">Trip Distance:</span>
                  <span className="text-emerald-800 font-black">{previewKm} kilometers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={previewKm}
                  onChange={(e) => setPreviewKm(Number(e.target.value))}
                  className="w-full accent-emerald-700 h-2 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Terrain toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTerrain('flat')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    previewTerrain === 'flat'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  🏙️ Flat Coast (Galle, Colombo)
                </button>
                <button
                  onClick={() => setPreviewTerrain('hill')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    previewTerrain === 'hill'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  ⛰️ Hill Country (Ella, Kandy)
                </button>
              </div>

              {/* Result display */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                    Estimated Honest Meter Fare
                  </span>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">
                    LKR {previewFare.minLkr.toLocaleString()} – {previewFare.maxLkr.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-200 block">
                    ~${previewFare.usdMin} – ${previewFare.usdMax} USD
                  </span>
                  <span className="text-[10px] text-emerald-400">Regulated benchmark</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Overseas Traveler Field Toolkit */}
      <section id="traveler-toolkit" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3">
            <span>🧭 Overseas Traveler Toolkit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Built for the realities of exploring Sri Lanka.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
            International travelers face 4 big dilemmas: train seat views, opposite coastal monsoons, nationwide full-moon dry days, and street pushiness. We solved them all with live interactive engines.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tool Card 1: Scenic Train */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-emerald-50 inline-block">🚂</span>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg">
                  Kandy ⇄ Ella & Coast
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-950 group-hover:text-emerald-800 transition-colors">
                Scenic Train Copilot & Side-to-Sit Guide
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sit on the <strong className="text-emerald-900">Right side</strong> from Kandy to Nanu Oya for cascading tea valleys, and switch to the <strong className="text-emerald-900">Left side</strong> towards Ella for dizzying mountain ravines.
              </p>
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/80 text-[11px] text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  <span>30-Day ticket window reality check & anti-scalper advice</span>
                </div>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  <span>2nd Class Reserved vs. AC vs. Observation carriage truths</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTrainModal(true)}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <Train size={14} />
              <span>Launch Scenic Train Copilot</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Tool Card 2: Monsoon Radar */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-sky-50 inline-block">🌦️</span>
                <span className="text-[10px] font-black uppercase bg-sky-100 text-sky-900 px-2.5 py-1 rounded-lg">
                  Yala vs. Maha Cycles
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-950 group-hover:text-sky-900 transition-colors">
                Dual-Monsoon Weather Compass
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sri Lanka is always sunny somewhere! When the Southwest is stormy (May–Sept), the East Coast (Arugam Bay, Nilaveli) has glassy blue seas and clear skies.
              </p>
              <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100/80 text-[11px] text-sky-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-sky-700" />
                  <span>Interactive 12-month coast and sunshine selector</span>
                </div>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-sky-700" />
                  <span>High-elevation mist warnings (Horton Plains 6:00 AM rule)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMonsoonModal(true)}
              className="w-full py-3 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <CloudSun size={14} />
              <span>Launch Monsoon Radar</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Tool Card 3: Poya Calendar */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-amber-50 inline-block">🌕</span>
                <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                  Sacred Holidays & Dry Days
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-950 group-hover:text-amber-900 transition-colors">
                12-Month Poya Full Moon Calendar
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every full moon is a sacred national holiday. By law, all alcohol sales (bars, wine stores, and hotels) and meat shops are closed across the island.
              </p>
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100/80 text-[11px] text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-700" />
                  <span>The 3 Golden Rules: Alcohol ban, pilgrim traffic & temple dress</span>
                </div>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-700" />
                  <span>Free community food stalls (Dansalas) during Vesak and Poson</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPoyaModal(true)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <Calendar size={14} />
              <span>Launch Poya Calendar</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Tool Card 4: Scam Radar */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-red-50 inline-block">🛡️</span>
                <span className="text-[10px] font-black uppercase bg-red-100 text-red-900 px-2.5 py-1 rounded-lg">
                  Safety & Sinhala Survival
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-950 group-hover:text-red-900 transition-colors">
                Street-Smart Scam Radar & Phrases
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Recognize inflated spice garden bills, gem appraisal certificates, and aggressive stilt-fishing photo fees before falling into commission traps.
              </p>
              <div className="bg-red-50/70 p-3 rounded-2xl border border-red-100/80 text-[11px] text-red-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-red-700" />
                  <span>6 phonetic Sinhala phrases (Polite decline, price asking & thank you)</span>
                </div>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-red-700" />
                  <span>1-tap 1990 Suwa Seriya free government ambulance GPS copy</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowScamModal(true)}
              className="w-full py-3 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <ShieldAlert size={14} />
              <span>Launch Scam Radar & Phrases</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Why CeylonWander vs. Google Maps Comparison */}
      <section id="why-us" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest mb-2">
            The Difference
          </h2>
          <h3 className="text-3xl font-black text-emerald-950 tracking-tight">
            Why Generic Maps Fail in Sri Lanka
          </h3>
          <p className="text-xs text-gray-600 mt-2">
            Google Maps treats steep tea plantations and winding mountain switchbacks like flat city streets. CeylonWander was built on the ground.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-emerald-200 overflow-hidden">
          <div className="grid grid-cols-12 bg-emerald-950 text-white p-4 text-xs font-bold tracking-wider uppercase">
            <div className="col-span-5 sm:col-span-4">Feature / Reality</div>
            <div className="col-span-3 sm:col-span-4 text-gray-400">Generic Travel Apps</div>
            <div className="col-span-4 text-emerald-300 font-black">CeylonWander 🇱🇰</div>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {[
              {
                feature: 'Mountain Travel Times',
                generic: 'Misleading "crow flight" straight lines; misses slow hairpins',
                us: 'Topography routing accounting for 25km/h switchbacks',
              },
              {
                feature: 'Entry Fee Transparency',
                generic: 'Single flat rate or outdated TripAdvisor review comments',
                us: 'Clear 3-tier rates: Foreigner USD vs. SAARC vs. Local LKR',
              },
              {
                feature: 'Sacred Site Etiquette',
                generic: 'Hidden in reviews or completely unmentioned',
                us: 'Standardized badges: shoulder/knee, shoe counter, hot stone',
              },
              {
                feature: 'Mountain Signal Dead Zones',
                generic: 'Requires constant cellular data roaming',
                us: 'One-tap <25MB regional town bundles for offline GPS',
              },
              {
                feature: 'Route Backtracking',
                generic: 'Sends you zigzagging across mountain valleys',
                us: 'Smart Corridor loops & multi-stop Trip Sequencer',
              },
              {
                feature: 'Turn-by-Turn Export',
                generic: 'Restricted to their proprietary app sandbox',
                us: '1-click export to Google Maps driving navigation',
              },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 items-center hover:bg-emerald-50/40 transition-colors">
                <div className="col-span-5 sm:col-span-4 font-bold text-gray-900">{row.feature}</div>
                <div className="col-span-3 sm:col-span-4 text-gray-500 flex items-center gap-1.5 pr-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span className="text-[11px] leading-tight">{row.generic}</span>
                </div>
                <div className="col-span-4 text-emerald-900 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-[11px] leading-tight">{row.us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Top Travel Corridors */}
      <section id="corridors" className="py-16 bg-[#eef6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest mb-1">
                Curated Travel Corridors
              </h2>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                Explore Iconic Road Loops
              </h3>
            </div>

            <Link
              href="/explore"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              <span>Explore all on map</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '🏛️',
                title: 'Cultural Triangle',
                sub: 'Sigiriya, Dambulla & Ancient Ruins',
                desc: 'UNESCO rock citadels, cave monasteries, and colossal brick stupas across 2,000 years of history.',
                tag: 'UNESCO Heritage',
              },
              {
                icon: '🫖',
                title: 'Tea Valleys & Falls',
                sub: 'Nuwara Eliya, Ella & Horton Plains',
                desc: 'Colonial tea factories, misty cloud forests, nine-arch railway bridges, and panoramic gap treks.',
                tag: 'Scenic Mountain',
              },
              {
                icon: '🏄',
                title: 'South Surf & Fort',
                sub: 'Galle Fort, Weligama & Mirissa',
                desc: '17th-century Dutch ramparts, beginner surf bays, palm-fringed coves, and ethical whale safaris.',
                tag: 'Coastal & Marine',
              },
              {
                icon: '🏝️',
                title: 'Jaffna & The North',
                sub: 'Casuarina Beach & Sacred Kovils',
                desc: 'Vibrant Tamil culture, shallow turquoise lagoons, sacred mineral springs, and remote islands.',
                tag: 'Culture & Coast',
              },
            ].map((card, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 rounded-3xl border border-emerald-100 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{card.icon}</span>
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      {card.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                    {card.title}
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-semibold block mb-2">{card.sub}</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{card.desc}</p>
                </div>

                <Link
                  href="/explore"
                  className="pt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Inspect on map</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sacred Temple Etiquette Cheat Sheet */}
      <section id="etiquette" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold text-amber-700 uppercase tracking-widest mb-2">
            Cultural Respect
          </h2>
          <h3 className="text-3xl font-black text-emerald-950 tracking-tight">
            Sacred Shrines & Temple Etiquette
          </h3>
          <p className="text-xs text-gray-600 mt-2">
            Sri Lanka’s sacred sites are active places of worship with strict veneration rules. Here is what to know before you arrive.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-2xl block">👕</span>
            <h4 className="text-sm font-bold text-gray-900">Shoulders & Knees Covered</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Both men and women must cover shoulders and knees below joints. White attire is traditionally preferred and deeply respected.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-2xl block">👟</span>
            <h4 className="text-sm font-bold text-gray-900">Footwear Removal & Hot Stones</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Shoes and headwear must be removed at compound gates. In midday sun, granite pavements reach over 50°C—wear thick white socks to avoid burned soles.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-2xl block">📸</span>
            <h4 className="text-sm font-bold text-gray-900">No Backs to the Buddha</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Never pose for photos or selfies with your back turned directly to a Buddha statue. Photograph the monument respectfully from the side.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 to-teal-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to explore Sri Lanka like a local?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Free forever. No account required. Explore 110+ destinations, plan corridor day loops, 
            and navigate with true mountain travel times.
          </p>

          <div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl text-sm font-black shadow-xl transition-all hover:scale-105"
            >
              <Compass size={18} />
              <span>Launch Explorer Map</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-900">CeylonWander 🇱🇰</span>
            <span>•</span>
            <span>Hosted at Cloudflare Colombo Edge</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link href="/explore" className="hover:text-emerald-800 font-bold">Explorer Map</Link>
            <button onClick={() => setShowTrainModal(true)} className="hover:text-emerald-800 font-bold">
              🚂 Scenic Train
            </button>
            <button onClick={() => setShowMonsoonModal(true)} className="hover:text-emerald-800 font-bold">
              🌦️ Monsoon Radar
            </button>
            <button onClick={() => setShowPoyaModal(true)} className="hover:text-emerald-800 font-bold">
              🌕 Poya Calendar
            </button>
            <button onClick={() => setShowScamModal(true)} className="hover:text-emerald-800 font-bold">
              🛡️ Scam Radar
            </button>
            <button onClick={() => setShowTukTukModal(true)} className="hover:text-emerald-800 font-bold">
              🛺 Tuk-Tuk Fare
            </button>
            <a 
              href="https://github.com/lahiruhashan/CeylonWander" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-800 font-bold"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Tools */}
      <TukTukFareModal
        isOpen={showTukTukModal}
        onClose={() => setShowTukTukModal(false)}
      />

      <ScenicTrainModal
        isOpen={showTrainModal}
        onClose={() => setShowTrainModal(false)}
      />

      <MonsoonRadarModal
        isOpen={showMonsoonModal}
        onClose={() => setShowMonsoonModal(false)}
      />

      <PoyaCalendarModal
        isOpen={showPoyaModal}
        onClose={() => setShowPoyaModal(false)}
      />

      <ScamRadarModal
        isOpen={showScamModal}
        onClose={() => setShowScamModal(false)}
      />
    </div>
  );
}
