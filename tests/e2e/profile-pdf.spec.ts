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
import type { Page, TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { test, expect, type Cms } from './entries';
import { HEADER_BACKGROUND_OVER_DARK, HEADER_BACKGROUND_OVER_LIGHT } from './header-colours';
import { ROUTES } from './routes';
import { oneSuiteAtATime } from './one-suite-at-a-time';

// One test at a time: they draft the same entries, and one test putting its
// entry back would take away the draft another is previewing.
test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

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

/**
 * The English button of the header as `20260923_090000_propose_english_site_words`
 * proposed it, by which that proposal is found among the site words' drafts:
 * restated rather than imported, for the reason `routes.ts` gives.
 */
const PROPOSED_ENGLISH_DEMO = 'Book a demo';

/**
 * The profile previewed in English, under the English header and footer the
 * founder has been proposed (ticket 40): the proposal made the draft, as
 * restoring it from the admin's Versions does, so the bar carries real English
 * words rather than the empty ones the published entry has. The Trust strip
 * and the profile are drafted as published in English too.
 */
async function previewInEnglish(cms: Cms) {
  const siteWords = cms.entry('site-words');
  const proposal = (await siteWords.drafts()).find((draft) => draft.version.header.demoLabel.en === PROPOSED_ENGLISH_DEMO);
  expect(proposal, 'no draft carries the English site words proposed').toBeTruthy();
  await siteWords.restoreVersion(proposal!);
  // The Screen mocks too, which section 07 shows: whether English is waiting
  // as their newest draft depends on what the suite before put back.
  for (const slug of ['trust-strip', 'screen-mocks', 'profile-page'] as const) {
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
    await expect(barButton(page)).toHaveAttribute('download', 'Rabaed-Profile-V4-AR.pdf');
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

  test('the bar has room for it at every width that shows the bar, in both languages, the English in its own words', async ({ page, cms }) => {
    for (const [address, preview] of [
      ['/profile', () => cms.preview('/profile')],
      ['/en/profile', () => previewInEnglish(cms)],
    ] as const) {
      for (const width of [1100, 1280, 1440]) {
        const where = `${address} at ${width}px`;
        await page.setViewportSize({ width, height: 900 });
        await preview();
        await expect(barButton(page)).toBeVisible();
        if (address === '/en/profile') {
          // The words the bar has to hold, not empty ones.
          await expect(page.locator('.nav .links a').first()).toHaveText('Home');
          await expect(page.locator('.nav .login')).toHaveText('Sign in');
          await expect(headerDemo(page)).toHaveText(PROPOSED_ENGLISH_DEMO);
        }
        const [brand, links, actions] = await Promise.all(
          ['.nav .brand', '.nav .links', '.nav .nav-cta'].map(async (selector) => (await page.locator(selector).boundingBox())!),
        );
        const apart = (one: typeof brand, other: typeof brand) => one.x + one.width <= other.x || other.x + other.width <= one.x;
        expect(apart(links, actions), `${where}: the menu and the buttons overlap`).toBe(true);
        expect(apart(brand, links), `${where}: the wordmark and the menu overlap`).toBe(true);
        expect(apart(brand, actions), `${where}: the wordmark and the buttons overlap`).toBe(true);
        // Every word on the bar on one line, as the bar is one line high.
        for (const item of await page.locator('.nav .links > a, .nav .nsub-t, .nav .nav-cta > a').all()) {
          if (!(await item.isVisible())) continue;
          // The lines its words are drawn on: each text's boxes, by how far down they start.
          const lines = await item.evaluate((element) => {
            const tops: number[] = [];
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              if (!node.textContent!.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              tops.push(...[...range.getClientRects()].map((rect) => rect.top));
            }
            tops.sort((a, b) => a - b);
            return tops.filter((top, index) => index === 0 || top - tops[index - 1]! > 4).length;
          });
          expect(lines, `${where}: “${(await item.textContent())?.trim()}” breaks over lines`).toBeLessThanOrEqual(1);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), where).toBeLessThanOrEqual(0);
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
    // Ahmed's English phone file — named as an Editor's file is, and as no
    // other run has named one. The CMS keeps it under that name, in the
    // bucket's `profile/` folder (`profile-files`), and the visitor saves it
    // under the same name.
    const name = `Rabaed-Profile-Replacement-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const replacement = await kept(PDF.en.phone);
    const uploaded = await page.request.post('/api/profile-files', {
      multipart: { file: { name, mimeType: 'application/pdf', buffer: replacement } },
    });
    expect(uploaded.ok(), await uploaded.text()).toBe(true);
    const { doc } = (await uploaded.json()) as { doc: { id: number; url: string; filename: string } };
    expect(doc.filename, 'kept under the name it was uploaded with').toBe(name);

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
      expect(download.suggestedFilename()).toBe(name);
      const file = testInfo.outputPath(download.suggestedFilename());
      await download.saveAs(file);
      expect((await readFile(file)).equals(replacement)).toBe(true);

      // The phone's file was not replaced, so it is still Ahmed's, under his name.
      await page.setViewportSize(PHONE);
      await expect(panelButton(page)).toHaveAttribute('href', PDF.ar.phone);
      await expect(panelButton(page)).toHaveAttribute('download', 'Rabaed-Profile-V4-AR-mobile.pdf');
      // And on a desktop again, the replacement, under its own.
      await page.setViewportSize(DESKTOP);
      await expect(barButton(page)).toHaveAttribute('download', name);
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

/**
 * The site's header or footer, as pixels, with nothing else of the page
 * around it: the header's translucent bar over the same plain ground on both
 * pages, and the footer taken out of the page's flow to its top, with nothing
 * laid over it. Where the page left it, a fraction of a pixel down that
 * differs between two pages, it is drawn a pixel taller or shorter.
 */
async function shotOf(page: Page, part: 'header' | 'footer'): Promise<PNG> {
  await page.addStyleTag({ content: 'section, .preview-banner, .pf-wa { visibility: hidden !important }' });
  if (part === 'footer') {
    await page.addStyleTag({ content: 'nav.nav { visibility: hidden !important }' });
    // The site's footer comes after everything the page holds: all else goes.
    await page.locator('footer').last().evaluate((footer) => {
      for (let kept: Element = footer; kept.parentElement && kept !== document.body; kept = kept.parentElement) {
        for (const other of kept.parentElement.children) {
          if (other !== kept && !other.matches('nav.nav, script, style, link')) (other as HTMLElement).style.display = 'none';
        }
      }
      window.scrollTo(0, 0);
    });
  } else {
    await page.addStyleTag({ content: 'footer { visibility: hidden !important }' });
  }
  await page.evaluate(() => document.fonts.ready);
  const element = part === 'header' ? page.locator('nav.nav') : page.locator('footer').last();
  return PNG.sync.read(await element.screenshot({ animations: 'disabled' }));
}

/**
 * How many pixels the profile's picture of a part differs from the home
 * page's in, once they are the same size. Where any do, the two pictures and
 * where they differ are kept with the test's results.
 */
async function differing(home: PNG, profile: PNG, part: string, testInfo: TestInfo): Promise<number> {
  expect({ width: profile.width, height: profile.height }, `the ${part}’s size`).toEqual({ width: home.width, height: home.height });
  const apart = new PNG({ width: home.width, height: home.height });
  const count = pixelmatch(home.data, profile.data, apart.data, home.width, home.height, { threshold: 0.1 });
  if (count > 0) {
    for (const [name, picture] of [['home', home], ['profile', profile], ['apart', apart]] as const) {
      await testInfo.attach(`${part}-${name}.png`, { body: PNG.sync.write(picture), contentType: 'image/png' });
    }
  }
  return count;
}

/**
 * The spec's Testing Decisions: the profile's header and footer are the home
 * page's to the pixel, Download PDF aside — so every other page's header is
 * the one it was (ticket 104). Both pages are previewed, the profile being
 * unpublished on this server, so each carries the same banner; and each is
 * read at its top, where the header is dark.
 */
test.describe('the header and footer are the home page’s, to the pixel', () => {
  for (const viewport of [DESKTOP, PHONE]) {
    test(`at ${viewport.width}px, the header, Download PDF hidden`, async ({ page, cms }, testInfo) => {
      await page.setViewportSize(viewport);
      await cms.preview('/');
      // The home page's own link is marked in the menu, as each page's is, and
      // the profile has no link there to mark: the one difference a page's
      // header is meant to have.
      await page.evaluate(() => document.querySelectorAll('.nav .links a.on').forEach((link) => link.classList.remove('on')));
      const home = await shotOf(page, 'header');

      await cms.preview('/profile');
      await page.addStyleTag({ content: '.nav a.pdf { display: none !important }' });
      const profile = await shotOf(page, 'header');

      expect(await differing(home, profile, 'header', testInfo), 'pixels apart from the home page’s header').toBe(0);
    });

    test(`at ${viewport.width}px, the footer`, async ({ page, cms }, testInfo) => {
      await page.setViewportSize(viewport);
      await cms.preview('/');
      const home = await shotOf(page, 'footer');
      await cms.preview('/profile');
      const profile = await shotOf(page, 'footer');

      expect(await differing(home, profile, 'footer', testInfo), 'pixels apart from the home page’s footer').toBe(0);
    });
  }
});
