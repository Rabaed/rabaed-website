/**
 * The Pour Tracker as a visitor receives it (tickets 18 and 49): the tool
 * itself, a single file downloaded under the name the Reference site gives it,
 * that goes on working after it has left the site — opened from a disk, with
 * no network at all.
 *
 * Every check here is made on the downloaded copy, not on the file in the
 * repo, because the thing being promised is what arrives in somebody's
 * Downloads folder.
 *
 * **The file is the co-founder's release, byte for byte, and is never edited
 * here** (ticket 49). Its code is deliberately unreadable, and it checks
 * itself: a changed copy tells its user it is «not the official Rabaed
 * release». So ticket 18's treatment of the placeholder — correcting the
 * brand, removing the sending code — cannot be done to this file, and is
 * checked instead on what the tool does, screen by screen: its words spell
 * ربائد, and using it sends nothing anywhere. That is a walk through the tool,
 * not a reading of every line of it; the checksum is what holds the rest to
 * the release that was walked through.
 *
 * The web fonts are the one thing the file fetches. The tool page says so —
 * offline, the type falls back to the system font and nothing else changes —
 * so a failed font request is expected here and nothing else is.
 */
import { test, expect, type Browser, type Page, type TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { provideProjectFolder } from './project-folder';
import { POUR_TRACKER, checksumOf } from './pour-tracker';

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const isFontRequest = (url: string) =>
  url.startsWith('http') && FONT_HOSTS.includes(new URL(url).hostname);

/** Follows a plain link to the file, as a download button would, and keeps what arrives. */
async function downloadTool(page: Page, testInfo: TestInfo) {
  await page.goto('/');
  const arriving = page.waitForEvent('download');
  await page.evaluate((href) => {
    const link = document.createElement('a');
    link.href = href;
    document.body.append(link);
    link.click();
  }, POUR_TRACKER.path);
  const download = await arriving;

  const file = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  return { download, file };
}

/** Everything that went wrong on a page, apart from the font requests an offline file is allowed to lose. */
function watchForProblems(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    // A failed request is reported twice: here, against the page rather than
    // the address that failed, and below with its address. It is judged
    // below, where a font can be told from anything else.
    if (message.text().startsWith('Failed to load resource')) return;
    problems.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (isFontRequest(request.url())) return;
    problems.push(`request failed: ${request.url()} ${request.failure()?.errorText}`);
  });
  return problems;
}

/** Opens the downloaded file from disk, with a project folder the tool can be given. */
async function openTool(browser: Browser, file: string, { offline }: { offline: boolean }) {
  const context = await browser.newContext({ offline });
  await context.addInitScript(provideProjectFolder);
  const tool = await context.newPage();
  const problems = watchForProblems(tool);
  const internetRequests: string[] = [];
  context.on('request', (request) => {
    const url = request.url();
    if (url.startsWith('http') && !isFontRequest(url)) internetRequests.push(`${request.method()} ${url}`);
  });
  await tool.goto(pathToFileURL(file).href);
  return { context, tool, problems, internetRequests };
}

/**
 * Checks the brand is not misspelt on whatever the tool shows now: ticket 18 corrected
 * رَبَاعِد in six places of the placeholder, and it must not come back with the
 * real tool. Compared with the short vowel marks stripped, so it cannot
 * survive by being written with other diacritics, or none.
 */
async function expectBrandSpelledRight(tool: Page, screen: string) {
  const words = await tool.locator('body').innerText();
  expect(words.replace(/[ً-ْ]/g, ''), screen).not.toContain('رباعد');
}

/**
 * Gives the tool its folder and a project, in Arabic, and logs one pour cast
 * on 1 September 2026, checking the brand on each screen it passes.
 *
 * The tool's fields carry no labels a screen reader could name them by, so
 * they are found by their ids and placeholders.
 */
async function logAPour(tool: Page) {
  await tool.getByRole('button', { name: 'ع' }).click();
  await expectBrandSpelledRight(tool, 'the first screen');

  await tool.getByRole('button', { name: /اختيار مجلّد مشروع جديد/ }).click();
  await expectBrandSpelledRight(tool, 'the project’s details');
  await tool.locator('#s-name').fill('برج أ');
  await tool.getByRole('button', { name: 'ابدأ التتبّع' }).click();
  await expectBrandSpelledRight(tool, 'the register');

  await tool.getByRole('button', { name: '＋ تسجيل صبّة' }).first().click();
  await tool.locator('#f-date').fill('2026-09-01');
  await tool.locator('#f-vol').fill('12');
  await tool.getByPlaceholder('مثال: قاعدة F14').fill('قاعدة F14');
  await tool.getByRole('button', { name: '＋ تسجيل صبّة' }).last().click();
  await expect(tool.getByRole('row').filter({ hasText: 'PR-001' })).toBeVisible();
  await expectBrandSpelledRight(tool, 'the pour, logged');
}

test.describe('Pour Tracker download', () => {
  test('downloads under the name the Reference site uses', async ({ page }, testInfo) => {
    const { download } = await downloadTool(page, testInfo);
    expect(download.suggestedFilename()).toBe(POUR_TRACKER.name);
  });

  test('is sent to be saved, and kept out of search results', async ({ request }) => {
    const response = await request.get(POUR_TRACKER.path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.headers()['content-disposition']).toContain('attachment');

    // Before launch every response is noindex, so this cannot tell the
    // download's own rule from the site-wide one. What keeps the file out of
    // search results after launch is that its rule in `next.config.ts` sits
    // outside the environment check, as the studio's does.
    expect(response.headers()['x-robots-tag']).toContain('noindex');
  });

  test('is the official release, unchanged', async ({ page }, testInfo) => {
    // Kept out of git's line-ending normalisation for the same reason
    // (`.gitattributes`).
    const { file } = await downloadTool(page, testInfo);
    expect(checksumOf(await readFile(file))).toBe(POUR_TRACKER.sha256);
  });

  test('opens from disk with no network, in Arabic and in English, and remembers which', async ({
    page,
    browser,
  }, testInfo) => {
    const { file } = await downloadTool(page, testInfo);
    const { context, tool, problems, internetRequests } = await openTool(browser, file, { offline: true });
    try {
      await expect(tool.getByRole('heading', { level: 1 })).toBeVisible();

      await tool.getByRole('button', { name: 'ع' }).click();
      await expect(tool.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(tool.getByRole('heading', { level: 1 })).toHaveText('صبّاتك. مجلّدك. جهازك.');
      await expectBrandSpelledRight(tool, 'in Arabic');
      await expect(tool.getByText('© 2026 ربائد البناء')).toBeVisible();
      // Its build is not written plainly in the file; it shows it.
      await expect(tool.getByText(POUR_TRACKER.build).first()).toBeVisible();

      await tool.getByRole('button', { name: 'EN' }).click();
      await expect(tool.locator('html')).toHaveAttribute('dir', 'ltr');
      await expect(tool.getByRole('heading', { level: 1 })).toHaveText('Your pours. Your folder. Your computer.');
      await expectBrandSpelledRight(tool, 'in English');
      await expect(tool.getByText('© 2026 Rabaed Al-Binaa')).toBeVisible();

      await tool.getByRole('button', { name: 'ع' }).click();
      await tool.reload();
      await expect(tool.locator('html')).toHaveAttribute('dir', 'rtl');

      expect(problems).toEqual([]);
      expect(internetRequests, 'requests made to the internet').toEqual([]);
    } finally {
      await context.close();
    }
  });

  test('logging a pour schedules its 7 and 28-day cube tests, and writes it to the project folder', async ({
    page,
    browser,
  }, testInfo) => {
    const { file } = await downloadTool(page, testInfo);
    const { context, tool, problems } = await openTool(browser, file, { offline: true });
    try {
      await logAPour(tool);

      const row = tool.getByRole('row').filter({ hasText: 'PR-001' });
      await expect(row).toContainText('01 سبتمبر 2026');
      await expect(row).toContainText('التاريخ المستهدف 08 سبتمبر');
      await expect(row).toContainText('التاريخ المستهدف 29 سبتمبر');

      // It writes a moment after the row appears.
      const readRecords = async () =>
        JSON.parse(
          await tool.evaluate(() => (window as unknown as { readProjectRecords(): Promise<string> }).readProjectRecords()),
        );
      await expect.poll(async () => (await readRecords()).pours).toHaveLength(1);
      const records = await readRecords();
      expect(records.project.name).toBe('برج أ');
      expect(records.pours[0]).toMatchObject({ ref: 'PR-001', pourDate: '2026-09-01', volume: '12' });

      expect(problems).toEqual([]);
    } finally {
      await context.close();
    }
  });

  test('sends nothing anywhere while it is used online', async ({ page, browser }, testInfo) => {
    // Lead capture belongs to the site (ticket 30). The tool's code is
    // unreadable, so what it sends is watched rather than read: set up a
    // project, log a pour and open its upgrade panel with the network on, and
    // the only requests are the fonts.
    const { file } = await downloadTool(page, testInfo);
    const { context, tool, problems, internetRequests } = await openTool(browser, file, { offline: false });
    try {
      await logAPour(tool);

      // The one way out it offers is a link, to the site's own demo request
      // (`#contact`, on the home page's closing section). The pour just
      // logged is open in a panel over the header, and closes first.
      await tool.keyboard.press('Escape');
      await tool.getByRole('button', { name: /الترقية إلى النسخة السحابية/ }).click();
      await expect(tool.getByRole('link', { name: /اطلب النسخة السحابية/ })).toHaveAttribute(
        'href',
        'https://rabaedapp.com/#contact',
      );
      await expectBrandSpelledRight(tool, 'the upgrade panel');

      expect(problems).toEqual([]);
      expect(internetRequests, 'requests made to the internet').toEqual([]);
    } finally {
      await context.close();
    }
  });
});
