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
import { referralProgramValues } from './referral-program';

/**
 * Once per request, per page and locale. The Referral Program values an
 * answer names are inserted as the page's are: the draft ones in a preview.
 */
export const pageQuestions = cache(async (page: FaqPageKey, locale: Locale): Promise<FaqEntry[]> => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const [{ docs }, values] = await Promise.all([
    payload.find({
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
    }),
    referralProgramValues(),
  ]);

  // Filtered here rather than in the query, so that a question hidden in a
  // draft is hidden in the preview of that draft.
  return docs
    .filter((entry) => entry.shows !== false)
    .map((entry) => ({ question: entry.question, answer: answerText(entry.answer, values) }));
});
