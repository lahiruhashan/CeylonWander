'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Calendar, Clock, MapPin, ExternalLink, Copy, Check, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';

type DurationDays = 3 | 7 | 10 | 14 | 21;

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

const ITINERARIES: Record<number, ItineraryTemplate> = {
  3: {
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
  7: {
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
  10: {
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
  14: {
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
  },
  21: {
    title: '21-Day Slow Travel & Wilderness Expedition',
    vibe: 'The complete in-depth exploration',
    description: 'Zero rushing. Includes remote Knuckles mountain trekking, Trincomalee coral snorkeling, Jaffna peninsula, and surfing on both coastlines.',
    googleMapsUrl: 'https://www.google.com/maps/dir/Colombo/Anuradhapura/Jaffna/Trincomalee/Sigiriya/Knuckles/Kandy/Ella/Yala/Arugam+Bay/Galle',
    days: [
      { day: 1, title: 'Arrival & Colombo Seafront Walk', from: 'CMB Airport', to: 'Colombo', distanceKm: 35, driveTimeHours: '45m', highlights: ['Galle Face Green street food'], overnight: 'Colombo', proTip: 'Rest up and acclimatize to the tropical humidity.' },
      { day: 2, title: 'Wilpattu National Park Wilderness', from: 'Colombo', to: 'Wilpattu', distanceKm: 175, driveTimeHours: '3h 45m', highlights: ['Natural sand Villus', 'Sloth bears & leopards'], overnight: 'Wilpattu Safari Camp', proTip: 'Less than 10% of Yala crowd volume.' },
      { day: 3, title: 'Anuradhapura 2,000-Year Stupas', from: 'Wilpattu', to: 'Anuradhapura', distanceKm: 45, driveTimeHours: '1h 00m', highlights: ['Jaya Sri Maha Bodhi', 'Ruwanwelisaya'], overnight: 'Anuradhapura', proTip: 'Rent an e-bike for the vast archaeological park.' },
      { day: 4, title: 'Northern Drive to Jaffna', from: 'Anuradhapura', to: 'Jaffna', distanceKm: 195, driveTimeHours: '4h 00m', highlights: ['Elephant Pass', 'Nallur Kandaswamy Kovil'], overnight: 'Jaffna', proTip: 'Try traditional Jaffna Rio Ice Cream at night.' },
      { day: 5, title: 'Delft Island Coral Ruins & Wild Ponies', from: 'Jaffna', to: 'Delft Island & back', distanceKm: 50, driveTimeHours: 'Ferry + Tuk-tuk', highlights: ['Wild Portuguese horses', 'Giant baobab tree'], overnight: 'Jaffna', proTip: 'Navy ferry leaves at 8:30 AM sharp.' },
      { day: 6, title: 'East Coast Drive to Trincomalee', from: 'Jaffna', to: 'Trincomalee', distanceKm: 235, driveTimeHours: '4h 45m', highlights: ['Koneswaram Temple on Swami Rock cliff', 'Nilaveli beach'], overnight: 'Nilaveli / Trincomalee', proTip: 'Look down from Swami Rock for blue whales breaching in deep harbor waters.' },
      { day: 7, title: 'Pigeon Island Marine Sanctuary', from: 'Nilaveli', to: 'Pigeon Island', distanceKm: 5, driveTimeHours: '15m boat', highlights: ['Harmless blacktip reef sharks', 'Sea turtles over coral reefs'], overnight: 'Nilaveli', proTip: 'Swim in the shallow channel for guaranteed shark sightings.' },
      { day: 8, title: 'Ancient Sigiriya & Pidurangala Sunset', from: 'Trincomalee', to: 'Sigiriya', distanceKm: 100, driveTimeHours: '2h 15m', highlights: ['Pidurangala rock climb', 'Evening lake breeze'], overnight: 'Sigiriya', proTip: 'Pidurangala sunset is more tranquil than Sigiriya.' },
      { day: 9, title: 'Sigiriya Lion Rock & Minneriya Elephants', from: 'Sigiriya', to: 'Minneriya', distanceKm: 40, driveTimeHours: '1h 00m', highlights: ['6:30 AM Sigiriya ascent', 'Great Elephant Gathering'], overnight: 'Sigiriya', proTip: 'Carry 2 liters of water for the 1,200 rock steps.' },
      { day: 10, title: 'Polonnaruwa Medieval Capital & Dambulla', from: 'Sigiriya', to: 'Polonnaruwa', distanceKm: 65, driveTimeHours: '1h 15m', highlights: ['Gal Vihara carved Buddhas', 'Dambulla golden cave temples'], overnight: 'Sigiriya', proTip: 'Bicycle through the royal palace ruins.' },
      { day: 11, title: 'Trek into Knuckles Mountain Range', from: 'Sigiriya', to: 'Riverston / Knuckles', distanceKm: 85, driveTimeHours: '2h 45m', mountainWarning: true, highlights: ['Mini World’s End cliff', 'Thelgamuwa Oya river plunge pools'], overnight: 'Riverston Eco Lodge', proTip: 'Offline maps are mandatory: zero mobile signal past the gap.' },
      { day: 12, title: 'Knuckles Cloud Forest to Kandy', from: 'Knuckles', to: 'Kandy', distanceKm: 50, driveTimeHours: '2h 00m', mountainWarning: true, highlights: ['Dumbara valley vistas', 'Temple of the Tooth Relic'], overnight: 'Kandy', proTip: 'Visit the temple during the 6:30 PM evening drumming.' },
      { day: 13, title: 'Scenic Tea Route to Nuwara Eliya', from: 'Kandy', to: 'Nuwara Eliya', distanceKm: 76, driveTimeHours: '2h 45m', mountainWarning: true, highlights: ['Ramboda Falls', 'Pedro Tea Estate walk'], overnight: 'Nuwara Eliya', proTip: 'Pack a warm jacket: evening temperature drops to 11°C.' },
      { day: 14, title: 'Horton Plains World’s End & Train to Ella', from: 'Nuwara Eliya', to: 'Ella', distanceKm: 60, driveTimeHours: '2h 30m by train', mountainWarning: true, highlights: ['World’s End 870m cliff', 'Kandy-Ella scenic train'], overnight: 'Ella', proTip: 'Arrive at Horton Plains by 6:00 AM before mist settles.' },
      { day: 15, title: 'Ella Gaps & Nine Arch Bridge', from: 'Ella', to: 'Ella Trails', distanceKm: 15, driveTimeHours: 'Local hiking', highlights: ['Nine Arch Bridge train frame', 'Little Adam’s Peak'], overnight: 'Ella', proTip: 'Photograph the blue train from the tea terraces below the bridge.' },
      { day: 16, title: 'Wild East Surf: Arugam Bay', from: 'Ella', to: 'Arugam Bay', distanceKm: 135, driveTimeHours: '3h 15m', highlights: ['Main Point right-hand surf', 'Peanut Farm lagoon'], overnight: 'Arugam Bay', proTip: 'Watch wild elephants roam along the beach road at dusk.' },
      { day: 17, title: 'Arugam Bay Waves & Kumana Safari', from: 'Arugam Bay', to: 'Kumana National Park', distanceKm: 35, driveTimeHours: '45m', highlights: ['Kumana bird sanctuary', 'Uncrowded leopard spotting'], overnight: 'Arugam Bay', proTip: 'Kumana is the peaceful eastern half of Yala.' },
      { day: 18, title: 'Descent to Yala Leopard Sanctuary', from: 'Arugam Bay', to: 'Yala / Tissamaharama', distanceKm: 145, driveTimeHours: '3h 30m', highlights: ['Yala Block 1 afternoon safari'], overnight: 'Yala Safari Camp', proTip: 'Afternoon light is best for photographing leopards.' },
      { day: 19, title: 'Hiriketiya Horseshoe Bay & Tangalle', from: 'Yala', to: 'Hiriketiya', distanceKm: 85, driveTimeHours: '1h 45m', highlights: ['Horseshoe surf inlet', 'Palm tree rope swings'], overnight: 'Hiriketiya Bay', proTip: 'Enjoy artisan sourdough pizza and live acoustic beach music.' },
      { day: 20, title: 'Weligama Surf Lesson & Galle Fort', from: 'Hiriketiya', to: 'Galle Fort', distanceKm: 65, driveTimeHours: '1h 15m', highlights: ['Weligama gentle surf peelers', 'Galle Dutch Fort ramparts walk'], overnight: 'Galle Fort', proTip: 'Walk the ramparts at 5:45 PM for an unforgettable sunset.' },
      { day: 21, title: 'Galle Artisan Boutiques & Airport Return', from: 'Galle', to: 'CMB Airport', distanceKm: 155, driveTimeHours: '2h 15m (Expressway)', highlights: ['Dutch Hospital cafes', 'Direct expressway to flight'], overnight: 'Departure flight', proTip: 'Allow 3 hours for check-in at CMB international airport.' }
    ]
  }
};

const FAQ_LIST = [
  {
    q: 'How many days do you realistically need in Sri Lanka?',
    a: 'For first-time visitors, 10 to 14 days is the sweet spot. While Sri Lanka looks compact on a map, its central mountains require slow 25–35 km/h driving speeds. A 10-day trip allows you to comfortably experience the Cultural Triangle, Kandy-Ella scenic train, tea country, a wildlife safari, and south coast beaches without spending your whole holiday in a vehicle.'
  },
  {
    q: 'Why are Google Maps driving times often inaccurate in Sri Lanka?',
    a: 'Google Maps calculates times based on flat road speeds. In Sri Lanka’s central province (Kandy, Nuwara Eliya, Ella), roads consist of steep switchbacks, tight hairpin bends, and slow agricultural trucks. A 75 km drive from Kandy to Nuwara Eliya takes nearly 3 hours, not the 1.5 hours generic GPS apps suggest. Always add 40% buffer time in mountain zones.'
  },
  {
    q: 'Should I hire a private driver or take the train and buses?',
    a: 'A hybrid approach is most rewarding: book the iconic Scenic Train for the Kandy–Ella leg (stunning tea valley views), and hire a private driver or tuk-tuk for the Cultural Triangle and safari transfers. Dedicated private drivers in Sri Lanka cost roughly $55–$75 USD per day all-inclusive (vehicle, fuel, insurance, driver meals and lodging).'
  },
  {
    q: 'What is the best route to avoid backtracking?',
    a: 'The classic clockwise loop minimizes backtracking: Airport → Sigiriya/Cultural Triangle → Kandy → Nuwara Eliya/Ella (via train) → Yala/Udawalawe Safari → South Coast beaches (Mirissa/Weligama/Galle) → Colombo Airport via the Southern Expressway.'
  }
];

export default function ItineraryPage() {
  const [selectedDuration, setSelectedDuration] = useState<DurationDays>(10);
  const [copied, setCopied] = useState(false);

  const currentPlan = ITINERARIES[selectedDuration];

  const handleCopy = () => {
    let text = `${currentPlan.title} (${selectedDuration} Days)\n${currentPlan.vibe}\n\n`;
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
    <div className="min-h-screen bg-[#05140e] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Unified Navigation */}
      <Navbar pageSubtitle="Itinerary Engine" />

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-6">
          <Sparkles size={13} />
          <span>Calculated for Real Mountain Topography</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-serif">
          The Definitive <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Sri Lanka Itinerary Planner
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Generic apps calculate straight lines and leave tourists stranded on mountain hairpins. 
          Our day-by-day itineraries account for <strong>true 25–35 km/h hill speeds</strong>, optimal overnight hubs, and zero backtracking.
        </p>

        {/* Duration Selector Tabs */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          {([3, 7, 10, 14, 21] as DurationDays[]).map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDuration(days)}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                selectedDuration === days
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {days} Days {days === 10 ? '⭐' : ''}
            </button>
          ))}
        </div>
      </section>

      {/* Main Itinerary Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10">
        {/* Overview Banner Card */}
        <div className="bg-gradient-to-br from-[#0c2e20] to-[#061810] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
                {currentPlan.vibe}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
                {currentPlan.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-2xl">
                {currentPlan.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Route'}</span>
              </button>

              <a
                href={currentPlan.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Google Maps Route</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Duration</span>
              <span className="text-sm font-black text-emerald-400">{selectedDuration} Days / {selectedDuration - 1} Nights</span>
            </div>
            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Pace</span>
              <span className="text-sm font-black text-white">{selectedDuration <= 7 ? 'Active Explorer' : 'Relaxed Immersion'}</span>
            </div>
            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Overnight Bases</span>
              <span className="text-sm font-black text-white">{new Set(currentPlan.days.map(d => d.overnight)).size} Curated Hubs</span>
            </div>
            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Topography</span>
              <span className="text-sm font-black text-amber-400">Switchback Optimized</span>
            </div>
          </div>
        </div>

        {/* Day-by-Day Timeline */}
        <div className="space-y-4 mb-16">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 mb-6 flex items-center gap-2">
            <Calendar size={16} />
            <span>Full Day-by-Day Stage Breakdown ({selectedDuration} Days)</span>
          </h3>

          {currentPlan.days.map((d) => (
            <div
              key={d.day}
              className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/50 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-emerald-950/40 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#032317] font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    {d.day}
                  </span>
                  <div>
                    <h4 className="font-black text-base text-white">{d.title}</h4>
                    <span className="text-xs text-gray-400 font-semibold">{d.from} → {d.to}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/40 text-gray-300 font-semibold border border-white/5 flex items-center gap-1">
                    <Clock size={12} className="text-emerald-400" />
                    <span>{d.driveTimeHours}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                    ~{d.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Warnings and Stay info */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {d.mountainWarning && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Slow Mountain Switchbacks (~25-35 km/h)</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" />
                  <span>Stay: <strong className="text-white">{d.overnight}</strong></span>
                </span>
              </div>

              {/* Highlights */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                  Must-See Highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {d.highlights.map((h, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-emerald-200"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Insider Pro Tip */}
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-3 text-xs text-amber-200 flex items-start gap-2">
                <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold">Local Insider Secret: </strong>
                  {d.proTip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO FAQ Section */}
        <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
              Planning Your Sri Lanka Itinerary
            </h3>
          </div>

          <div className="space-y-4">
            {FAQ_LIST.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-start gap-2">
                  <span className="text-emerald-400">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-12 space-y-4">
          <h3 className="text-2xl font-black text-white font-serif">
            Ready to explore these stops on the live map?
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Open our interactive vector map to inspect 110+ curated spots, dual-ticket tariffs, and sacred dress badges.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-xl text-sm font-black shadow-xl hover:scale-105 transition-all"
          >
            <Compass size={16} />
            <span>Launch Interactive Vector Map</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>CeylonCopilot 🇱🇰 • Cloudflare Colombo Edge</span>
          <div className="flex items-center gap-4 text-gray-400 font-semibold">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/explore" className="hover:text-white">Explorer Map</Link>
            <Link href="/train" className="hover:text-white">Scenic Train</Link>
            <Link href="/wildlife" className="hover:text-white">Safaris</Link>
            <Link href="/toolkit" className="hover:text-white">Field Toolkit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
