/**
 * On a phone, a Screen mock says it can be swiped (ticket 77).
 *
 * At 700px and narrower every Screen mock is drawn 1040px wide in a box that
 * pans sideways (tickets 08 and 12), and until this ticket nothing said so: a
 * visitor saw a third of the screen and took it for the whole. Now each one
 * carries a hint, «اسحب لرؤية الشاشة كاملة», and fades out whichever edge has
 * more of the screen behind it.
 *
 * The fade is read as the two widths the stylesheet draws it by, at the edge
 * where panning begins and the edge it goes towards, because a mask is not
 * something the page can be asked to describe any other way. Everything else
 * is what a visitor sees: whether the hint is showing, and what it says.
 */
import { test, expect, type Locator, type Page } from '@playwright/test';

const HINT = 'اسحب لرؤية الشاشة كاملة';
const PHONE = { width: 390, height: 812 };
const TABLET = { width: 768, height: 1024 };

/** Every place a Screen mock pans on a phone, and the box that pans. */
const PANS = [
  { page: '/', where: 'the four units', frames: '#jt .jt-pan' },
  { page: '/product', where: 'the journey', frames: '#journey .win' },
  { page: '/product', where: 'the roles', frames: '#roles .role.on .win' },
] as const;

/** The box inside a frame that pans. */
const pan = (frame: Locator) => frame.locator('[data-pan]');

/** The fade at each edge, in pixels: where panning begins, and where it goes. */
async function fades(frame: Locator): Promise<{ start: string; end: string }> {
  return pan(frame).evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      start: style.getPropertyValue('--pan-fade-start').trim(),
      end: style.getPropertyValue('--pan-fade-end').trim(),
    };
  });
}

/** Swipes a pan as far as `share` of the way along, as a finger would take it. */
async function swipe(frame: Locator, share: number): Promise<void> {
  await pan(frame).evaluate((element, share) => {
    // Right to left, the rest of the screen is to the left: scrollLeft runs
    // from 0 down to minus the hidden width.
    const hidden = element.scrollWidth - element.clientWidth;
    const towards = getComputedStyle(element).direction === 'rtl' ? -1 : 1;
    element.scrollTo({ left: towards * hidden * share, behavior: 'instant' });
  }, share);
}

async function open(page: Page, path: string, frames: string): Promise<Locator> {
  await page.goto(path);
  const first = page.locator(frames).first();
  await first.scrollIntoViewIfNeeded();
  return first;
}

for (const { page: path, where, frames } of PANS) {
  test.describe(`${where}, on a phone`, () => {
    test.use({ viewport: PHONE });

    test('says it can be swiped, and fades the edge with more behind it', async ({ page }) => {
      const frame = await open(page, path, frames);

      const hint = frame.locator('.pan-hint');
      await expect(hint).toBeVisible();
      await expect(hint).toHaveText(HINT);
      await expect(hint).toHaveCSS('opacity', '1');
      // Centred over the foot of the picture, whatever the page's own rules
      // for the words around it.
      const off = await frame.evaluate((box) => {
        const outer = box.getBoundingClientRect();
        const inner = box.querySelector('.pan-hint')!.getBoundingClientRect();
        return {
          centre: Math.abs((inner.left + inner.right) / 2 - (outer.left + outer.right) / 2),
          foot: outer.bottom - inner.bottom,
        };
      });
      expect(off.centre).toBeLessThan(2);
      expect(off.foot).toBeGreaterThan(0);
      expect(off.foot).toBeLessThan(40);

      // At rest the screen shows from where it begins, so the far edge fades
      // and the near one does not.
      await expect.poll(() => fades(frame)).toEqual({ start: '0px', end: '36px' });
    });

    test('moves the fade as it is swiped, and the hint goes once it has been', async ({ page }) => {
      const frame = await open(page, path, frames);

      await swipe(frame, 0.5);
      // Part of the way along, there is more of the screen at both edges.
      await expect.poll(() => fades(frame)).toEqual({ start: '36px', end: '36px' });
      await expect(frame.locator('.pan-hint')).toHaveCSS('opacity', '0');

      await swipe(frame, 1);
      // At the far edge there is nothing more that way.
      await expect.poll(() => fades(frame)).toEqual({ start: '36px', end: '0px' });

      await swipe(frame, 0);
      // Back where it began, and the hint does not come back: it has been read.
      await expect.poll(() => fades(frame)).toEqual({ start: '0px', end: '36px' });
      await expect(frame.locator('.pan-hint')).toHaveCSS('opacity', '0');
    });

    test('is not read out, and leaves the picture its description (ADR-0002)', async ({ page }) => {
      const frame = await open(page, path, frames);

      // A screen reader is not swiping a picture, and has the description.
      await expect(frame.locator('.pan-hint')).toHaveAttribute('aria-hidden', 'true');
      const picture = frame.getByRole('img');
      await expect(picture).toHaveAttribute('alt', /.{20,}/);
      await expect(picture).not.toHaveAttribute('alt', new RegExp(HINT));
    });
  });

  test(`${where}: wider than 700px, nothing changes`, async ({ page }) => {
    await page.setViewportSize(TABLET);
    const frame = await open(page, path, frames);

    await expect(frame.locator('.pan-hint')).toBeHidden();
    await expect(pan(frame)).toHaveCSS('mask-image', 'none');
  });
}

test('only the swiped screen loses its hint', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/product');
  const frames = page.locator('#journey .win');
  expect(await frames.count()).toBeGreaterThan(1);

  await frames.first().scrollIntoViewIfNeeded();
  await swipe(frames.first(), 0.5);
  await expect(frames.first().locator('.pan-hint')).toHaveCSS('opacity', '0');
  await expect(frames.nth(1).locator('.pan-hint')).toHaveCSS('opacity', '1');
});

test('the hint is in the first response, before any script runs', async ({ request }) => {
  for (const path of ['/', '/product']) {
    expect(await (await request.get(path)).text(), path).toContain(HINT);
  }
});
