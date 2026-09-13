import type { Page } from '@playwright/test';

/**
 * "The page does not load the animation library or homepage animation code it
 * has no use for" — asked of the start page (ticket 13), and by the spec of
 * every page whose Reference version carries the whole animation bundle for
 * elements it does not contain: start, referral, partnership and the legal
 * pages (spec: Analytics and performance).
 *
 * Each marker is a string from one behaviour's source that survives
 * minification. `start-page.spec.ts` looks for the same markers on the pages
 * that do use the code, so a marker that stopped appearing in the bundle —
 * renamed, or minified away — fails there rather than letting a page's test
 * pass by finding nothing.
 *
 * GSAP itself loads on every page, and is meant to: the header's colour toggle
 * is on every page and is built on it.
 */
export const ANIMATIONS = [
  // Quoted, because React's `revealOrder` and Next's `revealAfter` contain
  // `.reveal` too.
  { name: 'the `.reveal` entrance', marker: '".reveal"', usedOn: '/' },
  { name: "the home page's hero loop", marker: 'hero-art', usedOn: '/' },
  { name: "the home page's card decks", marker: '.pcard', usedOn: '/' },
  { name: "the home page's four units", marker: '.jt-hint', usedOn: '/' },
  { name: "the product page's journey", marker: '.j-head', usedOn: '/product' },
  { name: "the product page's roles", marker: 'role on', usedOn: '/product' },
] as const;

/**
 * Every script a page loads, as text. Read until the network is idle, so a
 * chunk loaded later — on scroll or interaction — would be missed; none of the
 * pages this is asked of loads one.
 */
export async function scriptsOf(page: Page, path: string): Promise<string> {
  const scripts: Promise<string>[] = [];
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') scripts.push(response.text());
  });
  await page.goto(path, { waitUntil: 'networkidle' });
  return (await Promise.all(scripts)).join('\n');
}
