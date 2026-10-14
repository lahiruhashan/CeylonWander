'use client';

import React, { useEffect, useState } from 'react';
import { Region } from '@/types';
import { fetchRegions, downloadRegionalPack } from '@/services/api';
import { X, Download, CheckCircle2, Phone, WifiOff } from 'lucide-react';

interface OfflinePacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfflinePacksModal({ isOpen, onClose }: OfflinePacksModalProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [downloadedPacks, setDownloadedPacks] = useState<Record<string, boolean>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetchRegions().then((data) => setRegions(data)).catch(() => setRegions([]));
    
    // Check localStorage for previously saved packs
    const saved = localStorage.getItem('ceylonwander_offline_packs');
    if (saved) {
      try {
        setDownloadedPacks(JSON.parse(saved));
      } catch {
        // ignore parse error
      }
    }
  }, [isOpen]);

  const handleDownload = async (region: Region) => {
    try {
      setDownloadingId(region.id);
      const pack = await downloadRegionalPack(region.id);
      
      // Save manifest in local storage
      localStorage.setItem(`offline_pack_${region.id}`, JSON.stringify(pack));
      const updated = { ...downloadedPacks, [region.id]: true };
      setDownloadedPacks(updated);
      localStorage.setItem('ceylonwander_offline_packs', JSON.stringify(updated));
    } catch (err) {
      alert(`Could not download pack: ${err}`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-blue-200 font-semibold uppercase tracking-wider mb-1">
            <WifiOff size={14} />
            <span>Connectivity Dead-Zone Protection</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Regional Offline Bundles</h2>
          <p className="text-xs text-blue-100 mt-1">
            Download full town packages containing POIs, pricing, cultural etiquette, emergency numbers, and GeoJSON vectors (&lt; 25 MB each).
          </p>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {regions.map((reg) => {
            const isDownloaded = !!downloadedPacks[reg.id];
            const isDownloading = downloadingId === reg.id;

            return (
              <div
                key={reg.id}
                className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-400 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                      {reg.province}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">{reg.name}</h3>
                    {reg.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{reg.description}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-gray-700 block">~{reg.offline_pack_size_mb} MB</span>
                    <span className="text-[10px] text-gray-400">v{reg.offline_pack_version}</span>
                  </div>
                </div>

                {/* Emergency Contacts Preview */}
                {reg.emergency_contacts && reg.emergency_contacts.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-xl">
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <Phone size={12} className="text-red-500" />
                      Emergency:
                    </span>
                    {reg.emergency_contacts.slice(0, 2).map((c, i) => (
                      <span key={i} className="text-gray-700">
                        {c.service}: <strong className="text-gray-900">{c.number}</strong>
                        {i === 0 ? ' | ' : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* Download CTA Button */}
                <div className="pt-1 flex items-center justify-end">
                  {isDownloaded ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 size={16} />
                      <span>Ready Offline (Cached)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload(reg)}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      <Download size={14} />
                      <span>{isDownloading ? 'Downloading Pack...' : `Download (${reg.offline_pack_size_mb} MB)`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
