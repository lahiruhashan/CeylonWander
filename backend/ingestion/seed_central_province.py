import asyncio
import uuid
import re
from backend.app.database import AsyncSessionLocal, engine, Base
from backend.app.models.place import Place
from backend.app.models.region import Region
from backend.app.models.loop import ItineraryLoop
from sqlalchemy import select

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

NATIONWIDE_REGIONS = [
    {
        "id": "kandy-hub",
        "name": "Kandy & Hill Country",
        "province": "Central Province",
        "description": "Sri Lanka's hill capital, home to the sacred Tooth Relic, mist-shrouded tea valleys, and ancient royal temples.",
        "center_lat": 7.2906,
        "center_lng": 80.6337,
        "bounding_box": {"min_lat": 7.18, "max_lat": 7.38, "min_lng": 80.52, "max_lng": 80.72},
        "offline_pack_size_mb": 18.5,
        "offline_pack_version": "1.0.0",
        "emergency_contacts": [
            {"service": "Kandy Tourist Police", "number": "+94 81 222 2222"},
            {"service": "Kandy General Hospital (Teaching)", "number": "+94 81 223 3337"},
            {"service": "Suwasariya Ambulance", "number": "1990"}
        ]
    },
    {
        "id": "galle-south-coast",
        "name": "Galle & Southern Coast",
        "province": "Southern Province",
        "description": "Colonial Dutch fortresses, golden surf bays, coconut hills, and coastal heritage.",
        "center_lat": 6.0329,
        "center_lng": 80.2168,
        "bounding_box": {"min_lat": 5.90, "max_lat": 6.15, "min_lng": 80.10, "max_lng": 80.45},
        "offline_pack_size_mb": 15.0,
        "offline_pack_version": "1.0.0",
        "emergency_contacts": [
            {"service": "Galle Fort Tourist Police", "number": "+94 91 222 2222"},
            {"service": "Karapitiya National Hospital", "number": "+94 91 223 2560"},
            {"service": "Suwasariya Ambulance", "number": "1990"}
        ]
    },
    {
        "id": "ella-badulla",
        "name": "Ella & Mountain Passes",
        "province": "Uva Province",
        "description": "Backpacker haven nestled in Ella Gap with the iconic Nine Arch Bridge, hiking peaks, and misty gorges.",
        "center_lat": 6.8667,
        "center_lng": 81.0466,
        "bounding_box": {"min_lat": 6.75, "max_lat": 6.98, "min_lng": 80.95, "max_lng": 81.18},
        "offline_pack_size_mb": 12.8,
        "offline_pack_version": "1.0.0",
        "emergency_contacts": [
            {"service": "Ella Police Post", "number": "+94 57 222 8533"},
            {"service": "Suwasariya Ambulance", "number": "1990"}
        ]
    },
    {
        "id": "colombo-metro",
        "name": "Colombo & Western Metro",
        "province": "Western Province",
        "description": "Commercial heart with lakeside temples, colonial architecture, street food markets, and sunset boardwalks.",
        "center_lat": 6.9271,
        "center_lng": 79.8612,
        "bounding_box": {"min_lat": 6.80, "max_lat": 7.05, "min_lng": 79.80, "max_lng": 80.00},
        "offline_pack_size_mb": 20.0,
        "offline_pack_version": "1.0.0",
        "emergency_contacts": [
            {"service": "Colombo Tourist Police HQ", "number": "+94 11 242 1052"},
            {"service": "Colombo National Hospital", "number": "+94 11 269 1111"},
            {"service": "Suwasariya Ambulance", "number": "1990"}
        ]
    },
    {
        "id": "matale-sigiriya",
        "name": "Sigiriya & Dambulla Corridor",
        "province": "Central / North Central",
        "description": "Ancient UNESCO rock citadel and golden cave temples guarding the gateway to the Cultural Triangle.",
        "center_lat": 7.9570,
        "center_lng": 80.7603,
        "bounding_box": {"min_lat": 7.80, "max_lat": 8.05, "min_lng": 80.60, "max_lng": 80.85},
        "offline_pack_size_mb": 16.0,
        "offline_pack_version": "1.0.0",
        "emergency_contacts": [
            {"service": "Sigiriya Police Station", "number": "+94 66 228 6222"},
            {"service": "Dambulla Base Hospital", "number": "+94 66 228 4761"}
        ]
    },
    {
        "id": "anuradhapura-ancient",
        "name": "Anuradhapura Sacred City",
        "province": "North Central Province",
        "description": "Ancient capital boasting colossal stupas, sacred Bodhi Tree, and ancient monastic engineering.",
        "center_lat": 8.3500,
        "center_lng": 80.4000,
        "bounding_box": {"min_lat": 8.25, "max_lat": 8.45, "min_lng": 80.30, "max_lng": 80.50},
        "offline_pack_size_mb": 16.5,
        "offline_pack_version": "1.0.0",
        "emergency_contacts": [
            {"service": "Anuradhapura Tourist Police", "number": "+94 25 222 2222"},
            {"service": "Teaching Hospital Anuradhapura", "number": "+94 25 222 2261"}
        ]
    }
]

EXPANDED_PLACES = [
    # --- KANDY & CENTRAL PROVINCE ---
    {
        "id": "temple-of-the-tooth",
        "name": "Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)",
        "slug": "temple-of-the-tooth",
        "local_names": {
            "en": "Temple of the Sacred Tooth Relic",
            "si": "ශ්‍රී දළදා මාළිගාව",
            "ta": "ஸ்ரீ தலதா மாளிகை"
        },
        "description": "Venerated Buddhist temple housing the sacred tooth relic of the Buddha, located inside the royal palace complex of the former Kingdom of Kandy.",
        "category": "heritage",
        "sub_category": "temple",
        "latitude": 7.2936,
        "longitude": 80.6413,
        "elevation_m": 510,
        "district": "Kandy",
        "province": "Central Province",
        "pricing": {
            "foreign_adult_lkr": 3000,
            "foreign_adult_usd": 10.0,
            "saarc_adult_lkr": 1500,
            "local_adult_lkr": 0,
            "child_concession": "Children under 12 free",
            "notes": "Foreign ticket counter accepts LKR or major credit cards. Local entry is completely free."
        },
        "dress_code": {
            "shoulders_covered": True,
            "knees_covered": True,
            "footwear_removed": True,
            "headwear_removed": True,
            "hot_pavement_warning": True,
            "photo_rules": "Photography permitted in courtyard. Strictly no selfie poses with backs turned towards shrines or Buddha representations.",
            "notes": "White or light-colored attire is customary and respected. Shoe counter available at entrance (small token tip ~100 LKR)."
        },
        "best_time_to_visit": {
            "recommended_window": "5:30 AM–7:00 AM or 6:00 PM–7:30 PM",
            "reason": "Aligns with the daily Thevava drumming and casket viewing ceremony without mid-day crowds.",
            "puja_times": ["05:30 AM", "09:30 AM", "06:30 PM"],
            "avoid_hours": "11:00 AM - 2:00 PM (Direct sun on unshaded stone courtyard)"
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [{"url": "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80", "caption": "Golden canopy of Sri Dalada Maligawa", "credit": "Unsplash"}],
        "tags": ["unesco", "sacred", "buddhism", "kandy-lake", "cultural-triangle"]
    },
    {
        "id": "peradeniya-botanical-gardens",
        "name": "Royal Botanical Gardens, Peradeniya",
        "slug": "royal-botanical-gardens-peradeniya",
        "local_names": {
            "en": "Royal Botanical Gardens, Peradeniya",
            "si": "පේරාදෙණිය රාජකීය උද්භිද උද්‍යානය",
            "ta": "பேராதனை தாவரவியல் பூங்கா"
        },
        "description": "Renowned for its collection of 4,000+ plant species, including orchids, royal palm avenues, cannonball trees, and massive Java fig tree spanning 2,500 sq meters.",
        "category": "nature",
        "sub_category": "park",
        "latitude": 7.2717,
        "longitude": 80.5956,
        "elevation_m": 460,
        "district": "Kandy",
        "province": "Central Province",
        "pricing": {
            "foreign_adult_lkr": 3000,
            "foreign_adult_usd": 10.0,
            "saarc_adult_lkr": 1500,
            "local_adult_lkr": 100,
            "child_concession": "Local children 50 LKR, foreign child 1500 LKR",
            "notes": "Card and cash accepted at primary counter."
        },
        "dress_code": {
            "shoulders_covered": False,
            "knees_covered": False,
            "footwear_removed": False,
            "headwear_removed": False,
            "hot_pavement_warning": False,
            "photo_rules": "Amateur photography permitted. Commercial/drone permits required separately.",
            "notes": "Comfortable walking shoes recommended for the 147-acre park."
        },
        "best_time_to_visit": {
            "recommended_window": "7:30 AM - 10:00 AM or 3:30 PM - 5:30 PM",
            "reason": "Pleasant morning shade, active flying fox colonies near the Mahaweli River bend.",
            "puja_times": []
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [{"url": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80", "caption": "Avenue of Royal Palm Trees", "credit": "Unsplash"}],
        "tags": ["gardens", "orchids", "mahaweli-river", "family-friendly", "walks"]
    },
    {
        "id": "gadaladeniya-vihara",
        "name": "Gadaladeniya Vihara",
        "slug": "gadaladeniya-vihara",
        "local_names": {
            "en": "Gadaladeniya Vihara",
            "si": "ගඩලාදෙණිය විහාරය",
            "ta": "கடாலாதெனிய விகாரை"
        },
        "description": "14th-century monastery built exclusively on a rocky outcrop in South Indian Dravidian architectural style by King Bhuvanekabahu IV.",
        "category": "heritage",
        "sub_category": "ruins",
        "latitude": 7.2583,
        "longitude": 80.5561,
        "elevation_m": 485,
        "district": "Kandy",
        "province": "Central Province",
        "pricing": {
            "foreign_adult_lkr": 500,
            "foreign_adult_usd": 1.7,
            "saarc_adult_lkr": 500,
            "local_adult_lkr": 0,
            "notes": "Small conservation ticket managed by Central Cultural Fund / temple trust."
        },
        "dress_code": {
            "shoulders_covered": True,
            "knees_covered": True,
            "footwear_removed": True,
            "headwear_removed": True,
            "hot_pavement_warning": True,
            "photo_rules": "Interior rock sanctum has sacred frescoes; avoid flash photography.",
            "notes": "Exposed bedrock gets intensely hot between 11 AM - 3 PM. Bring thick socks."
        },
        "best_time_to_visit": {
            "recommended_window": "8:00 AM - 10:30 AM",
            "reason": "Cool rock surfaces and morning tranquility before tour coaches arrive.",
            "puja_times": ["06:00 AM", "11:00 AM"]
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [],
        "tags": ["three-temple-loop", "dravidian", "stone-carving", "14th-century"]
    },
    {
        "id": "embekke-devalaya",
        "name": "Embekke Devalaya",
        "slug": "embekke-devalaya",
        "local_names": {
            "en": "Embekke Devalaya",
            "si": "ඇම්බැක්කේ දේවාලය",
            "ta": "எம்பக்கே தேவாலயம்"
        },
        "description": "Famed for its exquisite 14th-century carved wooden pillars portraying mythical creatures, swan-women (Hansaputtuwa), and dancers.",
        "category": "heritage",
        "sub_category": "monument",
        "latitude": 7.2183,
        "longitude": 80.5678,
        "elevation_m": 530,
        "district": "Kandy",
        "province": "Central Province",
        "pricing": {"foreign_adult_lkr": 600, "foreign_adult_usd": 2.0, "saarc_adult_lkr": 600, "local_adult_lkr": 0},
        "dress_code": {
            "shoulders_covered": True,
            "knees_covered": True,
            "footwear_removed": True,
            "headwear_removed": True,
            "hot_pavement_warning": False,
            "photo_rules": "Detailed photography of wood pillars is allowed without flash."
        },
        "best_time_to_visit": {
            "recommended_window": "9:00 AM - 11:30 AM",
            "reason": "Natural side sunlight illuminates the high-relief wood carvings in the drumming hall.",
            "puja_times": ["06:30 AM", "11:30 AM", "06:30 PM"]
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [],
        "tags": ["three-temple-loop", "wood-carvings", "gampola-kingdom"]
    },
    {
        "id": "ceylon-tea-museum-hantana",
        "name": "Ceylon Tea Museum, Hantana",
        "slug": "ceylon-tea-museum-hantana",
        "local_names": {
            "en": "Ceylon Tea Museum, Hantana",
            "si": "හැන්ටානා තේ කෞතුකාගාරය",
            "ta": "ஹந்தான தேயிலை அருங்காட்சியகம்"
        },
        "description": "Housed in the restored 1925 vintage Hantana Tea Factory. Features vintage machinery from pioneers James Taylor and Thomas Lipton.",
        "category": "tea_agriculture",
        "sub_category": "museum",
        "latitude": 7.2662,
        "longitude": 80.6275,
        "elevation_m": 720,
        "district": "Kandy",
        "province": "Central Province",
        "pricing": {"foreign_adult_lkr": 1500, "foreign_adult_usd": 5.0, "saarc_adult_lkr": 1000, "local_adult_lkr": 200},
        "dress_code": {"shoulders_covered": False, "knees_covered": False, "footwear_removed": False, "headwear_removed": False, "hot_pavement_warning": False},
        "best_time_to_visit": {"recommended_window": "8:30 AM - 11:00 AM", "reason": "Clear morning mountain views of Knuckles and Hantana range."},
        "access_feasibility": "tuk_tuk_track",
        "parking_available": True,
        "images": [],
        "tags": ["tea", "ceylon-tea", "hantana", "vintage"]
    },
    {
        "id": "hanthana-mountain-range",
        "name": "Hanthana Mountain Range",
        "slug": "hanthana-mountain-range",
        "local_names": {"en": "Hanthana Mountain Range", "si": "හන්තාන කඳු වැටිය", "ta": "ஹந்தான மலைத்தொடர்"},
        "description": "Seven rugged peaks rising above Kandy, popular for hiking through mist grasslands, pine patches, and panoramic views of Kandy basin and Knuckles.",
        "category": "nature",
        "sub_category": "viewpoint",
        "latitude": 7.2450,
        "longitude": 80.6290,
        "elevation_m": 1240,
        "district": "Kandy",
        "province": "Central Province",
        "pricing": {"foreign_adult_lkr": 0, "foreign_adult_usd": 0, "saarc_adult_lkr": 0, "local_adult_lkr": 0},
        "dress_code": {"shoulders_covered": False, "knees_covered": False, "footwear_removed": False, "headwear_removed": False, "hot_pavement_warning": False, "notes": "Leech socks recommended during wet spells."},
        "best_time_to_visit": {"recommended_window": "6:00 AM - 9:00 AM", "reason": "Climb early before valley mist blankets visibility."},
        "access_feasibility": "foot_trail",
        "parking_available": False,
        "images": [],
        "tags": ["hiking", "trekking", "off-grid"]
    },

    # --- SIGIRIYA & MATALE ---
    {
        "id": "sigiriya-lion-rock",
        "name": "Sigiriya Ancient Rock Fortress",
        "slug": "sigiriya-ancient-rock-fortress",
        "local_names": {"en": "Sigiriya Ancient Rock Fortress", "si": "සීගිරිය පර්වත රාජධානිය", "ta": "சிகிரியா குன்றகம்"},
        "description": "UNESCO World Heritage 5th-century citadel built by King Kashyapa atop a 200m volcanic plug, featuring ancient frescoes, mirror wall graffiti, and water gardens.",
        "category": "heritage",
        "sub_category": "archaeological_site",
        "latitude": 7.9570,
        "longitude": 80.7603,
        "elevation_m": 350,
        "district": "Matale",
        "province": "Central Province",
        "pricing": {
            "foreign_adult_lkr": 11000,
            "foreign_adult_usd": 36.0,
            "saarc_adult_lkr": 5500,
            "local_adult_lkr": 100,
            "notes": "Credit card and LKR accepted at Central Cultural Fund ticketing office. Dual pricing strictly verified by passport."
        },
        "dress_code": {
            "shoulders_covered": False,
            "knees_covered": False,
            "footwear_removed": False,
            "headwear_removed": False,
            "hot_pavement_warning": True,
            "photo_rules": "STRICTLY NO photography or flash allowed inside the Sigiriya Frescoes pocket.",
            "notes": "Wasp caution signs on lion paw stairs; remain quiet and avoid loud noises if alerted."
        },
        "best_time_to_visit": {
            "recommended_window": "6:30 AM - 8:30 AM or 4:00 PM - 6:00 PM",
            "reason": "Climbing 1,200 exposed iron stairs under midday sun (33°C+) is grueling. Morning is cooler and serene."
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [{"url": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80", "caption": "Sigiriya Lion Rock rising above the forest canopy", "credit": "Unsplash"}],
        "tags": ["unesco", "frescoes", "kashyapa", "climb", "cultural-triangle"]
    },
    {
        "id": "dambulla-cave-temple",
        "name": "Dambulla Royal Cave Temple & Golden Temple",
        "slug": "dambulla-royal-cave-temple",
        "local_names": {"en": "Dambulla Royal Cave Temple", "si": "දඹුල්ල රජමහා විහාරය", "ta": "தம்புள்ளை பொற்கோவில்"},
        "description": "Largest and best-preserved cave-temple complex in Sri Lanka, featuring 5 sanctuaries with 153 Buddha statues and 2,100 sq meters of Buddhist mural art.",
        "category": "heritage",
        "sub_category": "temple",
        "latitude": 7.8567,
        "longitude": 80.6483,
        "elevation_m": 340,
        "district": "Matale",
        "province": "Central Province",
        "pricing": {
            "foreign_adult_lkr": 2500,
            "foreign_adult_usd": 8.0,
            "saarc_adult_lkr": 2500,
            "local_adult_lkr": 0,
            "notes": "IMPORTANT: Ticket counter is at the base of the rock near Golden Buddha. You CANNOT buy tickets at the top cave entrance!"
        },
        "dress_code": {
            "shoulders_covered": True,
            "knees_covered": True,
            "footwear_removed": True,
            "headwear_removed": True,
            "hot_pavement_warning": True,
            "photo_rules": "Never pose with back to Buddha statues. No selfie sticks inside cave rooms.",
            "notes": "Shoe counter at top entrance (token fee ~100 LKR). Exposed granite rocks are scorching between 11 AM - 3 PM."
        },
        "best_time_to_visit": {
            "recommended_window": "7:00 AM - 9:00 AM or 4:30 PM - 6:30 PM",
            "reason": "Avoid burning hot rock surface under bare feet. Sunset view from cave terrace is stunning.",
            "puja_times": ["06:30 AM", "11:30 AM", "06:30 PM"]
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [],
        "tags": ["unesco", "caves", "murals", "buddha-statues"]
    },

    # --- ELLA & MOUNTAINS ---
    {
        "id": "nine-arch-bridge-ella",
        "name": "Nine Arch Bridge, Demodara",
        "slug": "nine-arch-bridge-ella",
        "local_names": {"en": "Nine Arch Bridge, Demodara", "si": "දෙමෝදර ආරුක්කු නමයේ පාලම", "ta": "ஒன்பது வளைவு பாலம்"},
        "description": "Iconic viaduct bridge constructed from stone blocks and cement without steel reinforcement during British Ceylon railway expansion in 1921.",
        "category": "heritage",
        "sub_category": "monument",
        "latitude": 6.8768,
        "longitude": 81.0608,
        "elevation_m": 940,
        "district": "Badulla",
        "province": "Uva Province",
        "pricing": {"foreign_adult_lkr": 0, "foreign_adult_usd": 0, "saarc_adult_lkr": 0, "local_adult_lkr": 0},
        "dress_code": {"shoulders_covered": False, "knees_covered": False, "footwear_removed": False, "headwear_removed": False, "hot_pavement_warning": False, "photo_rules": "Popular photography spot. Do NOT sit on track edges when train horns sound."},
        "best_time_to_visit": {"recommended_window": "9:15 AM, 11:45 AM, 3:20 PM or 5:30 PM", "reason": "Aligns with scheduled blue coastal/upcountry train crossings."},
        "access_feasibility": "tuk_tuk_track",
        "parking_available": False,
        "images": [{"url": "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80", "caption": "Train crossing the Nine Arch Bridge amidst tea bushes", "credit": "Unsplash"}],
        "tags": ["ella", "train", "railway", "nine-arch", "scenic"]
    },
    {
        "id": "little-adams-peak-ella",
        "name": "Little Adam's Peak (Punchi Sri Pada)",
        "slug": "little-adams-peak-ella",
        "local_names": {"en": "Little Adam's Peak", "si": "පුංචි ශ්‍රී පාදය", "ta": "சிறிய ஆதாமின் சிகரம்"},
        "description": "Gradual scenic hill climb through rolling tea plantations leading to jaw-dropping views of Ella Rock, Ravana Falls gorge, and the southern plains.",
        "category": "nature",
        "sub_category": "hiking",
        "latitude": 6.8617,
        "longitude": 81.0601,
        "elevation_m": 1141,
        "district": "Badulla",
        "province": "Uva Province",
        "pricing": {"foreign_adult_lkr": 0, "foreign_adult_usd": 0, "saarc_adult_lkr": 0, "local_adult_lkr": 0},
        "dress_code": {"shoulders_covered": False, "knees_covered": False, "footwear_removed": False, "headwear_removed": False, "hot_pavement_warning": False},
        "best_time_to_visit": {"recommended_window": "5:45 AM - 7:30 AM (Sunrise)", "reason": "Golden light rising over Ella Rock gap with minimal heat."},
        "access_feasibility": "foot_trail",
        "parking_available": True,
        "images": [],
        "tags": ["ella", "sunrise", "viewpoint", "easy-hike"]
    },

    # --- SOUTHERN COAST & GALLE ---
    {
        "id": "galle-dutch-fort",
        "name": "Galle Dutch Fort & Ramparts",
        "slug": "galle-dutch-fort",
        "local_names": {"en": "Galle Dutch Fort", "si": "ගාල්ල ලන්දේසි බලකොටුව", "ta": "காலி கோட்டை"},
        "description": "17th-century European coastal fortress founded by the Portuguese and extensively fortified by the Dutch. Alive with cobbled alleys, boutique cafes, and sunset ocean ramparts.",
        "category": "heritage",
        "sub_category": "monument",
        "latitude": 6.0267,
        "longitude": 80.2167,
        "elevation_m": 15,
        "district": "Galle",
        "province": "Southern Province",
        "pricing": {"foreign_adult_lkr": 0, "foreign_adult_usd": 0, "saarc_adult_lkr": 0, "local_adult_lkr": 0, "notes": "Public UNESCO heritage quarter. Free to walk ramparts. Maritime Museum has separate ticket."},
        "dress_code": {"shoulders_covered": False, "knees_covered": False, "footwear_removed": False, "headwear_removed": False, "hot_pavement_warning": False, "notes": "Casual beachwear acceptable in streets, modest attire if stepping inside Dutch Reformed Church or Meeran Mosque."},
        "best_time_to_visit": {"recommended_window": "4:30 PM - 6:30 PM", "reason": "Golden hour breeze and sunset walk on the lighthouse rampart."},
        "access_feasibility": "car",
        "parking_available": True,
        "images": [{"url": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80", "caption": "Galle Fort Lighthouse on the ocean ramparts", "credit": "Unsplash"}],
        "tags": ["unesco", "colonial", "dutch", "lighthouse", "sunset"]
    },
    {
        "id": "mirissa-coconut-tree-hill",
        "name": "Coconut Tree Hill, Mirissa",
        "slug": "coconut-tree-hill-mirissa",
        "local_names": {"en": "Coconut Tree Hill", "si": "මිරිස්ස පොල් ගස් කන්ද", "ta": "மிரிஸ்சா தென்னை மலை"},
        "description": "Red-earth promontory overlooking the Indian Ocean dotted with leaning palm trees. Sri Lanka's most recognizable coastal viewpoint.",
        "category": "nature",
        "sub_category": "viewpoint",
        "latitude": 5.9431,
        "longitude": 80.4633,
        "elevation_m": 22,
        "district": "Matara",
        "province": "Southern Province",
        "pricing": {"foreign_adult_lkr": 0, "foreign_adult_usd": 0, "saarc_adult_lkr": 0, "local_adult_lkr": 0},
        "dress_code": {"shoulders_covered": False, "knees_covered": False, "footwear_removed": False, "headwear_removed": False, "hot_pavement_warning": False},
        "best_time_to_visit": {"recommended_window": "6:00 AM - 7:30 AM or 5:30 PM - 6:30 PM", "reason": "Sunrise offers calm waters and fewer photography crowds."},
        "access_feasibility": "tuk_tuk_track",
        "parking_available": False,
        "images": [],
        "tags": ["mirissa", "palms", "ocean", "photography"]
    },

    # --- COLOMBO WESTERN METRO ---
    {
        "id": "gangaramaya-temple-colombo",
        "name": "Gangaramaya Buddhist Temple, Colombo",
        "slug": "gangaramaya-buddhist-temple-colombo",
        "local_names": {"en": "Gangaramaya Temple", "si": "ගංගාරාම විහාරය", "ta": "கங்காராமய கோயில்"},
        "description": "Vibrant and eclectic urban temple complex beside Beira Lake combining Sri Lankan, Thai, Indian, and Chinese architecture, museum artifacts, and floating Seema Malaka pavilion.",
        "category": "heritage",
        "sub_category": "temple",
        "latitude": 6.9167,
        "longitude": 79.8569,
        "elevation_m": 8,
        "district": "Colombo",
        "province": "Western Province",
        "pricing": {
            "foreign_adult_lkr": 500,
            "foreign_adult_usd": 1.7,
            "saarc_adult_lkr": 500,
            "local_adult_lkr": 0,
            "notes": "Includes access to the museum gallery and the floating Seema Malaka designed by Geoffrey Bawa."
        },
        "dress_code": {
            "shoulders_covered": True,
            "knees_covered": True,
            "footwear_removed": True,
            "headwear_removed": True,
            "hot_pavement_warning": True,
            "photo_rules": "Respectful photography permitted throughout the museum and stupa terrace."
        },
        "best_time_to_visit": {"recommended_window": "8:00 AM - 10:30 AM or 4:00 PM - 6:00 PM", "reason": "Late afternoon light over Beira lake is serene and cool."},
        "access_feasibility": "car",
        "parking_available": True,
        "images": [],
        "tags": ["colombo", "geoffrey-bawa", "beira-lake", "urban-temple"]
    },

    # --- ANURADHAPURA SACRED CITY ---
    {
        "id": "ruwanwelisaya-anuradhapura",
        "name": "Ruwanwelisaya Sacred Great Stupa",
        "slug": "ruwanwelisaya-sacred-great-stupa",
        "local_names": {"en": "Ruwanwelisaya", "si": "රුවන්වැලි මහා සෑය", "ta": "ருவன்வெலிசாய மகா தூபி"},
        "description": "Colossal 103-meter stupa built by King Dutugemunu in 140 BC. One of the Solosmasthana (16 sacred Buddhist pilgrimage places in Sri Lanka), surrounded by the iconic elephant wall.",
        "category": "heritage",
        "sub_category": "monument",
        "latitude": 8.3503,
        "longitude": 80.3964,
        "elevation_m": 85,
        "district": "Anuradhapura",
        "province": "North Central Province",
        "pricing": {
            "foreign_adult_lkr": 0,
            "foreign_adult_usd": 0,
            "saarc_adult_lkr": 0,
            "local_adult_lkr": 0,
            "notes": "Free for veneration at the stupa precinct itself. (Central Cultural Fund ticket applies to ancient ruins museum circuit)."
        },
        "dress_code": {
            "shoulders_covered": True,
            "knees_covered": True,
            "footwear_removed": True,
            "headwear_removed": True,
            "hot_pavement_warning": True,
            "photo_rules": "Quiet photography permitted around the outer pradakshina path. Never turn back to the relic chamber.",
            "notes": "Granite stone floor gets extremely hot between 10 AM - 4 PM. Wear thick white socks."
        },
        "best_time_to_visit": {
            "recommended_window": "5:30 AM - 7:30 AM or 6:00 PM - 8:30 PM",
            "reason": "Illuminated stupa under the night sky with oil lamps and evening chanting is profoundly peaceful.",
            "puja_times": ["05:30 AM", "10:30 AM", "06:00 PM"]
        },
        "access_feasibility": "car",
        "parking_available": True,
        "images": [],
        "tags": ["unesco", "stupa", "dutugemunu", "anuradhapura", "solosmasthana"]
    }
]

async def seed_data():
    from backend.ingestion.nationwide_scraper import run_ingestion_pipeline
    print("🌱 Running CeylonWander nationwide ingestion pipeline...")
    await run_ingestion_pipeline(seed_first=True, scrape_osm=False)
    print("✅ CeylonWander nationwide places & regions loaded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())

