/**
 * "Matches baselines at all eight widths" for the three legal pages
 * (ticket 17), measured against the Reference pages themselves for the reasons
 * in `shell-matches-reference.spec.ts`, at all sixteen baseline viewports.
 *
 * Measured: the page hero, and every part of the document — the date, the
 * introduction, the contents list, every heading, paragraph, list, bold phrase
 * and link, the contact box and the links on to the other documents.
 *
 * One deliberate difference, left out only where it reaches: **the date** —
 * «آخر تحديث: 1 سبتمبر 2026» — is Arabic set in DM Mono on the Reference site,
 * which has no Arabic glyphs. Here only its numerals are. A different face is a
 * different width, and the date is a pill only as wide as its words, starting
 * from the right; so its typeface, width and left edge are not compared. Its
 * height and its place in the document are.
 */
import { test, expect } from '@playwright/test';
import { measureRegion, type Region } from './geometry';
import { LEGAL_PAGES } from './legal-documents';
import { BASELINE_VIEWPORTS, openBothPages, startReferenceSite, type ReferenceSite } from './reference-site';

const REGIONS: readonly Region[] = [
  { name: 'the page hero', root: '.phero', parts: ['.wrap', '.eyebrow', 'h1', '.lead'] },
  {
    name: 'the document',
    root: '.legal',
    parts: [
      '.wrap',
      // In the Arabic face, numerals apart.
      { selector: '.updated', omit: ['font', 'width', 'left'] },
      '.intro',
      '.intro p',
      '.intro a',
      '.toc',
      '.toc a',
      'h2',
      '.wrap > p',
      '.wrap > p a',
      'ul',
      'li',
      'b',
      '.contact-box',
      '.contact-box p',
      '.contact-box a',
      '.xref',
      '.xref a',
    ],
  },
];

test.describe('the legal pages match the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const pair of LEGAL_PAGES) {
    for (const viewport of BASELINE_VIEWPORTS) {
      test(`${pair.rebuilt} at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
        const pages = await openBothPages(browser, baseURL!, site, viewport, { pages: pair });
        try {
          for (const region of REGIONS) {
            // Soft, so one run reports every region that differs rather than the first.
            expect
              .soft(await measureRegion(pages.rebuilt, region), region.name)
              .toEqual(await measureRegion(pages.reference, region));
          }
        } finally {
          await pages.close();
        }
      });
    }
  }
});
