export interface RegionItem {
  id: string;
  name: string;
  shortName: string;
  province: string;
  district?: string;
  coords: [number, number]; // [lng, lat]
  radiusKm: number;
}

export interface ProvinceGroup {
  province: string;
  icon: string;
  regions: RegionItem[];
}

export const SRI_LANKA_REGIONS: ProvinceGroup[] = [
  {
    province: "All Island",
    icon: "🇱🇰",
    regions: [
      {
        id: "all-sri-lanka",
        name: "All Sri Lanka (Nationwide View)",
        shortName: "All Sri Lanka",
        province: "All Island",
        coords: [80.7718, 7.8731],
        radiusKm: 250,
      },
    ],
  },
  {
    province: "Central Province",
    icon: "⛰️",
    regions: [
      {
        id: "central-all",
        name: "Central Province (Entire)",
        shortName: "Central Province",
        province: "Central Province",
        coords: [80.6800, 7.3000],
        radiusKm: 70,
      },
      {
        id: "kandy-hub",
        name: "Kandy & Hill Capital (Temple of Tooth, Peradeniya)",
        shortName: "Kandy & Hills",
        province: "Central Province",
        district: "Kandy",
        coords: [80.6337, 7.2906],
        radiusKm: 30,
      },
      {
        id: "matale-sigiriya",
        name: "Matale, Sigiriya Rock & Dambulla Caves",
        shortName: "Sigiriya & Dambulla",
        province: "Central Province",
        district: "Matale",
        coords: [80.7603, 7.9570],
        radiusKm: 35,
      },
      {
        id: "nuwara-eliya-tea",
        name: "Nuwara Eliya, Horton Plains & Tea Valleys",
        shortName: "Nuwara Eliya & Tea",
        province: "Central Province",
        district: "Nuwara Eliya",
        coords: [80.7690, 6.9497],
        radiusKm: 35,
      },
      {
        id: "knuckles-riverston",
        name: "Knuckles Range & Riverston Peak Corridor",
        shortName: "Knuckles & Riverston",
        province: "Central Province",
        district: "Matale",
        coords: [80.7300, 7.5300],
        radiusKm: 30,
      },
    ],
  },
  {
    province: "Southern Province",
    icon: "🏖️",
    regions: [
      {
        id: "southern-all",
        name: "Southern Province (Entire Coast & Safaris)",
        shortName: "Southern Province",
        province: "Southern Province",
        coords: [80.4500, 6.1500],
        radiusKm: 75,
      },
      {
        id: "galle-south-coast",
        name: "Galle Dutch Fort, Unawatuna & Hikkaduwa",
        shortName: "Galle & Dutch Fort",
        province: "Southern Province",
        district: "Galle",
        coords: [80.2168, 6.0329],
        radiusKm: 25,
      },
      {
        id: "matara-mirissa",
        name: "Mirissa (Whales & Surf), Weligama & Dondra Head",
        shortName: "Mirissa & Weligama",
        province: "Southern Province",
        district: "Matara",
        coords: [80.4600, 5.9450],
        radiusKm: 25,
      },
      {
        id: "hambantota-yala",
        name: "Hambantota, Tangalle Coast & Yala Safari Entry",
        shortName: "Tangalle & Yala South",
        province: "Southern Province",
        district: "Hambantota",
        coords: [81.1185, 6.1246],
        radiusKm: 45,
      },
    ],
  },
  {
    province: "Western Province",
    icon: "🏙️",
    regions: [
      {
        id: "western-all",
        name: "Western Province (Entire Metro & Coast)",
        shortName: "Western Province",
        province: "Western Province",
        coords: [79.9200, 6.8500],
        radiusKm: 50,
      },
      {
        id: "colombo-metro",
        name: "Colombo Metro, Galle Face & Beira Lake",
        shortName: "Colombo Metro",
        province: "Western Province",
        district: "Colombo",
        coords: [79.8612, 6.9271],
        radiusKm: 20,
      },
      {
        id: "negombo-gampaha",
        name: "Negombo Dutch Canal, Beach & Lagoon (Airport Hub)",
        shortName: "Negombo & Airport",
        province: "Western Province",
        district: "Gampaha",
        coords: [79.8358, 7.2008],
        radiusKm: 25,
      },
      {
        id: "kalutara-bentota",
        name: "Kalutara Bodhiya & Bentota Golden Sand River",
        shortName: "Kalutara & Bentota",
        province: "Western Province",
        district: "Kalutara",
        coords: [79.9880, 6.4250],
        radiusKm: 25,
      },
    ],
  },
  {
    province: "Uva Province",
    icon: "🚂",
    regions: [
      {
        id: "uva-all",
        name: "Uva Province (Entire Hill Valley & Waterfalls)",
        shortName: "Uva Province",
        province: "Uva Province",
        coords: [81.1000, 6.9500],
        radiusKm: 60,
      },
      {
        id: "ella-badulla",
        name: "Ella Gap, Demodara Nine Arch & Dunhinda Falls",
        shortName: "Ella & Badulla",
        province: "Uva Province",
        district: "Badulla",
        coords: [81.0466, 6.8667],
        radiusKm: 25,
      },
      {
        id: "haputale-lipton",
        name: "Haputale & Lipton’s Seat Tea Ridge",
        shortName: "Haputale & Lipton’s Seat",
        province: "Uva Province",
        district: "Badulla",
        coords: [80.9632, 6.7686],
        radiusKm: 20,
      },
      {
        id: "wellawaya-monaragala",
        name: "Diyaluma Rock Pools, Buduruwagala & Wellawaya",
        shortName: "Diyaluma & Buduruwagala",
        province: "Uva Province",
        district: "Monaragala",
        coords: [81.0700, 6.7400],
        radiusKm: 30,
      },
    ],
  },
  {
    province: "North Central Province",
    icon: "🏛️",
    regions: [
      {
        id: "north-central-all",
        name: "North Central Province (Cultural Triangle Heart)",
        shortName: "North Central Province",
        province: "North Central Province",
        coords: [80.7000, 8.2000],
        radiusKm: 70,
      },
      {
        id: "anuradhapura-ancient",
        name: "Anuradhapura Sacred Ancient City & Mihintale",
        shortName: "Anuradhapura & Mihintale",
        province: "North Central Province",
        district: "Anuradhapura",
        coords: [80.4000, 8.3500],
        radiusKm: 30,
      },
      {
        id: "polonnaruwa-minneriya",
        name: "Polonnaruwa Gal Vihara, Vatadage & Minneriya Safari",
        shortName: "Polonnaruwa & Minneriya",
        province: "North Central Province",
        district: "Polonnaruwa",
        coords: [81.0020, 7.9403],
        radiusKm: 35,
      },
    ],
  },
  {
    province: "Northern Province",
    icon: "🏝️",
    regions: [
      {
        id: "northern-all",
        name: "Northern Province (Entire Peninsula & Islands)",
        shortName: "Northern Province",
        province: "Northern Province",
        coords: [80.3000, 9.4000],
        radiusKm: 80,
      },
      {
        id: "jaffna-peninsula",
        name: "Jaffna City, Nallur Kovil & Dutch Fort",
        shortName: "Jaffna City",
        province: "Northern Province",
        district: "Jaffna",
        coords: [80.0255, 9.6615],
        radiusKm: 25,
      },
      {
        id: "delft-islands",
        name: "Delft Island (Wild Ponies) & Nainativu Nagadeepa",
        shortName: "Delft & Northern Islands",
        province: "Northern Province",
        district: "Jaffna",
        coords: [79.6900, 9.5100],
        radiusKm: 25,
      },
      {
        id: "point-pedro-north",
        name: "Point Pedro (Sri Lanka’s Northernmost Tip)",
        shortName: "Point Pedro",
        province: "Northern Province",
        district: "Jaffna",
        coords: [80.2400, 9.8240],
        radiusKm: 20,
      },
      {
        id: "mannar-basin",
        name: "Mannar Island, Ancient Baobab & Adam’s Bridge",
        shortName: "Mannar & Adam’s Bridge",
        province: "Northern Province",
        district: "Mannar",
        coords: [79.9042, 8.9810],
        radiusKm: 35,
      },
    ],
  },
  {
    province: "Eastern Province",
    icon: "🌊",
    regions: [
      {
        id: "eastern-all",
        name: "Eastern Province (Entire Coastline & Surf)",
        shortName: "Eastern Province",
        province: "Eastern Province",
        coords: [81.4000, 7.8000],
        radiusKm: 90,
      },
      {
        id: "trinco-east",
        name: "Trincomalee, Koneswaram & Pigeon Island Marine Park",
        shortName: "Trincomalee & Pigeon Island",
        province: "Eastern Province",
        district: "Trincomalee",
        coords: [81.2152, 8.5874],
        radiusKm: 30,
      },
      {
        id: "pasikudah-batticaloa",
        name: "Pasikudah Bay Shallow Coral & Batticaloa Lagoon",
        shortName: "Pasikudah & Batticaloa",
        province: "Eastern Province",
        district: "Batticaloa",
        coords: [81.5647, 7.8540],
        radiusKm: 35,
      },
      {
        id: "arugam-bay-south",
        name: "Arugam Bay World Surf Point & Kumana Bird Sanctuary",
        shortName: "Arugam Bay & Kumana",
        province: "Eastern Province",
        district: "Ampara",
        coords: [81.8286, 6.8428],
        radiusKm: 35,
      },
    ],
  },
  {
    province: "Sabaragamuwa Province",
    icon: "🌿",
    regions: [
      {
        id: "sabaragamuwa-all",
        name: "Sabaragamuwa Province (Rainforests & Wilderness)",
        shortName: "Sabaragamuwa Province",
        province: "Sabaragamuwa Province",
        coords: [80.4000, 6.6800],
        radiusKm: 60,
      },
      {
        id: "ratnapura-sinharaja",
        name: "Sinharaja UNESCO Virgin Rainforest & Ratnapura Gem City",
        shortName: "Sinharaja & Ratnapura",
        province: "Sabaragamuwa Province",
        district: "Ratnapura",
        coords: [80.4037, 6.6828],
        radiusKm: 35,
      },
      {
        id: "udawalawe-basin",
        name: "Udawalawe National Park & Elephant Transit Home",
        shortName: "Udawalawe Elephant Basin",
        province: "Sabaragamuwa Province",
        district: "Ratnapura",
        coords: [80.8800, 6.4700],
        radiusKm: 30,
      },
      {
        id: "kegalle-kitulgala",
        name: "Kitulgala White Water Rafting & Pinnawala Orphanage",
        shortName: "Kitulgala & Pinnawala",
        province: "Sabaragamuwa Province",
        district: "Kegalle",
        coords: [80.4131, 6.9922],
        radiusKm: 30,
      },
    ],
  },
  {
    province: "North Western (Wayamba) Province",
    icon: "🥥",
    regions: [
      {
        id: "north-western-all",
        name: "North Western Province (Fortresses & Dolphins)",
        shortName: "North Western Province",
        province: "North Western Province",
        coords: [80.0500, 7.6500],
        radiusKm: 65,
      },
      {
        id: "kurunegala-yapahuwa",
        name: "Yapahuwa Rock Fortress, Athugala & Panduwasnuwara",
        shortName: "Yapahuwa & Kurunegala",
        province: "North Western Province",
        district: "Kurunegala",
        coords: [80.3649, 7.4863],
        radiusKm: 35,
      },
      {
        id: "kalpitiya-puttalam",
        name: "Kalpitiya Dolphin Lagoon & Wilpattu National Park Gateway",
        shortName: "Kalpitiya & Wilpattu Gateway",
        province: "North Western Province",
        district: "Puttalam",
        coords: [79.7645, 8.2312],
        radiusKm: 45,
      },
    ],
  },
];

// Flat lookup map
export const ALL_REGIONS_LIST: RegionItem[] = SRI_LANKA_REGIONS.flatMap((g) => g.regions);

export const REGION_BY_ID: Record<string, RegionItem> = {};
for (const reg of ALL_REGIONS_LIST) {
  REGION_BY_ID[reg.id] = reg;
}
