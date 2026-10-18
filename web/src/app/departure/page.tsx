import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  PlaneTakeoff, 
  AlertTriangle, 
  ShoppingBag, 
  ArrowRight, 
  Coffee, 
  HelpCircle
} from 'lucide-react';
import LeaveByCalculator from '@/components/journey/LeaveByCalculator';
import Navbar from '@/components/navigation/Navbar';
import { ISLAND_IMAGES } from '@/data/island_images';

export const metadata: Metadata = {
  title: 'CMB Flight Departure Copilot & Leave-By Calculator Sri Lanka',
  description:
    'Calculate exact hotel leave-by times for Bandaranaike International Airport (CMB). Prepare for the 3-hour pre-terminal luggage X-ray queue, Katunayake Expressway transit, and supermarket Ceylon tea vs airport markup guide.',
  keywords: [
    'Sri Lanka airport departure',
    'Bandaranaike International Airport leave by calculator',
    'CMB flight check in time',
    'CMB airport security queue',
    'Colombo to airport travel time',
    'Galle to airport expressway drive time',
    'buy Ceylon tea supermarket Colombo',
    'Sri Lanka tourist VAT refund',
  ],
  alternates: {
    canonical: 'https://ceyloncopilot.pages.dev/departure',
  },
  openGraph: {
    title: 'CMB Flight Departure Copilot | CeylonCopilot',
    description: 'Ensure you never miss your flight out of Colombo. Calculate exact departure times factoring in Sri Lanka road physics and airport security queues.',
    url: 'https://ceyloncopilot.pages.dev/departure',
    siteName: 'CeylonCopilot',
    locale: 'en_US',
    type: 'website',
  },
};

export default function DeparturePage() {
  const faqs = [
    {
      q: 'Why does CeylonCopilot insist on arriving at CMB 3 hours before an international flight?',
      a: 'Unlike modern airports where security is post-check-in, CMB Katunayake operates an outdoor pre-terminal luggage X-ray checkpoint BEFORE you are allowed into the airline ticket counter lobby. During peak international departure banks (19:00 to 02:00), this outdoor queue alone can take 35 to 50 minutes.'
    },
    {
      q: 'Can I drive directly from Ella or Kandy to CMB on the day of my flight?',
      a: 'We strongly discourage driving from Ella (5–6.5 hours) on your departure day. Landslides, slow tea lorries, or mountain road repairs can cause sudden 2-hour delays. For flights before 18:00, spend your final night in Colombo or Negombo. For flights after 22:00, you can depart Kandy in the morning via the Central Expressway (E04).'
    },
    {
      q: 'Where should I buy Ceylon tea before leaving Sri Lanka?',
      a: 'Never buy tea at the airport duty-free departure lounge unless in an absolute emergency; prices are marked up 300% ($18–$30 for a modest tin). Stop at a premier local supermarket (Cargills Food City, Keells, or Glomark) in Colombo or Negombo on your way to the airport. You will get the exact same export-grade single-origin Dilmah, Basilur, and Mlesna teas for $3–$7 USD.'
    },
    {
      q: 'Is there a VAT refund scheme for foreign tourists at CMB Airport?',
      a: 'Yes. The Tourist VAT Refund Scheme (TVRS) counter is located inside the departure terminal before immigration. It applies only to purchases exceeding Rs 50,000 from authorized TVRS-registered stores who issue an official TVRS voucher and invoice.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05140e] text-neutral-200">
      {/* Top Banner Navigation */}
      <Navbar pageSubtitle="Departure Guide · Phase 4" />

      {/* Hero Header with Photographic Atmosphere */}
      <section className="py-12 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={ISLAND_IMAGES.galleFortLighthouse.url}
            alt={ISLAND_IMAGES.galleFortLighthouse.alt}
            className="w-full h-full object-cover opacity-20 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05140e] via-[#05140e]/85 to-[#05140e]/95" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300 mb-4">
            <PlaneTakeoff size={14} /> Phase 4 of 4: Smooth Departures & Final Hours
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Bandaranaike International Airport (CMB) <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-200">
              Flight Departure & Leave-By Field Copilot
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            Never risk missing your international flight. Calculate precise leave-by departure times from Galle, Colombo, or Kandy, navigate the mandatory outdoor pre-terminal luggage X-ray queue, and buy authentic Ceylon souvenirs at fair local prices.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">Required Buffer</span>
              <span className="text-rose-400 font-bold text-base">3.0 Hours at Gate</span>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">From Negombo</span>
              <span className="text-white font-bold text-base">15 - 20 mins</span>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">From Galle (E01)</span>
              <span className="text-white font-bold text-base">2.0 - 2.5 hrs</span>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5">
              <span className="text-neutral-400 text-xs block">From Kandy</span>
              <span className="text-amber-400 font-bold text-base">3.0 - 4.0 hrs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* The Mandatory Pre-Terminal X-Ray Warning */}
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">The CMB Katunayake Pre-Terminal X-Ray Bottleneck</h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Most international airports allow you to walk straight into the check-in hall. 
                At CMB, <strong className="text-rose-300">all passengers and baggage must pass through an outdoor security screening scanner before setting foot inside the airline lobby</strong>.
                Between 19:00 and 01:00 (when flights to the Middle East, Europe, and India depart simultaneously), this outer queue spills into the roadway and takes 30–45 minutes. 
                Arriving 3 hours before departure is not optional — it is mandatory.
              </p>
            </div>
          </div>
        </div>

        {/* Leave-By Interactive Flight Calculator */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Interactive Flight Leave-By Calculator
          </h2>
          <LeaveByCalculator />
        </div>

        {/* Last-Minute Ceylon Tea & Souvenirs Guide */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl bg-neutral-950 border border-amber-500/20 group">
            <img
              src={ISLAND_IMAGES.sriLankanCurry.url}
              alt="Authentic Ceylon Tea, Spices and Souvenirs"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300">
              ☕ Single-Origin Ceylon Tea & True Cinnamon
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                Supermarket Savings Protocol (Save 70%)
              </span>
              <span className="text-amber-300 font-mono text-[11px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                Fair Pricing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Souvenir Strategy: Supermarket vs Airport Duty-Free</h2>
              <span className="text-xs text-amber-400">Save 70% on authentic Ceylon tea and spices</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Supermarket Hack */}
            <div className="bg-neutral-950 p-5 rounded-xl border border-emerald-500/30 space-y-3">
              <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <Coffee size={16} /> Strategy A: Local Premier Supermarket (Recommended)
              </span>
              <p className="text-neutral-300 leading-relaxed">
                Before heading to the airport, stop at a local supermarket in Colombo (Keells, Cargills Food City, or Glomark) or Negombo:
              </p>
              <ul className="text-neutral-300 space-y-1.5">
                <li>• <strong>Dilmah t-Series / BOPF Tea:</strong> ~Rs 1,000 - 1,800 ($3.25 - $5.50 USD)</li>
                <li>• <strong>Pure Ceylon Cinnamon Sticks (Alba / C5 grade):</strong> ~Rs 800 ($2.60 USD)</li>
                <li>• <strong>Cashews (Kaju) & Coconut Treacle (Kithul):</strong> ~Rs 1,200 ($3.90 USD)</li>
              </ul>
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-300">
                ✓ 100% genuine export quality, fixed government price tags, zero airport markup.
              </div>
            </div>

            {/* Airport Duty Free */}
            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
              <span className="font-bold text-neutral-300 text-sm flex items-center gap-1.5">
                <ShoppingBag size={16} className="text-amber-400" /> Strategy B: Airport Departure Concourse
              </span>
              <p className="text-neutral-400 leading-relaxed">
                If you run out of time and must buy inside the terminal:
              </p>
              <ul className="text-neutral-400 space-y-1.5">
                <li>• <strong>Standard Tin of Tea:</strong> $15 - $28 USD (~Rs 5,000 - 9,000)</li>
                <li>• <strong>Cinnamon Quills (200g):</strong> $12 - $18 USD</li>
                <li>• <strong>Artisanal Gems & Jewelry:</strong> Ensure official NGJA (National Gem and Jewellery Authority) certification certificate is stamped.</li>
              </ul>
              <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-300">
                ! Expect a 3x to 4x markup compared to identical items on the high street.
              </div>
            </div>
          </div>
        </div>

        {/* Departure FAQs */}
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-rose-400" />
            Frequently Asked Departure Questions
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

        {/* Final Hub Loop CTA */}
        <div className="bg-gradient-to-r from-neutral-900 to-[#081c14] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Complete Journey Suite</span>
            <h3 className="text-lg font-bold text-white">Need to check fair prices for anything in Sri Lanka?</h3>
            <p className="text-xs text-neutral-400">
              Browse our searchable database of verified tourist prices with official source receipts.
            </p>
          </div>
          <Link
            href="/prices"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <span>Open Fair-Price Meter</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
