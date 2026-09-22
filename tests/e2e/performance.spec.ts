/**
 * How fast the site is for somebody on a phone in Saudi Arabia, and how still
 * it holds while it loads (ticket 36).
 *
 * Three things, and the first two are deliberately measured rather than timed:
 *
 *  1. **Nothing moves as the page loads.** Layout shift, measured the way the
 *     browser measures it, summed over the whole load including the moment the
 *     Arabic webfont replaces the fallback. A picture whose space was not
 *     reserved, or a line of text that reflows under the reader's eyes, both
 *     show up here.
 *  2. **The page is small enough to arrive quickly.** A byte budget per route,
 *     over everything the first screen needs. This is the page-speed target in
 *     the one quantity a shared CI machine can measure without lying: on the
 *     connection the budget is set for, bytes are what the wait is made of,
 *     and a stopwatch on a runner with twenty other tests on it is not.
 *  3. **No page carries animation code it has no use for.** The markers, and
 *     which pages may load which, are in `animation-code.ts`.
 *
 * The timed check that completes them — the largest element painted inside the
 * target on a throttled connection — is below, with the connection emulated
 * and the processor left alone, for the reason given there.
 */
import { test, expect, type Page } from '@playwright/test';
import { ANIMATIONS, CARRIES_THE_SCRIPTS_OF, LIBRARIES, scriptsOf } from './animation-code';
import { ROUTES } from './routes';

/** A phone, at the narrowest width the baselines cover. */
const PHONE = { width: 390, height: 844 };

/**
 * The connection the budget is set for: Saudi mobile at the slow end, the
 * profile Lighthouse calls "Slow 4G" — 1.6 Mbit/s down, 150ms of round trip.
 * Stated here because the budget below is derived from it and means nothing
 * without it.
 */
const SLOW_4G = { downloadKbps: 1600, latencyMs: 150 };

/**
 * What each page may weigh, in kilobytes, counted compressed as the visitor
 * receives it, over everything fetched before the load event: the document,
 * the stylesheet, the fonts, the scripts and the pictures.
 *
 * **A ratchet, not an ideal** — the founder's decision, and what the numbers
 * left room for. Every page's three hundred and eighty-odd kilobytes of
 * framework and Arabic webfont are the floor, and reaching a round 300 KB
 * would mean setting the site in two weights instead of four, which is a
 * design change and not this ticket's. So each budget is set a little above
 * what the page weighs today, and its job is to fail the change that makes a
 * page heavier rather than to describe a page anybody is happy with.
 *
 * Two things dominate, and both are written down here so that the ticket that
 * takes them on starts with the evidence:
 *
 *  - **The Arabic webfont, ~205 KB on every page**, five faces of IBM Plex
 *    Sans Arabic. Four weights is what the design uses.
 *  - **The Screen mocks, ~370 KB on the home and product pages.** Below 700px
 *    each is drawn 1040 CSS pixels wide and panned across (tickets 08 and 12),
 *    so a phone is sent the widest copy, and every panel is fetched at once
 *    because a panel behind a tab is `display: none` and would otherwise
 *    arrive blank in front of the visitor (`screen-mock-picture.tsx`).
 */
const BUDGET_KB: Record<string, number> = {
  '/': 950,
  '/product': 900,
  '/start': 560,
  '/tool': 440,
  '/referral': 520,
  '/partnership': 510,
  '/blog': 420,
  '/en/blog': 420,
  '/terms': 420,
  '/privacy': 420,
  '/referral-terms': 420,
  '/en': 420,
};

/**
 * Layout shift the browser attributes to nobody having clicked anything.
 *
 * Measured with the webfont already in the browser's cache — the second page
 * a visitor opens, and every page after it — so that what is left is the
 * page's own doing: a picture whose space was not reserved, something the
 * client put in after the server's markup, a section that grows when its
 * script runs. One thousandth, because none of those is allowed at all and
 * the only thing this has to tolerate is the rounding of a fraction of a
 * pixel.
 *
 * **The first page view, where the webfont replaces the fallback, is not
 * measured here — and deliberately so (ADR-0012).** How far that moves the
 * page depends entirely on which Arabic face the machine happens to have, and
 * a hosted Linux runner's is not a Saudi phone's: the same eleven pages that
 * measure between 0.001 and 0.053 on a developer's Windows machine measure
 * between 0.08 and 0.13 on the runner, which has no Arabic face worth the
 * name. A budget that held on both would have to be loose enough to be worth
 * nothing on either. What the site does about that swap is a property of the
 * stand-in rather than of any one page, and is measured as such below.
 */
const SHIFT_ALLOWANCE = 0.001;

/** What the browser shifted, and which elements it moved, from navigation to settled. */
async function layoutShift(page: Page, path: string): Promise<{ total: number; moved: string[] }> {
  // Opened once and thrown away, to put the webfont in the browser's cache.
  // The reading below is then of the page a visitor meets from their second
  // page onward, with no swap in it (see `SHIFT_ALLOWANCE`).
  await page.goto(path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Installed before the navigation it measures, because a shift in the first
  // frames is exactly the kind this is looking for.
  await page.addInitScript(() => {
    const record: { total: number; moved: string[] } = { total: 0, moved: [] };
    (window as unknown as { __shift: typeof record }).__shift = record;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
        sources?: { node?: Node; previousRect: DOMRectReadOnly; currentRect: DOMRectReadOnly }[];
      })[]) {
        // A shift within half a second of a click or a key is the visitor's
        // own doing, and is what the browser leaves out of the score.
        if (entry.hadRecentInput) continue;
        record.total += entry.value;
        for (const source of entry.sources ?? []) {
          const node = source.node as HTMLElement | undefined;
          if (!node?.tagName) continue;
          const name = `${node.tagName.toLowerCase()}${node.className ? `.${String(node.className).split(' ').join('.')}` : ''}`;
          // How far it went, and how tall it was either side of the move:
          // "down 71px" is a line of text appearing above it, and a change of
          // height is the element itself reflowing.
          const from = source.previousRect;
          const to = source.currentRect;
          const how = `${name}  ${Math.round(to.top - from.top) >= 0 ? 'down' : 'up'} ${Math.abs(Math.round(to.top - from.top))}px, ${Math.round(from.height)}px tall → ${Math.round(to.height)}px`;
          if (!record.moved.includes(how)) record.moved.push(how);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

  return page.evaluate(() => (window as unknown as { __shift: { total: number; moved: string[] } }).__shift);
}

for (const route of ROUTES) {
  test(`nothing moves on ${route.path} once the webfont is cached`, async ({ page }) => {
    await page.setViewportSize(PHONE);

    const { total, moved } = await layoutShift(page, route.path);

    expect(
      total,
      `${route.path} shifted by ${total.toFixed(4)} as it loaded. What moved:\n  ${moved.join('\n  ')}`,
    ).toBeLessThanOrEqual(SHIFT_ALLOWANCE);
  });
}

/**
 * A line of the site's own Arabic, long enough that a few per cent of width
 * is several pixels and short enough to stay on one line at any size.
 */
const PROBE = 'شراكة ربائد للمكاتب الهندسية وشركات إدارة المشاريع';

/** The site's stack with the webfont taken off the front, and the same without the stand-in. */
const WITH_STAND_IN = '"Arabic stand-in", "Tajawal", system-ui, sans-serif';
const WITHOUT_STAND_IN = '"Tajawal", system-ui, sans-serif';

/**
 * How wide `PROBE` is in each family, at a size large enough that the
 * difference is not lost to rounding. `document.fonts.ready` has already
 * resolved, so IBM Plex Sans Arabic is present and any other name falls to
 * what the machine has.
 */
async function widthsIn(page: Page, families: readonly string[]): Promise<number[]> {
  return page.evaluate(
    ({ probe, families }: { probe: string; families: string[] }) =>
      families.map((family) => {
        const span = document.createElement('span');
        span.textContent = probe;
        span.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-size:200px;font-family:${family}`;
        document.body.append(span);
        const width = span.getBoundingClientRect().width;
        span.remove();
        return width;
      }),
    { probe: PROBE, families: [...families] },
  );
}

/**
 * The faces the stand-in names, each measured on its own, so that a failure
 * says which one the machine actually used and what `size-adjust` it wants
 * rather than only that the sum is wrong. Adding a face to `tokens.css`
 * without a number from here is what put a wrong one in it once already
 * (ADR-0012).
 */
const NAMED = ['"Segoe UI"', '"Tahoma"', '"Geeza Pro"'];

/**
 * **The stand-in is the width of the face it stands in for** (ADR-0012).
 *
 * This is the cause the per-route readings measure the symptom of, and it is
 * the honest place to measure it: a paragraph changes line, or it does not,
 * and which way it goes for a given piece of copy tells you far less than how
 * far apart the two faces are. If this holds, no page can reflow on the swap
 * by more than the odd line; if it does not, some page will, and which one is
 * an accident of how its sentences happen to wrap.
 *
 * Four per cent, because the desktop faces set this line between 1.09 and
 * 1.17 times as wide as IBM Plex Sans Arabic and the stand-in is adjusted to
 * the middle of that.
 *
 * **Skipped where the stand-in changes nothing.** A machine with none of the
 * named faces — a hosted Linux runner among them — draws Arabic in whatever it
 * has, which no `size-adjust` reaches and which no visitor has either, so a
 * reading there would say nothing about anybody's browser. The test detects
 * that case rather than assuming it: it measures the same stack twice, with
 * the stand-in and without, and a stand-in that moved nothing is one that is
 * not there.
 */
test('the stand-in is the width of the face it stands in for', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const [real, standIn, bare, ...named] = await widthsIn(page, [
    '"IBM Plex Sans Arabic"',
    WITH_STAND_IN,
    WITHOUT_STAND_IN,
    ...NAMED,
  ]);

  const found = NAMED.map(
    (family, index) => `  ${family}: ${Math.round(named[index])}px, wanting size-adjust ${Math.round((real / named[index]) * 100)}%`,
  ).join('\n');

  test.skip(
    Math.abs(standIn - bare) < 1,
    'this machine has none of the faces the stand-in names, so there is nothing here for it to stand in for',
  );

  const ratio = standIn / real;
  expect(
    Math.abs(1 - ratio),
    `the stand-in sets this line ${(ratio * 100).toFixed(1)}% as wide as IBM Plex Sans Arabic does (${Math.round(standIn)}px against ${Math.round(real)}px). What this machine has, each on its own:
${found}
Adjust \`size-adjust\` in src/styles/tokens.css, or drop a face it turns out not to have.`,
  ).toBeLessThanOrEqual(0.04);
});

for (const route of ROUTES) {
  test(`${route.path} is inside the first-screen budget`, async ({ page }) => {
    await page.setViewportSize(PHONE);

    // Weighed as the wire carries it — compressed, headers included — rather
    // than as `content-length` claims, which several of these responses do not
    // carry at all because they are sent in chunks.
    const COUNTED = ['document', 'stylesheet', 'font', 'script', 'image'];
    const weighed: Promise<{ url: string; type: string; kb: number }>[] = [];
    const unweighable: string[] = [];
    page.on('requestfinished', (request) => {
      if (!COUNTED.includes(request.resourceType())) return;
      weighed.push(
        request
          .sizes()
          .then((sizes) => ({
            url: request.url(),
            type: request.resourceType(),
            kb: (sizes.responseBodySize + sizes.responseHeadersSize) / 1024,
          }))
          // Said out loud rather than dropped: a response left out of the sum
          // makes the page look lighter than it is, which is the one way this
          // budget could pass by measuring nothing.
          .catch((reason: unknown) => {
            unweighable.push(`${request.url()}: ${String(reason)}`);
            return { url: request.url(), type: request.resourceType(), kb: 0 };
          }),
      );
    });

    await page.goto(route.path, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    const loaded = await Promise.all(weighed);
    expect(unweighable, `${route.path} sent responses whose size could not be read`).toEqual([]);

    const total = loaded.reduce((sum, item) => sum + item.kb, 0);
    const subtotals = COUNTED.map((type) => {
      const of = loaded.filter((item) => item.type === type);
      return `  ${String(Math.round(of.reduce((sum, item) => sum + item.kb, 0))).padStart(4)} KB  ${of.length} ${type}`;
    }).join('\n');
    const heaviest = [...loaded]
      .sort((a, b) => b.kb - a.kb)
      .slice(0, 8)
      .map((item) => `  ${String(Math.round(item.kb)).padStart(4)} KB  ${item.url}`)
      .join('\n');

    const budget = BUDGET_KB[route.path];
    expect(budget, `${route.path} has no entry in BUDGET_KB`).toBeDefined();

    expect(
      Math.round(total),
      `${route.path} sends ${Math.round(total)} KB, over its budget of ${budget} KB — about ${Math.round((total / SLOW_4G.downloadKbps) * 8)}ms of a ${SLOW_4G.downloadKbps} kbit/s connection.\n${subtotals}\nThe heaviest of them:\n${heaviest}`,
    ).toBeLessThanOrEqual(budget);
  });
}

/**
 * How long the largest thing on the first screen takes to appear, on a
 * connection throttled to `SLOW_4G`, in milliseconds. 2,500 is where the Core
 * Web Vitals stop calling Largest Contentful Paint "good", and is the target
 * the ticket asks the site to meet.
 *
 * Only the connection is emulated, not the processor. A throttled CPU makes
 * the number a reading of the machine the suite happens to be on — a hosted
 * runner with twenty workers on it is not the phone — where a throttled
 * connection is arithmetic the browser does the same way everywhere. What is
 * left is the wait the bytes cause, which is what the budget above is about
 * and what a visitor on a Saudi mobile connection actually feels.
 */
const LARGEST_PAINT_TARGET_MS = 2_500;

for (const route of ROUTES) {
  test(`${route.path} paints its first screen in time on a mobile connection`, async ({ page }) => {
    test.slow();
    await page.setViewportSize(PHONE);

    const session = await page.context().newCDPSession(page);
    await session.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: SLOW_4G.latencyMs,
      downloadThroughput: (SLOW_4G.downloadKbps * 1024) / 8,
      uploadThroughput: (SLOW_4G.downloadKbps * 1024) / 8,
    });

    // Observed, not read off the timeline afterwards: largest-contentful-paint
    // entries are never kept in the buffer `getEntriesByType` reads, so asking
    // for them later always answers with nothing.
    await page.addInitScript(() => {
      const record: { at: number | null; what: string } = { at: null, what: 'the browser named no largest element' };
      (window as unknown as { __largest: typeof record }).__largest = record;
      new PerformanceObserver((list) => {
        // The last candidate the browser settled on is the one it reports.
        const entry = list.getEntries().at(-1) as (PerformanceEntry & { url?: string; element?: Element }) | undefined;
        if (!entry) return;
        record.at = entry.startTime;
        record.what =
          entry.url ||
          `${entry.element?.tagName.toLowerCase() ?? '?'} «${entry.element?.textContent?.trim().slice(0, 50) ?? ''}»`;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto(route.path, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    const largest = await page.evaluate(
      () => (window as unknown as { __largest: { at: number | null; what: string } }).__largest,
    );
    await session.detach();

    // Before the reading: a page where the observer never fired would report
    // nothing, and a test that reads nothing as zero passes by finding nothing
    // (spec: Testing Decisions). Every route here has something the browser
    // calls contentful on its first screen, so this is a broken measurement
    // rather than a page with no content.
    expect(largest.at, `${route.path}: ${largest.what}`).not.toBeNull();

    expect(
      Math.round(largest.at!),
      `${route.path} took ${Math.round(largest.at!)}ms at ${SLOW_4G.downloadKbps} kbit/s to paint ${largest.what}`,
    ).toBeLessThanOrEqual(LARGEST_PAINT_TARGET_MS);
  });
}

for (const route of ROUTES) {
  test(`${route.path} loads only the animation code it uses`, async ({ page }) => {
    const scripts = await scriptsOf(page, route.path);
    const carriesFor = CARRIES_THE_SCRIPTS_OF[route.path] ?? route.path;

    for (const library of LIBRARIES) {
      const expected = (library.usedOn as readonly string[]).includes(carriesFor);
      expect(
        scripts.includes(library.marker),
        expected
          ? `${route.path} no longer loads ${library.name}, or ${library.name} no longer carries «${library.marker}»`
          : `${route.path} loads ${library.name}, which nothing on it animates`,
      ).toBe(expected);
    }

    for (const animation of ANIMATIONS) {
      const expected = animation.usedOn === carriesFor;
      expect(
        scripts.includes(animation.marker),
        expected
          ? `${route.path} no longer carries ${animation.name}'s «${animation.marker}»`
          : `${route.path} loads ${animation.name}`,
      ).toBe(expected);
    }
  });
}
