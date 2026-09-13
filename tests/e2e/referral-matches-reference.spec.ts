/**
 * "All sections match baselines at all eight widths" for the referral page
 * (ticket 15), measured against the Reference site itself for the reasons in
 * `shell-matches-reference.spec.ts`, at all sixteen baseline viewports.
 *
 * Measured, section by section: the hero and its three figures; the four
 * steps; the offer; who the programme is for; what is referred; the terms in
 * eight points; the questions, closed, as a visitor first finds them; and the
 * signup section, its copy and its form.
 *
 * Not measured: the header and footer, which `shell-matches-reference.spec.ts`
 * covers.
 *
 * Deliberate differences shape the comparison, each left out only where it
 * reaches:
 *
 * - **Arabic set in DM Mono on the Reference site**, which has no Arabic
 *   glyphs: the step labels «01 · سجّل» and the rest, the figures «2,000 ريال»
 *   and «بلا حد», the badges «لك» and «لعميلك», and «7 أيام عمل» in the
 *   guarantee pill. Here the Arabic keeps the Arabic face and only numerals are
 *   `.mono`. Their typeface is left out, and where the words set how wide the
 *   element is, its width and place across. The hero's figures reach further:
 *   the Reference site's fallback face differs by operating system, and on
 *   Linux it wraps and widens the figures' cards, so their sizes and places
 *   are left out entirely.
 * - **The submit button is disabled** until ticket 28 gives the form somewhere
 *   to send, drawn in the Reference site's own disabled style, as the demo
 *   request form's is (`demo-request-form.ts`): its colours and height are
 *   left out, and so are the 2px its border adds below it — the small print's
 *   place, and the height of the form, its grid and its section.
 * - **The document fields' file inputs** are hidden from sight but not from the
 *   keyboard, where the Reference site's `hidden` takes them out of the page.
 *   Neither draws anything, so they are not measured; the labels that stand
 *   for them are.
 */
import { test, expect } from '@playwright/test';
import { measureRegion, type Measurement, type Region } from './geometry';
import { BASELINE_VIEWPORTS, openBothPages, REFERRAL_PAGES, startReferenceSite, type ReferenceSite } from './reference-site';

/** Left out of a label in the Arabic face here and DM Mono there: its typeface, and a width and place that follow its words. */
const ARABIC_LABEL_LEFT_OUT: readonly Measurement[] = ['font', 'width', 'left'];

const REGIONS: readonly Region[] = [
  {
    name: 'the hero',
    root: '.phero',
    // Taller wherever the Reference site's figures wrap: see below.
    omitFromRoot: ['height'],
    parts: [
      '.eyebrow',
      'h1',
      '.lead',
      '.ctas',
      '.ctas .btn.p',
      '.ctas .btn.g',
      // The figures' cards are as wide as their words, and on the Reference
      // site those words are Arabic in whatever face the operating system
      // falls back to: Linux's is wide enough to wrap «2,000 ريال» onto a
      // second line at 390px and to widen the first card past its 158px at
      // desktop widths, where Windows's is not. So every size and place that
      // follows from the words is left out; the colours and type are held.
      { selector: '.pstats', omit: ['height'] },
      { selector: '.pstat', omit: ['width', 'height', 'left', 'top'] },
      { selector: '.pstat b', omit: [...ARABIC_LABEL_LEFT_OUT, 'height', 'top'] },
      // Not the numerals' `.mono` spans inside the figures.
      { selector: '.pstat > span', omit: ['left', 'top'] },
    ],
  },
  {
    name: 'the four steps',
    root: '#how',
    parts: ['.tz-head', '.eyebrow', 'h2', '.start', '.start .s', { selector: '.start .s .k', omit: ['font'] }, '.start .s h3', '.start .s p'],
  },
  {
    name: 'the offer',
    root: '#offer',
    parts: [
      '.tz-head',
      '.eyebrow',
      'h2',
      '.lead-block',
      '.lead-block p',
      '.lead-block b',
      '.strip',
      '.strip .c',
      { selector: '.strip .c .badge', omit: ARABIC_LABEL_LEFT_OUT },
      '.strip .c h3',
      '.strip .c p',
    ],
  },
  {
    name: 'who the programme is for',
    root: '#who',
    parts: ['.tz-head', '.eyebrow', 'h2', '.lead', '.rt-row', '.rt-c', '.rt-c .k', '.rt-c h3', '.rt-c p', '.gain', '.gain b', '.gain .inl'],
  },
  {
    name: 'what is referred',
    root: '#what',
    parts: ['.tz-head', '.eyebrow', 'h2', '.lead-block', '.lead-block p', '.tz-foot', '.tz-more', '.tz-more span'],
  },
  {
    name: 'the terms in eight points',
    root: '#terms',
    parts: ['.tz-head', '.eyebrow', 'h2', '.t8', '.t8 li', '.t8 i', '.t8 li > span', '.t8 b', '.tz-foot', '.tz-more', '.tz-more span'],
  },
  {
    name: 'the questions',
    root: '#faq',
    parts: ['.tz-head', '.eyebrow', 'h2', '.fq-row', '.qa', '.qa summary'],
  },
  {
    name: 'the signup section',
    // Taller by the disabled button's border.
    root: '#signup',
    omitFromRoot: ['height'],
    parts: [{ selector: '.sign-grid', omit: ['height'] }, '.sign-grid > div:first-child', { selector: '.form', omit: ['height'] }],
  },
  {
    name: 'the signup copy',
    root: '#signup .sign-grid > div:first-child',
    parts: [
      '.eyebrow',
      'h2',
      '.lead',
      '.ben-row',
      '.ben-row li',
      '.ben-row i',
      '.ben-row span',
      // The pill is as wide as «7 أيام عمل» makes it, so it goes with the words.
      { selector: '.guar', omit: ['width', 'left'] },
      { selector: '.guar b', omit: ARABIC_LABEL_LEFT_OUT },
    ],
  },
  {
    name: 'the signup form',
    root: '#signup .form',
    omitFromRoot: ['height'],
    parts: [
      'h3',
      ':scope > small:first-of-type',
      '.two',
      // Not the file inputs inside the document fields: see above.
      '.two > input',
      'select',
      '.upl',
      '.upl .ic',
      '.upl .tx',
      '.upl .tx b',
      '.upl .tx small',
      '.upl .nm',
      '.chk',
      '.chk input',
      '.chk span',
      '.chk a',
      '.declar',
      // Disabled, in the Reference site's disabled style.
      { selector: '.btn', omit: ['color', 'background', 'borderColor', 'height'] },
      // Below the button, so 2px lower.
      { selector: '.fine', omit: ['top'] },
    ],
  },
];

/**
 * A document field with a file chosen: the Reference site's selected state,
 * green card, green arrow and the file's name in bold green. Measured on the
 * IBAN certificate's field, once a file is chosen on both pages.
 */
const CHOSEN_DOCUMENT: Region = {
  name: 'a document field with a file chosen',
  root: '#signup .form .upl',
  parts: ['.ic', '.tx', '.tx b', '.tx small', '.nm'],
};

const CERTIFICATE = { name: 'iban-certificate.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n') };

test.describe('the referral page matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { pages: REFERRAL_PAGES });

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
  // stacks or stands two to a row.
  for (const viewport of [BASELINE_VIEWPORTS[0], BASELINE_VIEWPORTS[5]]) {
    test(`a document field with a file chosen, at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport, { pages: REFERRAL_PAGES });

      try {
        for (const page of [pages.reference, pages.rebuilt]) {
          const field = page.locator(CHOSEN_DOCUMENT.root).first();
          // Choosing again until the name shows: the rebuilt field's script
          // may still be starting when the page first answers.
          await expect(async () => {
            await field.locator('input[type="file"]').setInputFiles(CERTIFICATE);
            await expect(field).toContainText(CERTIFICATE.name, { timeout: 500 });
          }).toPass();
        }

        expect(await measureRegion(pages.rebuilt, CHOSEN_DOCUMENT)).toEqual(await measureRegion(pages.reference, CHOSEN_DOCUMENT));
      } finally {
        await pages.close();
      }
    });
  }
});
