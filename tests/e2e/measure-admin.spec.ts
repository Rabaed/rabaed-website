/**
 * TEMPORARY — ticket 61's measurement, removed before the ticket is finished.
 *
 * Times what the failing assertion waits for: the admin re-rendering a tab's
 * panel after its button is clicked. It never fails, so it cannot turn a run
 * red; it prints a distribution, which is the number ticket 61 has to be sized
 * from. Run on a hosted runner, because that is the machine the budget is for.
 *
 * What CI run 35529201175 showed at the moment of failure: the tab's button
 * was already `[active]` while the panel still held the Hero's fields. The
 * button's state flips in a cheap render; the panel is a whole form of blocks
 * and arrays, and that is the render that lagged past five seconds.
 */
import { test, expect, type Page } from '@playwright/test';
import { ADMIN_PATH, HOME_EDITOR, logInAs } from './cms';

const SECTIONS = ['Trust strip', 'Situations', 'Units', 'Record', 'Before and after', 'Delay calculator', 'Figures', 'Questions'];

/** Long enough that the measurement records the wait rather than being cut short by it. */
const CEILING = 120_000;

async function took(work: () => Promise<unknown>): Promise<number> {
  const started = Date.now();
  await work();
  return Date.now() - started;
}

function report(label: string, times: readonly number[]): void {
  const sorted = [...times].sort((a, b) => a - b);
  // No p99: there are tens of samples, not hundreds, so a p99 would only be
  // the maximum wearing a percentile's name.
  const at = (fraction: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
  console.log(`[measure] ${label}: n=${sorted.length} min=${sorted[0]} p50=${at(0.5)} p90=${at(0.9)} max=${sorted.at(-1)}`);
}

async function openHomePage(page: Page): Promise<number> {
  return took(async () => {
    await page.goto(`${ADMIN_PATH}/globals/home-page`);
    await expect(page.getByRole('button', { name: 'Hero', exact: true })).toBeVisible({ timeout: CEILING });
  });
}

test('measure: the admin re-renders a tab panel after a click', async ({ page }) => {
  test.setTimeout(900_000);
  await logInAs(page, HOME_EDITOR);

  const paints: number[] = [];
  const renders: number[] = [];

  // Several visits, because the first tab after a fresh load is the one that
  // failed on CI, and a warm admin is not the same machine as a cold one.
  for (let visit = 1; visit <= 4; visit++) {
    paints.push(await openHomePage(page));
    for (const section of SECTIONS) {
      await page.getByRole('button', { name: section, exact: true }).click();
      renders.push(await took(() => expect(page.getByLabel('Shows on the page')).toBeVisible({ timeout: CEILING })));
      // Back to the Hero, so each measurement is a real switch of panels.
      await page.getByRole('button', { name: 'Hero', exact: true }).click();
      await expect(page.getByText(/Always shows/)).toBeVisible({ timeout: CEILING });
    }
  }

  report('goto to the tabs painted', paints);
  report('tab click to its panel rendered', renders);
});
