/**
 * What a phone shows of one Screen mock, for the suites that replace a screen
 * or upload its Phone crop in a draft and look at it in the preview (tickets
 * 78 and 79): the Arabic pages' in `product-text.spec.ts`, the English pages'
 * in `english-pages.spec.ts`.
 *
 * A phone shows each language's uploaded Phone crop if there is one; otherwise
 * the exported crop, while the screen's picture is not replaced; otherwise the
 * replaced picture whole, to swipe. A crop, either kind, is a button that opens
 * the language's current whole screen.
 */
import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { PHONE_CROP } from '../../src/screen-mocks/registry';

/**
 * The file a picture was actually drawn from: `/screen-mocks/ar/phone/kanban.webp`
 * for an export, which `next/image` serves under an address of its own, and
 * the CMS's own address for an upload.
 */
export async function drawnFrom(picture: Locator): Promise<string> {
  await expect.poll(() => picture.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  const url = new URL(await picture.evaluate((image: HTMLImageElement) => image.currentSrc));
  return url.pathname === '/_next/image' ? url.searchParams.get('url')! : url.pathname;
}

/** Every address the CMS serves an uploaded image at: the upload itself, and each copy it made of it. */
export async function mediaFiles(editor: APIRequestContext, id: number): Promise<string[]> {
  const response = await editor.get(`/api/media/${id}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  const image: { url: string; sizes?: Record<string, { url?: string | null }> } = await response.json();
  return [image.url, ...Object.values(image.sizes ?? {}).map((copy) => copy.url)]
    .filter((url): url is string => !!url)
    .map((url) => decodeURI(new URL(url, 'http://cms').pathname));
}

/** The frame in a section that one Screen mock stands in: `#journey .ui` holding the correspondence screen. */
export function frameShowing(page: Page, frames: string, mock: string): Locator {
  return page.locator(frames).filter({ has: page.locator(`img[data-screen-mock="${mock}"]`) }).first();
}

/**
 * On a phone, the mock in `frame` is a Phone crop drawn from one of `crop`'s
 * files, in the crop's shape; its button opens the whole screen, drawn from
 * one of `whole`'s; and Escape closes it again.
 */
export async function expectPhoneCrop(
  page: Page,
  frame: Locator,
  { crop, whole, open }: { crop: readonly string[]; whole: readonly string[]; open: string },
): Promise<void> {
  await frame.scrollIntoViewIfNeeded();
  const picture = frame.locator('img[data-screen-mock]');
  const mock = await picture.getAttribute('data-screen-mock');
  expect(crop, `${mock}: the picture a phone is shown`).toContain(await drawnFrom(picture));
  await expect(picture).toHaveAttribute('data-phone-crop', '');
  const box = (await picture.boundingBox())!;
  expect(box.width / box.height, `${mock}: drawn in the crop's shape`).toBeCloseTo(PHONE_CROP.width / PHONE_CROP.height, 2);

  const description = (await picture.getAttribute('alt'))!;
  await frame.getByRole('button', { name: open }).click();
  const opened = page.getByRole('dialog', { name: description });
  await expect(opened).toBeVisible();
  expect(whole, `${mock}: the whole screen its crop opens`).toContain(await drawnFrom(opened.getByRole('img')));
  await page.keyboard.press('Escape');
  await expect(opened).toBeHidden();
}

/**
 * On a phone, the mock in `frame` is its whole picture, drawn from one of
 * `whole`'s files, 1040px wide to swipe across, with ticket 77's hint and
 * nothing to tap.
 */
export async function expectWholeToSwipe(frame: Locator, { whole, hint }: { whole: readonly string[]; hint: string }): Promise<void> {
  await frame.scrollIntoViewIfNeeded();
  const picture = frame.locator('img[data-screen-mock]');
  const mock = await picture.getAttribute('data-screen-mock');
  expect(whole, `${mock}: the picture a phone is shown`).toContain(await drawnFrom(picture));
  await expect(picture).not.toHaveAttribute('data-phone-crop');
  expect((await picture.boundingBox())?.width, `${mock}: drawn to be swiped across`).toBe(1040);
  await expect(frame.getByRole('button')).toHaveCount(0);
  await expect(frame.locator('.pan-hint')).toHaveText(hint);
  await expect(frame.locator('.pan-hint')).toBeVisible();
}
