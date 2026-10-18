import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  PlaneLanding, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  PhoneCall, 
  HelpCircle
} from 'lucide-react';
import AirportArrivalGuide from '@/components/journey/AirportArrivalGuide';
import Navbar from '@/components/navigation/Navbar';
import { ISLAND_IMAGES } from '@/data/island_images';

export const metadata: Metadata = {
  title: 'CMB Airport Arrival Guide Sri Lanka | Land Ready Copilot',
  description:
    'Complete step-by-step foreign traveler guide for Bandaranaike International Airport (CMB): official ETA visa check, fee-free ATMs, Dialog 50GB tourist SIMs, PickMe car park pickup vs Bus #187, and Negombo first-night strategy.',
  keywords: [
    'Sri Lanka airport arrival',
    'Bandaranaike International Airport guide',
    'CMB airport SIM card',
    'CMB airport ATM fee free',
    'PickMe airport pickup Colombo',
    'Bus 187 Katunayake Expressway',
    'Negombo vs Colombo first night',
    'Sri Lanka tourist visa ETA official',
  ],
  alternates: {
    canonical: 'https://ceyloncopilot.pages.dev/arrival',
  },
  openGraph: {
    title: 'CMB Airport Arrival Guide Sri Lanka | CeylonCopilot',
    description: 'Arrive at Bandaranaike International Airport with zero friction. Fee-free cash, verified tourist SIMs, ride-hailing pickup bays, and transport advice.',
    url: 'https://ceyloncopilot.pages.dev/arrival',
    siteName: 'CeylonCopilot',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ArrivalPage() {
  const faqs = [
    {
      q: 'Can I bring cigarettes, vapes, or alcohol into Sri Lanka through customs?',
      a: 'Duty-free allowance permits 1.5 liters of spirits and 2 bottles of wine per adult. However, Sri Lanka has extremely strict anti-tobacco customs laws: bringing cigarettes or electronic cigarettes/vapes into Sri Lanka is strictly prohibited without a special license, and items will be confiscated at customs with steep fines.'
    },
    {
      q: 'Which ATMs at Bandaranaike Airport do NOT charge foreign card fees?',
      a: 'Bank of Ceylon (BOC) and Commercial Bank ATMs in the public arrivals concourse do not levy local ATM operator surcharges on foreign Visa and Mastercards. Always decline Dynamic Currency Conversion (DCC) and choose to be billed in LKR (Sri Lankan Rupees).'
    },
    {
      q: 'Should I take an official airport taxi counter or use PickMe / Uber?',
      a: 'Official airport taxi counters inside the terminal quote Rs 9,000–14,000 ($30–$45 USD) for Colombo. If you walk 80 meters across the covered pedestrian crossing to the outer car park, a PickMe or Uber AC car costs Rs 4,000–5,000 ($13–$16 USD) including the Katunayake Expressway toll.'
    },
    {
      q: 'Is it better to spend the first night in Negombo or Colombo?',
      a: 'If your flight lands after 18:00 or you are jet-lagged after a 10+ hour flight, book Negombo. It is only 15–20 minutes away by car, sparing you late-night Colombo expressway driving. If you plan to take the 05:55 morning train to Kandy from Colombo Fort, sleep in Colombo.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05140e] text-neutral-200">
      {/* Top Banner Navigation */}
      <Navbar pageSubtitle="Arrival Guide · Phase 1" />

      {/* Hero Section with Photographic Atmosphere */}
      <section className="relative overflow-hidden py-12 md:py-20 border-b border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={ISLAND_IMAGES.arrivalFlight.url}
            alt={ISLAND_IMAGES.arrivalFlight.alt}
            className="w-full h-full object-cover opacity-20 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05140e] via-[#05140e]/85 to-[#05140e]/95" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-4">
            <PlaneLanding size={14} /> Phase 1 of 4: Landing & First 24 Hours
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Bandaranaike International Airport (CMB) <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Arrival & First-Night Field Copilot
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            Eliminate arrival confusion, taxi tout markups, and ATM currency conversion traps. 
            Step-by-step guidance designed specifically for overseas travelers touching down in Sri Lanka.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Terminal Code</span>
              <span className="text-white font-bold text-base">CMB (Katunayake)</span>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Best 50GB SIM</span>
              <span className="text-emerald-400 font-bold text-base">Dialog (~$10 USD)</span>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Fee-Free ATMs</span>
              <span className="text-white font-bold text-base">BOC & Commercial</span>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Expressway Bus</span>
              <span className="text-sky-400 font-bold text-base">#187 (Rs 500 / $1.60)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Guide Component */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>Terminal Walkthrough & Interactive Copilot</span>
          </h2>
          <AirportArrivalGuide />
        </div>

        {/* First Night Decision: Negombo vs Colombo Photo Showcase */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Strategic First Night
            </span>
            <h2 className="text-2xl font-black text-white font-serif">
              Where to Sleep on Night 1: Negombo vs Colombo
            </h2>
            <p className="text-xs text-neutral-300 mt-1">
              Bandaranaike International Airport is located in Katunayake — not in downtown Colombo. Choose your first night based on flight arrival time.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Negombo */}
            <div className="bg-neutral-950/80 border border-emerald-500/30 rounded-2xl p-4 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl mb-3.5 bg-neutral-900">
                  <img
                    src={ISLAND_IMAGES.arrivalNegombo.url}
                    alt={ISLAND_IMAGES.arrivalNegombo.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-emerald-500/90 text-neutral-950 font-black text-[11px]">
                    RECOMMENDED (LATE FLIGHTS)
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 text-xs text-white font-bold">
                    15–20 Mins from CMB · Low Stress
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Negombo Beach Lagoon</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Avoid late-night expressway fatigue. Wake up to palm-lined beaches, fresh seafood, and tranquil lagoon resorts. Perfect if your flight lands after 18:00.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">PickMe Cab: ~Rs 2,500 ($8 USD)</span>
                <span className="text-emerald-400 font-bold">Zero Tolls</span>
              </div>
            </div>

            {/* Colombo */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl mb-3.5 bg-neutral-900">
                  <img
                    src={ISLAND_IMAGES.colomboCoastline.url}
                    alt={ISLAND_IMAGES.colomboCoastline.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-sky-500/90 text-neutral-950 font-black text-[11px]">
                    MORNING TRAIN LAUNCHPAD
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 text-xs text-white font-bold">
                    35–50 Mins via E03 Expressway
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Colombo Fort & Marine Drive</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Head straight to the capital if you have reserved seats on the 05:55 morning train to Kandy from Colombo Fort Station, or wish to explore colonial architecture.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">PickMe Cab: ~Rs 4,500 ($15 USD)</span>
                <span className="text-sky-400 font-bold">Expressway Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Arrival Checklist & Customs Warnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official ETA Box */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">ETA Visa Official Verification</h3>
                <span className="text-xs text-emerald-400">Avoid $100+ copycat visa websites</span>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Foreign passport holders should ensure their visa is processed through the official Sri Lanka Immigration system. Do not pay over the standard government fee on unofficial agencies.
            </p>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs space-y-1.5 text-neutral-300">
              <div className="flex items-center justify-between">
                <span>Passport validity:</span>
                <strong className="text-white">Min. 6 months required</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>On-arrival visa queue:</span>
                <span className="text-amber-400">Possible (expect 30-45m line)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Online ETA approval:</span>
                <span className="text-emerald-400">Direct e-gate / quick stamp</span>
              </div>
            </div>
          </div>

          {/* Strict Customs Regulations */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Sri Lanka Customs Red Lines</h3>
                <span className="text-xs text-rose-400">Zero tolerance items</span>
              </div>
            </div>
            <ul className="text-xs text-neutral-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span><strong className="text-white">Cigarettes & Vapes:</strong> Bringing commercial tobacco, cartons of cigarettes, or e-cigarettes into Sri Lanka is strictly prohibited. Heavy spot fines and confiscation apply.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong className="text-white">Alcohol Allowance:</strong> Up to 1.5 liters of hard spirits and 2 standard bottles of wine per person duty-free.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">!</span>
                <span><strong className="text-white">Drone Registration:</strong> Drones require pre-clearance from the Civil Aviation Authority of Sri Lanka (CAA) and Ministry of Defence before flying.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Helplines for Inbound Tourists */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <PhoneCall size={18} className="text-emerald-400" />
            Save These Inbound Emergency Numbers in Your Phone
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Free 24/7 Paramedic Ambulance</span>
              <span className="text-xl font-black text-rose-400 tracking-wider">1990</span>
              <span className="text-[10px] text-neutral-400 block mt-1">Suwa Seriya (English, Sinhala, Tamil)</span>
            </div>
            <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Sri Lanka Tourist Police Hotline</span>
              <span className="text-xl font-black text-emerald-400 tracking-wider">1912</span>
              <span className="text-[10px] text-neutral-400 block mt-1">Direct support for visitor grievances</span>
            </div>
            <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block">Bandaranaike Airport Information</span>
              <span className="text-lg font-black text-sky-400 tracking-wider">+94 11 225 2861</span>
              <span className="text-[10px] text-neutral-400 block mt-1">24/7 Katunayake flight inquiries</span>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-emerald-400" />
            Frequently Asked Questions by Arriving Foreigners
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                <h3 className="text-sm font-bold text-white mb-1.5">{faq.q}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Phase CTA */}
        <div className="bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border border-teal-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-teal-400 tracking-wider">Up Next: Phase 2</span>
            <h3 className="text-lg font-bold text-white">Ready to move across the island?</h3>
            <p className="text-xs text-neutral-300">
              Check mountain switchback drive times, Kandy to Ella train elevation profiles, and fair tuk-tuk rates.
            </p>
          </div>
          <Link
            href="/transport"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <span>Explore Move Copilot</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
