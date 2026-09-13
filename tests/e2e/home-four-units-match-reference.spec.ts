/**
 * "Matches baselines at all eight widths" for the four-units section
 * (ticket 08), measured against the Reference site itself for the reasons in
 * `shell-matches-reference.spec.ts`, at all sixteen baseline viewports, with
 * reduced motion on so neither page is caught half-way through a fade.
 *
 * Measured: the heading, the rule under it, every tab and each part of it, the
 * stage, all five screens' boxes, and the link at the foot. Not measured: what
 * is *inside* a screen. The Reference site draws each one as markup and the
 * rebuild shows ticket 05's exported picture of that markup; the picture is
 * held to the markup, pixel for pixel, by `screen-mocks.spec.ts`.
 *
 * Three deliberate differences shape the comparison, each left out only where
 * it reaches:
 *
 * - **The caption ADR-0002 requires** sits under the screen, where the
 *   Reference site has none. It makes the section taller and moves the link at
 *   the foot down, so the section's height and the link's height on the page
 *   are not compared here; the link is still measured in full from its own
 *   corner, and where the caption itself sits is held by
 *   `home-four-units.spec.ts`.
 * - **«المخرَج»**, the fifth tab's label, is set in the Arabic face. The
 *   Reference site sets it in DM Mono, which has no Arabic glyphs — the same
 *   defect already fixed in the footer and the guarantee pill. Its typeface is
 *   not compared; its box is, and it is the same box, because line height, not
 *   the face, decides it.
 * - **The screen does not widen past the content column**, as the ticket's
 *   wording asks, because no Reference page does that (ADR-0005). This
 *   comparison is what holds it to the Reference site instead.
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
    name: 'the four-units section',
    root: '#jt',
    // The caption makes the section taller.
    omitFromRoot: ['height'],
    parts: [
      '.tz-head',
      '.tz-head .eyebrow',
      '.tz-head h2',
      '.jt-line',
      '.jt-row',
      '.jt-s',
      '.jt-s .n:not(.out)',
      // In the Arabic face, where the Reference site uses DM Mono.
      { selector: '.jt-s .n.out', omit: ['font'] },
      '.jt-s h3',
      '.jt-stage',
      '.jt-shot',
      // The caption above it moves it down the section.
      { selector: '.tz-foot', omit: ['top'] },
    ],
  },
  {
    name: 'the link at the foot of the section',
    root: '#jt .tz-foot',
    parts: ['.tz-more', '.tz-more span'],
  },
];

test.describe('the four-units section matches the Reference site', () => {
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
