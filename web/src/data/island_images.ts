export interface IslandImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  category: 'arrival' | 'transport' | 'stay' | 'departure' | 'culture' | 'wildlife' | 'food';
  alt: string;
}

export const ISLAND_IMAGES: Record<string, IslandImage> = {
  arrivalFlight: {
    id: 'arrival-flight',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&auto=format&fit=crop&q=80',
    title: 'Touchdown at CMB',
    subtitle: 'Bandaranaike International Airport, Katunayake',
    category: 'arrival',
    alt: 'Aircraft approaching tropical Sri Lankan coastline',
  },
  arrivalNegombo: {
    id: 'arrival-negombo',
    url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1000&auto=format&fit=crop&q=80',
    title: 'First Night Sanctuary',
    subtitle: 'Negombo Beach Lagoon & Royal Palms (15 mins from CMB)',
    category: 'arrival',
    alt: 'Tropical palm avenue along Negombo Sri Lanka',
  },
  trainNineArch: {
    id: 'train-nine-arch',
    url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1000&auto=format&fit=crop&q=80',
    title: 'The Blue Train Over Nine Arch Bridge',
    subtitle: 'Demodara Loop, Ella Highlands (1,041m elevation)',
    category: 'transport',
    alt: 'Sri Lanka iconic blue mountain train crossing historic Nine Arch Bridge in Ella',
  },
  trainTeaHills: {
    id: 'train-tea-hills',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80',
    title: 'Highland Mountain Physics',
    subtitle: 'Nanu Oya to Ella through emerald tea terraces',
    category: 'transport',
    alt: 'Train passing through lush green Sri Lankan tea plantations and misty mountains',
  },
  mirissaPalms: {
    id: 'mirissa-palms',
    url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1000&auto=format&fit=crop&q=80',
    title: 'Coconut Tree Hill & South Coast',
    subtitle: 'Mirissa, Southern Province (Peak Sun Dec – April)',
    category: 'stay',
    alt: 'Coconut Tree Hill headland overlooking turquoise Indian ocean in Mirissa',
  },
  sigiriyaRock: {
    id: 'sigiriya-rock',
    url: 'https://images.unsplash.com/photo-1580974852861-c381510bc98a?w=1000&auto=format&fit=crop&q=80',
    title: 'Sigiriya Lion Rock Fortress',
    subtitle: 'Cultural Triangle 5th Century UNESCO Citadel',
    category: 'culture',
    alt: 'Ancient Sigiriya rock fortress rising above central Sri Lankan forests',
  },
  kandyToothTemple: {
    id: 'kandy-tooth-temple',
    url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1000&auto=format&fit=crop&q=80',
    title: 'Temple of the Sacred Tooth Relic',
    subtitle: 'Sri Dalada Maligawa by Kandy Lake',
    category: 'culture',
    alt: 'Golden roof of the Temple of the Sacred Tooth Relic in Kandy',
  },
  wildElephants: {
    id: 'wild-elephants',
    url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1000&auto=format&fit=crop&q=80',
    title: 'Ethical Wild Elephant Safaris',
    subtitle: 'Udawalawe & Minneriya National Parks',
    category: 'wildlife',
    alt: 'Herd of wild Asian elephants roaming peacefully in Sri Lankan grassland',
  },
  sriLankanCurry: {
    id: 'sri-lankan-curry',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    title: 'Authentic Rice & Curry Feast',
    subtitle: 'Freshly ground spices, coconut milk & clay pot cooking',
    category: 'food',
    alt: 'Authentic Sri Lankan curries, dhal, and sambols served with steamed rice',
  },
  galleFortLighthouse: {
    id: 'galle-fort-lighthouse',
    url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1000&auto=format&fit=crop&q=80',
    title: 'Galle Fort Ramparts at Sunset',
    subtitle: 'Southern coast maritime ramparts & ocean breeze',
    category: 'departure',
    alt: 'Historic Galle Fort lighthouse glowing in golden hour ocean light',
  },
  colomboCoastline: {
    id: 'colombo-coastline',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&auto=format&fit=crop&q=80',
    title: 'Colombo Marine Drive & Skyline',
    subtitle: 'Gateway to the Katunayake Expressway (E03)',
    category: 'departure',
    alt: 'Colombo coastal skyline along the Indian Ocean',
  },
  tropicalBeach: {
    id: 'tropical-beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    title: 'Unspoiled Tropical Shorelines',
    subtitle: 'Dual-monsoon glassy surf and white sand bays',
    category: 'stay',
    alt: 'Crystal turquoise waters and palm-fringed tropical beach in Sri Lanka',
  },
};
