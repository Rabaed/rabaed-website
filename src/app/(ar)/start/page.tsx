import type { Metadata } from 'next';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/start/questions';
import { Steps } from '@/components/start/steps';
import { getStartPage } from '@/content/pages/start';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getStartPage('ar');
  return pageMetadata({ locale: 'ar', path: '/start', ...meta });
}

/**
 * The Arabic start page, in the Reference site's order: the page hero, the
 * Trust strip, the three steps to going live, and the questions with the demo
 * request form beside them and the free tool teaser under both.
 *
 * Its words come from `src/content/pages/start.ts`.
 *
 * **Nothing on it moves but the header and the Trust strip**, so it loads no
 * other animation code: the Reference start page carries the whole animation
 * bundle, hero loop and card decks and journey included, for elements it does
 * not contain (spec: Analytics and performance). Everything here is a server
 * component, and `tests/e2e/start-page.spec.ts` checks the scripts it loads.
 */
export default async function StartPage() {
  const content = await getStartPage('ar');

  return (
    <PageShell locale="ar" path="/start">
      <PageHero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      {content.steps.shows && <Steps content={content.steps} />}
      <Questions content={content.questions} form={content.demoForm} />
    </PageShell>
  );
}
