import { Hero } from '@/components/home/hero';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { breadcrumbData, StructuredData } from '@/components/structured-data';
import type { ProfilePageContent } from '@/content/pages/profile';
import type { Locale } from '@/lib/locales';

/**
 * The Company profile, in either language (ticket 102): Ahmed's profile of
 * Rabaed as a page of the site, in the site's own header, footer and
 * sections. It opens on the home page's hero, with Ahmed's words and two
 * buttons of its own — to the home page's demo form, and to WhatsApp — and the
 * Trust strip under it. Ahmed's fourteen sections follow in tickets 105–109.
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
    <PageShell locale={locale} path="/profile" locales={locales}>
      <Hero content={content.hero} />
      {content.trustStrip.shows && <TrustStrip content={content.trustStrip} />}
      <StructuredData data={await breadcrumbData(locale, [{ name: content.meta.name, path: '/profile' }])} />
    </PageShell>
  );
}
