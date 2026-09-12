/**
 * Captures the visual baselines of the Reference site (ticket 02).
 *
 * These screenshots are the oracle for "the rebuild looks identical". They are
 * taken from `reference/site/` — never from the rebuild — and are not
 * regenerated once the rebuild starts. See tests/baselines/README.md.
 *
 *   npm run baselines:capture
 *   npm run baselines:capture -- --only=index --widths=1440
 *   npm run baselines:verify              # re-capture and diff against the committed set
 *
 * Determinism matters more here than fidelity to any single moment:
 *  - Fonts are served from `assets/fonts/`, never from Google. A missing Arabic
 *    face silently falls back to a Latin one and invalidates every baseline.
 *  - Every outbound request that is not our own local server is blocked.
 *  - Each page is walked top to bottom so every `once:true` ScrollTrigger
 *    entrance has fired, then returned to the top.
 *  - Every animation is then rendered at the end of one pass and the clock
 *    stopped, and the shutter only fires on a frame that is identical to the
 *    one before it.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referenceDir = path.join(repoRoot, 'reference', 'site');
const fontsDir = path.join(repoRoot, 'assets', 'fonts');
const baselinesDir = path.join(repoRoot, 'tests', 'baselines');
const outputDir = path.join(baselinesDir, 'reference');

/** The eight widths fixed by the spec and by HANDOFF.md section 7.7. Captured full-page. */
const WIDTHS = [360, 390, 768, 820, 1024, 1280, 1440, 1600];

/** Viewport height for the width sweep — above the tallest height breakpoint (840px). */
const SWEEP_HEIGHT = 900;

/**
 * Short-viewport captures. The Reference site carries height-based media
 * queries at 840, 700, 600 and 550px, all gated to `min-width:981px`, and the
 * pinned horizontal journey additionally needs `min-height:551px`. Capturing on
 * the breakpoint values exercises each band, and 550 also lands below the
 * journey's gate. Both realistic laptop widths are covered.
 */
const SHORT_WIDTHS = [1280, 1440];
const SHORT_HEIGHTS = [840, 700, 600, 550];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => a.replace(/^--/, '').split('=')),
);

const FONTS_PREFIX = '/__fonts/';

/** The port the Reference site is served on during capture. Documented in the README. */
const PORT = 4321;

/** One spelling of a viewport, used in filenames, progress output and error messages. */
const viewportLabel = ({ width, height }) => width + 'x' + height;

function serveStatic(port) {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const isFont = url.startsWith(FONTS_PREFIX);
    const root = isFont ? fontsDir : referenceDir;
    const relative = (isFont ? url.slice(FONTS_PREFIX.length) : url.slice(1)) || 'index.html';
    const filePath = path.join(root, relative);

    if (!filePath.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const info = await stat(filePath);
      if (!info.isFile()) throw new Error('not a file');
      res.writeHead(200, {
        'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream',
        'content-length': info.size,
        'cache-control': 'no-store',
      });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404).end('Not found: ' + url);
    }
  });

  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

/** The families a Google Fonts URL asks for, e.g. `family=DM+Mono:wght@400;500`. */
function requestedFamilies(url) {
  return [...new URL(url).searchParams.getAll('family')].map(
    (value) => value.split(':')[0].replaceAll('+', ' '),
  );
}

/**
 * Answers a Google Fonts request with the self-hosted faces in `assets/fonts/`,
 * so capture works offline and the glyphs can never quietly change under us.
 *
 * Serving the whole stylesheet regardless of what was asked for would hide the
 * one mistake that matters: the Reference pages do not all request the same
 * families — `pour-tracker.html` wants Plus Jakarta Sans as well — and a family
 * we have no local copy of would fall back to `system-ui` with nothing to show
 * for it, because the request was answered rather than blocked.
 */
async function localFontStylesheet(origin, url) {
  const css = await readFile(path.join(fontsDir, 'fonts.css'), 'utf8');
  const missing = requestedFamilies(url).filter((family) => !css.includes("font-family: '" + family + "'"));
  if (missing.length > 0) {
    throw new Error(
      'The page asked Google Fonts for ' + missing.join(', ') + ', which assets/fonts/ does not ' +
        'have. Add the family to scripts/sync-fonts.mjs and run `npm run fonts:sync`.',
    );
  }
  return css.replaceAll('url(./', 'url(' + origin + FONTS_PREFIX);
}

/** The Arabic block, which is what every Reference page is written in. */
const ARABIC_RANGE = 'U+600-6FF';

/**
 * Fails the run rather than write a baseline in the wrong typeface. Chromium
 * falls back silently, and a baseline captured in a fallback Arabic face is
 * worthless — every later comparison against it would be a false failure.
 *
 * What is asserted is narrow on purpose: some Arabic-covering face of the
 * family is loaded. Two wider rules were tried and are both wrong.
 *
 * Asserting by family name alone passes when the Arabic file is missing, since
 * the family is split by `unicode-range` and its Latin face loads from the
 * Latin text on every page — the one failure worth catching slips through.
 *
 * Asserting that every *requested* family loaded fails honestly-correct pages.
 * A page can link a family it never renders: `pour-tracker.html` asks for Plus
 * Jakarta Sans, but in its default right-to-left mode `body` puts IBM Plex Sans
 * Arabic first, and that covers Latin too, so Plus Jakarta Sans is only reached
 * after the language switcher is used. Weights behave the same way — nothing
 * on that page renders Arabic at 400, so a check pinned to a weight fails on a
 * page that is rendering perfectly. That families are *available* locally is
 * already guaranteed, at the point the stylesheet is served.
 */
async function assertArabicFontLoaded(page, label) {
  const loaded = await page.evaluate(
    (range) =>
      !document.body.innerText.match(/[؀-ۿ]/) ||
      [...document.fonts].some((f) => f.status === 'loaded' && f.unicodeRange.includes(range)),
    ARABIC_RANGE,
  );

  if (!loaded) {
    throw new Error(
      'No Arabic face loaded on ' + label + ', so the page is rendering in a fallback font. ' +
        'Run `npm run fonts:sync` and check assets/fonts/fonts.css.',
    );
  }
}

/** Walks the page so every `once:true` ScrollTrigger entrance fires, then returns to the top. */
async function walkPage(page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const step = Math.max(200, Math.round(window.innerHeight * 0.6));
    // Pinned sections grow the document as they initialise, so re-read the
    // height every step rather than computing the stops up front.
    let guard = 0;
    for (let y = 0; y <= document.documentElement.scrollHeight && guard < 400; y += step) {
      window.scrollTo(0, y);
      await frame();
      guard += 1;
    }
    window.scrollTo(0, 0);
    await frame();
  });
}

/**
 * Puts every animation into a fixed, repeatable state and stops the clock.
 *
 * Every animation is rendered at the end of one pass — its resting state — and
 * then the clock is stopped. Scrub-driven tweens are the exception: their
 * position is a function of the scroll offset, which is already fixed at the
 * top of the page, so they are left where the scroll puts them.
 *
 * Rewinding to the first frame instead does not work, and the reason is worth
 * recording. The hero loop moves its document by writing `style.left` from an
 * `onUpdate`, so GSAP does not own that property and cannot revert it: seeking
 * the timeline back to zero resets the status text but leaves the document
 * wherever wall-clock time happened to put it. Seeking *forward* to the end of
 * a pass re-runs those writes, which is what makes the frame repeatable.
 */
async function freezeAnimations(page) {
  await page.evaluate(() => {
    const gsap = window.gsap;
    if (!gsap) return;
    for (const child of gsap.globalTimeline.getChildren(false, true, true)) {
      if (child.scrollTrigger?.vars?.scrub) continue;
      if (typeof child.repeat === 'function' && child.repeat() === -1) {
        // An endless timeline has no end, so park it just inside one iteration;
        // landing exactly on the boundary wraps back round to zero.
        child.pause();
        child.time(Math.max(0, child.duration() - 0.001));
      } else {
        child.progress(1);
      }
    }
    gsap.globalTimeline.pause();
    gsap.ticker.sleep();
  });
}

/**
 * Screenshots the page repeatedly and accepts only a frame that is identical to
 * the one before it. A fixed wait cannot prove the page has stopped moving:
 * some of the Reference site's one-time hints — the card deck's opening sweep,
 * for one — run on `setTimeout` and CSS transitions, outside GSAP's control and
 * so outside `freezeAnimations`. A baseline caught mid-animation is a baseline
 * that fails at random for the rest of the project's life.
 */
async function captureStableScreenshot(page, label) {
  const shot = () => page.screenshot({ fullPage: true, caret: 'hide', animations: 'disabled' });
  let previous = await shot();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.waitForTimeout(400);
    const current = await shot();
    if (current.equals(previous)) return current;
    previous = current;
  }
  throw new Error('Page never stopped changing, so no baseline was written: ' + label);
}

async function capturePage({ browser, origin, outDir, slug, viewport, problems }) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
  });
  const page = await context.newPage();

  const label = slug + ' ' + viewportLabel(viewport);
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push('console error · ' + label + ' · ' + m.text());
  });
  page.on('requestfailed', (r) => {
    problems.push('request failed · ' + label + ' · ' + r.url() + ' · ' + r.failure()?.errorText);
  });

  // Set if a Google Fonts request named a family we have no local copy of.
  // Thrown after navigation, because throwing inside a route handler would
  // leave the request hanging instead of failing the run.
  let fatal = null;

  await context.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith('https://fonts.googleapis.com/')) {
      try {
        const body = await localFontStylesheet(origin, url);
        return route.fulfill({ status: 200, contentType: 'text/css; charset=utf-8', body });
      } catch (error) {
        fatal ??= error;
        return route.abort();
      }
    }
    if (url.startsWith(origin) || url.startsWith('data:') || url.startsWith('blob:')) {
      return route.continue();
    }
    problems.push('blocked external request · ' + label + ' · ' + url);
    return route.abort();
  });

  await page.goto(origin + '/' + slug + '.html', { waitUntil: 'load' });
  if (fatal) throw fatal;
  await page.evaluate(() => document.fonts.ready);
  await assertArabicFontLoaded(page, label);
  await walkPage(page);
  // Long enough for the slowest entrance tween (0.7s plus a 0.16s stagger).
  await page.waitForTimeout(1200);
  await freezeAnimations(page);

  const relative = path.join(slug, slug + '--' + viewportLabel(viewport) + '.png');
  const file = path.join(outDir, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, await captureStableScreenshot(page, label));

  await context.close();
  return relative;
}

/**
 * Compares a freshly captured set against the committed baselines. Used by
 * `npm run baselines:verify` to prove the committed images still describe the
 * Reference site and that the capture is reproducible on this machine.
 */
async function compareWithCommitted(freshDir, relativePaths) {
  const failures = [];
  const failureDir = path.join(repoRoot, 'test-results', 'baseline-verify');
  for (const relative of relativePaths) {
    let committed;
    try {
      committed = PNG.sync.read(await readFile(path.join(outputDir, relative)));
    } catch {
      failures.push(relative + ' — no committed baseline');
      continue;
    }
    const fresh = PNG.sync.read(await readFile(path.join(freshDir, relative)));
    if (fresh.width !== committed.width || fresh.height !== committed.height) {
      failures.push(
        relative + ' — size changed: ' + committed.width + 'x' + committed.height +
          ' -> ' + fresh.width + 'x' + fresh.height,
      );
      continue;
    }
    const diff = new PNG({ width: fresh.width, height: fresh.height });
    const differing = pixelmatch(
      committed.data, fresh.data, diff.data, fresh.width, fresh.height, { threshold: 0.1 },
    );
    if (differing === 0) continue;

    // Keep the evidence: which pixels moved is the only way to tell a real
    // regression from a flaky animation frame.
    const stem = path.join(failureDir, relative.replace(/\.png$/, ''));
    await mkdir(path.dirname(stem), { recursive: true });
    await writeFile(stem + '.actual.png', PNG.sync.write(fresh));
    await writeFile(stem + '.diff.png', PNG.sync.write(diff));
    failures.push(relative + ' — ' + differing + ' pixels differ');
  }
  return failures;
}

/**
 * Committed baselines that the capture no longer produces. Comparing only what
 * was captured would let one sit in the repository for ever, quietly claiming to
 * describe a page or viewport that is not in the matrix any more.
 */
async function findOrphanedBaselines(capturedRelativePaths) {
  const captured = new Set(capturedRelativePaths);
  const orphans = [];
  for (const slug of await readdir(outputDir)) {
    for (const file of await readdir(path.join(outputDir, slug))) {
      const relative = path.join(slug, file);
      if (!captured.has(relative)) orphans.push(relative);
    }
  }
  return orphans;
}

async function main() {
  const origin = 'http://127.0.0.1:' + PORT;
  const server = await serveStatic(PORT);

  const slugs = (await readdir(referenceDir))
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace(/\.html$/, ''))
    .filter((slug) => !args.only || args.only.split(',').includes(slug))
    .sort();

  const widths = args.widths ? args.widths.split(',').map(Number) : WIDTHS;
  const viewports = [
    ...widths.map((width) => ({ width, height: SWEEP_HEIGHT })),
    ...SHORT_WIDTHS.filter((w) => widths.includes(w)).flatMap((width) =>
      SHORT_HEIGHTS.map((height) => ({ width, height })),
    ),
  ];

  if (slugs.length === 0) {
    server.close();
    throw new Error('No pages matched --only=' + args.only + ' in ' + referenceDir);
  }

  const verify = 'verify' in args;
  const isFullRun = !args.only && !args.widths;

  // A filtered run must never write into the committed set. `--only` and
  // `--widths` also drop the short viewports unless 1280 or 1440 survives the
  // filter, so letting one land in `tests/baselines/reference/` would leave a
  // set that is part old capture and part new with nothing to say so.
  const outDir = verify
    ? await mkdtemp(path.join(tmpdir(), 'rabaed-baselines-'))
    : isFullRun
      ? outputDir
      : path.join(repoRoot, 'test-results', 'baselines-partial');

  if (isFullRun && !verify) await rm(outputDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const problems = [];
  const captured = [];
  const started = Date.now();
  const total = slugs.length * viewports.length;
  let done = 0;

  for (const slug of slugs) {
    for (const viewport of viewports) {
      captured.push(await capturePage({ browser, origin, outDir, slug, viewport, problems }));
      done += 1;
      process.stdout.write(
        '\r  ' + String(done).padStart(3) + '/' + total + '  ' + slug + ' ' + viewportLabel(viewport) + '        ',
      );
    }
  }
  process.stdout.write('\n');

  await browser.close();
  server.close();

  const unique = [...new Set(problems)];
  const log = [
    'Captured ' + total + ' baselines from reference/site/ in ' + Math.round((Date.now() - started) / 1000) + 's.',
    'Pages: ' + slugs.join(', '),
    'Viewports: ' + viewports.map(viewportLabel).join(', '),
    '',
    unique.length
      ? 'Problems observed on the Reference site:'
      : 'No console errors, failed requests or blocked external requests.',
    ...unique.map((p) => '  - ' + p),
  ].join('\n');

  if (isFullRun && !verify) await writeFile(path.join(baselinesDir, 'capture-log.txt'), log + '\n', 'utf8');
  console.log(log);

  if (!verify) return;

  const failures = await compareWithCommitted(outDir, captured);
  if (isFullRun) {
    failures.push(
      ...(await findOrphanedBaselines(captured)).map((o) => o + ' — committed but no longer captured'),
    );
  }
  await rm(outDir, { recursive: true, force: true });
  if (failures.length === 0) {
    console.log('\nAll ' + captured.length + ' committed baselines match the Reference site.');
    return;
  }
  console.error('\n' + failures.length + ' of ' + captured.length + ' baselines do not match:');
  for (const failure of failures) console.error('  - ' + failure);
  process.exitCode = 1;
}

await main();
