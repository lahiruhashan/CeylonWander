# CeylonWander 🇱🇰
> Offline-First, Topography-Aware Travel Discovery Platform for Sri Lanka

CeylonWander is engineered specifically for Sri Lanka's unique travel realities:
- **Topography-Aware Travel Times:** Computes true driving/tuk-tuk travel times accounting for hill-country switchbacks and elevation gains instead of misleading straight-line distances.
- **Dual-Pricing Transparency:** Clear 3-tier fee breakdowns (Foreign National USD/LKR vs. SAARC passport holders vs. Sri Lankan citizens).
- **Cultural & Dress Etiquette:** Standardized alerts for sacred sites (shoulder/knee coverings, footwear removal, hot granite pavement warnings, and Buddha statue photography rules).
- **Smart Corridor Loops:** Curated micro-attractions along the same physical road corridor to prevent backtracking on narrow mountain roads.
- **Offline Regional Bundles:** Lightweight (< 25 MB) downloadable town packages for mountain gaps and connectivity dead zones.

---

## Architecture Overview

```
                      +------------------------------------------+
                      |         Responsive Web App (PWA)         |
                      |            Next.js 14 + MapLibre GL      |
                      +--------------------+---------------------+
                                           | REST API
                                           v
                      +------------------------------------------+
                      |         CeylonWander API Gateway         |
                      |          FastAPI (Python 3.11+)          |
                      +--------------------+---------------------+
                                           |
                    +----------------------+----------------------+
                    v                                             v
     +------------------------------+             +-------------------------------+
     |   Spatial Data Store         |             |   Routing & Topography Engine |
     |   PostgreSQL 16 + PostGIS    |             |   OSRM Sri Lanka / OSRM Demo  |
     |   (GeoAlchemy2 / SQLite dev) |             |   + Haversine Fallback Engine |
     +------------------------------+             +-------------------------------+
                    ^
                    |
     +------------------------------+
     |   Data Ingestion Worker      |
     |   Overpass API + Wikidata    |
     |   (Central Province & Hills) |
     +------------------------------+
```

---

## Quickstart Guide

### 1. Backend (FastAPI)

```bash
# Navigate to project root
cd CeylonWander

# Create virtual environment & install dependencies
python3 -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements.txt

# Seed nationwide initial dataset (Kandy, Nuwara Eliya, Galle, Ella, Sigiriya, Colombo, Anuradhapura)
backend/.venv/bin/python -m backend.ingestion.seed_central_province

# Start the FastAPI server (runs on port 8001)
backend/.venv/bin/uvicorn backend.app.main:app --reload --port 8001
```

API docs are live at: `http://localhost:8001/docs`

---

## Maintaining & Adding Custom Places

You can maintain and expand your own curated database in multiple ways:

1. **Directly via the Web UI**:
   - Open `http://localhost:3000`
   - Click the green **"+ Add Place"** button in the top bar.
   - Fill in English, Sinhala, and Tamil names, dual pricing (Foreign/SAARC/Local), dress etiquette flags, and vehicle access.
   - Click **"Use Map Center"** to automatically grab coordinates from wherever you are inspecting on the map.
   - Click **"Save Place to Database"** — it instantly persists into `ceylonwander.db` and updates the map.

2. **Via REST API**:
   - `POST /api/v1/places` with JSON payload.
   - `POST /api/v1/places/seed` to re-seed or populate all nationwide regions.

3. **Database Engine Options**:
   - **Local SQLite (Default)**: Fully standalone in `ceylonwander.db`.
   - **PostgreSQL 16 + PostGIS**: Run `docker compose up -d` for enterprise spatial querying.

#### Running Tests & Spatial Performance Benchmark
```bash
PYTHONPATH=. backend/.venv/bin/pytest backend/tests/ -v -s
```
*(All 7 tests verify health, proximity search, dual pricing, smart loops, offline manifests, community contributions, and sub-150ms P95 spatial query latency).*

### 2. Frontend (Next.js + MapLibre GL)

```bash
# Navigate to web app directory
cd web

# Install dependencies
npm install

# Start Next.js development server (runs on port 3000)
npm run dev
```

Visit `http://localhost:3000` to interact with the responsive map, dynamic radius slider, place detail cards, smart loops, and offline bundles.

### 3. PostgreSQL 16 + PostGIS (Optional Docker Setup)

To use PostgreSQL with PostGIS in production or local containers:
```bash
docker compose up -d
```
Set `DATABASE_URL=postgresql+asyncpg://ceylonwander:ceylonwander_dev_password@localhost:5432/ceylonwander` in `backend/.env`.

---

## Directory Structure

```
CeylonWander/
├── docs/
│   └── PRD.md                       # Canonical Product Requirements Document
├── docker-compose.yml               # PostgreSQL 16 + PostGIS 3.4
├── backend/
│   ├── requirements.txt             # FastAPI, SQLAlchemy, GeoAlchemy2, Shapely, Pytest
│   ├── app/
│   │   ├── main.py                  # FastAPI app entrypoint & lifespan
│   │   ├── config.py                # Environment configuration
│   │   ├── database.py              # Async SQLAlchemy engine & session
│   │   ├── models/                  # Place, Region, Loop, Contribution models
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── spatial_search.py    # Spatial proximity search (<150ms)
│   │   │   ├── routing.py           # OSRM router + Hill country topography model
│   │   │   └── offline_pack.py      # Offline town bundle manifest generator
│   │   └── api/v1/                  # REST endpoints (places, loops, regions, contributions)
│   ├── ingestion/
│   │   ├── seed_central_province.py # Initial rich seed data for Kandy & Hill country
│   │   ├── overpass_extractor.py    # Live Overpass API worker
│   │   └── wikidata_enricher.py     # SPARQL multilingual & Commons imagery enricher
│   └── tests/
│       ├── test_api.py              # Comprehensive integration test suite
│       └── test_performance.py      # Spatial query latency benchmark (NFR-1)
└── web/
    ├── package.json                 # Next.js 14, MapLibre GL, Tailwind CSS, Lucide
    └── src/
        ├── app/                     # Next.js App Router (layout, page, globals)
        ├── components/
        │   ├── map/CeylonMap.tsx    # MapLibre GL vector map with category pins
        │   ├── place/               # Place detail drawer & preview cards
        │   ├── filters/FilterBar.tsx# Dynamic radius slider, category pills & region jumper
        │   ├── loops/               # Smart corridor loops modal
        │   ├── offline/             # Regional offline bundle downloader
        │   └── community/           # Community live condition reports
        ├── services/api.ts          # API client
        └── types/index.ts           # Shared TypeScript models
```
