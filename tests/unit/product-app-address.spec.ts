/**
 * Which page of the product app an address on this domain asks for — the
 * question the proxy puts to the product app before forwarding (ADR-0026).
 *
 * Tested directly as pure calculation with no I/O (spec: Testing Decisions):
 * a handful of address shapes, far cheaper to state here than to drive through
 * the running site one request at a time. That the proxy asks it, and acts on
 * the answer, is held in `tests/e2e/product-app-forwarding.spec.ts`.
 *
 * Every expected answer comes from how the product app's addresses were
 * observed to behave on 3 October 2026, while it still answered at
 * `rabaedapp.com`: a page is its first path segment and everything after it is
 * the page's parameters, and `/version-test/` or `/version-live/` in front
 * names which copy of the app the page is in — `/version-test/signin` answered
 * 200 and `/version-test/nope` 404, so the copy is part of the question.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { SITE_SEGMENTS, productAppPage } from '../../src/lib/product-app-address';
import { appRoutes, repoRoot } from './app-routes';

test('a page is its first segment; what follows it is the page’s parameters', () => {
  expect(productAppPage('/signin')).toBe('signin');
  expect(productAppPage('/project/test3')).toBe('project');
  expect(productAppPage('/submittal/1790000000000x100000000000000000')).toBe('submittal');
});

test('a copy of the app named in front is part of the page asked for', () => {
  // A page added to the test copy exists there before it exists live, so
  // asking the live copy would refuse a link that works.
  expect(productAppPage('/version-test/registration')).toBe('version-test/registration');
  expect(productAppPage('/version-live/verify/AbC123token')).toBe('version-live/verify');
  // The copy alone is that copy's home page, which answered 200.
  expect(productAppPage('/version-test')).toBe('version-test');
  expect(productAppPage('/version-live/')).toBe('version-live');
});

test('the Marketing site’s own addresses are never asked about', () => {
  // Never asked, because the question fails open: were the product app
  // unreachable, an address asked about would be forwarded to it — and this
  // site's own pages and images would leave with it.
  for (const own of [
    '/',
    '/product',
    '/start',
    '/tool',
    '/referral',
    '/partnership',
    '/terms',
    '/privacy',
    '/referral-terms',
    '/blog',
    '/blog/who-is-behind-rabaed',
    '/case-studies/a-story',
    '/en',
    '/en/product',
    '/en/nothing-here', // the English not-found page is this site's to answer
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
    '/maktab/collections/media',
    '/api/users',
    '/studio/ar/kanban',
    '/_next/static/chunks/main.js',
    '/_not-found',
    '/icon.png',
    '/apple-icon.png',
    '/og-rabaed.png',
    '/hero/owner.webp',
    '/downloads/Rabaed-Pour-Tracker.html',
  ]) {
    expect(productAppPage(own), own).toBeNull();
  }
});

test('an address the Marketing site has no page for is asked about, mistakes included', () => {
  // The product app's answer decides these. It answered 404 for each of them,
  // so each reaches this site's own not-found page.
  expect(productAppPage('/ar')).toBe('ar');
  expect(productAppPage('/admin')).toBe('admin');
  expect(productAppPage('/nothing-here')).toBe('nothing-here');
});

/**
 * The segments `SITE_SEGMENTS` writes out, held to what is really in the
 * repository: every route under `src/app`, every file Next serves from beside
 * them at its own name, and everything in `public/`. One left out would be
 * asked about, and forwarded to the product app whenever it failed to answer.
 */
test('every address this site serves is one the product app is never asked about', async () => {
  const appFiles = await readdir(path.join(repoRoot, 'src', 'app'), { withFileTypes: true });
  const served = [
    ...(await appRoutes()).filter((route) => !route.layout).map((route) => route.address),
    // `icon.png`, `apple-icon.png`: image files Next serves at their own name,
    // which `appRoutes` does not list because they are not code.
    ...appFiles.filter((entry) => entry.isFile() && /\.(png|ico|jpe?g|svg)$/.test(entry.name)).map((entry) => `/${entry.name}`),
    ...(await readdir(path.join(repoRoot, 'public'))).map((name) => `/${name}`),
  ];

  const unclaimed = served.filter((address) => {
    const first = address.split('/').filter(Boolean)[0] ?? '';
    return !SITE_SEGMENTS.has(first);
  });
  expect(unclaimed, 'add the first segment to SITE_SEGMENTS in src/lib/product-app-address.ts').toEqual([]);

  // A route whose first segment is dynamic would answer every address at all,
  // and none could reach the product app.
  const dynamicAtTop = served.filter((address) => /^\/\[/.test(address));
  expect(dynamicAtTop, 'a top-level dynamic route leaves nothing for the product app').toEqual([]);
});

/**
 * The proxy's matcher, which Next reads only as a literal, held to
 * `SITE_SEGMENTS`. The proxy runs before every request its matcher covers,
 * cached page or not, so a page of this site's that it covered would wait on
 * it for nothing — every page view, on a site whose search standing rests on
 * its speed. One it failed to cover would never be forwarded at all.
 *
 * Read as text, as `tests/unit/cached-page-age.spec.ts` reads its literals,
 * and matched the way Next matches: anchored, `/:path*` as the path and
 * anything beneath it.
 */
test('the proxy runs for every address the product app might have, and for none of this site’s own', async () => {
  const source = await readFile(path.join(repoRoot, 'src', 'proxy.ts'), 'utf8');
  const literal = source.match(/matcher:\s*(\[[\s\S]*?\]|'[^']*')/)?.[1];
  expect(literal, 'src/proxy.ts has a matcher').toBeDefined();
  const patterns = [...literal!.matchAll(/'([^']*)'/g)].map(([, pattern]) =>
    // The literal is read as source text, where `\\.` is two backslashes and a
    // dot; the string it spells has one.
    new RegExp(`^${pattern.replace(/\\\\/g, '\\').replace('/:path*', '(?:/.*)?')}$`),
  );
  const runsFor = (address: string) => patterns.some((pattern) => pattern.test(address));

  // Both directions, as sets. A segment left out of the matcher that is not
  // this site's own is the dangerous one: an address under it never reaches
  // the proxy, and is never forwarded.
  const leftOut = literal!.match(/\(\?!\(\?:([^)]*)\)\(\?:\/\|\$\)\)/)?.[1];
  expect(leftOut, 'src/proxy.ts leaves segments out of its matcher').toBeDefined();
  expect(new Set(leftOut!.split('|').map((segment) => segment.replace(/\\\\/g, '')))).toEqual(
    new Set([...SITE_SEGMENTS].filter((segment) => segment !== '')),
  );

  const own = [...SITE_SEGMENTS].filter((segment) => segment !== '' && segment !== 'studio');
  const covered = ['/', ...own.flatMap((segment) => [`/${segment}`, `/${segment}/anything`])].filter(runsFor);
  expect(covered, 'leave this site’s own segment out of the matcher in src/proxy.ts').toEqual([]);

  for (const address of [
    '/signin',
    '/version-test/registration',
    '/fileupload/f1729516897294x808916950788260100/a.pdf',
    '/ar',
    '/admin',
    '/nothing-here',
    // Begins like one of this site's segments, and is not one.
    '/products',
    '/start-here',
    '/terms-and-conditions',
    '/english',
    '/hero-image',
    // The studio is closed in production by the proxy too.
    '/studio/ar/kanban',
  ]) {
    expect(runsFor(address), address).toBe(true);
  }
});
