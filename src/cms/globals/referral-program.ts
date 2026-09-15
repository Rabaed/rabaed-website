import type { GlobalConfig, NumberFieldSingleValidation } from 'payload';
import { signedIn } from '../access';
import { inAdminLanguage, type Words } from '../page-fields';
import { refreshSiteWhenPublished } from '../revalidation';

/** A whole number from `min` to `max`, or `message`: the page writes neither a fraction nor an amount of nothing. */
function wholeNumber(min: number, max: number, message: Words): NumberFieldSingleValidation {
  return (value, { req }) =>
    typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max ? true : inAdminLanguage(req, message);
}

/**
 * The Referral Program values (ticket 56): the payout and the client discount,
 * held once. Every mention on the site inserts them — the referral page, its
 * search title and the FAQ answers that name them (`referral-program-values.ts`)
 * — so a change here, once published, changes every one.
 *
 * The Referral Terms state the same amounts in their own words, and are never
 * rewritten from these. While the published terms do not state the published
 * values, the admin warns here, on the Referral Terms and on the dashboard,
 * without stopping anyone publishing (ADR-0008).
 */
export const ReferralProgram: GlobalConfig = {
  slug: 'referral-program',
  label: { ar: 'قيم برنامج الإحالة', en: 'Referral Program values' },
  access: {
    read: signedIn,
    readVersions: signedIn,
    update: signedIn,
  },
  versions: {
    drafts: true,
    max: 100,
  },
  admin: {
    // The page that quotes them most, its questions included.
    preview: () => `/api/preview?path=${encodeURIComponent('/referral')}`,
  },
  hooks: {
    afterChange: [refreshSiteWhenPublished],
  },
  fields: [
    {
      name: 'termsWarning',
      type: 'ui',
      admin: { components: { Field: '/cms/components/referral-terms-warning#ReferralTermsWarning' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'payoutRiyals',
          type: 'number',
          required: true,
          label: { ar: 'مبلغ الإحالة عن كل مشروع، بالريال', en: 'Referral payout for each project, in riyals' },
          admin: {
            step: 100,
            description: {
              ar: 'صافياً، بلا فواصل: 2000. تكتبه الصفحة «2,000»، وتكتبه النصوص حيث تذكر {payout}.',
              en: 'Net, with no separators: 2000. The page writes it «2,000», wherever words name {payout}.',
            },
          },
          validate: wholeNumber(1, 1_000_000, {
            ar: 'اكتب المبلغ رقماً صحيحاً بالريال، من 1 إلى 1,000,000.',
            en: 'Write the payout as a whole number of riyals, from 1 to 1,000,000.',
          }),
        },
        {
          name: 'clientDiscountPercent',
          type: 'number',
          required: true,
          label: { ar: 'خصم العميل المُحال، بالنسبة المئوية', en: 'Referred client’s discount, in percent' },
          admin: {
            description: {
              ar: 'بلا علامة %: 10. تكتبه الصفحة «10%»، حيث تذكر النصوص {clientDiscount}.',
              en: 'With no % sign: 10. The page writes it «10%», wherever words name {clientDiscount}.',
            },
          },
          validate: wholeNumber(1, 100, {
            ar: 'اكتب الخصم نسبة مئوية صحيحة، من 1 إلى 100.',
            en: 'Write the discount as a whole percentage, from 1 to 100.',
          }),
        },
      ],
    },
  ],
};
