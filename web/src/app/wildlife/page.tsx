'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

type WildlifeFilter = 'all' | 'elephants' | 'leopards' | 'marine' | 'birds';

interface ParkEntry {
  id: string;
  name: string;
  category: 'elephants' | 'leopards' | 'marine' | 'birds';
  icon: string;
  tagline: string;
  bestMonths: string;
  sightingOdds: '95%+ Guaranteed' | 'High (70-80%)' | 'Moderate (40-60%)';
  species: string[];
  timing: string;
  jeepCostBenchmark: string;
  ethicalGuidance: string;
  proTip: string;
}

const PARKS_DATA: ParkEntry[] = [
  {
    id: 'udawalawe',
    name: 'Udawalawe National Park',
    category: 'elephants',
    icon: '🐘',
    tagline: 'Year-Round Guaranteed Wild Elephants',
    bestMonths: 'All 12 Months (Peak Dec – May)',
    sightingOdds: '95%+ Guaranteed',
    species: ['Wild Asian Elephants (500+ population)', 'Water Buffalo', 'Mugger Crocodiles', 'Crested Serpent Eagle'],
    timing: 'Afternoon Safari (2:30 PM – 6:00 PM) for lake herds',
    jeepCostBenchmark: 'LKR 12,000 – 15,000 per jeep (~$40-$50 USD) + DWC ticket',
    ethicalGuidance: 'Ensure your driver keeps 20 meters distance and never cuts off calves.',
    proTip: 'Combine with the Elephant Transit Home (ETH) feeding at 10:30 AM or 2:30 PM, where orphaned calves are rehabilitated and released back into the wild.'
  },
  {
    id: 'minneriya_kaudulla',
    name: 'Minneriya & Kaudulla (The Gathering)',
    category: 'elephants',
    icon: '🌾',
    tagline: 'The Great Asian Elephant Gathering',
    bestMonths: 'July – October (Peak August/September)',
    sightingOdds: '95%+ Guaranteed',
    species: ['200-350 Wild Elephants gathering', 'Painted Storks', 'Pelicans', 'Spotted Deer'],
    timing: '3:00 PM – 6:30 PM (Herds emerge onto green tank bed)',
    jeepCostBenchmark: 'LKR 13,000 – 16,000 per jeep + DWC entry fee',
    ethicalGuidance: 'The herd migrates dynamically between Minneriya, Kaudulla, and Hurulu Eco Park based on tank water levels. Ask local trackers which park holds the main herd today before buying tickets.',
    proTip: 'Do not book weeks in advance: ask your hotel on the morning of your safari which park the herd moved to that morning.'
  },
  {
    id: 'yala',
    name: 'Yala National Park (Block 1)',
    category: 'leopards',
    icon: '🐆',
    tagline: 'World’s Highest Leopard Density',
    bestMonths: 'February – July (Drying waterholes concentrate wildlife)',
    sightingOdds: 'High (70-80%)',
    species: ['Sri Lankan Leopard (Panthera pardus kotiya)', 'Sloth Bear', 'Asian Elephant', 'Golden Jackal'],
    timing: 'Dawn (5:45 AM gate entry) or Afternoon (2:30 PM)',
    jeepCostBenchmark: 'LKR 14,000 – 18,000 per half-day jeep + DWC tickets',
    ethicalGuidance: 'Reject drivers who speed or radio-chase sightings aggressively. Demand responsible wildlife watching.',
    proTip: 'Block 1 closes annually for 1 month in September/October for animal drought relief. Block 5 or Lunugamvehera remain open.'
  },
  {
    id: 'wilpattu',
    name: 'Wilpattu National Park',
    category: 'leopards',
    icon: '🐾',
    tagline: 'Ancient Land of Natural Sand Lakes (Villus)',
    bestMonths: 'February – October',
    sightingOdds: 'High (70-80%)',
    species: ['Sri Lankan Leopard', 'Sloth Bears (May-June during Palu fruit season)', 'Barking Deer', 'Sambar Deer'],
    timing: 'Full day safari (6:00 AM – 6:00 PM) recommended due to vast park scale',
    jeepCostBenchmark: 'LKR 20,000 – 25,000 per full-day jeep + DWC entry',
    ethicalGuidance: 'Much less crowded than Yala. Quiet, tranquil wilderness experience.',
    proTip: 'Visit in May and June when sweet yellow Palu berries ripen on trees: sloth bears climb trees in broad daylight to gorge on them.'
  },
  {
    id: 'mirissa_whales',
    name: 'Mirissa Marine Sanctuary',
    category: 'marine',
    icon: '🐋',
    tagline: 'Blue Whale & Dolphin Migration Corridor',
    bestMonths: 'November – April (Glassy ocean seas)',
    sightingOdds: 'High (70-80%)',
    species: ['Blue Whales (Largest mammal on earth)', 'Sperm Whales', 'Spinner Dolphins', 'Flying Fish'],
    timing: 'Early morning departure (6:15 AM from Mirissa harbor)',
    jeepCostBenchmark: '$45 – $65 USD per passenger on certified boat',
    ethicalGuidance: 'Choose operators compliant with WCA (World Cetacean Alliance) that maintain 100m engine idle distances.',
    proTip: 'Take seasickness medication (Dimenhydrinate / Avomine) 45 minutes before departure, even if you rarely get seasick.'
  },
  {
    id: 'trincomalee_marine',
    name: 'Trincomalee / Pigeon Island Reef',
    category: 'marine',
    icon: '🤿',
    tagline: 'Summer Marine Safari & Coral Gardens',
    bestMonths: 'May – October (Northeast calm sea season)',
    sightingOdds: '95%+ Guaranteed',
    species: ['Blacktip Reef Sharks', 'Hawksbill Sea Turtles', 'Blue Whales', 'Vibrant Hard Coral Gardens'],
    timing: '8:00 AM – 1:00 PM snorkeling window',
    jeepCostBenchmark: 'LKR 5,000 – 7,000 boat return + Pigeon Island marine ticket',
    ethicalGuidance: 'Never touch coral polyps or stand with fins on coral reef beds.',
    proTip: 'Swim quietly around the shallow rocky side of Pigeon Island: blacktip reef sharks are harmless and circle in waist-deep clear water.'
  },
  {
    id: 'sinharaja',
    name: 'Sinharaja UNESCO Biosphere Reserve',
    category: 'birds',
    icon: '🦜',
    tagline: 'Endemic Cloud & Lowland Rainforest',
    bestMonths: 'December – April and July – September (Driest windows)',
    sightingOdds: '95%+ Guaranteed',
    species: ['Sri Lanka Blue Magpie', 'Red-faced Malkoha', 'Purple-faced Langur', 'Hump-nosed Lizard'],
    timing: '6:30 AM – 11:00 AM (Bird feeding wave hours)',
    jeepCostBenchmark: 'Mandatory Forest Department licensed guide (~LKR 3,500)',
    ethicalGuidance: 'Wear leech socks and apply Dettol/Citronella spray around footwear ankles.',
    proTip: 'Look for mixed-species feeding flocks where up to 40 birds of 12 species move together through the canopy to flush out insects.'
  }
];

const SAFARI_FAQS = [
  {
    q: 'Which park is better for elephants: Yala, Udawalawe, or Minneriya?',
    a: 'For guaranteed wild elephants, Udawalawe is best year-round (over 500 elephants in a relatively open park). Between July and October, Minneriya/Kaudulla is world-class due to the Great Elephant Gathering (up to 300 elephants feeding together on lush reservoir grass). Yala has elephants, but travelers visit Yala primarily for leopards.'
  },
  {
    q: 'What is the best month for leopards in Yala?',
    a: 'Between February and July. As the dry season progresses, natural waterholes in Block 1 dry up, concentrating leopards, deer, and sloth bears around fewer water reservoirs. September and October are when Block 1 usually closes for drought rest.'
  },
  {
    q: 'How much does a safari jeep in Sri Lanka cost?',
    a: 'A private modified safari jeep (with driver) costs LKR 12,000–18,000 (~$40–$60 USD) for a half-day session (fits up to 6 passengers). You must also pay the Department of Wildlife Conservation (DWC) foreign entrance permit fees (~$30–$35 USD per adult).'
  },
  {
    q: 'Is whale watching in Mirissa ethical?',
    a: 'It depends on the boat operator. Avoid unlicensed speedboats that chase and harass whales at high speeds. Choose ethical WCA-registered operators (like Raja & the Whales) who shut off engines 100 meters away and educate passengers.'
  }
];

export default function WildlifePage() {
  const [activeFilter, setActiveFilter] = useState<WildlifeFilter>('all');

  const filtered = activeFilter === 'all'
    ? PARKS_DATA
    : PARKS_DATA.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#05140e] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Cinematic Navigation */}
      <header className="sticky top-0 z-50 bg-[#061c14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#032317] font-black text-xs shadow-md">
              CW
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight block leading-none">
                CeylonWander <span className="text-xs">🇱🇰</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Safari & Wildlife Engine
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-emerald-400 transition-colors">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-emerald-400 transition-colors">Itineraries</Link>
            <Link href="/train" className="hover:text-emerald-400 transition-colors">Scenic Train</Link>
            <Link href="/wildlife" className="text-emerald-400 font-extrabold">Safaris</Link>
            <Link href="/culture" className="hover:text-emerald-400 transition-colors">Culture & Poya</Link>
            <Link href="/food" className="hover:text-emerald-400 transition-colors">Food Guide</Link>
            <Link href="/toolkit" className="hover:text-emerald-400 transition-colors">Field Toolkit</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#032317] rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Launch Map</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-6">
          <span>🐾 Ethical Field Safari Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-serif">
          Sri Lanka Safari & Wildlife Guide: <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            When, Where & How to Spot Big Game
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          From the world’s highest leopard density in Yala to 300+ wild elephants at Minneriya Gathering and blue whales off Mirissa. 
          Discover accurate sighting probabilities, ethical safari standards, and fair jeep tariffs.
        </p>

        {/* Filter Tabs */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          {[
            { id: 'all', label: 'All Wildlife', icon: '✨' },
            { id: 'elephants', label: 'Wild Elephants', icon: '🐘' },
            { id: 'leopards', label: 'Leopards & Bears', icon: '🐆' },
            { id: 'marine', label: 'Whales & Reefs', icon: '🐋' },
            { id: 'birds', label: 'Endemic Birds', icon: '🦜' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as WildlifeFilter)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Parks Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((park) => (
            <div
              key={park.id}
              className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-emerald-950/40 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 bg-white/5 rounded-2xl inline-block">{park.icon}</span>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    {park.sightingOdds}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white font-serif group-hover:text-emerald-300 transition-colors">
                    {park.name}
                  </h3>
                  <span className="text-xs text-amber-300 font-bold block mt-0.5">
                    {park.tagline}
                  </span>
                </div>

                <div className="bg-black/30 p-3 rounded-2xl border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Prime Season:</span>
                    <strong className="text-white">{park.bestMonths}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Best Timing:</span>
                    <strong className="text-white">{park.timing}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-gray-400 font-medium">Jeep Benchmark:</span>
                    <strong className="text-emerald-400">{park.jeepCostBenchmark}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Key Wildlife:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {park.species.map((sp, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-emerald-200">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ethical & Insider tips */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-200 flex items-start gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 block font-bold">Ethical Rule:</strong>
                    <span>{park.ethicalGuidance}</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200 flex items-start gap-1.5">
                  <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block font-bold">Pro Tip:</strong>
                    <span>{park.proTip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO FAQs */}
        <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 mt-12">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Sri Lanka Safari & Wildlife Planning
            </h3>
          </div>

          <div className="space-y-4">
            {SAFARI_FAQS.map((faq, idx) => (
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

        {/* Bottom CTA */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="text-2xl font-black text-white font-serif">
            Find safari lodges and park gates on the map
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Switch to the vector map to see national park boundaries, driving corridors, and nearby attractions.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-xl text-sm font-black shadow-xl hover:scale-105 transition-all"
          >
            <Compass size={16} />
            <span>Launch Explorer Vector Map</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>CeylonWander 🇱🇰 • Cloudflare Colombo Edge</span>
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
