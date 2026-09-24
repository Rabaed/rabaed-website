/**
 * On a phone, a Screen mock that pans says it can be swiped (ticket 77).
 *
 * At 700px and narrower a Screen mock with no Phone crop is drawn 1040px wide
 * in a box that pans sideways (tickets 08 and 12), with a hint,
 * «اسحب لرؤية الشاشة كاملة», and a fade at whichever edge has more of the
 * screen behind it. Since ticket 78 every Screen mock still showing its export
 * is its Phone crop instead, so the pan is what a replaced screen with no
 * uploaded crop shows (ticket 79): its hint, its fade and a swipe across it
 * are checked where a screen can be replaced, in `product-text.spec.ts`.
 *
 * What is checked here holds on every page a visitor is sent: the hint is in
 * the first response, is never read out, and nothing of it shows above 700px.
 */
import { test, expect, type Locator, type Page } from '@playwright/test';

const HINT = 'اسحب لرؤية الشاشة كاملة';
const TABLET = { width: 768, height: 1024 };

/** Every place a Screen mock pans on a phone, and the frame the hint sits in. */
const PANS = [
  { page: '/', where: 'the four units', frames: '#jt .jt-pan' },
  { page: '/product', where: 'the journey', frames: '#journey .win' },
  { page: '/product', where: 'the roles', frames: '#roles .role.on .win' },
] as const;

async function open(page: Page, path: string, frames: string): Promise<Locator> {
  await page.goto(path);
  const first = page.locator(frames).first();
  await first.scrollIntoViewIfNeeded();
  return first;
}

for (const { page: path, where, frames } of PANS) {
  test(`${where}: the hint is not read out, and leaves the picture its description (ADR-0002)`, async ({ page }) => {
    const frame = await open(page, path, frames);

    // A screen reader is not swiping a picture, and has the description.
    await expect(frame.locator('.pan-hint')).toHaveAttribute('aria-hidden', 'true');
    const picture = frame.locator('img[data-screen-mock]').first();
    await expect(picture).toHaveAttribute('alt', /.{20,}/);
    await expect(picture).not.toHaveAttribute('alt', new RegExp(HINT));
  });

  test(`${where}: wider than 700px, nothing changes`, async ({ page }) => {
    await page.setViewportSize(TABLET);
    const frame = await open(page, path, frames);

    await expect(frame.locator('.pan-hint')).toBeHidden();
    await expect(frame.locator('[data-pan]')).toHaveCSS('mask-image', 'none');
  });
}

test('the hint is in the first response, before any script runs', async ({ request }) => {
  for (const path of ['/', '/product']) {
    expect(await (await request.get(path)).text(), path).toContain(HINT);
  }
});
