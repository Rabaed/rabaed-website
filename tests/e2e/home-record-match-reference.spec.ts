/**
 * "Matches baselines at all eight widths" and "the scrubbed background and
 * border transition matches the Reference site" for the Record section
 * (ticket 09), measured against the Reference site itself for the reasons in
 * `shell-matches-reference.spec.ts`.
 *
 * **At rest**, at all sixteen baseline viewports with reduced motion on:
 * everything in the section — the copy, the chips, the card and every part of
 * the trail showing in it, and the stamp waiting to come on.
 *
 * **While scrolling**, with motion on: the colours of the section and the card
 * at points through their change, and on a desktop window which transaction
 * type is marked and whether the stamp is on at points through the cycle.
 *
 * Two deliberate differences shape the comparison, each left out only where it
 * reaches:
 *
 * - **Every type's trail is in the page**, where the Reference site has one and
 *   rewrites it. The trails not showing are `hidden`, so every part of a trail
 *   is selected through a parent that is not — which on the Reference site is
 *   simply the card.
 * - **Below 981px the section is padded, and never shorter than what is in
 *   it.** The Reference site holds it to the window's height with no padding,
 *   so on a phone its copy and card spill over the sections either side, and
 *   on a tablet they sit 30px from its edges. There, the section's height and
 *   where its content sits in it are not compared; everything inside the
 *   content still is, at all sixteen viewports. Below 981px the types also
 *   follow the card rather than the section, because the Reference site's
 *   cycle has no room to run there, so the cycle is compared on desktop
 *   windows only.
 */
import { test, expect, type Page } from '@playwright/test';
import { measureRegion, type Measurement, type Region } from './geometry';
import { readColours, readCycle, scrollIntoSection, scrollToProgress } from './record-section';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

/** Selects inside the trail showing, on either site. */
const SHOWING = '.rec-card :not([hidden]) >';

/**
 * Everything in the section. Below 981px the card is as tall as its tallest
 * trail rather than the one showing, so there its height, the height of the
 * content around it, and where the stamp under the trails sits, are left out;
 * every part of the trail itself is not.
 */
function contentRegion(viewport: { width: number }): Region {
  const holdsTallest: Measurement[] = viewport.width <= 980 ? ['height'] : [];
  return {
    name: 'what is in the Record section',
    root: '#record .rec-grid',
    omitFromRoot: holdsTallest,
    parts: [
      '.eyebrow',
      'h2',
      '.fourq',
      '.fourq span',
      '.lead',
      '.rec-types',
      '.rec-types span',
      { selector: '.rec-card', omit: holdsTallest },
      { selector: '.rec-card .doc', omit: holdsTallest },
      `${SHOWING} .h`,
      `${SHOWING} .h b`,
      `${SHOWING} .tl`,
      `${SHOWING} .tl > li`,
      `${SHOWING} .tl > li > i`,
      `${SHOWING} .tl .a`,
      `${SHOWING} .tl .b`,
      `${SHOWING} .tl .time`,
      { selector: '.rec-card .stamp', omit: viewport.width <= 980 ? ['top'] : [] },
    ],
  };
}

/** The section, and where its content sits in it — except below 981px, where the rebuild pads it. */
function sectionRegion(viewport: { width: number }): Region {
  const vertical: Measurement[] = viewport.width <= 980 ? ['top', 'height'] : [];
  return {
    name: 'the Record section',
    root: '#record',
    omitFromRoot: vertical,
    parts: [
      { selector: '.sticky', omit: vertical },
      { selector: '.rec-grid', omit: vertical },
    ],
  };
}

/**
 * The Reference site rewrites its first trail, and fades it in, as soon as its
 * script runs — reduced motion or not. Compared before that, the last step
 * would be the markup's rather than the one visitors read.
 */
async function waitForTheReferenceTrail(page: Page) {
  await expect(page.locator('#rec-tl li').last().locator('.a')).toHaveText('رُدَّ عليه');
  await expect
    .poll(() =>
      page.evaluate(() =>
        [document.querySelector('#rec-title')!, ...document.querySelectorAll('#rec-tl li')].every(
          (part) => getComputedStyle(part).opacity === '1',
        ),
      ),
    )
    .toBe(true);
}

/**
 * Two colours within a step of each other on every channel. Both sites blend
 * between the same two colours at the same point, but each scrolls to a whole
 * pixel from where its own section happens to start, so a blend can land one
 * value apart.
 */
function expectCloseColours(actual: Record<string, string>, expected: Record<string, string>, where: string) {
  const channels = (colour: string) => colour.match(/[\d.]+/g)!.map(Number);
  for (const key of Object.keys(expected)) {
    const [a, e] = [channels(actual[key]), channels(expected[key])];
    expect(a.length, `${key} ${where}`).toBe(e.length);
    a.forEach((value, index) =>
      expect(Math.abs(value - e[index]), `${key} ${where}: ${actual[key]} against ${expected[key]}`).toBeLessThanOrEqual(3),
    );
  }
}

let site: ReferenceSite;

test.beforeAll(async () => {
  site = await startReferenceSite();
});

test.afterAll(async () => {
  await new Promise((resolve) => site.server.close(resolve));
});

test.describe('the Record section matches the Reference site at rest', () => {
  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        await waitForTheReferenceTrail(pages.reference);
        for (const region of [sectionRegion(viewport), contentRegion(viewport)]) {
          expect(await measureRegion(pages.rebuilt, region), region.name).toEqual(
            await measureRegion(pages.reference, region),
          );
        }
      } finally {
        await pages.close();
      }
    });
  }
});

test.describe('the Record section changes as on the Reference site while scrolling', () => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 550 },
    { width: 1024, height: 900 },
    { width: 390, height: 900 },
  ]) {
    test(`colours at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { motion: 'no-preference' });

      try {
        // Through the section's own change, which runs over its first quarter,
        // and the card's, which runs from 12% to 32%.
        for (const fraction of [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.28, 0.32, 0.45]) {
          await scrollIntoSection(pages.reference, fraction);
          await scrollIntoSection(pages.rebuilt, fraction);
          expectCloseColours(await readColours(pages.rebuilt), await readColours(pages.reference), `at ${fraction} of the section`);
        }
      } finally {
        await pages.close();
      }
    });
  }

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 550 },
  ]) {
    test(`the cycle at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { motion: 'no-preference' });

      try {
        // Each clear of the boundaries between types (0.296, 0.472, 0.648,
        // 0.824) and the stamp's (0.9), where a pixel's rounding could land
        // the two sites either side.
        for (const progress of [0, 0.1, 0.2, 0.33, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.95, 1, 0.5]) {
          await scrollToProgress(pages.reference, progress);
          await scrollToProgress(pages.rebuilt, progress);
          expect(await readCycle(pages.rebuilt), `at progress ${progress}`).toEqual(await readCycle(pages.reference));
        }
      } finally {
        await pages.close();
      }
    });
  }
});
