/**
 * An answer as an Editor writes it in the CMS, and as a page draws it.
 *
 * Plain text, with two marks the page needs and a textarea cannot show:
 *
 * - **A Latin name between backticks** — `` `concrete_db.json` `` — is set left
 *   to right in DM Mono, so its dots and underscores stay where they belong.
 * - **A Referral Program value in braces** — `{payout}`, `{clientDiscount}` —
 *   is inserted from the one place the site holds it, rather than typed
 *   (spec: Content model), so an answer cannot quote an old amount.
 *
 * The visible answer and the text ticket 32's FAQ structured data is built
 * from both come from `answerText`, so the two cannot drift apart.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { InlinePart, InlineText } from '../components/inline-text';
import { REFERRAL_PROGRAM_VALUES } from '../content/referral-program';

/** The values an answer may name, and what each stands for, for the Editor. */
export const ANSWER_VALUES = {
  payout: { value: REFERRAL_PROGRAM_VALUES.payout, meaning: 'مبلغ الإحالة عن كل مشروع' },
  clientDiscount: { value: REFERRAL_PROGRAM_VALUES.clientDiscount, meaning: 'خصم العميل المُحال' },
} as const;

type ValueName = keyof typeof ANSWER_VALUES;

const VALUE = /\{([^{}]*)\}/g;

function isValueName(name: string): name is ValueName {
  return Object.hasOwn(ANSWER_VALUES, name);
}

/** Why an answer cannot be saved as written, in Arabic for the Editor — or `null` when it can. */
export function answerProblem(answer: string): string | null {
  if ((answer.match(/`/g) ?? []).length % 2 === 1) {
    return 'علامة ` بلا إغلاق. ضع الاسم الإنجليزي بين علامتين، مثل `concrete_db.json`.';
  }
  for (const [, name] of answer.matchAll(VALUE)) {
    if (!isValueName(name)) {
      const known = Object.entries(ANSWER_VALUES)
        .map(([each, { meaning }]) => `{${each}} ${meaning}`)
        .join('، ');
      return `«{${name}}» ليست قيمة يعرفها الموقع. القيم المتاحة: ${known}.`;
    }
  }
  return null;
}

/** The answer as the page draws it: values inserted, Latin names marked out. */
export function answerText(answer: string): InlineText {
  const filled = answer.replace(VALUE, (token, name: string) => (isValueName(name) ? ANSWER_VALUES[name].value : token));
  if (!filled.includes('`')) return filled;

  // Between backticks is every second piece.
  const parts: InlinePart[] = filled
    .split('`')
    .map((piece, index) => (index % 2 === 1 ? { latin: piece } : piece))
    .filter((part) => part !== '');
  return parts;
}
