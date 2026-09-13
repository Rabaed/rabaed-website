/**
 * "Closing section and its steps match baselines" (ticket 11), and the
 * questions above it, measured against the Reference site itself for the
 * reasons in `shell-matches-reference.spec.ts`, at all sixteen baseline
 * viewports.
 *
 * The questions are measured closed, as a visitor first finds them; an open
 * answer's text is the same text, and whether it opens is held by
 * `home-faq-and-closing.spec.ts`.
 *
 * Three deliberate differences, each left out only where it reaches:
 *
 * - **The Reference site's fake confirmation** — a hidden «وصلنا طلبك» under
 *   the button — is not in the rebuild, so the form's small print is measured
 *   without it on both sides.
 * - **«60 يوماً» in the guarantee pill** sets only its numeral in DM Mono, as
 *   in the hero, where the Reference site sets the Arabic word in DM Mono too.
 *   A different face is a different width, so that one line's width and
 *   typeface are not compared; its height and its place in the pill are.
 * - **The submit button is disabled until ticket 27**, and drawn in the
 *   Reference site's own disabled style from its tool page — grey, with a 1px
 *   border the enabled button does not have. So the button's colours and
 *   height are not compared, and neither are the 2px that border adds below
 *   it: the small print's position, and the heights of the form, the grid and
 *   the section. Everything above the button, and every width, is.
 */
import { test, expect } from '@playwright/test';
import { measureRegion, type Region } from './geometry';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

const REGIONS: readonly Region[] = [
  {
    name: 'the questions',
    root: '#fq',
    parts: ['.tz-head', '.tz-head .eyebrow', '.tz-head h2', '.fq-row', '.qa', '.qa summary', '.tz-foot', '.tz-more', '.tz-more span'],
  },
  {
    name: 'the closing section',
    root: '#tail',
    // The disabled button's border makes the section 2px taller.
    omitFromRoot: ['height'],
    parts: [
      { selector: '.tail-grid', omit: ['height'] },
      '.eyebrow',
      'h2',
      '.tail-steps',
      '.tail-steps li',
      '.tail-steps b',
      '.tail-steps span',
      '.tail-more',
      { selector: '#demo', omit: ['height'] },
      '#demo h3',
      // The line under the heading. The Reference site's hidden fake
      // confirmation is the next small, and the rebuild has none.
      '#demo > small:first-of-type',
      '#demo .guar',
      // Only the numeral in DM Mono.
      { selector: '#demo .guar b', omit: ['left', 'width', 'font'] },
      '#demo .two',
      '#demo input',
      '#demo select',
      // Disabled, in the Reference site's disabled style.
      { selector: '#demo .btn', omit: ['color', 'background', 'borderColor', 'height'] },
      // Below the button, so 2px lower.
      { selector: '#demo .fine', omit: ['top'] },
    ],
  },
];

test.describe('the questions and the closing section match the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        for (const region of REGIONS) {
          expect(await measureRegion(pages.rebuilt, region), region.name).toEqual(
            await measureRegion(pages.reference, region),
          );
        }
      } finally {
        await pages.close();
      }
    });
  }
});
