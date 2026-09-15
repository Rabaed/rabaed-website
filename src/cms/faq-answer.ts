/**
 * An answer as an Editor writes it in the CMS, and as a page draws it.
 *
 * Plain text, with two marks the page needs and a textarea cannot show:
 *
 * - **A Latin name between backticks** — `` `concrete_db.json` `` — is set left
 *   to right in DM Mono, so its dots and underscores stay where they belong
 *   (`latin-names.ts`).
 * - **A Referral Program value in braces** — `{payout}`, `{clientDiscount}` —
 *   is inserted from the one place the site holds it, rather than typed
 *   (spec: Content model), so an answer cannot quote an old amount
 *   (`referral-program-values.ts`).
 *
 * What a page draws is `answerText`; the plain text of it, which is what ticket
 * 32's FAQ structured data is to be built from, is `plainText` of the same
 * result — never the answer as stored, whose marks a visitor never reads.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { InlineText } from '../components/inline-text';
import { latinNameProblem, withLatinNames } from './latin-names';
import { valueNameProblem, withValues, type ReferralProgramValues } from './referral-program-values';

/** Why an answer cannot be saved as written, in Arabic for the Editor — or `null` when it can. */
export function answerProblem(answer: string): string | null {
  return (latinNameProblem(answer) ?? valueNameProblem(answer))?.ar ?? null;
}

/** The answer as the page draws it: values inserted, Latin names marked out. */
export function answerText(answer: string, values: ReferralProgramValues): InlineText {
  return withLatinNames(withValues(answer, values));
}
