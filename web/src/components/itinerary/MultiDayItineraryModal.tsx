'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';

interface MultiDayItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DurationDays = 3 | 7 | 10 | 14;

interface DayPlan {
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

interface ItineraryTemplate {
  title: string;
  vibe: string;
  description: string;
  days: DayPlan[];
  googleMapsUrl: string;
}

const ITINERARIES: Record<string, ItineraryTemplate> = {
  '3-classic': {
    title: '3-Day Quick Colombo, Tea & Fort Sprint',
    vibe: 'Ideal for layovers & quick weekend escapes',
    description: 'Covers the high-contrast highlights: colonial fort ramparts, scenic mountain tea valleys, and coastal surf.',
    googleMapsUrl: 'https://www.google.com/maps/dir/Colombo/Galle+Fort/Kandy',
    days: [
      {
        day: 1,
        title: 'Colombo to Galle Dutch Fort',
        from: 'Colombo',
        to: 'Galle Fort',
        distanceKm: 125,
        driveTimeHours: '2h 15m (via Southern Expressway)',
        highlights: ['Galle Lighthouse', '17th-century ramparts at sunset', 'Pedlar Street artisan gelato & cafes'],
        overnight: 'Galle Fort or Unawatuna',
        proTip: 'Walk the ramparts at 5:30 PM for sunset when the heat cools and local kids play cricket on the bastions.'
      },
      {
        day: 2,
        title: 'Galle to Kandy via Scenic Foothills',
        from: 'Galle',
        to: 'Kandy',
        distanceKm: 160,
        driveTimeHours: '4h 00m',
        mountainWarning: true,
        highlights: ['Peradeniya Royal Botanical Gardens', 'Kandy Lake promenade', 'Temple of the Sacred Tooth Relic'],
        overnight: 'Kandy Hillside',
        proTip: 'Dress in white with covered knees and shoulders for the 6:30 PM evening pooja drumming ceremony at the Temple.'
      },
      {
        day: 3,
        title: 'Kandy to Nuwara Eliya & Return',
        from: 'Kandy',
        to: 'Nuwara Eliya & Airport',
        distanceKm: 80,
        driveTimeHours: '2h 45m',
        mountainWarning: true,
        highlights: ['Ramboda Falls', 'Damro Labookellie colonial tea factory', 'Lake Gregory misty walk'],
        overnight: 'Depart from CMB Airport',
        proTip: 'Leave Kandy by 7:30 AM to beat the vegetable truck convoys on the winding A5 mountain road.'
      }
    ]
  },
  '7-classic': {
    title: '7-Day Essential Sri Lanka Golden Loop',
    vibe: 'The quintessential first-timer expedition',
    description: 'The golden triangle of ancient rock citadels, tea hill stations, scenic railway, and coastal ramparts.',
    googleMapsUrl: 'https://www.google.com/maps/dir/Colombo/Sigiriya/Kandy/Ella/Galle+Fort',
    days: [
      {
        day: 1,
        title: 'Arrival in Negombo & Sigiriya Drive',
        from: 'CMB Airport',
        to: 'Sigiriya',
        distanceKm: 145,
        driveTimeHours: '3h 30m',
        highlights: ['Coconut roadside refreshment', 'Dambulla Cave Monastery murals', 'Sunset view of Sigiriya Rock'],
        overnight: 'Sigiriya / Habarana',
        proTip: 'Stop for a fresh King Coconut (Thambili) outside Kurunegala for only LKR 150-200.'
      },
      {
        day: 2,
        title: 'The Lion Rock Citadel & Village Life',
        from: 'Sigiriya',
        to: 'Sigiriya & Pidurangala',
        distanceKm: 20,
        driveTimeHours: 'Local short hops',
        highlights: ['Sigiriya Rock Citadel at 6:30 AM', 'Pidurangala Rock sunset hike', 'Minneriya elephant jeep safari'],
        overnight: 'Sigiriya',
        proTip: 'Climb Sigiriya at the 6:30 AM opening gate to avoid both the 33°C midday sun and heavy tour bus queues.'
      },
      {
        day: 3,
        title: 'Cultural Triangle to Sacred Kandy',
        from: 'Sigiriya',
        to: 'Kandy',
        distanceKm: 90,
        driveTimeHours: '2h 45m',
        mountainWarning: true,
        highlights: ['Nalanda Gedige', 'Matale spice garden bypass', 'Evening Dalada Maligawa (Temple of the Tooth)'],
        overnight: 'Kandy',
        proTip: 'Politely decline roadside touts offering free spice massages; head straight to government-registered viewpoints.'
      },
      {
        day: 4,
        title: 'World-Famous Kandy to Ella Scenic Train',
        from: 'Kandy',
        to: 'Ella',
        distanceKm: 140,
        driveTimeHours: '6h 30m by Scenic Train',
        mountainWarning: true,
        highlights: ['Tea valley switchbacks', 'St. Clair & Devon falls glimpses', 'Pattipola 1,898m summit crossing'],
        overnight: 'Ella Gap',
        proTip: 'Sit on the Right Side leaving Kandy, then switch to the Left Side after Nanu Oya for the dramatic Ella gorge drop.'
      },
      {
        day: 5,
        title: 'Nine Arch Bridge & Little Adams Peak',
        from: 'Ella',
        to: 'Ella Trails',
        distanceKm: 15,
        driveTimeHours: 'Local hiking / tuk-tuks',
        highlights: ['Nine Arch Bridge blue train crossing', 'Little Adam’s Peak summit trail', 'Ravana Falls cascade'],
        overnight: 'Ella',
        proTip: 'Catch the 9:20 AM or 11:45 AM passenger train crossing over Nine Arch Bridge for the classic postcard frame.'
      },
      {
        day: 6,
        title: 'Mountain Descent to Udawalawe & Galle',
        from: 'Ella',
        to: 'Galle / South Coast',
        distanceKm: 185,
        driveTimeHours: '4h 15m',
        highlights: ['Udawalawe National Park wild elephant safari', 'Mirissa coastline', 'Galle Fort ramparts'],
        overnight: 'Galle Fort',
        proTip: 'Udawalawe safari at 2:00 PM has virtually 100% elephant sighting guarantee along the lake edge.'
      },
      {
        day: 7,
        title: 'Dutch Fort Exploration & Colombo Departure',
        from: 'Galle',
        to: 'Colombo / CMB Airport',
        distanceKm: 130,
        driveTimeHours: '2h 15m (via Highway)',
        highlights: ['17th-century rampart walk', 'Gem museums & artisan cafes', 'High-speed highway transfer to airport'],
        overnight: 'Departure flight',
        proTip: 'The highway airport expressway allows you to reach CMB airport smoothly without getting trapped in downtown Colombo traffic.'
      }
    ]
  },
  '10-classic': {
    title: '10-Day Deep Ceylon Explorer',
    vibe: 'Culture, wildlife safari, tea mist & surf combined',
    description: 'Allows an unhurried pace: 2 nights in Sigiriya, 2 nights in Ella, 1 night safari in Yala, and 2 nights on the beach.',
    googleMapsUrl: 'https://www.google.com/maps/dir/Colombo/Sigiriya/Kandy/Nuwara+Eliya/Ella/Yala/Galle',
    days: [
      { day: 1, title: 'Arrival & Colombo Seafront Walk', from: 'CMB Airport', to: 'Colombo', distanceKm: 35, driveTimeHours: '45m', highlights: ['Galle Face Green sunset street food', 'Pettah Red Mosque (Jami Ul-Alfar)'], overnight: 'Colombo Fort', proTip: 'Try fresh Isso Vadai (spicy prawn fritters) at Galle Face Green at dusk.' },
      { day: 2, title: 'Drive to Ancient Sigiriya', from: 'Colombo', to: 'Sigiriya', distanceKm: 165, driveTimeHours: '3h 45m', highlights: ['Dambulla Golden Buddha & Caves', 'Pidurangala sunset hike'], overnight: 'Sigiriya', proTip: 'Climb Pidurangala at 4:45 PM for golden hour lighting on Sigiriya Lion Rock.' },
      { day: 3, title: 'Sigiriya Citadel & Minneriya Elephant Gathering', from: 'Sigiriya', to: 'Minneriya', distanceKm: 40, driveTimeHours: '1h 00m', highlights: ['Lion Rock 6:30 AM ascent', '300+ Elephant Gathering safari'], overnight: 'Sigiriya', proTip: 'Book an open 4x4 modified Toyota Hilux jeep with an experienced tracker.' },
      { day: 4, title: 'Ancient Sigiriya to Sacred Kandy', from: 'Sigiriya', to: 'Kandy', distanceKm: 90, driveTimeHours: '2h 45m', mountainWarning: true, highlights: ['Peradeniya Royal Botanical Gardens', 'Temple of the Tooth Relic'], overnight: 'Kandy Hills', proTip: 'Visit the giant Javan fig tree lawn at the Botanical Gardens.' },
      { day: 5, title: 'Scenic Drive to Nuwara Eliya (Little England)', from: 'Kandy', to: 'Nuwara Eliya', distanceKm: 76, driveTimeHours: '2h 45m', mountainWarning: true, highlights: ['Ramboda Waterfalls', 'Tea pluckers in Pedro Estate', 'Grand Hotel high tea'], overnight: 'Nuwara Eliya', proTip: 'Pack a warm fleece: temperatures plummet to 12°C as soon as dusk settles.' },
      { day: 6, title: 'Horton Plains & Train to Ella', from: 'Nuwara Eliya', to: 'Ella', distanceKm: 60, driveTimeHours: '2h 30m by Scenic Train', mountainWarning: true, highlights: ['Worlds End 870m cliff drop', 'Baker’s Falls', 'Nanu Oya to Ella train'], overnight: 'Ella', proTip: 'Arrive at Horton Plains gate by 6:00 AM before the cloud wall rises up.' },
      { day: 7, title: 'Ella Gaps, Waterfalls & Nine Arch Bridge', from: 'Ella', to: 'Ella Trails', distanceKm: 20, driveTimeHours: 'Local hiking', highlights: ['Nine Arch Bridge train crossing', 'Little Adam’s Peak', 'Ravana Pool Club'], overnight: 'Ella', proTip: 'Walk the railway tracks respectfully from Ella town to Nine Arch Bridge in 25 mins.' },
      { day: 8, title: 'Descent into Yala Leopard Country', from: 'Ella', to: 'Yala / Tissamaharama', distanceKm: 110, driveTimeHours: '2h 30m', highlights: ['Ravana Falls roadside stop', 'Yala National Park late afternoon safari'], overnight: 'Tissamaharama Eco Lodge', proTip: 'Look for leopards lounging on high granite rock outcrops at 4:30 PM.' },
      { day: 9, title: 'Southern Surf Beaches & Mirissa Coast', from: 'Yala', to: 'Mirissa / Weligama', distanceKm: 130, driveTimeHours: '2h 45m', highlights: ['Coconut Tree Hill in Mirissa', 'Beginner surf lesson in Weligama Bay', 'Fresh seafood beachfront BBQ'], overnight: 'Mirissa / Weligama', proTip: 'Board rentals in Weligama are fixed at ~LKR 500-800 per hour.' },
      { day: 10, title: 'Galle Fort Ramparts & Return to Airport', from: 'Mirissa', to: 'CMB Airport', distanceKm: 160, driveTimeHours: '2h 30m (via Expressway)', highlights: ['Galle Dutch Fort ramparts', 'Artisan boutiques', 'Expressway to Colombo Airport'], overnight: 'Departure flight', proTip: 'Allow 3 hours check-in time at CMB airport for international departures.' }
    ]
  },
  '14-classic': {
    title: '14-Day Grand Island Odyssey (All 5 Biomes)',
    vibe: 'Comprehensive cross-island expedition',
    description: 'Encompasses Northern Jaffna islands, Ancient UNESCO capitals, Central Highlands, Deep South wildlife, and South Coast surf.',
    googleMapsUrl: 'https://www.google.com/maps/dir/Colombo/Anuradhapura/Jaffna/Sigiriya/Kandy/Ella/Yala/Galle',
    days: [
      { day: 1, title: 'Arrive Colombo & Coastal Train to Negombo', from: 'CMB', to: 'Negombo', distanceKm: 15, driveTimeHours: '25m', highlights: ['Negombo Lagoon fishing boats', 'Lellama fresh fish market'], overnight: 'Negombo', proTip: 'Great low-stress first night to recover from jet lag.' },
      { day: 2, title: 'Ancient Anuradhapura Sacred City', from: 'Negombo', to: 'Anuradhapura', distanceKm: 170, driveTimeHours: '3h 45m', highlights: ['Ruwanwelisaya White Stupa', '2,300-year-old Jaya Sri Maha Bodhi'], overnight: 'Anuradhapura', proTip: 'Rent a bicycle to explore the vast sacred brick park.' },
      { day: 3, title: 'Northern Highway to Jaffna Peninsula', from: 'Anuradhapura', to: 'Jaffna', distanceKm: 195, driveTimeHours: '4h 00m', highlights: ['Elephant Pass causeway', 'Nallur Kandaswamy Kovil evening pooja'], overnight: 'Jaffna', proTip: 'Men must remove shirts to enter Nallur Kovil inner sanctum.' },
      { day: 4, title: 'Delft Island Wild Ponies & Jaffna Crab', from: 'Jaffna', to: 'Delft Island & return', distanceKm: 50, driveTimeHours: 'Ferry + tuk-tuk', highlights: ['Public Navy ferry', 'Coral stone houses', 'Giant baobab tree', 'Fiery Jaffna crab curry'], overnight: 'Jaffna', proTip: 'Ferry leaves Kurikadduwan jetty early morning at 8:30 AM.' },
      { day: 5, title: 'Drive South to Ancient Sigiriya', from: 'Jaffna', to: 'Sigiriya', distanceKm: 215, driveTimeHours: '4h 30m', highlights: ['Transition from palmyra to dense jungle', 'Sunset at Pidurangala Rock'], overnight: 'Sigiriya', proTip: 'A great driving route with smooth northern expressway A9.' },
      { day: 6, title: 'Sigiriya Citadel & Polonnaruwa Ruins', from: 'Sigiriya', to: 'Polonnaruwa & return', distanceKm: 70, driveTimeHours: '1h 30m', highlights: ['Sigiriya Lion Rock ascent', 'Gal Vihara carved granite Buddhas'], overnight: 'Sigiriya', proTip: 'Gal Vihara rock sculptures are masterworks of ancient Sinhala carving.' },
      { day: 7, title: 'Dambulla Caves & Mountain Foothills to Kandy', from: 'Sigiriya', to: 'Kandy', distanceKm: 90, driveTimeHours: '2h 45m', mountainWarning: true, highlights: ['Dambulla Golden Cave Murals', 'Temple of the Tooth Relic'], overnight: 'Kandy', proTip: 'Wear socks to avoid hot stones at Dambulla temple courtyard.' },
      { day: 8, title: 'Scenic Tea Route to Nuwara Eliya', from: 'Kandy', to: 'Nuwara Eliya', distanceKm: 76, driveTimeHours: '2h 45m', mountainWarning: true, highlights: ['Tea plucking experience', 'Ramboda Falls', 'Lake Gregory'], overnight: 'Nuwara Eliya', proTip: 'Taste single-estate unblended Orange Pekoe black tea.' },
      { day: 9, title: 'Horton Plains & Scenic Train to Ella', from: 'Nuwara Eliya', to: 'Ella', distanceKm: 60, driveTimeHours: '2h 30m by train', mountainWarning: true, highlights: ['Worlds End cliff', 'Scenic train over mountain viaducts'], overnight: 'Ella', proTip: 'Take the afternoon train for golden hour mist rolling through tea bushes.' },
      { day: 10, title: 'Ella Peaks & Ravana Caves', from: 'Ella', to: 'Ella Trails', distanceKm: 20, driveTimeHours: 'Hiking / Tuk-Tuk', highlights: ['Nine Arch Bridge', 'Little Adam’s Peak', 'Ravana Ella Cave'], overnight: 'Ella', proTip: 'Best photos are taken from the tea terraces directly below Nine Arch Bridge.' },
      { day: 11, title: 'Wildlife Safari in Yala National Park', from: 'Ella', to: 'Yala', distanceKm: 110, driveTimeHours: '2h 30m', highlights: ['Leopards, sloth bears & spotted deer in Block 1'], overnight: 'Yala Safari Camp', proTip: 'Request an afternoon safari: leopards love sunning on warm rocks before sunset.' },
      { day: 12, title: 'Tangalle Secret Coves & Hiriketiya Bay', from: 'Yala', to: 'Hiriketiya / Dickwella', distanceKm: 85, driveTimeHours: '1h 45m', highlights: ['Horseshoe surf bay', 'Beachfront palm tree rope swings', 'Woodfired sourdough pizza'], overnight: 'Hiriketiya Bay', proTip: 'Hiriketiya is Sri Lanka’s coolest crescent surf inlet.' },
      { day: 13, title: 'Weligama Surf & Galle Dutch Fort', from: 'Hiriketiya', to: 'Galle Fort', distanceKm: 65, driveTimeHours: '1h 15m', highlights: ['Weligama surf lesson', 'Stilt fishermen in Ahangama', 'Galle Fort ramparts walk'], overnight: 'Galle Fort', proTip: 'Dine inside the 400-year-old fort ramparts.' },
      { day: 14, title: 'Colombo Colonial Walk & Airport Transfer', from: 'Galle', to: 'CMB Airport', distanceKm: 155, driveTimeHours: '2h 30m (via Expressway)', highlights: ['Dutch Hospital shopping precinct', 'Ministry of Crab lunch', 'Expressway to airport'], overnight: 'Departure flight', proTip: 'Reserve highway taxi 4 hours before departure.' }
    ]
  }
};

export default function MultiDayItineraryModal({ isOpen, onClose }: MultiDayItineraryModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<DurationDays>(7);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const key = `${selectedDuration}-classic`;
  const currentPlan = ITINERARIES[key] || ITINERARIES['7-classic'];

  const handleCopy = () => {
    let text = `${currentPlan.title}\n${currentPlan.vibe}\n\n`;
    currentPlan.days.forEach(d => {
      text += `Day ${d.day}: ${d.title} (${d.from} → ${d.to})\n`;
      text += `Drive: ~${d.distanceKm} km (${d.driveTimeHours})\n`;
      text += `Highlights: ${d.highlights.join(', ')}\n`;
      text += `Stay: ${d.overnight} | Tip: ${d.proTip}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-100 max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
            <span>🗺️ Realistic Travel Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Multi-Day Itinerary Planner</span>
            <span className="text-lg">🇱🇰</span>
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
            Calculated with <strong>real mountain switchback speeds (25–35 km/h)</strong> rather than misleading generic map straight-lines.
          </p>
        </div>

        {/* Duration & Filter Tabs */}
        <div className="bg-emerald-50/60 p-4 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-emerald-200 shadow-xs">
            {([3, 7, 10, 14] as DurationDays[]).map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDuration(days)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedDuration === days
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-emerald-950 hover:bg-emerald-50'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Itinerary'}</span>
            </button>

            <a
              href={currentPlan.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Export to Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-xs">
          {/* Summary Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                {currentPlan.vibe}
              </span>
              <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                <span>{selectedDuration} Days Schedule</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-emerald-950">
              {currentPlan.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {currentPlan.description}
            </p>
          </div>

          {/* Day By Day Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
              Day-by-Day Route & Drive Realities:
            </h4>

            {currentPlan.days.map((d) => (
              <div
                key={d.day}
                className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {d.day}
                    </span>
                    <span className="font-bold text-sm text-gray-900">{d.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-gray-500 font-semibold">{d.from} → {d.to}</span>
                    <span className="text-emerald-700 font-black">• ~{d.distanceKm} km</span>
                  </div>
                </div>

                {/* Drive Time & Warnings */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold flex items-center gap-1">
                    <Clock size={12} />
                    <span>Transit: {d.driveTimeHours}</span>
                  </span>

                  {d.mountainWarning && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                      <span>⛰️ Slow Mountain Hairpins</span>
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-950 font-bold flex items-center gap-1">
                    <MapPin size={12} />
                    <span>Stay: {d.overnight}</span>
                  </span>
                </div>

                {/* Highlights */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                    Must-See Highlights:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {d.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insider Pro Tip */}
                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                  <Sparkles size={13} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Insider Pro-Tip:</strong> {d.proTip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-gray-500 font-medium">
            💡 <strong>Topography notice:</strong> Never trust generic map 60 km/h estimates in hill zones.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
          >
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
