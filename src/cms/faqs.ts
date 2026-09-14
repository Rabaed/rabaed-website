/**
 * A page's questions as the page shows them: the published ones, in the order
 * an Editor dragged them into, leaving out any hidden — or, while an Editor is
 * previewing, the latest saved of each instead (ticket 22).
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import type { FaqEntry } from '@/components/faq';
import type { Locale } from '@/lib/locales';
import { answerText } from './faq-answer';
import type { FaqPageKey } from './faq-pages';

/** Once per request, per page and locale. */
export const pageQuestions = cache(async (page: FaqPageKey, locale: Locale): Promise<FaqEntry[]> => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'faq-entries',
    where: {
      and: [
        { page: { equals: page } },
        { locale: { equals: locale } },
        ...(previewing ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    draft: previewing,
    sort: '_order',
    depth: 0,
    pagination: false,
  });

  // Filtered here rather than in the query, so that a question hidden in a
  // draft is hidden in the preview of that draft.
  return docs
    .filter((entry) => entry.shows !== false)
    .map((entry) => ({ question: entry.question, answer: answerText(entry.answer) }));
});
