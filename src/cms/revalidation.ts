import { revalidatePath } from 'next/cache';
import type { GlobalAfterChangeHook, PayloadRequest } from 'payload';

/**
 * Set on `context` by anything that writes CMS content outside a request to
 * the running site — a migration, a script — where there is no page cache to
 * refresh and Next refuses to be asked.
 */
export const SKIP_REVALIDATION = 'skipRevalidation';

/**
 * Pages are built ahead of time, so published content reaches visitors only
 * when they are rebuilt. This marks every page stale, and the sitemap — a
 * route of its own beside the layouts — with them; each is rebuilt on its next
 * visit.
 *
 * The whole site rather than the pages a change appears on, because those are
 * easy to under-count: site settings are in every footer, and an article is on
 * its own page, the index, the sitemap and its translation's alternates.
 */
export function refreshSite(req: PayloadRequest): void {
  if (req.context[SKIP_REVALIDATION]) return;
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}

/**
 * For a global whose words show on pages — the site settings, a form's
 * settings, a page's entry: publishing it rebuilds the site; a saved draft
 * changes nothing a visitor can see, so it leaves the pages alone.
 */
export const refreshSiteWhenPublished: GlobalAfterChangeHook = ({ doc, req }) => {
  if (doc._status === 'published') refreshSite(req);
  return doc;
};
