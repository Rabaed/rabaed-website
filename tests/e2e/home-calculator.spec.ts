/**
 * The home page's Delay-cost calculator (ticket 10, ticket 103 and ADR-0029):
 * three sliders — the project's value, the days of delay, how much of it is
 * built — and what that delay costs, with what has been spent so far.
 *
 * Asserted through what a visitor meets: the figures and words on the page as
 * the sliders move, what the sliders allow, and whether the numbers read in the
 * right order and typeface inside Arabic text; and through what an Editor
 * meets, the calculator's words changed in their one entry.
 *
 * The formula itself is tested directly in `tests/unit/delay-cost.spec.ts`;
 * this spec asks only that the sliders reach it. Whether the calculator looks
 * like the Reference site is asked in
 * `home-before-after-and-calculator-match-reference.spec.ts`; how far each
 * track is filled is asked here, because the fill follows the thumb where the
 * Reference site's does not (ticket 72).
 */
import type { Locator, Page } from '@playwright/test';
import { PNG } from 'pngjs';
import { readCalculator } from './delay-calculator';
import { test, expect } from './entries';

const calculator = (page: Page) => page.locator('#calc');
const slider = (page: Page, name: string) => calculator(page).getByRole('slider', { name: new RegExp(name) });
const projectValue = (page: Page) => slider(page, 'قيمة المشروع');
const delayDays = (page: Page) => slider(page, 'أيام التأخير');
const progress = (page: Page) => slider(page, 'نسبة الإنجاز');
const result = (page: Page) => calculator(page).locator('.out b');
const spentLine = (page: Page) => calculator(page).locator('.out small').nth(1);

/** What the calculator says: the cost, what has been spent, and the three sliders' readings. */
async function readFigures(page: Page) {
  const { cost, spent, readings } = await readCalculator(page);
  return { cost, spent, readings };
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

test('the calculator, in Ahmed’s words, and its opening figures are in the first response', async ({ request }) => {
  const html = await (await request.get('/')).text();

  expect(html).toContain('كم يكلّفك أسبوع تأخير اعتماد واحد؟');
  expect(html).toContain('ما صرفته على المشروع لا يعود إليك إلا عند التسليم.');
  expect(html).toContain('نسبة الإنجاز اليوم');
  expect(html).toContain('الافتراضات: تكلفة المال 8% سنوياً');
  expect(html).toContain('احجز عرضاً لترى كيف نمنعه');
  // The figures for the sliders' starting positions, worked out on the server.
  for (const figure of ['46,027', 'على 30,000,000 ر.س مصروفة حتى الآن', '60,000,000']) {
    expect(html).toContain(figure);
  }
  // Ahmed's method has no financing and site overhead to split the cost into (ADR-0029).
  expect(html).not.toContain('تكاليف عامة للموقع');
});

test('the sliders allow what ADR-0029 allows, and start where it starts', async ({ page }) => {
  await page.goto('/');

  for (const [control, range] of [
    [projectValue(page), { min: '1000000', max: '300000000', step: '1000000', value: '60000000' }],
    [delayDays(page), { min: '1', max: '60', step: '1', value: '7' }],
    [progress(page), { min: '5', max: '100', step: '5', value: '50' }],
  ] as const) {
    expect(await control.evaluate((input: HTMLInputElement) => ({ min: input.min, max: input.max, step: input.step, value: input.value }))).toEqual(range);
  }
  expect(await readFigures(page)).toEqual({
    cost: '46,027 ر.س',
    spent: 'على 30,000,000 ر.س مصروفة حتى الآن',
    readings: ['60,000,000 ر.س', '7 أيام', '50%'],
  });
});

test('moving a slider changes the cost, and what has been spent, at once', async ({ page }) => {
  await page.goto('/');

  // 30,000,000 spent × 8% ÷ 365 × 14
  await delayDays(page).fill('14');
  expect(await readFigures(page)).toEqual({
    cost: '92,055 ر.س',
    spent: 'على 30,000,000 ر.س مصروفة حتى الآن',
    readings: ['60,000,000 ر.س', '14 يوماً', '50%'],
  });

  // 60,000,000 spent × 8% ÷ 365 × 14
  await progress(page).fill('100');
  expect(await readFigures(page)).toEqual({
    cost: '184,110 ر.س',
    spent: 'على 60,000,000 ر.س مصروفة حتى الآن',
    readings: ['60,000,000 ر.س', '14 يوماً', '100%'],
  });

  // One of Ahmed's acceptance cases: 200,000,000 at 50% for 7 days.
  await projectValue(page).fill('200000000');
  await delayDays(page).fill('7');
  await progress(page).fill('50');
  expect(await readFigures(page)).toEqual({
    cost: '153,425 ر.س',
    spent: 'على 100,000,000 ر.س مصروفة حتى الآن',
    readings: ['200,000,000 ر.س', '7 أيام', '50%'],
  });
});

test('the sliders can be moved from the keyboard', async ({ page }) => {
  await page.goto('/');

  await delayDays(page).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect((await readFigures(page)).readings[1]).toBe('10 أيام');
  await page.keyboard.press('ArrowRight');
  expect((await readFigures(page)).readings[1]).toBe('11 يوماً');

  // Progress moves in fives.
  await progress(page).focus();
  await page.keyboard.press('ArrowRight');
  expect((await readFigures(page)).readings[2]).toBe('55%');
  await expect(progress(page)).toHaveAttribute('aria-valuetext', '55%');
});

test('the words after the days follow how Arabic counts, and progress reads as a percentage', async ({ page }) => {
  await page.goto('/');

  // One, two, three to ten, and eleven and more each take their own word. The
  // founders chose Arabic's rule over the Reference site's «1 أيام» (ticket 58).
  for (const [days, reading] of [
    ['1', '1 يوم'],
    ['2', '2 يومان'],
    ['3', '3 أيام'],
    ['10', '10 أيام'],
    ['11', '11 يوماً'],
    ['60', '60 يوماً'],
  ] as const) {
    await delayDays(page).fill(days);
    expect((await readFigures(page)).readings[1], `${days} days`).toBe(reading);
  }
  for (const [percent, reading] of [
    ['5', '5%'],
    ['35', '35%'],
    ['100', '100%'],
  ] as const) {
    await progress(page).fill(percent);
    expect((await readFigures(page)).readings[2], `${percent}%`).toBe(reading);
  }
});

test('the numbers read in the right order and typeface inside the Arabic', async ({ page }) => {
  await page.goto('/');
  await calculator(page).scrollIntoViewIfNeeded();

  // «46,027 ر.س» and «7 أيام»: the number first, which reading right to left
  // puts it to the right of the word; the number in DM Mono, which has no
  // Arabic, and the word in the Arabic face.
  for (const [figure, number, word] of [
    [result(page), '46,027', 'ر.س'],
    [calculator(page).locator('.lr b').nth(0), '60,000,000', 'ر.س'],
    [calculator(page).locator('.lr b').nth(1), '7', 'أيام'],
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
  // «50%» is a number alone, all of it in DM Mono.
  expect(await readRuns(calculator(page).locator('.lr b').nth(2))).toEqual([
    expect.objectContaining({ text: '50%', face: expect.stringMatching(/^"DM Mono"/) }),
  ]);

  // What has been spent is one line of Arabic with a number in it, read right to left.
  const [on, amount, currency, spent] = await placesOf(spentLine(page), ['على', '30,000,000', 'ر.س', 'مصروفة']);
  expect(on.left).toBeGreaterThanOrEqual(amount.right - 0.5);
  expect(amount.left).toBeGreaterThanOrEqual(currency.right - 0.5);
  expect(currency.left).toBeGreaterThanOrEqual(spent.right - 0.5);
});

test('an Editor’s change to the calculator’s words reaches the home page', async ({ page, cms }) => {
  // One entry for every page that shows the calculator (ADR-0029). Saved as a
  // draft and seen in the preview, so no other suite reading the home page
  // meets it.
  const words = cms.entry('delay-calculator');
  const entry = await words.published();
  const heading = `${entry.calculator.heading.ar} مسودة`;
  const { calculator: drafted } = entry;

  await words.draft({
    ...entry,
    calculator: {
      ...drafted,
      heading: { ...drafted.heading, ar: heading },
      sliderLabels: { ...drafted.sliderLabels, progress: { ...drafted.sliderLabels.progress, ar: 'ما أُنجز' } },
      spent: { ...drafted.spent, ar: 'صُرف منها {amount} ر.س' },
    },
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await cms.preview('/');
  await expect(calculator(page).locator('h2')).toHaveText(heading);
  await expect(spentLine(page)).toHaveText('صُرف منها 30,000,000 ر.س');
  // The browser redraws the line in the drafted words too.
  await slider(page, 'ما أُنجز').fill('100');
  await expect(spentLine(page)).toHaveText('صُرف منها 60,000,000 ر.س');
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

/**
 * Where a slider is drawn, read off its pixels along the bar's middle row: the
 * bar's two ends, the thumb's two edges, found by its white ring, and where
 * the orange fill ends. The thumb's inside, which covers the end of the fill,
 * is made see-through for the one screenshot, so that everything is read from
 * the same picture; its ring is kept. Positions are in pixels from the bar's
 * left end, and `width` is the bar's — measured from the bar's own ends rather
 * than the screenshot's, which are rounded out to whole pixels.
 */
async function readSliderPixels(control: Locator) {
  const page = control.page();
  const seeThrough = await page.addStyleTag({
    content: `#calc .rng::-webkit-slider-thumb { background: transparent; box-shadow: none }`,
  });
  const shot = await control.screenshot({ animations: 'disabled' });
  await seeThrough.evaluate((style) => (style as HTMLStyleElement).remove());
  const png = PNG.sync.read(shot);

  const y = Math.floor(png.height / 2);
  const pixel = (x: number) => [...png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 3)];
  const columns = [...Array(png.width).keys()];
  /** The thumb's ring and the card behind the bar. */
  const isWhite = (x: number) => pixel(x).every((channel) => channel > 250);
  /** The accent, #F95738, and nothing near the pale grey of the unfilled bar. */
  const isAccent = (x: number) => {
    const [r, g, b] = pixel(x);
    return r > 220 && g < 130 && b < 100;
  };

  // The bar's grey border is its first and last column that is not white.
  const bar = columns.filter((x) => !isWhite(x));
  const [barLeft, barRight] = [bar[0], bar.at(-1)! + 1];
  const ring = columns.filter((x) => x > barLeft && x < barRight - 1 && isWhite(x));
  const orange = columns.filter(isAccent);

  return {
    width: barRight - barLeft,
    thumbLeft: ring[0] - barLeft,
    thumbRight: ring.at(-1)! + 1 - barLeft,
    fillEnd: orange.length === 0 ? 0 : orange.at(-1)! + 1 - barLeft,
  };
}

// The Reference site paints the fill across the whole bar but lets the thumb
// travel only inside the bar's padding, so the two agree at the middle alone:
// near the start the thumb runs ahead of an empty fill, and at the end it stops
// short of the bar's edge (ticket 72).
for (const width of [1440, 390]) {
  test(`at ${width}px, each slider's thumb reaches both ends of its bar, and the fill ends under the thumb's middle`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    for (const [control, { min, max, between }] of [
      [projectValue(page), { min: '1000000', max: '300000000', between: '71000000' }],
      [delayDays(page), { min: '1', max: '60', between: '9' }],
      [progress(page), { min: '5', max: '100', between: '35' }],
    ] as const) {
      await control.scrollIntoViewIfNeeded();
      for (const value of [min, max, between]) {
        await control.fill(value);
        await control.blur();
        const drawn = await readSliderPixels(control);
        const where = `${await control.getAttribute('aria-valuetext')}`;

        expect(Math.abs(drawn.fillEnd - (drawn.thumbLeft + drawn.thumbRight) / 2), `${where}: fill against the thumb's middle`).toBeLessThanOrEqual(1);
        // Past the bar's 1px border, and a pixel either way for the ring's
        // anti-aliased edge.
        if (value === min) expect(drawn.thumbLeft, `${where}: thumb at the left end`).toBeLessThanOrEqual(2);
        if (value === max) expect(drawn.width - drawn.thumbRight, `${where}: thumb at the right end`).toBeLessThanOrEqual(2);
      }
    }
  });
}
