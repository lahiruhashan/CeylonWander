'use client';

import React, { useState } from 'react';
import { 
  PlaneLanding, 
  CreditCard, 
  Wifi, 
  Car, 
  Bus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Compass
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { VERIFIED_PRICES } from '@/data/verified_prices_data';

export default function AirportArrivalGuide() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [firstNightChoice, setFirstNightChoice] = useState<'negombo' | 'colombo'>('negombo');

  const simPrices = VERIFIED_PRICES.filter(p => p.category === 'sim');
  const busPrice = VERIFIED_PRICES.find(p => p.id === 'price-cmb-bus-187');
  const taxiColombo = VERIFIED_PRICES.find(p => p.id === 'price-cmb-colombo-taxi');
  const taxiNegombo = VERIFIED_PRICES.find(p => p.id === 'price-cmb-negombo-taxi');

  const steps = [
    {
      num: 1,
      id: 'immigration',
      title: 'Immigration & Customs',
      subtitle: 'Clear Border Control in ~20-35 mins',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <h4 className="font-semibold text-emerald-400 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} /> ETA Verification (Avoid Scam Websites)
            </h4>
            <p className="text-neutral-300 text-xs leading-relaxed">
              Ensure you applied through the official government portal (or verified online ETA system). Never pay $100+ on predatory third-party visa agencies. Keep a digital copy or printout of your approval slip ready with your passport.
            </p>
          </div>

          <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-xl p-4">
            <h4 className="font-semibold text-neutral-200 mb-1">The Unique CMB Duty-Free Quirks</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">
              After customs and baggage reclaim, you will walk through the world’s most unique duty-free concourse selling washing machines, TVs, and blenders (for returning expats). Don’t be alarmed! You can pick up international wine or spirits here if desired, as alcohol sales are restricted during monthly Poya full-moon days.
            </p>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      id: 'atms',
      title: 'Fee-Free ATMs & Currency',
      subtitle: 'Avoid 10-15% private airport spreads',
      icon: CreditCard,
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="bg-neutral-800/70 border border-neutral-700/70 rounded-xl p-4">
            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> Which ATM to Use in the Arrivals Hall
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Bank of Ceylon (BOC) & Commercial Bank:</strong> Most reliable for foreign Visa/Mastercards with standard interbank network rates and no exorbitant local ATM surcharge.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">!</span>
                <div>
                  <strong className="text-white">Declining Dynamic Currency Conversion (DCC):</strong> When the ATM asks whether to charge in your home currency (USD/EUR/GBP) or Sri Lankan Rupees (LKR), <em className="text-amber-300 font-bold">ALWAYS choose LKR</em>. Let your home bank handle conversion to save 6–9%.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400">•</span>
                <div>
                  <strong className="text-white">Cash recommendation:</strong> Withdraw Rs 20,000–30,000 (~$65–$100) to start. Tuk-tuks, street stalls, and entrance tickets do not take cards.
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      id: 'sims',
      title: 'Tourist SIMs (Dialog vs Mobitel)',
      subtitle: 'Exit customs & turn left',
      icon: Wifi,
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p className="text-xs text-neutral-400">
            Right as you exit into the public arrivals lobby, official telecom counters stand lined up side-by-side. Staff will activate the SIM and test your data connection on your phone in under 3 minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {simPrices.map((sim) => (
              <div key={sim.id} className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">{sim.name}</span>
                    <VerifiedBadge verifiedOn={sim.verifiedOn} sourceType={sim.sourceType} sourceName={sim.sourceName} sourceUrl={sim.sourceUrl} />
                  </div>
                  <div className="text-emerald-400 font-black text-lg">
                    Rs {sim.amountMinLkr.toLocaleString()} – {sim.amountMaxLkr.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">(~${Math.round(sim.amountMinLkr / 305)} USD)</span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                    {sim.notes || sim.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-700/50 text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Coverage: {sim.id.includes('dialog') ? 'Highest in Mountains' : 'Strong Nationwide'}</span>
                  <span className="text-emerald-400 font-medium">Passport Req.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 4,
      id: 'touts',
      title: 'Terminal Exit & Avoiding Touts',
      subtitle: 'Ignore "Official Airport Taxi" solicitations',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
            <h4 className="font-bold text-rose-400 text-sm mb-1 flex items-center gap-2">
              <AlertTriangle size={16} /> The #1 Scam Targeting New Arrivals
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              As soon as you walk past the glass automatic doors, touts in suits with fake badges will offer &ldquo;Official Airport Taxi&rdquo; quoting $50 to $80 to Colombo or Negombo. 
              <strong className="text-white block mt-1">Politely decline with a firm &ldquo;No thank you, my ride is booked&rdquo; and keep walking.</strong>
            </p>
          </div>

          <div className="bg-neutral-800/70 border border-neutral-700/70 rounded-xl p-4 text-xs space-y-2">
            <h5 className="font-bold text-white text-sm">Where Ride-Hails (PickMe & Uber) Pick Up</h5>
            <p className="text-neutral-300 leading-relaxed">
              Due to airport concession rules, PickMe and Uber drivers cannot park directly at the arrivals curb. 
              Walk out of the arrivals doors, cross the covered pedestrian walkway across the first roadway, and head toward the outer car park pickup bays.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium pt-1">
              <CheckCircle2 size={14} /> PickMe works best for Sri Lanka; Uber is a solid second option.
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 5,
      id: 'transport',
      title: 'Airport Exit: Bus vs Ride-Hail',
      subtitle: 'Compare real prices and travel times',
      icon: Car,
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Bus 187 */}
            {busPrice && (
              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Bus size={14} className="text-sky-400" /> Bus #187 (Expressway)
                  </span>
                </div>
                <div className="text-emerald-400 font-bold text-base mt-1">
                  Rs {busPrice.amountMinLkr} – {busPrice.amountMaxLkr} <span className="text-xs text-neutral-400 font-normal">(~${(busPrice.amountMinLkr / 305).toFixed(2)})</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                  <Clock size={11} /> 45-60 min to Colombo Fort
                </div>
                <p className="text-xs text-neutral-300 mt-2">
                  Air-conditioned government expressway coach. Departs bus stand every 30 mins. Best for solo backpackers.
                </p>
              </div>
            )}

            {/* Ridehail Colombo */}
            {taxiColombo && (
              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Car size={14} className="text-emerald-400" /> PickMe/Uber to Colombo
                  </span>
                </div>
                <div className="text-emerald-400 font-bold text-base mt-1">
                  Rs {taxiColombo.amountMinLkr.toLocaleString()} – {taxiColombo.amountMaxLkr.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">(~${Math.round(taxiColombo.amountMinLkr / 305)} USD)</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                  <Clock size={11} /> 35-45 min via E03 Expressway
                </div>
                <p className="text-xs text-neutral-300 mt-2">
                  Door-to-door AC car. Includes expressway toll. Book via PickMe app while walking to outer car park.
                </p>
              </div>
            )}

            {/* Ridehail Negombo */}
            {taxiNegombo && (
              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Compass size={14} className="text-amber-400" /> PickMe/Tuk to Negombo
                  </span>
                </div>
                <div className="text-emerald-400 font-bold text-base mt-1">
                  Rs {taxiNegombo.amountMinLkr.toLocaleString()} – {taxiNegombo.amountMaxLkr.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">(~${Math.round(taxiNegombo.amountMinLkr / 305)} USD)</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                  <Clock size={11} /> 15-20 min direct
                </div>
                <p className="text-xs text-neutral-300 mt-2">
                  Negombo is 8km north of airport. Zero expressway needed. Best if your flight lands after 18:00.
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-sky-950/60 border-b border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
              <PlaneLanding size={14} /> Bandaranayake International Airport (CMB)
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Airport Arrival Copilot
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Step-by-step guidance from the moment your wheels touch the tarmac to your first night hotel bed. Avoid tourist touts, get fee-free cash, and connect fast.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-800/80 px-4 py-2.5 rounded-xl border border-neutral-700/60 text-xs text-neutral-300">
            <Clock size={15} className="text-emerald-400 shrink-0" />
            <span>Avg time from gate to taxi: <strong>35 - 50 mins</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-neutral-800 bg-neutral-950/50">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.num)}
              className={`p-3.5 text-left border-b-2 transition-all flex flex-col gap-1 ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  STEP {s.num}
                </span>
                <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-neutral-500'} />
              </div>
              <span className="text-xs font-bold truncate mt-1">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Content */}
      <div className="p-6 md:p-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Step {activeStep}: {steps[activeStep - 1].title}</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {steps[activeStep - 1].subtitle}
          </p>
        </div>

        {steps[activeStep - 1].content}

        {/* Step Navigation Controls */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous Step
          </button>
          <div className="text-xs text-neutral-500">
            Step {activeStep} of {steps.length}
          </div>
          <button
            onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
            disabled={activeStep === steps.length}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* First Night Decision Matrix */}
      <div className="bg-neutral-950 border-t border-neutral-800 p-6 md:p-8">
        <div className="max-w-2xl mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Compass size={18} className="text-sky-400" />
            First Night Dilemma: Negombo vs Colombo?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Bandaranaike Airport is in Katunayake (closer to Negombo than Colombo). Choose your arrival timing to see our tactical recommendation:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setFirstNightChoice('negombo')}
            className={`p-4 rounded-xl border text-left transition-all ${
              firstNightChoice === 'negombo'
                ? 'border-emerald-500/80 bg-emerald-950/20 text-white ring-1 ring-emerald-500/50'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-white">Option A: Negombo Beach</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">15-20 mins away</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              Ideal for late night arrivals (after 18:00), exhausted long-haul passengers, or heading north to Sigiriya / Cultural Triangle next morning.
            </p>
          </button>

          <button
            onClick={() => setFirstNightChoice('colombo')}
            className={`p-4 rounded-xl border text-left transition-all ${
              firstNightChoice === 'colombo'
                ? 'border-sky-500/80 bg-sky-950/20 text-white ring-1 ring-sky-500/50'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-white">Option B: Colombo Fort</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">35-45 mins away</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              Ideal for daylight landings, passengers boarding the 05:55 / 08:30 Kandy scenic train, or heading south to Galle on the coastal railway.
            </p>
          </button>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 text-xs">
          {firstNightChoice === 'negombo' ? (
            <div className="space-y-1.5 text-neutral-300">
              <span className="font-bold text-emerald-400 block text-sm">✓ Copilot Strategy for Negombo:</span>
              <p>Book a guesthouse along Porutota Road (Lewis Place). Take a Rs 2,500 PickMe cab directly from the car park. You can sleep within 45 minutes of landing, wake up to sea breezes and tropical fruit, and bypass all Colombo morning traffic when heading upcountry.</p>
            </div>
          ) : (
            <div className="space-y-1.5 text-neutral-300">
              <span className="font-bold text-sky-400 block text-sm">✓ Copilot Strategy for Colombo:</span>
              <p>Take the E03 Expressway cab (Rs 4,500 including toll). Stay near Colombo Fort, Galle Face, or Kollupitiya. Enjoy an evening walk at Galle Face Green with street kottu and wade into colonial history before catching an early train at Colombo Fort railway station.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
