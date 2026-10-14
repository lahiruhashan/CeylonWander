import { Place } from "@/types";

export interface HotTopic {
  id: string;
  label: string;
  icon: string;
  description: string;
  center: [number, number]; // [lng, lat]
  radiusKm: number;
  matches: (place: Place) => boolean;
}

export const HOT_TOPICS: HotTopic[] = [
  {
    id: "cultural-triangle",
    label: "Cultural Triangle",
    icon: "🏛️",
    description: "Sigiriya Rock, Dambulla Caves, Anuradhapura & Polonnaruwa UNESCO World Heritage",
    center: [80.7603, 7.9570],
    radiusKm: 75,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")} ${p.district}`.toLowerCase();
      const inDistricts = ["matale", "anuradhapura", "polonnaruwa"].includes(p.district.toLowerCase());
      const hasKeywords = ["unesco", "sigiriya", "dambulla", "anuradhapura", "polonnaruwa", "ruwanweli", "gal vihara", "vatadage", "pidurangala", "ritigala", "mihintale"].some(k => text.includes(k));
      return (inDistricts && (p.category === "heritage" || hasKeywords)) || hasKeywords;
    }
  },
  {
    id: "tea-trails-waterfalls",
    label: "Tea Trails & Waterfalls",
    icon: "🫖",
    description: "Nuwara Eliya, Ella, Pedro Estate, Lipton’s Seat & cascading mountain falls",
    center: [80.7690, 6.9497],
    radiusKm: 55,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      return (
        p.category === "tea_agriculture" ||
        p.sub_category === "waterfall" ||
        text.includes("tea") ||
        text.includes("waterfall") ||
        text.includes("falls") ||
        text.includes("estate") ||
        text.includes("lipton") ||
        text.includes("horton")
      );
    }
  },
  {
    id: "south-coast-surf",
    label: "South Surf & Whales",
    icon: "🏄",
    description: "Galle Dutch Fort, Mirissa blue whales, Weligama stilt fishermen & surf breaks",
    center: [80.3500, 6.0000],
    radiusKm: 55,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      const isSouth = ["galle", "matara", "hambantota"].includes(p.district.toLowerCase());
      return isSouth && (
        p.category === "coastal" ||
        text.includes("beach") ||
        text.includes("surf") ||
        text.includes("fort") ||
        text.includes("whale") ||
        text.includes("coral") ||
        text.includes("coast") ||
        text.includes("lighthouse")
      );
    }
  },
  {
    id: "wildlife-safaris",
    label: "Big 5 Wildlife Safaris",
    icon: "🐘",
    description: "Yala leopards, Udawalawe elephant herds, Minneriya gathering & Wilpattu",
    center: [80.7718, 7.8731],
    radiusKm: 250,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      return (
        p.category === "wildlife" ||
        p.sub_category === "national_park" ||
        text.includes("safari") ||
        text.includes("national park") ||
        text.includes("elephant") ||
        text.includes("leopard") ||
        text.includes("sanctuary") ||
        text.includes("wildlife")
      );
    }
  },
  {
    id: "sacred-relics-temples",
    label: "Sacred Relics & Temples",
    icon: "🛕",
    description: "Tooth Relic Temple, Jaya Sri Maha Bodhi, Nallur Kovil & Koneswaram",
    center: [80.6337, 7.2906],
    radiusKm: 250,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      return (
        ["temple", "stupa", "kovil", "monastery"].includes(p.sub_category.toLowerCase()) ||
        text.includes("sacred") ||
        text.includes("temple") ||
        text.includes("kovil") ||
        text.includes("vihara") ||
        text.includes("maligawa") ||
        text.includes("relic") ||
        text.includes("dagoba") ||
        text.includes("bodhi")
      );
    }
  },
  {
    id: "jaffna-northern-islands",
    label: "Jaffna & Delft Island",
    icon: "🏝️",
    description: "Nallur Kandaswamy Kovil, Jaffna Fort, wild pony Delft Island & Point Pedro",
    center: [80.0255, 9.6615],
    radiusKm: 65,
    matches: (p: Place) => {
      const isNorth = ["jaffna", "mannar", "kilinochchi", "mullaitivu", "vavuniya"].includes(p.district.toLowerCase()) ||
                      p.province.toLowerCase().includes("northern");
      return isNorth;
    }
  },
  {
    id: "east-coast-corals",
    label: "East Coast Bays & Corals",
    icon: "🏖️",
    description: "Pigeon Island Marine Park, Nilaveli Beach, Pasikudah Bay & Arugam Bay",
    center: [81.3500, 8.2000],
    radiusKm: 110,
    matches: (p: Place) => {
      const isEast = ["trincomalee", "batticaloa", "ampara"].includes(p.district.toLowerCase()) ||
                     p.province.toLowerCase().includes("eastern");
      return isEast;
    }
  },
  {
    id: "rainforests-peaks",
    label: "Rainforests & Cloud Peaks",
    icon: "🌲",
    description: "Sinharaja UNESCO Virgin Rainforest, Knuckles Mountain Range & Riverston Peak",
    center: [80.5000, 7.1000],
    radiusKm: 90,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      return (
        text.includes("rainforest") ||
        text.includes("sinharaja") ||
        text.includes("knuckles") ||
        text.includes("riverston") ||
        text.includes("peak") ||
        text.includes("horton") ||
        text.includes("hiking") ||
        text.includes("trek")
      );
    }
  },
  {
    id: "scenic-train-corridor",
    label: "Scenic Train Corridors",
    icon: "🚂",
    description: "Demodara Nine Arch Bridge, Ella Gap, Kandy-Ella railway line vistas",
    center: [81.0466, 6.8667],
    radiusKm: 45,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      return (
        text.includes("nine arch") ||
        text.includes("demodara") ||
        text.includes("railway") ||
        text.includes("train") ||
        text.includes("ella") ||
        text.includes("bridge")
      );
    }
  },
  {
    id: "rock-fortresses",
    label: "Ancient Rock Fortresses",
    icon: "🧗",
    description: "Sigiriya Lion Rock, Pidurangala Summit, Yapahuwa Medieval Stairway & Mulkirigala",
    center: [80.5500, 7.7500],
    radiusKm: 85,
    matches: (p: Place) => {
      const text = `${p.name} ${p.description || ""} ${p.tags.join(" ")}`.toLowerCase();
      return (
        text.includes("rock") ||
        text.includes("fortress") ||
        text.includes("sigiriya") ||
        text.includes("pidurangala") ||
        text.includes("yapahuwa") ||
        text.includes("mulkirigala") ||
        text.includes("athugala")
      );
    }
  }
];
