# Product Requirements Document (PRD)
## Project Name: CeylonWander (Working Title)
**Document Version:** 1.0  
**Target Platforms:** Cross-Platform Mobile (iOS & Android via Flutter/React Native) + Responsive Web (PWA)  
**Primary Target Audience:** Independent foreign travelers, backpackers, diaspora visitors, and local weekend travelers in Sri Lanka.

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
- **Discovery Friction:** Generic map engines (e.g., Google Maps) treat cultural viewpoints, tea stalls, and ATMs with identical visual weight. Tourists struggle to quickly separate iconic sites from minor stops.
- **Topographical Miscalculations:** Straight-line radius search ("as the crow flies") is ineffective in Sri Lanka’s hill country. A 5 km straight-line distance in Kandy or Ella often translates to a 45-minute drive on switchback roads.
- **Information Asymmetry:** Travelers frequently encounter unexpected local hurdles, including dual-pricing structures (local vs. SAARC vs. foreigner rates), strict temple dress codes, shoe counter logistics, and seasonal/time-of-day weather windows.
- **Connectivity Dead Zones:** Mobile data coverage drops significantly across mountain gaps, rural passes, and national parks.

### 1.2 The Solution
A lightweight, offline-first mobile app and responsive web platform engineered specifically for Sri Lanka travel. The app prioritizes true travel-time radius queries, curated attraction clustering, local contextual guidance, and downloadable offline regional bundles.

---

## 2. User Personas

| Persona | Motivation | Pain Points | Primary Need |
| :--- | :--- | :--- | :--- |
| **Independent Explorer (Foreigner)** | Exploring via public transit, trains, and tuk-tuks. | Dual ticket pricing confusion, dress code violations at shrines, slow mountain travel. | Realistic travel times, clear pricing/dress rules, curated nearby spots. |
| **Local / Expat Day-Tripper** | Finding weekend getaways and scenic viewpoints. | Static, outdated blog recommendations; crowded mainstream spots. | Hidden gems, viewpoint weather timing, parking availability. |
| **Off-Grid Hiker / Backpacker** | Trekking Knuckles, Ella, or Hanthana. | Zero mobile signal, misleading paths, lack of emergency offline data. | Offline town packs, GPS waypoints, trail elevation warnings. |

---

## 3. Core Functional Requirements (FR)

### Module 1: Search & Proximity Discovery Engine
- **FR-1.1 Geocoding Search:** Users can search by town, district, landmark, or current GPS location.
- **FR-1.2 Dynamic Radius Filtering:** Sliders for search radius (e.g., 5 km, 15 km, 30 km, or travel time equivalents: < 30 mins, < 1 hour).
- **FR-1.3 Topography-Aware Distance:** Compute driving/tuk-tuk travel time using road network data (OSRM / OpenStreetMap) rather than Euclidean straight-line distance.
- **FR-1.4 Multi-Category Filters:** Filter places by:
  - Heritage & Sacred Sites (Temples, ruins, churches)
  - Nature & Hiking (Waterfalls, viewpoints, forest reserves, peaks)
  - Tea & Agriculture (Factories, estates, spice gardens)
  - Wildlife & Marine (National parks, sanctuaries, whale watching)
  - Food & Local Experiences (Markets, heritage eateries)

### Module 2: Rich Location Details & Practical Intelligence
Each place profile must contain standardized structured metadata:
- **FR-2.1 Operational Basics:** Name (English, Sinhala, Tamil), coordinates, operating hours, peak crowd hours.
- **FR-2.2 Pricing Transparency:** Explicit price breakdown:
  - Foreign national rate (LKR / USD)
  - SAARC passport holder rate
  - Sri Lankan citizen rate
- **FR-2.3 Cultural & Dress Etiquette Flags:**
  - Mandatory coverings (shoulders and knees below joints)
  - Headwear and footwear rules (e.g., shoe drop locations, hot pavement warnings)
  - Photography rules (e.g., no posing with backs turned to Buddha statues)
- **FR-2.4 Optimal Visit Window:** Recommended arrival times (e.g., "Hanthana: 6:30 AM–9:00 AM before mist covers the valley"; "Temple of the Tooth: Thevava puja hours").
- **FR-2.5 Access Feasibility:** Vehicle suitability (e.g., Car accessible, 4WD only, Narrow tuk-tuk track, Foot trail only).

### Module 3: Itinerary Clustering ("Smart Loops")
- **FR-3.1 Sequential Stop Suggestions:** When viewing a major attraction (e.g., Royal Botanical Gardens, Peradeniya), suggest 2–3 micro-attractions located along the same physical road corridor (e.g., Gadaladeniya, Embekke).
- **FR-3.2 Half-Day / Full-Day Curated Loops:** Pre-calculated scenic routes that minimize backtracking on narrow mountain roads.

### Module 4: Offline Capabilities
- **FR-4.1 Regional Data Bundles:** One-tap download of specific town packages (e.g., Kandy Hub [~25 MB] containing vector map tiles, POIs, emergency numbers, and place summaries).
- **FR-4.2 Offline GPS Tracking:** Render user location on cached vector maps without cellular data.

### Module 5: Community & Contribution
- **FR-5.1 Moderated Community Submissions:** Users can suggest unlisted hidden gems, report road condition changes, or update entry fees. Submissions go to an administrative review queue before publishing.
- **FR-5.2 Quick Condition Updates:** Community-flagged status chips (e.g., "Trail slippery due to rain", "Ticket counter cash-only today").

---

## 4. Non-Functional Requirements (NFR)
- **NFR-1 Performance & Latency:** Spatial queries (`ST_DWithin` / `ST_Distance`) must respond in < 150 ms under a simulated load of 500 concurrent requests.
- **NFR-2 Data Footprint:** Mobile app bundle size must remain < 35 MB (initial download), with regional offline packs capped at < 40 MB per region.
- **NFR-3 Availability & Fault Tolerance:** Backend API uptime standard of 99.9%. If routing servers fail, the app falls back to haversine straight-line distance with an indicator warning to the user.
- **NFR-4 Battery Efficiency:** Continuous GPS tracking must automatically throttle polling frequency when the user is stationary to prevent battery drain in hot climates.

---

## 5. System Architecture & Technical Stack

```
           +-----------------------------------------------+
           |         Mobile App (Flutter / React Native)    |
           |             Responsive Web App (Next.js)      |
           +-----------------------+-----------------------+
                                   | REST / GraphQL
                                   v
           +-----------------------------------------------+
           |               API Gateway (FastAPI / Node.js) |
           +-----------------------+-----------------------+
                                   |
         +-------------------------+-------------------------+
         v                                                   v
+-----------------------------+             +-------------------------------+
|   Spatial Database          |             |   Routing Engine              |
|   PostgreSQL 16 + PostGIS   |             |   Self-Hosted OSRM / Valhalla |
|   (Places, Polygons, Bounds)|             |   (Sri Lanka Road Network OSM)|
+-----------------------------+             +-------------------------------+
         ^
         |
+-----------------------------+
|   Data Ingestion Worker     |
|   Overpass API + Wikidata   |
+-----------------------------+
```

---

## 6. Implementation Roadmap & Milestones

### Phase 1: Foundation (Weeks 1–3)
- Pipeline: Overpass & Wikidata extractor scripts for Central Province (Kandy, Matale, Nuwara Eliya)
- Schema: PostgreSQL + PostGIS setup with spatial indexes
- Core API: Nearest-place endpoint with spatial querying

### Phase 2: MVP Frontend & Mobile Client (Weeks 4–7)
- Map-first UI using MapLibre GL
- Dynamic radius slider & category filters
- Rich detail cards (dress codes, dual pricing, access feasibility)
- Basic PWA / responsive web deployment

### Phase 3: Topography Routing & Offline Packs (Weeks 8–10)
- Integration with road-network routing (driving time calculation)
- Offline regional bundle caching (SQLite / MMKV on mobile)
- Fallback logic for low-connectivity zones

### Phase 4: Community Features & Nationwide Expansion (Weeks 11–12)
- Crowdsourced spot submission & admin moderation dashboard
- Expansion of data pipeline across Southern, Western, and Uva provinces
- Launch on App Store & Google Play
