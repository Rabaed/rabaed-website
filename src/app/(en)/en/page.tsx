import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  title: 'Rabaed',
  description: 'The English version of the Rabaed site is in preparation. The site is available in Arabic.',
});

/**
 * The English locale, reserved. `/en` exists from the start so that routing,
 * direction and the `hreflang` pair are settled before there is anything to
 * translate. It says only that, deliberately: the English home page is ticket
 * 42's, and English marketing copy written here would be copy nobody has
 * approved and ticket 42 would have to unpick.
 *
 * It sits in the page shell, which draws the English header and footer once
 * their words are published (ticket 40), and until then draws this alone.
 */
export default function EnglishHomePage() {
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
