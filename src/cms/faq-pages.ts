/**
 * The pages that carry questions, and where on each the questions stand
 * (ticket 22).
 *
 * The questions live in the CMS; what lives here is what an Editor cannot
 * change: which pages have a Questions section, and the id it is linked to by.
 * Both are the page registry's (ticket 92, `src/lib/page-registry.ts`), and
 * this puts them in the shape the questions' collection and the pages ask for.
 * Imported by the CMS configuration as well as the site, so it imports
 * relatively, and nothing that reads the CMS.
 */
import { MARKETING_PAGES, QUESTIONS_PAGE_KEYS, type QuestionsPage } from '../lib/page-registry';

/** The pages an Editor files a question under, in the registry's order. */
export const FAQ_PAGE_KEYS = QUESTIONS_PAGE_KEYS;

export type FaqPageKey = QuestionsPage;

export type FaqPage = {
  /** The page's path in the Arabic locale. */
  readonly path: string;
  /**
   * The Questions section's id. The home page's is the Reference site's `fq`;
   * the start page's `faq` is where the home page's «كل الأسئلة» lands.
   */
  readonly sectionId: string;
  /** The page as the admin names it: its entry's name, which the questions' page list shows. */
  readonly label: { readonly ar: string; readonly en: string };
};

export const FAQ_PAGES = Object.fromEntries(
  QUESTIONS_PAGE_KEYS.map((key) => {
    const page = MARKETING_PAGES[key];
    return [key, { path: page.path, sectionId: page.questionsSection, label: page.entry.label }];
  }),
) as Readonly<Record<FaqPageKey, FaqPage>>;
