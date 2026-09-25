import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import type { GlobalAfterChangeHook, PayloadRequest } from 'payload';
import { DISCOVERY_FILES, NOT_FOUND_ADDRESS } from '../lib/page-registry';

/**
 * Set on `context` by anything that writes CMS content outside a request to
 * the running site — a migration, a script — where there is no page cache to
 * refresh and Next refuses to be asked.
 */
export const SKIP_REVALIDATION = 'skipRevalidation';

/**
 * Every page of the site by the layout it sits beneath: each language's route
 * group, and the not-found page, which sits in neither and shows words from
 * the CMS (ticket 59). The discovery files — the sitemap, `llms.txt` and
 * `robots.txt` — are routes of their own beside the layouts, so marking the
 * pages covers none of them: the page registry lists them (ticket 92). The second mark reaches the pages through these rather
 * than through the root layout the first mark uses (below).
 */
const PAGE_LAYOUTS = ['/(ar)', '/(en)', NOT_FOUND_ADDRESS];

/**
 * How long after a publish the site is marked a second time (ticket 64,
 * ADR-0017): longer than the slowest build of a page or a discovery file, so
 * that one already under way at the first mark has finished by the second.
 * Measured, not guessed — ADR-0017 has the numbers — and inside the ten
 * seconds the founder set as its ceiling.
 */
const SECOND_MARK_AFTER_MS = 10_000;

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
 * **tags the first does not use**: the layouts in `PAGE_LAYOUTS` rather than
 * the root layout, and each discovery file's own layout segment rather than
 * its address. That is not tidiness. Next keeps a request's marks after
 * sending them, and a mark made in `after` is sent only if its tag is new to
 * that request — the root layout marked a second time is dropped without a
 * word, and a second mark written the obvious way does nothing at all.
 *
 * Every page and discovery file carries both tags (`x-next-cache-tags` in the
 * build's `.meta` files). A route handler's layout tag is Next deriving one
 * from every path segment rather than anything its docs promise for route
 * handlers, which is why `tests/e2e/stale-render.spec.ts` holds the pages and
 * this comment names the source.
 */
function markAgain(): void {
  for (const layout of PAGE_LAYOUTS) revalidatePath(layout, 'layout');
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

/**
 * For the two image collections, `media` and `sharing-images` (ticket 84), as
 * both their `afterChange` and their `afterDelete`. An image keeps no drafts
 * and is shown by whatever page names it — a Trust strip mark, an article's
 * cover, a page's link card — so saving one, replacing its file or deleting it
 * changes those pages at once, and the page never knows: nothing it is built
 * from was published. Without this, a page went on showing the old picture, or
 * its old description, until its ten-minute age ran out (ADR-0016).
 *
 * Replacing the file deletes the old one as the new one is stored, so a page
 * left as it was built names a file that no longer answers: a missing
 * picture, or in the Trust strip a company's name where its mark was. Marked,
 * the page is built again before its next visitor is answered — seen on the
 * test server (`tests/e2e/blog.spec.ts` asks it); Vercel's cache was not
 * watched doing the same.
 */
export const refreshSiteWhenImageChanges = <Doc>({ doc, req }: { doc: Doc; req: PayloadRequest }): Doc => {
  refreshSite(req);
  return doc;
};
