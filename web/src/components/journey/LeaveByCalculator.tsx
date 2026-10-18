'use client';

import React, { useState, useMemo } from 'react';
import { Clock, AlertTriangle, ShieldCheck, Car, Bus, Info } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface DepartureLocation {
  id: string;
  name: string;
  region: string;
  driveTimeMinsCar: number;
  driveTimeMinsBus: number;
  expresswayTollLkr: number;
  distanceKm: number;
  isHighRiskOnFlightDay?: boolean;
  notes: string;
}

const DEPARTURE_LOCATIONS: DepartureLocation[] = [
  {
    id: 'negombo',
    name: 'Negombo Beach / Town',
    region: 'Western Province',
    driveTimeMinsCar: 20,
    driveTimeMinsBus: 35,
    expresswayTollLkr: 0,
    distanceKm: 12,
    notes: 'Closest coastal base to CMB. Zero expressway tolls. Minimal traffic risk.'
  },
  {
    id: 'colombo',
    name: 'Colombo Central (Fort, Galle Face, Kollupitiya)',
    region: 'Western Province',
    driveTimeMinsCar: 45,
    driveTimeMinsBus: 60,
    expresswayTollLkr: 400,
    distanceKm: 35,
    notes: 'Direct via E03 Colombo-Katunayake Expressway. In rush hour (17:00–19:30), add 20 mins to reach the highway entrance.'
  },
  {
    id: 'galle',
    name: 'Galle Fort / Unawatuna',
    region: 'Southern Coast',
    driveTimeMinsCar: 135, // 2h 15m
    driveTimeMinsBus: 180,
    expresswayTollLkr: 1200,
    distanceKm: 152,
    notes: 'Direct via E01 Southern Expressway & Outer Circular Expressway (E02). Highly reliable 100 km/h divided highway.'
  },
  {
    id: 'weligama',
    name: 'Weligama / Mirissa',
    region: 'Southern Coast',
    driveTimeMinsCar: 150, // 2h 30m
    driveTimeMinsBus: 210,
    expresswayTollLkr: 1350,
    distanceKm: 175,
    notes: 'Enter highway via Kokmaduwa or Godagama interchange. Reliable expressway run all the way to Katunayake.'
  },
  {
    id: 'kandy',
    name: 'Kandy (Central Hills)',
    region: 'Central Province',
    driveTimeMinsCar: 210, // 3h 30m
    driveTimeMinsBus: 270,
    expresswayTollLkr: 500,
    distanceKm: 105,
    notes: 'Passes down Kadugannawa mountain pass then joins Central Expressway (E04) at Mirigama. Heavy lorry traffic possible.'
  },
  {
    id: 'ella',
    name: 'Ella / Nuwara Eliya (Deep Mountain Highlands)',
    region: 'Uva / Central Province',
    driveTimeMinsCar: 330, // 5h 30m
    driveTimeMinsBus: 480,
    expresswayTollLkr: 1200,
    distanceKm: 215,
    isHighRiskOnFlightDay: true,
    notes: '⚠️ HIGH RISK ON FLIGHT DAY: Frequent mountain landslides, road construction, slow tea trucks, or train cancellations can cause 2–4 hour unexpected delays. Move to Negombo or Colombo the night before!'
  }
];

export default function LeaveByCalculator() {
  const [flightTime, setFlightTime] = useState<string>('20:30');
  const [locationId, setLocationId] = useState<string>('galle');
  const [mode, setMode] = useState<'car' | 'bus'>('car');
  const [airportBufferHours, setAirportBufferHours] = useState<number>(3); // 3h recommended for CMB
  const safetyMarginMins = 30;

  const selectedLocation = useMemo(
    () => DEPARTURE_LOCATIONS.find((l) => l.id === locationId) || DEPARTURE_LOCATIONS[0],
    [locationId]
  );

  const driveTimeMins = mode === 'car' ? selectedLocation.driveTimeMinsCar : selectedLocation.driveTimeMinsBus;

  // Compute Leave-By Time
  const calculation = useMemo(() => {
    const [hoursStr, minsStr] = flightTime.split(':');
    const flightH = parseInt(hoursStr || '0', 10);
    const flightM = parseInt(minsStr || '0', 10);

    const totalTransitBufferMins = (airportBufferHours * 60) + driveTimeMins + safetyMarginMins;

    // Flight time in minutes from midnight
    const flightTotalMins = (flightH * 60) + flightM;

    // Leave time in minutes
    let leaveTotalMins = flightTotalMins - totalTransitBufferMins;
    let dayOffset = 0;

    // Handle previous day departure
    while (leaveTotalMins < 0) {
      leaveTotalMins += 24 * 60;
      dayOffset -= 1;
    }

    const leaveH = Math.floor(leaveTotalMins / 60);
    const leaveM = leaveTotalMins % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const leaveByTimeFormatted = `${pad(leaveH)}:${pad(leaveM)}`;

    return {
      leaveByTime: leaveByTimeFormatted,
      isPreviousDay: dayOffset < 0,
      totalHoursMinutesTransit: `${Math.floor(totalTransitBufferMins / 60)}h ${totalTransitBufferMins % 60}m`,
      airportBufferMins: airportBufferHours * 60,
      driveTimeMins,
      safetyMarginMins
    };
  }, [flightTime, airportBufferHours, safetyMarginMins, driveTimeMins]);

  return (
    <div className="bg-[#0a2318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              🛫 Departure Gate Protection
            </span>
            <VerifiedBadge
              verifiedOn="2026-10-16"
              sourceType="official"
              sourceName="Airport & Aviation Services Sri Lanka (AASL)"
              sourceUrl="https://airport.lk"
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Airport &ldquo;Leave-By&rdquo; Calculator
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Never miss a flight from Bandaranaike International Airport (CMB). Calculates your exact hotel departure 
            time factoring in real expressway limits, mountain pass hazards, and mandatory pre-terminal X-ray queues.
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Flight Departure Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <Clock size={13} className="text-emerald-400" />
            <span>Flight Departure Time</span>
          </label>
          <input
            type="time"
            value={flightTime}
            onChange={(e) => setFlightTime(e.target.value)}
            className="w-full bg-[#05140e] border border-white/15 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm font-bold text-white outline-none font-mono"
          />
          <span className="text-[11px] text-gray-400 block">As listed on your airline e-ticket</span>
        </div>

        {/* 2. Starting Destination */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <span>📍</span>
            <span>Where Are You Leaving From?</span>
          </label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full bg-[#05140e] border border-white/15 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            {DEPARTURE_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-[#05140e] text-white">
                {loc.name} (~{Math.round(loc.driveTimeMinsCar / 60)}h)
              </option>
            ))}
          </select>
          <span className="text-[11px] text-gray-400 block">{selectedLocation.distanceKm} km to airport</span>
        </div>

        {/* 3. Transport Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <Car size={13} className="text-emerald-400" />
            <span>Transport Mode</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('car')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'car'
                  ? 'bg-emerald-500 text-[#032317] font-black shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Car size={13} />
              <span>Car / Taxi</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('bus')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'bus'
                  ? 'bg-emerald-500 text-[#032317] font-black shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Bus size={13} />
              <span>Express Bus</span>
            </button>
          </div>
          <span className="text-[11px] text-gray-400 block">
            {mode === 'car' ? 'Expressway taxi or private car' : 'Air-conditioned public expressway bus'}
          </span>
        </div>

        {/* 4. Airport Buffer */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Airport Arrival Buffer</span>
          </label>
          <select
            value={airportBufferHours}
            onChange={(e) => setAirportBufferHours(parseFloat(e.target.value))}
            className="w-full bg-[#05140e] border border-white/15 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            <option value="3" className="bg-[#05140e] text-white">3 Hours (Recommended for CMB)</option>
            <option value="3.5" className="bg-[#05140e] text-white">3.5 Hours (Peak Season / Holidays)</option>
            <option value="2.5" className="bg-[#05140e] text-white">2.5 Hours (Strict Minimum / Hand Luggage)</option>
          </select>
          <span className="text-[11px] text-gray-400 block">Includes pre-terminal security queue</span>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-gradient-to-br from-[#051e14] to-[#082e1f] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
            Your Exact Hotel Leave-By Target
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
              {calculation.leaveByTime}
            </span>
            {calculation.isPreviousDay && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
                (Depart Night Before)
              </span>
            )}
          </div>
          <p className="text-xs text-gray-300">
            For a <strong className="text-white">{flightTime}</strong> flight departing CMB Katunayake, leave{' '}
            <strong className="text-white">{selectedLocation.name}</strong> at or before{' '}
            <strong className="text-emerald-300 font-mono">{calculation.leaveByTime}</strong>.
          </p>
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto text-center shrink-0">
          <div className="bg-black/30 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">Transit Time</span>
            <span className="text-sm font-black text-white font-mono">
              ~{Math.floor(driveTimeMins / 60)}h {driveTimeMins % 60}m
            </span>
          </div>
          <div className="bg-black/30 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">CMB Security</span>
            <span className="text-sm font-black text-emerald-300 font-mono">
              {airportBufferHours}h 00m
            </span>
          </div>
          <div className="bg-black/30 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">Tolls Buffer</span>
            <span className="text-sm font-black text-amber-300 font-mono">
              +{safetyMarginMins}m
            </span>
          </div>
        </div>
      </div>

      {/* Critical Airport Security Warning */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <strong className="text-white block font-bold text-sm">
              Why CMB Airport Strictly Requires 3 Hours Before Departure
            </strong>
            <p className="text-gray-300 leading-relaxed">
              Unlike many Western airports, Bandaranaike International Airport (CMB) conducts a{' '}
              <strong className="text-emerald-300">mandatory security luggage X-ray check outside the terminal building</strong> before 
              passengers are permitted inside the check-in hall. During evening departure surges (19:00 to 02:00), this outdoor queue alone can 
              take 30–45 minutes. Following this, you must clear airline counter check-in, emigration passport control, and final gate security.
            </p>
          </div>
        </div>

        {/* Highland Danger Alert */}
        {selectedLocation.isHighRiskOnFlightDay && (
          <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
            <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">High-Risk Route Detected</strong>
              <span>{selectedLocation.notes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
