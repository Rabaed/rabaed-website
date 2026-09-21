'use client';

import { track } from '@vercel/analytics';
import { useEffect } from 'react';
import { aiAssistantFrom } from '@/lib/ai-referrals';

/**
 * Counts a visit that an AI assistant sent (ticket 34), so that the team can
 * read it as a number beside the page views rather than by going through a
 * list of referrers looking for three particular names — and so that a visit
 * whose referrer the assistant did not pass on is counted too
 * (`src/lib/ai-referrals.ts` explains the two signals).
 *
 * Once per page load, and it stores nothing to make that true: the referrer
 * belongs to the visit that opened the site, and moving about the site
 * afterwards does not load the page again. A visitor who reloads the page they
 * arrived on is counted twice, which is the price of keeping the visitor's
 * device untouched (`measurement.tsx` says why that matters).
 */
export function AiReferral() {
  useEffect(() => {
    const assistant = aiAssistantFrom(document.referrer, window.location.search);
    if (assistant) track('ai-referral', { assistant });
  }, []);

  return null;
}
