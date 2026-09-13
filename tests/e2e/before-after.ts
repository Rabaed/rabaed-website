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
 * Everything the seam's position decides: the position itself, as the
 * comparison carries it and as the handle announces it; every face's opacity
 * and transform, column by column, the usual way's face before Rabaed's; the
 * three verdicts, bad, good and half-way; and the two tags, the usual way's
 * and Rabaed's.
 */
export function readSeam(page: Page) {
  return page.evaluate(() => {
    const comparison = document.querySelector<HTMLElement>('#ba .cmp')!;
    const opacity = (element: Element) => getComputedStyle(element).opacity;
    return {
      position: comparison.style.getPropertyValue('--p'),
      announced: comparison.querySelector('[role="slider"]')!.getAttribute('aria-valuenow'),
      faces: [...comparison.querySelectorAll('.face')].map((face) => ({
        opacity: opacity(face),
        transform: getComputedStyle(face).transform,
      })),
      verdicts: [...document.querySelectorAll('#ba .cmp-verdict')].map(opacity),
      tags: [...comparison.querySelectorAll('.cmp-tag')].map(opacity),
    };
  });
}
