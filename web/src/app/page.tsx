'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Volume2, VolumeX } from 'lucide-react';

// Stations data for interactive train scrubber
const STATIONS = [
  {
    name: "Peradeniya Junction",
    elevation: "492 meters",
    duration: "0h (Departure)",
    view: "Lush Mahaweli River Basin & Royal Palms",
    seatSide: "SIT ON RIGHT SIDE",
    seatDesc: "Right side gives glorious looks of the winding Mahaweli riverbanks and terraced paddy fields."
  },
  {
    name: "Hatton (Adam's Peak Gateway)",
    elevation: "1,263 meters",
    duration: "~2h 30m",
    view: "Tea Valley Canyons & Devon Falls",
    seatSide: "SIT ON RIGHT SIDE",
    seatDesc: "Sit on the Right Side to catch distant views of the sacred Adam's Peak (Sri Pada) conical pyramid!"
  },
  {
    name: "Nanu Oya (Nuwara Eliya)",
    elevation: "1,613 meters",
    duration: "~4h 15m",
    view: "Tea Estate Valleys & Waterfalls",
    seatSide: "SIT ON RIGHT SIDE",
    seatDesc: "Sit on the Right Side leaving Kandy towards Nanu Oya for sweeping vistas of St. Clair’s waterfall!"
  },
  {
    name: "Pattipola Summit (Highest Point)",
    elevation: "1,898 meters",
    duration: "~5h 15m",
    view: "Summit Pine & Misty Cloud Forest",
    seatSide: "SWITCH TO LEFT SIDE",
    seatDesc: "Prepare to switch! As you cross through the summit tunnel, the entire southern lowland drop opens on your Left!"
  },
  {
    name: "Ella (Demodara Gap)",
    elevation: "1,041 meters",
    duration: "~6h 30m",
    view: "Ella Gap Ravine & Nine Arch Bridge",
    seatSide: "SIT ON LEFT SIDE",
    seatDesc: "Left Side is mandatory! Panoramic drop of Ella Rock and the curved brick Nine Arch Bridge!"
  }
];

const MONTH_DATA = [
  { title: "January: Peak Dry Highland Season", icon: "☀️", summary: "Clear sunny skies across South Coast and Highlands. Great for Adam's Peak pilgrimage and Galle Fort beaches.", south: { status: "☀️ Sunny & Calm", sunny: true }, east: { status: "🌧️ Maha Monsoon Rain", sunny: false } },
  { title: "February: Islandwide Golden Sunshine", icon: "🌟", summary: "One of the best months to visit. Glassy surf in Mirissa, dry hikes in Horton Plains, sunny cultural triangle.", south: { status: "☀️ Perfect Sunshine", sunny: true }, east: { status: "🌤️ Clearing Skies", sunny: true } },
  { title: "March: Warm & Calm Seas", icon: "🌊", summary: "Ideal for blue whale watching in Mirissa and calm swimming on the southern beaches.", south: { status: "☀️ Sunny & Warm", sunny: true }, east: { status: "☀️ Dry & Pleasant", sunny: true } },
  { title: "April: Sinhala & Tamil New Year", icon: "🏮", summary: "Warmest month of the year. Inter-monsoon convection storms in late afternoons; festive cultural vibes.", south: { status: "☀️ Warm / Afternoon Storms", sunny: true }, east: { status: "☀️ Sunny & Dry", sunny: true } },
  { title: "May: Yala Monsoon Begins", icon: "🌧️", summary: "Southwest coast sees strong swells and monsoon downpours. East Coast surf season kicks into full gear!", south: { status: "🌧️ Heavy Swells & Rain", sunny: false }, east: { status: "☀️ Prime Surf & Sun", sunny: true } },
  { title: "June: East Coast Prime Season", icon: "🏄", summary: "Head to Arugam Bay for world-class right hand point break surf and Nilaveli for crystal clear waters.", south: { status: "🌧️ Monsoon Rain", sunny: false }, east: { status: "☀️ Pristine & Dry", sunny: true } },
  { title: "July: Summer Holiday Window", icon: "🏖️", summary: "East coast beaches are at their absolute peak. Cultural Triangle (Sigiriya) is dry and warm.", south: { status: "⛅ Choppy Swell", sunny: false }, east: { status: "☀️ Glassy & Warm", sunny: true } },
  { title: "August: Esala Perahera in Kandy", icon: "🐘", summary: "Grand tooth relic elephant pageant in Kandy. Elephant Gathering at Minneriya National Park.", south: { status: "⛅ Mild Sea Breeze", sunny: false }, east: { status: "☀️ Golden Sun & Waves", sunny: true } },
  { title: "September: Transition Month", icon: "🌦️", summary: "Yala monsoon winds taper off. Whale migrations begin towards southern deep waters.", south: { status: "⛅ Calming Waters", sunny: true }, east: { status: "☀️ Late Season Surf", sunny: true } },
  { title: "October: Inter-Monsoon Shift", icon: "🌦️", summary: "Thunderstorms frequently roll through central hills during late afternoon. Best conditions moving south.", south: { status: "☀️ Sunny & Dry", sunny: true }, east: { status: "🌧️ Rain & Swells", sunny: false } },
  { title: "November: Maha Monsoon on East", icon: "🌧️", summary: "Northeast monsoon drenches Jaffna and Trincomalee. Southwest beaches (Hiriketiya, Unawatuna) open for season.", south: { status: "☀️ Sunny Surf Season", sunny: true }, east: { status: "🌧️ Maha Rain Season", sunny: false } },
  { title: "December: Peak Holiday Wave", icon: "✨", summary: "High tourist influx. Blue skies and tropical warmth across Colombo, Galle, Weligama, and Ella hills.", south: { status: "☀️ Peak Blue Skies", sunny: true }, east: { status: "🌧️ Rainy & Rough", sunny: false } }
];

export default function CinematicLandingPage() {
  const [colomboTime, setColomboTime] = useState('Colombo: 00:00:00 (GMT+5:30)');
  const [envTheme, setEnvTheme] = useState<'emerald' | 'golden' | 'monsoon' | 'night'>('emerald');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [trainStationIdx, setTrainStationIdx] = useState(2); // Nanu Oya
  const [monthIdx, setMonthIdx] = useState(9); // October

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const cricketGainRef = useRef<GainNode | null>(null);
  const cricketIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Colombo Clock Tracker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const colombo = new Date(utc + 3600000 * 5.5);
      const h = String(colombo.getHours()).padStart(2, '0');
      const m = String(colombo.getMinutes()).padStart(2, '0');
      const s = String(colombo.getSeconds()).padStart(2, '0');
      setColomboTime(`Colombo: ${h}:${m}:${s} (GMT+5:30)`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Procedural Ambient Soundscape
  const toggleSoundscape = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.5, ctx.currentTime);
      master.connect(ctx.destination);

      // Pink Noise for Tropical Rain
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteSrc = ctx.createBufferSource();
      whiteSrc.buffer = noiseBuffer;
      whiteSrc.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(950, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      rainGainRef.current = rainGain;

      whiteSrc.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);
      whiteSrc.start();

      // High-Frequency Jungle Crickets
      const cricketGain = ctx.createGain();
      cricketGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      cricketGain.connect(master);
      cricketGainRef.current = cricketGain;

      cricketIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(4500 + Math.random() * 800, ctx.currentTime);
        oscGain.gain.setValueAtTime(0.02, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(oscGain);
        oscGain.connect(cricketGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }, 350);
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    if (!isPlayingAudio) {
      rainGainRef.current?.gain.setTargetAtTime(0.2, ctx.currentTime, 0.5);
      cricketGainRef.current?.gain.setTargetAtTime(0.05, ctx.currentTime, 0.5);
      setIsPlayingAudio(true);
    } else {
      rainGainRef.current?.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
      cricketGainRef.current?.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
      setIsPlayingAudio(false);
    }
  };

  const playPhrase = (phonetic: string) => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(phonetic);
      utter.rate = 0.9;
      utter.lang = 'en-US';
      window.speechSynthesis.speak(utter);
    }
  };

  // Canvas Particle & Atmosphere Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; a: number; speed: number }[] = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.03 + 0.01,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        p.a += p.speed;
        if (p.a > 0.9 || p.a < 0.2) p.speed = -p.speed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (envTheme === 'emerald') {
          ctx.fillStyle = `rgba(52, 211, 153, ${Math.abs(p.a)})`;
          ctx.shadowColor = '#10b981';
        } else if (envTheme === 'golden') {
          ctx.fillStyle = `rgba(251, 191, 36, ${Math.abs(p.a)})`;
          ctx.shadowColor = '#f59e0b';
        } else if (envTheme === 'monsoon') {
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.abs(p.a)})`;
          ctx.shadowColor = '#0284c7';
        } else {
          ctx.fillStyle = `rgba(192, 132, 252, ${Math.abs(p.a)})`;
          ctx.shadowColor = '#a855f7';
        }
        ctx.shadowBlur = 10;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [envTheme]);

  const currentStation = STATIONS[trainStationIdx];
  const currentMonth = MONTH_DATA[monthIdx];

  return (
    <div className={`min-h-screen text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white relative transition-colors duration-700 ${
      envTheme === 'golden' ? 'bg-[#150d04]' : envTheme === 'monsoon' ? 'bg-[#061421]' : envTheme === 'night' ? 'bg-[#030612]' : 'bg-[#05140e]'
    }`}>
      {/* 1. Background Ambient Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-85" />

      {/* Glow Orbs */}
      <div className={`fixed top-[-10vw] left-[-10vw] w-[50vw] h-[50vw] rounded-full blur-[140px] pointer-events-none z-0 opacity-30 transition-all duration-1000 ${
        envTheme === 'golden' ? 'bg-amber-500' : envTheme === 'monsoon' ? 'bg-sky-500' : envTheme === 'night' ? 'bg-purple-600' : 'bg-emerald-500'
      }`} />

      {/* 2. Sticky Glass Navigation */}
      <header className="sticky top-0 z-50 bg-[#061c14]/75 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#032317] font-black text-sm shadow-md">
              CW
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight block leading-none">
                CeylonWander <span className="text-xs">🇱🇰</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Resplendent Isle
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/itinerary" className="hover:text-emerald-400 transition-colors">Itineraries</Link>
            <Link href="/train" className="hover:text-emerald-400 transition-colors">Scenic Train</Link>
            <Link href="/wildlife" className="hover:text-emerald-400 transition-colors">Safaris & Whales</Link>
            <Link href="/culture" className="hover:text-emerald-400 transition-colors">Culture & Poya</Link>
            <Link href="/food" className="hover:text-emerald-400 transition-colors">Food Guide</Link>
            <Link href="/toolkit" className="hover:text-emerald-400 transition-colors">Field Toolkit</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Audio Ambiance Synthesizer Button */}
            <button
              onClick={toggleSoundscape}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                isPlayingAudio
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-emerald-500/30'
                  : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 size={13} className="text-emerald-400 animate-pulse" />
                  <span>Ambiance Playing</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span>🎧 Island Audio</span>
                </>
              )}
            </button>

            <Link
              href="/explore"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Compass size={13} />
              <span>Launch Map</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Cinematic Hero Section */}
      <main className="relative z-10">
        <section className="pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cloudflare Colombo Edge • 110+ Spots</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono">
              {colomboTime}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 font-serif">
            Step into Sri Lanka’s <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent italic">
              Living, Breathing Topography.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            The first discovery engine engineered for Sri Lanka’s real topography: 
            true <strong>hill-country switchback drive times</strong>, transparent <strong>3-tier dual ticket prices</strong>, 
            and <strong>islandwide microclimates</strong>. Zero scams. Zero guesswork.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <Link
              href="/explore"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Compass size={18} />
              <span>Launch Interactive Vector Map (100% Free)</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/itinerary"
              className="px-7 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-2xl text-sm font-bold backdrop-blur-md transition-all flex items-center gap-2"
            >
              <span>🗺️</span>
              <span>Multi-Day Itinerary Planner</span>
            </Link>
          </div>

          {/* Dynamic Environment Atmosphere Switcher */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-black/40 border border-white/10 rounded-full backdrop-blur-xl">
            <button
              onClick={() => setEnvTheme('emerald')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                envTheme === 'emerald' ? 'bg-white/20 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🌿</span>
              <span>Emerald Highland</span>
            </button>
            <button
              onClick={() => setEnvTheme('golden')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                envTheme === 'golden' ? 'bg-white/20 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🌅</span>
              <span>Golden Sunset</span>
            </button>
            <button
              onClick={() => setEnvTheme('monsoon')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                envTheme === 'monsoon' ? 'bg-white/20 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🌧️</span>
              <span>Tropical Monsoon</span>
            </button>
            <button
              onClick={() => setEnvTheme('night')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                envTheme === 'night' ? 'bg-white/20 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>✨</span>
              <span>Firefly Night</span>
            </button>
          </div>
        </section>

        {/* 4. Journey Through The Biomes (Dedicated Hub Links) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2">
              Five Worlds In One Island
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
              Journey Through The Biomes
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              From cold, misty tea cloud-forests at 2,000 meters to sun-drenched turquoise surf coves and 2,500-year-old rock citadels.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Biome 1: Highlands */}
            <Link
              href="/train"
              className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-6 rounded-3xl backdrop-blur-md transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-white/5 inline-block mb-3">⛰️</span>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                  Elevation 1,000m – 2,500m
                </span>
                <h3 className="text-xl font-black text-white font-serif group-hover:text-emerald-300 transition-colors mt-1">
                  Central Tea Highlands
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Cascading tea plantations, cold eucalyptus air, roaring ravines, and the iconic Nine Arch Bridge. Temperature drops to 12°C at night.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Scenic Train & Stations Guide</span>
                <ArrowRight size={13} />
              </span>
            </Link>

            {/* Biome 2: Cultural Triangle */}
            <Link
              href="/culture"
              className="bg-[#0a2318]/70 border border-white/10 hover:border-purple-500/40 p-6 rounded-3xl backdrop-blur-md transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-white/5 inline-block mb-3">🏛️</span>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider block">
                  UNESCO Sacred Heritage
                </span>
                <h3 className="text-xl font-black text-white font-serif group-hover:text-purple-300 transition-colors mt-1">
                  The Cultural Triangle
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Sigiriya Lion Rock sky fortress, Dambulla cave murals, and towering brick stupas built over 2,000 years ago across dry northern plains.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                <span>Poya Calendar & Temple Etiquette</span>
                <ArrowRight size={13} />
              </span>
            </Link>

            {/* Biome 3: Wildlife */}
            <Link
              href="/wildlife"
              className="bg-[#0a2318]/70 border border-white/10 hover:border-amber-500/40 p-6 rounded-3xl backdrop-blur-md transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-white/5 inline-block mb-3">🐘</span>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                  Wildlife & Marine Corridors
                </span>
                <h3 className="text-xl font-black text-white font-serif group-hover:text-amber-300 transition-colors mt-1">
                  National Parks & Safaris
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Highest leopard density in Yala, guaranteed elephant herds in Udawalawe, the Great Gathering in Minneriya, and blue whales in Mirissa.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <span>Safari & Whales Matrix</span>
                <ArrowRight size={13} />
              </span>
            </Link>

            {/* Biome 4: Food */}
            <Link
              href="/food"
              className="bg-[#0a2318]/70 border border-white/10 hover:border-orange-500/40 p-6 rounded-3xl backdrop-blur-md transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-white/5 inline-block mb-3">🍛</span>
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider block">
                  Authentic Culinary Heritage
                </span>
                <h3 className="text-xl font-black text-white font-serif group-hover:text-orange-300 transition-colors mt-1">
                  Food & Street Eatery Guide
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Rhythmic midnight Kottu Roti, morning Egg Hoppers, spicy coconut Pol Sambol, and southern Fish Ambul Thiyal decoded with ordering phrases.
                </p>
              </div>
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                <span>Culinary Decoder</span>
                <ArrowRight size={13} />
              </span>
            </Link>

            {/* Biome 5: Toolkit */}
            <Link
              href="/toolkit"
              className="bg-[#0a2318]/70 border border-white/10 hover:border-teal-500/40 p-6 rounded-3xl backdrop-blur-md transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-white/5 inline-block mb-3">🧰</span>
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider block">
                  Field Utilities
                </span>
                <h3 className="text-xl font-black text-white font-serif group-hover:text-teal-300 transition-colors mt-1">
                  Traveler Field Toolkit
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Tuk-Tuk fair fare calculator, daily budget in USD/EUR/GBP, airport SIM & eSIM packages, self-drive driving laws, and 1-tap 1990 ambulance.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                <span>Open Field Toolkit</span>
                <ArrowRight size={13} />
              </span>
            </Link>

            {/* Biome 6: Explorer Vector Map */}
            <Link
              href="/explore"
              className="bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-400/30 p-6 rounded-3xl backdrop-blur-md transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-white/10 inline-block mb-3">🗺️</span>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                  Vector Map Engine
                </span>
                <h3 className="text-xl font-black text-white font-serif group-hover:text-amber-300 transition-colors mt-1">
                  Interactive Vector Map
                </h3>
                <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                  110+ curated destinations, dual-pricing tags, elevation indicators, switchback loops, and offline regional packs.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <span>Launch Interactive Map</span>
                <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </section>

        {/* 5. Interactive Scenic Train Simulator */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-gradient-to-br from-[#071c26] to-[#040f17] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider block">
                  🚂 Iconic Mountain Railway Simulator
                </span>
                <h3 className="text-2xl font-black text-white font-serif mt-1">
                  {currentStation.name}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Elevation</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {currentStation.elevation}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={trainStationIdx}
                onChange={(e) => setTrainStationIdx(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-2">
                {STATIONS.map((s, idx) => (
                  <span
                    key={s.name}
                    className={`cursor-pointer ${trainStationIdx === idx ? 'text-blue-400 font-black' : 'hover:text-white'}`}
                    onClick={() => setTrainStationIdx(idx)}
                  >
                    {s.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Side-to-sit recommendation */}
            <div className="bg-[#042433]/70 border border-blue-400/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-[#032317] font-black text-xs tracking-wider">
                    {currentStation.seatSide}
                  </span>
                  <span className="text-xs text-gray-300 font-medium">• {currentStation.duration} from Kandy</span>
                </div>
                <p className="text-xs text-blue-100">{currentStation.seatDesc}</p>
              </div>

              <Link
                href="/train"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-[#032317] rounded-xl text-xs font-black shrink-0 transition-all"
              >
                Full Train Guide →
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Dual-Monsoon 12-Month Interactive Compass */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-[#061810] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  🌦️ Where is it sunny right now?
                </span>
                <h3 className="text-2xl font-black text-white font-serif">
                  Dual-Monsoon Weather Compass
                </h3>
              </div>
              <span className="text-2xl">{currentMonth.icon}</span>
            </div>

            {/* 12-Month Pills */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                <button
                  key={m}
                  onClick={() => setMonthIdx(idx)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    monthIdx === idx
                      ? 'bg-emerald-500 text-[#032317] font-black shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Result Display */}
            <div className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-3">
              <h4 className="font-black text-base text-white">{currentMonth.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{currentMonth.summary}</p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className={`p-3 rounded-xl border ${currentMonth.south.sunny ? 'bg-amber-500/10 border-amber-500/30' : 'bg-sky-500/10 border-sky-500/30'}`}>
                  <strong className="text-white block">South & West Coast (Galle, Mirissa, Weligama)</strong>
                  <span className={currentMonth.south.sunny ? 'text-amber-300 font-bold' : 'text-sky-300 font-bold'}>
                    {currentMonth.south.status}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${currentMonth.east.sunny ? 'bg-amber-500/10 border-amber-500/30' : 'bg-sky-500/10 border-sky-500/30'}`}>
                  <strong className="text-white block">East & North Coast (Arugam Bay, Nilaveli)</strong>
                  <span className={currentMonth.east.sunny ? 'text-amber-300 font-bold' : 'text-sky-300 font-bold'}>
                    {currentMonth.east.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Sinhala Audio Phrase Player */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Friendly Street Smarts
            </span>
            <h3 className="text-2xl font-black text-white font-serif">
              Sinhala Survival Phrases with Audio
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Click any card to trigger synthesized local pronunciation with gentle chimes.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { sinhala: 'එපා, ස්තූතියි', phonetic: 'Epā, sthuthiyi', meaning: 'No, thank you (polite tout decline)' },
              { sinhala: 'මීටරය දානවද?', phonetic: 'Meter eka daanawadha?', meaning: 'Will you turn on the meter? (Tuk-tuks)' },
              { sinhala: 'කීයද?', phonetic: 'Kiyadha?', meaning: 'How much is this? (Markets)' },
              { sinhala: 'සීනි අඩුවෙන්', phonetic: 'Sini aduwen', meaning: 'Less sugar please (Ceylon tea)' },
              { sinhala: 'සැර අඩුවෙන්', phonetic: 'Sera aduwen', meaning: 'Less spicy / mild curry' },
              { sinhala: 'බොහොම ස්තූතියි', phonetic: 'Bohoma sthuthiyi', meaning: 'Thank you very much (universal warmth)' },
            ].map((p, idx) => (
              <div
                key={idx}
                onClick={() => playPhrase(p.phonetic)}
                className="bg-[#0a2318]/70 border border-white/10 hover:border-emerald-500/40 p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-black text-white block">{p.sinhala}</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{p.phonetic}</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">{p.meaning}</span>
                </div>
                <span className="text-xl p-2 bg-white/5 rounded-full">🔊</span>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Bottom Call to Action */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-white">
              Ready to explore Sri Lanka like a local?
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
              100% Free forever. No account required. Explore 110+ destinations, plan unhurried multi-day road loops, 
              and navigate with true mountain travel times.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/explore"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-2xl text-sm font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Compass size={18} />
                <span>Launch Explorer Vector Map</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/itinerary"
                className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-2xl text-sm font-bold transition-all"
              >
                Multi-Day Itinerary Planner
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Global Cinematic Footer */}
      <footer className="border-t border-white/10 py-12 text-xs text-gray-500 bg-[#030a07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">CeylonWander 🇱🇰</span>
            <span>•</span>
            <span>Cloudflare Colombo Edge PoP</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-gray-400 font-semibold">
            <Link href="/explore" className="hover:text-emerald-400">Map</Link>
            <Link href="/itinerary" className="hover:text-emerald-400">Itineraries</Link>
            <Link href="/train" className="hover:text-emerald-400">Train</Link>
            <Link href="/wildlife" className="hover:text-emerald-400">Safaris</Link>
            <Link href="/culture" className="hover:text-emerald-400">Culture</Link>
            <Link href="/food" className="hover:text-emerald-400">Food</Link>
            <Link href="/toolkit" className="hover:text-emerald-400">Toolkit</Link>
            <a 
              href="https://github.com/lahiruhashan/CeylonWander" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
