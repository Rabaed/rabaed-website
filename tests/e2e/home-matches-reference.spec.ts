/**
 * "The hero matches the baselines at all eight widths" (ticket 06), measured
 * against the Reference site itself rather than against the baseline images —
 * for the reasons written up in `shell-matches-reference.spec.ts` and in
 * ticket 04's notes. In short: a crop cannot be aligned inside a 7,480px
 * screenshot, and a pixel diff cannot run on a hosted runner at all.
 *
 * The home page still cannot be compared *whole* against its baseline either,
 * because tickets 09 and 10 have not put the middle of it there yet. When they
 * have, the whole-page comparison the spec asks for becomes possible and this
 * file is what it joins.
 *
 * **Both pages are loaded with reduced motion on**, which is what makes the
 * comparison meaningful rather than a race: the hero's whole point is a
 * document that does not stay still, and photographing two independent
 * animations at "the same moment" compares wall-clock luck. With the
 * preference set, both sites put the document at the Contractor and leave it
 * there — the Reference site's own script does that, and so does the
 * rebuild — so every position in the diagram is a fact about the stylesheet.
 * What moves is asserted in `home-hero.spec.ts` instead, where it belongs.
 *
 * The Trust strip is deliberately *not* compared. It is the one part of this
 * ticket that departs from the Reference site by design — a travelling rail
 * where the Reference site wraps — and `home-hero.spec.ts` is where that
 * behaviour is held to the spec.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

/**
 * Everything the hero is made of. Both documents carry all of it, under the
 * Reference site's own class names — which, as in the shell comparison, are
 * the only names the two documents share.
 *
 * Each selector is measured across *every* element it matches, not just the
 * first, so the three buildings and the three names are three comparisons
 * each — and a station that went missing fails on the count rather than
 * quietly comparing nothing.
 */
const HERO_PARTS = [
  '.hero-grid',
  '.hero-copy',
  '.eyebrow',
  '.hero-copy h1',
  '.hero-copy h1 span',
  '.hero-copy .lead',
  '.ctas',
  '.ctas .btn.p',
  '.ctas .btn.g',
  '.trust',
  '.hero-visual',
  '.hero-art',
  '.hero-art .hlines',
  // The three buildings and the three names, each at its own station.
  '.hero-art .bld',
  '.hero-art .party',
  // The document at rest, and the ring that will expand where it lands.
  '#h-doc',
  '#h-pulse',
  '.hero-status',
  '.hero-status i',
];

/**
 * The one part of the hero the rebuild deliberately draws differently, and the
 * same divergence the footer carries: the Reference site sets the whole of
 * "60 يوماً" in DM Mono, a face with no Arabic glyphs, so the word beside the
 * numeral falls through to the browser's last-resort monospace. The spec
 * forbids that outright, so only the numeral is `.mono` here. A different
 * typeface is a different width, so the guarantee pill is held to the row it
 * occupies and the height it takes, and nothing more. See `tokens.css`.
 */
const DIVERGENT = '.guar';

async function measure(page: Page, parts: readonly string[]) {
  return page.evaluate(
    ({ parts, divergent }: { parts: string[]; divergent: string }) => {
      const root = document.querySelector('#hero')!;
      const origin = root.getBoundingClientRect();
      const round = (n: number) => Math.round(n * 100) / 100;

      const of = (element: Element, rowOnly = false) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (rowOnly) return { top: round(box.top - origin.top), height: round(box.height) };
        return {
          top: round(box.top - origin.top),
          left: round(box.left - origin.left),
          height: round(box.height),
          width: round(box.width),
          color: style.color,
          background: style.backgroundColor,
          borderColor: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(' '),
          font: `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${style.fontFamily}`,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
        };
      };

      const result: Record<string, unknown> = { self: of(root) };
      result[divergent] = [...root.querySelectorAll(divergent)].map((element) => of(element, true));
      for (const part of parts) {
        result[part] = [...root.querySelectorAll(part)].map((element) => of(element));
      }
      return result;
    },
    { parts: [...parts], divergent: DIVERGENT },
  );
}

test.describe('the hero matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  // All sixteen, and the short ones are not optional here: the hero's own
  // `(min-width: 981px) and (max-height: 700px)` block is six rules that shrink
  // the headline, the lead, the diagram and the gap between them, and at 900px
  // tall not one of them is exercised.
  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        const { reference, rebuilt } = pages;

        // Both scripts park the document at the Contractor and rewrite the
        // status pill when motion is turned down. Waiting for that text is
        // what says the hero has settled — on either site.
        await expect(reference.locator('#h-status')).toHaveText('موثّق ومؤرخ');
        await expect(rebuilt.locator('#h-status')).toHaveText('موثّق ومؤرخ');

        expect(await measure(rebuilt, HERO_PARTS), 'hero').toEqual(
          await measure(reference, HERO_PARTS),
        );
      } finally {
        await pages.close();
      }
    });
  }
});
