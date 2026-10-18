'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Menu, 
  X, 
  ChevronDown, 
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  pageSubtitle?: string;
  actionSlot?: React.ReactNode;
}

export default function Navbar({ pageSubtitle = 'Smart Travel Copilot', actionSlot }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guidesDropdownOpen, setGuidesDropdownOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setGuidesDropdownOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const journeyLinks = [
    { href: '/arrival', label: 'Arrive', icon: '✈️', desc: 'CMB Airport, SIMs & ATMs' },
    { href: '/transport', label: 'Move', icon: '🛺', desc: 'Mountain Speed & Tuk-Tuks' },
    { href: '/stay', label: 'Stay', icon: '☀️', desc: 'Monsoon Radar & Culture' },
    { href: '/departure', label: 'Leave', icon: '🛫', desc: 'Flight Leave-By Timer' },
    { href: '/prices', label: 'Fair Prices', icon: '🏷️', desc: 'Verified Price Database', isPill: true },
  ];

  const guideLinks = [
    { href: '/itinerary', label: 'Itineraries', icon: '🗺️', desc: '3, 7, 10, 14-day loop routes' },
    { href: '/train', label: 'Scenic Train', icon: '🚂', desc: 'Kandy to Ella elevation guide' },
    { href: '/wildlife', label: 'Safaris & Whales', icon: '🐘', desc: 'Ethical national parks calendar' },
    { href: '/culture', label: 'Culture & Poya', icon: '🏛️', desc: 'Temple rules & sacred holidays' },
    { href: '/food', label: 'Food Guide', icon: '🍛', desc: 'Street food & dining etiquette' },
    { href: '/toolkit', label: 'Field Toolkit', icon: '🧰', desc: 'Health, emergency & checklists' },
  ];

  const isGuideActive = guideLinks.some((g) => pathname === g.href);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#061c14]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#032317] font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              CC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                  CeylonCopilot
                </span>
                <span className="text-xs">🇱🇰</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-0.5">
                {pageSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-gray-300">
            {journeyLinks.map((link) => {
              const isActive = pathname === link.href;
              if (link.isPill) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20'
                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/20'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Guides Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setGuidesDropdownOpen(!guidesDropdownOpen)}
                onBlur={() => setTimeout(() => setGuidesDropdownOpen(false), 200)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isGuideActive
                    ? 'bg-white/15 text-white ring-1 ring-white/20'
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                <span>📚</span>
                <span>Guides</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform text-neutral-400 ${guidesDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Panel */}
              {guidesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] uppercase font-black text-neutral-400 px-3 py-1.5 tracking-wider border-b border-neutral-800">
                    Field Guides & Directories
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {guideLinks.map((guide) => {
                      const isItemActive = pathname === guide.href;
                      return (
                        <Link
                          key={guide.href}
                          href={guide.href}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                            isItemActive
                              ? 'bg-emerald-500/20 text-white'
                              : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
                          }`}
                        >
                          <span className="text-base shrink-0 mt-0.5">{guide.icon}</span>
                          <div>
                            <div className="font-bold text-xs">{guide.label}</div>
                            <div className="text-[10px] text-neutral-400 leading-tight">
                              {guide.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Action Slot (e.g., Audio Ambiance Synthesizer on Home) */}
            {actionSlot}

            {/* Launch Map Primary CTA */}
            <Link
              href="/explore"
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Compass size={14} />
              <span className="hidden sm:inline">Launch Map</span>
              <span className="sm:hidden">Map</span>
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-neutral-950/95 backdrop-blur-2xl flex flex-col pt-16 overflow-y-auto animate-in fade-in duration-200">
          <div className="p-6 space-y-6 max-w-lg mx-auto w-full">
            {/* Quick Map Button */}
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#032317] rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25"
            >
              <Compass size={16} />
              <span>Launch Interactive Vector Map</span>
            </Link>

            {/* Section 1: Journey Copilot (Chronological 4 Phases) */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider block px-1">
                4-Stage Journey Copilot
              </span>
              <div className="grid grid-cols-1 gap-2">
                {journeyLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isActive
                          ? 'border-emerald-500/80 bg-emerald-500/15 text-white ring-1 ring-emerald-500/30'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{link.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-white">{link.label}</div>
                          <div className="text-[11px] text-neutral-400">{link.desc}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Guides & Tools */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider block px-1">
                Traveler Guides & Directories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {guideLinks.map((guide) => {
                  const isActive = pathname === guide.href;
                  return (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                          : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xl mb-1">{guide.icon}</span>
                      <span className="font-bold text-xs text-white">{guide.label}</span>
                      <span className="text-[10px] text-neutral-400 truncate mt-0.5">{guide.desc}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Emergency Quick Call Bar */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <PhoneCall size={14} className="text-emerald-400" />
                <span>Sri Lanka Emergency Numbers</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span>Free Paramedic Ambulance:</span>
                <strong className="text-rose-400 font-mono text-sm">1990</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Tourist Police Helpline:</span>
                <strong className="text-emerald-400 font-mono text-sm">1912</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
