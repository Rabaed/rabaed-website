/**
 * "All sections match baselines at all eight widths" for the partnership page
 * (ticket 16), measured against the Reference site itself for the reasons in
 * `shell-matches-reference.spec.ts`, at all sixteen baseline viewports.
 *
 * Measured, section by section: the hero and its three figures; the idea; who
 * the programme is for; the three modes; the benefits; the path to joining;
 * the questions, closed, as a visitor first finds them; and the application
 * section, its copy and its form.
 *
 * Not measured: the header and footer, which `shell-matches-reference.spec.ts`
 * covers.
 *
 * Deliberate differences shape the comparison, each left out only where it
 * reaches, as on the referral page (`referral-matches-reference.spec.ts`):
 *
 * - **Arabic set in DM Mono on the Reference site**, which has no Arabic
 *   glyphs: the modes' labels «01 · التضمين في العرض» and the rest, the
 *   figures «3 أنماط», «4 مراحل» and «بلا رسوم», and «يوما عمل» in the
 *   guarantee pill. Here the Arabic keeps the Arabic face and only numerals are
 *   `.mono`. Their typeface is left out, and where the words set how wide the
 *   element is, its width and place across. The hero's figures' sizes and
 *   places are left out entirely, for the operating-system fallback the
 *   referral page's comparison explains.
 *
 *   The path's stage labels «المرحلة 01» are *not* among them: they are
 *   `.tail-steps b`, the rule the home and product pages' closing steps share, and keep
 *   DM Mono until bug 45 decides for all of them. They are measured in full.
 * - **The submit button is disabled** until ticket 29 gives the form somewhere
 *   to send: its colours and height are left out, and so are the 2px its
 *   border adds below it — the small print's place, and the height of the
 *   form, its grid and its section.
 * - **The document field's file input** is hidden from sight but not from the
 *   keyboard. Neither page draws it, so it is not measured; the label that
 *   stands for it is.
 */
import { test, expect } from '@playwright/test';
import { measureRegion, type Measurement, type Region } from './geometry';
import { BASELINE_VIEWPORTS, openBothPages, PARTNERSHIP_PAGES, startReferenceSite, type ReferenceSite } from './reference-site';

/** Left out of a label in the Arabic face here and DM Mono there: its typeface, and a width and place that follow its words. */
const ARABIC_LABEL_LEFT_OUT: readonly Measurement[] = ['font', 'width', 'left'];

const REGIONS: readonly Region[] = [
  {
    name: 'the hero',
    root: '.phero',
    // Taller wherever the Reference site's figures wrap.
    omitFromRoot: ['height'],
    parts: [
      '.eyebrow',
      'h1',
      '.lead',
      '.ctas',
      '.ctas .btn.p',
      '.ctas .btn.g',
      // As on the referral page: the figures' cards follow words in whatever
      // face the Reference site's operating system falls back to.
      { selector: '.pstats', omit: ['height'] },
      { selector: '.pstat', omit: ['width', 'height', 'left', 'top'] },
      { selector: '.pstat b', omit: [...ARABIC_LABEL_LEFT_OUT, 'height', 'top'] },
      // Not the numerals' `.mono` spans inside the figures.
      { selector: '.pstat > span', omit: ['left', 'top'] },
    ],
  },
  {
    name: 'the idea',
    root: '#idea',
    parts: ['.tz-head', '.eyebrow', 'h2', '.lead-block', '.lead-block p', '.gain', '.gain .inl'],
  },
  {
    name: 'who the programme is for',
    root: '#who',
    parts: ['.tz-head', '.eyebrow', 'h2', '.rt-row', '.rt-c', '.rt-c .k', '.rt-c h3', '.rt-c p'],
  },
  {
    name: 'the three modes',
    root: '#modes',
    parts: [
      '.tz-head',
      '.eyebrow',
      'h2',
      '.start',
      '.start .s',
      { selector: '.start .s .k', omit: ['font'] },
      '.start .s h3',
      '.start .s p',
      '.start .s .fit',
      '.gain',
      '.gain b',
    ],
  },
  {
    name: 'the benefits',
    root: '#benefits',
    parts: ['.tz-head', '.eyebrow', 'h2', '.ben-row', '.ben-row li', '.ben-row i', '.ben-row li > span', '.ben-row b'],
  },
  {
    name: 'the path to joining',
    root: '#path',
    parts: [
      '.tail-grid',
      '.tail-grid > div:first-child',
      '.eyebrow',
      'h2',
      '.lead',
      '.tz-foot',
      '.tz-more',
      '.tz-more span',
      '.tail-steps',
      '.tail-steps li',
      '.tail-steps li > b',
      '.tail-steps li > span',
      '.tail-steps .ph',
    ],
  },
  {
    name: 'the questions',
    root: '#faq',
    parts: ['.tz-head', '.eyebrow', 'h2', '.fq-row', '.qa', '.qa summary'],
  },
  {
    name: 'the application section',
    // Taller by the disabled button's border.
    root: '#apply',
    omitFromRoot: ['height'],
    parts: [{ selector: '.sign-grid', omit: ['height'] }, '.sign-grid > div:first-child', { selector: '.form', omit: ['height'] }],
  },
  {
    name: 'the application copy',
    root: '#apply .sign-grid > div:first-child',
    parts: [
      '.eyebrow',
      'h2',
      '.lead',
      '.ben-row',
      '.ben-row li',
      '.ben-row i',
      '.ben-row span',
      // The pill is as wide as «يوما عمل» makes it, so it goes with the words.
      { selector: '.guar', omit: ['width', 'left'] },
      { selector: '.guar b', omit: ARABIC_LABEL_LEFT_OUT },
    ],
  },
  {
    name: 'the application form',
    root: '#apply .form',
    omitFromRoot: ['height'],
    parts: [
      'h3',
      ':scope > small:first-of-type',
      '.two',
      // Not the file input inside the document field: see above.
      '.two > input',
      'select',
      'textarea',
      '.upl',
      '.upl .ic',
      '.upl .tx',
      '.upl .tx b',
      '.upl .tx small',
      '.upl .nm',
      // Disabled, in the Reference site's disabled style.
      { selector: '.btn', omit: ['color', 'background', 'borderColor', 'height'] },
      // Below the button, so 2px lower.
      { selector: '.fine', omit: ['top'] },
    ],
  },
];

/** The commercial registration with a file chosen: the Reference site's green selected state. */
const CHOSEN_DOCUMENT: Region = {
  name: 'the commercial registration with a file chosen',
  root: '#apply .form .upl',
  parts: ['.ic', '.tx', '.tx b', '.tx small', '.nm'],
};

const REGISTRATION = { name: 'commercial-registration.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n') };

test.describe('the partnership page matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { pages: PARTNERSHIP_PAGES });

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

  // One phone and one desktop width: the state is colours, and a card that
  // stacks or stands beside the office's name.
  for (const viewport of [BASELINE_VIEWPORTS[0], BASELINE_VIEWPORTS[5]]) {
    test(`the commercial registration with a file chosen, at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { pages: PARTNERSHIP_PAGES });

      try {
        for (const page of [pages.reference, pages.rebuilt]) {
          const field = page.locator(CHOSEN_DOCUMENT.root).first();
          // Choosing again until the name shows: the rebuilt field's script
          // may still be starting when the page first answers.
          await expect(async () => {
            await field.locator('input[type="file"]').setInputFiles(REGISTRATION);
            await expect(field).toContainText(REGISTRATION.name, { timeout: 500 });
          }).toPass();
        }

        expect(await measureRegion(pages.rebuilt, CHOSEN_DOCUMENT)).toEqual(await measureRegion(pages.reference, CHOSEN_DOCUMENT));
      } finally {
        await pages.close();
      }
    });
  }
});
