'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Train, ExternalLink } from 'lucide-react';

interface StationInfo {
  name: string;
  elevationMeters: number;
  timeFromKandy: string;
  landscapeView: string;
  sideToSit: 'RIGHT' | 'LEFT';
  sideReason: string;
}

const HILL_STATIONS: StationInfo[] = [
  {
    name: 'Peradeniya Junction',
    elevationMeters: 492,
    timeFromKandy: '0h 20m',
    landscapeView: 'Royal botanical riverbanks & palm groves',
    sideToSit: 'RIGHT',
    sideReason: 'Sweeping looks at the winding Mahaweli River valley.'
  },
  {
    name: 'Nawalapitiya',
    elevationMeters: 588,
    timeFromKandy: '1h 15m',
    landscapeView: 'Transition from wet foothills to tea mountains',
    sideToSit: 'RIGHT',
    sideReason: 'First glimpses of steep mountain ravines opening up.'
  },
  {
    name: 'Hatton',
    elevationMeters: 1263,
    timeFromKandy: '2h 30m',
    landscapeView: 'Adam’s Peak pyramid & Devon / St. Clair’s waterfalls',
    sideToSit: 'RIGHT',
    sideReason: 'St. Clair’s cascading veil of white water is visible on the right cliffside!'
  },
  {
    name: 'Nanu Oya (Nuwara Eliya Gateway)',
    elevationMeters: 1613,
    timeFromKandy: '4h 15m',
    landscapeView: 'High-altitude emerald tea carpets and misty colonial stations',
    sideToSit: 'RIGHT',
    sideReason: 'Lush green Pedro & Labookellie tea estate panoramas.'
  },
  {
    name: 'Pattipola (Highest Station in Sri Lanka)',
    elevationMeters: 1898,
    timeFromKandy: '5h 15m',
    landscapeView: 'Summit cloud forest & alpine eucalyptus pine trees',
    sideToSit: 'LEFT',
    sideReason: 'SWITCH TO LEFT! As the train crosses the summit tunnel, the southern lowlands plunge dramatically on the left!'
  },
  {
    name: 'Idalgashinna',
    elevationMeters: 1615,
    timeFromKandy: '5h 45m',
    landscapeView: 'Knife-edge mountain ridge with deep valleys on BOTH sides',
    sideToSit: 'LEFT',
    sideReason: 'One of the most thrilling stations in Asia. On clear days you can see down to the southern coastline.'
  },
  {
    name: 'Haputale',
    elevationMeters: 1479,
    timeFromKandy: '6h 00m',
    landscapeView: 'Lipton’s Seat mountain shelf & tea factories',
    sideToSit: 'LEFT',
    sideReason: 'Gazing across the Haputale Gap into rolling blue foothills.'
  },
  {
    name: 'Ella',
    elevationMeters: 1041,
    timeFromKandy: '6h 30m',
    landscapeView: 'Ella Rock, Little Adam’s Peak, & Demodara Nine Arch Bridge',
    sideToSit: 'LEFT',
    sideReason: 'Mandatory left side for the famous view of Ella Rock and Nine Arch Bridge curves.'
  }
];

const TRAIN_FAQS = [
  {
    q: 'Which side of the train should I sit on from Kandy to Ella?',
    a: 'The golden rule: Sit on the RIGHT side leaving Kandy towards Nanu Oya (Nuwara Eliya) to see St. Clair’s and Devon waterfalls. Once you pass Pattipola summit, switch to the LEFT side towards Ella to witness the breathtaking Ella Gap mountain precipice.'
  },
  {
    q: 'How does Sri Lanka Railways 30-day ticket booking work?',
    a: 'Reserved tickets (1st class AC and 2nd class reserved) go on sale exactly 30 days in advance at 10:00 AM Sri Lanka time (GMT+5:30) via the official railway portal (seatreservation.railway.gov.lk). They frequently sell out in minutes during peak seasons (December–March and July–August) due to travel agency bulk booking.'
  },
  {
    q: 'What should I do if reserved tickets are completely sold out?',
    a: 'Do not panic and do not pay $40 USD to scalpers! Sri Lanka Railways operates unreserved 2nd and 3rd class carriages on every train. Walk up to the station ticket counter 45–60 minutes before departure and purchase an unreserved ticket for only LKR 500–700 (~$2 USD). While seats are not guaranteed, people get off at intermediate stations, and standing by the open doorway with the mountain breeze is an iconic Sri Lankan experience.'
  },
  {
    q: 'Which carriage class is best for photography?',
    a: '2nd Class Reserved is widely considered the best! 1st class carriages have sealed glass windows and air-conditioning (reflective glass ruins photos). 2nd Class carriages have large openable windows, ceiling fans, and open vestibule doorways where you can safely catch the mountain mist.'
  }
];

export default function TrainPage() {
  const [selectedStation, setSelectedStation] = useState<StationInfo>(HILL_STATIONS[4]); // Pattipola

  return (
    <div className="min-h-screen bg-[#05140e] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Cinematic Navigation */}
      <header className="sticky top-0 z-50 bg-[#061c14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-[#032317] font-black text-xs shadow-md">
              CC
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight block leading-none">
                CeylonCopilot <span className="text-xs">🇱🇰</span>
              </span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                Scenic Train Copilot
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-blue-400 transition-colors">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-blue-400 transition-colors">Itineraries</Link>
            <Link href="/train" className="text-blue-400 font-extrabold">Scenic Train</Link>
            <Link href="/wildlife" className="hover:text-blue-400 transition-colors">Safaris</Link>
            <Link href="/culture" className="hover:text-blue-400 transition-colors">Culture & Poya</Link>
            <Link href="/food" className="hover:text-blue-400 transition-colors">Food Guide</Link>
            <Link href="/toolkit" className="hover:text-blue-400 transition-colors">Field Toolkit</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-[#032317] rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Launch Map</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-extrabold uppercase tracking-wider mb-6">
          <Train size={13} />
          <span>The World’s Most Scenic Mountain Railway</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-serif">
          Kandy to Ella Train: <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
            Side-to-Sit & Station Copilot
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Built by the British in the 1860s to transport Ceylon tea from high cloud-forests down to Colombo port. 
          Discover station elevations, the 30-day ticket booking rules, and know which side to sit on for every mile.
        </p>

        {/* Live Official Ticket Booking Link */}
        <div className="inline-flex items-center gap-3">
          <a
            href="https://seatreservation.railway.gov.lk"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-[#032317] rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Official Railway Portal (SeatReservation)</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10 space-y-12">
        {/* Interactive Elevation Scrubber & Inspector */}
        <div className="bg-gradient-to-br from-[#071c26] to-[#040f17] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider block">
                Main Line Station Elevation Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif mt-1">
                {selectedStation.name}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Elevation Above Sea</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {selectedStation.elevationMeters.toLocaleString()} meters ({Math.round(selectedStation.elevationMeters * 3.28)} ft)
              </span>
            </div>
          </div>

          {/* Station Selection Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HILL_STATIONS.map((station) => (
              <button
                key={station.name}
                onClick={() => setSelectedStation(station)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedStation.name === station.name
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-md ring-1 ring-blue-400'
                    : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="text-[10px] font-bold text-blue-300">{station.timeFromKandy}</div>
                <div className="text-xs font-black truncate">{station.name}</div>
                <div className="text-[11px] text-gray-400 font-mono">{station.elevationMeters}m</div>
              </button>
            ))}
          </div>

          {/* Seat Recommendation Card */}
          <div className="bg-[#042433]/70 border border-blue-400/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wider ${
                  selectedStation.sideToSit === 'RIGHT'
                    ? 'bg-emerald-500 text-[#032317]'
                    : 'bg-amber-400 text-amber-950'
                }`}>
                  SIT ON {selectedStation.sideToSit} SIDE
                </span>
                <span className="text-xs text-gray-300 font-semibold">• {selectedStation.timeFromKandy} from Kandy</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                {selectedStation.sideReason}
              </p>
            </div>
          </div>
        </div>

        {/* Carriage Class Reality Check */}
        <div className="bg-[#071c26]/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-400 block mb-1">
              Truth in Travel
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Sri Lanka Train Carriage Classes: Which Should You Book?
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            {/* 2nd Class Reserved */}
            <div className="bg-black/40 border border-emerald-500/40 p-5 rounded-2xl space-y-2.5 relative">
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">
                🏆 Recommended for Photographers
              </span>
              <h4 className="font-black text-base text-white">2nd Class Reserved</h4>
              <p className="text-gray-300 leading-relaxed">
                Large open windows, ceiling fans, and reserved numbered seats. Fresh mountain breeze enters continuously and you can lean safely towards the open window frames without glass glare.
              </p>
              <div className="text-[11px] text-emerald-400 font-bold pt-2 border-t border-white/5">
                Cost: ~LKR 1,500 – 2,500 ($5 – $8 USD)
              </div>
            </div>

            {/* 1st Class AC */}
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md">
                Cool & Quiet
              </span>
              <h4 className="font-black text-base text-white">1st Class AC</h4>
              <p className="text-gray-300 leading-relaxed">
                Air-conditioned carriage with plush reclining seats. However, windows are hermetically sealed and tinted, making outdoor photography difficult due to interior reflections.
              </p>
              <div className="text-[11px] text-blue-400 font-bold pt-2 border-t border-white/5">
                Cost: ~LKR 3,000 – 4,500 ($10 – $15 USD)
              </div>
            </div>

            {/* Unreserved 2nd / 3rd Class */}
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                Local Backpacker Vibe
              </span>
              <h4 className="font-black text-base text-white">Unreserved 2nd/3rd Class</h4>
              <p className="text-gray-300 leading-relaxed">
                Purchased at station counter on departure day. Never sells out. Can get very crowded, but great for spontaneous travel and soaking in local chai vendors with snacks (*Vadai*).
              </p>
              <div className="text-[11px] text-amber-400 font-bold pt-2 border-t border-white/5">
                Cost: ~LKR 500 – 800 (~$2 USD)
              </div>
            </div>
          </div>
        </div>

        {/* Coastal Line (Colombo to Galle) Bonus Section */}
        <div className="bg-gradient-to-br from-[#061e2b] to-[#03131c] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">
              Coastal Line Route
            </span>
            <h3 className="text-2xl font-black text-white font-serif">
              The Oceanfront Coastal Train: Colombo to Galle
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Riding along the Indian Ocean: tracks run just 5 meters from crashing waves! 
              <strong> Crucial tip:</strong> Sit on the <strong>Right Side</strong> when traveling South from Colombo towards Galle for unbroken ocean views.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-right shrink-0">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Duration</span>
            <span className="text-lg font-black text-cyan-400 font-mono">2h 15m</span>
            <span className="text-[11px] text-gray-300 block">Daily express trains</span>
          </div>
        </div>

        {/* SEO FAQs */}
        <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-400 block mb-1">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Sri Lanka Train Travel Guide
            </h3>
          </div>

          <div className="space-y-4">
            {TRAIN_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-start gap-2">
                  <span className="text-blue-400">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="text-2xl font-black text-white font-serif">
            Combine the train with a complete multi-day journey
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            View our 7, 10, and 14-day itineraries integrating the Kandy–Ella train seamlessly with tea estates and safaris.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/itinerary"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-[#032317] rounded-xl text-xs font-black shadow-lg transition-all"
            >
              Explore Multi-Day Itineraries →
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-bold transition-all"
            >
              Inspect Stations on Map
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>CeylonCopilot 🇱🇰 • Cloudflare Colombo Edge</span>
          <div className="flex items-center gap-4 text-gray-400 font-semibold">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/explore" className="hover:text-white">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-white">Itineraries</Link>
            <Link href="/wildlife" className="hover:text-white">Safaris</Link>
            <Link href="/toolkit" className="hover:text-white">Field Toolkit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
