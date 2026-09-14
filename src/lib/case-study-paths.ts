/**
 * The case studies' addresses, locale-independent — `localePath` gives each its
 * locale — and declared once, because the pages, the sitemap and the CMS's
 * Preview button all have to agree on them.
 */

/** The section's index. */
export const CASE_STUDIES_PATH = '/case-studies';

/** A case study, in whichever language: a translation shares its slug. */
export function caseStudyPath(slug: string): string {
  return `${CASE_STUDIES_PATH}/${slug}`;
}
