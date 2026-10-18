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
    url: '/images/cmb-airport.jpg',
    title: 'Touchdown at CMB Katunayake',
    subtitle: 'Bandaranaike International Airport (CMB)',
    category: 'arrival',
    alt: 'Bandaranaike International Airport CMB terminal and runway in Sri Lanka',
  },
  arrivalNegombo: {
    id: 'arrival-negombo',
    url: '/images/negombo-beach.jpg',
    title: 'First Night Sanctuary',
    subtitle: 'Negombo Beach Coastline (15 mins from CMB)',
    category: 'arrival',
    alt: 'Negombo sandy beach with palms and ocean waters in Sri Lanka',
  },
  trainNineArch: {
    id: 'train-nine-arch',
    url: '/images/nine-arch-bridge.jpg',
    title: 'The Blue Train Over Nine Arch Bridge',
    subtitle: 'Demodara Loop, Ella Highlands (1,041m elevation)',
    category: 'transport',
    alt: 'Historic stone Nine Arch Bridge viaduct surrounded by tea hills in Ella Sri Lanka',
  },
  trainTeaHills: {
    id: 'train-tea-hills',
    url: '/images/tea-plantations.jpg',
    title: 'Highland Mountain Physics',
    subtitle: 'Nuwara Eliya misty tea plantations & rolling hills',
    category: 'transport',
    alt: 'Lush green tea estate terraces in the central highlands of Nuwara Eliya Sri Lanka',
  },
  mirissaPalms: {
    id: 'mirissa-palms',
    url: '/images/mirissa-coconut-hill.jpg',
    title: 'Coconut Tree Hill & South Coast',
    subtitle: 'Mirissa, Southern Province (Peak Sun Dec – April)',
    category: 'stay',
    alt: 'Famous Coconut Tree Hill overlooking turquoise Indian Ocean in Mirissa Sri Lanka',
  },
  sigiriyaRock: {
    id: 'sigiriya-rock',
    url: '/images/sigiriya-rock.jpg',
    title: 'Sigiriya Lion Rock Fortress',
    subtitle: 'Cultural Triangle 5th Century UNESCO Ancient Citadel',
    category: 'culture',
    alt: 'Ancient Sigiriya Lion Rock fortress monolith rising over Sri Lankan forest',
  },
  kandyToothTemple: {
    id: 'kandy-tooth-temple',
    url: '/images/kandy-tooth-temple.jpg',
    title: 'Temple of the Sacred Tooth Relic',
    subtitle: 'Sri Dalada Maligawa by Kandy Lake',
    category: 'culture',
    alt: 'Golden roof of the sacred Temple of the Tooth (Sri Dalada Maligawa) in Kandy Sri Lanka',
  },
  wildElephants: {
    id: 'wild-elephants',
    url: '/images/udawalawe-elephants.jpg',
    title: 'Ethical Wild Elephant Safaris',
    subtitle: 'Udawalawe & Minneriya National Parks',
    category: 'wildlife',
    alt: 'Wild Asian elephant family in Udawalawe National Park grassland Sri Lanka',
  },
  sriLankanCurry: {
    id: 'sri-lankan-curry',
    url: '/images/kottu-roti.jpg',
    title: 'Rhythmic Sizzling Kottu Roti',
    subtitle: 'Authentic Sri Lankan street eatery favorite',
    category: 'food',
    alt: 'Authentic fresh hot Sri Lankan Kottu Roti prepared with vegetables and spices',
  },
  galleFortLighthouse: {
    id: 'galle-fort-lighthouse',
    url: '/images/galle-fort-lighthouse.jpg',
    title: 'Galle Fort Ramparts at Sunset',
    subtitle: 'Historic 18th-century maritime bastion and lighthouse',
    category: 'departure',
    alt: 'Historic white Galle Lighthouse standing on ocean ramparts in Galle Fort Sri Lanka',
  },
  colomboCoastline: {
    id: 'colombo-coastline',
    url: '/images/colombo-skyline.jpg',
    title: 'Colombo Lotus Tower & City',
    subtitle: 'Gateway to the Katunayake Expressway (E03)',
    category: 'departure',
    alt: 'Colombo Lotus Tower rising above the Sri Lankan commercial capital',
  },
  tropicalBeach: {
    id: 'tropical-beach',
    url: '/images/mirissa-coconut-hill.jpg',
    title: 'Unspoiled Tropical Shorelines',
    subtitle: 'Dual-monsoon glassy surf and white sand bays',
    category: 'stay',
    alt: 'Tropical palm-fringed coast and ocean in southern Sri Lanka',
  },
  tuktuk: {
    id: 'tuk-tuk',
    url: '/images/tuk-tuk.jpg',
    title: 'Sri Lankan Tuk-Tuk',
    subtitle: 'Island 3-wheeler transit',
    category: 'transport',
    alt: 'Authentic colorful Sri Lankan three-wheeler tuk-tuk taxi on the road',
  },
};
