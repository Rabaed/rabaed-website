/**
 * The page registry (ticket 92) against the routes the site really has.
 *
 * The registry is written out by hand, so that nothing wanders into the
 * sitemap or `llms.txt` by being found: the sitemap's rule. What that costs is
 * that a route can be added and the registry never told. This is where that
 * shows: every route file under `src/app` is a page the registry lists, a file
 * a crawler reads, the not-found page, or a route the registry names as not a
 * page, with its reason. And every page the registry lists has its route.
 *
 * `tests/e2e/routes.ts` stays written out rather than imported, for the reason
 * it gives, and is held to the registry here instead.
 *
 * Here rather than in `tests/e2e` because it opens no browser: what it reads
 * is source in the repository (spec: Testing Decisions).
 */
import { test, expect } from '@playwright/test';
import {
  DISCOVERY_FILES,
  MARKETING_PAGES,
  MARKETING_PAGE_KEYS,
  NOT_FOUND_ADDRESS,
  NOT_PAGES,
  SITE_PAGES,
} from '../../src/lib/page-registry';
import { localePath } from '../../src/lib/locales';
import { ROUTES } from '../e2e/routes';
import { appRoutes, under, type AppRoute } from './app-routes';

/** Every page the registry lists, by its Arabic address, and whether it has articles or stories beneath it. */
const PAGES = [
  ...MARKETING_PAGE_KEYS.map((key) => ({ path: MARKETING_PAGES[key].path, withArticles: false })),
  ...Object.values(SITE_PAGES).map((page) => ({ path: page.path, withArticles: page.withArticles })),
];

/** An English address as the page it is the English of: `/en/blog` is `/blog`, `/en` is `/`. */
const inArabic = (address: string) => (address === '/en' ? '/' : address.startsWith('/en/') ? address.slice(3) : address);

/** The routes, less the layouts above them, which answer no address of their own. */
const routes = async (): Promise<AppRoute[]> => (await appRoutes()).filter((route) => !route.layout);

/** What the registry says an address is, or `null` where it says nothing. */
function registered(address: string): string | null {
  const page = PAGES.find((each) => inArabic(address) === each.path || (each.withArticles && under(inArabic(address), each.path)));
  if (page) return `the page ${page.path}`;
  if ((DISCOVERY_FILES as readonly string[]).includes(address)) return 'a discovery file';
  if (address === NOT_FOUND_ADDRESS) return 'the not-found page';
  const excluded = NOT_PAGES.find((each) => under(address, each.address));
  return excluded ? `not a page: ${excluded.reason}` : null;
}

test('every route of the site is a page the registry lists, or named there as not one', async () => {
  const unregistered = (await routes()).filter((route) => registered(route.address) === null);
  expect(
    unregistered.map((route) => `${route.file} (${route.address})`),
    'add the page to src/lib/page-registry.ts, or name the route in NOT_PAGES with the reason it is not a page',
  ).toEqual([]);
});

test('every page the registry lists has its route, and every marketing page its English route', async () => {
  const addresses = new Set((await routes()).map((route) => route.address));
  for (const page of PAGES) expect(addresses.has(page.path), `${page.path} has no route`).toBe(true);
  for (const key of MARKETING_PAGE_KEYS) {
    const english = localePath('en', MARKETING_PAGES[key].path);
    expect(addresses.has(english), `${english} has no route`).toBe(true);
  }
  for (const file of [...DISCOVERY_FILES, NOT_FOUND_ADDRESS]) expect(addresses.has(file), `${file} has no route`).toBe(true);
});

test('every name for a route that is not a page still names a route', async () => {
  const addresses = (await routes()).map((route) => route.address);
  for (const each of NOT_PAGES) {
    expect(addresses.some((address) => under(address, each.address)), `${each.address} names no route any more`).toBe(true);
  }
});

/**
 * The case studies' index is a page only once a story is published (ticket
 * 24), and the test server's database starts with none, so `routes.ts` cannot
 * list it: `case-studies.spec.ts` publishes one and reaches it.
 */
const NOT_IN_ROUTES_TS = new Set(['/case-studies']);

test('tests/e2e/routes.ts lists the pages the registry lists, and no others', () => {
  const listed = new Set(ROUTES.map((route) => inArabic(route.path)));
  for (const page of PAGES) {
    if (!NOT_IN_ROUTES_TS.has(page.path)) expect(listed.has(page.path), `routes.ts leaves out ${page.path}`).toBe(true);
  }
  for (const path of listed) expect(PAGES.map((page) => page.path), `routes.ts lists ${path}`).toContain(path);
});
