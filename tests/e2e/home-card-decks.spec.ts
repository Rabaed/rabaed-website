/**
 * The two card decks on the home page (ticket 07): the situations from the
 * field, and the figures after launch.
 *
 * Every behavioural test runs against both decks, from one list. That is the
 * executable form of "one deck implementation reused by both sections": a
 * second copy that drifted would fail here, on the deck it broke.
 *
 * What is asserted is what a visitor can observe — the counter, which card a
 * screen reader is given, whether the page scrolls sideways. Which card is on
 * top is read through the accessibility tree, since the five behind it are
 * hidden from it: the same answer a sighted visitor gets by looking. The
 * counter and the section's closing line are found by the Reference site's
 * class names, as the other specs find the header's parts.
 *
 * The interaction tests run with reduced motion on. The only thing that
 * changes is that the one-time nudge does not fire — and the nudge, arriving
 * 700ms after a section scrolls into view, would otherwise land in the middle
 * of whatever a test was doing. It has its own tests, with motion on.
 */
import { test, expect, type Locator, type Page } from '@playwright/test';
import { sidewaysOverflow, widestSidewaysOverflow } from './geometry';

const DECKS = [
  {
    name: 'the situations deck',
    section: '#pain',
    label: /مواقف من الميدان/,
    next: 'الموقف التالي',
    previous: 'الموقف السابق',
    first: 'المقاول يقول الاستشاري مأخّر الشغل',
    second: 'الداشبورد يقرأ من ملف إكسل',
    last: 'بعد نهاية المشروع احتجنا اعتماداً قديماً',
  },
  {
    name: 'the figures deck',
    section: '#proof',
    label: /أرقام الأثر/,
    next: 'الرقم التالي',
    previous: 'الرقم السابق',
    first: 'أسرع في الاعتمادات والاستلامات',
    second: 'أسرع في استرجاع الوثائق',
    last: 'جلسة تعريفية واحدة لكل فريق',
  },
] as const;

type Deck = (typeof DECKS)[number];

function partsOf(page: Page, deck: Deck) {
  const section = page.locator(deck.section);
  return {
    section,
    pile: section.getByRole('group', { name: deck.label }),
    count: section.locator('.deck-count'),
    next: section.getByRole('button', { name: deck.next, exact: true }),
    previous: section.getByRole('button', { name: deck.previous, exact: true }),
  };
}

/** The card a screen reader is given is the one on top — and it is only ever one card. */
async function expectOnTop(pile: Locator, shown: string, hidden: string) {
  await expect
    .poll(() => pile.ariaSnapshot(), { message: `expected «${shown}» on top` })
    .toContain(shown);
  expect(await pile.ariaSnapshot()).not.toContain(hidden);
}

/**
 * Long enough for a throw (400ms and a frame) or a return (420ms) to finish.
 * The deck ignores input while a card is moving — as the Reference site's
 * does — so a test that clicks again too soon would be testing that instead.
 */
async function settle(page: Page) {
  await page.waitForTimeout(500);
}

async function centreOf(pile: Locator) {
  await pile.scrollIntoViewIfNeeded();
  const box = (await pile.boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Picks the top card up by its middle, carries it `by` pixels sideways, and lets go. */
async function drag(page: Page, pile: Locator, by: number) {
  const { x, y } = await centreOf(pile);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + by / 2, y, { steps: 5 });
  await page.mouse.move(x + by, y, { steps: 5 });
  await page.mouse.up();
}

/**
 * Follows a card's left edge every frame for `ms`: where it began, the furthest
 * left it went, and where it ended. The nudge leans the card 46px towards the
 * next card's side — left, in Arabic — and brings it back.
 */
async function trackLeft(card: Locator, ms: number) {
  return card.evaluate(
    (element, ms) =>
      new Promise<{ rest: number; leftmost: number; last: number }>((resolve) => {
        const read = () => element.getBoundingClientRect().left;
        const rest = read();
        let leftmost = rest;
        let last = rest;
        const started = performance.now();
        const tick = () => {
          last = read();
          leftmost = Math.min(leftmost, last);
          if (performance.now() - started < ms) requestAnimationFrame(tick);
          else resolve({ rest, leftmost, last });
        };
        requestAnimationFrame(tick);
      }),
    ms,
  );
}

test('both decks carry every card in the first response', async ({ request }) => {
  const html = await (await request.get('/')).text();

  for (const phrase of [
    'المقاول يقول الاستشاري مأخّر الشغل',
    'الداشبورد يقرأ من ملف إكسل',
    'ملفين إكسل، تاريخين لنفس المستند',
    'الاعتماد وصل بالإيميل قبل شهور',
    'الجدول الزمني تحدّث',
    'بعد نهاية المشروع احتجنا اعتماداً قديماً',
    'نزاع بلا مرجع، وكل طرف معه نسخته.',
    'سجل المشروع يضيع مع انتهاء المشروع.',
    'أسرع في الاعتمادات والاستلامات',
    'تحسّن في حوكمة الوثائق',
    'أقل من يوم',
    'جلسة تعريفية واحدة لكل فريق',
    'اسحب البطاقة يميناً أو يساراً · أو استخدم الأسهم',
  ]) {
    expect(html).toContain(phrase);
  }
});

for (const deck of DECKS) {
  test.describe(deck.name, () => {
    test('opens on its first card, with JavaScript off', async ({ browser }) => {
      // The stack is drawn on the server. Without that, six cards arrive on
      // exactly the same spot with the last one on top, under a counter
      // reading "1" — which is what the Reference site shows until its script
      // runs.
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto('/');

      const { pile, count } = partsOf(page, deck);
      await expect(count).toHaveText('1 / 6');
      await expectOnTop(pile, deck.first, deck.second);

      await context.close();
    });

    test.describe('with reduced motion', () => {
      test.use({ contextOptions: { reducedMotion: 'reduce' } });

      test('the buttons step forward and back, and wrap round', async ({ page }) => {
        await page.goto('/');
        const { pile, count, next, previous } = partsOf(page, deck);
        await pile.scrollIntoViewIfNeeded();

        await next.click();
        await expect(count).toHaveText('2 / 6');
        await expectOnTop(pile, deck.second, deck.first);
        await settle(page);

        await previous.click();
        await expect(count).toHaveText('1 / 6');
        await expectOnTop(pile, deck.first, deck.second);
        await settle(page);

        // Back from the first card is the last one, brought round from the
        // bottom of the pile.
        await previous.click();
        await expect(count).toHaveText('6 / 6');
        await expectOnTop(pile, deck.last, deck.first);
      });

      test('six throws bring the first card back to the top', async ({ page }) => {
        await page.goto('/');
        const { pile, count, next } = partsOf(page, deck);
        await pile.scrollIntoViewIfNeeded();

        for (const expected of ['2', '3', '4', '5', '6', '1']) {
          await next.click();
          await expect(count).toHaveText(`${expected} / 6`);
          await settle(page);
        }
        await expectOnTop(pile, deck.first, deck.second);
      });

      test('the arrow keys step forward and back', async ({ page }) => {
        await page.goto('/');
        const { pile, count } = partsOf(page, deck);

        await pile.focus();
        await expect(pile).toBeFocused();

        // Reading right to left, the next card is to the left.
        await page.keyboard.press('ArrowLeft');
        await expect(count).toHaveText('2 / 6');
        await expectOnTop(pile, deck.second, deck.first);
        await settle(page);

        await page.keyboard.press('ArrowRight');
        await expect(count).toHaveText('1 / 6');
        await expectOnTop(pile, deck.first, deck.second);
      });

      test('a drag past the threshold throws the card, and a short one drops it back', async ({
        page,
      }) => {
        await page.goto('/');
        const { pile, count } = partsOf(page, deck);

        await drag(page, pile, -40);
        await settle(page);
        await expect(count).toHaveText('1 / 6');
        await expectOnTop(pile, deck.first, deck.second);

        await drag(page, pile, -160);
        await expect(count).toHaveText('2 / 6');
        await expectOnTop(pile, deck.second, deck.first);
        await settle(page);

        // Either way will do: the throw direction is the visitor's, not the deck's.
        await drag(page, pile, 160);
        await expect(count).toHaveText('3 / 6');
      });

      for (const width of [360, 820, 1280]) {
      test(`a card in flight never pushes the page sideways at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/');
        const { pile, next } = partsOf(page, deck);

        // Held mid-drag — on a phone, well past the edge of the screen...
        const { x, y } = await centreOf(pile);
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x - 150, y, { steps: 8 });
        expect(await sidewaysOverflow(page), 'while being dragged').toBeLessThanOrEqual(0);
        await page.mouse.up();
        await settle(page);

        // ...and in every frame of a throw, which carries the card 130% of its
        // own width off the side before the pile closes up.
        const worst = widestSidewaysOverflow(page, 900);
        await next.click();
        expect(await worst, 'while being thrown').toBeLessThanOrEqual(0);
      });
      }
    });

    test.describe('by touch', () => {
      test.use({ hasTouch: true, contextOptions: { reducedMotion: 'reduce' } });

      test('a swipe throws the card', async ({ page }) => {
        await page.goto('/');
        const { pile, count } = partsOf(page, deck);
        const { x, y } = await centreOf(pile);

        // Real touch input, through the browser's own input pipeline: a
        // finger, not a mouse pretending. It reaches the deck as pointer
        // events only because `touch-action: pan-y` leaves horizontal
        // movement to the page's script instead of scrolling.
        const touch = await page.context().newCDPSession(page);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 10; step++) {
          await touch.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x: x - 16 * step, y }],
          });
        }
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

        await expect(count).toHaveText('2 / 6');
        await expectOnTop(pile, deck.second, deck.first);
      });
    });

    test.describe('the nudge', () => {
      test('leans the top card aside once, the first time the section comes into view', async ({
        page,
      }) => {
        await page.goto('/');
        const { section, pile } = partsOf(page, deck);
        const top = pile.locator('article').first();

        await section.evaluate((element) => element.scrollIntoView({ block: 'start' }));
        const first = await trackLeft(top, 2200);
        expect(first.rest - first.leftmost, 'the card never leaned aside').toBeGreaterThan(30);
        expect(Math.abs(first.last - first.rest), 'the card never settled back').toBeLessThan(1);

        // Away and back again: a hint is for the first visit to the section,
        // not every one.
        await page.evaluate(() => window.scrollTo(0, 0));
        await section.evaluate((element) => element.scrollIntoView({ block: 'start' }));
        const again = await trackLeft(top, 1800);
        expect(again.rest - again.leftmost, 'it nudged a second time').toBeLessThan(1);
      });

      test('leaves alone a deck the visitor has already moved', async ({ page }) => {
        await page.goto('/');
        const { section, pile, next } = partsOf(page, deck);

        await section.evaluate((element) => element.scrollIntoView({ block: 'start' }));
        await next.click();
        await settle(page);

        // The second card is on top now, and the nudge would reach it in the
        // next second and a half if it were still coming.
        const after = await trackLeft(pile.locator('article').nth(1), 1500);
        expect(after.rest - after.leftmost).toBeLessThan(1);
      });

      test('does not happen with reduced motion', async ({ browser }) => {
        const context = await browser.newContext({ reducedMotion: 'reduce' });
        const page = await context.newPage();
        await page.goto('/');
        const { section, pile } = partsOf(page, deck);

        await section.evaluate((element) => element.scrollIntoView({ block: 'start' }));
        const still = await trackLeft(pile.locator('article').first(), 2000);
        expect(still.rest - still.leftmost).toBeLessThan(1);

        await context.close();
      });
    });
  });
}

test.describe('the closing line of the situations section', () => {
  const line = (page: Page) => page.locator('#pain .pain-close');
  const opacity = (page: Page) => line(page).evaluate((element) => getComputedStyle(element).opacity);

  test('is there with JavaScript off', async ({ browser }) => {
    // The Reference site hides every `.reveal` element in its stylesheet and
    // leaves it to a script to show them, so without the script this sentence
    // is never seen.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    await expect(line(page)).toBeVisible();
    expect(await opacity(page)).toBe('1');

    await context.close();
  });

  test('rises into view the first time it is reached', async ({ page }) => {
    await page.goto('/');

    await expect
      .poll(() => opacity(page), { message: 'it was never held back for its entrance' })
      .toBe('0');
    await line(page).scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(page), { message: 'it never arrived' }).toBe('1');
  });

  test('does not blink when the page opens already scrolled to it', async ({ page }) => {
    // A link to the section, a reload part-way down, a restored scroll
    // position: the line is on screen before the script arrives. Hiding it
    // then, to fade it back in, would make it vanish in front of the visitor.
    await page.goto('/#pain');

    const faintest = await line(page).evaluate(
      (element) =>
        new Promise<number>((resolve) => {
          let least = Number(getComputedStyle(element).opacity);
          const started = performance.now();
          const tick = () => {
            least = Math.min(least, Number(getComputedStyle(element).opacity));
            if (performance.now() - started < 1500) requestAnimationFrame(tick);
            else resolve(least);
          };
          requestAnimationFrame(tick);
        }),
    );
    expect(faintest).toBe(1);
  });

  test('is simply there with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    // Long enough for the page's scripts to have run and chosen not to hide it.
    await page.waitForTimeout(800);

    expect(await opacity(page)).toBe('1');

    await context.close();
  });
});
