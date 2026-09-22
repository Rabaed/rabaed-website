/**
 * The floor under every cached page (ticket 66, ADR-0014).
 *
 * A page is rebuilt when a publish marks it stale, and at no other time. So
 * anything that loses a mark — ticket 64's race, a hook that throws, a request
 * that never lands — leaves that page showing the words from before the
 * publish not for a while, but until somebody publishes again. A maximum age
 * is the floor: whatever happens to the mark, a page is rebuilt at most
 * `MAX_PAGE_AGE_SECONDS` after it was last built.
 *
 * The rule is held in two places because one alone would not hold it:
 *
 * - **In the source**, so the age is readable where it is set, and so the
 *   route groups that must *not* have one stay excluded on purpose rather than
 *   by having been forgotten.
 * - **In the build**, so that Next is known to have honoured it. The whole
 *   point of setting it on the two layouts rather than on twenty pages is that
 *   a page inherits its parent's age, and a test of the source alone would
 *   assume that inheritance rather than show it. The build knows.
 *
 * Here rather than in `tests/e2e` because it opens no browser: what it reads is
 * source in the repository and the manifest the build writes beside it (spec:
 * Testing Decisions). Proving the age *elapses* would mean a test that waits
 * ten minutes, which is the one thing this cannot be; that the number reaches
 * every route is what is provable in a second, and it is what breaks.
 */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { MAX_PAGE_AGE_SECONDS } from '../../src/lib/cache-age';

const repositoryRoot = path.resolve(import.meta.dirname, '..', '..');

/**
 * The files that must each carry the age.
 *
 * The two layouts sit above all twenty pages and a route takes the lowest age
 * in its chain, so those two cover every page without twenty edits to keep in
 * step. The three discovery files are routes of their own with no layout above
 * them — the same reason `DISCOVERY_FILES` exists in `src/cms/revalidation.ts`,
 * and the same three.
 */
const MUST_CARRY_THE_AGE = [
  'src/app/(ar)/layout.tsx',
  'src/app/(en)/en/layout.tsx',
  'src/app/llms.txt/route.ts',
  'src/app/robots.ts',
  'src/app/sitemap.ts',
];

/**
 * The route groups that must not have one, and why each is not a page a
 * visitor reads.
 *
 * `(payload)` is the CMS admin and `(forms)` is two API routes: neither is
 * cached, so an age would mean nothing. `(studio)` is the Screen mock studio,
 * which is built from HTML on disk (ADR-0002) and changes only when a deploy
 * changes it — nothing a publish can make stale, so nothing for a floor to
 * catch.
 */
const MUST_NOT_CARRY_THE_AGE = ['src/app/(payload)', 'src/app/(forms)', 'src/app/(studio)'];

/** `export const revalidate = 600`, which is the only form Next reads (see `src/lib/cache-age.ts`). */
const AGE_EXPORT = /^export const revalidate = (\d+);$/m;

test.describe('every cached page has a maximum age', () => {
  for (const file of MUST_CARRY_THE_AGE) {
    test(`${file} sets the age`, async () => {
      const source = await readFile(path.join(repositoryRoot, file), 'utf8');
      const match = source.match(AGE_EXPORT);

      expect(
        match,
        `${file} does not export a maximum age. Every route a visitor can reach needs one, or a lost mark leaves it wrong until the next publish (ticket 66).`,
      ).not.toBeNull();
      expect(
        Number(match?.[1]),
        `${file} sets an age that is not MAX_PAGE_AGE_SECONDS. Next only reads a literal, so the number is written out in each file and held to the constant here.`,
      ).toBe(MAX_PAGE_AGE_SECONDS);
    });
  }

  for (const group of MUST_NOT_CARRY_THE_AGE) {
    test(`${group} does not`, async () => {
      const files = await routeFilesUnder(path.join(repositoryRoot, group));
      const withAnAge: string[] = [];

      for (const file of files) {
        const source = await readFile(file, 'utf8');
        if (AGE_EXPORT.test(source)) withAnAge.push(path.relative(repositoryRoot, file));
      }

      expect(
        withAnAge,
        `${group} is not a page a visitor reads, so an age there is either meaningless or a rebuild of something no publish changes.`,
      ).toEqual([]);
    });
  }
});

/**
 * Routes in the build's manifest that are not pages a visitor reads, and so
 * are expected to have no age.
 *
 * `/studio/**` is the Screen mock studio, excluded for the reason above.
 * `/_not-found` and `/_global-error` are Next's own, built from code rather
 * than from anything a publish changes. `/icon.png` and `/apple-icon.png` are
 * the favicon, generated from a file in the repository for the same reason.
 */
const NOT_A_PAGE_A_VISITOR_READS = (route: string): boolean =>
  route.startsWith('/studio/') || route.startsWith('/_') || route === '/icon.png' || route === '/apple-icon.png';

/**
 * What the build wrote down. `initialRevalidateSeconds` is the age Next
 * resolved for a route after walking its segments, which is why this is worth
 * asserting separately from the source: it is the inheritance itself, not the
 * two `export`s that are supposed to cause it.
 */
async function prerenderedRoutes(): Promise<Record<string, { initialRevalidateSeconds: number | false }>> {
  const manifest = path.join(repositoryRoot, '.next', 'prerender-manifest.json');
  const contents = await readFile(manifest, 'utf8').catch(() => null);

  if (contents === null) {
    throw new Error(
      `No build to read at ${manifest}. This spec reads what the build resolved, and the suite's server builds before it runs (playwright.config.ts); run \`npm test\` rather than this file alone.`,
    );
  }
  return JSON.parse(contents).routes;
}

test.describe('the build gave every visitor route the age', () => {
  test('every prerendered page and discovery file carries it', async () => {
    const routes = await prerenderedRoutes();
    const visitorRoutes = Object.entries(routes).filter(([route]) => !NOT_A_PAGE_A_VISITOR_READS(route));

    // A guard against the filter above quietly matching everything: the site
    // has twenty pages and three discovery files, and if this ever reads as a
    // handful then the assertion below is passing vacuously.
    expect(visitorRoutes.length, 'the manifest holds far fewer visitor routes than the site has pages').toBeGreaterThan(
      10,
    );

    const withoutTheAge = visitorRoutes
      .filter(([, entry]) => entry.initialRevalidateSeconds !== MAX_PAGE_AGE_SECONDS)
      .map(([route, entry]) => `${route} (${String(entry.initialRevalidateSeconds)})`);

    expect(
      withoutTheAge,
      `these routes were built with no maximum age, or the wrong one. A page with none is rebuilt only when a publish marks it, so a lost mark leaves it wrong until the next publish (ticket 66). Expected ${MAX_PAGE_AGE_SECONDS}.`,
    ).toEqual([]);
  });

  test('the studio and the framework routes are left without one', async () => {
    const routes = await prerenderedRoutes();
    const excluded = Object.entries(routes).filter(([route]) => NOT_A_PAGE_A_VISITOR_READS(route));

    const withAnAge = excluded
      .filter(([, entry]) => entry.initialRevalidateSeconds !== false)
      .map(([route]) => route);

    expect(
      withAnAge,
      'none of these is a page a publish can make stale, so a rebuild on a timer buys nothing and costs a render.',
    ).toEqual([]);
  });
});

/** Every route file — a page, a layout or a route handler — beneath a directory. */
async function routeFilesUnder(directory: string): Promise<string[]> {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });

  return entries
    .filter((entry) => entry.isFile() && /^(page|layout|route)\.tsx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}
