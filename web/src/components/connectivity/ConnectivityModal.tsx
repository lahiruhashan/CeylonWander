'use client';

import React, { useState } from 'react';
import { X, WifiOff, Smartphone, ShieldCheck } from 'lucide-react';

interface ConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectivityModal({ isOpen, onClose }: ConnectivityModalProps) {
  const [activeTab, setActiveTab] = useState<'sim' | 'deadzones'>('sim');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
            <span>📶 Digital Field Readiness</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Airport SIM, eSIM & Mountain Dead-Zones</span>
            <span className="text-lg">📡</span>
          </h2>
          <p className="text-xs text-blue-200/90 mt-1 max-w-xl">
            Airport telco booth comparisons, 30-day tourist data packages, and high-altitude mountain signal drop-offs.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-blue-50/70 p-3.5 border-b border-blue-100 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('sim')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sim'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white text-blue-950 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Smartphone size={13} />
            <span>Airport SIM & eSIM Packages</span>
          </button>
          <button
            onClick={() => setActiveTab('deadzones')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'deadzones'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white text-blue-950 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <WifiOff size={13} />
            <span>Mountain Signal Dead-Zones</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {activeTab === 'sim' ? (
            <div className="space-y-5">
              {/* Airport Telco Booth Breakdown */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Dialog */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-950">Dialog Axiata</span>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Best Overall Coverage
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Largest network provider in Sri Lanka. Superior 4G/5G coverage in tea hill-country, remote coastal stretches, and expressway corridors.
                  </p>
                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-[11px] space-y-1">
                    <div className="font-bold text-blue-950">Tourist Package: ~LKR 2,500 – 3,500 ($8 – $11 USD)</div>
                    <div className="text-gray-600">30–50 GB Data • 30 Days Validity • International calling credits included</div>
                    <div className="text-emerald-700 font-semibold">Booth location: Directly outside CMB customs exit doors.</div>
                  </div>
                </div>

                {/* Mobitel */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-950">SLT-Mobitel</span>
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      State-Backed Reliability
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    National telecommunications carrier. Excellent deep rural penetration and dependable customer service desks.
                  </p>
                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-[11px] space-y-1">
                    <div className="font-bold text-blue-950">Tourist Package: ~LKR 2,200 – 3,000 ($7 – $10 USD)</div>
                    <div className="text-gray-600">30–40 GB Data • 30 Days Validity • High-speed 4G LTE</div>
                    <div className="text-emerald-700 font-semibold">Booth location: Arrivals hall counter 3.</div>
                  </div>
                </div>
              </div>

              {/* eSIM vs Physical SIM Truths */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 p-4 rounded-2xl space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-700" />
                  <span>Tourist Registration & eSIM Guidelines:</span>
                </h4>
                <div className="grid sm:grid-cols-3 gap-3 text-gray-700 text-[11px]">
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <strong className="text-gray-900 block">1. Passport is Required</strong>
                    <p>Sri Lankan law requires showing your original passport for biometric SIM registration. The booth takes 3 minutes to activate it.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <strong className="text-gray-900 block">2. eSIM QR Activation</strong>
                    <p>Dialog and Mobitel both support QR eSIM activation on iPhones and modern Android phones without removing your home country physical SIM.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <strong className="text-gray-900 block">3. USSD Balance Codes</strong>
                    <p>Dial <code>#123#</code> (Dialog) or <code>#131#</code> (Mobitel) anytime to check your remaining gigabytes and voice credit instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-[11px] text-amber-950 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>
                  <strong>Offline Maps Warning:</strong> Mountain ravines and dense canopies frequently block 4G signal. Always download regional packs before ascending into these valleys!
                </span>
              </div>

              {/* Dead-zone Cards */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">Knuckles Mountain Range</span>
                    <span className="text-[10px] font-black uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded-md">Zero Signal</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Signal cuts out completely after leaving Deanston or Riverston gap. Hiring an accredited local trek guide and carrying an offline GPS track is mandatory.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">Sinharaja Rainforest</span>
                    <span className="text-[10px] font-black uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded-md">Zero Signal</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Dense triple-layer jungle canopy blocks both cellular reception and GPS satellite locks in deeper valleys. Treks must be escorted by Forest Department trackers.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">Horton Plains & World&apos;s End</span>
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Patchy 2G/No Data</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Signal drops after the Pattipola ticket booth. The 9km circular trail to World&apos;s End and Baker&apos;s Falls has near-zero cellular data.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">Adam&apos;s Peak Staircase</span>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Decent at Summit</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Signal drops during mid-mountain forested stairs, but Dialog operates an active micro-tower at the sacred temple summit for calls during sunrise.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            💡 Buying your SIM at CMB Airport arrival hall takes less than 5 minutes and is 100% price-regulated.
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
