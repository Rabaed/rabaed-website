import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  title: 'Rabaed',
  description: 'The English version of the Rabaed site is in preparation. The site is available in Arabic.',
});

/**
 * The English locale, reserved. `/en` exists from the start so that routing,
 * direction and the `hreflang` pair are settled before there is anything to
 * translate. It says only that, deliberately: the English site is Stage 2
 * (tickets 40–43), and English marketing copy written here would be copy
 * nobody has approved and ticket 42 would have to unpick.
 */
export default function EnglishHomePage() {
  return (
    <main className="skeleton">
      <h1>Rabaed</h1>
      <p className="skeleton-lead">
        The English site is on its way. <a href="/">The site in Arabic is here.</a>
      </p>
    </main>
  );
}
