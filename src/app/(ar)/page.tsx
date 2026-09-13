import type { Metadata } from 'next';
import { ClosingSection } from '@/components/closing-section';
import { BeforeAfter } from '@/components/home/before-after';
import { DelayCalculator } from '@/components/home/delay-calculator';
import { Figures } from '@/components/home/figures';
import { FourUnits } from '@/components/home/four-units';
import { Hero } from '@/components/home/hero';
import { Questions } from '@/components/home/questions';
import { RecordSection } from '@/components/home/record';
import { Situations } from '@/components/home/situations';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { CLOSING_SECTION } from '@/content/closing-section';
import { TRUST_STRIP } from '@/content/trust-strip';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  title: 'ربائد · ثلاثة أطراف. سجل واحد.',
  description:
    'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
});

/**
 * The Arabic home page, whole: the full-height hero, the Trust strip, the
 * situations deck, the four units, the Record, the before-and-after comparison,
 * the delay-cost calculator, the figures deck, the questions, and the closing
 * section with the demo request form — in the Reference site's order.
 *
 * All copy is verbatim from `reference/site/index.html`. Nothing here is
 * placeholder text, and nothing waits to be reworded.
 */
export default function HomePage() {
  return (
    <PageShell locale="ar" path="/">
      <Hero />
      <TrustStrip content={TRUST_STRIP.ar} />
      <Situations />
      <FourUnits />
      <RecordSection />
      <BeforeAfter />
      <DelayCalculator />
      <Figures />
      <Questions />
      <ClosingSection content={CLOSING_SECTION.ar} />
      {/* The page's `.reveal` entrances, attached once for the page. Here
          rather than in `PageShell`, so pages without any do not load it. */}
      <RevealOnScroll />
    </PageShell>
  );
}
