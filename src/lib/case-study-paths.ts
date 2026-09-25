/**
 * The case studies' addresses, locale-independent — `localePath` gives each its
 * locale — and declared once, because the pages, the sitemap and the CMS's
 * Preview button all have to agree on them. The index's own is the page
 * registry's (ticket 92).
 */
import { SITE_PAGES } from './page-registry';

/** The section's index. */
export const CASE_STUDIES_PATH = SITE_PAGES['case-studies'].path;

/** A case study, in whichever language: a translation shares its slug. */
export function caseStudyPath(slug: string): string {
  return `${CASE_STUDIES_PATH}/${slug}`;
}
