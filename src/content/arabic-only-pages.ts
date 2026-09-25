/**
 * What an English address says where the page is in Arabic and not in English
 * (tickets 40 and 42).
 *
 * The English menu names every page the Arabic one does, and an English reader
 * may arrive at any of their addresses from anywhere. Answering «not found»
 * about a page that exists would be untrue, and showing the Arabic in its
 * place is what the spec forbids — so the address says the page is not in
 * English and offers the Arabic (spec: user story 18). It is a notice, not a
 * page of the site: nothing indexes it and the sitemap does not list it.
 *
 * **Two kinds, and only one of them goes away.**
 *
 * - **The marketing pages** have English written for them (ticket 42), which
 *   reaches visitors when the founder publishes it. Each has an English route
 *   of its own under `src/app/(en)/en/`, which draws the page once it is
 *   published in English and this notice until then — so publishing, or
 *   unpublishing, the English is all it takes, and a page whose English is
 *   taken back is untranslated again rather than published badly.
 * - **The three legal documents** never leave: the Arabic is the binding text
 *   and is never translated (spec: Out of Scope), and their English address
 *   says so, from `src/app/(en)/en/[page]/page.tsx`.
 *
 * The words are in the code, for the reason `language-switcher.tsx` gives its
 * own: they say where a page is and is not, not anything about Rabaed, and
 * they must exist before the English site's words are in the CMS at all.
 *
 * Which pages there are, their addresses and their names are the page
 * registry's (ticket 92, `src/lib/page-registry.ts`).
 */
import { MARKETING_PAGES, MARKETING_PAGE_KEYS, SITE_PAGES, type MarketingPage } from '@/lib/page-registry';

export type ArabicOnlyPage = {
  /** The page's locale-independent path, which is also its Arabic address. */
  readonly path: string;
  /** The page's name, above the notice. */
  readonly eyebrow: string;
  readonly notice: string;
  /** The button to the Arabic. */
  readonly linkLabel: string;
};

const NOT_YET = {
  notice: 'This page is not available in English yet.',
  linkLabel: 'Read it in Arabic',
} as const;

const NEVER = {
  notice: 'This document is published in Arabic only, and the Arabic text is the binding version.',
  linkLabel: 'Read it in Arabic',
} as const;

/**
 * The marketing pages other than the home page, by their key in the registry,
 * which is also the last segment of their English address: `/en/product` is
 * `product`. Each is headed by its English name. The home page's English
 * address says the English site is on its way instead (`src/app/(en)/en/page.tsx`).
 */
export const NOT_YET_IN_ENGLISH = Object.fromEntries(
  MARKETING_PAGE_KEYS.filter((page) => page !== 'home').map((page) => [
    page,
    { path: MARKETING_PAGES[page].path, eyebrow: MARKETING_PAGES[page].name.en, ...NOT_YET },
  ]),
) as Readonly<Record<Exclude<MarketingPage, 'home'>, ArabicOnlyPage>>;

/**
 * The legal documents, keyed as above: never in English. Headed by how an
 * English reader would name each, which is not the Arabic document's title.
 */
export const ARABIC_ONLY_PAGES: Record<string, ArabicOnlyPage> = {
  terms: { path: SITE_PAGES.terms.path, eyebrow: 'Terms and Conditions', ...NEVER },
  privacy: { path: SITE_PAGES.privacy.path, eyebrow: 'Privacy Policy', ...NEVER },
  'referral-terms': { path: SITE_PAGES['referral-terms'].path, eyebrow: 'Referral Program Terms', ...NEVER },
};

/** The legal document an English address names, if it is one. */
export function arabicOnlyPage(segment: string): ArabicOnlyPage | null {
  return Object.hasOwn(ARABIC_ONLY_PAGES, segment) ? ARABIC_ONLY_PAGES[segment] : null;
}
