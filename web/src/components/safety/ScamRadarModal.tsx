'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Phone, Copy, Check } from 'lucide-react';

interface ScamRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SURVIVAL_PHRASES = [
  {
    sinhala: 'මීටරය දානවද?',
    phonetic: 'Meter eka daanawadha?',
    meaning: 'Will you turn on the meter?',
    tip: 'Essential before stepping into any three-wheeler outside Colombo.',
    badge: 'Transport'
  },
  {
    sinhala: 'එපා, ස්තූතියි',
    phonetic: 'Epā, sthuthiyi',
    meaning: 'No, thank you.',
    tip: 'Say this politely and walk away to dismiss persistent touts immediately.',
    badge: 'Street Smart'
  },
  {
    sinhala: 'කීයද?',
    phonetic: 'Kiyadha?',
    meaning: 'How much is this?',
    tip: 'Use at roadside fruit stalls, bakeries (short eats), and markets.',
    badge: 'Shopping'
  },
  {
    sinhala: 'සීනි අඩුවෙන්',
    phonetic: 'Sini aduwen',
    meaning: 'Less sugar, please.',
    tip: 'Sri Lankan milk tea and fruit juices are heavily sweetened by default!',
    badge: 'Food & Tea'
  },
  {
    sinhala: 'සැර අඩුවෙන්',
    phonetic: 'Sera aduwen',
    meaning: 'Less spicy / mild chili.',
    tip: 'Local village curries and kottu can be fiery hot for foreign palates.',
    badge: 'Food & Tea'
  },
  {
    sinhala: 'බොහොම ස්තූතියි',
    phonetic: 'Bohoma sthuthiyi',
    meaning: 'Thank you very much.',
    tip: 'Earns immediate smiles and warmth from locals everywhere.',
    badge: 'Courtesy'
  },
  {
    sinhala: 'සුබ දවසක්',
    phonetic: 'Subha dhavasak',
    meaning: 'Have a good day / Greetings.',
    tip: 'Traditional friendly morning or afternoon greeting.',
    badge: 'Courtesy'
  },
];

export default function ScamRadarModal({ isOpen, onClose }: ScamRadarModalProps) {
  const [copiedGps, setCopiedGps] = useState(false);
  const [copiedPhraseIdx, setCopiedPhraseIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyGps = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const text = `EMERGENCY SRI LANKA: My GPS is Latitude: ${pos.coords.latitude.toFixed(5)}, Longitude: ${pos.coords.longitude.toFixed(5)}. (Mage sthanaya: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)})`;
          navigator.clipboard.writeText(text);
          setCopiedGps(true);
          setTimeout(() => setCopiedGps(false), 3000);
        },
        () => {
          const text = "Emergency: Please send assistance to my location in Sri Lanka.";
          navigator.clipboard.writeText(text);
          setCopiedGps(true);
          setTimeout(() => setCopiedGps(false), 3000);
        }
      );
    }
  };

  const handleCopyPhrase = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPhraseIdx(idx);
    setTimeout(() => setCopiedPhraseIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-red-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-red-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
            <span>🇱🇰 Street-Smart Overseas Traveler Copilot</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Scam Radar & Sinhala Survival Kit</span>
            <span className="text-lg">🛡️</span>
          </h2>
          <p className="text-xs text-red-200/90 mt-1 max-w-lg">
            Avoid overpriced tourist traps, negotiate fairly, and communicate easily with friendly locals.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* 1. Scam Radar Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-950 flex items-center gap-1.5">
              <ShieldAlert size={15} className="text-red-600" />
              <span>Common Tourist Traps & How to Avoid Them</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-200 space-y-1">
                <span className="font-bold text-red-950 text-xs block">🌿 Unlicensed &quot;Spice Gardens&quot;</span>
                <p className="text-[11px] text-red-900 leading-relaxed">
                  Drivers often offer free stops at roadside gardens. You receive massages and demonstrations, then face intense pressure to buy $100–$200 herbal oils. 
                  <strong className="block mt-1 text-gray-800">Smart Fix:</strong> Buy pure spices at local central markets or supermarkets (Keells/Cargills) for a fraction of the cost.
                </p>
              </div>

              <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-200 space-y-1">
                <span className="font-bold text-red-950 text-xs block">💎 Gem Factory Certification Scams</span>
                <p className="text-[11px] text-red-900 leading-relaxed">
                  Touts claim their shop is the &quot;only government-certified&quot; outlet with 70% export tax rebates. Fake certificates are common.
                  <strong className="block mt-1 text-gray-800">Smart Fix:</strong> Genuine certification is only issued by the <em>National Gem & Jewellery Authority (NGJA)</em>.
                </p>
              </div>

              <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-200 space-y-1">
                <span className="font-bold text-red-950 text-xs block">🎣 Stilt Fishermen Photo Tipping</span>
                <p className="text-[11px] text-red-900 leading-relaxed">
                  Fishermen perched on poles in Koggala/Weligama during midday are posed models. Snapping a photo brings aggressive demands for LKR 2,000+.
                  <strong className="block mt-1 text-gray-800">Smart Fix:</strong> Agree on a modest fee (e.g. LKR 500) before taking photos, or visit at dawn to see real working fishermen.
                </p>
              </div>

              <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-200 space-y-1">
                <span className="font-bold text-red-950 text-xs block">🅿️ Fake Beach Parking Fees</span>
                <p className="text-[11px] text-red-900 leading-relaxed">
                  Local men with whistles wave tuk-tuks or rented scooters into public beach shoulders and demand LKR 300–500 parking fees.
                  <strong className="block mt-1 text-gray-800">Smart Fix:</strong> Ask for an official municipal ticket with a government revenue stamp.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Phonetic Sinhala Survival Phrase Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center justify-between">
              <span>Essential Sinhala Phrases (Phonetic &amp; Sinhala)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Tap card to copy</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {SURVIVAL_PHRASES.map((phrase, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopyPhrase(phrase.phonetic, idx)}
                  className="bg-white p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all space-y-1 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {phrase.badge}
                    </span>
                    <button className="text-gray-400 group-hover:text-emerald-700 transition-colors">
                      {copiedPhraseIdx === idx ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    </button>
                  </div>

                  <div className="text-sm font-black text-gray-900">{phrase.phonetic}</div>
                  <div className="text-xs text-gray-600 font-medium">{phrase.meaning}</div>
                  <div className="text-[10px] text-gray-400 italic pt-0.5">{phrase.tip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 1-Tap Emergency SOS & 1990 Hub */}
          <div className="bg-gradient-to-r from-red-950 to-rose-950 text-white p-4.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚨</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-200">
                    Emergency Hotline &amp; GPS Hub
                  </h4>
                  <span className="text-[10px] text-red-300">Free 24/7 National Dispatch</span>
                </div>
              </div>

              <button
                onClick={handleCopyGps}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                {copiedGps ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedGps ? 'Copied GPS!' : 'Copy My GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <a
                href="tel:1990"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone size={13} className="text-emerald-400" />
                <span>1990 (Suwasariya Ambulance)</span>
              </a>
              <a
                href="tel:1912"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone size={13} className="text-blue-400" />
                <span>1912 (Tourist Police Helpline)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-900 hover:bg-red-950 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Survival Kit
          </button>
        </div>
      </div>
    </div>
  );
}
