/**
 * The page registry (ticket 92): every page of the Marketing site, written out
 * once, by hand. Every other list of pages is read from here — the sitemap,
 * `llms.txt`, the pages the questions belong to, the English notices, each
 * page's entry in the CMS and the entries it shares, which files are rebuilt
 * when content is published — and `tests/unit/page-registry.spec.ts` fails
 * when a route of the site is neither listed here nor named here as not a
 * page.
 *
 * **Written out, not found.** Nothing reaches the sitemap or `llms.txt` by
 * existing as a route: a page is listed here, by name, or it is not a page of
 * the site. That is the sitemap's rule, and why the Screen mock studio, the
 * CMS admin and the English placeholder have never wandered into either.
 *
 * **Adding a page** is `docs/deployment.md`, «Adding a page».
 *
 * Imported by the CMS configuration and by the tests as well as by the site,
 * so it imports nothing but types.
 */
import type { GlobalSlug } from 'payload';

type Words = { readonly ar: string; readonly en: string };

/** A marketing page: one of the site's own pages, whose words are an entry of its own in the CMS. */
type MarketingPageSpec = {
  /** Its address in Arabic, which is also its path: `localePath` gives its English. */
  readonly path: string;
  /**
   * Its short name: a breadcrumb trail's step, `llms.txt`'s link, the heading
   * of its English notice. Not its search title, which is an Editor's.
   */
  readonly name: Words;
  /** Its own entry in the CMS, and that entry's name in the admin. */
  readonly entry: { readonly slug: GlobalSlug; readonly label: Words };
  /**
   * The entries it reads beside its own, which with its own decide whether it
   * is published in a language (ticket 91, `src/content/pages/languages.ts`).
   * A page is never shown half in English: every one of them has to be.
   */
  readonly shared: readonly GlobalSlug[];
  /** The id of its Questions section — which links land on — or `null` where it has none (ticket 22). */
  readonly questionsSection: string | null;
};

/**
 * The marketing pages, in the order the site's lists give them: the sitemap,
 * `llms.txt`, the questions' pages in the admin. The key is the name the
 * page's module and its CMS field names go by.
 */
export const MARKETING_PAGES = {
  home: {
    path: '/',
    name: { ar: 'الرئيسية', en: 'Home' },
    entry: { slug: 'home-page', label: { ar: 'الصفحة الرئيسية', en: 'Home page' } },
    shared: ['closing-section', 'screen-mocks', 'trust-strip', 'site-words'],
    // The Reference site's own id.
    questionsSection: 'fq',
  },
  product: {
    path: '/product',
    name: { ar: 'المنتج', en: 'Product' },
    entry: { slug: 'product-page', label: { ar: 'صفحة المنتج', en: 'Product page' } },
    shared: ['closing-section', 'screen-mocks', 'trust-strip', 'site-words'],
    questionsSection: null,
  },
  start: {
    path: '/start',
    name: { ar: 'ابدأ', en: 'Get started' },
    entry: { slug: 'start-page', label: { ar: 'صفحة ابدأ', en: 'Start page' } },
    shared: ['trust-strip', 'site-words'],
    // Where the home page's «كل الأسئلة» lands.
    questionsSection: 'faq',
  },
  tool: {
    path: '/tool',
    name: { ar: 'متتبّع الصبّات', en: 'Pour Tracker' },
    entry: { slug: 'tool-page', label: { ar: 'صفحة الأداة المجانية', en: 'Tool page' } },
    shared: ['site-words'],
    questionsSection: 'faq',
  },
  referral: {
    path: '/referral',
    name: { ar: 'برنامج الإحالة', en: 'Referral Program' },
    entry: { slug: 'referral-page', label: { ar: 'صفحة برنامج الإحالة', en: 'Referral Program page' } },
    shared: ['site-words'],
    questionsSection: 'faq',
  },
  partnership: {
    path: '/partnership',
    name: { ar: 'برنامج الشراكات', en: 'Partnership Program' },
    entry: { slug: 'partnership-page', label: { ar: 'صفحة برنامج الشراكات', en: 'Partnership Program page' } },
    shared: ['site-words'],
    questionsSection: 'faq',
  },
} as const satisfies Record<string, MarketingPageSpec>;

/** A marketing page, by its key: `product`. */
export type MarketingPage = keyof typeof MARKETING_PAGES;

export const MARKETING_PAGE_KEYS = Object.keys(MARKETING_PAGES) as MarketingPage[];

/** The entry of a marketing page's own, by slug: `product-page`. */
export type MarketingPageEntry = (typeof MARKETING_PAGES)[MarketingPage]['entry']['slug'];

/** An entry some marketing page reads beside its own: `closing-section`. */
export type SharedEntry = (typeof MARKETING_PAGES)[MarketingPage]['shared'][number];

/** Every entry the page reads, its own first. */
export function entriesRead(page: MarketingPage): readonly (MarketingPageEntry | SharedEntry)[] {
  return [MARKETING_PAGES[page].entry.slug, ...MARKETING_PAGES[page].shared];
}

/** A marketing page with a Questions section: the pages an Editor files a question under. */
export type QuestionsPage = {
  [Key in MarketingPage]: (typeof MARKETING_PAGES)[Key]['questionsSection'] extends string ? Key : never;
}[MarketingPage];

export const QUESTIONS_PAGE_KEYS = MARKETING_PAGE_KEYS.filter(
  (key): key is QuestionsPage => MARKETING_PAGES[key].questionsSection !== null,
);

/**
 * The site's other pages: the blog's and the case studies' indexes, each
 * `withArticles` — every article or story at an address beneath it — and the
 * legal documents. Their
 * words are collections and documents rather than an entry each.
 */
export const SITE_PAGES = {
  blog: { path: '/blog', withArticles: true },
  // A page only once a story is published in its language (ticket 24).
  'case-studies': { path: '/case-studies', withArticles: true },
  terms: { path: '/terms', withArticles: false },
  privacy: { path: '/privacy', withArticles: false },
  'referral-terms': { path: '/referral-terms', withArticles: false },
} as const satisfies Record<string, { readonly path: string; readonly withArticles: boolean }>;

/**
 * The files a crawler reads about the site rather than a page of it, each a
 * route of its own beside the layouts: the sitemap (ticket 31), `llms.txt`
 * (ticket 33) and `robots.txt`, which reads the training-crawler switch.
 * Built from content, so rebuilt when it is published (`src/cms/revalidation.ts`).
 */
export const DISCOVERY_FILES = ['/sitemap.xml', '/llms.txt', '/robots.txt'] as const;

/**
 * The page any address no page answers shows, which Next builds as a page of
 * its own at this address. Not in the sitemap, and in neither language's
 * layout; it shows words from the CMS (ticket 59).
 */
export const NOT_FOUND_ADDRESS = '/_not-found';

/**
 * The routes that are not pages of the site, each with why. Every route under
 * one of these addresses is left out of the sitemap and `llms.txt`. `cached`
 * says whether what it serves is built ahead of time and rebuilt by a publish,
 * as a page is, or not cached at all (`tests/unit/cached-page-age.spec.ts`).
 */
export const NOT_PAGES: readonly { readonly address: string; readonly cached: boolean; readonly reason: string }[] = [
  { address: '/maktab', cached: false, reason: 'the CMS admin, which only an Editor signs into' },
  {
    address: '/api',
    cached: false,
    reason: 'the CMS API, the preview switch, and the routes the forms send to and a document is fetched from',
  },
  {
    address: '/studio',
    cached: false,
    reason: 'the Screen mock studio, which each Screen mock is drawn in and exported from (ADR-0002)',
  },
  {
    address: '/en/[page]',
    cached: true,
    reason:
      'the English address of each legal document, which says the document is in Arabic alone and offers it (src/content/arabic-only-pages.ts)',
  },
];
