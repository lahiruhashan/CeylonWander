'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Utensils, Flame, ArrowRight } from 'lucide-react';

type FoodFilter = 'all' | 'street' | 'curry' | 'breakfast' | 'sweet';

interface DishItem {
  id: string;
  name: string;
  sinhalaName: string;
  category: 'street' | 'curry' | 'breakfast' | 'sweet';
  spiceLevel: 1 | 2 | 3;
  dietary: string[];
  priceLkr: string;
  usdApprox: string;
  description: string;
  howToOrder: string;
  insiderTip: string;
}

const DISHES_DATA: DishItem[] = [
  {
    id: 'kottu_roti',
    name: 'Kottu Roti (Cheese / Chicken / Veg)',
    sinhalaName: 'කොත්තු රොටී',
    category: 'street',
    spiceLevel: 2,
    dietary: ['Vegetarian option', 'Halal options common'],
    priceLkr: 'LKR 700 – 1,200',
    usdApprox: '~$2.30 – $3.90',
    description: 'The heartbeat of Sri Lankan night street food. Chopped Godamba flatbread, vegetables, eggs, meat, and rich curry gravy chopped vigorously on a hot flat griddle with twin metal cleavers.',
    howToOrder: '"Chicken kottu ekak" (one chicken kottu). Say "Sera aduwen" for mild spice, or "Cheese kottu" for creamy indulgence.',
    insiderTip: 'Follow the rhythmic metallic clang sound at night (around 7:00 PM). If you hear fast chopping, the griddle is fresh and active.'
  },
  {
    id: 'egg_hoppers',
    name: 'Egg Hoppers (Biththara Appa)',
    sinhalaName: 'බිත්තර ආප්ප',
    category: 'breakfast',
    spiceLevel: 1,
    dietary: ['Vegetarian', 'Gluten-Free'],
    priceLkr: 'LKR 80 – 140 each',
    usdApprox: '~$0.30 – $0.45',
    description: 'Crispy bowl-shaped fermented rice-flour and coconut-milk crêpe with a soft, steamed whole egg nestled in the spongy center, sprinkled with black pepper.',
    howToOrder: '"Biththara appa dekayi, plain appa thunayi" (2 egg hoppers, 3 plain hoppers). Served with spicy onion lunu miris or sweet seeni sambol.',
    insiderTip: 'Eaten fresh off the pan between 6:00 PM - 8:30 PM for dinner, or 7:00 AM - 9:00 AM for breakfast. If cold, ask for a fresh batch.'
  },
  {
    id: 'pol_sambol',
    name: 'Pol Sambol (Fresh Coconut Relish)',
    sinhalaName: 'පොල් සම්බෝල',
    category: 'curry',
    spiceLevel: 3,
    dietary: ['Vegan', 'Gluten-Free', 'Vegetarian'],
    priceLkr: 'Complimentary with meals',
    usdApprox: 'Included',
    description: 'Freshly scraped coconut ground with dried red chili, shallots, fresh lime juice, black pepper, and sea salt. The fiery soul of every Sri Lankan meal.',
    howToOrder: 'Included automatically with string hoppers and breakfast rottis.',
    insiderTip: 'Traditional village pol sambol includes a pinch of crushed Maldive fish (umbalakada) for umami. Vegans should ask: "Umbalakada nethuwa pol sambol thiyenawadha?" (Without Maldive fish).'
  },
  {
    id: 'ambul_thiyal',
    name: 'Fish Ambul Thiyal (Sour Dry Fish Curry)',
    sinhalaName: 'මාළු ඇඹුල් තියල්',
    category: 'curry',
    spiceLevel: 2,
    dietary: ['Seafood', 'Gluten-Free'],
    priceLkr: 'LKR 600 – 1,100',
    usdApprox: '~$2.00 – $3.50',
    description: 'Southern culinary heritage dish. Cubes of firm tuna or skipjack coated in black dried tamarind paste (goraka), crushed black peppercorns, and slow-simmered dry in clay pots.',
    howToOrder: 'Best found in southern coastal local eateries between Galle, Mirissa, and Tangalle.',
    insiderTip: 'The high acidity of the goraka naturally preserves the fish without refrigeration for days. Extremely flavorful, tangy, and rich in peppery aromatics.'
  },
  {
    id: 'dhal_curry',
    name: 'Parippu (Creamy Coconut Dhal)',
    sinhalaName: 'පරිප්පු',
    category: 'curry',
    spiceLevel: 1,
    dietary: ['Vegan', 'Vegetarian', 'Gluten-Free'],
    priceLkr: 'LKR 250 – 450 (or in buffet)',
    usdApprox: '~$0.80 – $1.50',
    description: 'Red split lentils simmered in thick first-press coconut milk, turmeric, pandan leaves (rampe), curry leaves, and tempered mustard seeds.',
    howToOrder: 'Available at virtually every eatery across Sri Lanka 24/7.',
    insiderTip: 'The ultimate comforting, mild dish if your stomach needs a break from heavy chili heat.'
  },
  {
    id: 'curd_treacle',
    name: 'Curd & Kithul Treacle',
    sinhalaName: 'මී කිරි සහ පැණි',
    category: 'sweet',
    spiceLevel: 1,
    dietary: ['Vegetarian', 'Gluten-Free'],
    priceLkr: 'LKR 300 – 500 per pot',
    usdApprox: '~$1.00 – $1.60',
    description: 'Thick, creamy water buffalo milk curd set in unglazed earthenware terracotta pots, drenched in smoky amber syrup extracted from the Fishtail Jaggery Palm (Kithul).',
    howToOrder: 'Sold at roadside clay-pot stalls along the Southern highway and Tissamaharama.',
    insiderTip: 'Buffalo curd is much richer and thicker than cow yogurt. Make sure the treacle is pure amber Kithul, not boiled caramelized cane sugar.'
  }
];

const FOOD_FAQS = [
  {
    q: 'Is Sri Lankan food too spicy for foreign travelers?',
    a: 'Sri Lankan curries use black pepper, roasted curry powder, and red chili, which can be fiery! However, creamy coconut milk balances the heat, and mild dishes like Parippu (coconut dhal) and sweet Seenisambol are widely available. You can always tell the cook: "Sera aduwen" (less spicy, please).'
  },
  {
    q: 'Why do restaurants in Sri Lanka have signs saying "Hotel"?',
    a: 'In Sri Lanka, the word "Hotel" is universally used for casual local eateries, tea shops, and bakeries (short-eat joints), not lodging accommodations! If you see "Buhari Hotel" or "New City Hotel", it is a restaurant serving hoppers and rice & curry.'
  },
  {
    q: 'Is it polite to eat with your hands in Sri Lanka?',
    a: 'Yes, it is the traditional way to dine! Locals mix curries, sambol, and rice using the fingertips of their RIGHT hand. A finger bowl with a slice of fresh lime is brought to your table at the end of the meal to wash your fingers. Spoons and forks are always provided on request.'
  },
  {
    q: 'Can vegetarians and vegans eat easily in Sri Lanka?',
    a: 'Sri Lanka is one of the best countries in the world for plant-based travelers! Coconut milk is the universal culinary base rather than dairy or butter. Jackfruit (polos), eggplant (wambatu moju), dhal, beetroot, and green bean curries are naturally 100% vegan. Just mention "Maldive fish nethuwa" to ensure no dried fish flakes are sprinkled in sambols.'
  }
];

export default function FoodPage() {
  const [filter, setFilter] = useState<FoodFilter>('all');

  const filtered = filter === 'all'
    ? DISHES_DATA
    : DISHES_DATA.filter(d => d.category === filter);

  return (
    <div className="min-h-screen bg-[#05140e] text-[#f8fafc] font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-[#061c14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-[#032317] font-black text-xs shadow-md">
              CW
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight block leading-none">
                CeylonWander <span className="text-xs">🇱🇰</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Culinary Decoder
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-amber-400 transition-colors">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-amber-400 transition-colors">Itineraries</Link>
            <Link href="/train" className="hover:text-amber-400 transition-colors">Scenic Train</Link>
            <Link href="/wildlife" className="hover:text-amber-400 transition-colors">Safaris</Link>
            <Link href="/culture" className="hover:text-amber-400 transition-colors">Culture & Poya</Link>
            <Link href="/food" className="text-amber-400 font-extrabold">Food Guide</Link>
            <Link href="/toolkit" className="hover:text-amber-400 transition-colors">Field Toolkit</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#032317] rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Launch Map</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-6">
          <Utensils size={13} />
          <span>Authentic Street Food & Spice Decoded</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-serif">
          Sri Lankan Food, Street Eateries & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-300 bg-clip-text text-transparent">
            How to Order Like a Local
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          From late-night rhythmic Kottu Roti clatter to morning Egg Hoppers and creamy coconut dhal. 
          Discover honest price benchmarks, spice heat meters, and local eatery etiquette.
        </p>

        {/* Filter Pills */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          {[
            { id: 'all', label: 'All Dishes', icon: '✨' },
            { id: 'street', label: 'Street Kottu & Snacks', icon: '🥢' },
            { id: 'curry', label: 'Curries & Sambols', icon: '🍛' },
            { id: 'breakfast', label: 'Breakfast Hoppers', icon: '🥞' },
            { id: 'sweet', label: 'Curd & Sweets', icon: '🥥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FoodFilter)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-[#032317] shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10 space-y-12">
        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#0a2318]/70 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-amber-950/40 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white font-serif group-hover:text-amber-300 transition-colors">
                      {dish.name}
                    </h3>
                    <span className="text-xs text-amber-400 font-bold block mt-0.5">
                      {dish.sinhalaName}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-amber-400 block font-mono">{dish.priceLkr}</span>
                    <span className="text-[10px] text-gray-400">{dish.usdApprox}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    dish.spiceLevel === 3
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : dish.spiceLevel === 2
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    <Flame size={11} />
                    <span>{dish.spiceLevel === 3 ? 'Fiery Heat 🔥🔥🔥' : dish.spiceLevel === 2 ? 'Medium Heat 🔥🔥' : 'Mild / Gentle 🌿'}</span>
                  </span>

                  {dish.dietary.map((d, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-300">
                      {d}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-gray-300">
                  <strong className="text-amber-300 block font-bold mb-0.5">How to order:</strong>
                  <span>{dish.howToOrder}</span>
                </div>

                <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200">
                  <strong className="text-amber-300 block font-bold mb-0.5">Insider Secret:</strong>
                  <span>{dish.insiderTip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO FAQs */}
        <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Sri Lankan Culinary Guide & Street Etiquette
            </h3>
          </div>

          <div className="space-y-4">
            {FOOD_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-start gap-2">
                  <span className="text-amber-400">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="text-2xl font-black text-white font-serif">
            Find authentic local food spots on the map
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Use the Local Food category filter to locate uncommercialized street eateries and family-run rice & curry houses.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-400 text-[#032317] rounded-xl text-sm font-black shadow-xl hover:scale-105 transition-all"
          >
            <Compass size={16} />
            <span>Launch Explorer Map</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>CeylonWander 🇱🇰 • Cloudflare Colombo Edge</span>
          <div className="flex items-center gap-4 text-gray-400 font-semibold">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/explore" className="hover:text-white">Explorer Map</Link>
            <Link href="/itinerary" className="hover:text-white">Itineraries</Link>
            <Link href="/train" className="hover:text-white">Scenic Train</Link>
            <Link href="/toolkit" className="hover:text-white">Field Toolkit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
