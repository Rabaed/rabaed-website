import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AiReferral } from '@/components/ai-referral';
import { isMeasured } from '@/lib/environment';

/**
 * How many people visit, what they read, where they came from, and how fast
 * the site was for them (ticket 34): Vercel's Web Analytics and Speed
 * Insights, on every page of the site and on no page of the admin, which is
 * the team's own traffic.
 *
 * **No cookie banner, because there is nothing to consent to.** Neither script
 * writes a cookie or anything else to the visitor's device. A visitor is
 * counted as a hash Vercel makes of the request itself, and that hash is
 * thrown away after a day, so nobody — Vercel included — can follow one person
 * from one day to the next, or from this site to another. What is collected,
 * in full, is in `docs/analytics.md`, which is also what the Privacy Policy
 * has to describe (ticket 37).
 *
 * **The scripts load on the production deployment alone** (`isMeasured`), and
 * are fetched from the deployment's own origin rather than a third party's.
 * The events below are raised everywhere and quietly go nowhere when no script
 * is listening, which is how the suite checks that the right ones are raised.
 */
export function Measurement() {
  return (
    <>
      {isMeasured() && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      <AiReferral />
    </>
  );
}
