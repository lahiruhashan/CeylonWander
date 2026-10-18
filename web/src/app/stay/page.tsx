'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  CloudRain, 
  Moon, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  Footprints
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { VERIFIED_PRICES } from '@/data/verified_prices_data';
import { ISLAND_IMAGES } from '@/data/island_images';

export default function StayPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Default to current season (Oct/Nov)

  const MONTHS = [
    { num: 1, name: 'Jan', season: 'south_west' },
    { num: 2, name: 'Feb', season: 'south_west' },
    { num: 3, name: 'Mar', season: 'south_west' },
    { num: 4, name: 'Apr', season: 'south_west' },
    { num: 5, name: 'May', season: 'transition' },
    { num: 6, name: 'Jun', season: 'east_north' },
    { num: 7, name: 'Jul', season: 'east_north' },
    { num: 8, name: 'Aug', season: 'east_north' },
    { num: 9, name: 'Sep', season: 'east_north' },
    { num: 10, name: 'Oct', season: 'inter_monsoon' },
    { num: 11, name: 'Nov', season: 'inter_monsoon' },
    { num: 12, name: 'Dec', season: 'south_west' },
  ];

  const currentMonthData = MONTHS.find(m => m.num === selectedMonth) || MONTHS[9];

  const getSeasonDescription = (season: string) => {
    switch (season) {
      case 'south_west':
        return {
          title: 'South & West Coast Peak Dry Season (Yala Clear)',
          dryCoast: 'Galle, Mirissa, Weligama, Bentota, Hikkaduwa, Colombo & Hill Country',
          wetCoast: 'East Coast (Arugam Bay / Trincomalee experiencing Maha rains)',
          surf: 'South Coast (Weligama, Midigama, Hiriketiya)',
          summary: 'The golden period for south beaches, whale watching, tea estates, and climbing Adam’s Peak.',
        };
      case 'east_north':
        return {
          title: 'East Coast Peak Dry Season (Southwest Monsoon Season)',
          dryCoast: 'Arugam Bay, Trincomalee, Nilaveli, Pasikudah, Jaffna & Cultural Triangle',
          wetCoast: 'Southwest (Colombo, Galle, Bentota experiencing Yala monsoon showers)',
          surf: 'East Coast (Arugam Bay Main Point, Peanut Farm, Whiskey Point)',
          summary: 'Crystal-clear waters on the East Coast for diving and surfing; Cultural Triangle remains dry.',
        };
      case 'inter_monsoon':
      default:
        return {
          title: 'Inter-Monsoon Transition Period',
          dryCoast: 'Mornings sunny islandwide; short afternoon tropical downpours',
          wetCoast: 'Scattered afternoon thunderstorms across hill country',
          surf: 'Transitioning between coasts; sheltered bays like Hiriketiya & Weligama',
          summary: 'Lush green landscapes, fewer tourist crowds, and dramatically discounted boutique villas.',
        };
    }
  };

  const seasonInfo = getSeasonDescription(currentMonthData.season);

  const udawalawePrice = VERIFIED_PRICES.find(p => p.id === 'price-safari-udawalawe-jeep');

  return (
    <div className="min-h-screen bg-[#05140e] text-neutral-200">
      {/* Top Banner Navigation */}
      <Navbar pageSubtitle="Stay & Culture · Phase 3" />

      {/* Hero Header with Photographic Atmosphere */}
      <section className="py-12 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={ISLAND_IMAGES.mirissaPalms.url}
            alt={ISLAND_IMAGES.mirissaPalms.alt}
            className="w-full h-full object-cover opacity-20 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05140e] via-[#05140e]/85 to-[#05140e]/95" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-4">
            <Compass size={14} /> Phase 3 of 4: Island Living & Cultural Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            The Island Stay Copilot: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-200">
              Dual-Monsoon Compass, Temples & Poya Laws
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            Sri Lanka is never in bad weather everywhere at once. When one coast sees rain, the opposite coast enjoys glorious sunshine. Navigate microclimates, sacred customs, and ethical safaris like a seasoned traveler.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* Interactive Dual-Monsoon Season Compass */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sun size={20} className="text-amber-400" />
                The Dual-Monsoon Compass: Where is it Sunny?
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Select your travel month to see which coast offers calm turquoise seas and clear skies:
              </p>
            </div>
          </div>

          {/* Month Selector Buttons */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
            {MONTHS.map((m) => (
              <button
                key={m.num}
                onClick={() => setSelectedMonth(m.num)}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                  selectedMonth === m.num
                    ? 'bg-amber-500 text-neutral-950 shadow-md scale-105'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* Dynamic Season Overview */}
          <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Forecast for {currentMonthData.name}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{seasonInfo.title}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <Sun size={15} /> Sunny & Calm Coastline
                </div>
                <p className="text-neutral-200">{seasonInfo.dryCoast}</p>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
                  <CloudRain size={15} /> Higher Rain / Rough Seas
                </div>
                <p className="text-neutral-200">{seasonInfo.wetCoast}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 pt-1 leading-relaxed">
              <strong>Copilot Tip:</strong> {seasonInfo.summary}
            </p>
          </div>
        </div>

        {/* Temple Etiquette & The Granite Sock Protocol */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl bg-neutral-950 border border-emerald-500/20 group">
            <img
              src={ISLAND_IMAGES.kandyToothTemple.url}
              alt={ISLAND_IMAGES.kandyToothTemple.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300">
              🏛️ Sri Dalada Maligawa, Kandy
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                Sacred Living Heritage Protocols
              </span>
              <span className="text-emerald-300 font-mono text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                Mandatory Etiquette
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Footprints size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Temple Etiquette & The &ldquo;Granite Socks&rdquo; Protocol</h2>
              <span className="text-xs text-emerald-400">Sacred Tooth Relic, Dambulla Cave, Anuradhapura</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Sock Hack */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
              <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <Sparkles size={16} /> The #1 Insider Hack: Thick Socks
              </span>
              <p className="text-neutral-300 leading-relaxed">
                You must remove your shoes and hats at Buddhist temple boundaries. Midday tropical sun heats black granite courtyards to over 50°C (122°F), causing painful blistering. 
                <strong className="text-white block mt-1">Always keep a pair of dark, thick cotton socks in your daypack. Socks are fully permitted and save your feet!</strong>
              </p>
            </div>

            {/* Dress Code */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" /> Dress Code Rules
              </span>
              <ul className="text-neutral-300 space-y-1.5">
                <li>• <strong>Shoulders & knees covered:</strong> Sarongs or lightweight linen trousers are ideal.</li>
                <li>• <strong>White or light colors:</strong> Highly respected when visiting sacred stupas.</li>
                <li>• <strong>Remove headgear:</strong> Hats, caps, and sunglasses must be taken off.</li>
              </ul>
            </div>

            {/* Buddha Imagery Warnings */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2">
              <span className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                <AlertTriangle size={16} /> Buddha Imagery Red Line
              </span>
              <p className="text-neutral-300 leading-relaxed">
                Never pose for a selfie with your back turned directly to a Buddha statue (it is considered disrespectful). 
                Having tattoos of the Buddha visible on your body is taken very seriously in Sri Lanka and has led to deportation of tourists. Cover all spiritual tattoos before entering temples.
              </p>
            </div>
          </div>
        </div>

        {/* Poya Days and Full Moon Laws */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Moon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Full Moon Poya Days & Alcohol Laws</h2>
              <span className="text-xs text-purple-300">Monthly Buddhist holiday regulations</span>
            </div>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-2 leading-relaxed">
            <p>
              Every month on the day of the full moon (Poya), Sri Lanka observes a sacred public holiday. 
              Under national law, <strong className="text-white">no alcohol can be sold or served anywhere on the island</strong> — including hotel bars, beach restaurants, and wine stores. Meat and fish butcher stalls are also closed.
            </p>
            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-400 flex items-center gap-2">
              <span className="text-amber-400 font-bold">Pro-tip:</span> If you wish to have a beer or wine on a Poya evening, purchase it at a supermarket or wine store the afternoon prior and enjoy it quietly on your private hotel balcony.
            </div>
          </div>
        </div>

        {/* Ethical Wildlife Safaris */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl bg-neutral-950 border border-amber-500/20 group">
            <img
              src={ISLAND_IMAGES.wildElephants.url}
              alt={ISLAND_IMAGES.wildElephants.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300">
              🐘 Udawalawe & Minneriya Wild Corridors
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                Wild Herds, Zero Captivity
              </span>
              <span className="text-amber-300 font-mono text-[11px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                Ethical Safaris Only
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Ethical Wildlife Safaris: Picking the Right Park</h2>
                {udawalawePrice && (
                  <VerifiedBadge 
                    verifiedOn={udawalawePrice.verifiedOn} 
                    sourceType={udawalawePrice.sourceType} 
                    sourceName={udawalawePrice.sourceName} 
                    sourceUrl={udawalawePrice.sourceUrl} 
                  />
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Sri Lanka possesses the highest biodiversity density in Asia. Avoid safari tourist traps and choose the park that matches your wildlife priorities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">Udawalawe National Park</span>
              <p className="text-neutral-300">
                <strong>Best for:</strong> Guaranteed wild elephant herds in open grasslands. Minimal jeep harassment; much more relaxed than Yala.
              </p>
              <span className="text-neutral-400 block pt-1 font-mono">Fair Jeep: ~Rs 14,000 - 18,000</span>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Yala National Park (Block 1)</span>
              <p className="text-neutral-300">
                <strong>Best for:</strong> Sri Lankan Leopard and Sloth Bear. Caution: 60+ jeeps often converge on a single sighting. Request early morning entry (05:45).
              </p>
              <span className="text-neutral-400 block pt-1 font-mono">Fair Jeep: ~Rs 16,000 - 20,000</span>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">Wilpattu & Minneriya</span>
              <p className="text-neutral-300">
                <strong>Wilpattu:</strong> Natural lakes (&ldquo;villus&rdquo;), dense forest, low tourist density. <br />
                <strong>Minneriya (Jul-Oct):</strong> The legendary annual Elephant Gathering (200+ elephants).
              </p>
              <span className="text-neutral-400 block pt-1 font-mono">Unmatched scenic seclusion</span>
            </div>
          </div>
        </div>

        {/* Phase Navigation CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/transport"
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-500">Back to Phase 2</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                ← Island Transit & Trains
              </h4>
            </div>
          </Link>

          <Link
            href="/departure"
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-400">Proceed to Phase 4</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Departure & Leave-By Calculator →
              </h4>
            </div>
            <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
