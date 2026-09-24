/**
 * How a page appears in a search result and when its link is shared
 * (ticket 26): its title, the line under it, and the picture the card draws —
 * a tab of the page's own entry, after its sections (ticket 91).
 *
 * **On each page's entry, not one entry for all six.** Ticket 26 put all six
 * pages' search settings on one entry of their own, to go round a trap ticket
 * 63 has since closed. One entry cost more than a second place to look: an
 * entry is published in English as a whole, so no page could be published in
 * English before every page's search title had its English. The founder chose
 * on 24 September 2026 to move them onto each page (ADR-0023), where they are
 * published with the page they describe.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { Tab } from 'payload';
import { sectionTab, sharingImageField, wordsField, type Words } from './page-fields';

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

const DESCRIBED: Words = {
  ar: 'كيف تظهر الصفحة في نتائج البحث، وحين يُشارك رابطها.',
  en: 'How the page appears in search results, and when its link is shared.',
};

/**
 * The page's search title, its description and its sharing picture, as the
 * last tab of its entry. `values` lets the words name a Referral Program
 * value in braces, `{payout}`, as the referral page's own words may.
 */
export function searchTab(options: { readonly values?: boolean } = {}): Tab {
  const { values = false } = options;
  return sectionTab({
    name: 'search',
    label: { ar: 'الظهور في البحث والمشاركة', en: 'Search and sharing' },
    hideable: false,
    description: values
      ? {
          ar: `${DESCRIBED.ar} اكتب {payout} أو {clientDiscount} ليُدرج المبلغ الحالي بدل كتابته رقماً.`,
          en: `${DESCRIBED.en} Write {payout} or {clientDiscount} to insert the current amount rather than typing the number.`,
        }
      : DESCRIBED,
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
