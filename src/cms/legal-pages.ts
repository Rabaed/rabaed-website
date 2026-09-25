/**
 * The three legal documents and the pages that show them (tickets 17 and 25).
 *
 * The documents' words live in the CMS; what lives here is what an Editor
 * cannot change: which documents exist, where each is on the site, and how its
 * clauses are linked to. Where each is on the site is the page registry's
 * (ticket 92, `src/lib/page-registry.ts`). Imported by the CMS configuration
 * as well as the site, so it imports relatively, and nothing that reads the CMS.
 */
import { SITE_PAGES } from '../lib/page-registry';

export const LEGAL_SLUGS = ['terms', 'privacy', 'referral-terms'] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalPage = {
  /** The page's path in the Arabic locale. */
  readonly path: string;
  /** Each clause is linked to as this and its number: `s3`, `r3`. Anything outside that points at a clause relies on it. */
  readonly clauseIdPrefix: string;
  readonly label: { readonly ar: string; readonly en: string };
};

export const LEGAL_PAGES: Readonly<Record<LegalSlug, LegalPage>> = {
  terms: { path: SITE_PAGES.terms.path, clauseIdPrefix: 's', label: { ar: 'شروط الخدمة', en: 'Terms of Service' } },
  privacy: { path: SITE_PAGES.privacy.path, clauseIdPrefix: 's', label: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' } },
  'referral-terms': {
    path: SITE_PAGES['referral-terms'].path,
    clauseIdPrefix: 'r',
    label: { ar: 'شروط برنامج الإحالة', en: 'Referral Program Terms' },
  },
};

/** The id a clause is linked to by, from its place in the document. */
export function clauseId(slug: LegalSlug, index: number): string {
  return `${LEGAL_PAGES[slug].clauseIdPrefix}${index + 1}`;
}
