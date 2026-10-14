'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface PoyaCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POYA_SCHEDULE = [
  { name: 'Vap Full Moon Poya', month: 'October', sign: 'End of Buddhist Rains Retreat (Katina season)' },
  { name: 'Il Full Moon Poya', month: 'November', sign: 'First 60 Buddhist missionaries sent forth' },
  { name: 'Unduvap Full Moon Poya', month: 'December', sign: "Sanghamitta brings Sacred Bo Sapling; Adam's Peak pilgrimage opens" },
  { name: 'Duruthu Full Moon Poya', month: 'January', sign: "Buddha's first visit to Sri Lanka (Mahiyangana)" },
  { name: 'Navam Full Moon Poya', month: 'February', sign: 'First Buddhist Council & Gangaramaya Navam Perahera in Colombo' },
  { name: 'Medin Full Moon Poya', month: 'March', sign: "Buddha visits his father King Suddhodana's palace" },
  { name: 'Bak Full Moon Poya', month: 'April', sign: 'Sinhala & Tamil Solar New Year month' },
  { name: 'Vesak Full Moon Poya', month: 'May', sign: '🌟 Most Sacred: Birth, Enlightenment, and Parinirvana of the Buddha' },
  { name: 'Poson Full Moon Poya', month: 'June', sign: 'Introduction of Buddhism to Sri Lanka at Mihintale rock' },
  { name: 'Esala Full Moon Poya', month: 'July / August', sign: 'First Sermon (Dhammacakkappavattana Sutta) & Kandy Dalada Perahera' },
];

export default function PoyaCalendarModal({ isOpen, onClose }: PoyaCalendarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
            <span>🇱🇰 Sacred Cultural Calendar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Full Moon Poya Day Guide</span>
            <span className="text-lg">🌕</span>
          </h2>
          <p className="text-xs text-purple-200/90 mt-1 max-w-lg">
            Every full moon is a sacred national holiday in Sri Lanka. Here is what overseas travelers must know.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* The 3 Golden Rules on Poya Days */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-600" />
              <span>The 3 Essential Poya Rules for Tourists:</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-xl border border-purple-200/80 shadow-xs space-y-1">
                <span className="text-xl block">🚫🍺</span>
                <h4 className="font-bold text-gray-900 text-xs">Nationwide Alcohol Ban</h4>
                <p className="text-[11px] text-gray-600 leading-snug">
                  By law, all bars, restaurants, hotel lounges, and supermarket wine shops are strictly prohibited from serving or selling alcohol.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-200/80 shadow-xs space-y-1">
                <span className="text-xl block">🛕🤍</span>
                <h4 className="font-bold text-gray-900 text-xs">Vast Temple Crowds</h4>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Devotees dressed in pure white gather by the tens of thousands at Dalada Maligawa (Kandy), Anuradhapura, and Kelaniya for Sil meditation.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-200/80 shadow-xs space-y-1">
                <span className="text-xl block">🍧🎁</span>
                <h4 className="font-bold text-gray-900 text-xs">Free Food Dansalas</h4>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Especially on Vesak (May) and Poson (June), locals give away free curries, ice cream, and iced tea at roadside stalls to all travelers!
                </p>
              </div>
            </div>
          </div>

          {/* 12-Month Poya Roster */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center justify-between">
              <span>Full Moon Poya Roster & Significance</span>
              <span className="text-[10px] text-purple-700 font-bold">Monthly Full Moon</span>
            </h4>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
              {POYA_SCHEDULE.map((p, idx) => (
                <div key={idx} className="p-3 flex items-start justify-between gap-3 hover:bg-purple-50/50 transition-colors">
                  <div>
                    <span className="font-black text-gray-900 text-xs block">{p.name}</span>
                    <span className="text-[11px] text-gray-500 leading-relaxed block mt-0.5">{p.sign}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full shrink-0">
                    {p.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Festival Highlight: Kandy Esala Perahera */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-4 rounded-2xl space-y-2 text-amber-950">
            <span className="text-[10px] font-black uppercase tracking-wide bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md inline-block">
              Asia&apos;s Grandest Cultural Spectacle
            </span>
            <h4 className="text-sm font-black text-amber-950">
              The Kandy Esala Perahera (July / August)
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-900">
              For 10 consecutive nights leading to the Nikini Poya, over 100 tusker elephants draped in golden silk, 
              fire dancers, and traditional Kandyan drummers process through the torchlit streets of Kandy to honor the Sacred Tooth Relic.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-950 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Poya Guide
          </button>
        </div>
      </div>
    </div>
  );
}
