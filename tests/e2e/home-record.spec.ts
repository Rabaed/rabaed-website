/**
 * The home page's Record section (ticket 09): as the visitor scrolls through
 * it, the section holds still, turns from dark to light, and the card beside
 * the copy shows the trail each transaction type leaves in the Record, ending
 * stamped complete — on a phone as on a desktop (ticket 80, ADR-0021).
 *
 * Asserted through what a visitor meets: which type is marked and whose trail
 * can be read, what colour the section and the header are, whether the words
 * can be read against what is behind them, and whether any of it spills out of
 * the section.
 *
 * Whether it *looks* like the Reference site, and changes colour at the same
 * points, is asked in `home-record-match-reference.spec.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import { axeFindings } from './axe';
import { readColours, readCycle, scrollToProgress, settle } from './record-section';

/** The five transaction types in order: each chip's label and the title of the trail it shows. */
const TRANSACTION_TYPES = [
  { label: 'خطاب رسمي', title: 'LTR-088 · خطاب — طلب تمديد مدة' },
  { label: 'اعتماد مادة (MIR)', title: 'SUB-031 · اعتماد مادة — بلاط الواجهات' },
  { label: 'طلب تسليم أعمال (WIR)', title: 'WIR-0142 · طلب تسليم أعمال — حديد سقف الدور 3' },
  { label: 'تحديث جدول زمني', title: 'SCH-04 · تحديث الجدول الزمني — أغسطس' },
  { label: 'مستخلص مالي (IPC)', title: 'IPC-06 · مستخلص مالي — الدفعة السادسة' },
] as const;

const STAMP = '✓ سجل كامل · 4 خطوات · 3 أطراف';

const DARK = 'rgb(20, 22, 28)';
const PAPER = 'rgb(250, 250, 248)';
const DARK_TREATMENT = { section: DARK, text: 'rgb(237, 238, 243)', card: 'rgb(27, 30, 39)' };
const LIGHT_TREATMENT = { section: PAPER, text: 'rgb(34, 34, 34)', card: 'rgb(255, 255, 255)' };
const HEADER_OVER_DARK = 'rgba(20, 22, 28, 0.72)';
const HEADER_OVER_LIGHT = 'rgba(250, 250, 248, 0.8)';

const section = (page: Page) => page.locator('#record');
const chip = (page: Page, index: number) => section(page).locator('.rec-types span').nth(index);
const title = (page: Page, index: number) => section(page).getByText(TRANSACTION_TYPES[index].title, { exact: true });

async function scrollTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), Math.round(y));
  await settle(page);
}

/** Where the section is on the page, and how tall it and the window are. */
function measure(page: Page) {
  return section(page).evaluate((element) => {
    const box = element.getBoundingClientRect();
    return {
      top: box.top + window.scrollY,
      height: box.height,
      window: window.innerHeight,
    };
  });
}

/** One type marked, its trail readable, and no other type's. */
async function expectShowing(page: Page, chosen: number) {
  for (const index of TRANSACTION_TYPES.keys()) {
    if (index === chosen) {
      await expect(chip(page, index)).toHaveClass(/\bon\b/);
      await expect(title(page, index)).toBeVisible();
    } else {
      await expect(chip(page, index)).not.toHaveClass(/\bon\b/);
      await expect(title(page, index)).toBeHidden();
    }
  }
}

/**
 * Until nothing in the section is moving: no colour part-way through its
 * switch, no chip part-way through lighting up, no trail part-way through
 * fading in. What a visitor who stopped scrolling here would see.
 */
async function waitForStillness(page: Page) {
  await expect
    .poll(() =>
      section(page).evaluate(
        (element) =>
          element.getAnimations({ subtree: true }).length === 0 &&
          [...element.querySelectorAll('.rec-card :not([hidden]) > .h b, .rec-card :not([hidden]) > .tl > li')].every(
            (part) => getComputedStyle(part).opacity === '1',
          ),
      ),
    )
    .toBe(true);
}

async function expectStamped(page: Page, stamped: boolean) {
  await expect
    .poll(async () => (await readCycle(page)).stamped, { message: stamped ? 'the stamp never came on' : 'the stamp is on' })
    .toBe(stamped);
}

/** The cycle, at a point inside each type's share of the held stretch and either side of the stamp. */
async function expectTheCycle(page: Page) {
  for (const [progress, chosen, stamped] of [
    [0.05, 0, false],
    [0.38, 1, false],
    [0.56, 2, false],
    [0.74, 3, false],
    [0.86, 4, false],
    [0.97, 4, true],
    [0.05, 0, false],
  ] as const) {
    await scrollToProgress(page, progress);
    await expectShowing(page, chosen);
    await expectStamped(page, stamped);
  }
}

/**
 * Scrolls from a little above the section to well past the stretch it holds
 * for, in small steps, noting at each where the box that holds is and which
 * type the card shows.
 */
async function walkThroughTheHold(page: Page) {
  const { top, window: tall } = await measure(page);
  const step = 16;
  const moments: { y: number; boxTop: number; chosen: number; stamped: boolean }[] = [];

  for (let y = top - 4 * step; y <= top + 1.2 * tall + 12 * step; y += step) {
    await scrollTo(page, y);
    const boxTop = await section(page).evaluate((element) => element.querySelector('.sticky')!.getBoundingClientRect().top);
    moments.push({ y: y - top, boxTop, ...(await readCycle(page)) });
  }
  return { moments, step, tall };
}

/**
 * The section holds still for as far as it does on a desktop window — 120% of
 * the window, the 220vh section less its window-tall box — and every type,
 * then the stamp, comes while it holds.
 */
async function expectItHolds(page: Page) {
  const { moments, step, tall } = await walkThroughTheHold(page);
  const held = moments.filter((moment) => Math.abs(moment.boxTop) < 0.5);
  expect(held.length, 'it holds at all').toBeGreaterThan(0);
  const heldFor = held.at(-1)!.y - held[0].y;

  expect(held[0].y, "begins to hold where its top meets the window's").toBeLessThanOrEqual(step);
  expect(heldFor, 'holds for 120% of the window').toBeGreaterThanOrEqual(1.2 * tall - 2 * step);
  expect(heldFor, 'holds for 120% of the window').toBeLessThanOrEqual(1.2 * tall + step);
  expect(moments.at(-1)!.boxTop, 'and then lets go').toBeLessThan(0);

  const before = moments.filter((moment) => moment.y < 0);
  expect(before.every((moment) => moment.chosen === 0 && !moment.stamped), 'nothing moves on before it holds').toBe(true);

  const shown = held.map((moment) => moment.chosen).filter((chosen, index, all) => chosen !== all[index - 1]);
  expect(shown, 'every type, in turn, while it holds').toEqual([0, 1, 2, 3, 4]);
  expect(held.at(-1)!.stamped, 'stamped before it lets go').toBe(true);
}

/** Where the header ends and the window does, and where the first and last things the section holds, and the paragraph after them, are. */
function readTheHeldScreen(page: Page) {
  return section(page).evaluate((element) => {
    const box = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
    return {
      header: document.querySelector('.nav')!.getBoundingClientRect().bottom,
      window: window.innerHeight,
      firstHeld: box('.eyebrow').top,
      lastHeld: box('.rec-card').bottom,
      lead: box('.lead').top,
      leadBottom: box('.lead').bottom,
    };
  });
}

test('the whole section is in the first response', async ({ request }) => {
  const html = await (await request.get('/')).text();

  expect(html).toContain('لا نسأل &quot;من اعتمد؟&quot;');
  expect(html).toContain('نفتح المعاملة.');
  expect(html).toContain('ومتى؟');
  expect(html).toContain('وبعد سنة، أو بعد نهاية المشروع، السجل نفسه ما زال هناك.');
  expect(html).toContain(STAMP);
  // Every type's trail, not only the first: nothing a crawler reads depends
  // on scrolling.
  for (const type of TRANSACTION_TYPES) {
    expect(html).toContain(type.label);
    expect(html).toContain(type.title);
  }
  for (const step of ['“يُمنح 14 يوماً” — المالك', 'م. سارة · 4 صور', 'تأخر 6 أيام على التسليم', 'بعد خصم بند غير مطابق']) {
    expect(html).toContain(step);
  }
});

test('with JavaScript off, the section shows the first trail, dark, unstamped', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();

  await expectShowing(page, 0);
  expect((await readCycle(page)).stamped).toBe(false);
  expect((await readColours(page)).section).toBe(DARK);

  await context.close();
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 550 },
]) {
  test(`at ${viewport.width}x${viewport.height} the types follow the scroll, and the stamp comes last`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expectTheCycle(page);
  });
}

/**
 * The phones and the tablet the section must hold on below 981px: a Galaxy
 * S24 and an iPhone 12 to 15 with their browsers' bars showing, and a tablet
 * held upright. Smaller phones than these are not designed for (ticket 80).
 */
const PHONES_AND_TABLETS = [
  { width: 360, height: 640 },
  { width: 390, height: 664 },
  { width: 768, height: 1024 },
];

// DIVERGENCE FROM THE REFERENCE SITE, deliberate (ticket 80, ADR-0021): below
// 981px the Reference site stops holding the section, so a quick swipe goes
// straight past the Record. Here it holds as it does on a desktop window.
for (const viewport of PHONES_AND_TABLETS) {
  test(`at ${viewport.width}x${viewport.height} the section holds while every type shows and the stamp lands, then lets go`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expectItHolds(page);
  });

  test(`at ${viewport.width}x${viewport.height} everything the section holds fits between the header and the foot of the window`, async ({ page }) => {
    // A box taller than the window cannot hold still: some of it would be
    // out of sight for the whole stretch. So the paragraph, which will not
    // fit on a phone as well, follows the card, below the window while the
    // section holds, and comes into view as it lets go.
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    for (const progress of [0, 0.5, 1]) {
      await scrollToProgress(page, progress);
      const screen = await readTheHeldScreen(page);
      const where = `at ${progress} of the held stretch: ${JSON.stringify(screen)}`;
      expect(screen.firstHeld, where).toBeGreaterThanOrEqual(screen.header);
      expect(screen.lastHeld, where).toBeLessThanOrEqual(screen.window);
      expect(screen.lead, where).toBeGreaterThanOrEqual(screen.window);
    }

    const held = await readTheHeldScreen(page);
    await scrollTo(page, (await page.evaluate(() => window.scrollY)) + held.leadBottom - held.window + 24);
    const after = await readTheHeldScreen(page);
    expect(after.lead, 'the paragraph comes into view once the section lets go').toBeGreaterThanOrEqual(after.header);
    expect(after.leadBottom, 'the paragraph comes into view once the section lets go').toBeLessThanOrEqual(after.window);
  });
}

test.describe('with reduced motion, below 981px', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('the section still holds, and the types still follow the scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 664 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expectItHolds(page);
  });
});

// Below 981px the section is as tall as what is in it, and the trails wrap to
// different numbers of lines. A card that grew and shrank with each type would
// push the rest of the page up and down under the visitor's thumb, and leave
// every scroll position measured against the section's old height stale.
for (const viewport of [
  { width: 360, height: 900 },
  { width: 390, height: 900 },
  { width: 768, height: 900 },
]) {
  test(`at ${viewport.width}x${viewport.height} the section keeps its height while the types change`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const sectionHeight = () => section(page).evaluate((element) => element.getBoundingClientRect().height);
    const heights = new Map<number, number>();

    const { top, height, window: tall } = await measure(page);
    for (let y = top - tall; y <= top + height; y += 24) {
      await scrollTo(page, y);
      const { chosen } = await readCycle(page);
      // Once any fade has finished and the new trail is in place.
      await page.waitForTimeout(chosen === [...heights.keys()].at(-1) ? 0 : 700);
      heights.set(chosen, await sectionHeight());
    }

    expect([...heights.keys()]).toEqual([0, 1, 2, 3, 4]);
    expect(new Set(heights.values()).size, `heights by type: ${JSON.stringify([...heights])}`).toBe(1);
  });
}

test('the section switches from dark to light at one point, on its own, and back', async ({ page }) => {
  // DIVERGENCE FROM THE REFERENCE SITE, deliberate (ticket 69): the Reference
  // site blends the section under the scroll, through a grey no text can be
  // read on. Here it switches at 12.5% of the way in, and the switch runs to
  // its end without any more scrolling.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const { top, height } = await measure(page);

  await scrollTo(page, top - 10);
  expect(await readColours(page)).toMatchObject(DARK_TREATMENT);

  await scrollTo(page, top + height * 0.11);
  await waitForStillness(page);
  expect(await readColours(page)).toMatchObject(DARK_TREATMENT);

  await scrollTo(page, top + height * 0.14);
  await waitForStillness(page);
  expect(await readColours(page)).toMatchObject(LIGHT_TREATMENT);

  await scrollTo(page, top + height * 0.4);
  expect(await readColours(page)).toMatchObject(LIGHT_TREATMENT);

  // And back.
  await scrollTo(page, top + height * 0.11);
  await waitForStillness(page);
  expect(await readColours(page)).toMatchObject(DARK_TREATMENT);
});

test('a window resized with the section light keeps it light', async ({ page }) => {
  // Crossing the breakpoint takes the behaviour apart and builds it again,
  // with the visitor already past the point where it switches.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await scrollToProgress(page, 0.4);
  await expect.poll(() => readColours(page)).toMatchObject(LIGHT_TREATMENT);

  await page.setViewportSize({ width: 390, height: 900 });
  const { top, height } = await measure(page);
  await scrollTo(page, top + height * 0.5);
  await waitForStillness(page);
  expect(await readColours(page)).toMatchObject(LIGHT_TREATMENT);
});

test('the header stays dark through the section, and turns light at the first light section after it', async ({ page }) => {
  // The section turns light, but it is not a light section: the Reference
  // site keeps the header dark over it, until the next section starts. Until
  // ticket 10 lands that next section is the figures deck; after, it is the
  // before-and-after, as on the Reference site, and this test follows.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const { top, height, window: tall } = await measure(page);
  const headerBackground = () => page.locator('.nav').evaluate((nav) => getComputedStyle(nav).backgroundColor);

  for (const y of [top + 2, top + height * 0.5, top + height - tall - 1]) {
    await scrollTo(page, y);
    expect(await headerBackground(), `at ${Math.round(y - top)}px into the section`).toBe(HEADER_OVER_DARK);
  }

  const nextLight = await page.evaluate(
    () => document.querySelector('#record ~ section.light')!.getBoundingClientRect().top + window.scrollY,
  );
  await scrollTo(page, nextLight);
  await expect.poll(headerBackground).toBe(HEADER_OVER_LIGHT);

  await scrollTo(page, top + height * 0.5);
  await expect.poll(headerBackground).toBe(HEADER_OVER_DARK);
});

test('nothing in the section spills out of it', async ({ page }) => {
  // On a phone the Reference site's copy and card are taller than the window
  // the section is held to, so they hang over the section above and the foot
  // of the card is covered by the section below.
  for (const viewport of [
    { width: 360, height: 900 },
    { width: 390, height: 900 },
    { width: 768, height: 900 },
    { width: 1280, height: 550 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await settle(page);
    const fits = await section(page).evaluate((element) => {
      const box = element.getBoundingClientRect();
      const content = element.querySelector('.rec-grid')!.getBoundingClientRect();
      return content.top >= box.top - 0.5 && content.bottom <= box.bottom + 0.5;
    });
    expect(fits, `at ${viewport.width}x${viewport.height}`).toBe(true);
  }
});

test('the cycle is measured again when the window changes size', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/');
  await scrollToProgress(page, 0.38);
  await expectShowing(page, 1);

  await page.setViewportSize({ width: 1024, height: 700 });
  await expectTheCycle(page);

  await page.setViewportSize({ width: 390, height: 900 });
  await expectTheCycle(page);
});

test('the section still works after leaving the page and coming back', async ({ page }) => {
  // Leaving is when teardown runs, and a teardown that fails says so only here.
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await scrollToProgress(page, 0.56);
  await expectShowing(page, 2);

  await page.getByRole('link', { name: 'شاهد الوحدات كاملة بالتفصيل' }).click();
  await page.waitForURL((url) => url.pathname === '/product');
  await page.goBack();
  await page.waitForURL((url) => url.pathname === '/');

  await expectTheCycle(page);
  expect(problems).toEqual([]);
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('the chosen trail is there at once, without fading in', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await scrollToProgress(page, 0.38);
    const opacities = await section(page).evaluate((element) =>
      [...element.querySelectorAll('.rec-card :not([hidden]) > .h b, .rec-card :not([hidden]) > .tl > li')].map(
        (part) => getComputedStyle(part).opacity,
      ),
    );
    expect(opacities).toEqual(['1', '1', '1', '1', '1']);
    await expectShowing(page, 1);
  });

});

for (const motion of ['no-preference', 'reduce'] as const) {
  test.describe(`with motion ${motion === 'reduce' ? 'reduced' : 'on'}`, () => {
    test.use({ contextOptions: { reducedMotion: motion } });

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 900 },
    ]) {
      test(`at ${viewport.width}x${viewport.height} every word can be read wherever the visitor stops`, async ({ page }) => {
        // Blended under the scroll, as on the Reference site, the section
        // passes through a grey where dark words and light ones are both lost
        // against it, for as long as the visitor stops there (ticket 69). So
        // at points from before the section to a third of the way through it,
        // across the switch, axe reads every word in it once everything has
        // stopped moving. Then once more, stamped, which only the end shows.
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.evaluate(() => document.fonts.ready);
        const { top, height, window: tall } = await measure(page);

        // Sixteen evenly spaced, and two either side of the switch.
        const from = top - tall / 2;
        const to = top + height / 3;
        const stops = [...Array.from({ length: 16 }, (_, index) => from + ((to - from) * index) / 15), top + height * 0.12, top + height * 0.13];
        for (const y of stops.sort((a, b) => a - b)) {
          await scrollTo(page, y);
          await waitForStillness(page);
          const { violations, undecided } = await axeFindings(page, '#record');
          const where = `at ${Math.round(y - top)}px into the section`;
          expect(violations, where).toBe('');
          expect(undecided, where).toBe('');
        }

        // The end of the cycle, where the section lets go.
        await scrollToProgress(page, 1);
        await expectStamped(page, true);
        await waitForStillness(page);
        const { violations, undecided } = await axeFindings(page, '#record');
        expect(violations, 'stamped').toBe('');
        expect(undecided, 'stamped').toBe('');
      });
    }
  });
}
