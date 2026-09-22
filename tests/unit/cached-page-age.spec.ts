/**
 * The maximum age is set on every route that needs one, and on none that does
 * not (ticket 66, ADR-0014).
 *
 * A page is rebuilt when a publish marks it stale, and at no other time. So
 * anything that loses a mark leaves that page showing the words from before
 * the publish not for a while, but until somebody publishes again — ticket
 * 64's race, a hook that throws, a request that never lands. The age is the
 * floor under all of them.
 *
 * Next reads `export const revalidate` by static analysis and accepts only a
 * literal, so the number cannot be imported into the five routes that set it.
 * What this spec holds is that the five literals still agree with
 * `MAX_PAGE_AGE_SECONDS`, and that the route groups deliberately left without
 * an age are still without one on purpose rather than by having been
 * forgotten.
 *
 * Here rather than in `tests/e2e` because what it asserts is the repository's
 * own consistency — one file held to another, the third seam the spec permits
 * (spec: Testing Decisions). That the age *reaches* a visitor is a different
 * question and a different seam: `tests/e2e/cached-page-age.spec.ts` asks the
 * running application, which is where the inheritance these five lines rely on
 * can actually be observed.
 */
import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { MAX_PAGE_AGE_SECONDS } from '../../src/lib/cache-age';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

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

for (const file of MUST_CARRY_THE_AGE) {
  test(`${file} sets the age`, async () => {
    const source = await readFile(path.join(repoRoot, file), 'utf8');
    const match = source.match(AGE_EXPORT);

    expect(
      match,
      `${file} does not export a maximum age. Every route a visitor can reach needs one, or a lost mark leaves it wrong until the next publish (ticket 66).`,
    ).not.toBeNull();
    expect(
      Number(match?.[1]),
      `${file} sets an age that is not MAX_PAGE_AGE_SECONDS. Next reads only a literal, so the number is written out in each file and held to the constant here.`,
    ).toBe(MAX_PAGE_AGE_SECONDS);
  });
}

for (const group of MUST_NOT_CARRY_THE_AGE) {
  test(`${group} does not`, async () => {
    const withAnAge: string[] = [];

    for (const file of await routeFilesUnder(path.join(repoRoot, group))) {
      if (AGE_EXPORT.test(await readFile(file, 'utf8'))) withAnAge.push(path.relative(repoRoot, file));
    }

    expect(
      withAnAge,
      `${group} is not a page a visitor reads, so an age there is either meaningless or a rebuild of something no publish changes.`,
    ).toEqual([]);
  });
}

/** Every route file — a page, a layout or a route handler — beneath a directory. */
async function routeFilesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });

  return entries
    .filter((entry) => entry.isFile() && /^(page|layout|route)\.tsx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}
