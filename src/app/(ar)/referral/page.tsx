import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/questions';
import { Audience } from '@/components/referral/audience';
import { HowItWorks } from '@/components/referral/how-it-works';
import { Offer } from '@/components/referral/offer';
import { Signup } from '@/components/referral/signup';
import { TermsSummary } from '@/components/referral/terms-summary';
import { WhatIsReferred } from '@/components/referral/what-is-referred';
import { getReferralPage } from '@/content/pages/referral';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getReferralPage('ar');
  return pageMetadata({ locale: 'ar', path: '/referral', ...meta });
}

/**
 * The Arabic Referral Program page, in the Reference site's order: the page
 * hero with the programme's three figures, how it works, the offer, who it is
 * for, what is referred, the terms in eight points, the questions, and the
 * signup form.
 *
 * Its words come from `src/content/pages/referral.ts`.
 *
 * **The Referral Program values — the payout for each project and the client's
 * discount — are held once** (`src/content/referral-program.ts`) and inserted wherever the page
 * quotes them, its search title and questions included. The Referral Terms
 * keep their own text, which states the same amounts in the lawyer's words
 * (ADR-0008). They are not in the header menu, by the founders' decision
 * (HANDOFF §2).
 *
 * Nothing on it moves but the header, so it loads no other animation code
 * (spec: Analytics and performance). The document fields in the form are the
 * only other client code: they show the file chosen.
 */
export default async function ReferralPage() {
  const content = await getReferralPage('ar');

  return (
    <PageShell locale="ar" path="/referral">
      <PageHero content={content.hero} />
      <HowItWorks content={content.howItWorks} />
      {content.offer.shows && <Offer content={content.offer} />}
      {content.audience.shows && <Audience content={content.audience} />}
      {content.whatIsReferred.shows && <WhatIsReferred content={content.whatIsReferred} />}
      {content.termsSummary.shows && <TermsSummary content={content.termsSummary} />}
      {content.questions.shows && <Questions content={content.questions} />}
      <Signup content={content.signup} />
    </PageShell>
  );
}
