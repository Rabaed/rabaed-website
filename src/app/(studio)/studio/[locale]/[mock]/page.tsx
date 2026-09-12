import { notFound } from 'next/navigation';
import { readScreenMockMarkup, screenMockLocales } from '@/screen-mocks/markup';
import { findScreenMock, SCREEN_MOCKS } from '@/screen-mocks/registry';
import { LOCALE_CODES, type Locale } from '@/lib/locales';

/**
 * One Screen mock, on its stage, at 1:1 and nothing else on the page.
 *
 * This is what `npm run mocks:export` photographs, and what the test compares
 * against the Reference site. Keeping it to one mock per URL is what makes both
 * of those a plain screenshot of a plain page.
 */
export async function generateStaticParams() {
  const locales = await screenMockLocales();
  return locales.flatMap((locale) => SCREEN_MOCKS.map((mock) => ({ locale, mock: mock.id })));
}

export default async function ScreenMockPage({
  params,
}: {
  params: Promise<{ locale: string; mock: string }>;
}) {
  const { locale, mock: id } = await params;

  // Both checked against a fixed list before anything touches the filesystem,
  // so a URL cannot name a file of its own.
  if (!LOCALE_CODES.includes(locale as Locale)) notFound();
  const mock = findScreenMock(id);
  if (!mock) notFound();

  let markup: string;
  try {
    markup = await readScreenMockMarkup(locale as Locale, mock);
  } catch {
    // A locale that has no set yet — English until ticket 41.
    notFound();
  }

  // The only `dangerouslySetInnerHTML` in this codebase, and the mock markup
  // is the only thing that ever reaches it: a reviewed file in this repository,
  // named by the registry rather than by the URL (see `markup.ts`).
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
