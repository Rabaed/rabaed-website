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
 * The library the code is written against is `LIBRARIES` below.
 */
export const ANIMATIONS = [
  // Quoted, because React's `revealOrder` and Next's `revealAfter` contain
  // `.reveal` too.
  { name: 'the `.reveal` entrance', marker: '".reveal"', usedOn: '/' },
  { name: "the home page's hero loop", marker: 'hero-art', usedOn: '/' },
  { name: "the home page's card decks", marker: '.pcard', usedOn: '/' },
  { name: "the home page's four units", marker: '.jt-hint', usedOn: '/' },
  { name: "the product page's journey", marker: '.j-head', usedOn: '/product' },
  // Quoted, because the demo request form's English label, «Your role on the
  // project», is on the home and start pages too (ticket 42).
  { name: "the product page's roles", marker: '"role on"', usedOn: '/product' },
] as const;

/**
 * A route that carries another page's scripts, by the page it carries them for.
 *
 * `/en` is the home page in English (ticket 42). One route draws it, and —
 * until its English is published — the English site's word that it is on its
 * way; and a route carries the scripts of everything it can draw, whichever it
 * draws. So `/en` is held to what the home page loads, not to what the
 * placeholder would. It is the one cost of the placeholder, and it ends when
 * the founder publishes the English home page, which needs every one of them.
 */
export const CARRIES_THE_SCRIPTS_OF: Readonly<Record<string, string>> = { '/en': '/' };

/**
 * The animation library itself, and the pages that have something to animate
 * (ticket 36).
 *
 * It used to be every page, because the header's colour toggle was built on
 * ScrollTrigger and the header is on every page. The toggle is a plain scroll
 * listener now (`src/components/nav-behaviour.tsx`), so a page with no
 * animation of its own ships no animation library — which is what the spec's
 * performance budget asks (spec: Analytics and performance).
 *
 * Each marker is a string literal from the library's own source, which
 * minification keeps because it is a message, not a name. `performance.spec.ts`
 * holds every route to this table from both sides: a page that loads a library
 * it is not listed for fails, and so does a page listed for one it does not
 * load — which is what would happen if a marker stopped appearing.
 */
export const LIBRARIES = [
  {
    name: 'GSAP',
    marker: '"GSAP target "',
    // The home page's hero, decks, four units, Record, before-and-after and
    // entrances; the product page's journey and roles; and the Trust strip,
    // which the home, product and start pages all carry.
    usedOn: ['/', '/product', '/start'],
  },
  {
    name: "GSAP's ScrollTrigger",
    marker: '"pin-spacer-"',
    // The Trust strip is a timeline and needs no scrolling, so the start page
    // loads the core and not this.
    usedOn: ['/', '/product'],
  },
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
