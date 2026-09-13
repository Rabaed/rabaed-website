/**
 * The product page's «ماذا يرى كل طرف» section (ticket 12): a tab for each of
 * the three parties, and under it what that party sees when it opens Rabaed —
 * a promise, the objection it answers, and the screen.
 *
 * Asserted through what a visitor meets: which tab is selected, which heading
 * and screen can be seen, what a screen reader is told the screen shows, and
 * whether the picture actually arrived.
 */
import { test, expect, type Page } from '@playwright/test';

const ROLES = [
  {
    tab: 'المالك / المطوّر',
    heading: 'لوحة واحدة لكل مشاريعك.',
    mock: 'overview',
    description: 'ما يراه المالك في ربائد: لوحة مشروع واحدة بمؤشرات الاعتمادات وأطراف المشروع',
  },
  {
    tab: 'الاستشاري',
    heading: 'طلبات المقاول في قائمة واحدة.',
    mock: 'approvals-table',
    description: 'ما يراه الاستشاري في ربائد: جدول الاعتمادات والطلبات بحالاتها وتخصصاتها وأنواعها',
  },
  {
    tab: 'المقاول',
    heading: 'طلب واحد بدل خمس رسائل.',
    mock: 'submittal',
    description: 'ما يراه المقاول في ربائد: تفاصيل الطلب وقسم الموافقات باسم كل من تصرّف ووقته',
  },
] as const;

const section = (page: Page) => page.locator('#roles');
const tab = (page: Page, index: number) => section(page).getByRole('tab', { name: ROLES[index].tab, exact: true });
const heading = (page: Page, index: number) => section(page).getByRole('heading', { name: ROLES[index].heading });
const screen = (page: Page, index: number) => section(page).getByRole('img', { name: ROLES[index].description });
const caption = (page: Page, index: number) => section(page).getByText(ROLES[index].description, { exact: true });

/** One party chosen, its promise, screen and caption showing, and nobody else's. */
async function expectShowing(page: Page, chosen: number) {
  for (const index of ROLES.keys()) {
    await expect(tab(page, index)).toHaveAttribute('aria-selected', index === chosen ? 'true' : 'false');
    for (const thing of [heading(page, index), screen(page, index), caption(page, index)]) {
      if (index === chosen) await expect(thing).toBeVisible();
      else await expect(thing).toBeHidden();
    }
  }
}

test('every party is in the first response', async ({ request }) => {
  const html = await (await request.get('/product')).text();

  expect(html).toContain('ماذا يرى كل طرف حين يفتح المنصة؟');
  for (const role of ROLES) {
    expect(html).toContain(role.tab);
    expect(html).toContain(role.heading);
    expect(html).toContain(`alt="${role.description}"`);
  }
  // The promises every party shares, under whichever is chosen.
  expect(html).toContain('يدعم الإنجليزية للفرق غير العربية');
});

test('opens on the Owner, with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/product');

  await expectShowing(page, 0);

  await context.close();
});

test('a click chooses a party', async ({ page }) => {
  await page.goto('/product');
  await section(page).scrollIntoViewIfNeeded();

  for (const index of [1, 2, 0, 2]) {
    await tab(page, index).click();
    await expectShowing(page, index);
  }
});

test('the arrow keys move between parties, and wrap round', async ({ page }) => {
  await page.goto('/product');

  await tab(page, 0).focus();
  // Reading right to left, the next party is to the left.
  await page.keyboard.press('ArrowLeft');
  await expect(tab(page, 1)).toBeFocused();
  await expectShowing(page, 1);

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 2)).toBeFocused();
  await expectShowing(page, 2);
});

test('every screen is the exported picture, described by its caption', async ({ page }) => {
  await page.goto('/product');
  await section(page).scrollIntoViewIfNeeded();

  for (const [index, role] of ROLES.entries()) {
    await tab(page, index).click();
    const picture = screen(page, index);

    await expect
      .poll(() => picture.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), {
        message: `${role.mock} never loaded`,
      })
      .toBe(true);

    const source = await picture.evaluate((image: HTMLImageElement) => decodeURIComponent(image.currentSrc));
    expect(source).toContain(`/screen-mocks/ar/${role.mock}.webp`);
    await expect(caption(page, index)).toHaveText(role.description);

    // Under the screen it describes.
    const [shot, words] = [await picture.boundingBox(), await caption(page, index).boundingBox()];
    expect(words!.y).toBeGreaterThanOrEqual(shot!.y + shot!.height - 1);
  }
});

test('on a phone the screen is shown full size, to be panned across', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/product');
  await section(page).scrollIntoViewIfNeeded();

  expect((await screen(page, 0).boundingBox())?.width).toBe(1040);
  const panned = await screen(page, 0).evaluate((image) => {
    const window = image.parentElement!;
    const before = window.scrollLeft;
    window.scrollBy({ left: -300 });
    return { canPan: window.scrollWidth > window.clientWidth, moved: window.scrollLeft !== before };
  });
  expect(panned).toEqual({ canPan: true, moved: true });
});
