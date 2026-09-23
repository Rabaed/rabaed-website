import { DemoRequestForm } from '@/components/demo-request-form';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/questions';
import { FreeToolTeaser } from '@/components/start/free-tool-teaser';
import { Steps } from '@/components/start/steps';
import { breadcrumbData, faqData, StructuredData } from '@/components/structured-data';
import type { StartPageContent } from '@/content/pages/start';
import { LOCALES, type Locale } from '@/lib/locales';

/**
 * The start page, in either language, in the Reference site's order: the page
 * hero, the Trust strip, the steps to going live, and the questions with the
 * demo request form beside them and the free tool teaser under both.
 *
 * Its words are its entry in the CMS (ticket 53) and its questions the FAQs,
 * both read through `src/content/pages/start.ts` in the language asked for
 * (ticket 42). The form is the one form the home and product pages carry too,
 * with its words from its settings in the CMS (ticket 27).
 *
 * **Nothing on it moves but the header and the Trust strip**, so it loads no
 * other animation code: the Reference start page carries the whole animation
 * bundle, hero loop and card decks and journey included, for elements it does
 * not contain (spec: Analytics and performance). Everything here is a server
 * component, and `tests/e2e/start-page.spec.ts` checks the scripts it loads.
 */
export async function StartPage({
  locale,
  locales,
  content,
}: {
  locale: Locale;
  /** The languages the page is published in, for the switcher. */
  locales: readonly Locale[];
  content: StartPageContent;
}) {
  return (
    <PageShell locale={locale} path="/start" locales={locales}>
      <PageHero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      {content.steps.shows && <Steps content={content.steps} />}
      <Questions content={content.questions} direction={LOCALES[locale].dir} beside={<DemoRequestForm wording={content.demoForm} />}>
        {content.freeTool.shows && <FreeToolTeaser content={content.freeTool} />}
      </Questions>
      <StructuredData data={await breadcrumbData(locale, [{ name: content.meta.name, path: '/start' }])} />
      <StructuredData data={faqData(content.questions)} />
    </PageShell>
  );
}
