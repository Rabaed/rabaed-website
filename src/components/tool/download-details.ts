/**
 * What the Pour Tracker download form requires, what counts as a valid answer,
 * and what a visitor is told when an answer is not.
 *
 * The rules are the Reference site's own (`reference/site/tool.html`), which
 * ticket 14 takes as the model: two letters for each name, six to fifteen
 * digits for the phone, and an address with a dot and at least two letters
 * after the @. The company is optional and is not here.
 *
 * Kept apart from the form so that ticket 30 checks a submission against the
 * same rules on the server, rather than trusting the browser.
 */

export const REQUIRED_DETAILS = ['firstName', 'lastName', 'phone', 'email'] as const;

export type RequiredDetail = (typeof REQUIRED_DETAILS)[number];

const RULES: Record<RequiredDetail, (value: string) => boolean> = {
  firstName: (value) => value.trim().length >= 2,
  lastName: (value) => value.trim().length >= 2,
  // Spaces, dashes and brackets are allowed; only the digits are counted.
  phone: (value) => {
    const digits = value.replace(/[^0-9]/g, '');
    return digits.length >= 6 && digits.length <= 15;
  },
  email: (value) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value.trim()),
};

export function isValidDetail(detail: RequiredDetail, value: string): boolean {
  return RULES[detail](value);
}

/** Verbatim from the Reference site. */
export const DETAIL_ERRORS: Record<RequiredDetail, string> = {
  firstName: 'اكتب الاسم الأول (حرفان على الأقل)',
  lastName: 'اكتب اسم العائلة (حرفان على الأقل)',
  phone: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)',
  email: 'اكتب بريداً إلكترونياً صحيحاً',
};
