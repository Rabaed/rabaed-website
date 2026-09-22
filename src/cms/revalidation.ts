import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import type { GlobalAfterChangeHook, PayloadRequest } from 'payload';

/**
 * Set on `context` by anything that writes CMS content outside a request to
 * the running site — a migration, a script — where there is no page cache to
 * refresh and Next refuses to be asked.
 */
export const SKIP_REVALIDATION = 'skipRevalidation';

/**
 * The files a crawler reads about the site rather than a page of it, each a
 * route of its own beside the layouts, so none is covered by marking the pages
 * stale: the sitemap (ticket 31), `llms.txt` — built from the pages' own
 * descriptions and every published article — and `robots.txt`, which reads the
 * training-crawler switch (ticket 33).
 */
const DISCOVERY_FILES = ['/sitemap.xml', '/llms.txt', '/robots.txt'];

/**
 * The two route groups every page of the site sits in, one per language. The
 * second mark reaches the pages through these rather than through the root
 * layout the first mark uses (below).
 */
const SITE_GROUPS = ['/(ar)', '/(en)'];

/**
 * How long after a publish the site is marked a second time (ticket 64,
 * ADR-0017): longer than the slowest build of a page or a discovery file, so
 * that one already under way at the first mark has finished by the second.
 * Measured, not guessed — ADR-0017 has the numbers — and inside the ten
 * seconds the founder set as its ceiling.
 */
export const SECOND_MARK_AFTER_MS = 10_000;

/** Set on `context` once a request has asked for its second mark, so a request that publishes twice waits once. */
const SECOND_MARK_ASKED = 'secondMarkAsked';

/**
 * Pages are built ahead of time, so published content reaches visitors only
 * when they are rebuilt. This marks every page stale, and the discovery files
 * with them; each is rebuilt on its next visit.
 *
 * The whole site rather than the pages a change appears on, because those are
 * easy to under-count: site settings are in every footer, and an article is on
 * its own page, the index, the sitemap, `llms.txt` and its translation's
 * alternates.
 *
 * **And then again, `SECOND_MARK_AFTER_MS` later** (ticket 64). Next decides a
 * cached page is past a mark by when the page was *written*, not by what is in
 * it, so a build that read the words before this mark and finishes after it
 * caches the old words stamped later than the mark — and they count as fresh
 * until the next publish. By the second mark any such build has finished, and
 * its page is marked in turn. It runs after the Editor's request has been
 * answered (`after`), so publishing is no slower for it.
 */
export function refreshSite(req: PayloadRequest): void {
  if (req.context[SKIP_REVALIDATION]) return;
  revalidatePath('/', 'layout');
  for (const file of DISCOVERY_FILES) revalidatePath(file);

  if (req.context[SECOND_MARK_ASKED]) return;
  req.context[SECOND_MARK_ASKED] = true;
  after(async () => {
    await new Promise((resolve) => setTimeout(resolve, SECOND_MARK_AFTER_MS));
    markAgain();
  });
}

/**
 * The second mark reaches every page and discovery file the first does, by
 * **tags the first does not use**: each language's group layout rather than
 * the root layout, and each discovery file's own layout segment rather than
 * its address. That is not tidiness. Next keeps a request's marks after
 * sending them, and a mark made in `after` is sent only if its tag is new to
 * that request — the root layout marked a second time is dropped without a
 * word, and a second mark written the obvious way does nothing at all. Every
 * page carries both tags (`x-next-cache-tags`), so either reaches it.
 */
function markAgain(): void {
  for (const group of SITE_GROUPS) revalidatePath(group, 'layout');
  for (const file of DISCOVERY_FILES) revalidatePath(file, 'layout');
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

/**
 * For a global that keeps no drafts, where saving is the only act there is —
 * the AI crawler switch (ticket 33). Nothing to wait for a publish that never
 * comes.
 */
export const refreshSiteWhenSaved: GlobalAfterChangeHook = ({ doc, req }) => {
  refreshSite(req);
  return doc;
};
