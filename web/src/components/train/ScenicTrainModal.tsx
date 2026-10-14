'use client';

import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

interface ScenicTrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TrainRoute = 'kandy-ella' | 'colombo-galle';

export default function ScenicTrainModal({ isOpen, onClose }: ScenicTrainModalProps) {
  const [activeRoute, setActiveRoute] = useState<TrainRoute>('kandy-ella');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
            <span>🇱🇰 Sri Lanka Railways Bucket-List Copilot</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>The Iconic Blue Train Guide</span>
            <span className="text-lg">🚂</span>
          </h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-lg">
            Essential intelligence on which side to sit on, seat classes, photo stops, and 30-day ticket booking.
          </p>

          {/* Route Switcher Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveRoute('kandy-ella')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeRoute === 'kandy-ella'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>⛰️ Kandy ⇄ Ella (Hills)</span>
            </button>
            <button
              onClick={() => setActiveRoute('colombo-galle')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeRoute === 'colombo-galle'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>🌊 Colombo ⇄ Galle (Coast)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {activeRoute === 'kandy-ella' ? (
            <>
              {/* Golden Rule: Which Side to Sit */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪑</span>
                  <h3 className="text-sm font-black text-amber-950">
                    The Golden Rule: Which Side to Sit On?
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-xs">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide block mb-0.5">
                      Leg 1: Kandy → Nanu Oya (Nuwara Eliya)
                    </span>
                    <div className="text-base font-black text-amber-900">👉 SIT ON THE RIGHT SIDE</div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      Endless rolling green tea terraces, misty valleys, and river gorge drops.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-xs">
                    <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wide block mb-0.5">
                      Leg 2: Nanu Oya → Ella
                    </span>
                    <div className="text-base font-black text-amber-900">👈 SIT ON THE LEFT SIDE</div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      St. Clair & Devon cascading falls, Idalgashinna cliff ridges, and the iconic Nine Arches Viaduct approach.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seat Class Reality Check */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                  Seat Class Reality Check (Don&apos;t Make This Mistake!)
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-xs">1st Class AC</span>
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 rounded">Not Recommended</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Air-conditioned with sealed windows. <strong>You cannot open the windows or lean out for photos</strong>. Reflections ruin photography.
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300 space-y-1 ring-1 ring-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 text-xs">2nd Class Reserved</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 rounded">Best Choice 🏆</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-snug">
                      Wide opening windows, overhead breezy fans, guaranteed numbered seat, and open door photo opportunities.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-xs">3rd Class Unreserved</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 rounded">Authentic Local</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Tickets bought at station on the day for ~$1.50 USD. Very crowded; be prepared to stand until seats clear.
                    </p>
                  </div>
                </div>
              </div>

              {/* Station Elevation Climb */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                    Main Line Mountain Climb Profile
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold">~6–7 Hours Total</span>
                </div>

                <div className="flex items-center justify-between text-center overflow-x-auto pb-2 gap-2 text-[10px]">
                  <div className="shrink-0 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200">
                    <span className="font-black block text-blue-900">Kandy</span>
                    <span className="text-gray-500">500m ASL</span>
                  </div>
                  <span className="text-gray-300">→</span>
                  <div className="shrink-0 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200">
                    <span className="font-black block text-blue-900">Hatton</span>
                    <span className="text-gray-500">1,260m ASL</span>
                  </div>
                  <span className="text-gray-300">→</span>
                  <div className="shrink-0 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200">
                    <span className="font-black block text-blue-900">Nanu Oya</span>
                    <span className="text-gray-500">1,610m ASL</span>
                  </div>
                  <span className="text-gray-300">→</span>
                  <div className="shrink-0 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-300 ring-1 ring-amber-400">
                    <span className="font-black block text-amber-900">Pattipola</span>
                    <span className="text-amber-700 font-bold">1,898m (Peak)</span>
                  </div>
                  <span className="text-gray-300">→</span>
                  <div className="shrink-0 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200">
                    <span className="font-black block text-blue-900">Ella</span>
                    <span className="text-gray-500">1,041m ASL</span>
                  </div>
                </div>
              </div>

              {/* Official Booking Secret */}
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info size={15} className="text-blue-700 shrink-0" />
                  <span>The Official 30-Day Booking Secret:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-900">
                  Sri Lanka Railways opens online seat reservations at <strong>10:00 AM Sri Lanka time exactly 30 days before</strong> travel on their official portal (<a href="https://seatreservation.railway.gov.lk" target="_blank" rel="noreferrer" className="underline font-bold text-blue-800">seatreservation.railway.gov.lk</a>). 2nd Class reserved tickets cost under ~LKR 3,000 (~$10 USD). Do not pay touts $40–$50 USD!
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Colombo to Galle Coastal Line */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌊</span>
                  <h3 className="text-sm font-black text-teal-950">
                    Colombo to Galle Coastal Railway (Samudra Devi)
                  </h3>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  One of the few railway tracks in the world where waves literally lap against the tracks.
                </p>

                <div className="bg-white p-3.5 rounded-xl border border-teal-200 mt-2">
                  <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wide block mb-0.5">
                    Ocean View Side
                  </span>
                  <div className="text-base font-black text-teal-900">👉 ALWAYS SIT ON THE RIGHT SIDE (Heading South)</div>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    Heading South towards Galle/Matara, the ocean is on your right. Golden sand, palm trees, and fishing boats run right beside your window.
                  </p>
                </div>
              </div>

              {/* Coastal Train Key Stops */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                  Key Coastal Stops
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 font-bold">Colombo Fort</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 font-bold">Mount Lavinia</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 font-bold">Bentota Beach</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 font-bold">Hikkaduwa Surf</div>
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 font-black text-emerald-900 col-span-2 sm:col-span-4">
                    Galle Fort (Historic Ramparts) • ~2h 15m travel time
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-gray-500 font-medium">
            Sri Lanka Railways (CGR) Network
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Train Guide
          </button>
        </div>
      </div>
    </div>
  );
}
