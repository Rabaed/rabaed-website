import { DelayCalculator } from '@/components/home/delay-calculator';
import { Hero } from '@/components/home/hero';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { About } from '@/components/profile/about';
import { ProfileClose } from '@/components/profile/close';
import { Compare } from '@/components/profile/compare';
import { Numbers } from '@/components/profile/numbers';
import { Parties } from '@/components/profile/parties';
import { Platform } from '@/components/profile/platform';
import { DocumentedRecord } from '@/components/profile/record';
import { SectionEyebrow } from '@/components/profile/section-eyebrow';
import { Trap } from '@/components/profile/trap';
import { Truth } from '@/components/profile/truth';
import { breadcrumbData, StructuredData } from '@/components/structured-data';
import type { ProfilePageContent } from '@/content/pages/profile';
import { LOCALES, localePath, type Locale } from '@/lib/locales';

/**
 * The Company profile, in either language (ticket 102): Ahmed's profile of
 * Rabaed as a page of the site, in the site's own header, footer and
 * sections. It opens on the home page's hero, with Ahmed's words and two
 * buttons of its own — to the home page's demo form, and to WhatsApp — and the
 * Trust strip under it. Ahmed's fourteen sections follow: 01 to 04 from
 * ticket 105, 06 to 08 from ticket 107, the rest from tickets 106–109.
 *
 * Reached by the link Ahmed sends prospects: neither the header menu nor the
 * Footer directory names it, though search engines may (spec: The page).
 */
export async function ProfilePage({
  locale,
  locales,
  content,
}: {
  locale: Locale;
  /** The languages the page is published in, for the switcher. */
  locales: readonly Locale[];
  content: ProfilePageContent;
}) {
  return (
    <PageShell
      locale={locale}
      path="/profile"
      locales={locales}
      // The header's own Download PDF button, its "Book a live demo" to the
      // home page's form, since this page has none, and its colour following
      // each section, since Ahmed's turn dark again after light ones (ticket 104).
      header={{ button: content.pdf, demoHref: `${localePath(locale, '/')}#demo`, colours: 'each-section' }}
    >
      <Hero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      {content.truth.shows && <Truth content={content.truth} />}
      {content.numbers.shows && <Numbers content={content.numbers} />}
      {content.trap.shows && <Trap content={content.trap} />}
      {content.about.shows && <About content={content.about} />}
      {/* 05, «التكلفة الخفية»: the home page's calculator, under Ahmed's id
          and with his section number before its shared eyebrow's words (ticket 106). */}
      {content.cost.shows && (
        <DelayCalculator id="cost" content={content.cost} eyebrow={<SectionEyebrow number="05" words={content.cost.eyebrow} />} />
      )}
      {content.parties.shows && <Parties content={content.parties} />}
      {content.platform.shows && <Platform content={content.platform} direction={LOCALES[locale].dir} />}
      {content.record.shows && <DocumentedRecord content={content.record} />}
      <Compare content={content.compare} direction={LOCALES[locale].dir} />
      {/* 10 to 14, the contact section and the floating WhatsApp button (ticket 109). */}
      <ProfileClose content={content.close} locale={locale} />
      <StructuredData data={await breadcrumbData(locale, [{ name: content.meta.name, path: '/profile' }])} />
    </PageShell>
  );
}
