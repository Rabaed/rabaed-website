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
 * like the Reference site is asked in
 * `home-before-after-and-calculator-match-reference.spec.ts`; how far each
 * track is filled is asked here, because the fill follows the thumb where the
 * Reference site's does not (ticket 72).
 */
import { test, expect, type Locator, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import { readCalculator } from './delay-calculator';
import { sidewaysOverflow } from './geometry';

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
  expect((await readFigures(page)).readings[1]).toBe('10 أيام');
  await page.keyboard.press('ArrowRight');
  expect((await readFigures(page)).readings[1]).toBe('11 يوماً');
});

test('the words after the days and the months follow how Arabic counts', async ({ page }) => {
  await page.goto('/');

  // One, two, three to ten, and eleven and more each take their own word. The
  // founders chose Arabic's rule over the Reference site's «1 أيام» and
  // «6 شهراً» (ticket 58).
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
  for (const [months, reading] of [
    ['6', '6 أشهر'],
    ['10', '10 أشهر'],
    ['11', '11 شهراً'],
    ['48', '48 شهراً'],
  ] as const) {
    await duration(page).fill(months);
    expect((await readFigures(page)).readings[2], `${months} months`).toBe(reading);
  }
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

/**
 * Where a slider is drawn, read off its pixels along the bar's middle row: the
 * bar's two ends, the thumb's two edges, found by its white ring, and where
 * the orange fill ends. The thumb's inside, which covers the end of the fill,
 * is made see-through for the one screenshot, so that everything is read from
 * the same picture; its ring is kept. Positions are in pixels from the bar's
 * left end, and `width` is the bar's.
 *
 * At phone width the home page briefly grows a few pixels wider than the
 * window while its animations run. The page reads right to left, so the extra
 * width opens on the left, and a screenshot taken then is cut from a place that
 * many pixels to one side of the slider. So the screenshot waits for the page
 * to fit the window again, and the bar is still measured from its own ends
 * rather than the screenshot's, which are rounded out to whole pixels.
 */
async function readSliderPixels(control: Locator) {
  const page = control.page();
  const seeThrough = await page.addStyleTag({
    content: `#calc .rng::-webkit-slider-thumb { background: transparent; box-shadow: none }`,
  });
  let shot: Buffer | undefined;
  await expect
    .poll(async () => {
      if ((await sidewaysOverflow(page)) > 0) return false;
      shot = await control.screenshot({ animations: 'disabled' });
      return (await sidewaysOverflow(page)) <= 0;
    }, { message: 'the page fits the window while the slider is photographed' })
    .toBe(true);
  await seeThrough.evaluate((style) => (style as HTMLStyleElement).remove());
  const png = PNG.sync.read(shot!);

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
      [duration(page), { min: '6', max: '48', between: '40' }],
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
