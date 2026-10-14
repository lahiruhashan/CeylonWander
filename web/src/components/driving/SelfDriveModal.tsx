'use client';

import React, { useState } from 'react';
import { X, Car, ShieldAlert, FileText } from 'lucide-react';

interface SelfDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelfDriveModal({ isOpen, onClose }: SelfDriveModalProps) {
  const [vehicleType, setVehicleType] = useState<'tuktuk' | 'car'>('tuktuk');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <span>🛺 Road Survival & Legal Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Self-Drive Tuk-Tuk & Car Rental Navigator</span>
            <span className="text-lg">🇱🇰</span>
          </h2>
          <p className="text-xs text-amber-200/90 mt-1 max-w-xl">
            AAC driver license endorsement requirements, police checkpoints, fuel grades, and surviving narrow mountain passes.
          </p>
        </div>

        {/* Vehicle Toggle */}
        <div className="bg-amber-50/70 p-3.5 border-b border-amber-100 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setVehicleType('tuktuk')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              vehicleType === 'tuktuk'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-stone-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🛺 Self-Drive Tuk-Tuk</span>
          </button>
          <button
            onClick={() => setVehicleType('car')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              vehicleType === 'car'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-stone-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Car size={13} />
            <span>Rental Car / SUV</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-800 text-xs">
          {/* Critical Legal Warning Banner */}
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded-2xl space-y-2 text-red-950">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5">
              <ShieldAlert size={15} className="text-red-700" />
              <span>Crucial Legal Requirement: IDP Alone is NOT Valid!</span>
            </h3>
            <p className="text-xs leading-relaxed text-red-900/90">
              Under Sri Lankan transport law, an International Driving Permit (IDP) or foreign national license is <strong>not valid by itself</strong>. You must obtain an official <strong>AAC endorsement</strong> or temporary Sri Lankan driving permit before touching the steering wheel. Reputable rental platforms (like TukTuk Rental) handle this paperwork in advance for ~$30-$40 USD.
            </p>
          </div>

          {/* Step-by-Step Permit Process */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <FileText size={14} className="text-stone-700" />
              <span>How to Legally Get Endorsed in Colombo:</span>
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 text-stone-700 text-[11px]">
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-stone-950 block">Option A: Rental Company Advance</strong>
                <p>Send a photo of your passport and IDP to your verified rental company 4 days prior. They have the AAC sticker waiting on your dashboard.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-stone-950 block">Option B: In-Person AAC Office</strong>
                <p>Automobile Association of Ceylon (AAC), Colombo 03. Bring passport, 2 photos, and IDP. Issued over-the-counter in ~45 minutes for LKR ~7,500.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-stone-950 block">Option C: DMT Werahera</strong>
                <p>Department of Motor Traffic in Werahera. For foreigners without an IDP who only hold a national home license. Takes half a day.</p>
              </div>
            </div>
          </div>

          {/* Road Rules & The "Leyland Bus Rule" */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-stone-900">
              The Unwritten Rules of the Sri Lankan Road:
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-red-700 block text-xs">⚠️ The Private Red/Blue Bus Rule</strong>
                <p className="text-stone-600 leading-relaxed">
                  Private intercity buses (Ashok Leyland) drive on strict commission schedules. They overtake aggressively around blind mountain bends and will flash headlights: <strong>this means they are NOT stopping</strong>. Always yield right-of-way and move to the shoulder.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-amber-800 block text-xs">🔊 The Friendly Beep Etiquette</strong>
                <p className="text-stone-600 leading-relaxed">
                  A short double beep (<em>beep-beep</em>) in Sri Lanka is NOT an aggressive insult—it is polite communication meaning: &quot;I am behind you/overtaking on your right&quot; or &quot;Thank you for yielding&quot;.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-emerald-800 block text-xs">⛰️ Hairpin Downhill Gear Control</strong>
                <p className="text-stone-600 leading-relaxed">
                  When descending hills (e.g. Nuwara Eliya to Ella), shift your tuk-tuk or car into <strong>2nd gear</strong> to use engine braking. Riding the foot brakes continuously down 1,000 meters causes brake fluid boiling and complete brake failure!
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <strong className="text-blue-800 block text-xs">⛽ Fuel Station Etiquette</strong>
                <p className="text-stone-600 leading-relaxed">
                  All filling stations (Ceypetco, Lanka IOC, Sinopec) are full-service with attendants. Tuk-tuks use standard <strong>Petrol 92 Octane</strong>. Say: &quot;Full tank petrol 92&quot;. Pay attendant directly in cash or card.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-500 font-medium">
            🇱🇰 Traffic drives on the LEFT side of the road in Sri Lanka.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Driving Guide
          </button>
        </div>
      </div>
    </div>
  );
}
