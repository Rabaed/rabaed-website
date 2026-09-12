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
