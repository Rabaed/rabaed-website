/**
 * "Matches baselines at all eight widths, including short-height captures"
 * for the product page (ticket 12), measured against the Reference site itself
 * for the reasons in `shell-matches-reference.spec.ts`, at all sixteen baseline
 * viewports, with reduced motion on. The Reference site pins its journey with
 * reduced motion on as well, so the pin is compared too.
 *
 * Measured, section by section: the hero; the journey's heading, progress
 * marks and track, and every part of every panel; how much scrolling the pin
 * adds to the page, and where the track stands at the end of it; the custom
 * strip; the roles section with each of its three parties chosen in turn; the
 * internal review cycle; and the closing section's steps.
 *
 * Not measured: the Trust strip, which travels here and wraps there by design
 * (ticket 06, `home-matches-reference.spec.ts`); what is inside a screen, which
 * `screen-mocks.spec.ts` holds to the markup pixel for pixel; and the header,
 * which `shell-matches-reference.spec.ts` covers.
 *
 * Three deliberate differences shape the comparison, each left out only where
 * it reaches:
 *
 * - **The caption ADR-0002 requires** sits under every screen, where the
 *   Reference site has none. A stacked panel and a role grow by its height,
 *   and a screen centred with its caption sits higher than one centred alone.
 *   On a short window the screen also gives up the caption's room, so there
 *   the screen's box is compared only on the tall viewports;
 *   `product-journey.spec.ts` holds it inside its panel on the short ones.
 * - **Arabic labels set in the Arabic face** — «المخرَج», «حسب المشروع»,
 *   «دورة داخلية · محجوبة», «ما يعبر رسمياً», and the two headings of the
 *   note under the review cycle. The Reference site sets them in DM Mono, which
 *   has no Arabic glyphs. Their typeface is not compared, nor the width of a
 *   label that is only as wide as its words; their place and height are.
 * - **The closing section's second column** is empty until ticket 11's form
 *   arrives, so only its first column is compared.
 */
import { test, expect, type Page } from '@playwright/test';
import { measureRegion, type Measurement, type Region } from './geometry';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  PRODUCT_PAGES,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

type Viewport = { width: number; height: number };

/** In the Arabic face here, in DM Mono there: typeface, and a width that follows the words. */
const RESET_LABEL: readonly Measurement[] = ['font', 'width', 'left'];
/** In the Arabic face here, but a block as wide as its container either way. */
const RESET_BLOCK: readonly Measurement[] = ['font'];

function heroRegion(): Region {
  return { name: 'the hero', root: '.phero', parts: ['.eyebrow', 'h1', '.lead', '.ctas', '.ctas .btn.p', '.ctas .btn.g'] };
}

function journeyRegions(viewport: Viewport): Region[] {
  // Below 981px the panels stack, and each grows by its screen's caption.
  const grows: Measurement[] = viewport.width <= 980 ? ['height'] : [];
  // The screen and its caption are fitted into the column by a grid rather
  // than a flex row, so how the column and the screen's window are displayed
  // differs by construction. Centred with its caption, the screen sits higher.
  // On a short window it also gives the caption its room.
  const screen: Measurement[] = viewport.height === 900 ? ['top', 'display'] : ['top', 'left', 'width', 'height', 'display'];
  // Below 981px the marks are not displayed, and a box that is not displayed
  // has no position to compare — only the fact that it is not displayed.
  const marks: Measurement[] = viewport.width <= 980 ? ['top', 'left'] : [];
  const column: Measurement[] = [...grows, 'display'];

  return [
    {
      name: 'the journey',
      root: '#journey',
      omitFromRoot: grows,
      parts: [
        '.j-head',
        '.j-head .eyebrow',
        '.j-head h2',
        { selector: '.dots', omit: marks },
        { selector: '.dots i', omit: marks },
        { selector: '.track', omit: grows },
      ],
    },
    ...[1, 2, 3, 4, 5].map((n) => ({
      name: `journey panel ${n}`,
      root: `#journey .panel:nth-child(${n})`,
      omitFromRoot: grows,
      parts: [
        '.num:not(.out)',
        { selector: '.num.out', omit: RESET_LABEL },
        'h3',
        '.tag',
        ':scope > div:first-child > p',
        '.flow',
        '.flow b',
        { selector: '.ui', omit: column },
        { selector: '.win', omit: screen },
      ],
    })),
  ];
}

const CUSTOM: Region = {
  name: 'the custom strip',
  root: '#custom',
  parts: ['.eyebrow', 'h2', '.strip', '.strip .c', { selector: '.strip .c .badge', omit: RESET_LABEL }, '.strip .c h3', '.strip .c p', '.strip .c a'],
};

function roleRegions(n: number): Region[] {
  return [
    {
      name: `the roles section, party ${n} chosen`,
      root: '#roles',
      // Each role grows by its screen's caption, and the promises below move down.
      omitFromRoot: ['height'],
      parts: ['.eyebrow', 'h2', '.tabs', '.tab', { selector: '.shared', omit: ['top'] }, { selector: '.shared span', omit: ['top'] }],
    },
    {
      name: `party ${n}'s copy`,
      root: '#roles .role.on > div:first-child',
      parts: ['h3', 'p', '.gain b'],
    },
    {
      name: `party ${n}'s screen`,
      root: '#roles .role.on',
      omitFromRoot: ['height'],
      parts: [{ selector: ':scope > div:first-child', omit: ['top'] }, { selector: '.win', omit: ['top'] }],
    },
  ];
}

const INNER: Region = {
  name: 'the internal review cycle',
  root: '#inner',
  parts: [
    '.eyebrow',
    'h2',
    '.lead',
    '.orgs',
    '.org',
    '.org-h',
    '.org-h i',
    '.role-note',
    '.priv',
    { selector: '.priv-tag', omit: RESET_LABEL },
    '.steps-v',
    '.steps-v li',
    '.steps-v i',
    '.reloop',
    '.reloop span',
    '.org .out',
    { selector: '.org .out b', omit: RESET_BLOCK },
    '.cross',
    '.cross span',
    '.inner-note',
    '.inner-note > div',
    { selector: '.inner-note .k', omit: RESET_BLOCK },
  ],
};

const TAIL: Region = {
  name: 'the closing section',
  root: '#tail',
  omitFromRoot: ['height'],
  parts: ['.eyebrow', 'h2', '.tail-steps', '.tail-steps li', '.tail-steps b', '.tail-steps span', '.tail-more'],
};

/** How much page the journey takes up: the pin's whole length when it pins. Read from the top of the page. */
async function journeyLength(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  return page.evaluate(() => {
    const onPage = (id: string) => document.getElementById(id)!.getBoundingClientRect().top + window.scrollY;
    return Math.round(onPage('custom') - onPage('journey'));
  });
}

/** How far the track has travelled, once the scrub has caught up with the scroll. */
async function settledTravel(page: Page) {
  const read = () =>
    page.locator('#journey .track').evaluate((track) => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
  let last = await read();
  for (;;) {
    await page.waitForTimeout(250);
    const now = await read();
    if (Math.abs(now - last) < 0.01) return Math.round(now * 10) / 10;
    last = now;
  }
}

test.describe('the product page matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      test.slow();
      const pages = await openBothPages(browser, baseURL!, site, viewport, PRODUCT_PAGES);
      const { reference, rebuilt } = pages;

      // Soft, so one run reports every region that differs rather than the first.
      const compare = async (regions: readonly Region[]) => {
        for (const region of regions) {
          expect.soft(await measureRegion(rebuilt, region), region.name).toEqual(await measureRegion(reference, region));
        }
      };

      try {
        // The journey's length is the pin's scroll distance, which is only
        // right once the webfont has settled the heading's height. The
        // Reference site has measured by the time it has loaded; the rebuild
        // is given until the comparison stops changing.
        // Below 981px the stacked panels are taller by their captions, so the
        // length is only the Reference site's from 981px up.
        if (viewport.width >= 981) {
          const length = await journeyLength(reference);
          await expect
            .poll(() => journeyLength(rebuilt), { message: 'the journey takes up a different length of page' })
            .toBe(length);
        }

        await compare([heroRegion(), ...journeyRegions(viewport), CUSTOM, INNER, TAIL]);

        for (const n of [1, 2, 3]) {
          for (const page of [reference, rebuilt]) await page.locator(`#roles .tab:nth-child(${n})`).click();
          await compare(roleRegions(n));
        }

        const pins = viewport.width >= 981 && viewport.height >= 551;
        if (pins) {
          // The end of the pin: the whole track has travelled, on both.
          for (const page of [reference, rebuilt]) {
            await page.evaluate(() => {
              const onPage = (id: string) => document.getElementById(id)!.getBoundingClientRect().top + window.scrollY;
              window.scrollTo(0, onPage('custom') - window.innerHeight - 1);
            });
          }
          expect(await settledTravel(rebuilt), 'how far the track travels').toBeCloseTo(await settledTravel(reference), 0);
          await compare(journeyRegions(viewport).slice(0, 1));
        }
      } finally {
        await pages.close();
      }
    });
  }
});
