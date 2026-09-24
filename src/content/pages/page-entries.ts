import type { PageSlug } from '@/cms/pages';

/**
 * The CMS entries each marketing page reads (ticket 91): its own, and those it
 * shares with other pages. Written once, here; everything else that has to
 * know reads it from here — whether a page is published in a language
 * (`languages.ts`), the tests that publish a page's English
 * (`tests/e2e/english-pages.spec.ts`), and the table in `docs/deployment.md`
 * that tells the founder what to publish, which `tests/unit/page-entries.spec.ts`
 * holds to this.
 *
 * **Why it decides a page's languages.** A page is published in a language
 * only when every entry it reads is: an English page with its closing section
 * in Arabic, or with no header, is a page half in English, which is never
 * shown (spec: Content model; ticket 42). So these, and nothing else, are
 * what `languages.ts` asks. A page's questions and its form's words are not
 * among them: an English page shows the English questions that are published,
 * and a form's words are in an entry of its own for each language
 * (`src/forms/settings.ts`), which never refuses one.
 *
 * **Held to each page's module.** A page's module in this folder reads these
 * entries. An entry read there and missing here would let a page be called
 * English while a part of it is not — its English address would then fail
 * rather than show a notice — and `english-pages.spec.ts`, which publishes
 * each page's English by this list alone, fails with it.
 *
 * Imported by the tests as well as by the site, so it imports nothing but types.
 */
export const PAGE_ENTRIES = {
  home: { own: 'home-page', shared: ['closing-section', 'screen-mocks', 'trust-strip', 'site-words'] },
  product: { own: 'product-page', shared: ['closing-section', 'screen-mocks', 'trust-strip', 'site-words'] },
  start: { own: 'start-page', shared: ['trust-strip', 'site-words'] },
  tool: { own: 'tool-page', shared: ['site-words'] },
  referral: { own: 'referral-page', shared: ['site-words'] },
  partnership: { own: 'partnership-page', shared: ['site-words'] },
} as const satisfies Record<string, { readonly own: PageSlug; readonly shared: readonly PageSlug[] }>;

/** A marketing page, by the name its module and its entry go by: `product`. */
export type MarketingPage = keyof typeof PAGE_ENTRIES;

export const MARKETING_PAGES = Object.keys(PAGE_ENTRIES) as MarketingPage[];

/** Every entry the page reads, its own first. */
export function entriesRead(page: MarketingPage): readonly PageSlug[] {
  return [PAGE_ENTRIES[page].own, ...PAGE_ENTRIES[page].shared];
}
