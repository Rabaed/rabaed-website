/**
 * The space above and below every section (ticket 71 and ADR-0019).
 *
 * The Reference site pads each section by 8% of the window's height, between
 * 56px and 96px. Where two sections meet, that is up to 192px of nothing, and
 * a tall monitor reached the ceiling. The ceiling is now 72px: 144px between
 * two sections at most.
 *
 * At every height the Reference comparisons are taken at — 900px tall and
 * less — 8% of the window is already 72px or less, so nothing they measure
 * moves. The second test says so, so that a later change to the rate or the
 * floor cannot hide behind the ceiling.
 */
import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './routes';

/** The sections padded by the shared spacing — `.pad`, and the two that set it themselves. */
const SPACED = '.pad, #pain, #custom';

function spacing(page: Page) {
  return page.locator(SPACED).evaluateAll((sections) =>
    sections.map((section) => {
      const style = getComputedStyle(section);
      return {
        section: section.id || section.className,
        top: parseFloat(style.paddingTop),
        bottom: parseFloat(style.paddingBottom),
      };
    }),
  );
}

test('stops growing at 72px on a tall screen, on every page that uses it', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  let counted = 0;
  for (const route of ROUTES) {
    await page.goto(route.path);
    for (const { section, top, bottom } of await spacing(page)) {
      expect({ section, top, bottom }, route.path).toEqual({ section, top: 72, bottom: 72 });
      counted++;
    }
  }
  // A selector that matched nothing would pass the loop above on every page.
  expect(counted).toBeGreaterThan(10);

  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto('/');
  for (const { section, top } of await spacing(page)) {
    expect({ section, top }).toEqual({ section, top: 72 });
  }
});

test('is unchanged at the heights the Reference comparisons are taken at', async ({ page }) => {
  await page.goto('/');

  // 8% of the window, between the 56px floor and the ceiling.
  for (const [height, expected] of [
    [900, 72],
    [800, 64],
    [600, 56],
  ]) {
    await page.setViewportSize({ width: 1280, height });
    const [first] = await spacing(page);
    expect(first.top, `at 1280x${height}`).toBeCloseTo(expected, 1);
  }
});
