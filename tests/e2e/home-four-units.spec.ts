/**
 * The home page's four-units section (ticket 08): five tabs, and beside them
 * the app screen for whichever is chosen.
 *
 * Asserted through what a visitor meets: which tab is selected, which screen a
 * screen reader is given, which caption can be read and where it sits, whether
 * the picture actually arrived, and whether a phone can pan across it.
 *
 * Whether it *looks* like the Reference site is asked in
 * `home-four-units-match-reference.spec.ts`.
 */
import { test, expect, type Locator, type Page } from '@playwright/test';
import { sidewaysOverflow } from './geometry';

/** The tabs in order, and what each one's screen is described as. */
const UNITS = [
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

const section = (page: Page) => page.locator('#jt');
const tab = (page: Page, index: number) => section(page).getByRole('tab', { name: UNITS[index].title });
const screen = (page: Page, index: number) => section(page).getByRole('img', { name: UNITS[index].description });
const caption = (page: Page, index: number) => section(page).getByText(UNITS[index].description, { exact: true });

/** One tab chosen, its screen and caption showing, and nothing else's. */
async function expectShowing(page: Page, chosen: number) {
  for (const index of UNITS.keys()) {
    await expect(tab(page, index)).toHaveAttribute('aria-selected', index === chosen ? 'true' : 'false');
  }
  await expect(screen(page, chosen)).toBeVisible();
  await expect(caption(page, chosen)).toBeVisible();
  for (const index of UNITS.keys()) {
    if (index === chosen) continue;
    await expect(screen(page, index)).toBeHidden();
    await expect(caption(page, index)).toBeHidden();
  }
}

/**
 * Whether a picture has actually arrived. One that failed to load still has a
 * box and an `alt`, so neither of those says the visitor saw anything.
 */
function hasArrived(picture: Locator) {
  return picture.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0);
}

test('the whole section is in the first response', async ({ request }) => {
  const html = await (await request.get('/')).text();

  expect(html).toContain('أربع وحدات. سجل واحد يجمعها.');
  expect(html).toContain('شاهد الوحدات كاملة بالتفصيل');
  expect(html).toContain('href="/product"');
  for (const unit of UNITS) {
    expect(html).toContain(unit.title);
    // Every screen's description, as its `alt` — present for all five, not
    // only the one showing, so nothing a crawler reads depends on a click.
    expect(html).toContain(`alt="${unit.description}"`);
  }
});

test('opens on the first unit, with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();

  await expectShowing(page, 0);

  await context.close();
});

test('a click chooses a unit', async ({ page }) => {
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();

  for (const index of [2, 4, 1, 0, 3]) {
    await tab(page, index).click();
    await expectShowing(page, index);
  }
});

test('the pointer arriving over a tab chooses it', async ({ page }) => {
  await page.goto('/');

  await tab(page, 3).hover();
  await expectShowing(page, 3);
});

test('the arrow keys move between units, and wrap round', async ({ page }) => {
  await page.goto('/');

  await tab(page, 0).focus();
  // Reading right to left, the next unit is to the left.
  await page.keyboard.press('ArrowLeft');
  await expect(tab(page, 1)).toBeFocused();
  await expectShowing(page, 1);

  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 0)).toBeFocused();
  await expectShowing(page, 0);

  // Back from the first is the last.
  await page.keyboard.press('ArrowRight');
  await expect(tab(page, 4)).toBeFocused();
  await expectShowing(page, 4);
});

test('every screen is the exported picture, described by its caption', async ({ page }) => {
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();

  for (const [index, unit] of UNITS.entries()) {
    await tab(page, index).click();
    const picture = screen(page, index);

    await expect.poll(() => hasArrived(picture), { message: `${unit.mock} never loaded` }).toBe(true);

    // It is ticket 05's export, not markup rebuilt in the page.
    const source = await picture.evaluate((image: HTMLImageElement) => decodeURIComponent(image.currentSrc));
    expect(source).toContain(`/screen-mocks/ar/${unit.mock}.webp`);

    // ADR-0002: what the picture shows is said again in words a crawler can
    // read, and the words are the same.
    await expect(caption(page, index)).toHaveText(unit.description);
  }
});

// The short window is the case that matters: there the screen is narrower than
// its column, so a caption centred on the column would sit off to one side of
// the picture it describes.
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 550 },
  { width: 390, height: 900 },
]) {
  test(`the caption sits centred under the screen at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await section(page).scrollIntoViewIfNeeded();

    const placed = await section(page).evaluate((root) => {
      const stage = root.querySelector('.jt-stage')!.getBoundingClientRect();
      const showing = [...root.querySelectorAll<HTMLElement>('.jt-hint')].find((hint) => !hint.hidden)!;
      // The words themselves, not the box around them: a full-width box is
      // centred wherever its text happens to be.
      const range = document.createRange();
      range.selectNodeContents(showing);
      const words = range.getBoundingClientRect();
      return {
        offCentre: Math.abs((words.left + words.right) / 2 - (stage.left + stage.right) / 2),
        belowTheScreen: words.top >= stage.bottom,
        withinItsWidth: words.left >= stage.left - 0.5 && words.right <= stage.right + 0.5,
      };
    });

    expect(placed.offCentre, 'the caption is off-centre under the screen').toBeLessThan(2);
    expect(placed.belowTheScreen).toBe(true);
    expect(placed.withinItsWidth).toBe(true);
  });
}

test('the screen keeps its place while the picture is still on its way', async ({ page }) => {
  // Every picture is held back for two seconds, so the page is measured
  // before and after it arrives. A box that grew when the picture landed would
  // shove everything below it down the page.
  await page.route('**/_next/image**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await route.continue();
  });
  await page.goto('/');

  const stage = section(page).locator('.jt-stage');
  const footer = section(page).locator('.tz-foot');
  await section(page).scrollIntoViewIfNeeded();

  const before = { stage: await stage.boundingBox(), footer: await footer.boundingBox() };
  await expect.poll(() => hasArrived(screen(page, 0)), { timeout: 10_000 }).toBe(true);
  const after = { stage: await stage.boundingBox(), footer: await footer.boundingBox() };

  expect(after.stage?.height).toBe(before.stage?.height);
  expect(after.footer?.y).toBe(before.footer?.y);
});

test('on a phone the screen is its Phone crop, drawn whole across the column', async ({ page }) => {
  // Squeezing 1440px of interface into 350 is unreadable. Tickets 08 and 12
  // drew it 1040px wide to be panned across; ticket 78 shows the part that
  // matters instead, whole, and a tap opens the rest (`phone-crops.spec.ts`).
  // A replaced screen, which has no crop, still pans (`product-text.spec.ts`).
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();

  const stage = section(page).locator('.jt-stage');
  const [shot, column] = [await screen(page, 0).boundingBox(), await stage.boundingBox()];
  expect(shot?.width).toBe(column?.width);
  expect(shot!.width / shot!.height).toBeCloseTo(520 / 650, 2);
  expect(await stage.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(0);
  expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('a chosen screen is there at once, without fading in', async ({ page }) => {
    await page.goto('/');
    await section(page).scrollIntoViewIfNeeded();

    await tab(page, 2).click();
    const panel = section(page).locator('#jt-panel-2');
    expect(await panel.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
    await expectShowing(page, 2);
  });
});
