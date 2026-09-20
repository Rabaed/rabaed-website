import { sectionTab, sharingImageField, wordsField, type Words } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * How each page appears in a search result and when its link is shared
 * (ticket 26): its title, the line under it, and the picture the card draws.
 *
 * **One entry for every page, rather than these fields on each page's own
 * entry.** A page's entry is seeded by a data migration that writes through
 * Payload, and such a migration selects every column the schema declares
 * *today* — so adding a field to `home_page` makes `import_home_page` fail on
 * any database built from scratch, with `column … does not exist`, while
 * production carries on because it migrated before the column existed. Ticket
 * 33 hit that on site settings and went round it; this went round it too,
 * with the founder's agreement on 20 September 2026. Ticket 63 is the fix
 * itself, and after it these fields could move onto the pages they describe.
 *
 * Arabic alone, as the six pages it covers are. The blog's and the case
 * studies' own lines are `index-leads`, which is published in both languages;
 * their titles stay in code until ticket 42 writes the English site.
 */

/**
 * A title in a search result is cut off after about sixty characters, and a
 * description after about a hundred and sixty. Both are held a little above
 * that: the words past the cut still count when a search engine decides what
 * the page is about, and the whole line is what an AI assistant quotes
 * (`/llms.txt`). Each field says so where an Editor types it, since Payload
 * draws no counter of its own.
 *
 * Neither may be left empty — the founder chose on 20 September 2026 that the
 * CMS refuses an empty one rather than generating something to fill it: a
 * generated description is a guess, and two of them are the same guess, which
 * a search engine reads as two copies of one page.
 */
const TITLE = 70;
const DESCRIPTION = 180;

/** One page's three search settings, as a tab of the entry. */
function pageTab(options: { readonly name: string; readonly label: Words; readonly description: Words; readonly values?: boolean }) {
  const { name, label, description, values = false } = options;
  return sectionTab({
    name,
    label,
    hideable: false,
    description,
    fields: [
      wordsField('title', { ar: 'العنوان في نتائج البحث', en: 'Title in search results' }, TITLE, {
        values,
        description: {
          ar: 'يُقرأ وحده في صفحة نتائج، بعيداً عن الصفحة: اذكر ما فيها، لا ترحيباً. تعرض نتيجة البحث نحو ٦٠ حرفاً ثم تقطع الباقي، والحد هنا ٧٠.',
          en: 'Read on its own in a results page, away from the page itself: say what is on it, not hello. A result shows about 60 characters and cuts the rest; the limit here is 70.',
        },
      }),
      wordsField('description', { ar: 'الوصف في نتائج البحث', en: 'Description in search results' }, DESCRIPTION, {
        multiline: true,
        values,
        description: {
          ar: 'جملة أو جملتان تصفان الصفحة. تظهر تحت العنوان، وهي أيضاً ما تقتبسه المساعدات الذكية من ملف ‎/llms.txt. تعرض نتيجة البحث نحو ١٦٠ حرفاً ثم تقطع الباقي، والحد هنا ١٨٠: ما بعد القطع يُقرأ ولا يُعرض.',
          en: 'A sentence or two describing the page. It shows under the title, and it is what an AI assistant quotes from /llms.txt. A result shows about 160 characters and cuts the rest; the limit here is 180, and what follows the cut is read but not shown.',
        },
      }),
      sharingImageField(),
    ],
  });
}

/**
 * The pages this entry covers, in the order an Editor meets them. One list:
 * the tabs are built from it, and `src/content/search-settings.ts` takes the
 * names a page may ask for from it, so neither can name a page the other
 * does not.
 */
export const SEARCH_PAGES = ['home', 'product', 'start', 'tool', 'referral', 'partnership'] as const;

export const SearchSettings = pageGlobal({
  slug: 'search-settings',
  label: { ar: 'الظهور في البحث والمشاركة', en: 'Search and sharing' },
  path: '/',
  group: null,
  sections: [
    pageTab({
      name: 'home',
      label: { ar: 'الرئيسية', en: 'Home' },
      description: { ar: 'الصفحة الرئيسية.', en: 'The home page.' },
    }),
    pageTab({
      name: 'product',
      label: { ar: 'المنتج', en: 'Product' },
      description: { ar: 'صفحة المنتج.', en: 'The product page.' },
    }),
    pageTab({
      name: 'start',
      label: { ar: 'ابدأ', en: 'Start' },
      description: { ar: 'صفحة ابدأ.', en: 'The start page.' },
    }),
    pageTab({
      name: 'tool',
      label: { ar: 'متتبّع الصبّات', en: 'Pour tracker' },
      description: { ar: 'صفحة الأداة المجانية.', en: 'The free tool’s page.' },
    }),
    pageTab({
      name: 'referral',
      label: { ar: 'برنامج الإحالة', en: 'Referral programme' },
      description: {
        ar: 'صفحة برنامج الإحالة. اكتب {payout} أو {clientDiscount} ليُدرج المبلغ الحالي بدل كتابته رقماً.',
        en: 'The referral programme’s page. Write {payout} or {clientDiscount} to insert the current amount rather than typing the number.',
      },
      values: true,
    }),
    pageTab({
      name: 'partnership',
      label: { ar: 'برنامج الشراكات', en: 'Partnership programme' },
      description: { ar: 'صفحة برنامج الشراكات.', en: 'The partnership programme’s page.' },
    }),
  ],
});
