/**
 * "Matches baselines at all eight widths", "the column flip band matches the
 * Reference site" and "slider ranges match the Reference site; the track
 * repaints as values change" for the before-and-after comparison and the
 * delay-cost calculator (ticket 10), measured against the Reference site
 * itself for the reasons in `shell-matches-reference.spec.ts`.
 *
 * **At rest**, at all sixteen baseline viewports with reduced motion on — which
 * also stops the Reference site's hint from sweeping the seam: both sections,
 * every part of them.
 *
 * **In use**, with the seam dragged to the same points on both sites — through
 * and either side of the band where a step turns over — every face's opacity
 * and transform, the verdicts, the tags and what the handle announces; the
 * same after the arrow keys; and the calculator's words, figures and track
 * colouring after the same slider settings.
 *
 * One deliberate difference shapes the comparison: **Arabic set in DM Mono.**
 * The Reference site sets «84,405 ر.س», «7 أيام» and the other slider
 * readings, the comparison's two tags («الطريقة المعتادة») and every face's
 * channel («ورق», «واتساب») in DM Mono, a face with no Arabic glyphs, so the
 * Arabic falls through to the browser's last-resort monospace — the defect
 * already fixed in the footer, the guarantee pill and the four units. Here the
 * Arabic is in the Arabic face, and only the numbers are DM Mono. So for those
 * parts the typeface is not compared, and nor is where each starts or how wide
 * it is, which a typeface decides; its height and its place down the page are.
 *
 * One consequence reaches further. The fallback monospace draws «ر.س» wider
 * than the Arabic face does, so in a narrow card — at 390px — the Reference
 * site's cost wraps the currency onto a second line where the rebuild's fits
 * on one. Where that happens, and only there, the cost's height, and the
 * heights and places of everything it pushes down, are left out.
 */
import { test, expect, type Page } from '@playwright/test';
import { dragSeam, readSeam } from './before-after';
import { measureRegion, type Measurement, type Region } from './geometry';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

const COMPARISON: Region = {
  name: 'the before-and-after section',
  root: '#ba',
  parts: [
    '.eyebrow',
    'h2',
    '.lead',
    '.lead b',
    '.cmp',
    '.cmp-wash',
    // In the Arabic face, where the Reference site uses DM Mono.
    { selector: '.cmp-tag', omit: ['font', 'left', 'width'] },
    '.cmp-steps',
    '.cmp-steps span',
    '.cmp-steps i',
    '.cmp-cols',
    '.cmp-col',
    '.face',
    // In the Arabic face, where the Reference site uses DM Mono.
    { selector: '.face .ch', omit: ['font', 'left', 'width'] },
    '.face p',
    '.face b',
    '.cmp-handle',
    '.cmp-handle .grip',
    '.cmp-handle .grip b',
    '.cmp-verdicts',
    '.cmp-verdict',
  ],
};

/**
 * The calculator. `costWrapsOnlyOnReference` is true where the Reference site's
 * cost takes more lines than the rebuild's — see the note at the top.
 */
function calculatorRegion(costWrapsOnlyOnReference: boolean): Region {
  const taller: Measurement[] = costWrapsOnlyOnReference ? ['height'] : [];
  const pushedDown: Measurement[] = costWrapsOnlyOnReference ? ['top'] : [];
  return {
    name: 'the delay-cost calculator',
    root: '#calc',
    omitFromRoot: taller,
    parts: [
      '.eyebrow',
      'h2',
      '.lead',
      { selector: '.calc', omit: taller },
      '.calc .in',
      '.calc label',
      '.lr',
      // In the Arabic face beside DM Mono numbers, where the Reference site sets
      // it all in DM Mono.
      { selector: '.lr b', omit: ['font', 'left', 'width'] },
      '.rng',
      { selector: '.calc .out', omit: taller },
      { selector: '.calc .out small', omit: pushedDown },
      { selector: '.calc .out b', omit: ['font', 'left', 'width', ...taller] },
      { selector: '.calc .out .n', omit: pushedDown },
      { selector: '.calc .out .btn', omit: pushedDown },
    ],
  };
}

/** How many lines the calculator's cost takes. */
function costLines(page: Page) {
  return page.evaluate(() => {
    const cost = document.querySelector('#calc .out b')!;
    return Math.round(cost.getBoundingClientRect().height / parseFloat(getComputedStyle(cost).lineHeight));
  });
}

/** The calculator's words and figures, and how each slider's track is coloured. */
function readCalculator(page: Page) {
  return page.evaluate(() => {
    const text = (element: Element) => element.textContent!.replace(/\s+/g, ' ').trim();
    const calculator = document.getElementById('calc')!;
    return {
      cost: text(calculator.querySelector('.out b')!),
      small: [...calculator.querySelectorAll('.out small')].map(text),
      readings: [...calculator.querySelectorAll('.lr b')].map(text),
      tracks: [...calculator.querySelectorAll<HTMLInputElement>('.rng')].map((input) => ({
        value: input.value,
        painted: getComputedStyle(input).backgroundImage,
      })),
    };
  });
}

let site: ReferenceSite;

test.beforeAll(async () => {
  site = await startReferenceSite();
});

test.afterAll(async () => {
  await new Promise((resolve) => site.server.close(resolve));
});

test.describe('the before-and-after section and the calculator match the Reference site at rest', () => {
  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        const costWrapsOnlyOnReference = (await costLines(pages.reference)) > (await costLines(pages.rebuilt));
        for (const region of [COMPARISON, calculatorRegion(costWrapsOnlyOnReference)]) {
          expect(await measureRegion(pages.rebuilt, region), region.name).toEqual(
            await measureRegion(pages.reference, region),
          );
        }
        expect(await readSeam(pages.rebuilt)).toEqual(await readSeam(pages.reference));
        expect(await readCalculator(pages.rebuilt)).toEqual(await readCalculator(pages.reference));
      } finally {
        await pages.close();
      }
    });
  }
});

test.describe('the before-and-after seam turns the steps over as on the Reference site', () => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 900 },
    { width: 390, height: 900 },
  ]) {
    test(`dragged, at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        // Across the whole width, finely where the columns' centres are — 14%,
        // 38%, 62% and 86% of the way on a desktop window, 25% and 75% on a
        // phone — so each column is caught part of the way over.
        let from = 0.5;
        for (const to of [0.02, 0.1, 0.13, 0.16, 0.25, 0.34, 0.37, 0.4, 0.5, 0.6, 0.63, 0.66, 0.74, 0.77, 0.84, 0.87, 0.98]) {
          await dragSeam(pages.reference, from, to);
          await dragSeam(pages.rebuilt, from, to);
          expect(await readSeam(pages.rebuilt), `dragged to ${to}`).toEqual(await readSeam(pages.reference));
          from = to;
        }
      } finally {
        await pages.close();
      }
    });
  }

  test('by the arrow keys', async ({ browser, baseURL }) => {
    const pages = await openBothPages(browser, baseURL!, site, { width: 1440, height: 900 });

    try {
      for (const page of [pages.reference, pages.rebuilt]) await page.locator('#ba [role="slider"]').focus();
      for (const key of ['ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowRight']) {
        await pages.reference.keyboard.press(key);
        await pages.rebuilt.keyboard.press(key);
        expect(await readSeam(pages.rebuilt), `after ${key}`).toEqual(await readSeam(pages.reference));
      }
    } finally {
      await pages.close();
    }
  });
});

test('the calculator gives the Reference site\'s figures, and colours its tracks the same, as the sliders move', async ({ browser, baseURL }) => {
  const pages = await openBothPages(browser, baseURL!, site, { width: 1440, height: 900 });

  try {
    for (const settings of [
      ['50000000', '14', '24'],
      ['1000000', '1', '6'],
      ['300000000', '60', '48'],
      ['120000000', '11', '10'],
      ['7000000', '10', '47'],
    ]) {
      for (const page of [pages.reference, pages.rebuilt]) {
        const sliders = page.locator('#calc .rng');
        for (const [index, value] of settings.entries()) await sliders.nth(index).fill(value);
      }
      expect(await readCalculator(pages.rebuilt), settings.join(' / ')).toEqual(await readCalculator(pages.reference));
    }
  } finally {
    await pages.close();
  }
});
