/**
 * Draws the images a browser tab and a shared link show for the site, from the
 * brand files already in the repo (ticket 31):
 *
 *  - `public/og-rabaed.png`, the 1200×630 sharing image every page names. The
 *    Reference site pointed at this address, but nothing was ever there.
 *  - `src/app/icon.png` and `src/app/apple-icon.png`, the favicon and the home
 *    screen icon: the brand mark cut from the wordmark, with no text, because
 *    text is illegible at tab size.
 *
 *   npm run brand:export
 *
 * The images are committed; run this again only when the brand files or the
 * words below change. The sharing image is rendered by Chromium, not drawn
 * with an image library, because it carries Arabic text and only a browser
 * shapes Arabic with the site's own font.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = (...parts) => path.join(repoRoot, ...parts);

const SHARING_IMAGE = { width: 1200, height: 630 };

/** A file as a `data:` URL, so the page rendered below needs no server. */
async function dataUrl(file, type) {
  return `data:${type};base64,${(await readFile(file)).toString('base64')}`;
}

/**
 * The home page's hero, as approved copy (`src/content/pages/home.ts`), on the
 * site's dark ground with its tokens (`src/styles/tokens.css`).
 */
async function sharingImageHtml() {
  const font = (file) => dataUrl(fromRoot('assets', 'fonts', file), 'font/woff2');
  const wordmark = await dataUrl(fromRoot('public', 'brand', 'rabaed-wordmark-on-dark.png'), 'image/png');

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<style>
  @font-face { font-family: 'IBM Plex Sans Arabic'; font-weight: 400; src: url(${await font('ibm-plex-sans-arabic-arabic-400-normal.woff2')}); }
  @font-face { font-family: 'IBM Plex Sans Arabic'; font-weight: 700; src: url(${await font('ibm-plex-sans-arabic-arabic-700-normal.woff2')}); }
  @font-face { font-family: 'DM Mono'; font-weight: 400; src: url(${await font('dm-mono-latin-400-normal.woff2')}); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${SHARING_IMAGE.width}px; height: ${SHARING_IMAGE.height}px; }
  body {
    background: #14161C;
    color: #EDEEF3;
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    padding: 72px 88px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: 10px solid #F95738;
  }
  .lg { height: 92px; width: auto; align-self: flex-start; }
  h1 { font-size: 84px; font-weight: 700; line-height: 1.2; letter-spacing: -0.5px; }
  h1 .acc { color: #F95738; display: block; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; }
  p { font-size: 30px; color: #9AA0B4; }
  .url { font-family: 'DM Mono', monospace; font-size: 26px; color: #9AA0B4; direction: ltr; }
</style>
</head>
<body>
  <img class="lg" src="${wordmark}" alt="">
  <h1>ثلاثة أطراف. سجل واحد.<span class="acc">مسؤولية واضحة.</span></h1>
  <div class="foot">
    <p>المالك والاستشاري والمقاول على سجل واحد.</p>
    <span class="url">rabaedapp.com</span>
  </div>
</body>
</html>`;
}

async function exportSharingImage() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: SHARING_IMAGE, deviceScaleFactor: 1 });
    await page.setContent(await sharingImageHtml(), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const screenshot = await page.screenshot({ type: 'png' });
    await sharp(screenshot).png({ compressionLevel: 9 }).toFile(fromRoot('public', 'og-rabaed.png'));
  } finally {
    await browser.close();
  }
}

/**
 * The brand mark's box within the wordmark: the last run of columns holding
 * any visible pixel, reading left to right. The wordmark sets the name to the
 * left and the mark to the right, with clear space between them.
 */
async function markBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const visible = (x, y) => data[(y * info.width + x) * 4 + 3] > 8;
  const columnHasInk = (x) => Array.from({ length: info.height }, (_, y) => visible(x, y)).some(Boolean);

  let right = info.width - 1;
  while (right >= 0 && !columnHasInk(right)) right -= 1;
  if (right < 0) throw new Error(`${path.relative(repoRoot, file)} has no visible pixels to take a brand mark from.`);
  let left = right;
  while (left > 0 && columnHasInk(left - 1)) left -= 1;

  // Within the mark's columns only, so the name beside it cannot stretch the box.
  const rowHasInk = (y) => Array.from({ length: right - left + 1 }, (_, i) => visible(left + i, y)).some(Boolean);
  let top = 0;
  while (!rowHasInk(top)) top += 1;
  let bottom = info.height - 1;
  while (!rowHasInk(bottom)) bottom -= 1;

  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** The mark, centred on a square with a margin of `padding` of its side, on `background`. */
async function squareMark(file, size, padding, background) {
  const box = await markBox(file);
  const side = Math.round(Math.max(box.width, box.height) * (1 + 2 * padding));
  const mark = await sharp(file).extract(box).toBuffer();

  // Composited and resized in two passes: sharp resizes before it composites
  // within one pipeline, which would place the mark on the full-size square.
  const square = await sharp({ create: { width: side, height: side, channels: 4, background } })
    .composite([{ input: mark, left: Math.round((side - box.width) / 2), top: Math.round((side - box.height) / 2) }])
    .png()
    .toBuffer();
  return sharp(square).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

async function exportIcons() {
  const wordmark = fromRoot('public', 'brand', 'rabaed-wordmark-on-light.png');
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  // Transparent in a tab, where the mark's colours read on light and dark
  // browser themes alike. Opaque on the home screen, where iOS fills
  // transparency with black; the site's paper colour instead.
  await writeFile(fromRoot('src', 'app', 'icon.png'), await squareMark(wordmark, 96, 0.04, transparent));
  await writeFile(
    fromRoot('src', 'app', 'apple-icon.png'),
    await squareMark(wordmark, 180, 0.18, { r: 0xfa, g: 0xfa, b: 0xf8, alpha: 1 }),
  );
}

await Promise.all([exportSharingImage(), exportIcons()]);
console.log('Wrote public/og-rabaed.png, src/app/icon.png and src/app/apple-icon.png.');
