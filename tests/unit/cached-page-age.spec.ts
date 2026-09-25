/**
 * The maximum age is set on every route that needs one, and on none that does
 * not (ticket 66, ADR-0016).
 *
 * A page is rebuilt when a publish marks it stale, and at no other time. So
 * anything that loses a mark leaves that page showing the words from before
 * the publish not for a while, but until somebody publishes again — ticket
 * 64's race, a hook that throws, a request that never lands. The age is the
 * floor under all of them.
 *
 * Next reads `export const revalidate` by static analysis and accepts only a
 * literal, so the number cannot be imported into the six routes that set it.
 * What this spec holds is that the six literals still agree with
 * `MAX_PAGE_AGE_SECONDS`, and that the route groups deliberately left without
 * an age are still without one on purpose rather than by having been
 * forgotten.
 *
 * Here rather than in `tests/e2e` because what it asserts is the repository's
 * own consistency — one file held to another, the third seam the spec permits
 * (spec: Testing Decisions). That the age *reaches* a visitor is a different
 * question and a different seam: `tests/e2e/cached-page-age.spec.ts` asks the
 * running application, which is where the inheritance these lines rely on
 * can actually be observed.
 */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { MAX_PAGE_AGE_SECONDS } from '../../src/lib/cache-age';
import { DISCOVERY_FILES, NOT_FOUND_ADDRESS, NOT_PAGES } from '../../src/lib/page-registry';
import { appRoutes, repoRoot } from './app-routes';

/**
 * The layouts that must each carry the age. The two sit above all twenty
 * pages and a route takes the lowest age in its chain, so those two cover
 * every page without twenty edits to keep in step.
 */
const LAYOUTS = ['src/app/(ar)/layout.tsx', 'src/app/(en)/en/layout.tsx'];

/**
 * The routes that must each carry the age of their own, by address: the
 * discovery files, routes with no layout above them, and the not-found page,
 * which sits in neither language's layout and shows words from the CMS
 * (ticket 59); Next builds it as a page of its own, `/_not-found` (ticket 84).
 * The page registry lists all four (ticket 92, `src/lib/page-registry.ts`).
 */
const ROUTES_OF_THEIR_OWN = [...DISCOVERY_FILES, NOT_FOUND_ADDRESS];

/**
 * The routes that must not have one: what the page registry names as not a
 * page and not cached — the CMS admin, its API and the forms' routes, which
 * are not cached, so an age would mean nothing; and the Screen mock studio,
 * which is built from HTML on disk (ADR-0002) and changes only when a deploy
 * changes it — nothing a publish can make stale, so nothing for a floor to
 * catch.
 */
const UNCACHED = NOT_PAGES.filter((route) => !route.cached);

/** `export const revalidate = 600`, which is the only form Next reads (see `src/lib/cache-age.ts`). */
const AGE_EXPORT = /^export const revalidate = (\d+);$/m;

async function expectTheAge(file: string): Promise<void> {
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
}

for (const file of LAYOUTS) {
  test(`${file} sets the age`, async () => {
    await expectTheAge(file);
  });
}

for (const address of ROUTES_OF_THEIR_OWN) {
  test(`${address} sets the age`, async () => {
    const route = (await appRoutes()).find((each) => each.address === address);
    expect(route, `no route answers ${address}`).toBeTruthy();
    await expectTheAge(route!.file);
  });
}

for (const { address, reason } of UNCACHED) {
  test(`${address} does not`, async () => {
    const withAnAge: string[] = [];
    for (const route of await appRoutes()) {
      if (route.address !== address && !route.address.startsWith(`${address}/`)) continue;
      if (AGE_EXPORT.test(await readFile(path.join(repoRoot, route.file), 'utf8'))) withAnAge.push(route.file);
    }

    expect(withAnAge, `${address} is ${reason}: not cached, so an age there is either meaningless or a rebuild of something no publish changes.`).toEqual([]);
  });
}
