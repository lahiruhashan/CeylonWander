'use client';

import React, { useState } from 'react';
import { X, Phone, Check, Droplet, Bug } from 'lucide-react';

interface HealthFieldGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthFieldGuideModal({ isOpen, onClose }: HealthFieldGuideModalProps) {
  const [copiedAmbulance, setCopiedAmbulance] = useState(false);

  if (!isOpen) return null;

  const handleCopy1990 = () => {
    navigator.clipboard.writeText('1990');
    setCopiedAmbulance(true);
    setTimeout(() => setCopiedAmbulance(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-red-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
            <span>🏥 Medical Preparedness</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Health, Leech & First-Aid Field Guide</span>
            <span className="text-lg">🇱🇰</span>
          </h2>
          <p className="text-xs text-rose-200/90 mt-1 max-w-xl">
            Harmless land leech management, tap water truths, dengue prevention, and 24/7 private hospital emergency desks.
          </p>
        </div>

        {/* 1990 Emergency Ambulance Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 flex items-center justify-between gap-4 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-white/20 rounded-xl">🚑</span>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-rose-100 block">
                Free Nationwide 24/7 Emergency Dispatch
              </span>
              <strong className="text-lg font-black tracking-tight block">
                1990 Suwa Seriya Ambulance
              </strong>
            </div>
          </div>

          <button
            onClick={handleCopy1990}
            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-950 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            {copiedAmbulance ? <Check size={14} className="text-emerald-700" /> : <Phone size={14} />}
            <span>{copiedAmbulance ? '1990 Copied' : 'Dial 1990 (Free)'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* Section 1: The Land Leech (Koodallu) Protocol */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Bug size={14} className="text-amber-800" />
                <span>The Land Leech (Koodallu) Reality: Harmless, But Startling</span>
              </h3>
              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                Zero Disease Transmission
              </span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              If hiking through wet tea estates, Sinharaja, or Knuckles after rain, you will likely encounter tiny land leeches. <strong>Crucial reassurance:</strong> Sri Lankan land leeches do NOT carry Lyme disease, malaria, or dangerous pathogens.
            </p>

            <div className="grid sm:grid-cols-3 gap-2.5 pt-2 text-[11px] text-amber-950">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 space-y-1">
                <strong className="block text-amber-900">Prevention:</strong>
                <p>Wear high leech socks over your trousers. Rub a dry bar of bathing soap or spray Dettol/Citronella along your shoes and ankles.</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 space-y-1">
                <strong className="block text-amber-900">Removal:</strong>
                <p>Never yank a leech forcefully with fingers. Dab with table salt, fresh lime juice, or a soap lather: it will detach instantly without tearing skin.</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 space-y-1">
                <strong className="block text-amber-900">Aftercare:</strong>
                <p>Leech saliva contains a harmless natural anticoagulant; the small pinprick will bleed for 15 minutes. Wash with soap, apply an antiseptic, and cover with a plaster.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Water, Ice & Food Safety */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2.5">
            <h4 className="font-black text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Droplet size={14} className="text-blue-600" />
              <span>Safe Drinking Water & Ice Rules:</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-[11px] text-gray-700">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <strong className="text-gray-900 block">Tap Water is for Boiling Only</strong>
                <p>Do not drink unboiled municipal or well tap water. Stick to sealed bottles (verify the SLS certification cap seal) or filtered reverse-osmosis water stations.</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <strong className="text-gray-900 block">King Coconuts (Thambili)</strong>
                <p>Nature’s sterile hydration. Coconut water is opened freshly in front of you with a machete, is 100% sterile, and packed with vital natural electrolytes.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Recommended 24/7 Private Hospitals */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-gray-700">
              Top Private Hospitals with International Emergency Desks:
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 text-[11px]">
              <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                <strong className="text-rose-950 font-bold block">Colombo Central</strong>
                <p className="text-gray-600">Asiri Central Hospital / Lanka Hospitals</p>
                <div className="text-[10px] text-rose-800 font-semibold pt-1">Full ICU, trauma center & travel insurance direct billing.</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                <strong className="text-rose-950 font-bold block">Kandy Hill Country</strong>
                <p className="text-gray-600">Asiri Hospital Kandy</p>
                <div className="text-[10px] text-rose-800 font-semibold pt-1">Modern private medical center 10 mins from Kandy Lake.</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                <strong className="text-rose-950 font-bold block">Galle & South Coast</strong>
                <p className="text-gray-600">Asiri Hospital Galle / Ruhunu Hospital</p>
                <div className="text-[10px] text-rose-800 font-semibold pt-1">24/7 emergency care for surf injuries and coastal incidents.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            🚑 1990 is free from any mobile SIM, even with zero credit balance.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Health Guide
          </button>
        </div>
      </div>
    </div>
  );
}
