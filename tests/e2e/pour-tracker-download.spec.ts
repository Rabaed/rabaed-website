/**
 * The Pour Tracker as a visitor receives it (ticket 18): a single file,
 * downloaded under the name the Reference site gives it, that goes on working
 * after it has left the site — opened from a disk, with no network at all.
 *
 * Every check here is made on the downloaded copy, not on the file in the
 * repo, because the thing being promised is what arrives in somebody's
 * Downloads folder.
 *
 * The web fonts are the one thing the file still fetches. Its own FAQ says so
 * — offline, the type falls back to the system font and nothing else changes —
 * so a failed font request is expected here and nothing else is.
 */
import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const DOWNLOAD_NAME = 'Rabaed-Pour-Tracker.html';
const DOWNLOAD_PATH = `/downloads/${DOWNLOAD_NAME}`;

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
  }, DOWNLOAD_PATH);
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
    if (isFontRequest(message.location().url)) return;
    problems.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (isFontRequest(request.url())) return;
    problems.push(`request failed: ${request.url()} ${request.failure()?.errorText}`);
  });
  return problems;
}

test.describe('Pour Tracker download', () => {
  test('downloads under the name the Reference site uses', async ({ page }, testInfo) => {
    const { download } = await downloadTool(page, testInfo);
    expect(download.suggestedFilename()).toBe(DOWNLOAD_NAME);
  });

  test('is sent to be saved, and kept out of search results', async ({ request }) => {
    const response = await request.get(DOWNLOAD_PATH);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.headers()['content-disposition']).toContain('attachment');

    // Before launch every response is noindex, so this cannot tell the
    // download's own rule from the site-wide one. What keeps the file out of
    // search results after launch is that its rule in `next.config.ts` sits
    // outside the environment check, as the studio's does.
    expect(response.headers()['x-robots-tag']).toContain('noindex');
  });

  test('spells the brand ربائد, never رَبَاعِد', async ({ page }, testInfo) => {
    const { file } = await downloadTool(page, testInfo);
    const text = await readFile(file, 'utf8');

    // Compared with the short vowel marks stripped, so the misspelling cannot
    // survive by being written with different diacritics, or none.
    const bare = text.replace(/[ً-ْ]/g, '');
    expect(bare).not.toContain('رباعد');
    expect(text).toContain('ربائد');
  });

  test('carries no code that sends a visitor’s details anywhere', async ({ page }, testInfo) => {
    // Lead capture belongs to the site (ticket 30). The Reference file shipped
    // with its Google Sheet address left empty, so it never actually sent
    // anything and no amount of watching the network could tell the code
    // apart from its absence — which is why this reads the file.
    const { file } = await downloadTool(page, testInfo);
    const text = await readFile(file, 'utf8');

    for (const trace of ['SHEET_ENDPOINT', 'sendBeacon', 'fetch(', 'XMLHttpRequest']) {
      expect(text, `the downloaded file still contains ${trace}`).not.toContain(trace);
    }
  });

  test('opens from disk with no network, in Arabic and in English', async ({ page, browser }, testInfo) => {
    const { file } = await downloadTool(page, testInfo);

    const offline = await browser.newContext({ offline: true });
    try {
      const tool = await offline.newPage();
      const problems = watchForProblems(tool);
      const onlineRequests: string[] = [];
      tool.on('request', (request) => {
        const url = request.url();
        if (url.startsWith('http') && !isFontRequest(url)) onlineRequests.push(url);
      });

      await tool.goto(pathToFileURL(file).href);

      await expect(tool.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(tool).toHaveTitle(/ربائد/);
      await expect(tool.getByRole('heading', { level: 1 })).toContainText('سجّل الصبّة اليوم');
      await expect(tool.getByText('صُنعت في ربائد لمهندسي المواقع')).toBeVisible();

      await tool.getByRole('button', { name: 'English' }).click();
      await expect(tool.locator('html')).toHaveAttribute('dir', 'ltr');
      await expect(tool.getByRole('heading', { level: 1 })).toContainText('Log the pour today');

      await tool.getByRole('button', { name: 'العربية' }).click();
      await expect(tool.locator('html')).toHaveAttribute('dir', 'rtl');

      // The file's own form still has to work: the button unlocks once the
      // details are valid, and pressing it confirms. Opened from a disk it must
      // not try to download itself again — Chromium ignores `download` on a
      // file:// page and reloads it instead, which wiped the form and never
      // showed the confirmation.
      const submit = tool.getByRole('button', { name: /حمّل الأداة الآن|أكمل البيانات/ });
      await expect(submit).toBeDisabled();
      await tool.getByLabel('الاسم الأول').fill('أحمد');
      await tool.getByLabel('اسم العائلة').fill('السالم');
      await tool.getByLabel('رقم الجوال').fill('512345678');
      await tool.getByLabel('البريد الإلكتروني').fill('ahmed@example.com');
      await expect(submit).toBeEnabled();

      await submit.click();
      await expect(tool.getByText('تم — التحميل بدأ')).toBeVisible();
      // Its "did not start?" link would reload the page the same way.
      await expect(tool.getByText('لم يبدأ التحميل؟ اضغط هنا')).toBeHidden();

      expect(problems).toEqual([]);
      expect(onlineRequests, 'requests made to the internet').toEqual([]);
    } finally {
      await offline.close();
    }
  });
});
