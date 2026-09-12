/**
 * Renders every Screen mock from the studio route and writes it out as an
 * image, per locale (ADR-0002).
 *
 * This is what makes a label change a script run rather than a redesign: edit
 * the markup in `src/screen-mocks/<locale>/`, run this, commit the pictures.
 *
 *   npm run mocks:export
 *
 * The images are committed. `tests/e2e/screen-mocks.spec.ts` fails if one is no
 * longer what the studio renders, so a forgotten export cannot reach the site.
 *
 * There is no flag to render a subset. It takes under a minute for all eight,
 * and a partial run is how a set of images ends up half one version and half
 * another — the same reasoning that gave `capture-baselines.mjs` its rule about
 * filtered runs never writing into the committed set.
 *
 * Output is transparent WebP at twice the stage size. Transparent because the
 * markup draws on a transparent background and the mocks sit on both light and
 * dark sections; twice because the stage is 1440px wide and a dense screen
 * would otherwise show it soft. Lossless, because the test compares a
 * committed image against a fresh render pixel for pixel — and because flat UI
 * compresses far better losslessly than a photograph would.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(repoRoot, 'public', 'screen-mocks');

/** Out of the way of the dev server (3000), the e2e suite (3100) and the baseline capture (4321). */
const PORT = 4400;
const origin = `http://127.0.0.1:${PORT}`;

/**
 * Refuses to start on top of something already listening.
 *
 * Without this, a leftover server from an earlier run answers, and the export
 * quietly photographs whatever *that* build renders — which is the one failure
 * mode of this script that produces plausible, wrong images.
 */
async function requireFreePort() {
  await new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', (error) =>
      reject(
        error.code === 'EADDRINUSE'
          ? new Error(`Something is already listening on ${origin}. Stop it and run this again.`)
          : error,
      ),
    );
    probe.once('listening', () => probe.close(resolve));
    probe.listen(PORT, '127.0.0.1');
  });
}

/**
 * Starts the built application and resolves once it is answering.
 *
 * Next's own binary is run under this Node rather than through `npm`, so that
 * the returned handle is the server itself. Spawned through a shell — which is
 * what `npm` needs on Windows — killing the handle kills the shell and leaves
 * the server holding the port.
 */
async function startServer() {
  const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');
  const server = spawn(process.execPath, [nextBin, 'start', '--port', String(PORT)], {
    cwd: repoRoot,
    // Not `pipe`: nothing here reads the pipe, and a chatty server fills the
    // buffer and stops.
    stdio: ['ignore', 'ignore', 'inherit'],
  });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`The application exited with ${server.exitCode}.`);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
      if (response.ok || response.status === 404) return server;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  server.kill();
  throw new Error(`The application did not start on ${origin} within a minute.`);
}

async function main() {
  const { SCREEN_MOCKS } = await import('../src/screen-mocks/registry.ts');
  const { screenMockLocales } = await import('../src/screen-mocks/markup.ts');

  const locales = await screenMockLocales();
  await requireFreePort();

  let server;
  let browser;
  const rendered = [];

  try {
    server = await startServer();
    browser = await chromium.launch();

    for (const locale of locales) {
      for (const mock of SCREEN_MOCKS) {
        const page = await browser.newPage({
          // Room around the stage, so nothing is clipped by the viewport.
          viewport: { width: mock.width + 160, height: mock.height + 100 },
          deviceScaleFactor: mock.scale,
        });
        await page.goto(`${origin}/studio/${locale}/${mock.id}`, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);

        const png = await page
          .locator(`[data-vs-shot="${mock.id}"] .vs-shot__stage`)
          .screenshot({ omitBackground: true, animations: 'disabled' });
        await page.close();

        rendered.push({
          locale,
          id: mock.id,
          size: `${mock.width * mock.scale}×${mock.height * mock.scale}`,
          webp: await sharp(png).webp({ lossless: true, effort: 6 }).toBuffer(),
        });
      }
    }
  } finally {
    await browser?.close();
    server?.kill();
  }

  // Everything is rendered before anything is replaced, so a run that fails
  // half way leaves the committed images as they were.
  for (const locale of locales) {
    await rm(path.join(outDir, locale), { recursive: true, force: true });
    await mkdir(path.join(outDir, locale), { recursive: true });
  }
  for (const image of rendered) {
    await writeFile(path.join(outDir, image.locale, `${image.id}.webp`), image.webp);
    console.log(
      `${image.locale}/${image.id}`.padEnd(30),
      image.size.padEnd(12),
      `${Math.round(image.webp.length / 1024)} KB`,
    );
  }
}

await main();
