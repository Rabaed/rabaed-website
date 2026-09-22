/**
 * The pages that exist in Arabic and not in English, and what each one's
 * English address says instead (ticket 40).
 *
 * The English menu names every page the Arabic one does, and an English reader
 * may arrive at any of their addresses from anywhere. Answering «not found»
 * about a page that exists would be untrue, and showing the Arabic in its
 * place is what the spec forbids — so the address says the page is not in
 * English and offers the Arabic (spec: user story 18). It is a notice, not a
 * page of the site: nothing indexes it and the sitemap does not list it.
 *
 * **Two kinds, and only one of them goes away.** The five marketing pages
 * wait for ticket 42 to write their English, which takes each one out of this
 * table and gives it a page of its own under `src/app/(en)/en/`. The three
 * legal documents never leave: the Arabic is the binding text and is never
 * translated (spec: Out of Scope), and their English address says so.
 *
 * The words are in the code, for the reason `language-switcher.tsx` gives its
 * own: they say where a page is and is not, not anything about Rabaed, and
 * they must exist before the English site's words are in the CMS at all.
 */

type ArabicOnlyPage = {
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

/** Keyed by the address's last segment: `/en/product` is `product`. */
export const ARABIC_ONLY_PAGES: Record<string, ArabicOnlyPage> = {
  product: { path: '/product', eyebrow: 'Product', ...NOT_YET },
  start: { path: '/start', eyebrow: 'Get started', ...NOT_YET },
  tool: { path: '/tool', eyebrow: 'Pour Tracker', ...NOT_YET },
  referral: { path: '/referral', eyebrow: 'Referral Program', ...NOT_YET },
  partnership: { path: '/partnership', eyebrow: 'Partnership Program', ...NOT_YET },
  terms: { path: '/terms', eyebrow: 'Terms and Conditions', ...NEVER },
  privacy: { path: '/privacy', eyebrow: 'Privacy Policy', ...NEVER },
  'referral-terms': { path: '/referral-terms', eyebrow: 'Referral Program Terms', ...NEVER },
};

/** The page an English address names, if it is one of these. */
export function arabicOnlyPage(segment: string): ArabicOnlyPage | null {
  return Object.hasOwn(ARABIC_ONLY_PAGES, segment) ? ARABIC_ONLY_PAGES[segment] : null;
}
