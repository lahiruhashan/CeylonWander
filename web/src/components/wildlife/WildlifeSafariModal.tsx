'use client';

import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface WildlifeSafariModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WildlifeCategory = 'all' | 'elephants' | 'leopards' | 'marine' | 'birds';

interface ParkGuide {
  id: string;
  name: string;
  category: 'elephants' | 'leopards' | 'marine' | 'birds';
  icon: string;
  badge: string;
  bestMonths: string;
  sightingOdds: '95%+ Guaranteed' | 'High (70-80%)' | 'Moderate (40-60%)';
  species: string[];
  timing: string;
  jeepCostBenchmark: string;
  ethicalGuidance: string;
  proTip: string;
}

const PARKS_DATA: ParkGuide[] = [
  {
    id: 'udawalawe',
    name: 'Udawalawe National Park',
    category: 'elephants',
    icon: '🐘',
    badge: 'Year-Round Guaranteed Elephants',
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
    badge: 'The Great Elephant Gathering',
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
    badge: 'World’s Highest Leopard Density',
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
    badge: 'Ancient Land of Natural Lakes',
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
    badge: 'Blue Whale Migration Highway',
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
    name: 'Trincomalee / Pigeon Island',
    category: 'marine',
    icon: '🤿',
    badge: 'Summer Marine Safari & Coral Reef',
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
    badge: 'Endemic Cloud & Lowland Rainforest',
    bestMonths: 'December – April and July – September (Driest windows)',
    sightingOdds: '95%+ Guaranteed',
    species: ['Sri Lanka Blue Magpie', 'Red-faced Malkoha', 'Purple-faced Langur', 'Hump-nosed Lizard'],
    timing: '6:30 AM – 11:00 AM (Bird feeding wave hours)',
    jeepCostBenchmark: 'Mandatory Forest Department licensed guide (~LKR 3,500)',
    ethicalGuidance: 'Wear leech socks and apply Dettol/Citronella spray around footwear ankles.',
    proTip: 'Look for mixed-species feeding flocks where up to 40 birds of 12 species move together through the canopy to flush out insects.'
  }
];

export default function WildlifeSafariModal({ isOpen, onClose }: WildlifeSafariModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<WildlifeCategory>('all');
  const [selectedPark, setSelectedPark] = useState<ParkGuide>(PARKS_DATA[0]);

  if (!isOpen) return null;

  const filteredParks = selectedCategory === 'all'
    ? PARKS_DATA
    : PARKS_DATA.filter(p => p.category === selectedCategory);

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
            <span>🐾 Field Safari Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>National Park & Wildlife Calendar</span>
            <span className="text-lg">🐘</span>
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
            Where and when to spot wild leopards, elephant gathering herds, sloth bears, and blue whales ethically.
          </p>
        </div>

        {/* Category Pills */}
        <div className="bg-emerald-50/70 p-3.5 border-b border-emerald-100 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: 'All Wildlife', icon: '✨' },
            { id: 'elephants', label: 'Elephants', icon: '🐘' },
            { id: 'leopards', label: 'Leopards & Bears', icon: '🐆' },
            { id: 'marine', label: 'Whales & Marine', icon: '🐋' },
            { id: 'birds', label: 'Endemic Birds', icon: '🦜' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as WildlifeCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-emerald-950 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* Park Selection Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredParks.map(park => (
              <div
                key={park.id}
                onClick={() => setSelectedPark(park)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedPark.id === park.id
                    ? 'bg-emerald-50/80 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{park.icon}</span>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                      {park.sightingOdds}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-gray-900">{park.name}</h4>
                  <span className="text-[11px] text-emerald-700 font-semibold">{park.badge}</span>
                </div>

                <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100 flex items-center justify-between">
                  <span>Best: {park.bestMonths}</span>
                  <span className="text-emerald-800 font-bold">Inspect Details →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Park Deep Dive Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider block">
                  Field Guide Deep Dive
                </span>
                <h3 className="text-xl font-black flex items-center gap-2 mt-0.5">
                  <span>{selectedPark.icon}</span>
                  <span>{selectedPark.name}</span>
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-emerald-300 uppercase font-bold block">Prime Window</span>
                <span className="text-xs font-bold text-white">{selectedPark.bestMonths}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Key Wildlife Species</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedPark.species.map((sp, idx) => (
                    <span key={idx} className="bg-emerald-800/80 px-2 py-0.5 rounded-md text-[11px] text-white">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Safari Hours & Timing</span>
                <p className="text-white font-medium">{selectedPark.timing}</p>
                <div className="text-[11px] text-emerald-200 pt-1">
                  <strong>Jeep benchmark:</strong> {selectedPark.jeepCostBenchmark}
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-500/30 text-xs text-emerald-100 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Ethical Wildlife Observation:</strong>
                  <span>{selectedPark.ethicalGuidance}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-white/10 text-amber-200">
                <span className="text-amber-400 shrink-0">💡</span>
                <div>
                  <strong className="text-white block mb-0.5">Local Insider Tip:</strong>
                  <span>{selectedPark.proTip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            🐘 CeylonCopilot promotes zero-harassment ethical safari operators.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
