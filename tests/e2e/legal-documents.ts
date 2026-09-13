import type { PagePair } from './reference-site';

/**
 * The three legal pages, each beside the Reference page it reproduces and the
 * approved Word document its text comes from — shared by the specs that check
 * their words, their behaviour and their layout.
 */
export type LegalPage = PagePair & {
  /** The page's heading. */
  readonly title: string;
  /** The approved document in `reference/legal-source/`, where there is one. */
  readonly word: string | null;
};

export const LEGAL_PAGES: readonly LegalPage[] = [
  { rebuilt: '/terms', reference: 'terms.html', title: 'شروط الخدمة', word: 'V.0.0_AR_Terms_of_Service.docx' },
  { rebuilt: '/privacy', reference: 'privacy.html', title: 'سياسة الخصوصية', word: 'V.0.0_AR_privacy_policy.docx' },
  // The Referral Program Terms have no Word document in `reference/legal-source/`:
  // the Reference page is their only source.
  { rebuilt: '/referral-terms', reference: 'referral-terms.html', title: 'الشروط والأحكام — برنامج الإحالة', word: null },
];
