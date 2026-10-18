'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { isPriceStale } from '@/data/verified_prices_data';

interface VerifiedBadgeProps {
  verifiedOn: string; // YYYY-MM-DD
  sourceType: 'official' | 'operator' | 'field_check';
  sourceName: string;
  sourceUrl?: string;
  className?: string;
}

export default function VerifiedBadge({
  verifiedOn,
  sourceType,
  sourceName,
  sourceUrl,
  className = '',
}: VerifiedBadgeProps) {
  const isStale = isPriceStale(verifiedOn);

  // Format month and year e.g. "Oct 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(verifiedOn);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return verifiedOn;
    }
  })();

  const sourceLabel = sourceType === 'official' ? 'Official' : sourceType === 'operator' ? 'Operator' : 'Field Check';

  if (isStale) {
    return (
      <span
        title={`Verified on ${verifiedOn} via ${sourceName}. Data exceeds 90 days - field check in progress.`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 ${className}`}
      >
        <AlertTriangle size={11} className="text-amber-400" />
        <span>Update Due ({formattedDate})</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 ${className}`}
    >
      <CheckCircle2 size={11} className="text-emerald-400" />
      <span>Verified {formattedDate} · {sourceLabel}</span>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Source: ${sourceName}`}
          className="text-emerald-400 hover:text-white transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={10} />
        </a>
      )}
    </span>
  );
}
