/**
 * On a phone, each Screen mock is its Phone crop, and tapping it shows the
 * whole screen (ticket 78, ADR-0022).
 *
 * At 700px and narrower the home and product pages show a second picture of
 * each screen, cut from it by the export, in place of the whole one; wider,
 * nothing changes. The crop is a button: tapped, the whole screen opens over
 * the page, where it can be zoomed and panned, and closed by its button, by
 * Escape or by going back.
 *
 * Everything here is a Screen mock still showing its export. One an Editor
 * has replaced shows the crop they uploaded beside it, or with none pans as
 * ticket 77 made it (ticket 79); that is checked where the replacing is done,
 * in `product-text.spec.ts`. The English pages are checked in
 * `english-pages.spec.ts`, which can preview them.
 */
import { test, expect, type Locator, type Page } from '@playwright/test';
import { drawnFrom } from './screen-mock-phone';
import { PHONE_CROP } from '../../src/screen-mocks/registry';
import { sidewaysOverflow, sidewaysOverflowOf } from './geometry';

const PHONE = { width: 390, height: 812 };
const TABLET = { width: 768, height: 1024 };
const OPEN = 'اضغط لرؤية الشاشة كاملة';

/** Every place a Screen mock stands, and the frame the one on show stands in. */
const PLACES = [
  { page: '/', where: 'the four units', frame: '#jt .jt-shot.on' },
  { page: '/product', where: 'the journey', frame: '#journey .ui' },
  { page: '/product', where: 'the roles', frame: '#roles .role.on' },
] as const;

async function frameOn(page: Page, path: string, frame: string): Promise<Locator> {
  await page.goto(path);
  const first = page.locator(frame).first();
  await first.scrollIntoViewIfNeeded();
  return first;
}

for (const { page: path, where, frame } of PLACES) {
  test(`${where}: on a phone, the screen is its Phone crop, which says it opens the whole screen`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    const shown = await frameOn(page, path, frame);
    const picture = shown.locator('img[data-screen-mock]');
    const mock = await picture.getAttribute('data-screen-mock');

    expect(await drawnFrom(picture)).toBe(`/screen-mocks/ar/phone/${mock}.webp`);

    // Drawn whole, in the crop's own shape, inside the page's column: nothing
    // to pan, and nothing faded or hinted at as if there were.
    const box = (await picture.boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(PHONE.width - 32);
    expect(box.width / box.height).toBeCloseTo(PHONE_CROP.width / PHONE_CROP.height, 2);
    const pan = picture.locator('xpath=ancestor::*[@data-pan][1]');
    expect(await sidewaysOverflowOf(pan)).toBeLessThanOrEqual(0);
    await expect(pan).toHaveCSS('mask-image', 'none');
    await expect(page.locator('.pan-hint').filter({ visible: true })).toHaveCount(0);

    // Its description is the Screen mock's own (ADR-0002), and the button
    // over it says what tapping does.
    await expect(picture).toHaveAttribute('alt', /.{20,}/);
    const opener = shown.getByRole('button', { name: OPEN });
    await expect(opener).toBeVisible();
    const target = (await opener.boundingBox())!;
    expect(target.width).toBeCloseTo(box.width, 0);
    expect(target.height).toBeCloseTo(box.height, 0);
  });

  test(`${where}: at 768px the whole screen shows, as it always has`, async ({ page }) => {
    await page.setViewportSize(TABLET);
    const shown = await frameOn(page, path, frame);
    const picture = shown.locator('img[data-screen-mock]');
    const mock = await picture.getAttribute('data-screen-mock');

    expect(await drawnFrom(picture)).toBe(`/screen-mocks/ar/${mock}.webp`);
    await expect(shown.getByRole('button', { name: OPEN })).toBeHidden();
    expect(await picture.evaluate((image) => image.getBoundingClientRect().width / image.getBoundingClientRect().height)).toBeCloseTo(
      1440 / 900,
      2,
    );
  });
}

test('a phone is sent the crops, and no whole screen until one is tapped', async ({ page }) => {
  await page.setViewportSize(PHONE);
  const fetched: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    const file = url.pathname === '/_next/image' ? url.searchParams.get('url') : url.pathname;
    if (file?.startsWith('/screen-mocks/')) fetched.push(file);
  });

  for (const path of ['/', '/product']) {
    await page.goto(path);
    // Down the whole page, so that a picture waiting to be near the window is
    // fetched too.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    });
    await page.waitForLoadState('networkidle');
  }

  expect(fetched.length, 'the crops were fetched').toBeGreaterThan(0);
  expect(fetched.filter((file) => !file.includes('/phone/')), 'whole screens fetched by a phone').toEqual([]);

  // Tapped, the whole screen is fetched: the one tapped, and only that.
  const shown = page.locator('#journey .ui').first();
  await shown.scrollIntoViewIfNeeded();
  const mock = await shown.locator('img[data-screen-mock]').getAttribute('data-screen-mock');
  await shown.getByRole('button', { name: OPEN }).click();
  await expect(page.getByRole('dialog').getByRole('img')).toBeVisible();
  expect(fetched.filter((file) => !file.includes('/phone/'))).toEqual([`/screen-mocks/ar/${mock}.webp`]);
});

test.describe('the whole screen, opened from its crop', () => {
  test.use({ viewport: PHONE });

  async function openWhole(page: Page): Promise<{ opener: Locator; whole: Locator; description: string }> {
    await page.goto('/product');
    const shown = page.locator('#journey .ui').first();
    await shown.scrollIntoViewIfNeeded();
    const description = (await shown.locator('img[data-screen-mock]').getAttribute('alt'))!;
    const opener = shown.getByRole('button', { name: OPEN });
    await opener.click();
    const whole = page.getByRole('dialog', { name: description });
    await expect(whole).toBeVisible();
    return { opener, whole, description };
  }

  test('shows the whole screen over the page, fitted to it, and zooms in to be panned', async ({ page }) => {
    const { whole, description } = await openWhole(page);
    const picture = whole.getByRole('img', { name: description });
    const mock = await page.locator('#journey .ui').first().locator('img[data-screen-mock]').getAttribute('data-screen-mock');
    expect(await drawnFrom(picture)).toBe(`/screen-mocks/ar/${mock}.webp`);

    // Over the whole window, and the whole screen fits across it.
    const cover = (await whole.boundingBox())!;
    expect(cover).toMatchObject({ x: 0, y: 0, width: PHONE.width, height: PHONE.height });
    const fitted = (await picture.boundingBox())!;
    expect(fitted.width).toBeLessThanOrEqual(PHONE.width);
    expect(fitted.width / fitted.height).toBeCloseTo(1440 / 900, 2);

    // Zoomed, it is drawn at its own size and pans inside the cover, not the page.
    const zoom = whole.getByRole('button', { name: 'تكبير' });
    await expect(zoom).toHaveAttribute('aria-pressed', 'false');
    await zoom.click();
    await expect(zoom).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => (await picture.boundingBox())!.width).toBe(1440);
    const view = picture.locator('xpath=..');
    const panned = await view.evaluate((element) => {
      const before = element.scrollLeft;
      element.scrollBy({ left: -300, behavior: 'instant' });
      return { canPan: element.scrollWidth > element.clientWidth, moved: element.scrollLeft !== before };
    });
    expect(panned).toEqual({ canPan: true, moved: true });
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);

    // And back.
    await zoom.click();
    await expect.poll(async () => (await picture.boundingBox())!.width).toBeLessThanOrEqual(PHONE.width);
  });

  test('closes by its button, and the tap target has the focus again', async ({ page }) => {
    const { opener, whole } = await openWhole(page);
    await whole.getByRole('button', { name: 'إغلاق' }).click();
    await expect(whole).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('closes with Escape', async ({ page }) => {
    const { whole } = await openWhole(page);
    await page.keyboard.press('Escape');
    await expect(whole).toBeHidden();
  });

  test('closes with the back gesture, and the visitor is still on the page', async ({ page }) => {
    const { whole } = await openWhole(page);
    const address = page.url();
    await page.goBack();
    await expect(whole).toBeHidden();
    expect(page.url()).toBe(address);
    await expect(page.locator('#journey')).toBeVisible();

    // Closing it by its button leaves no step behind to go back through: going
    // back after that leaves the page, as it would have before it was opened.
    await page.goto('/');
    const again = await openWhole(page);
    await again.whole.getByRole('button', { name: 'إغلاق' }).click();
    await expect(again.whole).toBeHidden();
    // The step comes off a moment after the screen closes, as going back
    // does; a visitor's thumb is never that quick, and the test waits for it.
    await expect.poll(() => page.evaluate(() => Boolean(window.history.state?.screenMockWhole))).toBe(false);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });
});

test('a screen opened the moment another is closed stays open, and leaves no step behind', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/');
  await page.goto('/product');
  const [first, second] = [page.locator('#journey .ui').nth(0), page.locator('#journey .ui').nth(1)];
  await first.scrollIntoViewIfNeeded();
  await first.getByRole('button', { name: OPEN }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Closed, and the next opened at once, before the first's step has come off.
  await second.getByRole('button', { name: OPEN }).evaluate((button: HTMLElement) => {
    document.querySelector<HTMLDialogElement>('dialog[open]')!.close();
    button.click();
  });
  const opened = page.getByRole('dialog', { name: (await second.locator('img[data-screen-mock]').getAttribute('alt'))! });
  await expect(opened).toBeVisible();
  // Still open once everything has landed.
  await page.waitForTimeout(500);
  await expect(opened).toBeVisible();

  // One step for the one screen open: back closes it, and back again leaves.
  await page.goBack();
  await expect(opened).toBeHidden();
  await expect(page).toHaveURL(/\/product$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test('the words on a crop are in the first response, before any script runs', async ({ request }) => {
  for (const path of ['/', '/product']) {
    expect(await (await request.get(path)).text(), path).toContain(OPEN);
  }
});
