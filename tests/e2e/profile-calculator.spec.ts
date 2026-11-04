/**
 * The Delay-cost calculator on the Company profile (ticket 106, ADR-0029):
 * section 05, «التكلفة الخفية» (`#cost`), the home page's calculator with the
 * words of the one entry both pages read, its button's among them. Where the
 * button goes is the profile's Editor's, as every button's link on the page is
 * (spec: Buttons and links), and the profile has its own switch to show it.
 *
 * How the calculator itself behaves — its ranges, its count words, its
 * typefaces — is `home-calculator.spec.ts`'s; the formula is
 * `tests/unit/delay-cost.spec.ts`'s. This spec asks that the profile shows the
 * same calculator, giving the same answer.
 *
 * The profile is not published on this server (`profile-page.spec.ts` runs on
 * the second): everything here is read in preview, from drafts that the
 * entries fixture puts back when each test ends.
 */
import type { Page } from '@playwright/test';
import { readCalculator } from './delay-calculator';
import { test, expect } from './entries';

// One after another: each test drafts the profile's one entry.
test.describe.configure({ mode: 'default' });

const section = (page: Page) => page.locator('section#cost');
const button = (page: Page) => section(page).locator('.out .btn');

/**
 * Every word the calculator in section `id` shows around its figures. Compared
 * between the two pages rather than with Ahmed's words, because a preview
 * draws every entry's draft, and `home-calculator.spec.ts` drafts the shared
 * entry's words on this server while this suite runs.
 */
function readWords(page: Page, id: string) {
  return page.locator(`#${id}`).evaluate((calculator) => {
    const text = (element: Element) => element.textContent!.replace(/\s+/g, ' ').trim();
    const one = (selector: string) => text(calculator.querySelector(selector)!);
    return {
      eyebrow: one('.eyebrow'),
      heading: one('h2'),
      lead: one('.lead'),
      // A slider's name is its reading's line without the reading.
      names: [...calculator.querySelectorAll('.lr')].map((line) => text(line).slice(0, -text(line.querySelector('b')!).length).trim()),
      label: one('.out small'),
      note: one('.out .n'),
      button: one('.out .btn'),
    };
  });
}

/** A figure's number, without the words written around it, which a draft elsewhere may change. */
const numbers = (line: string) => line.match(/[\d,]+%?/g);

/** Sets the three sliders, in their order: the project's value, the days of delay, the progress. */
async function setSliders(page: Page, root: string, values: readonly [string, string, string]) {
  const sliders = page.locator(`#${root} input[type="range"]`);
  for (const [index, value] of values.entries()) await sliders.nth(index).fill(value);
}

test('the profile shows the home page’s calculator, in the shared entry’s words, its button going where its Editor says', async ({
  page,
  cms,
}) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  // The English page's button goes to the English demo form. The English page
  // itself is not previewed here: it is drawn only once the header and
  // footer's English is approved, which on this server would be every other
  // suite's preview too (`english-pages.spec.ts`).
  expect(saved.cost.callToActionLink).toEqual({ ar: '/#demo', en: '/en#demo' });

  await cms.preview('/profile');
  // A light section, as the home page's is, which the profile's header follows.
  await expect(section(page)).toHaveClass(/\blight\b/);
  // The calculator as it opens, worked out on the server.
  const opening = await readCalculator(page, 'cost');
  expect(numbers(opening.cost)).toEqual(['46,027']);
  expect(numbers(opening.spent)).toEqual(['30,000,000']);
  expect(opening.readings.map(numbers)).toEqual([['60,000,000'], ['7'], ['50%']]);
  // To the home page's demo form, since this page has none.
  await expect(button(page)).toHaveAttribute('href', '/#demo');
  await expect(button(page)).not.toHaveAttribute('target', /./);
  expect((await readWords(page, 'cost')).heading).not.toBe('');

  // Every word of it, the button's among them, is the home page's calculator's
  // — read again if another suite's draft of them came between the two pages.
  await expect(async () => {
    await page.goto('/profile');
    const words = await readWords(page, 'cost');
    await page.goto('/');
    expect(await readWords(page, 'calc')).toEqual(words);
  }).toPass();

  // Where the button goes is the profile's Editor's, on the profile alone, and
  // a link away from the site opens in a new tab. Its words stay the shared
  // entry's, which `home-calculator.spec.ts` shows an Editor changing.
  await profile.draft({
    ...saved,
    cost: { ...saved.cost, callToActionLink: { ...saved.cost.callToActionLink, ar: 'https://wa.me/966500000000?text=cost' } },
  });
  await cms.preview('/profile');
  await expect(button(page)).toHaveAttribute('href', 'https://wa.me/966500000000?text=cost');
  await expect(button(page)).toHaveAttribute('target', '_blank');
  await page.goto('/');
  await expect(page.locator('#calc .out .btn')).toHaveAttribute('href', '#demo');
  await expect(page.locator('#calc .out .btn')).not.toHaveAttribute('target', /./);
});

test('the same inputs give the same total on the profile and on the home page', async ({ page, cms }) => {
  await cms.preview('/profile');

  // 120,000,000 at 35% for 21 days: 42,000,000 spent × 8% ÷ 365 × 21.
  const settings = ['120000000', '21', '35'] as const;
  await expect(async () => {
    await page.goto('/profile');
    await setSliders(page, 'cost', settings);
    const onProfile = await readCalculator(page, 'cost');

    await page.goto('/');
    await setSliders(page, 'calc', settings);
    const onHome = await readCalculator(page, 'calc');

    expect(numbers(onProfile.cost)).toEqual(['193,315']);
    expect(numbers(onProfile.spent)).toEqual(['42,000,000']);
    // Word for word, unless another suite's draft of the words came between the two pages.
    expect({ cost: onHome.cost, spent: onHome.spent, readings: onHome.readings }).toEqual({
      cost: onProfile.cost,
      spent: onProfile.spent,
      readings: onProfile.readings,
    });
  }).toPass();
});

test('the profile’s switch hides its calculator and leaves the home page’s showing', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  await profile.draft({ ...saved, cost: { ...saved.cost, shows: false } });

  await cms.preview('/profile');
  await expect(page.locator('section#hero')).toBeVisible();
  await expect(section(page)).toHaveCount(0);

  await page.goto('/');
  await expect(page.locator('section#calc')).toBeVisible();
});
