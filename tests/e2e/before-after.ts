import type { Page } from '@playwright/test';

/**
 * Moving and reading the home page's before-and-after comparison (ticket 10) —
 * shared by the spec that asserts its behaviour and the one that compares it
 * with the Reference site, whose markup carries the same class names for every
 * part used here.
 */

/** Where on screen `fraction` of the way across the comparison, from its left edge, is. */
async function pointAcross(page: Page, fraction: number) {
  const comparison = page.locator('#ba .cmp');
  await comparison.scrollIntoViewIfNeeded();
  const box = (await comparison.boundingBox())!;
  return { x: box.x + box.width * fraction, y: box.y + box.height / 2 };
}

/** Presses on the comparison `from` of the way across, drags to `to`, and lets go. */
export async function dragSeam(page: Page, from: number, to: number) {
  const start = await pointAcross(page, from);
  const end = await pointAcross(page, to);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 8 });
  await page.mouse.up();
}

/**
 * Where the seam is drawn, as a percentage of the way across the comparison
 * from its left edge — measured from the handle's line on screen, which is
 * what a visitor sees move, rather than read from the page's own styles.
 * Written as a string of code so the same measurement can run inside a
 * sampling loop in the page.
 */
const SEAM_ON_SCREEN = `(() => {
  const comparison = document.querySelector('#ba .cmp').getBoundingClientRect();
  const line = document.querySelector('#ba .cmp-handle').getBoundingClientRect();
  return Math.round(((line.left + line.width / 2 - comparison.left) / comparison.width) * 10000) / 100;
})()`;

/** Where the seam is drawn now: see `SEAM_ON_SCREEN`. */
export function seamOnScreen(page: Page): Promise<number> {
  return page.evaluate(SEAM_ON_SCREEN);
}

/** Where the seam is drawn, every 50ms for `ms`. */
export function sampleSeamOnScreen(page: Page, ms: number): Promise<number[]> {
  return page.evaluate(
    async ({ duration, measure }) => {
      const samples: number[] = [];
      const end = performance.now() + duration;
      while (performance.now() < end) {
        samples.push((0, eval)(measure) as number);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return samples;
    },
    { duration: ms, measure: SEAM_ON_SCREEN },
  );
}

/**
 * Everything the seam's position decides: where it is drawn and what the
 * handle announces; every face's opacity and transform, column by column, the
 * usual way's face before Rabaed's; the three verdicts, bad, good and
 * half-way; and the two tags, the usual way's and Rabaed's.
 */
export async function readSeam(page: Page) {
  const drawnAt = await seamOnScreen(page);
  const state = await page.evaluate(() => {
    const comparison = document.querySelector<HTMLElement>('#ba .cmp')!;
    const opacity = (element: Element) => getComputedStyle(element).opacity;
    return {
      announced: comparison.querySelector('[role="slider"]')!.getAttribute('aria-valuenow'),
      faces: [...comparison.querySelectorAll('.face')].map((face) => ({
        opacity: opacity(face),
        transform: getComputedStyle(face).transform,
      })),
      verdicts: [...document.querySelectorAll('#ba .cmp-verdict')].map(opacity),
      tags: [...comparison.querySelectorAll('.cmp-tag')].map(opacity),
    };
  });
  return { drawnAt, ...state };
}
