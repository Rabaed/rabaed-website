import type { Metadata } from 'next';
import { ClosingSection } from '@/components/closing-section';
import { Figures } from '@/components/home/figures';
import { FourUnits } from '@/components/home/four-units';
import { Hero } from '@/components/home/hero';
import { Questions } from '@/components/home/questions';
import { Situations } from '@/components/home/situations';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  title: 'ربائد · ثلاثة أطراف. سجل واحد.',
  description:
    'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
});

/**
 * The Arabic home page, in the state ticket 11 leaves it: the full-height hero,
 * the Trust strip, the situations deck, the four units, the figures deck, the
 * questions, and the closing section with the demo request form.
 *
 * One gap remains, marked where it falls in the Reference site's order:
 * tickets 09 and 10 fill the space before the figures deck.
 *
 * All copy is verbatim from `reference/site/index.html`. Nothing here is
 * placeholder text, and nothing waits to be reworded.
 */
export default function HomePage() {
  return (
    <PageShell locale="ar" path="/">
      <Hero />
      <TrustStrip />
      <Situations />
      <FourUnits />
      {/* Tickets 09 and 10: the Record, and the before-and-after with its
          calculator. */}
      <Figures />
      <Questions />
      <ClosingSection />
      {/* The page's `.reveal` entrances, attached once for the page. Here
          rather than in `PageShell`, so pages without any do not load it. */}
      <RevealOnScroll />
    </PageShell>
  );
}
