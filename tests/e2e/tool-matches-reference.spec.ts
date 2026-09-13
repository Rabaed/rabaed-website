/**
 * "All sections match baselines at all eight widths" for the tool page
 * (ticket 14), measured against the Reference site itself for the reasons in
 * `shell-matches-reference.spec.ts`, at all sixteen baseline viewports.
 *
 * Measured, section by section: the hero with its drawing of the tool; why the
 * tool exists; what it does; the three steps; where the files live; what it
 * needs; the download section with its form, untouched; the questions, closed;
 * and the upsell.
 *
 * Not measured: the header, which `shell-matches-reference.spec.ts` covers.
 * The page has no Trust strip.
 *
 * Deliberate differences shape the comparison, each left out only where it
 * reaches:
 *
 * - **Arabic labels set in the Arabic face**: the three steps' «01 · حمّل الملف»
 *   and its like, with only the numeral in DM Mono, and the requirements'
 *   «النظام», «التجربة الكاملة», «وضع مبسّط». The Reference site sets them in
 *   DM Mono, which has no Arabic glyphs. Only their typeface is left out: each
 *   is as wide as its card either way.
 * - **«دقيقتان» in the guarantee pill** is in the Arabic face, where the
 *   Reference site sets it in DM Mono (`tokens.css`). A different face is a
 *   different width, so the pill's width and place across, and the word's, are
 *   not compared; their height and place down the page are.
 */
import { test, expect } from '@playwright/test';
import { measureRegion, type Measurement, type Region } from './geometry';
import { BASELINE_VIEWPORTS, openBothPages, startReferenceSite, TOOL_PAGES, type ReferenceSite } from './reference-site';

/** Left out of a label in the Arabic face here and DM Mono there, which is as wide as its card either way. */
const ARABIC_BLOCK_LEFT_OUT: readonly Measurement[] = ['font'];

const TEASER_HEAD = ['.tz-head', '.tz-head .eyebrow', '.tz-head h2', '.tz-head .lead'];
const CARD_ROW = ['.rt-row', '.rt-c', '.rt-c h3', '.rt-c p'];

const REGIONS: readonly Region[] = [
  {
    name: 'the hero',
    root: '.phero',
    parts: [
      '.tl-hero',
      '.tl-hero > div:first-child',
      '.eyebrow',
      'h1',
      'h1 span',
      '.lead',
      '.ctas',
      '.ctas .btn',
      '.tl-chips',
      '.tl-chip',
      '.tl-chip i',
    ],
  },
  {
    name: 'the drawing of the tool',
    root: '.phero .tl-mock',
    parts: [
      '.tl-mh',
      '.tl-mh .d',
      '.tl-mh b',
      '.tiles',
      '.tile',
      '.tile b',
      '.tile small',
      '.tl-row',
      '.tl-row .rf',
      '.tl-row .rn',
      '.tl-row .rm',
      '.tl-row .rm > div',
      '.tl-row .mk',
      '.tl-s',
      '.tl-s i',
    ],
  },
  { name: 'why the tool exists', root: '#why', parts: [...TEASER_HEAD, ...CARD_ROW, '.rt-c .k'] },
  {
    name: 'what it does',
    root: '#features',
    parts: [
      ...TEASER_HEAD,
      ...CARD_ROW,
      '.rt-c .k',
      '.tl-legend',
      '.tl-legend .tl-s',
      '.tl-legend .tl-s i',
      '.tl-also',
      '.tl-also li',
      '.tl-also i',
      '.tl-also span',
    ],
  },
  {
    name: 'the three steps',
    root: '#how',
    parts: [
      ...TEASER_HEAD,
      '.start',
      '.start .s',
      { selector: '.start .s .k', omit: ARABIC_BLOCK_LEFT_OUT },
      '.start .s h3',
      '.start .s p',
    ],
  },
  {
    name: 'where the files live',
    root: '#data',
    parts: [
      '.tl-2',
      '.tl-2 > div',
      '.eyebrow',
      'h2',
      '.tl-tick',
      '.tl-tick li',
      '.tl-tick i',
      '.tl-tick b',
      '.tl-tick .mono',
      '.tl-tree',
      '.tl-tree .rt',
      '.tl-tree .fo',
      '.tl-tree .ln',
      '.tl-tree .fn',
      '.tl-tree .ds',
      '.tl-cap',
    ],
  },
  {
    name: 'what it needs',
    root: '#req',
    parts: [...TEASER_HEAD, ...CARD_ROW, { selector: '.rt-c .k', omit: ARABIC_BLOCK_LEFT_OUT }],
  },
  {
    name: 'the download section',
    root: '#get',
    parts: [
      '.tl-get',
      '.tl-get > div:first-child',
      '.tl-get > div:first-child > .eyebrow',
      '.tl-get > div:first-child > h2',
      '.tl-get > div:first-child > .lead',
      '.tl-tick',
      '.tl-tick li',
      '.tl-tick i',
      // «دقيقتان» in the Arabic face.
      { selector: '.guar', omit: ['width', 'left'] },
      { selector: '.guar b', omit: ['width', 'left', 'font'] },
    ],
  },
  {
    name: 'the download form',
    root: '#tl-form-card',
    parts: [
      '#tl-form-view',
      '#tl-form-view > h3',
      '#tl-form-view > small',
      '.tl-prog',
      '.tl-prog i',
      '#tl-form',
      '#tl-form .two',
      '#tl-form .two > div',
      '.tl-cc',
      '#tl-form input',
      '#tl-form select',
      // Not displayed until a field is left wrong, so there is no box to place.
      { selector: '.er', omit: ['top', 'left'] },
      '#tl-form .btn',
      '#tl-form .fine',
    ],
  },
  { name: 'the questions', root: '#faq', parts: [...TEASER_HEAD, '.fq-row', '.qa', '.qa summary'] },
  {
    name: 'the upsell',
    root: '#up',
    parts: [
      '.tl-up',
      '.tl-up > div',
      '.eyebrow',
      'h2',
      '.lead',
      '.ctas',
      '.ctas .btn',
      '.tl-up-list',
      '.tl-up-list li',
      '.tl-up-list i',
      '.tl-foot-line',
    ],
  },
];

test.describe('the tool page matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { pages: TOOL_PAGES });

      try {
        // Soft, so one run reports every region that differs rather than the first.
        for (const region of REGIONS) {
          expect
            .soft(await measureRegion(pages.rebuilt, region), region.name)
            .toEqual(await measureRegion(pages.reference, region));
        }
      } finally {
        await pages.close();
      }
    });
  }
});
