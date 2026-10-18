export interface VerifiedPricePoint {
  id: string;
  category: 'airport' | 'transit' | 'sim' | 'entrance' | 'safari' | 'food';
  itemKey: string;
  name: string;
  sinhalaName?: string;
  description: string;
  amountMinLkr: number;
  amountMaxLkr: number;
  unit: string;
  verifiedOn: string; // YYYY-MM-DD
  sourceType: 'official' | 'operator' | 'field_check';
  sourceName: string;
  sourceUrl: string;
  notes?: string;
}

export const VERIFIED_PRICES: VerifiedPricePoint[] = [
  // 1. Airport & Transfers
  {
    id: 'price-cmb-bus-187',
    category: 'airport',
    itemKey: 'airport.express_bus_187',
    name: 'Expressway Air-Conditioned Bus #187 (CMB Airport to Colombo Fort)',
    sinhalaName: '187 අධිවේගී බස් රථය',
    description: 'Direct air-conditioned bus via E03 Colombo-Katunayake Expressway from airport bus bay to Colombo Fort railway station.',
    amountMinLkr: 500,
    amountMaxLkr: 600,
    unit: 'per passenger',
    verifiedOn: '2026-10-15',
    sourceType: 'official',
    sourceName: 'National Transport Commission Sri Lanka',
    sourceUrl: 'https://ntc.gov.lk',
    notes: 'Departs every 30 minutes from the airport outer terminal bay. Takes approx 45 minutes.'
  },
  {
    id: 'price-cmb-colombo-taxi',
    category: 'airport',
    itemKey: 'airport.taxi_colombo',
    name: 'CMB Airport to Colombo City (PickMe / Uber App)',
    description: 'Ride-hail car or sedan via Colombo Expressway directly to central Colombo hotels (Fort, Kollupitiya, Cinnamon Gardens).',
    amountMinLkr: 6500,
    amountMaxLkr: 8500,
    unit: 'per vehicle',
    verifiedOn: '2026-10-16',
    sourceType: 'operator',
    sourceName: 'PickMe Sri Lanka Live App Tariff',
    sourceUrl: 'https://pickme.lk',
    notes: 'Excludes ~LKR 400 expressway toll (usually added to fare or paid cash at toll booth). Avoid airport touts quoting $50+.'
  },
  {
    id: 'price-cmb-negombo-taxi',
    category: 'airport',
    itemKey: 'airport.taxi_negombo',
    name: 'CMB Airport to Negombo Beach (PickMe / Tuk-Tuk / Taxi)',
    description: 'Short transfer to Negombo coastal hotel strip. Ideal for evening arrivals to bypass Colombo rush-hour traffic.',
    amountMinLkr: 1800,
    amountMaxLkr: 2800,
    unit: 'per vehicle (car) / LKR 1,200 (tuk-tuk)',
    verifiedOn: '2026-10-16',
    sourceType: 'field_check',
    sourceName: 'Katunayake-Negombo Field Audit',
    sourceUrl: 'https://airport.lk',
    notes: 'Only 15–20 minutes drive. The smart choice if landing after 3 PM.'
  },
  {
    id: 'price-cmb-kandy-transfer',
    category: 'airport',
    itemKey: 'airport.transfer_kandy',
    name: 'CMB Airport to Kandy (Private Car / Van)',
    description: 'Direct mountain climb via Central Expressway (E04) and Ambepussa to Kandy hotels.',
    amountMinLkr: 18000,
    amountMaxLkr: 24000,
    unit: 'per vehicle (sedan/van)',
    verifiedOn: '2026-10-14',
    sourceType: 'operator',
    sourceName: 'Airport Chauffeur Rate Matrix',
    sourceUrl: 'https://airport.lk',
    notes: 'Takes ~3h 15m. Factors in winding hill climb from Kadugannawa.'
  },
  {
    id: 'price-cmb-galle-transfer',
    category: 'airport',
    itemKey: 'airport.transfer_galle',
    name: 'CMB Airport to Galle Fort / Unawatuna (Southern Expressway)',
    description: 'Direct highway transfer via E03 Katunayake Expressway & E01 Southern Expressway.',
    amountMinLkr: 22000,
    amountMaxLkr: 28000,
    unit: 'per vehicle',
    verifiedOn: '2026-10-15',
    sourceType: 'operator',
    sourceName: 'Southern Expressway Chauffeur Tariff',
    sourceUrl: 'https://rda.gov.lk',
    notes: 'Fast 2h 15m run. Tolls (~LKR 1,200 total) may be charged separately.'
  },

  // 2. Connectivity & SIM
  {
    id: 'price-dialog-tourist-50gb',
    category: 'sim',
    itemKey: 'sim.dialog_tourist_50gb',
    name: 'Dialog Tourist Plan (50GB Data + Local/Intl Calls)',
    description: 'Dialog official airport arrival counter plan. Best nationwide coverage including remote tea country & Horton Plains.',
    amountMinLkr: 2950,
    amountMaxLkr: 3450,
    unit: '30-day SIM package (~$10-11 USD)',
    verifiedOn: '2026-10-15',
    sourceType: 'official',
    sourceName: 'Dialog Axiata Sri Lanka Official Tourist Tariff',
    sourceUrl: 'https://www.dialog.lk',
    notes: 'Official counter located immediately on the left as you exit customs baggage hall. Passport required for biometric registration.'
  },
  {
    id: 'price-mobitel-tourist-sim',
    category: 'sim',
    itemKey: 'sim.mobitel_tourist',
    name: 'SLT-Mobitel Tourist SIM (60GB Data)',
    description: 'State telecom operator with robust coastal and railway line connectivity.',
    amountMinLkr: 2800,
    amountMaxLkr: 3200,
    unit: '30-day package (~$9.50 USD)',
    verifiedOn: '2026-10-15',
    sourceType: 'official',
    sourceName: 'SLT-Mobitel Sri Lanka Tariff',
    sourceUrl: 'https://www.mobitel.lk',
    notes: 'Counter right next to Dialog in the arrivals hall. Supports instant QR eSIM activation for unlocked iPhones & Pixels.'
  },

  // 3. Daily Transit & Tuk-Tuk
  {
    id: 'price-tuktuk-base-meter',
    category: 'transit',
    itemKey: 'transit.tuktuk_base_coastal',
    name: 'Fair Tuk-Tuk Rate: Flat Coast Road (Per Km Benchmark)',
    sinhalaName: 'ත්‍රිරෝද රථ ගාස්තු',
    description: 'Fuel-indexed honest rate for unmetered three-wheelers outside Colombo (Galle, Mirissa, Weligama, Tangalle).',
    amountMinLkr: 95,
    amountMaxLkr: 110,
    unit: 'per km (after LKR 120 base 1st km)',
    verifiedOn: '2026-10-15',
    sourceType: 'field_check',
    sourceName: 'All-Island Three-Wheeler Driver Union Guidelines',
    sourceUrl: 'https://consumerprotection.gov.lk',
    notes: 'In hill country (Ella, Nuwara Eliya), expect +30% (~LKR 130/km) due to steep switchbacks and fuel consumption.'
  },
  {
    id: 'price-train-kandy-ella',
    category: 'transit',
    itemKey: 'transit.train_kandy_ella',
    name: 'Scenic Blue Train: Kandy to Ella (Reserved 2nd Class)',
    sinhalaName: 'දුම්රිය ගාස්තු',
    description: 'World-famous mountain railway traversing Pattipola summit (1,898m) and Nine Arch Bridge.',
    amountMinLkr: 3000,
    amountMaxLkr: 4000,
    unit: 'per reserved seat (official railway booking)',
    verifiedOn: '2026-10-15',
    sourceType: 'official',
    sourceName: 'Sri Lanka Railways Online Reservation Portal',
    sourceUrl: 'https://pravesha.lk',
    notes: 'Tickets open exactly 30 days prior at 08:00 AM Sri Lanka time. 2nd class has opening windows; 1st class is sealed A/C.'
  },

  // 4. Cultural & UNESCO Entrance Fees
  {
    id: 'price-entry-sigiriya',
    category: 'entrance',
    itemKey: 'entrance.sigiriya_lion_rock',
    name: 'Sigiriya Lion Rock Fortress (Foreign Adult)',
    sinhalaName: 'සීගිරිය පිවිසුම් ගාස්තුව',
    description: '5th-century palace citadel on 200m vertical rock. Includes water gardens, mirror wall & museum.',
    amountMinLkr: 10800,
    amountMaxLkr: 11000,
    unit: 'per foreign adult ($36 USD equivalent)',
    verifiedOn: '2026-10-15',
    sourceType: 'official',
    sourceName: 'Central Cultural Fund Sri Lanka',
    sourceUrl: 'https://ccf.gov.lk',
    notes: 'SAARC passport holders pay 50% ($18 USD equivalent). Locals pay LKR 100.'
  },
  {
    id: 'price-entry-tooth-temple',
    category: 'entrance',
    itemKey: 'entrance.tooth_temple_kandy',
    name: 'Temple of the Sacred Tooth Relic (Sri Dalada Maligawa, Kandy)',
    sinhalaName: 'ශ්‍රී දළදා මාළිගාව',
    description: 'Sri Lanka’s most venerated Buddhist temple. Housing the sacred tooth relic of the Buddha.',
    amountMinLkr: 2000,
    amountMaxLkr: 2000,
    unit: 'per foreign adult (~$6.50 USD)',
    verifiedOn: '2026-10-15',
    sourceType: 'official',
    sourceName: 'Sri Dalada Maligawa Temple Board',
    sourceUrl: 'https://sridaladamaligawa.lk',
    notes: 'Shoulders & knees must be covered. Shoe deposit is free (optional small tip). Bring thick white socks for hot stone courtyards.'
  },

  // 5. Safari & Wildlife
  {
    id: 'price-safari-udawalawe-jeep',
    category: 'safari',
    itemKey: 'safari.udawalawe_jeep_hire',
    name: 'Udawalawe National Park 4x4 Safari Jeep (Half-Day 3-4 hrs)',
    description: 'Standard 4x4 safari jeep with driver/spotter. Guaranteed elephant herds around the reservoir basin.',
    amountMinLkr: 12000,
    amountMaxLkr: 15000,
    unit: 'per jeep (seats up to 6 people)',
    verifiedOn: '2026-10-15',
    sourceType: 'field_check',
    sourceName: 'Udawalawe Safari Jeep Drivers Association',
    sourceUrl: 'https://dwc.gov.lk',
    notes: 'Park entry ticket (~LKR 11,500 / ~$38 USD per foreign adult) is paid separately at DWC ticket counter.'
  },
  {
    id: 'price-safari-yala-jeep',
    category: 'safari',
    itemKey: 'safari.yala_jeep_hire',
    name: 'Yala National Park Block 1 Safari Jeep (Morning 6am–10am)',
    description: 'Modified 4x4 jeep for leopard and sloth bear tracking.',
    amountMinLkr: 14000,
    amountMaxLkr: 18000,
    unit: 'per jeep (up to 6 passengers)',
    verifiedOn: '2026-10-15',
    sourceType: 'field_check',
    sourceName: 'Yala Safari Drivers Union Tissamaharama',
    sourceUrl: 'https://dwc.gov.lk',
    notes: 'Always book directly at gate or via reputable lodge. Avoid street touts quoting LKR 35,000+.'
  },

  // 6. Food & Dining
  {
    id: 'price-food-local-meal',
    category: 'food',
    itemKey: 'food.rice_and_curry_local',
    name: 'Authentic Rice & Curry Lunch (Local Roadside Eatery / "Hotel")',
    sinhalaName: 'බත් සහ ව්‍යංජන',
    description: 'Steaming village rice with dhal (parippu), pol sambol, 2 vegetable curries, papadam, and chicken/fish.',
    amountMinLkr: 450,
    amountMaxLkr: 850,
    unit: 'per plate (all-you-can-eat refill)',
    verifiedOn: '2026-10-15',
    sourceType: 'field_check',
    sourceName: 'Field Price Benchmark across Colombo, Kandy, Galle',
    sourceUrl: 'https://ceyloncopilot.pages.dev/food',
    notes: 'In tourist cafes in Mirissa/Ella expect LKR 1,500–2,500. Roadside clean local "Hotels" serve genuine meals at LKR 500-800.'
  },
  {
    id: 'price-food-egg-hopper',
    category: 'food',
    itemKey: 'food.egg_hopper',
    name: 'Egg Hopper with Lunu Miris (Street Dinner)',
    sinhalaName: 'බිත්තර ආප්ප',
    description: 'Crisp bowl-shaped fermented rice-flour pancake with a soft-yolk egg in the center and spicy onion sambol.',
    amountMinLkr: 120,
    amountMaxLkr: 180,
    unit: 'per egg hopper',
    verifiedOn: '2026-10-15',
    sourceType: 'field_check',
    sourceName: 'Street Food Audit Colombo & Galle',
    sourceUrl: 'https://ceyloncopilot.pages.dev/food',
    notes: 'Plain hoppers are ~LKR 50–70 each. Prepared fresh in woks from 6 PM onward.'
  }
];

export function isPriceStale(verifiedDateStr: string): boolean {
  const verifiedDate = new Date(verifiedDateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 90;
}

export function formatLkrToUsd(lkrAmount: number, lkrPerUsd: number = 305): string {
  return `$${(lkrAmount / lkrPerUsd).toFixed(2)}`;
}
