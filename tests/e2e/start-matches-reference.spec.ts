/**
 * "All sections match baselines at all eight widths" for the start page
 * (ticket 13), measured against the Reference site itself for the reasons in
 * `shell-matches-reference.spec.ts`, at all sixteen baseline viewports.
 *
 * Measured, section by section: the hero; the three steps; the questions,
 * closed, as a visitor first finds them; the demo request form beside them;
 * and the free tool teaser.
 *
 * Not measured: the Trust strip, which travels here and wraps there by design
 * (ticket 06, `home-matches-reference.spec.ts`), and the header, which
 * `shell-matches-reference.spec.ts` covers.
 *
 * Deliberate differences shape the comparison, each left out only where it
 * reaches:
 *
 * - **The demo request form's own**, written in `demo-request-form.ts`. The
 *   one that reaches outside it is the disabled button's border, which makes
 *   the form 2px taller than the Reference site's: the height of the section
 *   and its grid are left out, and where the grid stacks the form under the
 *   questions, so is the place of everything under it — the tool teaser.
 * - **The step labels «01 · إعداد», «02 · تشغيل», «03 · ضمان»** set the Arabic
 *   face, with only the numeral in DM Mono. The Reference site sets the whole
 *   label in DM Mono, which has no Arabic glyphs. Only their typeface is left
 *   out: each label is as wide as its card either way.
 */
import { test, expect } from '@playwright/test';
import { DEMO_REQUEST_FORM_PARTS } from './demo-request-form';
import { measureRegion, type Measurement, type Region } from './geometry';
import { BASELINE_VIEWPORTS, openBothPages, START_PAGES, startReferenceSite, type ReferenceSite } from './reference-site';

type Viewport = { width: number; height: number };

const HERO: Region = {
  name: 'the hero',
  root: '.phero',
  parts: ['.eyebrow', 'h1', '.lead', '.ctas', '.ctas .btn.p', '.ctas .btn.g'],
};

const STEPS: Region = {
  name: 'the three steps',
  root: '#start',
  parts: ['.eyebrow', 'h2', '.start', '.start .s', { selector: '.start .s .k', omit: ['font'] }, '.start .s h3', '.start .s p'],
};

function questionRegions(viewport: Viewport): Region[] {
  // Below 981px the form stacks under the questions, and its extra 2px push
  // the tool teaser down.
  const underTheForm: Measurement[] = viewport.width <= 980 ? ['top'] : [];

  return [
    {
      name: 'the questions and the form',
      root: '#faq',
      omitFromRoot: ['height'],
      parts: [
        { selector: '.faq-grid', omit: ['height'] },
        '.faq-grid > div:first-child',
        '.faq-grid > div:first-child > .eyebrow',
        '.faq-grid > div:first-child > h2',
        '.qa',
        '.qa summary',
        { selector: '#demo', omit: ['height'] },
        ...DEMO_REQUEST_FORM_PARTS,
        { selector: '.free', omit: underTheForm },
      ],
    },
    {
      name: 'the free tool teaser',
      root: '#faq .free',
      parts: [':scope > div', '.eyebrow', 'h3', 'p', '.btn.o'],
    },
  ];
}

test.describe('the start page matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, START_PAGES);

      try {
        // Soft, so one run reports every region that differs rather than the first.
        for (const region of [HERO, STEPS, ...questionRegions(viewport)]) {
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
