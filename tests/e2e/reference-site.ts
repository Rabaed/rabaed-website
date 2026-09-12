import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Page } from '@playwright/test';

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
