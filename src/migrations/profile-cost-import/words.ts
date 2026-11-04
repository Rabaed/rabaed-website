/**
 * Where the Company profile's Delay-cost calculator button goes as the page is
 * first given it (ticket 106): the home page's demo request form, in each
 * language, since the profile has none — as its hero's demo button does
 * (`../profile-page-import/words.ts`). Its words are the calculator's shared
 * entry's, Ahmed's «احجز عرضاً لترى كيف نمنعه» (`../delay-calculator-import/words.ts`).
 *
 * **Frozen.** This is data for the migration that writes it, and the site never
 * reads it: an Editor changes the link in the CMS.
 */
export const PROFILE_COST_WORDS = {
  callToActionLink: { ar: '/#demo', en: '/en#demo' },
} as const;
