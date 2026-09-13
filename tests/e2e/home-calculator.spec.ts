/**
 * The home page's delay-cost calculator (ticket 10): three sliders — the
 * project's value, the days of delay, the project's length in months — and
 * what that delay costs, with its two parts.
 *
 * Asserted through what a visitor meets: the figures and words on the page as
 * the sliders move, what the sliders allow, and whether the numbers read in the
 * right order and typeface inside Arabic text.
 *
 * The formula itself is tested directly in `tests/unit/delay-cost.spec.ts`;
 * this spec asks only that the sliders reach it. Whether the calculator looks
 * like the Reference site, track colouring included, is asked in
 * `home-before-after-and-calculator-match-reference.spec.ts`.
 */
import { test, expect, type Locator, type Page } from '@playwright/test';
import { readCalculator } from './delay-calculator';

const calculator = (page: Page) => page.locator('#calc');
const slider = (page: Page, name: string) => calculator(page).getByRole('slider', { name: new RegExp(name) });
const projectValue = (page: Page) => slider(page, 'قيمة المشروع');
const delayDays = (page: Page) => slider(page, 'أيام التأخير');
const duration = (page: Page) => slider(page, 'مدة المشروع');
const result = (page: Page) => calculator(page).locator('.out b');

/** What the calculator says: the cost, its two parts, and the three sliders' readings. */
async function readFigures(page: Page) {
  const { cost, parts, readings } = await readCalculator(page);
  return { cost, parts, readings };
}

/**
 * Each run of text inside `locator` — a line broken wherever the typeface
 * changes — with where it is drawn and in what face.
 */
function readRuns(locator: Locator) {
  return locator.evaluate((element) => {
    const runs: { text: string; left: number; right: number; face: string }[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent!.trim();
      if (!text) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const box = range.getBoundingClientRect();
      runs.push({ text, left: box.left, right: box.right, face: getComputedStyle(node.parentElement!).fontFamily });
    }
    return runs;
  });
}

/** Where each of `phrases` is drawn inside `locator`'s text. */
function placesOf(locator: Locator, phrases: string[]) {
  return locator.evaluate((element, wanted) => {
    const node = element.firstChild!;
    const text = node.textContent!;
    return wanted.map((phrase) => {
      const range = document.createRange();
      const start = text.indexOf(phrase);
      range.setStart(node, start);
      range.setEnd(node, start + phrase.length);
      const box = range.getBoundingClientRect();
      return { left: box.left, right: box.right };
    });
  }, phrases);
}

test('the calculator and its opening figures are in the first response', async ({ request }) => {
  const html = await (await request.get('/')).text();

  expect(html).toContain('كم يكلفك أسبوع تأخير اعتماد واحد؟');
  expect(html).toContain('تقدير محافظ يشمل تكلفة التمويل والتكاليف العامة للموقع فقط');
  expect(html).toContain('الافتراضات: تكلفة تمويل 8% سنوياً');
  expect(html).toContain('احجز عرضاً لترى كيف نمنعه');
  // The figures for the sliders' starting positions, worked out on the server.
  for (const figure of ['84,405', '46,027', '38,377', '30,000,000']) {
    expect(html).toContain(figure);
  }
});

test('the sliders allow what the Reference site allows, and start where it starts', async ({ page }) => {
  await page.goto('/');

  for (const [control, range] of [
    [projectValue(page), { min: '1000000', max: '300000000', step: '1000000', value: '30000000' }],
    [delayDays(page), { min: '1', max: '60', step: '1', value: '7' }],
    [duration(page), { min: '6', max: '48', step: '1', value: '18' }],
  ] as const) {
    expect(await control.evaluate((input: HTMLInputElement) => ({ min: input.min, max: input.max, step: input.step, value: input.value }))).toEqual(range);
  }
  expect(await readFigures(page)).toEqual({
    cost: '84,405 ر.س',
    parts: 'تمويل 46,027 + تكاليف عامة للموقع 38,377',
    readings: ['30,000,000 ر.س', '7 أيام', '18 شهراً'],
  });
});

test('moving a slider changes the cost at once', async ({ page }) => {
  await page.goto('/');

  await delayDays(page).fill('14');
  expect(await readFigures(page)).toEqual({
    cost: '168,809 ر.س',
    parts: 'تمويل 92,055 + تكاليف عامة للموقع 76,754',
    readings: ['30,000,000 ر.س', '14 يوماً', '18 شهراً'],
  });

  await duration(page).fill('24');
  expect(await readFigures(page)).toEqual({
    cost: '149,621 ر.س',
    parts: 'تمويل 92,055 + تكاليف عامة للموقع 57,566',
    readings: ['30,000,000 ر.س', '14 يوماً', '24 شهراً'],
  });

  await projectValue(page).fill('50000000');
  expect(await readFigures(page)).toEqual({
    cost: '249,368 ر.س',
    parts: 'تمويل 153,425 + تكاليف عامة للموقع 95,943',
    readings: ['50,000,000 ر.س', '14 يوماً', '24 شهراً'],
  });
});

test('the sliders can be moved from the keyboard', async ({ page }) => {
  await page.goto('/');

  await delayDays(page).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  // Ten days is still «أيام»; eleven is «يوماً», as on the Reference site.
  expect((await readFigures(page)).readings[1]).toBe('10 أيام');
  await page.keyboard.press('ArrowRight');
  expect((await readFigures(page)).readings[1]).toBe('11 يوماً');
});

test('the numbers read in the right order and typeface inside the Arabic', async ({ page }) => {
  await page.goto('/');
  await calculator(page).scrollIntoViewIfNeeded();

  // «84,405 ر.س» and «7 أيام»: the number first, which reading right to left
  // puts it to the right of the word; the number in DM Mono, which has no
  // Arabic, and the word in the Arabic face.
  for (const [figure, number, word] of [
    [result(page), '84,405', 'ر.س'],
    [calculator(page).locator('.lr b').nth(0), '30,000,000', 'ر.س'],
    [calculator(page).locator('.lr b').nth(1), '7', 'أيام'],
    [calculator(page).locator('.lr b').nth(2), '18', 'شهراً'],
  ] as const) {
    const runs = await readRuns(figure);
    const digits = runs.find((run) => run.text === number)!;
    const arabic = runs.find((run) => run.text === word)!;
    expect(digits, `«${number}» is its own run`).toBeTruthy();
    expect(arabic, `«${word}» is its own run`).toBeTruthy();
    expect(digits.face, `«${number}»`).toMatch(/^"DM Mono"/);
    expect(arabic.face, `«${word}»`).toMatch(/^"IBM Plex Sans Arabic"/);
    expect(digits.left, `«${number}» is to the right of «${word}»`).toBeGreaterThanOrEqual(arabic.right - 0.5);
  }

  // The breakdown is one line of Arabic with numbers in it.
  const [financing, financingAmount, plus, overhead] = await placesOf(calculator(page).locator('.out small').nth(1), [
    'تمويل',
    '46,027',
    '+',
    'تكاليف',
  ]);
  expect(financing.left).toBeGreaterThanOrEqual(financingAmount.right - 0.5);
  expect(financingAmount.left).toBeGreaterThanOrEqual(plus.right - 0.5);
  expect(plus.left).toBeGreaterThanOrEqual(overhead.right - 0.5);
});

test('with JavaScript off, the sliders show their starting positions filled in', async ({ browser }) => {
  const read = async (javaScriptEnabled: boolean) => {
    const context = await browser.newContext({ javaScriptEnabled });
    const page = await context.newPage();
    await page.goto('/');
    const calculatorNow = await readCalculator(page);
    await context.close();
    return calculatorNow;
  };

  const off = await read(false);
  expect(off.tracks.every((track) => track.painted.startsWith('linear-gradient'))).toBe(true);
  expect(off).toEqual(await read(true));
});
