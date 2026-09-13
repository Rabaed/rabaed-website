/**
 * The product page's journey (ticket 12): five panels — the four units and the
 * Record they produce — that travel sideways while the section holds still, on
 * a window at least 981px wide and 551px tall; one above another on anything
 * smaller.
 *
 * The spec calls this the most fragile thing on the site, and it breaks in
 * ways a screenshot does not show: panels that travel the wrong way, a pin
 * measured against the page before the fonts arrived, a header that turns
 * light half-way through a dark section, a journey that stops working after a
 * visit to another page. Each has a test here, asserted through what a visitor
 * sees — where the section sits in the window, which panel is in view, how
 * many progress marks are lit, what colour the header is.
 *
 * Whether it *looks* like the Reference site is asked in
 * `product-matches-reference.spec.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { sidewaysOverflow } from './geometry';

/** The five panels in order, and what each one's screen is described as. */
const PANELS = [
  {
    title: 'المراسلات الرسمية',
    mock: 'correspondence',
    description: 'شاشة المراسلات الرسمية في ربائد: خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف',
  },
  {
    title: 'الاعتمادات والطلبات',
    mock: 'kanban',
    description:
      'لوحة كانبان للاعتمادات في ربائد: مسودة، مراجعة داخلية بمسارَي مهندس المقاول ومدير المشروع، ثم انتظار الموافقة والمعتمدة',
  },
  {
    title: 'التقرير اليومي للموقع',
    mock: 'daily-report',
    description:
      'تفاصيل التقرير اليومي في ربائد: الطقس والموقع، جدولا الفريق الإداري والعمالة بالعدد والساعات، والأنشطة والصور',
  },
  {
    title: 'المستندات والإصدارات',
    mock: 'documents',
    description: 'مستودع المستندات في ربائد: المجلدات وجدول الملفات بالإصدار والنوع ومعرف المصدر ومن رفعه',
  },
  {
    title: 'السجل الموثّق',
    mock: 'stamped-sheet',
    description: 'ورقة الاعتماد المختومة في ربائد: أربعة توقيعات بالدور والشركة ووقت الفعل، ورمز الاعتماد B، والختم',
  },
] as const;

/** The colour of a lit progress mark: the brand orange. */
const LIT = 'rgb(249, 87, 56)';

const HEADER_OVER_DARK = 'rgba(20, 22, 28, 0.72)';
const HEADER_OVER_LIGHT = 'rgba(250, 250, 248, 0.8)';

const journey = (page: Page) => page.locator('#journey');

/** The journey at one moment, as a visitor would describe it. */
async function lookAt(page: Page) {
  return journey(page).evaluate((section, lit) => {
    const box = (element: Element) => {
      const { top, right, bottom, left } = element.getBoundingClientRect();
      return { top, right, bottom, left };
    };
    return {
      /** Where the section's top edge is in the window. */
      top: section.getBoundingClientRect().top,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: window.innerHeight,
      heading: box(section.querySelector('h2')!),
      panels: [...section.querySelectorAll('h3')].map((title) => box(title.closest('.panel')!)),
      lit: [...section.querySelectorAll('.dots i')].filter((mark) => getComputedStyle(mark).backgroundColor === lit)
        .length,
    };
  }, LIT);
}

type Look = Awaited<ReturnType<typeof lookAt>>;

const inView = (look: Look, panel: number) =>
  look.panels[panel].left >= -1 && look.panels[panel].right <= look.windowWidth + 1;

/**
 * Where the pinned stretch of page begins and ends, as scroll positions: the
 * section reaches the top of the window, and the section after it has risen to
 * the bottom of the window. Read from the top of the page, where neither is
 * pinned yet.
 */
async function pinnedStretch(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  return page.evaluate(() => {
    const onPage = (id: string) => document.getElementById(id)!.getBoundingClientRect().top + window.scrollY;
    return { start: onPage('journey'), end: onPage('custom') - window.innerHeight };
  });
}

/**
 * Waits until the journey holds still for a stretch of scrolling, and returns
 * that stretch — once it has stopped changing. After the window changes size
 * the page is re-measured a moment later, not at once, and a stretch read in
 * between is the old window's.
 */
async function waitForPin(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  let previous = await pinnedStretch(page);
  await expect
    .poll(
      async () => {
        // Half a second between readings, always — including before the
        // first, which an immediate retry would otherwise compare against a
        // reading taken a moment earlier and call settled.
        await page.waitForTimeout(500);
        const now = await pinnedStretch(page);
        const settled = now.end - now.start > 100 && now.start === previous.start && now.end === previous.end;
        previous = now;
        return settled;
      },
      { message: 'the journey never settled into holding still' },
    )
    .toBe(true);
  return previous;
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((to) => window.scrollTo(0, to), y);
}

/** Travels the whole journey and checks it at the start, half-way and the end. */
async function expectAFullJourney(page: Page) {
  const { start, end } = await waitForPin(page);

  // Just past the start: the section holds at the top of the window, with the
  // first panel in view and the second waiting to its left — right to left.
  await scrollTo(page, start + 2);
  await expect.poll(async () => {
    const look = await lookAt(page);
    return {
      held: Math.abs(look.top) < 1,
      firstInView: inView(look, 0),
      secondToTheLeft: look.panels[1].right <= look.panels[0].left,
      lit: look.lit,
    };
  }).toEqual({ held: true, firstInView: true, secondToTheLeft: true, lit: 1 });

  // Half-way: still held, and the marks have kept up.
  await scrollTo(page, Math.round(start + (end - start) / 2));
  await expect.poll(async () => {
    const look = await lookAt(page);
    return { held: Math.abs(look.top) < 1, lit: look.lit };
  }).toEqual({ held: true, lit: 3 });

  // The end: the Record is in view and the first panel has gone off to the right.
  await scrollTo(page, end - 1);
  await expect.poll(async () => {
    const look = await lookAt(page);
    return {
      held: Math.abs(look.top) < 1,
      lastInView: inView(look, 4),
      firstGoneRight: look.panels[0].left >= look.windowWidth,
      lit: look.lit,
    };
  }, { message: 'the journey did not arrive at its last panel' }).toEqual({
    held: true,
    lastInView: true,
    firstGoneRight: true,
    lit: 5,
  });

  // And past it, the page scrolls on as usual.
  await scrollTo(page, end + 300);
  await expect.poll(async () => (await lookAt(page)).top).toBeLessThan(-250);
}

/** Scrolling into the section moves it, as any other section moves: nothing holds it still. */
async function expectItScrollsPast(page: Page) {
  await journey(page).scrollIntoViewIfNeeded();
  const before = (await lookAt(page)).top;
  await page.mouse.wheel(0, 400);
  await expect
    .poll(async () => (await lookAt(page)).top, { message: 'the journey is holding still' })
    .toBeLessThan(before - 300);
}

/** Every panel is in view across the window, each below the one before. */
async function expectStacked(page: Page) {
  const look = await lookAt(page);
  for (const [index, panel] of look.panels.entries()) {
    expect(inView(look, index), `panel ${index + 1} is out of view across the window`).toBe(true);
    if (index > 0) expect(panel.top).toBeGreaterThan(look.panels[index - 1].top);
  }
}

test('the whole journey is in the first response', async ({ request }) => {
  const html = await (await request.get('/product')).text();

  expect(html).toContain('أربع وحدات. سجل واحد يجمعها.');
  for (const panel of PANELS) {
    expect(html).toContain(panel.title);
    // Every screen's description, as its `alt`, for all five — nothing a
    // crawler reads depends on scrolling.
    expect(html).toContain(`alt="${panel.description}"`);
  }
});

// The gate is `min-width: 981px and min-height: 551px`, so both edges are
// here: 981 wide, 551 tall — and the laptop heights the Reference site tunes
// its panels for.
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1600, height: 900 },
  { width: 981, height: 900 },
  { width: 1440, height: 700 },
  { width: 1280, height: 600 },
  { width: 1280, height: 551 },
]) {
  test(`at ${viewport.width}x${viewport.height} the journey holds still while its panels travel`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/product');

    await expectAFullJourney(page);
  });
}

for (const viewport of [
  { width: 1280, height: 550 },
  { width: 980, height: 900 },
  { width: 390, height: 900 },
]) {
  test(`at ${viewport.width}x${viewport.height} the panels stand one above another`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/product');
    await page.evaluate(() => document.fonts.ready);

    await expectItScrollsPast(page);
    await expectStacked(page);
  });
}

test('on a short window the heading, the panel and its screen all fit', async ({ page }) => {
  // The tightest the pinned journey gets, and the heights the Reference site
  // writes its own rules for.
  for (const viewport of [
    { width: 1280, height: 551 },
    { width: 1280, height: 600 },
    { width: 1440, height: 700 },
    { width: 1024, height: 840 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/product');
    const { start } = await waitForPin(page);
    await scrollTo(page, start + 2);

    await expect.poll(async () => Math.abs((await lookAt(page)).top)).toBeLessThan(1);

    const fit = await journey(page).evaluate((section) => {
      const heading = section.querySelector('h2')!.getBoundingClientRect();
      const panel = section.querySelector('.panel')!;
      const inside = panel.getBoundingClientRect();
      const column = panel.querySelector('.ui')!.getBoundingClientRect();
      const screen = panel.querySelector('img')!.getBoundingClientRect();
      const caption = panel.querySelector('.ui p')!.getBoundingClientRect();
      // The picture drawn inside its box, which keeps the mock's 1440×900.
      const drawnWidth = Math.min(screen.width, screen.height * 1.6);
      return {
        headingClearOfPanel: heading.bottom <= inside.top,
        panelInWindow: inside.bottom <= window.innerHeight,
        screenInPanel: screen.top >= inside.top && screen.bottom <= inside.bottom,
        captionInPanel: caption.bottom <= inside.bottom,
        // And it gives up no more than the caption's room: as wide as its
        // column, or as tall as the column less the caption under it.
        screenAsLargeAsFits:
          drawnWidth >= column.width - 1 || caption.bottom - screen.top >= column.height - 1,
      };
    });
    expect(fit, `at ${viewport.width}x${viewport.height}`).toEqual({
      headingClearOfPanel: true,
      panelInWindow: true,
      screenInPanel: true,
      captionInPanel: true,
      screenAsLargeAsFits: true,
    });
  }
});

test('the header stays dark through the journey and turns light after it', async ({ page }) => {
  // The pin inserts thousands of pixels of scrolling into the page. A header
  // trigger measured without them turns light half-way across the dark panels.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/product');
  const { start, end } = await waitForPin(page);
  const headerBackground = () => page.locator('.nav').evaluate((nav) => getComputedStyle(nav).backgroundColor);

  for (const y of [start + 2, Math.round(start + (end - start) * 0.5), end - 1]) {
    await scrollTo(page, y);
    await expect.poll(async () => (await lookAt(page)).top).toBeCloseTo(0, 0);
    expect(await headerBackground(), `at ${y - start}px into the journey`).toBe(HEADER_OVER_DARK);
  }

  await scrollTo(page, end + 900);
  await expect.poll(headerBackground).toBe(HEADER_OVER_LIGHT);
});

test('crossing the size gate switches between pinned and stacked, and back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/product');
  await waitForPin(page);

  await page.setViewportSize({ width: 1440, height: 500 });
  await expectItScrollsPast(page);
  await expectStacked(page);

  await page.setViewportSize({ width: 1440, height: 900 });
  await expectAFullJourney(page);
});

test('the journey is measured again when the window changes size', async ({ page }) => {
  // Every length in the pin — how far to travel, how long to hold, where the
  // panels start below the heading — depends on the window. Measured once and
  // never again, a narrower window leaves the last panel out of reach.
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/product');
  await waitForPin(page);

  await page.setViewportSize({ width: 1024, height: 700 });
  await expectAFullJourney(page);
});

test('the journey still works after leaving the page and coming back', async ({ page }) => {
  // Leaving is when teardown runs, and a teardown that fails says so only here.
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/product');
  const { start, end } = await waitForPin(page);
  await scrollTo(page, Math.round(start + (end - start) / 2));

  await page.locator('.nav .links').getByRole('link', { name: 'الرئيسية', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/');
  await page.goBack();
  await page.waitForURL((url) => url.pathname === '/product');

  await expectAFullJourney(page);
  expect(problems).toEqual([]);
});

test('with JavaScript off, a wide window shows every panel, one above another', async ({ browser }) => {
  // Without the script there is no pin to bring panels two to five into
  // view, and the Reference site leaves them out of reach off the side.
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/product');

  await expectStacked(page);

  await context.close();
});

test('every screen is the exported picture, described by its caption', async ({ page }) => {
  await page.goto('/product');

  for (const panel of PANELS) {
    const picture = journey(page).getByRole('img', { name: panel.description });
    await expect
      .poll(() => picture.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), {
        message: `${panel.mock} never loaded`,
      })
      .toBe(true);

    // Ticket 05's export, not markup rebuilt in the page.
    const source = await picture.evaluate((image: HTMLImageElement) => decodeURIComponent(image.currentSrc));
    expect(source).toContain(`/screen-mocks/ar/${panel.mock}.webp`);

    // ADR-0002: what the picture shows is said again in words a crawler can
    // read, beside it, and the words are the same.
    const caption = journey(page)
      .locator('.panel')
      .filter({ has: page.getByRole('img', { name: panel.description }) })
      .getByText(panel.description, { exact: true });
    await expect(caption).toHaveCount(1);
  }
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 600 },
  { width: 390, height: 900 },
]) {
  test(`each caption sits centred under its screen at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/product');
    await page.evaluate(() => document.fonts.ready);

    const placed = await journey(page).evaluate((section) =>
      [...section.querySelectorAll('.ui')].map((ui) => {
        // The box the visitor sees the screen in: on a phone that is the
        // window it pans behind, not the full 1040px picture.
        const screen = ui.querySelector('img')!.parentElement!.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(ui.querySelector('p')!);
        const words = range.getBoundingClientRect();
        return {
          centred: Math.abs((words.left + words.right) / 2 - (screen.left + screen.right) / 2) < 2,
          belowTheScreen: words.top >= screen.bottom,
        };
      }),
    );

    expect(placed).toEqual(PANELS.map(() => ({ centred: true, belowTheScreen: true })));
  });
}

test('on a phone each screen is shown full size, to be panned across', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/product');

  const picture = journey(page).getByRole('img', { name: PANELS[0].description });
  await picture.scrollIntoViewIfNeeded();
  expect((await picture.boundingBox())?.width).toBe(1040);

  const panned = await picture.evaluate((image) => {
    const window = image.parentElement!;
    const before = window.scrollLeft;
    // Right to left, so the rest of the screen is to the left.
    window.scrollBy({ left: -300 });
    return { canPan: window.scrollWidth > window.clientWidth, moved: window.scrollLeft !== before };
  });
  expect(panned).toEqual({ canPan: true, moved: true });
});

test.describe('layout integrity', () => {
  const WIDTHS = [360, 390, 400, 560, 620, 640, 680, 700, 768, 820, 980, 981, 1024, 1280, 1440, 1600];

  for (const width of WIDTHS) {
    test(`no sideways scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/product');

      expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});
