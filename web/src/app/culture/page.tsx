'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Moon, ArrowRight } from 'lucide-react';

const POYA_SCHEDULE = [
  { name: 'Vap Full Moon Poya', month: 'October', sign: 'End of Buddhist Rains Retreat (Katina robe offering season)' },
  { name: 'Il Full Moon Poya', month: 'November', sign: 'First 60 Buddhist missionaries sent forth; Maitreya Buddha declaration' },
  { name: 'Unduvap Full Moon Poya', month: 'December', sign: "Sanghamitta brings Sacred Bo Sapling; Adam's Peak pilgrimage opens" },
  { name: 'Duruthu Full Moon Poya', month: 'January', sign: "Buddha's first visit to Sri Lanka (Mahiyangana); Kelaniya Perahera" },
  { name: 'Navam Full Moon Poya', month: 'February', sign: 'First Buddhist Council; Gangaramaya Navam Perahera in Colombo' },
  { name: 'Medin Full Moon Poya', month: 'March', sign: "Buddha visits his father King Suddhodana's palace in Kapilavastu" },
  { name: 'Bak Full Moon Poya', month: 'April', sign: 'Sinhala & Tamil Solar New Year (Aluth Avurudda) season' },
  { name: 'Vesak Full Moon Poya', month: 'May', sign: '🌟 Most Sacred: Triple anniversary of the Buddha (Birth, Enlightenment, Parinirvana). Giant illuminated lanterns and free food Dansalas nationwide!' },
  { name: 'Poson Full Moon Poya', month: 'June', sign: 'Arrival of Arahant Mahinda introducing Buddhism to Sri Lanka at Mihintale rock' },
  { name: 'Esala Full Moon Poya', month: 'July / August', sign: 'First Sermon (Dhammacakkappavattana Sutta) & Grand Kandy Dalada Perahera' },
  { name: 'Nikini Full Moon Poya', month: 'August', sign: 'Convening of the First Buddhist Council by Arahant Maha Kassapa' },
  { name: 'Binara Full Moon Poya', month: 'September', sign: 'Establishment of the Bhikkhuni Sasana (Order of Buddhist Nuns)' },
];

const CULTURE_FAQS = [
  {
    q: 'Can tourists drink alcohol on Poya (Full Moon) days in Sri Lanka?',
    a: 'No. By national law, all alcohol sales are strictly prohibited across the entire island on every monthly Poya day. All standalone wine stores, supermarket liquor aisles, and restaurant/hotel bars must remain closed. Hotel minibars inside your private room may still be consumed if purchased prior, but public bars cannot serve alcohol to anyone, including foreign tourists.'
  },
  {
    q: 'What is the strict dress code for visiting temples in Sri Lanka?',
    a: 'Both men and women must cover their shoulders and knees below the joints. White or light-colored attire is deeply respected and welcomed. You must remove shoes, sandals, and all headwear (hats/caps) before entering the sacred perimeter gates.'
  },
  {
    q: 'Why do I need to wear socks to Sri Lankan temples?',
    a: 'At ancient shrines like Sigiriya, Dambulla Caves, Anuradhapura, and Polonnaruwa, you must walk barefoot across exposed black granite and stone courtyards. Under the tropical midday sun, these stones heat up to over 50°C (122°F) and will blister bare feet! Wearing a thick pair of white socks protects your soles while fully respecting barefoot sanctity.'
  },
  {
    q: 'Is it disrespectful to take a selfie with a Buddha statue?',
    a: 'Yes, turning your back to a Buddha statue—even for a vacation selfie—is considered a serious cultural offense in Sri Lanka and can lead to police warnings or fines. Always photograph Buddha statues respectfully from the side, and never pose, mock, or lean on sacred monuments.'
  }
];

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-[#05140e] text-[#f8fafc] font-sans selection:bg-purple-500/30 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Cinematic Navigation */}
      <header className="sticky top-0 z-50 bg-[#061c14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center text-white font-black text-xs shadow-md">
              CC
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight block leading-none">
                CeylonCopilot <span className="text-xs">🇱🇰</span>
              </span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                Culture & Sacred Calendar
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-purple-400 transition-colors">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-purple-400 transition-colors">Itineraries</Link>
            <Link href="/train" className="hover:text-purple-400 transition-colors">Scenic Train</Link>
            <Link href="/wildlife" className="hover:text-purple-400 transition-colors">Safaris</Link>
            <Link href="/culture" className="text-purple-400 font-extrabold">Culture & Poya</Link>
            <Link href="/food" className="hover:text-purple-400 transition-colors">Food Guide</Link>
            <Link href="/toolkit" className="hover:text-purple-400 transition-colors">Field Toolkit</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Launch Map</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-extrabold uppercase tracking-wider mb-6">
          <Moon size={13} />
          <span>Sacred Traditions & Astronomical Holidays</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-serif">
          Sri Lanka Culture, Poya Days & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
            Sacred Temple Etiquette
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Every full moon in Sri Lanka is a sacred holiday with legal dry day restrictions. 
          Discover the 12-month astronomical calendar, temple dress codes, hot-stone footwear rules, and free community Dansalas.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10 space-y-12">
        {/* The 3 Golden Rules on Poya Days */}
        <div className="bg-gradient-to-br from-[#1b0a2a] to-[#0d0417] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
              Essential Travel Knowledge
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              The 3 Golden Rules of Poya (Full Moon) Days
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-black/40 border border-purple-500/30 p-5 rounded-2xl space-y-2">
              <span className="text-2xl">🚫🍷</span>
              <h3 className="font-black text-sm text-white">1. Nationwide Alcohol Ban</h3>
              <p className="text-gray-300 leading-relaxed">
                By law, all bars, wine stores, liquor outlets, and restaurant hotel bars are closed across Sri Lanka on Poya days. Plan ahead if you wish to buy beverages.
              </p>
            </div>

            <div className="bg-black/40 border border-purple-500/30 p-5 rounded-2xl space-y-2">
              <span className="text-2xl">🛕🤍</span>
              <h3 className="font-black text-sm text-white">2. Massive Temple Crowds</h3>
              <p className="text-gray-300 leading-relaxed">
                Temples (Dalada Maligawa in Kandy, Kelaniya, Anuradhapura) experience massive pilgrim surges dressed in pure white offering lotus blossoms and lighting clay oil lamps.
              </p>
            </div>

            <div className="bg-black/40 border border-purple-500/30 p-5 rounded-2xl space-y-2">
              <span className="text-2xl">🍲✨</span>
              <h3 className="font-black text-sm text-white">3. Free Dansala Food Stalls</h3>
              <p className="text-gray-300 leading-relaxed">
                During Vesak (May) and Poson (June) Poyas, locals erect temporary roadside pavilions distributing free ice cream, rice & curry, and tea to all travelers as acts of merit.
              </p>
            </div>
          </div>
        </div>

        {/* 12-Month Poya Astronomical Calendar */}
        <div className="bg-[#0c1a14]/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-1">
              Astronomical Calendar
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              The 12 Sacred Full Moon Poya Days
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {POYA_SCHEDULE.map((poya, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-white/10 hover:border-purple-400/40 p-4 rounded-2xl transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-white">{poya.name}</h4>
                  <span className="text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                    {poya.month}
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  {poya.sign}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Temple Dress Code & Etiquette Cheat Sheet */}
        <div className="bg-gradient-to-br from-[#0c2419] to-[#06140e] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Cultural Respect
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Temple Etiquette & Dress Protocol
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-300">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <strong className="text-white block text-sm">👕 White / Modest Attire</strong>
              <p className="leading-relaxed">
                Both men and women must cover shoulders and knees below the joint. Sleeveless shirts, tank tops, and short shorts are strictly prohibited. White clothing is traditionally preferred and deeply welcomed.
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <strong className="text-white block text-sm">👟 Footwear Removal & Thick Socks</strong>
              <p className="leading-relaxed">
                All shoes, sandals, and hats must be removed at compound gates. In midday sun, granite pavements heat up to over 50°C—wear thick white socks to avoid burned soles.
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <strong className="text-white block text-sm">📸 No Selfies Facing Away from the Buddha</strong>
              <p className="leading-relaxed">
                Never turn your back directly to a Buddha statue for photos. Photograph monuments respectfully from the side. Never climb, mock, or touch ancient statues.
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <strong className="text-white block text-sm">👣 Shoe Counter Tipping</strong>
              <p className="leading-relaxed">
                Temple shoe counters typically charge a small token custody fee of LKR 50–100 (~$0.25). Keep small notes ready in your pocket.
              </p>
            </div>
          </div>
        </div>

        {/* SEO FAQs */}
        <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-1">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Sri Lanka Cultural Traditions & Poya Guidelines
            </h3>
          </div>

          <div className="space-y-4">
            {CULTURE_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-start gap-2">
                  <span className="text-purple-400">Q:</span>
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
            Inspect sacred shrines and ancient temples on the map
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Discover 30+ UNESCO monasteries, cave shrines, and stupas with exact dress badges and dual-pricing tariffs.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-400 text-white rounded-xl text-sm font-black shadow-xl hover:scale-105 transition-all"
          >
            <Compass size={16} />
            <span>Open Explorer Vector Map</span>
            <ArrowRight size={14} />
          </Link>
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
            <Link href="/train" className="hover:text-white">Scenic Train</Link>
            <Link href="/toolkit" className="hover:text-white">Field Toolkit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
