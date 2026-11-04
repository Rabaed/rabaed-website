/**
 * The Company profile's header (ticket 104): its Download PDF button, its
 * "Book a live demo", and its colour.
 *
 * The button is the header's one button of a page's own, beside Sign in, on
 * the desktop bar and in the phone panel. It gives one of four Profile PDFs:
 * the page's language picks the pair, and the screen picks within it — 980px
 * wide or less is the phone version, the site's own phone line — and it
 * follows the screen as it changes. Without JavaScript it is the desktop
 * version. No other page shows it.
 *
 * On the profile the header follows the section beneath it all the way down;
 * on every other page it keeps its rule, light from the first light section
 * until the footer (the founder's decision, 4 November 2026). The profile has
 * no light section yet — tickets 105–109 bring Ahmed's — so both are shown on
 * a page the test arranges: the same light and dark sections, put before the
 * footer of the profile and of the home page.
 *
 * Seen in preview, as an Editor sees the page before the founder publishes
 * it, so this suite runs on the first test server and publishes nothing.
 *
 * The four file names are Ahmed's (`PDF/` in his folder), restated here
 * rather than imported, for the reason `routes.ts` gives.
 */
import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test, expect, type Cms } from './entries';
import { HEADER_BACKGROUND_OVER_DARK, HEADER_BACKGROUND_OVER_LIGHT } from './header-colours';
import { ROUTES } from './routes';

// One test at a time: they draft the same entries, and one test putting its
// entry back would take away the draft another is previewing.
test.describe.configure({ mode: 'default' });

/** Ahmed's four files, as the site keeps them (`public/profile/pdf/`). */
const PDF = {
  ar: { desktop: '/profile/pdf/Rabaed-Profile-V4-AR.pdf', phone: '/profile/pdf/Rabaed-Profile-V4-AR-mobile.pdf' },
  en: { desktop: '/profile/pdf/Rabaed-Profile-V4-EN.pdf', phone: '/profile/pdf/Rabaed-Profile-V4-EN-mobile.pdf' },
} as const;

const LABEL = { ar: 'تنزيل PDF', en: 'Download PDF' } as const;

/** Where the header's "Book a live demo" goes on the profile: the home page's form. */
const DEMO = { ar: '/#demo', en: '/en#demo' } as const;

const DESKTOP = { width: 1280, height: 900 };
const PHONE = { width: 390, height: 844 };

/** The button on the desktop bar, and the one in the phone panel. */
const barButton = (page: Page) => page.locator('.nav .nav-cta a.pdf');
const panelButton = (page: Page) => page.locator('.nav .mnav a.pdf');
const headerDemo = (page: Page) => page.locator('.nav .nav-cta .btn.p');

/** A file as the repository keeps it, to hold a download to. */
const kept = (file: string) => readFile(path.join(process.cwd(), 'public', file));

const openPanel = async (page: Page) => {
  await page.locator('.navtog').click();
  await expect(page.locator('.nav')).toHaveClass(/\bopen\b/);
};

/** The profile, and the entries it shares — its header and footer, the Trust strip — previewed in English as well as Arabic. */
async function previewInEnglish(cms: Cms) {
  for (const slug of ['site-words', 'trust-strip', 'profile-page'] as const) {
    const entry = cms.entry(slug);
    await entry.draft({ ...(await entry.published()), languages: ['ar', 'en'] });
  }
  await cms.preview('/en/profile');
}

test.describe('Download PDF', () => {
  test('at 1280px it sits beside Sign in on the bar and gives the Arabic desktop file; Book a live demo goes to the home page’s form', async ({
    page,
    cms,
  }) => {
    await page.setViewportSize(DESKTOP);
    await cms.preview('/profile');

    await expect(barButton(page)).toBeVisible();
    await expect(barButton(page)).toHaveText(LABEL.ar);
    await expect(barButton(page)).toHaveAttribute('href', PDF.ar.desktop);
    await expect(barButton(page)).toHaveAttribute('download', '');
    // Beside Sign in: the next thing along the bar.
    await expect(page.locator('.nav .nav-cta a.login + a.pdf')).toBeVisible();
    await expect(panelButton(page)).toBeHidden();

    await expect(headerDemo(page)).toHaveAttribute('href', DEMO.ar);
  });

  test('at 390px it sits beside Sign in in the panel and gives the Arabic phone file', async ({ page, cms }) => {
    await page.setViewportSize(PHONE);
    await cms.preview('/profile');
    await expect(barButton(page)).toBeHidden();

    await openPanel(page);
    await expect(panelButton(page)).toBeVisible();
    await expect(panelButton(page)).toHaveText(LABEL.ar);
    await expect(panelButton(page)).toHaveAttribute('href', PDF.ar.phone);
    await expect(page.locator('.mnav .mrow a.mlogin + a.pdf')).toBeVisible();

    // On the row with Sign in.
    const login = (await page.locator('.mnav .mlogin').boundingBox())!;
    const button = (await panelButton(page).boundingBox())!;
    expect(Math.abs(login.y + login.height / 2 - (button.y + button.height / 2))).toBeLessThan(2);
  });

  test('the bar has room for it at every width that shows the bar, in both languages', async ({ page, cms }) => {
    for (const [address, preview] of [
      ['/profile', () => cms.preview('/profile')],
      ['/en/profile', () => previewInEnglish(cms)],
    ] as const) {
      for (const width of [1100, 1280, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await preview();
        await expect(barButton(page)).toBeVisible();
        const [links, actions] = await Promise.all([page.locator('.nav .links').boundingBox(), page.locator('.nav .nav-cta').boundingBox()]);
        const apart = links!.x + links!.width <= actions!.x || actions!.x + actions!.width <= links!.x;
        expect(apart, `${address} at ${width}px: the menu and the buttons overlap`).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${address} at ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });

  test('changes file as the screen crosses 981px, both ways', async ({ page, cms }) => {
    await page.setViewportSize(DESKTOP);
    await cms.preview('/profile');

    for (const [width, file] of [
      [981, PDF.ar.desktop],
      [980, PDF.ar.phone],
      [981, PDF.ar.desktop],
      [390, PDF.ar.phone],
      [1280, PDF.ar.desktop],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await expect(barButton(page), `${width}px`).toHaveAttribute('href', file);
      await expect(panelButton(page), `${width}px`).toHaveAttribute('href', file);
    }
  });

  test('in English it says Download PDF and gives the English files, desktop and phone', async ({ page, cms }) => {
    await page.setViewportSize(DESKTOP);
    await previewInEnglish(cms);

    await expect(barButton(page)).toHaveText(LABEL.en);
    await expect(barButton(page)).toHaveAttribute('href', PDF.en.desktop);
    await expect(headerDemo(page)).toHaveAttribute('href', DEMO.en);

    await page.setViewportSize(PHONE);
    await page.reload();
    await openPanel(page);
    await expect(panelButton(page)).toHaveText(LABEL.en);
    await expect(panelButton(page)).toHaveAttribute('href', PDF.en.phone);
  });

  test('without JavaScript a phone gets the desktop file', async ({ browser, page, cms }) => {
    await cms.preview('/profile');
    // The same preview, in a browser that runs no script.
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: PHONE, storageState: await page.context().storageState() });
    const phone = await context.newPage();
    await phone.goto('/profile');

    await expect(barButton(phone)).toHaveAttribute('href', PDF.ar.desktop);
    await expect(panelButton(phone)).toHaveAttribute('href', PDF.ar.desktop);
    await context.close();
  });

  test('downloads the file itself, under its own name', async ({ page, cms }, testInfo) => {
    await page.setViewportSize(DESKTOP);
    await cms.preview('/profile');
    const fromTheBar = page.waitForEvent('download');
    await barButton(page).click();
    const desktop = await fromTheBar;
    expect(desktop.suggestedFilename()).toBe('Rabaed-Profile-V4-AR.pdf');
    const desktopFile = testInfo.outputPath(desktop.suggestedFilename());
    await desktop.saveAs(desktopFile);
    expect((await readFile(desktopFile)).equals(await kept(PDF.ar.desktop))).toBe(true);

    await page.setViewportSize(PHONE);
    await page.reload();
    await openPanel(page);
    const fromThePanel = page.waitForEvent('download');
    await panelButton(page).click();
    const phone = await fromThePanel;
    expect(phone.suggestedFilename()).toBe('Rabaed-Profile-V4-AR-mobile.pdf');
    const phoneFile = testInfo.outputPath(phone.suggestedFilename());
    await phone.saveAs(phoneFile);
    expect((await readFile(phoneFile)).equals(await kept(PDF.ar.phone))).toBe(true);
  });

  test('every one of the four is served as a PDF', async ({ request }) => {
    for (const file of [PDF.ar.desktop, PDF.ar.phone, PDF.en.desktop, PDF.en.phone]) {
      const response = await request.get(file);
      expect(response.status(), file).toBe(200);
      expect(response.headers()['content-type'], file).toBe('application/pdf');
      expect((await response.body()).equals(await kept(file)), file).toBe(true);
    }
  });

  test('an Editor’s replacement is what downloads next, under its own name, and the other files stay Ahmed’s', async ({ page, cms }, testInfo) => {
    // A real PDF, which the CMS checks a PDF is, but not the Arabic one —
    // Ahmed's English phone file — under a name no other run has used.
    const name = `profile-replacement-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const replacement = await kept(PDF.en.phone);
    const uploaded = await page.request.post('/api/profile-files', {
      multipart: { file: { name, mimeType: 'application/pdf', buffer: replacement } },
    });
    expect(uploaded.ok(), await uploaded.text()).toBe(true);
    const { doc } = (await uploaded.json()) as { doc: { id: number; url: string; filename: string } };

    try {
      const profile = cms.entry('profile-page');
      const saved = await profile.published();
      await profile.draft({ ...saved, pdf: { ...saved.pdf, arabic: doc.id } });

      await page.setViewportSize(DESKTOP);
      await cms.preview('/profile');
      await expect(barButton(page)).toHaveAttribute('href', doc.url);
      const arriving = page.waitForEvent('download');
      await barButton(page).click();
      const download = await arriving;
      expect(download.suggestedFilename()).toBe(doc.filename);
      const file = testInfo.outputPath(download.suggestedFilename());
      await download.saveAs(file);
      expect((await readFile(file)).equals(replacement)).toBe(true);

      // The phone's file was not replaced, so it is still Ahmed's.
      await page.setViewportSize(PHONE);
      await expect(panelButton(page)).toHaveAttribute('href', PDF.ar.phone);
    } finally {
      await cms.end();
      await page.request.delete(`/api/profile-files/${doc.id}`);
    }
  });

  test('its words are an Editor’s', async ({ page, cms }) => {
    const profile = cms.entry('profile-page');
    const saved = await profile.published();
    await profile.draft({ ...saved, pdf: { label: { ...saved.pdf.label, ar: 'الملف كاملاً' } } });

    await page.setViewportSize(DESKTOP);
    await cms.preview('/profile');
    await expect(barButton(page)).toHaveText('الملف كاملاً');
    await page.setViewportSize(PHONE);
    await openPanel(page);
    await expect(panelButton(page)).toHaveText('الملف كاملاً');
  });

  test('no other page shows it, and their Book a live demo still jumps to the form on the page', async ({ page, request }) => {
    for (const route of ROUTES) {
      const html = await (await request.get(route.path)).text();
      expect(html, route.path).not.toContain('/profile/pdf/');
      expect(html, route.path).not.toContain(LABEL.ar);
      expect(html, route.path).not.toContain(LABEL.en);
      expect(html, route.path).not.toContain('data-colours');
    }

    await page.goto('/');
    await expect(barButton(page)).toHaveCount(0);
    await expect(panelButton(page)).toHaveCount(0);
    await expect(headerDemo(page)).toHaveAttribute('href', '#demo');
  });
});

/** The header's background, which says which of its two treatments it is showing. */
const headerBackground = (page: Page) => page.locator('.nav').evaluate((nav) => getComputedStyle(nav).backgroundColor);

/** Puts a light section and then a dark one, each a screen and more tall, just before the footer. */
async function arrangeLightThenDark(page: Page) {
  // Once the page is running, so the arranged sections are not part of what React hydrates.
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const [id, colour] of [
      ['arranged-light', 'light'],
      ['arranged-dark', 'dark'],
    ]) {
      const section = document.createElement('section');
      section.id = id;
      section.className = colour;
      section.style.height = '1400px';
      document.querySelector('footer')!.before(section);
    }
  });
}

/** Scrolls until the top of `selector` is just under the header's lower edge. */
const scrollUnderTheHeader = (page: Page, selector: string) =>
  page.evaluate((target) => {
    const element = document.querySelector(target)!;
    window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 40);
  }, selector);

test.describe('the header’s colour', () => {
  test('on the Company profile it follows the section beneath it: dark again over a dark section after a light one', async ({
    page,
    cms,
  }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await cms.preview('/profile');
    await arrangeLightThenDark(page);
    await expect.poll(() => headerBackground(page)).toBe(HEADER_BACKGROUND_OVER_DARK);

    await scrollUnderTheHeader(page, '#arranged-light');
    await expect.poll(() => headerBackground(page), { message: 'over the light section' }).toBe(HEADER_BACKGROUND_OVER_LIGHT);

    await scrollUnderTheHeader(page, '#arranged-dark');
    await expect.poll(() => headerBackground(page), { message: 'over the dark section after it' }).toBe(HEADER_BACKGROUND_OVER_DARK);

    await scrollUnderTheHeader(page, '#arranged-light');
    await expect.poll(() => headerBackground(page), { message: 'back over the light section' }).toBe(HEADER_BACKGROUND_OVER_LIGHT);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => headerBackground(page), { message: 'back at the top' }).toBe(HEADER_BACKGROUND_OVER_DARK);
  });

  test('on the home page it keeps its rule: light from the first light section on, dark sections after it included', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await page.goto('/');
    await arrangeLightThenDark(page);
    await expect.poll(() => headerBackground(page)).toBe(HEADER_BACKGROUND_OVER_DARK);

    await scrollUnderTheHeader(page, '#arranged-light');
    await expect.poll(() => headerBackground(page), { message: 'over the light section' }).toBe(HEADER_BACKGROUND_OVER_LIGHT);

    // Over a dark section after the first light one, still light.
    await scrollUnderTheHeader(page, '#arranged-dark');
    await page.waitForTimeout(300);
    expect(await headerBackground(page)).toBe(HEADER_BACKGROUND_OVER_LIGHT);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => headerBackground(page), { message: 'back at the top' }).toBe(HEADER_BACKGROUND_OVER_DARK);
  });
});
