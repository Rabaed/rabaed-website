/**
 * The answer-first rule, in one place (ticket 35).
 *
 * An answer engine quotes a paragraph, not a page. So the first paragraph
 * under a major heading has to be a **standalone answer of 30 to 60 words**,
 * understood without reading a word before it — the spec's rule (spec: SEO and
 * GEO), and `reference/HANDOFF.md` §6.4's, which names the sections it applies
 * to and adds that it is a change to the words and not to the design.
 *
 * Held here rather than beside each field, because it governs two unrelated
 * kinds of writing: a section's opening paragraph on the home and product
 * pages (`page-fields.ts`), and an article's or a case study's opening answer
 * (`editorial-fields.ts`). One rule, one message, one place to change both.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { Words } from './page-fields';

/** The range the spec asks for, inclusive at both ends. */
export const ANSWER_LENGTH = { fewest: 30, most: 60 } as const;

/**
 * How many words a text is. Counted between spaces, which is how both Arabic
 * and English separate them — so «ما هو ربائد؟» is three, not four.
 */
export function wordCount(written: string): number {
  return written.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Why a text is not a standalone answer, in both languages — or `null` when it
 * is. Only its length is checked: whether a paragraph stands on its own is a
 * judgement no validator can make, and the count is the part that can be.
 */
export function answerLengthProblem(written: string): Words | null {
  const words = wordCount(written);
  if (words >= ANSWER_LENGTH.fewest && words <= ANSWER_LENGTH.most) return null;
  return {
    ar: `اكتب جواباً مستقلاً من ${ANSWER_LENGTH.fewest} إلى ${ANSWER_LENGTH.most} كلمة، يُفهم دون قراءة ما قبله. عدد الكلمات الآن: ${words}.`,
    en: `Write a standalone answer of ${ANSWER_LENGTH.fewest} to ${ANSWER_LENGTH.most} words, understood without what comes before it. It has ${words}.`,
  };
}
