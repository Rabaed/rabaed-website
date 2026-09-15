import type { Metadata } from 'next';
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
import { getHomePage } from '@/content/pages/home';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getHomePage('ar');
  return pageMetadata({ locale: 'ar', path: '/', ...meta });
}

/**
 * The Arabic home page, whole: the full-height hero, the Trust strip, the
 * situations deck, the four units, the Record, the before-and-after comparison,
 * the delay-cost calculator, the figures deck, the questions, and the closing
 * section with the demo request form — in the Reference site's order.
 *
 * Its words come from `src/content/pages/home.ts`.
 */
export default async function HomePage() {
  const content = await getHomePage('ar');

  return (
    <PageShell locale="ar" path="/">
      <Hero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      {content.situations.shows && <Situations content={content.situations} />}
      {content.fourUnits.shows && <FourUnits content={content.fourUnits} />}
      {content.record.shows && <RecordSection content={content.record} />}
      {content.beforeAfter.shows && <BeforeAfter content={content.beforeAfter} />}
      {content.calculator.shows && <DelayCalculator content={content.calculator} />}
      {content.figures.shows && <Figures content={content.figures} />}
      {content.questions.shows && (
        <Questions ruled={false} content={content.questions} />
      )}
      <ClosingSection content={content.closing} form={content.demoForm} />
      {/* The page's `.reveal` entrances, attached once for the page. Here
          rather than in `PageShell`, so pages without any do not load it. */}
      <RevealOnScroll />
      <StructuredData data={websiteData()} />
      <StructuredData data={softwareData()} />
      <StructuredData data={content.questions.shows ? faqData(content.questions.entries) : null} />
    </PageShell>
  );
}
