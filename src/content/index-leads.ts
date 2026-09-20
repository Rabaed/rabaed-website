import { pageEntry, wordsIn } from '@/cms/pages';
import type { Locale } from '@/lib/locales';

/**
 * The line under the heading on the blog's index and the case studies' index,
 * in `locale` (ticket 59) — or a refusal, where that language's line is not
 * published. It is also each index's description in search results
 * (`blog-index.tsx`, `case-studies-index.tsx`).
 */
export async function getIndexLead(locale: Locale, index: 'blog' | 'caseStudies'): Promise<string> {
  const entry = await pageEntry('index-leads', locale);
  return wordsIn(locale, entry[index].lead);
}
