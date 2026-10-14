'use client';

import React, { useState } from 'react';
import { Place } from '@/types';
import { submitConditionUpdate } from '@/services/api';
import { X, Check } from 'lucide-react';

interface CommunityReportModalProps {
  place: Place | null;
  onClose: () => void;
}

export default function CommunityReportModal({ place, onClose }: CommunityReportModalProps) {
  const [reportType, setReportType] = useState('condition_update');
  const [conditionText, setConditionText] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!place) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conditionText.trim()) return;

    try {
      setIsSubmitting(true);
      await submitConditionUpdate({
        place_id: place.id,
        place_name: place.name,
        contribution_type: reportType,
        details: {
          note: conditionText,
          reported_at: new Date().toISOString()
        },
        submitter_name: submitterName.trim() || 'Anonymous Wanderer'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      alert(`Submission error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-orange-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="text-lg font-bold">Community Intel Update</h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Reporting on: <strong className="text-white">{place.name}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-8 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Thank you, traveler!</h3>
              <p className="text-xs text-gray-500">Your update has been queued for review to assist fellow travelers.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Update Type</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReportType('condition_update')}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      reportType === 'condition_update'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ⚠️ Road / Weather Condition
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType('pricing_update')}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      reportType === 'pricing_update'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    💵 Ticket Fee Change
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Live Situation Note
                </label>
                <textarea
                  value={conditionText}
                  onChange={(e) => setConditionText(e.target.value)}
                  placeholder="e.g. Trail is slippery due to heavy morning rain, or ticket counter currently cash-only..."
                  rows={3}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Your Traveler Name / Handle (Optional)
                </label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="e.g. Nuwara Explorer"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !conditionText.trim()}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Intel'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
