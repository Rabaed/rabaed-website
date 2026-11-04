/**
 * The five comparisons of the Company profile's before-and-after section, in
 * the order of their tabs, which is fixed: each is one of Ahmed's videos
 * (ticket 108). The names are those of the profile's entry
 * (`src/cms/globals/profile-compare.ts`) and of the page
 * (`src/components/profile/compare.tsx`).
 */
export const COMPARISONS = ['approvals', 'documents', 'correspondence', 'dashboard', 'dailyReport'] as const;

export type Comparison = (typeof COMPARISONS)[number];
