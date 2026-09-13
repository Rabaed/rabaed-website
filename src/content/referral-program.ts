/**
 * The Referral Program values — what a referrer is paid for each project, and
 * the discount the client they bring receives — held once (spec: Content
 * model). Every sentence on the referral page, its questions and its search
 * title that quotes one inserts it from here rather than typing the number,
 * so the page cannot disagree with itself. Ticket 21 moves these into a CMS
 * global.
 *
 * **The Referral Terms are not built from these.** They keep their own
 * verbatim, versioned text, which states the same amounts in the lawyer's
 * words (ADR-0008); changing a value here does not change what the terms say.
 */
const REFERRAL_PROGRAM = {
  /** Paid to the referrer for each project that starts, in Saudi riyals, net. */
  payoutRiyals: 2000,
  /** Off the referred client's project subscription. */
  clientDiscountPercent: 10,
} as const;

/** The values as the page writes them: «2,000» and «10%», with Latin numerals. */
export const REFERRAL_FIGURES = {
  payout: new Intl.NumberFormat('en-US').format(REFERRAL_PROGRAM.payoutRiyals),
  clientDiscount: `${REFERRAL_PROGRAM.clientDiscountPercent}%`,
} as const;
