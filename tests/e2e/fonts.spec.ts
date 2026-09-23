/**
 * Fonts are self-hosted, and the proof has two halves — ticket 02 learned the
 * hard way that either half alone reports success while Arabic renders in a
 * fallback face:
 *
 *  1. Nothing is fetched from Google. A third-party font request is a privacy
 *     and performance problem, and it makes the rendered page depend on a
 *     service we do not control.
 *  2. A face actually covering the Arabic block is loaded. Checking by family
 *     name is not enough: `IBM Plex Sans Arabic` is split by `unicode-range`,
 *     and its Latin face loads from the Latin text on every page — so the
 *     family reports as loaded with the Arabic file missing.
 */
import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

const GOOGLE_FONTS = /fonts\.(googleapis|gstatic)\.com/;

/** The Arabic block, as `document.fonts` reports a `unicode-range`. */
const ARABIC_RANGE = 'U+600-6FF';

for (const route of ROUTES) {
  test(`${route.path} asks Google Fonts for nothing`, async ({ page }) => {
    const googleRequests: string[] = [];
    page.on('request', (request) => {
      if (GOOGLE_FONTS.test(request.url())) googleRequests.push(request.url());
    });

    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);

    expect(googleRequests).toEqual([]);
  });
}

test('Arabic text renders in a face that covers Arabic', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const loaded = await page.evaluate(
    (range) =>
      [...document.fonts].some(
        (face) =>
          face.status === 'loaded' &&
          face.family === 'IBM Plex Sans Arabic' &&
          face.unicodeRange.includes(range),
      ),
    ARABIC_RANGE,
  );

  expect(loaded).toBe(true);
});

/**
 * The faces Arabic text may be set in. DM Mono and the English face have no
 * Arabic glyphs, so Arabic given either silently falls through to whatever the
 * browser has — the defect bug 45 found on every eyebrow (spec: Design system).
 * Only the first family is read: it is the one the page asked for, and the
 * rest of the stack is there for the moments before it arrives.
 */
const ARABIC_FACES = ['IBM Plex Sans Arabic', 'Thmanyah Sans'];

/**
 * Tracking a label's width out, as the Reference site's labels are at .06em to
 * .14em, pulls joined Arabic letters apart, so an Arabic label is untracked
 * (ADR-0018). The Reference site's headings are drawn in by .01em to .02em and
 * a few phrases let out by as much: too little to part a join, and the design's.
 */
const LABEL_TRACKING = 0.05;

/** The phone and the desktop the baselines were captured at. */
const WIDTHS = [390, 1440];

for (const route of ROUTES.filter((r) => r.locale === 'ar')) {
  for (const width of WIDTHS) {
    test(`${route.path} at ${width}px sets its Arabic in an Arabic face, untracked`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path);

      const misset = await page.evaluate(({ faces, labelTracking }) => {
        const arabic = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
        const found: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = node.textContent ?? '';
          const element = node.parentElement;
          if (!element || !arabic.test(text)) continue;
          // Structured data and scripts carry Arabic that is never drawn.
          if (element.closest('script, style, template, noscript')) continue;
          const style = getComputedStyle(element);
          const face = style.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
          const tracked = parseFloat(style.letterSpacing) >= labelTracking * parseFloat(style.fontSize);
          // Thmanyah Sans is served in Regular alone, so a heavier label
          // would be a bold the browser fakes (ADR-0018).
          const faked = face === 'Thmanyah Sans' && style.fontWeight !== '400';
          if (faces.includes(face) && !tracked && !faked) continue;
          const where = element.className ? `${element.localName}.${String(element.className).split(' ').join('.')}` : element.localName;
          found.push(
            `${where} «${text.trim().slice(0, 30)}»: ${face}${tracked ? `, letter-spacing ${style.letterSpacing}` : ''}${faked ? `, weight ${style.fontWeight}` : ''}`,
          );
        }
        return found;
      }, { faces: ARABIC_FACES, labelTracking: LABEL_TRACKING });

      expect(misset).toEqual([]);
    });
  }
}

test('the Arabic labels load Thmanyah Sans', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const loaded = await page.evaluate(() =>
    [...document.fonts].some((face) => face.status === 'loaded' && face.family.replace(/["']/g, '') === 'Thmanyah Sans'),
  );

  expect(loaded).toBe(true);
});
