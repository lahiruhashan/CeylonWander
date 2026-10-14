'use client';

import React, { useState } from 'react';
import { X, Flame, Sparkles, Utensils } from 'lucide-react';

interface FoodDecoderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FoodFilter = 'all' | 'veg' | 'street' | 'curry' | 'sweet';

interface DishItem {
  id: string;
  name: string;
  sinhalaName: string;
  category: 'street' | 'curry' | 'breakfast' | 'sweet';
  spiceLevel: 1 | 2 | 3; // 1 = mild, 2 = medium, 3 = fiery
  dietary: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Seafood' | 'Meat')[];
  priceBenchmarkLkr: string;
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
    dietary: ['Vegetarian', 'Meat'],
    priceBenchmarkLkr: 'LKR 700 – 1,200',
    usdApprox: '~$2.30 – $3.90',
    description: 'The heartbeat of Sri Lankan night street food. Chopped flatbread, vegetables, eggs, meat, and rich curry sauce chopped vigorously on a hot griddle with twin metal blades.',
    howToOrder: '"Chicken kottu ekak" or "Cheese veg kottu ekak". Specify "Sera aduwen" if you want less chili.',
    insiderTip: 'Follow the rhythmic metallic clang sound at night (around 7:00 PM). If you hear fast chopping, the griddle is fresh and active.'
  },
  {
    id: 'egg_hoppers',
    name: 'Egg Hoppers (Biththara Appa)',
    sinhalaName: 'බිත්තර ආප්ප',
    category: 'breakfast',
    spiceLevel: 1,
    dietary: ['Vegetarian', 'Gluten-Free'],
    priceBenchmarkLkr: 'LKR 80 – 140 per piece',
    usdApprox: '~$0.30 – $0.45',
    description: 'Crispy bowl-shaped fermented rice-flour and coconut-milk crêpe with a soft, steamed whole egg nestled in the spongy center, sprinkled with black pepper.',
    howToOrder: '"Biththara appa dekayi, plain appa thunayi" (2 egg hoppers, 3 plain hoppers). Served with spicy onion lunu miris or sweet seeni sambol.',
    insiderTip: 'Eaten fresh off the pan between 6:00 PM - 8:30 PM for dinner, or 7:00 AM - 9:00 AM for breakfast. If cold, ask for a fresh batch.'
  },
  {
    id: 'pol_sambol',
    name: 'Pol Sambol (Coconut Relish)',
    sinhalaName: 'පොල් සම්බෝල',
    category: 'curry',
    spiceLevel: 3,
    dietary: ['Vegan', 'Gluten-Free', 'Vegetarian'],
    priceBenchmarkLkr: 'Usually included with Rice & Curry / Hoppers',
    usdApprox: 'Complimentary',
    description: 'Freshly scraped coconut ground with dried red chili, shallots, fresh lime juice, black pepper, and sea salt. The soul of every Sri Lankan meal.',
    howToOrder: 'Included automatically with string hoppers and breakfast rottis.',
    insiderTip: 'Traditional village pol sambol includes a pinch of crushed Maldive fish (umbalakada) for umami. Vegetarians/vegans should ask: "Umbalakada nethuwa pol sambol thiyenawadha?" (Without Maldive fish).'
  },
  {
    id: 'ambul_thiyal',
    name: 'Fish Ambul Thiyal (Sour Dry Fish Curry)',
    sinhalaName: 'මාළු ඇඹුල් තියල්',
    category: 'curry',
    spiceLevel: 2,
    dietary: ['Seafood', 'Gluten-Free'],
    priceBenchmarkLkr: 'LKR 600 – 1,100 (part of meal)',
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
    priceBenchmarkLkr: 'LKR 250 – 450 (or included in buffet)',
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
    priceBenchmarkLkr: 'LKR 300 – 500 per clay pot',
    usdApprox: '~$1.00 – $1.60',
    description: 'Thick, creamy water buffalo milk curd set in unglazed earthenware terracotta pots, drenched in smoky amber syrup extracted from the Fishtail Jaggery Palm (Kithul).',
    howToOrder: 'Sold at roadside clay-pot stalls along the Southern highway and Tissamaharama.',
    insiderTip: 'Buffalo curd is much richer and thicker than cow yogurt. Make sure the treacle is pure amber Kithul, not boiled caramelized cane sugar.'
  }
];

export default function FoodDecoderModal({ isOpen, onClose }: FoodDecoderModalProps) {
  const [filter, setFilter] = useState<FoodFilter>('all');

  if (!isOpen) return null;

  const filteredDishes = DISHES_DATA.filter(dish => {
    if (filter === 'veg') return dish.dietary.includes('Vegetarian') || dish.dietary.includes('Vegan');
    if (filter === 'street') return dish.category === 'street';
    if (filter === 'curry') return dish.category === 'curry';
    if (filter === 'sweet') return dish.category === 'sweet';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-orange-950 to-stone-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <span>🍛 Culinary Decoder</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Sri Lankan Food & Street Eatery Guide</span>
            <span className="text-lg">🥥</span>
          </h2>
          <p className="text-xs text-amber-200/90 mt-1 max-w-xl">
            Order like a local in roadside <em>kades</em>, decode spice heat, and never overpay tourist restaurant markups.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="bg-amber-50/70 p-3.5 border-b border-amber-100 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: 'All Dishes' },
            { id: 'street', label: 'Street Kottu & Snacks' },
            { id: 'curry', label: 'Curries & Sambols' },
            { id: 'veg', label: 'Vegetarian & Vegan' },
            { id: 'sweet', label: 'Curd & Desserts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FoodFilter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-800 text-xs">
          {/* Street Etiquette Cheat Sheet */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <Utensils size={14} className="text-amber-700" />
              <span>3 Golden Rules of Eating in a Local &quot;Hotel&quot; (Eatery):</span>
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 pt-1 text-stone-700">
              <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                <strong className="text-stone-950 block">1. &quot;Hotels&quot; are Eateries</strong>
                <p className="text-[11px] leading-tight">In Sri Lanka, signs saying &quot;Hotel&quot; almost always mean a small restaurant or bakery, not lodging!</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                <strong className="text-stone-950 block">2. Eat With Right Hand</strong>
                <p className="text-[11px] leading-tight">Locals mix rice and curry with their right fingertips. Spoons are gladly provided on request (&quot;Handi dekkak denna&quot;).</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                <strong className="text-stone-950 block">3. Short-Eat Platters</strong>
                <p className="text-[11px] leading-tight">Waiters place a plate of 10 rolls/patties on your table. You only pay for what you actually eat!</p>
              </div>
            </div>
          </div>

          {/* Dish Cards Grid */}
          <div className="space-y-4">
            {filteredDishes.map(dish => (
              <div
                key={dish.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-stone-950">{dish.name}</h4>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        {dish.sinhalaName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {dish.dietary.map((d, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-sm font-black text-amber-900 block">{dish.priceBenchmarkLkr}</span>
                    <span className="text-[11px] text-stone-500 font-semibold">{dish.usdApprox}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {dish.description}
                </p>

                {/* Heat level & Order helper */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-stone-900">
                      <Flame size={13} className={dish.spiceLevel === 3 ? 'text-red-600' : dish.spiceLevel === 2 ? 'text-orange-500' : 'text-amber-500'} />
                      <span>Heat: {dish.spiceLevel === 3 ? 'Fiery 🔥🔥🔥' : dish.spiceLevel === 2 ? 'Medium Spicy 🔥🔥' : 'Mild / Gentle 🌿'}</span>
                    </div>
                    <div className="text-stone-600">
                      <strong>How to order:</strong> {dish.howToOrder}
                    </div>
                  </div>

                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-amber-950 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-amber-900">
                      <Sparkles size={13} className="text-amber-700" />
                      <span>Local Insider Tip:</span>
                    </div>
                    <div>{dish.insiderTip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-500 font-medium">
            🥥 A standard local chicken or fish rice & curry lunch packet is LKR 400 – 600 (~$1.50).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Food Guide
          </button>
        </div>
      </div>
    </div>
  );
}
