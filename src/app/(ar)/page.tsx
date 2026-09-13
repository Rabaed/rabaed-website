import type { Metadata } from 'next';
import { ClosingSection } from '@/components/closing-section';
import { Figures } from '@/components/home/figures';
import { FourUnits } from '@/components/home/four-units';
import { Hero } from '@/components/home/hero';
import { Questions } from '@/components/home/questions';
import { RecordSection } from '@/components/home/record';
import { Situations } from '@/components/home/situations';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  title: 'ربائد · ثلاثة أطراف. سجل واحد.',
  description:
    'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
});

/**
 * The Arabic home page, in the state ticket 09 leaves it: the full-height hero,
 * the Trust strip, the situations deck, the four units, the Record, the figures
 * deck, the questions, and the closing section with the demo request form.
 *
 * One gap remains, marked where it falls in the Reference site's order:
 * ticket 10 fills the space before the figures deck.
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
      <RecordSection />
      {/* Ticket 10: the before-and-after, with its calculator. */}
      <Figures />
      <Questions />
      <ClosingSection />
    </PageShell>
  );
}
