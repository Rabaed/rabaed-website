/**
 * The blog's addresses, locale-independent — `localePath` gives each its
 * locale — and declared once, because the pages, the sitemap and the CMS's
 * Preview button all have to agree on them. The index's own is the page
 * registry's (ticket 92).
 */
import { SITE_PAGES } from './page-registry';

const BLOG = SITE_PAGES.blog.path;

/** A page of the index. The first is `/blog` itself, never `/blog/page/1`. */
export function blogIndexPath(page = 1): string {
  return page === 1 ? BLOG : `${BLOG}/page/${page}`;
}

/** An article, in whichever language: a translation shares its slug. */
export function blogPostPath(slug: string): string {
  return `${BLOG}/${slug}`;
}
