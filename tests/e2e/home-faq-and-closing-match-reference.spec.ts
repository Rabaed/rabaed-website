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
 * The closing section is measured as `closing-section.ts` describes, with the
 * three deliberate differences that shape it written there — the product
 * page's comparison measures the same section the same way.
 */
import { test, expect } from '@playwright/test';
import { CLOSING_SECTION } from './closing-section';
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
  CLOSING_SECTION,
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
