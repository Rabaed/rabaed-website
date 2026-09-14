/**
 * The pages that carry questions, and where on each the questions stand
 * (ticket 22).
 *
 * The questions live in the CMS; what lives here is what an Editor cannot
 * change: which pages have a Questions section, and the id it is linked to by.
 * Imported by the CMS configuration as well as the site, so it imports nothing.
 */
export const FAQ_PAGE_KEYS = ['home', 'start', 'tool', 'referral', 'partnership'] as const;

export type FaqPageKey = (typeof FAQ_PAGE_KEYS)[number];

export type FaqPage = {
  /** The page's path in the Arabic locale. */
  readonly path: string;
  /**
   * The Questions section's id. The home page's is the Reference site's `fq`;
   * the start page's `faq` is where the home page's «كل الأسئلة» lands.
   */
  readonly sectionId: string;
  readonly label: { readonly ar: string; readonly en: string };
};

export const FAQ_PAGES: Readonly<Record<FaqPageKey, FaqPage>> = {
  home: { path: '/', sectionId: 'fq', label: { ar: 'الصفحة الرئيسية', en: 'Home page' } },
  start: { path: '/start', sectionId: 'faq', label: { ar: 'صفحة ابدأ', en: 'Start page' } },
  tool: { path: '/tool', sectionId: 'faq', label: { ar: 'صفحة الأداة المجانية', en: 'Tool page' } },
  referral: { path: '/referral', sectionId: 'faq', label: { ar: 'صفحة برنامج الإحالة', en: 'Referral Program page' } },
  partnership: {
    path: '/partnership',
    sectionId: 'faq',
    label: { ar: 'صفحة برنامج الشراكات', en: 'Partnership Program page' },
  },
};
