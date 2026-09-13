import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Browser, Page } from '@playwright/test';

/**
 * Serves `reference/site/` so a test can put the Reference site and the
 * rebuild side by side in the same browser.
 *
 * Fonts are answered out of `assets/fonts/` exactly as the baseline capture
 * answers them (ticket 02), and every other outbound request is refused. A
 * comparison run against a page that quietly fell back to `system-ui` would
 * be worse than no comparison at all: the numbers would differ everywhere and
 * none of the differences would mean anything.
 *
 * The port is whatever the operating system hands out, because the suite runs
 * fully in parallel and every worker starts its own copy.
 */
const FONTS_PREFIX = '/__fonts/';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const referenceDir = path.join(repoRoot, 'reference', 'site');
const fontsDir = path.join(repoRoot, 'assets', 'fonts');

export type ReferenceSite = { server: Server; origin: string };

export async function startReferenceSite(): Promise<ReferenceSite> {
  const server = createServer(async (request, response) => {
    const url = decodeURIComponent((request.url ?? '/').split('?')[0]);
    const isFont = url.startsWith(FONTS_PREFIX);
    const file = isFont
      ? path.join(fontsDir, url.slice(FONTS_PREFIX.length))
      : path.join(referenceDir, url);

    try {
      const body = await readFile(file);
      if (file.endsWith('.woff2')) response.setHeader('content-type', 'font/woff2');
      if (file.endsWith('.html')) response.setHeader('content-type', 'text/html; charset=utf-8');
      response.end(body);
    } catch {
      response.statusCode = 404;
      response.end();
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('no port for the Reference site');
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

/** Opens a Reference page with the same fonts the rebuild serves, and nothing else. */
export async function openReferencePage(page: Page, site: ReferenceSite, file: string): Promise<void> {
  const css = (await readFile(path.join(fontsDir, 'fonts.css'), 'utf8')).replaceAll(
    'url(./',
    `url(${site.origin}${FONTS_PREFIX}`,
  );

  await page.route('**', (route) => {
    const url = route.request().url();
    if (url.startsWith(site.origin)) return route.continue();
    if (url.startsWith('https://fonts.googleapis.com/')) {
      return route.fulfill({ contentType: 'text/css', body: css });
    }
    return route.abort();
  });

  await page.goto(`${site.origin}/${file}`);
  await page.evaluate(() => document.fonts.ready);
}

/**
 * Freezes every transition and CSS animation on a page.
 *
 * Without it a comparison photographs a cross-fade rather than the state it
 * settles in: the header's two wordmarks were once caught at opacity 0.9693
 * and 0.0307, mid-way through a 350ms fade. What these comparisons measure is
 * where each rule ends up, not how long it takes to get there.
 */
export async function freezeTransitions(page: Page): Promise<void> {
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important }',
  });
}

/**
 * The sixteen viewports the visual baselines were captured at (ticket 02): the
 * eight widths at 900px tall, then the short desktop windows at 840, 700, 600
 * and 550px, where the Reference site's height-based rules take over.
 */
export const BASELINE_VIEWPORTS: readonly { width: number; height: number }[] = [
  ...[360, 390, 768, 820, 1024, 1280, 1440, 1600].map((width) => ({ width, height: 900 })),
  ...[1280, 1440].flatMap((width) => [840, 700, 600, 550].map((height) => ({ width, height }))),
];

/** A Reference page and the rebuilt route that reproduces it. */
export type PagePair = { readonly reference: string; readonly rebuilt: string };

export const HOME_PAGES: PagePair = { reference: 'index.html', rebuilt: '/' };
export const PRODUCT_PAGES: PagePair = { reference: 'product.html', rebuilt: '/product' };

/**
 * A Reference page and the rebuilt one — the home page unless told otherwise —
 * side by side in two fresh contexts at the same viewport, each with its fonts
 * loaded and its transitions frozen, and with reduced motion on: the
 * arrangement every section comparison starts from. Reduced motion is what
 * stops either page being caught half-way through an animation of its own.
 *
 * `motion: 'no-preference'` leaves it off, for the one kind of comparison that
 * needs it: of something that follows the scroll, which the rebuild draws
 * differently for a visitor who has asked for less movement.
 *
 * Close both with `close()` when done; on a failure while opening, they are
 * closed before the error is passed on.
 */
export async function openBothPages(
  browser: Browser,
  baseURL: string,
  site: ReferenceSite,
  viewport: { width: number; height: number },
  pages: PagePair = HOME_PAGES,
  motion: 'reduce' | 'no-preference' = 'reduce',
) {
  const options = { viewport, reducedMotion: motion };
  const referenceContext = await browser.newContext(options);
  const rebuiltContext = await browser.newContext(options);
  const close = async () => {
    await referenceContext.close();
    await rebuiltContext.close();
  };

  try {
    const reference = await referenceContext.newPage();
    await openReferencePage(reference, site, pages.reference);
    await freezeTransitions(reference);

    const rebuilt = await rebuiltContext.newPage();
    await rebuilt.goto(`${baseURL}${pages.rebuilt === '/' ? '' : pages.rebuilt}`);
    await rebuilt.evaluate(() => document.fonts.ready);
    await freezeTransitions(rebuilt);

    return { reference, rebuilt, close };
  } catch (error) {
    await close();
    throw error;
  }
}
