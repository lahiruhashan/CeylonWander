'use client';

import React from 'react';
import { Compass, Clock, MapPin, AlertTriangle, ArrowRight } from 'lucide-react';

export interface DayPlan {
  day: number;
  title: string;
  from: string;
  to: string;
  distanceKm: number;
  driveTimeHours: string;
  mountainWarning?: boolean;
  highlights: string[];
  overnight: string;
  proTip: string;
}

interface ItineraryInteractiveMapProps {
  days: DayPlan[];
  activeDay: number;
  onSelectDay: (day: number) => void;
}

// Map coordinates projected onto SVG viewBox="0 0 400 620"
const PLACE_COORDINATES: Record<string, { x: number; y: number; label: string }> = {
  'Jaffna': { x: 113.7, y: 67.2, label: 'Jaffna' },
  'Mannar': { x: 98.5, y: 158.4, label: 'Mannar' },
  'Anuradhapura': { x: 161.9, y: 248.3, label: 'Anuradhapura' },
  'Trincomalee': { x: 264.7, y: 212.1, label: 'Trincomalee' },
  'Nilaveli': { x: 266.0, y: 200.0, label: 'Nilaveli' },
  'Sigiriya': { x: 207.6, y: 296.6, label: 'Sigiriya' },
  'Pidurangala': { x: 207.6, y: 295.2, label: 'Pidurangala' },
  'Dambulla': { x: 193.7, y: 307.3, label: 'Dambulla' },
  'Habarana': { x: 207.0, y: 288.0, label: 'Habarana' },
  'Polonnaruwa': { x: 239.3, y: 297.9, label: 'Polonnaruwa' },
  'Negombo': { x: 94.7, y: 397.2, label: 'Negombo' },
  'CMB Airport': { x: 95.9, y: 399.9, label: 'CMB' },
  'Colombo': { x: 93.4, y: 434.8, label: 'Colombo' },
  'Kandy': { x: 191.1, y: 385.1, label: 'Kandy' },
  'Nuwara Eliya': { x: 210.2, y: 430.7, label: 'Nuwara Eliya' },
  'Horton Plains': { x: 212.0, y: 445.0, label: 'Horton Plains' },
  'Ella': { x: 243.2, y: 441.5, label: 'Ella' },
  'Haputale': { x: 231.7, y: 456.2, label: 'Haputale' },
  'Arugam Bay': { x: 343.4, y: 445.5, label: 'Arugam Bay' },
  'Udawalawe': { x: 224.1, y: 495.1, label: 'Udawalawe' },
  'Yala': { x: 302.8, y: 509.9, label: 'Yala' },
  'Mirissa': { x: 170.8, y: 564.9, label: 'Mirissa' },
  'Weligama': { x: 165.7, y: 562.2, label: 'Weligama' },
  'Hiriketiya': { x: 185.0, y: 565.0, label: 'Hiriketiya' },
  'Galle Fort': { x: 137.8, y: 554.1, label: 'Galle Fort' },
  'Galle': { x: 137.8, y: 554.1, label: 'Galle' },
  'Unawatuna': { x: 142.0, y: 556.0, label: 'Unawatuna' },
  'Bentota': { x: 109.9, y: 501.8, label: 'Bentota' },
  'Hikkaduwa': { x: 123.8, y: 539.4, label: 'Hikkaduwa' },
  'Wilpattu': { x: 115.0, y: 229.5, label: 'Wilpattu' },
};

// Helper to resolve coordinates from varied text strings in day plan (e.g. "CMB Airport / Negombo")
function resolveCoords(name: string): { x: number; y: number; label: string } {
  // Direct match
  if (PLACE_COORDINATES[name]) return PLACE_COORDINATES[name];

  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(PLACE_COORDINATES)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val;
    }
  }

  if (lower.includes('airport') || lower.includes('cmb')) return PLACE_COORDINATES['CMB Airport'];
  if (lower.includes('galle')) return PLACE_COORDINATES['Galle Fort'];
  if (lower.includes('mirissa') || lower.includes('weligama') || lower.includes('south')) return PLACE_COORDINATES['Mirissa'];
  if (lower.includes('kandy')) return PLACE_COORDINATES['Kandy'];
  if (lower.includes('nuwara') || lower.includes('nanu oya')) return PLACE_COORDINATES['Nuwara Eliya'];
  if (lower.includes('ella')) return PLACE_COORDINATES['Ella'];
  if (lower.includes('sigiriya') || lower.includes('pidurangala')) return PLACE_COORDINATES['Sigiriya'];
  if (lower.includes('dambulla')) return PLACE_COORDINATES['Dambulla'];
  if (lower.includes('yala') || lower.includes('tissa')) return PLACE_COORDINATES['Yala'];
  if (lower.includes('udawalawe')) return PLACE_COORDINATES['Udawalawe'];
  if (lower.includes('arugam')) return PLACE_COORDINATES['Arugam Bay'];
  if (lower.includes('trinco') || lower.includes('nilaveli')) return PLACE_COORDINATES['Trincomalee'];
  if (lower.includes('anuradhapura')) return PLACE_COORDINATES['Anuradhapura'];
  if (lower.includes('jaffna')) return PLACE_COORDINATES['Jaffna'];

  // Default to Colombo center
  return PLACE_COORDINATES['Colombo'];
}

// Authentic SVG outline for Sri Lanka coastline
const SRI_LANKA_COAST_PATH = "M107.3 71.1 L99.3 72.6 L93.1 63.7 L91.6 59.9 L93.2 57.2 L94.9 55.9 L97.0 56.3 L100.0 64.6 L107.3 71.1 Z M95.3 148.9 L98.9 159.1 L88.4 152.1 L81.6 146.4 L79.1 141.7 L93.4 146.9 L95.3 148.9 Z M108.9 46.7 L121.1 47.4 L134.1 47.1 L143.2 48.9 L158.9 69.6 L201.4 106.6 L224.6 144.2 L226.7 152.4 L229.9 159.6 L235.4 161.5 L240.1 164.8 L263.2 201.1 L265.9 208.3 L265.5 216.2 L266.9 222.1 L272.9 225.0 L280.5 226.6 L285.4 232.0 L291.7 261.0 L291.7 270.0 L293.4 273.9 L322.5 319.1 L324.2 324.5 L323.9 328.7 L324.8 332.2 L330.4 340.2 L339.2 361.7 L343.7 366.6 L349.0 385.3 L349.4 421.3 L347.4 437.3 L342.0 456.7 L335.5 475.8 L328.5 489.5 L319.0 501.1 L286.3 525.9 L276.9 530.8 L234.4 546.3 L203.1 561.0 L174.1 565.0 L145.1 556.9 L123.3 537.6 L112.1 509.3 L104.4 479.8 L93.3 446.9 L84.8 345.5 L80.7 317.2 L74.1 281.1 L74.7 265.4 L79.4 250.4 L79.4 283.3 L83.7 287.4 L86.9 283.2 L89.8 249.1 L92.2 234.7 L103.8 197.1 L104.0 190.5 L102.0 176.3 L102.1 169.3 L119.4 142.9 L123.8 127.6 L126.2 111.9 L125.2 94.9 L122.1 78.2 L136.0 83.5 L143.7 89.4 L151.5 93.3 L157.9 91.3 L165.5 91.2 L160.1 82.1 L143.9 73.7 L117.0 68.5 L108.6 61.9 L105.3 56.2 L107.0 49.4 L108.9 46.7 Z";

export default function ItineraryInteractiveMap({
  days,
  activeDay,
  onSelectDay,
}: ItineraryInteractiveMapProps) {
  const currentDayPlan = days.find((d) => d.day === activeDay) || days[0];

  // Build the list of route nodes for all days
  const routePoints = days.map((d) => ({
    day: d.day,
    title: d.title,
    from: resolveCoords(d.from),
    to: resolveCoords(d.to),
    overnight: resolveCoords(d.overnight),
    mountain: !!d.mountainWarning,
  }));

  // Create SVG path connecting all stops sequentially
  const fullRoutePath = routePoints
    .map((pt, idx) => {
      const cmd = idx === 0 ? 'M' : 'L';
      return `${cmd}${pt.to.x} ${pt.to.y}`;
    })
    .join(' ');

  // Active leg line (from -> to for the active day)
  const activeFrom = resolveCoords(currentDayPlan.from);
  const activeTo = resolveCoords(currentDayPlan.to);

  return (
    <div className="w-full bg-[#03140e]/95 border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Map Header Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Compass size={16} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
              Live Topography Tracker
            </span>
            <h4 className="text-sm font-black text-white">
              Sri Lanka Itinerary Map
            </h4>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Day {currentDayPlan.day} of {days.length}</span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[400/520] max-h-[460px] flex items-center justify-center">
        <svg
          viewBox="0 0 400 620"
          className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] select-none"
        >
          <defs>
            {/* Ocean / Island Gradients */}
            <radialGradient id="highlandGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#047857" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sri Lanka Landmass Outline */}
          <path
            d={SRI_LANKA_COAST_PATH}
            className="fill-[#082016] stroke-emerald-500/40 transition-colors duration-500"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Central Highland Topographic Elevation Zone */}
          <ellipse
            cx="205"
            cy="420"
            rx="55"
            ry="45"
            fill="url(#highlandGlow)"
            className="pointer-events-none"
          />
          <text
            x="205"
            y="420"
            textAnchor="middle"
            fill="#34d399"
            opacity="0.35"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="1"
            className="pointer-events-none select-none"
          >
            CENTRAL HIGHLANDS
          </text>

          {/* Cultural Triangle Indicator */}
          <text
            x="200"
            y="270"
            textAnchor="middle"
            fill="#a78bfa"
            opacity="0.3"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="1"
            className="pointer-events-none select-none"
          >
            CULTURAL TRIANGLE
          </text>

          {/* Full Itinerary Inactive Trail Line */}
          {fullRoutePath && (
            <path
              d={fullRoutePath}
              fill="none"
              stroke="#065f46"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          )}

          {/* Active Day Route Leg (From -> To) with Glowing Animation */}
          <line
            x1={activeFrom.x}
            y1={activeFrom.y}
            x2={activeTo.x}
            y2={activeTo.y}
            stroke="url(#routeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* All Route Stops as Clickable Markers */}
          {routePoints.map((pt) => {
            const isDestination = pt.day === currentDayPlan.day;
            const isCompleted = pt.day < currentDayPlan.day;

            return (
              <g
                key={`stop-${pt.day}`}
                className="cursor-pointer transition-transform duration-300"
                onClick={() => onSelectDay(pt.day)}
              >
                {/* Ping animation for active destination */}
                {isDestination && (
                  <circle
                    cx={pt.to.x}
                    cy={pt.to.y}
                    r="12"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75 origin-center"
                  />
                )}

                {/* Outer badge */}
                <circle
                  cx={pt.to.x}
                  cy={pt.to.y}
                  r={isDestination ? '8' : isCompleted ? '5' : '4'}
                  fill={isDestination ? '#10b981' : isCompleted ? '#059669' : '#1e293b'}
                  stroke={isDestination ? '#ffffff' : '#10b981'}
                  strokeWidth={isDestination ? '2' : '1'}
                  className="transition-all duration-300"
                />

                {/* Day Number text inside active circle */}
                {isDestination && (
                  <text
                    x={pt.to.x}
                    y={pt.to.y + 3}
                    textAnchor="middle"
                    fill="#032317"
                    fontSize="8"
                    fontWeight="900"
                  >
                    {pt.day}
                  </text>
                )}

                {/* Label badge for active or key stops */}
                {isDestination && (
                  <g transform={`translate(${pt.to.x > 250 ? pt.to.x - 70 : pt.to.x + 12}, ${pt.to.y - 10})`}>
                    <rect
                      x="0"
                      y="0"
                      width="65"
                      height="18"
                      rx="5"
                      fill="#05140e"
                      stroke="#10b981"
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="32"
                      y="12"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {pt.to.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Active Origin Pin (From) */}
          <g>
            <circle
              cx={activeFrom.x}
              cy={activeFrom.y}
              r="4.5"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* From label badge */}
            <g transform={`translate(${activeFrom.x > 250 ? activeFrom.x - 60 : activeFrom.x + 8}, ${activeFrom.y + 4})`}>
              <rect
                x="0"
                y="0"
                width="52"
                height="15"
                rx="4"
                fill="#0a1a12"
                stroke="#fbbf24"
                strokeWidth="0.8"
                opacity="0.9"
              />
              <text
                x="26"
                y="10.5"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="8"
                fontWeight="bold"
              >
                {activeFrom.label}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Floating Active Leg Live Status Card */}
      <div className="mt-3 bg-neutral-950/90 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-white">
            <MapPin size={13} className="text-emerald-400" />
            <span>Day {currentDayPlan.day}:</span>
            <span className="text-emerald-300">{currentDayPlan.from}</span>
            <ArrowRight size={11} className="text-neutral-400" />
            <span className="text-amber-300">{currentDayPlan.to}</span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            ~{currentDayPlan.distanceKm} km
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-300 pt-1 border-t border-neutral-800 gap-1.5">
          <div className="flex items-center gap-1 text-neutral-400">
            <Clock size={11} className="text-emerald-400" />
            <span>Drive: <strong className="text-white">{currentDayPlan.driveTimeHours}</strong></span>
          </div>

          {currentDayPlan.mountainWarning ? (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <AlertTriangle size={11} />
              <span>Hill Speed ~25 km/h</span>
            </span>
          ) : (
            <span className="text-sky-400 font-bold flex items-center gap-1">
              <span>🚗 Direct / Expressway</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
