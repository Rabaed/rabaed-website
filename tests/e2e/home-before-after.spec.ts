/**
 * The home page's before-and-after comparison (ticket 10): four moments in one
 * material approval, each shown the usual way or Rabaed's, and a seam the
 * visitor drags across them. Every step on Rabaed's side of the seam — the
 * right, reading right to left, where the steps begin — shows Rabaed's way.
 *
 * Asserted through what a visitor meets: which face of each step can be seen,
 * which verdict is showing, what the handle announces, and whether the seam
 * moves by pointer, by keyboard, and by itself once as a hint.
 *
 * Whether the faces cross over exactly as on the Reference site is asked in
 * `home-before-after-and-calculator-match-reference.spec.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { dragSeam, readSeam } from './before-after';

/** A phrase from each step's two faces, in order. */
const STEPS = [
  { name: 'الطلب', usual: 'يُطبع، يُوقَّع باليد', rabaed: 'برقم مرجعي ومرفقاته' },
  { name: 'الاستلام', usual: 'أرسله إيميل رسمي', rabaed: 'لا أحد ينكره' },
  { name: 'الاعتماد', usual: 'رد بعد أسبوع', rabaed: 'والمالك يرى الحالة لحظياً' },
  { name: 'بعد شهرين', usual: 'ما وصلتني الموافقة', rabaed: 'الدليل: السجل نفسه.' },
] as const;

const VERDICTS = {
  usual: 'النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.',
  rabaed: 'النتيجة: لا سؤال "من اعتمد؟" — الإجابة داخل المستند.',
  between: 'اسحب المقبض حتى النهاية لترى الخطوات الأربع في ربائد.',
} as const;

const handle = (page: Page) => page.locator('#ba').getByRole('slider', { name: 'اسحب للمقارنة بين الطريقتين' });

async function announced(page: Page) {
  return Number(await handle(page).getAttribute('aria-valuenow'));
}

/** For each step, which of its faces can be seen, and which side of the seam its column's centre is on. */
function readSteps(page: Page) {
  return page.evaluate(() => {
    const seam = document.querySelector('#ba [role="slider"]')!.getBoundingClientRect();
    const seamX = seam.left + seam.width / 2;
    return [...document.querySelectorAll('#ba .cmp-col')].map((column) => {
      const box = column.getBoundingClientRect();
      return {
        rightOfSeam: box.left + box.width / 2 > seamX,
        usual: getComputedStyle(column.querySelector('.fb')!).opacity,
        rabaed: getComputedStyle(column.querySelector('.fa')!).opacity,
      };
    });
  });
}

/** Every step shows Rabaed's way if it is right of the seam, and the usual way if it is left of it. */
async function expectStepsFollowTheSeam(page: Page) {
  for (const [index, step] of (await readSteps(page)).entries()) {
    expect(step, `${STEPS[index].name}`).toEqual({
      rightOfSeam: step.rightOfSeam,
      usual: step.rightOfSeam ? '0' : '1',
      rabaed: step.rightOfSeam ? '1' : '0',
    });
  }
}

/** Only `showing` of the three verdicts can be seen — once their quarter-second fade has finished. */
async function expectVerdict(page: Page, showing: keyof typeof VERDICTS) {
  for (const [which, text] of Object.entries(VERDICTS)) {
    const verdict = page.locator('#ba').getByText(text, { exact: true });
    await expect
      .poll(() => verdict.evaluate((element) => getComputedStyle(element).opacity), { message: which })
      .toBe(which === showing ? '1' : '0');
  }
}

/** The seam's position, read every 50ms for `ms` — as numbers, from the comparison's own `--p`. */
function sampleSeam(page: Page, ms: number) {
  return page.evaluate(async (duration) => {
    const comparison = document.querySelector<HTMLElement>('#ba .cmp')!;
    const samples: number[] = [];
    const end = performance.now() + duration;
    while (performance.now() < end) {
      samples.push(parseFloat(comparison.style.getPropertyValue('--p')));
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return samples;
  }, ms);
}

/** Scrolls until the comparison's section is well into the window, past where its hint starts. */
async function scrollToComparison(page: Page) {
  await page.evaluate(() => {
    const section = document.getElementById('ba')!;
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4);
  });
}

test('the whole comparison is in the first response', async ({ request }) => {
  const html = await (await request.get('/')).text();

  expect(html).toContain('نفس الاعتماد… بطريقتين.');
  expect(html).toContain('اسحب المقبض');
  expect(html).toContain('الطريقة المعتادة');
  expect(html).toContain('مع ربائد');
  for (const step of STEPS) {
    expect(html).toContain(step.name);
    expect(html).toContain(step.usual);
    expect(html).toContain(step.rabaed);
  }
  expect(html).toContain('النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.');
  expect(html).toContain('النتيجة: لا سؤال &quot;من اعتمد؟&quot; — الإجابة داخل المستند.');
  expect(html).toContain(VERDICTS.between);
});

test.describe('with reduced motion, so the hint does not move the seam', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 900 },
  ]) {
    test(`at ${viewport.width}x${viewport.height} dragging the seam turns every step it passes`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // It opens half-way.
      await expectStepsFollowTheSeam(page);
      await expectVerdict(page, 'between');
      expect(await announced(page)).toBe(50);

      // All the way left: every step is right of the seam.
      await dragSeam(page, 0.5, 0.01);
      await expectStepsFollowTheSeam(page);
      expect((await readSteps(page)).every((step) => step.rabaed === '1')).toBe(true);
      await expectVerdict(page, 'rabaed');
      expect(await announced(page)).toBeLessThanOrEqual(1);

      // All the way right: none is.
      await dragSeam(page, 0.01, 0.99);
      await expectStepsFollowTheSeam(page);
      expect((await readSteps(page)).every((step) => step.usual === '1')).toBe(true);
      await expectVerdict(page, 'usual');
      expect(await announced(page)).toBeGreaterThanOrEqual(99);

      // Back to the middle: some are, some are not.
      await dragSeam(page, 0.99, 0.5);
      await expectStepsFollowTheSeam(page);
      await expectVerdict(page, 'between');
    });
  }

  test('pressing anywhere on the comparison brings the seam there', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await dragSeam(page, 0.25, 0.25);
    expect(await announced(page)).toBeGreaterThanOrEqual(24);
    expect(await announced(page)).toBeLessThanOrEqual(26);
    await expectStepsFollowTheSeam(page);
  });

  test('the arrow keys move the seam, and stop at either end', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await handle(page).focus();
    await page.keyboard.press('ArrowLeft');
    expect(await announced(page)).toBe(44);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    expect(await announced(page)).toBe(56);

    // Each press is 6%, so nine from 50 would pass 0.
    for (let press = 0; press < 12; press += 1) await page.keyboard.press('ArrowLeft');
    expect(await announced(page)).toBe(0);
    await expectVerdict(page, 'rabaed');

    for (let press = 0; press < 20; press += 1) await page.keyboard.press('ArrowRight');
    expect(await announced(page)).toBe(100);
    await expectVerdict(page, 'usual');
  });

  test('the seam does not sweep across by itself', async ({ page }) => {
    await page.goto('/');
    await scrollToComparison(page);

    expect(new Set(await sampleSeam(page, 3000))).toEqual(new Set([50]));
  });

  test('the steps still follow the seam after the window changes size', async ({ page }) => {
    // Which side of the seam a step is on depends on where its column is, and
    // the columns go from four across to two across below 981px.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await dragSeam(page, 0.5, 0.3);

    await page.setViewportSize({ width: 390, height: 900 });
    await dragSeam(page, 0.3, 0.6);
    await expectStepsFollowTheSeam(page);
    await dragSeam(page, 0.6, 0.4);
    await expectStepsFollowTheSeam(page);
  });

  test('with JavaScript off, the comparison opens as it does with it on', async ({ browser }) => {
    const read = async (javaScriptEnabled: boolean) => {
      const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto('/');
      await page.locator('#ba').scrollIntoViewIfNeeded();
      const seam = await readSeam(page);
      const steps = await readSteps(page);
      await context.close();
      // What can be seen: opacities, not the transforms that tuck a hidden face away.
      return { opacities: seam.faces.map((face) => face.opacity), verdicts: seam.verdicts, tags: seam.tags, steps };
    };

    expect(await read(false)).toEqual(await read(true));
  });
});

test('once, when the comparison first comes into view, the seam sweeps across and back to the middle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await scrollToComparison(page);

  const samples = await sampleSeam(page, 4500);
  // It jumps to the right and eases away at once, so a sample every 50ms
  // catches it just short of the edge rather than on it.
  const reachedRight = samples.findIndex((position) => position >= 99);
  const reachedLeft = samples.findIndex((position) => position <= 1);
  expect(reachedRight, 'it never went all the way right').toBeGreaterThanOrEqual(0);
  expect(reachedLeft, 'it never went all the way left').toBeGreaterThan(reachedRight);
  expect(samples.at(-1)).toBe(50);
  // It is a hint, not a setting: the handle does not announce the sweep.
  expect(await announced(page)).toBe(50);

  // Not again.
  await page.evaluate(() => window.scrollTo(0, 0));
  await scrollToComparison(page);
  expect(new Set(await sampleSeam(page, 2500))).toEqual(new Set([50]));
});

test('taking hold of the seam stops the hint', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await scrollToComparison(page);

  // Once the sweep is on its way from the right…
  await expect.poll(async () => parseFloat((await readSeam(page)).position), { intervals: [50] }).toBeLessThan(80);
  // To 26%: clear of the columns centred at 14% and 38%, so every step is
  // wholly one way or the other.
  await dragSeam(page, 0.9, 0.26);
  const settled = await announced(page);

  // …it stays where the visitor put it.
  expect(new Set(await sampleSeam(page, 3000)).size).toBe(1);
  expect(await announced(page)).toBe(settled);
  await expectStepsFollowTheSeam(page);
});

test('the comparison still works after leaving the page and coming back', async ({ page }) => {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await dragSeam(page, 0.5, 0.2);

  await page.getByRole('link', { name: 'شاهد الوحدات كاملة بالتفصيل' }).click();
  await page.waitForURL((url) => url.pathname === '/product');
  await page.goBack();
  await page.waitForURL((url) => url.pathname === '/');

  // All the way right — clear of the last column's centre, at 86%, where a
  // step is still part of the way over.
  await dragSeam(page, 0.5, 0.98);
  await expectStepsFollowTheSeam(page);
  await expectVerdict(page, 'usual');
  expect(problems).toEqual([]);
});
