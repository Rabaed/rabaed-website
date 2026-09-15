import type { Metadata } from 'next';
import { DemoRequestForm } from '@/components/demo-request-form';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/questions';
import { FreeToolTeaser } from '@/components/start/free-tool-teaser';
import { Steps } from '@/components/start/steps';
import { breadcrumbData, faqData, StructuredData } from '@/components/structured-data';
import { getStartPage } from '@/content/pages/start';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getStartPage('ar');
  // Arabic alone until English is switched on (tickets 40 and 42).
  return pageMetadata({ locale: 'ar', locales: ['ar'], path: '/start', ...meta });
}

/**
 * The Arabic start page, in the Reference site's order: the page hero, the
 * Trust strip, the steps to going live, and the questions with the demo
 * request form beside them and the free tool teaser under both.
 *
 * Its words are its entry in the CMS (ticket 53) and its questions the FAQs,
 * both read through `src/content/pages/start.ts`.
 * The form is the one form the home and product pages carry too, with its words
 * from its settings in the CMS (ticket 27).
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
      <Questions content={content.questions} beside={<DemoRequestForm wording={content.demoForm} />}>
        {content.freeTool.shows && <FreeToolTeaser content={content.freeTool} />}
      </Questions>
      <StructuredData data={breadcrumbData('ar', [{ name: content.meta.name, path: '/start' }])} />
      <StructuredData data={faqData(content.questions)} />
    </PageShell>
  );
}
