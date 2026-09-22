import { sectionTab, wordsField } from '../page-fields';
import { pageGlobal } from '../page-globals';

/**
 * The line under the heading on the blog's index and the case studies' index
 * (ticket 59). It is also each index's description in search results, so it
 * says what the section is rather than greeting the reader.
 *
 * Separate from the words every page shares because these two exist in English
 * as well: the blog and the case studies are published in both languages
 * (tickets 23 and 24), while the header and footer
 * are Arabic until the founder publishes their English (ticket 40).
 * A page is published in a language only with all of its words in it
 * (`page-fields.ts`), so the two cannot live in one entry.
 *
 * The rest of each index's words — its eyebrow, its heading, the labels on its
 * pagination — stay in `src/content/blog.ts` and `src/content/case-studies.ts`:
 * this ticket names the lead line alone.
 */

/**
 * 180 characters: the longest of the two lines today is 171, and a search
 * result shows about 160 before it cuts the rest off, so a line much longer
 * than this is written for a reader who never sees its end.
 */
const LEAD = 180;

export const IndexLeads = pageGlobal({
  slug: 'index-leads',
  label: { ar: 'سطر المدونة وقصص العملاء', en: 'Blog and case studies lead' },
  path: '/blog',
  group: null,
  sections: [
    sectionTab({
      name: 'blog',
      label: { ar: 'المدونة', en: 'Blog' },
      hideable: false,
      description: {
        ar: 'السطر تحت عنوان المدونة، وهو وصفها في نتائج البحث.',
        en: 'The line under the blog’s heading, and its description in search results.',
      },
      fields: [wordsField('lead', { ar: 'السطر', en: 'Line' }, LEAD, { multiline: true })],
    }),
    sectionTab({
      name: 'caseStudies',
      label: { ar: 'قصص العملاء', en: 'Case studies' },
      hideable: false,
      description: {
        ar: 'السطر تحت عنوان قصص العملاء، وهو وصفها في نتائج البحث.',
        en: 'The line under the case studies’ heading, and their description in search results.',
      },
      fields: [wordsField('lead', { ar: 'السطر', en: 'Line' }, LEAD, { multiline: true })],
    }),
  ],
});
