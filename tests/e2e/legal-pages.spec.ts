/**
 * The three legal pages (ticket 17): شروط الخدمة, سياسة الخصوصية, and
 * الشروط والأحكام — برنامج الإحالة.
 *
 * What matters about a legal page is that it says exactly what the approved
 * text says, so most of this is about the words: every block of text against
 * the Reference page, every paragraph against the lawyer's Word document, and
 * the three misspellings that document carries — deliberately kept, because a
 * "corrected" copy is no longer the approved one (ADR-0003). Then what a
 * reader does with the page: follow the contents list to a clause, follow a
 * link to the next document, reach the contact details, and read the header
 * over the pale document.
 *
 * Whether the pages *look* like the Reference site is asked in
 * `legal-matches-reference.spec.ts`. That they stay out of search results
 * until launch is `indexing.spec.ts`, and that they name no English version
 * is `localisation.spec.ts`, both through `routes.ts` (ADR-0006).
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { sidewaysOverflow } from './geometry';
import { HEADER_BACKGROUND_OVER_DARK, HEADER_BACKGROUND_OVER_LIGHT } from './header-colours';
import { LEGAL_PAGES } from './legal-documents';
import { openReferencePage, startReferenceSite, type ReferenceSite } from './reference-site';
import { readWordParagraphs } from './word-document';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

/** Text as a reader meets it: runs of spaces and line breaks are one space. */
const normalise = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Every block of words on a legal page. */
const EVERY_BLOCK =
  '.phero h1, .phero .lead, .legal .updated, .legal .intro p, .legal .toc a, .legal h2, .legal .wrap > p, .legal li, .legal .contact-box p, .legal .xref';
/** The document's own paragraphs, headings and list items — what a Word document holds. */
const DOCUMENT_BLOCKS = '.legal .intro p, .legal h2, .legal .wrap > p, .legal li';

/** The text of each element a selector matches, in reading order, as a reader meets it. */
async function blockTexts(page: Page, selector: string) {
  const texts = await page.locator(selector).allTextContents();
  return texts.map(normalise);
}

test.describe('the words', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const legal of LEGAL_PAGES) {
    test(`${legal.rebuilt} carries the Reference page's text, block for block, with JavaScript off`, async ({
      browser,
      baseURL,
    }) => {
      // With JavaScript off, so every word is proved to be in the first response (ADR-0001).
      const context = await browser.newContext({ javaScriptEnabled: false });
      try {
        const reference = await context.newPage();
        await openReferencePage(reference, site, legal.reference);
        const rebuilt = await context.newPage();
        await rebuilt.goto(`${baseURL}${legal.rebuilt}`);

        const expected = await blockTexts(reference, EVERY_BLOCK);
        expect(expected.length, 'nothing was read from the Reference page').toBeGreaterThan(20);
        expect(await blockTexts(rebuilt, EVERY_BLOCK)).toEqual(expected);
      } finally {
        await context.close();
      }
    });
  }
});

for (const legal of LEGAL_PAGES) {
  if (!legal.word) continue;
  const word = legal.word;

  test(`${legal.rebuilt} carries every paragraph of ${word}, in order`, async ({ page }) => {
    const [title, date, ...body] = await readWordParagraphs(path.join(repoRoot, 'reference', 'legal-source', word));

    // The document opens with its own title and a placeholder where the date
    // of publication goes. The page states the first as its heading and fills
    // in the second, so neither is looked for as a paragraph.
    expect(normalise(title.text)).toContain(legal.title);
    expect(date.text).toContain('[تاريخ النشر]');

    // Word numbers its headings itself; the page prints the number.
    let clause = 0;
    const expected = body.map((paragraph) => normalise(paragraph.heading ? `${++clause}. ${paragraph.text}` : paragraph.text));

    await page.goto(legal.rebuilt);
    expect(await blockTexts(page, DOCUMENT_BLOCKS)).toEqual(expected);
  });
}

test('the Terms keep the three misspellings of the name that the approved document has', async ({ page }) => {
  // «لبرائد» for «لربائد», in clauses 2, 5 and 9 (reference/HANDOFF.md). Left
  // as the document has them: a correction belongs in the approved text, and
  // from ticket 25 that means the CMS, never a quiet fix in the page.
  await page.goto('/terms');

  const clauses = await page.locator('.legal h2').evaluateAll((headings) =>
    headings
      .filter((heading) => {
        for (let next = heading.nextElementSibling; next && next.tagName !== 'H2'; next = next.nextElementSibling) {
          if (next.textContent!.includes('لبرائد')) return true;
        }
        return false;
      })
      .map((heading) => heading.textContent!.split('.')[0]),
  );
  expect(clauses).toEqual(['2', '5', '9']);

  const text = (await page.locator('.legal').textContent())!;
  expect(text.split('لبرائد').length - 1).toBe(3);
});

for (const legal of LEGAL_PAGES) {
  test(`${legal.rebuilt} says when it was last updated`, async ({ page }) => {
    await page.goto(legal.rebuilt);
    await expect(page.locator('.legal .updated')).toHaveText('آخر تحديث: 1 سبتمبر 2026');
  });

  test(`${legal.rebuilt}: every entry in the contents list jumps to its clause, clear of the header`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(legal.rebuilt);

    const entries = page.locator('.legal .toc a');
    const count = await entries.count();
    expect(count).toBeGreaterThan(5);

    for (let index = 0; index < count; index++) {
      await page.evaluate(() => window.scrollTo(0, 0));
      const entry = entries.nth(index);
      const label = normalise((await entry.textContent())!);
      const target = (await entry.getAttribute('href'))!;
      expect(target).toMatch(/^#[a-z]\d+$/);

      await entry.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));

      // The clause it names, numbered.
      const heading = page.locator(target);
      expect(normalise((await heading.textContent())!).replace(/^\d+\. /, ''), `entry ${index + 1}`).toBe(label);

      // In view, and not under the fixed header.
      await expect
        .poll(async () => {
          const [clause, header] = [await heading.boundingBox(), await page.locator('.nav').boundingBox()];
          return clause!.y >= header!.y + header!.height && clause!.y + clause!.height <= 900;
        }, { message: `"${label}" is hidden after jumping to it` })
        .toBe(true);
    }
  });

  test(`${legal.rebuilt} gives an email address and a phone number to reach the company`, async ({ page }) => {
    await page.goto(legal.rebuilt);
    const box = page.locator('.legal .contact-box');
    await expect(box.locator('a[href="mailto:ahmed.s@rabaedapp.com"]')).toBeVisible();
    await expect(box.locator('a[href="tel:+966576767900"]')).toBeVisible();
  });
}

for (const link of [
  { from: '/terms', name: 'سياسة الخصوصية ←', to: '/privacy', title: 'سياسة الخصوصية' },
  { from: '/privacy', name: 'شروط الخدمة ←', to: '/terms', title: 'شروط الخدمة' },
  { from: '/referral-terms', name: 'شروط خدمة ربائد', to: '/terms', title: 'شروط الخدمة' },
  { from: '/referral-terms', name: 'سياسة الخصوصية', to: '/privacy', title: 'سياسة الخصوصية' },
]) {
  test(`${link.from} links to ${link.to} as «${link.name}»`, async ({ page }) => {
    await page.goto(link.from);
    await page.locator('.legal').getByRole('link', { name: link.name, exact: true }).first().click();
    await page.waitForURL((url) => url.pathname === link.to);
    await expect(page.locator('.phero h1')).toHaveText(link.title);
  });
}

test('the Referral Program Terms point back at the programme and on to the other two documents', async ({ page }) => {
  await page.goto('/referral-terms');
  const seeAlso = page.locator('.legal .xref');
  // The programme's own page is ticket 15's; the link is right before it exists.
  await expect(seeAlso.getByRole('link', { name: 'صفحة برنامج الإحالة' })).toHaveAttribute('href', '/referral');
  await expect(seeAlso.getByRole('link', { name: 'شروط الخدمة' })).toHaveAttribute('href', '/terms');
  await expect(seeAlso.getByRole('link', { name: 'سياسة الخصوصية' })).toHaveAttribute('href', '/privacy');
});

test.describe('the header colour', () => {
  // The rule the animated pages follow: light from the moment the pale section
  // passes under the header's lower edge, 78px down, until the footer reaches
  // the top of the window. The Reference site's legal pages ran a listener of
  // their own that turned dark again as soon as the footer passed 78px; the
  // ticket asks for the animated pages' behaviour exactly, so the window here
  // is short enough for the footer to reach the top, where the two differ.
  for (const legal of LEGAL_PAGES) {
    test(`on ${legal.rebuilt} it follows the animated pages' rule`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 160 });
      await page.goto(legal.rebuilt);
      await page.evaluate(() => document.fonts.ready);

      const { documentTop, footerTop } = await page.evaluate(() => {
        const onPage = (element: Element) => element.getBoundingClientRect().top + window.scrollY;
        return { documentTop: onPage(document.querySelector('.legal')!), footerTop: onPage(document.querySelector('footer')!) };
      });
      const background = () => page.locator('.nav').evaluate((nav) => getComputedStyle(nav).backgroundColor);
      const scrollTo = (y: number) => page.evaluate((to) => window.scrollTo(0, to), Math.round(y));

      await expect.poll(background, { message: 'over the dark page hero' }).toBe(HEADER_BACKGROUND_OVER_DARK);

      await scrollTo(documentTop - 78 + 10);
      await expect.poll(background, { message: 'the document has passed under the header' }).toBe(HEADER_BACKGROUND_OVER_LIGHT);

      await scrollTo(footerTop - 40);
      await expect.poll(background, { message: 'the footer 40px from the top' }).toBe(HEADER_BACKGROUND_OVER_LIGHT);

      await scrollTo(footerTop + 10);
      await expect.poll(background, { message: 'the footer past the top' }).toBe(HEADER_BACKGROUND_OVER_DARK);

      await scrollTo(documentTop - 78 - 30);
      await expect.poll(background, { message: 'back over the page hero' }).toBe(HEADER_BACKGROUND_OVER_DARK);
    });
  }
});

test.describe('layout integrity', () => {
  for (const legal of LEGAL_PAGES) {
    for (const width of [360, 390, 768, 820, 1024, 1280, 1440, 1600]) {
      test(`${legal.rebuilt}: no sideways scrolling at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(legal.rebuilt);
        expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
      });
    }
  }
});
