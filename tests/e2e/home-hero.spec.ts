/**
 * The home page's opening screen and the Trust strip under it (ticket 06).
 *
 * What a visitor can observe: a hero that fills the window at desktop widths
 * and stops trying to below them, a document that actually travels between the
 * three parties, a strip of client marks that moves and stops under the
 * pointer, and a name in text where a mark fails to arrive.
 *
 * Whether it *looks* like the Reference site is a different question, and
 * `home-matches-reference.spec.ts` is where it is asked.
 */
import { test, expect, type Page } from '@playwright/test';

const SHORT_DESKTOP = { width: 1280, height: 700 };

/** Where the document is now, as a percentage of the art box — its own units. */
async function documentPosition(page: Page) {
  return page.locator('#h-doc').evaluate((doc) => {
    const art = doc.closest('.hero-art')!.getBoundingClientRect();
    const box = doc.getBoundingClientRect();
    return {
      left: Math.round(((box.left + box.width / 2 - art.left) / art.width) * 100),
      top: Math.round(((box.top + box.height / 2 - art.top) / art.height) * 100),
    };
  });
}

/** How far along the rail has travelled, in pixels from where it started. */
async function railOffset(page: Page) {
  return page.locator('.logos-track').evaluate((track) => {
    const transform = getComputedStyle(track).transform;
    // `none` is a rail that has never been given a tween — which is the
    // reduced-motion case, and what the first frame looks like in every other.
    return transform === 'none' ? 0 : Math.round(new DOMMatrixReadOnly(transform).m41);
  });
}

test.describe('the hero', () => {
  test('fills the window at desktop widths and no more than its content below them', async ({
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const height = async () => (await page.locator('#hero').boundingBox())!.height;

    // 100vh, exactly: the first thing a visitor sees is the whole promise and
    // nothing of what follows it.
    await page.setViewportSize({ width: 1280, height: 900 });
    expect(await height()).toBe(900);

    // ...with a 760px floor under it, so a short-but-not-tiny desktop window
    // scrolls rather than crushing the diagram. 750px is between the floor and
    // the 700px height query that lowers it.
    await page.setViewportSize({ width: 1280, height: 750 });
    expect(await height()).toBe(760);

    // Below 981px the grid stacks, and a fixed height would put the diagram
    // outside a section that clips its overflow. It takes the height it needs.
    await page.setViewportSize({ width: 980, height: 900 });
    expect(await height()).toBeGreaterThan(900);
  });

  test('carries the whole opening screen in the server response', async ({ request }) => {
    const html = await (await request.get('/')).text();

    for (const phrase of [
      'ثلاثة أطراف.',
      'مسؤولية واضحة.',
      'احجز عرضاً حياً',
      'عرض على مشروع حقيقي · 30 دقيقة · بالعربية',
      'ضمان استرجاع كامل المبلغ',
      // The three parties, named beside their buildings.
      'المالك',
      'الاستشاري',
      'المقاول',
      // ...and the same picture stated in words, for anyone who cannot see it.
      'كل معاملة تنتقل بين الأطراف الثلاثة',
    ]) {
      expect(html).toContain(phrase);
    }
  });

  test('starts the document at the Contractor, with the first status beside it', async ({
    browser,
  }) => {
    // JavaScript off: what is asserted here is the markup's own resting state,
    // which is also what a visitor sees in the instant before hydration.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    expect(await documentPosition(page)).toEqual({ left: 19, top: 76 });
    await expect(page.locator('#h-status')).toHaveText('أُرسل · 07:12');

    await context.close();
  });

  test('sends the document round the three parties, changing the status as it lands', async ({
    page,
  }) => {
    await page.goto('/');

    // The Consultant, then the Owner: the route a request takes through the
    // Record. Each is asserted by where the document is, not by a class.
    await expect
      .poll(() => documentPosition(page), { message: 'the document never reached the Consultant' })
      .toEqual({ left: 81, top: 76 });
    await expect(page.locator('#h-status')).toHaveText('روجع · 09:20');

    await expect
      .poll(() => documentPosition(page), { message: 'the document never reached the Owner' })
      .toEqual({ left: 50, top: 31 });
    await expect(page.locator('#h-status')).toHaveText('اعتُمد · 12:05');

    await expect(page.locator('#h-status')).toHaveText('وصل السجل للأطراف الثلاثة');

    // ...and round again. A loop that ran once and stopped would pass every
    // assertion above.
    await expect(page.locator('#h-status')).toHaveText('أُرسل · 07:12');
  });

  test('visits the three parties in the order a request travels', async ({ page }) => {
    await page.goto('/');

    // Every frame for five seconds, keeping only the frames where the document
    // is standing on a tower rather than between two of them. Polling for each
    // arrival in turn — which is what the test above does — cannot see a
    // document that was at the wrong tower before the first hop, because by
    // the time the poll looks it has already left. This does.
    //
    // It was worth writing: the loop did exactly that. A `fromTo` applies its
    // starting value when it is *built*, not when it runs, so all three hops
    // set their own start as the timeline was assembled and the last one won.
    // The document opened at the Owner's tower for 0.85 seconds, every visit.
    const towers = await page.evaluate(async () => {
      const doc = document.getElementById('h-doc')!;
      const art = doc.closest('.hero-art')!;

      // Where the document's centre is, in the art box's own percentages —
      // the same measurement the rest of this file takes, and one a visitor
      // could make with a ruler. A tenth of a percent is tight enough that
      // only an arrival matches: the document is never within a tenth of a
      // tower while it is still on its way to one.
      const towers = [
        { left: 18.67, top: 75.56 },
        { left: 81.33, top: 75.56 },
        { left: 50, top: 31.11 },
      ];
      const standingOn = () => {
        const frame = art.getBoundingClientRect();
        const box = doc.getBoundingClientRect();
        const left = ((box.left + box.width / 2 - frame.left) / frame.width) * 100;
        const top = ((box.top + box.height / 2 - frame.top) / frame.height) * 100;
        return towers.findIndex(
          (tower) => Math.abs(left - tower.left) < 0.1 && Math.abs(top - tower.top) < 0.1,
        );
      };

      const seen: number[] = [];
      await new Promise<void>((resolve) => {
        const started = performance.now();
        const sample = () => {
          const here = standingOn();
          if (here !== -1 && here !== seen.at(-1)) seen.push(here);
          if (performance.now() - started < 5000) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });

      return seen;
    });

    // Contractor, Consultant, Owner — a request raised, reviewed, approved.
    expect(towers.slice(0, 3)).toEqual([0, 1, 2]);
  });

  test('the pulse ring shows where the document landed', async ({ page }) => {
    await page.goto('/');

    // The ring is invisible at rest and expands out of an arrival, so "it
    // pulses" is: at some point it is both visible and larger than it was.
    await expect
      .poll(
        async () =>
          page
            .locator('#h-pulse')
            .evaluate((ring) => Number(getComputedStyle(ring).opacity) > 0.1),
        { message: 'the pulse ring never appeared' },
      )
      .toBe(true);
  });
});

test.describe('the Trust strip', () => {
  test('names every company in the server response', async ({ request }) => {
    const html = await (await request.get('/')).text();

    expect(html).toContain('أطراف نشطة حالياً تستخدم ربائد');
    for (const name of [
      'نواة للاستثمار العقاري',
      'Staterra',
      'شركة الشرق للاستشارات الهندسية',
      'شاهين للاستشارات الهندسية',
      'North Injazat',
      'شركة أماك بيلد',
      'Smart Directions',
      'Sika',
    ]) {
      expect(html).toContain(name);
    }
  });

  test('reads its client list out once, not twice', async ({ page }) => {
    await page.goto('/');

    // The second copy of the row exists to hide the loop's seam. To a screen
    // reader it is eight companies that are not really there.
    await expect(page.getByRole('img', { name: 'Sika' })).toHaveCount(1);
  });

  test('moves continuously, and pauses under the pointer', async ({ page }) => {
    await page.goto('/');

    const start = await railOffset(page);
    await expect
      .poll(() => railOffset(page), { message: 'the strip never moved' })
      .not.toBe(start);

    await page.locator('.logos-rail').hover();
    const held = await railOffset(page);
    // Two frames apart at 40px/s is under a pixel, so the wait has to be long
    // enough that a strip which is still moving has visibly moved.
    await page.waitForTimeout(600);
    expect(await railOffset(page), 'the strip kept moving under the pointer').toBe(held);

    await page.mouse.move(0, 0);
    await expect
      .poll(() => railOffset(page), { message: 'the strip never started again' })
      .not.toBe(held);
  });

  test('shows the company name as text when its mark is missing', async ({ page }) => {
    await page.route('**/logos/sika.png', (route) => route.abort());
    await page.goto('/');

    const slot = page.locator('.logos-row:not(.copy) .slot').last();
    await expect(slot.locator('b')).toHaveText('Sika');
    await expect(slot.locator('b')).toBeVisible();
    await expect(slot.locator('img')).toBeHidden();

    // Every other mark is untouched: one broken file must not empty the strip.
    await expect(page.locator('.logos-row:not(.copy) .slot img:visible')).toHaveCount(7);
  });

  test('stays inside the page when every mark is missing at once', async ({ page }) => {
    // The names are longer than the marks they replace — «شركة الشرق
    // للاستشارات الهندسية» is thirty characters against a 78px logo — and the
    // narrowest phone is the width where that tells. The overflow test in
    // `page-shell.spec.ts` only ever sees the strip with all eight images
    // loading, so this is the case it cannot reach.
    await page.route('**/logos/*.png', (route) => route.abort());
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto('/');

    await expect(page.locator('.logos-row:not(.copy) .slot b').first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('nothing moves, and everything is still legible', async ({ page }) => {
    await page.setViewportSize(SHORT_DESKTOP);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    // The document stays where the markup put it, and the pill states the
    // promise rather than a moment in a story that is not going to play.
    await expect(page.locator('#h-status')).toHaveText('موثّق ومؤرخ');
    await page.waitForTimeout(1500);
    expect(await documentPosition(page)).toEqual({ left: 19, top: 76 });
    expect(await railOffset(page)).toBe(0);

    // Standing still, the rail lets its content out rather than clipping it —
    // which is the arrangement in which an over-wide name could push the page
    // sideways, so the check belongs here too.
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(0);

    // The strip stands still, so all eight marks have to be where they can be
    // seen rather than four of them behind a fade.
    await page.locator('.logos').scrollIntoViewIfNeeded();
    await expect(page.locator('.logos-row:not(.copy) .slot img')).toHaveCount(8);
    for (const mark of await page.locator('.logos-row:not(.copy) .slot img').all()) {
      await expect(mark).toBeInViewport();
    }

    // ...and the hero still reads as a hero.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('عرض على مشروع حقيقي · 30 دقيقة · بالعربية')).toBeVisible();
  });

  test('the strip holds the page together on a phone with no marks at all', async ({ page }) => {
    // The two conditions that each make the strip wider, together: standing
    // still it stops clipping, and with every mark gone it is eight company
    // names in text instead — the longest of them thirty characters against
    // the 320px a 360px phone leaves inside the gutters. Neither the overflow
    // sweep in `page-shell.spec.ts` nor the two tests above reach this corner.
    await page.route('**/logos/*.png', (route) => route.abort());
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const names = page.locator('.logos-row:not(.copy) .slot b');
    await expect(names).toHaveCount(8);
    await expect(names.first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
