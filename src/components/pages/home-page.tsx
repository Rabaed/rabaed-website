import { ClosingSection } from '@/components/closing-section';
import { BeforeAfter } from '@/components/home/before-after';
import { DelayCalculator } from '@/components/home/delay-calculator';
import { Figures } from '@/components/home/figures';
import { FourUnits } from '@/components/home/four-units';
import { Hero } from '@/components/home/hero';
import { RecordSection } from '@/components/home/record';
import { Situations } from '@/components/home/situations';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/questions';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { faqData, softwareData, StructuredData, websiteData } from '@/components/structured-data';
import type { HomePageContent } from '@/content/pages/home';
import { LOCALES, type Locale } from '@/lib/locales';

/**
 * The home page, whole, in either language: the full-height hero, the Trust
 * strip, the situations deck, the four units, the Record, the before-and-after
 * comparison, the delay-cost calculator, the figures deck, the questions, and
 * the closing section with the demo request form — in the Reference site's
 * order.
 *
 * One page for both languages, handed its words in one of them
 * (`src/content/pages/home.ts`): the English home page is this, laid out left
 * to right, rather than a copy that could drift from it (ticket 42).
 */
export function HomePage({
  locale,
  locales,
  content,
}: {
  locale: Locale;
  /** The languages the page is published in, for the switcher. */
  locales: readonly Locale[];
  content: HomePageContent;
}) {
  const direction = LOCALES[locale].dir;

  return (
    <PageShell locale={locale} path="/" locales={locales}>
      <Hero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      {content.situations.shows && <Situations content={content.situations} direction={direction} />}
      {content.fourUnits.shows && <FourUnits content={content.fourUnits} direction={direction} />}
      {content.record.shows && <RecordSection content={content.record} direction={direction} />}
      {content.beforeAfter.shows && <BeforeAfter content={content.beforeAfter} />}
      {content.calculator.shows && <DelayCalculator content={content.calculator} />}
      {content.figures.shows && <Figures content={content.figures} direction={direction} />}
      {content.questions.shows && <Questions ruled={false} content={content.questions} />}
      <ClosingSection content={content.closing} form={content.demoForm} />
      {/* The page's `.reveal` entrances, attached once for the page. Here
          rather than in `PageShell`, so pages without any do not load it. */}
      <RevealOnScroll />
      <StructuredData data={websiteData(locale)} />
      <StructuredData data={softwareData(locale)} />
      <StructuredData data={faqData(content.questions)} />
    </PageShell>
  );
}
