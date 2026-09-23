/**
 * The Footer directory as the founder decided it on 23 September 2026
 * (ticket 75, ADR-0020): four columns through which every page of the site
 * can be reached, including the pages the header has no room for.
 *
 * **Frozen.** This is what the migration wrote on the day it ran, and the site
 * does not read it: it reads the CMS, where an Editor may have changed any of
 * it since. A word here is changed only to correct what this migration wrote,
 * never to change what the site says.
 *
 * The link words are what the site already calls each page: the header's own
 * for the pages it names, the page's own name for the rest. The column
 * headings are proposals the founder approves in the preview. The English is
 * a draft of the same kind as the rest of the English site words (ticket 40):
 * it reaches a visitor only once the founder publishes the entry in English.
 *
 * The three legal documents are in Arabic alone (`src/content/arabic-only-pages.ts`),
 * and an English page's links lead straight to the Arabic, so their English
 * says so. The founder chose that over leading to the notice that says the
 * page is Arabic only: one tap fewer, and the label is honest.
 */

export type SeededWords = { readonly ar: string; readonly en: string };
export type SeededLink = { readonly label: SeededWords; readonly path: string };
export type SeededColumn = { readonly heading: SeededWords; readonly links: readonly SeededLink[] };

export const FOOTER_DIRECTORY = {
  rabaed: {
    heading: { ar: 'ربائد', en: 'Rabaed' },
    links: [
      { label: { ar: 'الرئيسية', en: 'Home' }, path: '/' },
      { label: { ar: 'المنتج', en: 'Product' }, path: '/product' },
      { label: { ar: 'ابدأ', en: 'Get started' }, path: '/start' },
      { label: { ar: 'متتبّع الصبّات', en: 'Pour Tracker' }, path: '/tool' },
    ],
  },
  programmes: {
    heading: { ar: 'البرامج', en: 'Programs' },
    links: [
      { label: { ar: 'برنامج الإحالة', en: 'Referral Program' }, path: '/referral' },
      { label: { ar: 'برنامج الشراكات', en: 'Partnership Program' }, path: '/partnership' },
    ],
  },
  resources: {
    heading: { ar: 'المصادر', en: 'Resources' },
    links: [
      { label: { ar: 'المدونة', en: 'Blog' }, path: '/blog' },
      { label: { ar: 'قصص العملاء', en: 'Customer stories' }, path: '/case-studies' },
    ],
  },
  /**
   * The column the footer's two links move into. The two rows already in the
   * CMS are moved as they are, whatever an Editor has made of them; these are
   * what the directory adds to them, and what their English becomes where it
   * is still the word ticket 40 proposed.
   */
  legal: {
    heading: { ar: 'قانوني', en: 'Legal' },
    links: [
      { label: { ar: 'الشروط والأحكام', en: 'Terms and conditions (Arabic)' }, path: '/terms' },
      { label: { ar: 'سياسة الخصوصية', en: 'Privacy policy (Arabic)' }, path: '/privacy' },
      { label: { ar: 'شروط برنامج الإحالة', en: 'Referral Terms (Arabic)' }, path: '/referral-terms' },
    ],
  },
} as const satisfies Record<string, SeededColumn>;
