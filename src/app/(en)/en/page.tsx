import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';
import { PageShell } from '@/components/page-shell';
import { getHomePage } from '@/content/pages/home';
import { inEnglish } from '@/content/pages/page-content';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish(getHomePage);
  if (content) return pageMetadata({ locale: 'en', path: '/', ...content.meta });
  return pageMetadata({
    locale: 'en',
    title: 'Rabaed',
    description: 'The English version of the Rabaed site is in preparation. The site is available in Arabic.',
  });
}

/**
 * The English home page (ticket 42): the home page itself once its English is
 * published — its own words, and everything it shares with the other pages,
 * the closing section, the Trust strip, the Screen mocks and its search
 * settings among them (`src/content/pages/home.ts`).
 *
 * Until then, what `/en` has said since the English locale was reserved: that
 * the English site is on its way, and where the Arabic one is. Never an
 * English page with Arabic words in it, and never English copy nobody has
 * approved.
 *
 * One route for both, so it carries the home page's scripts either way — the
 * placeholder's one cost, which ends when the English home page is published
 * and needs every one of them (`tests/e2e/animation-code.ts`).
 */
export default async function EnglishHomePage() {
  const content = await inEnglish(getHomePage);
  if (content) return <HomePage locale="en" locales={LOCALE_CODES} content={content} />;

  return (
    <PageShell locale="en" path="/">
      <section className="phero">
        <div className="wrap">
          <h1>Rabaed</h1>
          <p className="lead">
            The English site is on its way. <a href="/">The site in Arabic is here.</a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
