/**
 * The Referral Program values — what a referrer is paid for each project, and
 * the discount the client they bring receives — as the site writes them, and
 * as an Editor names them in the words that quote them (ticket 56).
 *
 * They are held once, in the CMS (`globals/referral-program.ts`). Page words
 * and FAQ answers never type an amount: they name it in braces, `{payout}` or
 * `{clientDiscount}`, and the site inserts the value (spec: Content model), so
 * changing a value changes every mention.
 *
 * **The Referral Terms are not built from these.** They keep their own
 * verbatim, versioned text, which states the same amounts in the lawyer's
 * words; the admin warns while the published terms do not state the current
 * values (ADR-0008, `components/referral-terms-warning.tsx`).
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { Words } from './page-fields';

/** The values as the CMS stores them. */
export type ReferralProgramAmounts = {
  /** Paid to the referrer for each project that starts, in Saudi riyals, net. */
  readonly payoutRiyals: number;
  /** Off the referred client's project subscription. */
  readonly clientDiscountPercent: number;
};

/** The names an Editor writes a value by. */
export const VALUE_NAMES = ['payout', 'clientDiscount'] as const;

export type ValueName = (typeof VALUE_NAMES)[number];

/** The values as the page writes them: «2,000» and «10%», with Latin numerals. */
export type ReferralProgramValues = Readonly<Record<ValueName, string>>;

/** What each name stands for, for the Editor. */
export const VALUE_MEANINGS: Readonly<Record<ValueName, Words>> = {
  payout: { ar: 'مبلغ الإحالة عن كل مشروع', en: 'the referral payout for each project' },
  clientDiscount: { ar: 'خصم العميل المُحال', en: 'the referred client’s discount' },
};

/** The values a stored entry holds, or `null` when it does not hold both: an entry never saved, a database not migrated. */
export function amountsOf(
  entry: { readonly payoutRiyals?: number | null; readonly clientDiscountPercent?: number | null } | null | undefined,
): ReferralProgramAmounts | null {
  const { payoutRiyals, clientDiscountPercent } = entry ?? {};
  return typeof payoutRiyals === 'number' && typeof clientDiscountPercent === 'number' ? { payoutRiyals, clientDiscountPercent } : null;
}

export function formatValues(amounts: ReferralProgramAmounts): ReferralProgramValues {
  return {
    payout: new Intl.NumberFormat('en-US').format(amounts.payoutRiyals),
    clientDiscount: `${amounts.clientDiscountPercent}%`,
  };
}

/** A value named in braces, `{payout}`. */
const VALUE_TOKEN = /\{([^{}]*)\}/g;

function isValueName(name: string): name is ValueName {
  return (VALUE_NAMES as readonly string[]).includes(name);
}

/** Why a text names a value the site does not hold, for the Editor — or `null` when every name is one it holds. */
export function valueNameProblem(text: string): Words | null {
  for (const [, name] of text.matchAll(VALUE_TOKEN)) {
    if (isValueName(name)) continue;
    const known = (language: keyof Words, separator: string) =>
      VALUE_NAMES.map((each) => `{${each}} ${VALUE_MEANINGS[each][language]}`).join(separator);
    return {
      ar: `«{${name}}» ليست قيمة يعرفها الموقع. القيم المتاحة: ${known('ar', '، ')}.`,
      en: `{${name}} is not a value the site holds. The values are ${known('en', ', ')}.`,
    };
  }
  return null;
}

/** The text with each value it names inserted. */
export function withValues(text: string, values: ReferralProgramValues): string {
  return text.replace(VALUE_TOKEN, (token, name: string) => (isValueName(name) ? values[name] : token));
}

/**
 * Figures as one way of writing them: Latin digits for Arabic-Indic ones, no
 * thousands separators, and «%» for «٪» — so «٢٬٠٠٠» and «2,000» are one
 * amount.
 */
function normalisedFigures(text: string): string {
  return text
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/(?<=\d)[,٬](?=\d{3})/g, '')
    .replace(/٪/g, '%');
}

/**
 * The values a text of the Referral Terms does not state: the payout as its
 * amount, a figure of its own rather than part of a longer one, and the
 * discount as its percentage. However the terms write their figures
 * (`normalisedFigures`); an amount written out in words is not recognised.
 */
export function valuesNotStated(termsText: string, amounts: ReferralProgramAmounts): ValueName[] {
  const text = normalisedFigures(termsText);
  const figure = (value: number) => `(?<!\\d)(?<!\\d\\.)${value}`;
  const states: Record<ValueName, boolean> = {
    payout: new RegExp(`${figure(amounts.payoutRiyals)}(?!\\d|\\.\\d)`).test(text),
    clientDiscount: new RegExp(`${figure(amounts.clientDiscountPercent)}\\s*%`).test(text),
  };
  return VALUE_NAMES.filter((name) => !states[name]);
}
