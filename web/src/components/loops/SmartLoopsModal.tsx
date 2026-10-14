'use client';

import React, { useEffect, useState } from 'react';
import { ItineraryLoop } from '@/types';
import { fetchSmartLoops } from '@/services/api';
import { X, Sparkles } from 'lucide-react';

interface SmartLoopsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartLoopsModal({ isOpen, onClose }: SmartLoopsModalProps) {
  const [loops, setLoops] = useState<ItineraryLoop[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchSmartLoops()
      .then((data) => setLoops(data))
      .catch(() => setLoops([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Anti-Backtracking Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Smart Corridor Loops</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Pre-calculated sequential routes along mountain corridors engineered to minimize tedious hill-country backtracking.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-xs">Loading curated loops...</div>
          ) : loops.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">No loops found.</div>
          ) : (
            loops.map((loop) => (
              <div
                key={loop.id}
                className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
                      {loop.duration_category === 'half_day' ? 'Half-Day Corridor' : 'Full-Day Circuit'}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{loop.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-950 block">~{loop.estimated_travel_time_mins} mins</span>
                    <span className="text-[11px] text-gray-500">{loop.total_distance_km} km road</span>
                  </div>
                </div>

                {loop.summary && (
                  <p className="text-xs text-gray-600 leading-relaxed">{loop.summary}</p>
                )}

                {/* Corridor Stops */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Sequential Stops Along Road
                  </span>
                  <div className="flex flex-col gap-2">
                    {loop.stops.map((stop) => (
                      <div key={stop.place_id} className="flex items-center gap-3 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          {stop.order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-gray-900 truncate block">{stop.name}</span>
                          {stop.tips && <span className="text-[11px] text-gray-500 italic block">{stop.tips}</span>}
                        </div>
                        <span className="text-[11px] text-gray-600 font-medium shrink-0">
                          {stop.recommended_duration_mins}m stay
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {loop.corridor_tips && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900">
                    <span className="font-semibold">Corridor Tip: </span>
                    {loop.corridor_tips}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
