'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Train, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ISLAND_IMAGES } from '@/data/island_images';

interface StationStop {
  id: string;
  stepNum: number;
  phaseTitle: string;
  stationNameEn: string;
  stationNameSi: string;
  stationNameTa: string;
  elevation: string;
  milepost: string;
  lineName: string;
  statusBadge: string;
  statusColor: string;
  image: string;
  imageAlt: string;
  routeHref: string;
  routeLabel: string;
  urgencyWarning: string;
  checklist: {
    task: string;
    detail: string;
    tag: string;
  }[];
  localTip: string;
}

const RAIL_STATIONS: StationStop[] = [
  {
    id: 'arrival',
    stepNum: 1,
    phaseTitle: 'Phase 1: Touchdown & First 24 Hours',
    stationNameEn: 'BANDARANAIKE INTL (CMB)',
    stationNameSi: 'බණ්ඩාරනායක ජාත්‍යන්තර ගුවන්තොටුපළ',
    stationNameTa: 'பண்டாரநாயக்க சர்வதேச விமானநிலையம்',
    elevation: '8m (26 ft) MSL',
    milepost: 'MP 0.0 · Katunayake Junction',
    lineName: 'Airport Expressway Line',
    statusBadge: 'TOUCHDOWN & BORDER CLEARING',
    statusColor: 'emerald',
    image: ISLAND_IMAGES.arrivalFlight.url,
    imageAlt: ISLAND_IMAGES.arrivalFlight.alt,
    routeHref: '/arrival',
    routeLabel: 'Open CMB Arrival Guide',
    urgencyWarning: 'Do not book the taxi counters inside the terminal without checking PickMe — private quotes exceed $50 USD for a $14 ride.',
    checklist: [
      {
        task: 'Fee-Free ATM Cash Withdrawal',
        detail: 'Locate BOC or Commercial Bank in public arrivals concourse. Decline DCC (Dynamic Currency Conversion) to be billed in LKR and save 7–9%.',
        tag: 'Financial'
      },
      {
        task: 'Dialog 50GB Tourist SIM Activation',
        detail: 'Turn left immediately past customs. Official counter activates 50GB package (~$10 USD / Rs 3,100) on your phone in under 3 minutes.',
        tag: 'Connectivity'
      },
      {
        task: 'Outer Car Park PickMe / Uber Bay',
        detail: 'Walk 80m across the covered pedestrian bridge to outer parking. AC car to Colombo is Rs 4,000–5,000 including Expressway toll.',
        tag: 'Transit'
      },
      {
        task: 'First Night Sanctuary Strategy',
        detail: 'Landing after 18:00? Sleep in Negombo (15 min drive, no expressway). Taking the 05:55 morning train to Kandy? Sleep in Colombo Fort.',
        tag: 'Sanctuary'
      }
    ],
    localTip: 'Duty-free sells imported spirits right before customs. Buy here if your stay overlaps with monthly Poya full-moon alcohol bans!'
  },
  {
    id: 'transport',
    stepNum: 2,
    phaseTitle: 'Phase 2: Island Transit & Speed Physics',
    stationNameEn: 'RAMBODA PASS & ELLA GAP',
    stationNameSi: 'රම්බොඩ කපොල්ල සහ ඇල්ල දුර්ගය',
    stationNameTa: 'ரம்பொட கணவாய் - எல்லை இடைவெளி',
    elevation: '1,895m (6,217 ft) Summit',
    milepost: 'MP 75.4 · Main Highland Spine',
    lineName: 'Central Highland Mountain Railway',
    statusBadge: 'IN TRANSIT ACROSS ISLAND',
    statusColor: 'teal',
    image: ISLAND_IMAGES.trainNineArch.url,
    imageAlt: ISLAND_IMAGES.trainNineArch.alt,
    routeHref: '/transport',
    routeLabel: 'Open Island Transit & Fare Meter',
    urgencyWarning: 'Google Maps drive times in the Central Highlands are dangerously optimistic. Real switchback speeds average only 24 km/h.',
    checklist: [
      {
        task: 'Recalculate Drive Times for Switchbacks',
        detail: 'Cap mountain travel at 100–120 km per day. A 75 km trip between Kandy and Nuwara Eliya takes 3.0 hours minimum.',
        tag: 'Physics'
      },
      {
        task: 'Seat Strategy on Kandy → Ella Train',
        detail: 'Sit on the RIGHT SIDE leaving Kandy to Nanu Oya for waterfalls; SWITCH TO LEFT SIDE approaching Ella for Nine Arch Bridge.',
        tag: 'Scenic Rail'
      },
      {
        task: 'Tuk-Tuk Fair Fare Meter Rule',
        detail: 'Government regulated benchmark: Rs 120 first km + Rs 95 per additional km (+30% in steep hill country). Agree fare before boarding.',
        tag: 'Fair Fare'
      },
      {
        task: 'AAC Self-Drive Legal Verification',
        detail: 'International Driving Permits (IDPs) are NOT valid alone. You must endorse at the Automobile Association of Ceylon (AAC) in Colombo.',
        tag: 'Legal'
      }
    ],
    localTip: 'Never rent a tuk-tuk without an AAC endorsement and a crash-course lesson on navigating blind curves on mountain passes!'
  },
  {
    id: 'stay',
    stepNum: 3,
    phaseTitle: 'Phase 3: Microclimates & Living Intelligence',
    stationNameEn: 'SACRED MALIGAWA & SURF BAYS',
    stationNameSi: 'මහනුවර ශ්‍රී දළදා හා දකුණු වෙරළ',
    stationNameTa: 'கண்டி புனித ஆலயம் - தென் கடற்கரை',
    elevation: '500m to Sea Level',
    milepost: 'MP 128.2 · Cultural & Coast Corridor',
    lineName: 'Coastal & Cultural Sanctuary Spine',
    statusBadge: 'IN RESIDENCE & LIVING DEEP',
    statusColor: 'amber',
    image: ISLAND_IMAGES.mirissaPalms.url,
    imageAlt: ISLAND_IMAGES.mirissaPalms.alt,
    routeHref: '/stay',
    routeLabel: 'Open Living & Microclimate Guide',
    urgencyWarning: 'Do not let tour operators tell you "monsoon season ruins Sri Lanka". When South Coast has rain, East Coast has glorious sunshine.',
    checklist: [
      {
        task: 'Consult the Dual-Monsoon Compass',
        detail: 'Dec–April: South & West (Mirissa, Galle, Weligama). May–Sept: East Coast (Arugam Bay surf, Trincomalee glassy waters).',
        tag: 'Weather'
      },
      {
        task: 'Pack "Temple Granite Socks"',
        detail: 'Temples require removing shoes. Afternoon tropical sun heats black granite courtyards to 50°C. Dark cotton socks save your feet from blisters.',
        tag: 'Etiquette'
      },
      {
        task: 'Monthly Poya Full-Moon Law Alert',
        detail: 'Under national law, all alcohol sales and butcher shops are closed on full moon days. Stock up from supermarkets the day before.',
        tag: 'National Law'
      },
      {
        task: 'Choose Ethical Wild Safaris',
        detail: 'Book Udawalawe for calm elephant herds or Minneriya for the gathering. Avoid overcrowded Yala Block 1 mid-day jeep jams.',
        tag: 'Wildlife'
      }
    ],
    localTip: 'Always cover Buddha tattoos and never turn your back directly to a Buddha statue for selfies — it is strictly prohibited by law.'
  },
  {
    id: 'departure',
    stepNum: 4,
    phaseTitle: 'Phase 4: Flight Departures & Final Hours',
    stationNameEn: 'KATUNAYAKE TERMINUS (CMB)',
    stationNameSi: 'කටුනායක පිටත්වීම් පර්යන්තය',
    stationNameTa: 'கட்டுநாயக்க வெளியேறும் முனையம்',
    elevation: '8m (26 ft) Gate Buffer',
    milepost: 'MP 180.0 · Terminus Platform',
    lineName: 'Homeward Bound Express',
    statusBadge: 'FINAL CALL & RUNWAY DEPARTURE',
    statusColor: 'rose',
    image: ISLAND_IMAGES.galleFortLighthouse.url,
    imageAlt: ISLAND_IMAGES.galleFortLighthouse.alt,
    routeHref: '/departure',
    routeLabel: 'Open Departure & Leave-By Calculator',
    urgencyWarning: 'CMB operates an outdoor baggage screening X-ray BEFORE you can enter the check-in hall. Arriving 3.0 hours before flight is mandatory.',
    checklist: [
      {
        task: 'Calculate Precise Hotel Leave-By Time',
        detail: 'Leave Galle 5.0 hours prior; leave Colombo 4.0 hours prior. Add 30 mins during 19:00–01:00 peak international flight departure banks.',
        tag: 'Punctuality'
      },
      {
        task: 'Avoid Departure Day Mountain Drives',
        detail: 'Never drive directly from Ella or Nuwara Eliya on your flight day. A single lorry breakdown on a pass can cost you your flight.',
        tag: 'Safety Buffer'
      },
      {
        task: 'Buy Ceylon Tea at Local Supermarkets',
        detail: 'Stop at Cargills, Keells, or Glomark in Colombo or Negombo on your way to CMB. Pay $3–$6 USD for the same tea sold for $25 at airport duty-free.',
        tag: 'Souvenirs'
      },
      {
        task: 'Tourist VAT Refund Stamp (TVRS)',
        detail: 'If you made purchases over Rs 50,000 at authorized TVRS registered stores, have invoices ready before passport control.',
        tag: 'Customs'
      }
    ],
    localTip: 'Keep Rs 1,000 in cash for the Katunayake Expressway toll if you arranged a private cab driver who doesn’t include toll charges!'
  }
];

export default function JourneyRailTimeline() {
  const [activeStationIdx, setActiveStationIdx] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const currentStation = RAIL_STATIONS[activeStationIdx];
  const nextStation = activeStationIdx < RAIL_STATIONS.length - 1 ? RAIL_STATIONS[activeStationIdx + 1] : null;

  const toggleTask = (taskKey: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  return (
    <section className="w-full bg-[#030d09] border border-emerald-500/20 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden relative">
      {/* Background Rail Lines Watermark */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with CGR Heritage Rail Aesthetic */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2">
            <Train size={14} className="animate-pulse" />
            <span>Sri Lanka Railways Journey Copilot · 4 Line Stations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-tight">
            The Living Journey Rail Timeline
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
            Navigate your Sri Lanka voyage as an iconic railway journey. Select your current station stop below to view real ground-truth physics, instant action cards, and what to do before the whistle blows.
          </p>
        </div>

        {/* Milestone Indicator */}
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-2xl shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <span className="text-neutral-400 block font-mono text-[10px]">CURRENT TRAIN PROGRESS</span>
            <span className="text-white font-black">
              Station {activeStationIdx + 1} of {RAIL_STATIONS.length} · {currentStation.milepost.split('·')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Railway Track (The Scrolling Path) */}
      <div className="mb-8">
        {/* Track Graphic with Sleepers and Rails */}
        <div className="relative py-4">
          {/* Steel Railway Track Line */}
          <div className="hidden sm:block absolute top-1/2 left-4 right-4 -translate-y-1/2 h-4 z-0 pointer-events-none">
            {/* Wooden Sleepers (Ties) */}
            <div className="absolute inset-0 flex justify-between items-center opacity-40">
              {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="w-1.5 h-6 bg-amber-900/80 rounded-sm border-x border-amber-950" />
              ))}
            </div>
            {/* Top Steel Rail */}
            <div className="absolute top-0.5 left-0 right-0 h-1 bg-gradient-to-r from-neutral-500 via-neutral-300 to-neutral-500 rounded shadow-sm" />
            {/* Bottom Steel Rail */}
            <div className="absolute bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-neutral-500 via-neutral-300 to-neutral-500 rounded shadow-sm" />
            {/* Active Glow Track Line */}
            <div 
              className="absolute top-1 bottom-1 left-0 bg-emerald-500/30 transition-all duration-700 rounded"
              style={{ width: `${(activeStationIdx / (RAIL_STATIONS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Station Stop Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative z-10">
            {RAIL_STATIONS.map((st, idx) => {
              const isCurrent = activeStationIdx === idx;
              const isPassed = activeStationIdx > idx;

              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStationIdx(idx)}
                  className={`text-left p-3.5 rounded-2xl transition-all duration-300 relative group border ${
                    isCurrent
                      ? 'bg-gradient-to-b from-neutral-900 to-[#072418] border-emerald-400 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                      : isPassed
                      ? 'bg-neutral-900/80 border-neutral-700/80 hover:border-neutral-500 text-neutral-300'
                      : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  {/* Station Marker Dot / Signal Light */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-400 border-white shadow-lg shadow-emerald-400/50'
                          : isPassed
                          ? 'bg-emerald-700 border-emerald-600'
                          : 'bg-neutral-800 border-neutral-600'
                      }`}>
                        {isPassed && <span className="text-[8px] text-white font-black">✓</span>}
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-black tracking-wider ${
                        isCurrent ? 'text-emerald-300' : 'text-neutral-500'
                      }`}>
                        STOP #{st.stepNum}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-neutral-400">
                      {st.milepost.split('·')[0].trim()}
                    </span>
                  </div>

                  {/* Sri Lankan Railway Arch Station Board */}
                  <div className={`rounded-xl p-2.5 transition-all border ${
                    isCurrent 
                      ? 'bg-neutral-950 border-emerald-500/40' 
                      : 'bg-neutral-900/60 border-neutral-800'
                  }`}>
                    <span className="text-[9px] font-medium text-neutral-400 block truncate">
                      {st.stationNameSi}
                    </span>
                    <h4 className={`text-xs font-black tracking-tight leading-snug mt-0.5 truncate ${
                      isCurrent ? 'text-white font-serif' : 'text-neutral-200'
                    }`}>
                      {st.stationNameEn}
                    </h4>
                    <span className="text-[9px] text-neutral-500 block truncate">
                      {st.stationNameTa}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-2.5 flex items-center justify-between text-[10px]">
                    <span className={`font-bold ${isCurrent ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      {isCurrent ? '● YOU ARE HERE' : isPassed ? 'Completed' : 'Upcoming'}
                    </span>
                    <span className="text-neutral-500 text-[10px] font-mono">{st.elevation}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Station Deep Dive Box & "What To Do Now" Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 sm:p-7 backdrop-blur-xl">
        {/* Left Column: Station Board, Photo & Urgency Warning (5 cols) */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Authentic Sri Lankan Railway Station Nameboard */}
            <div className="bg-[#fff9e6] text-[#0f172a] rounded-2xl p-4 border-4 border-[#0f172a] shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-1 left-2 text-[9px] font-mono font-bold text-neutral-500">
                SLR · CGR
              </div>
              <div className="absolute top-1 right-2 text-[9px] font-mono font-bold text-neutral-500">
                {currentStation.elevation}
              </div>

              {/* Trilingual Names */}
              <div className="space-y-0.5 pt-1">
                <span className="text-xs font-medium text-neutral-700 block">
                  {currentStation.stationNameSi}
                </span>
                <h3 className="text-lg sm:text-xl font-black font-serif uppercase tracking-tight text-[#0f172a] border-y border-neutral-300 py-1 my-1">
                  {currentStation.stationNameEn}
                </h3>
                <span className="text-xs font-medium text-neutral-600 block">
                  {currentStation.stationNameTa}
                </span>
              </div>

              <div className="mt-2 pt-1.5 border-t border-neutral-200 text-[10px] font-mono font-bold text-neutral-600 flex justify-between items-center">
                <span>{currentStation.lineName}</span>
                <span>{currentStation.milepost}</span>
              </div>
            </div>

            {/* Photographic Destination Card */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-neutral-950 border border-white/10 group">
              <img
                src={currentStation.image}
                alt={currentStation.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-black text-emerald-300">
                {currentStation.phaseTitle}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white">
                <span className="block font-bold">{currentStation.statusBadge}</span>
                <span className="text-[11px] text-neutral-300">{currentStation.milepost}</span>
              </div>
            </div>

            {/* Ground Truth Urgency Warning */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-neutral-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <ShieldAlert size={15} />
                <span>Station Conductor&rsquo;s Ground-Truth Warning</span>
              </div>
              <p className="leading-relaxed text-neutral-300">
                {currentStation.urgencyWarning}
              </p>
            </div>
          </div>

          {/* Jump to Full Hub Button */}
          <Link
            href={currentStation.routeHref}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
          >
            <span>{currentStation.routeLabel}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: "What To Do Right Now" Action Cards & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>What To Do Right Now at this Station</span>
                </h4>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                Interactive Traveler Checklist
              </span>
            </div>

            {/* Action Cards List */}
            <div className="space-y-2.5">
              {currentStation.checklist.map((item, idx) => {
                const taskKey = `${currentStation.id}-${idx}`;
                const isDone = !!completedTasks[taskKey];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleTask(taskKey)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-400'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-neutral-950 font-black'
                          : 'bg-neutral-900 border-neutral-700 hover:border-emerald-400'
                      }`}>
                        {isDone ? <CheckCircle2 size={14} /> : <span className="text-[10px] text-neutral-500 font-mono">{idx + 1}</span>}
                      </div>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className={`text-xs font-bold ${isDone ? 'line-through text-neutral-500' : 'text-white'}`}>
                          {item.task}
                        </h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 shrink-0">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Local Train Driver's Secret Tip */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80 text-xs text-neutral-300 flex items-start gap-2.5">
            <span className="text-xl p-1 bg-white/5 rounded-xl shrink-0">💡</span>
            <div>
              <strong className="text-emerald-400 block font-semibold mb-0.5">
                Local Rail Master Tip:
              </strong>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {currentStation.localTip}
              </p>
            </div>
          </div>

          {/* "Next Station" Card & Fast Switcher */}
          <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Prev Button */}
            <button
              onClick={() => setActiveStationIdx(prev => Math.max(0, prev - 1))}
              disabled={activeStationIdx === 0}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5"
            >
              <ChevronLeft size={15} />
              <span>Previous Station</span>
            </button>

            {/* Next Station Indicator Banner */}
            {nextStation ? (
              <div 
                onClick={() => setActiveStationIdx(activeStationIdx + 1)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-between sm:justify-center gap-2 group"
              >
                <div className="text-left">
                  <span className="text-[10px] text-emerald-400/80 font-mono block">NEXT STOP:</span>
                  <span className="text-white group-hover:text-emerald-300">{nextStation.stationNameEn.split('(')[0].trim()}</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-neutral-800/60 text-neutral-400 text-xs font-mono">
                🏁 Terminal Stop Reached (CMB Gate)
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
