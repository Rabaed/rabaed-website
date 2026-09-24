/**
 * Every page, at the two phone widths, never scrolls sideways (ticket 86): at
 * load, all the way down to the foot, and while every swipe surface on it is
 * dragged to either end. The spec asks for "zero horizontal overflow, measured
 * against `clientWidth`" on every page; the section suites check the parts
 * they were written for, and this checks the rest.
 *
 * The routes come from `routes.ts`, so a new page is swept without an edit
 * here. The swipe surfaces are found on the page rather than listed, by the
 * two ways the site lets a visitor move something sideways:
 *
 * - **Dragged** — an element with `touch-action: pan-y`, which keeps
 *   horizontal movement for the page's script: the card decks and the
 *   before-and-after comparison. Dragged by its middle past each edge of the
 *   screen and let go, every frame watched while held, thrown and settling.
 * - **Panned** — a box that scrolls sideways inside itself: a Screen mock's
 *   whole screen, opened from its Phone crop and zoomed in, or a Screen mock
 *   with no crop. Scrolled to its far end and back, every frame watched.
 *
 * With the test database's content every Screen mock on the page shows its
 * Phone crop, so the pans are found in the whole screen a crop opens — the
 * first on each page, since every one is the same component. A replaced
 * screen's pan on the page itself is swiped in `product-text.spec.ts`. A
 * surface of either kind added later is swept here with no edit, and the last
 * two tests fail if the finding stops working.
 *
 * A page that overflows fails with the elements that reach past the edge.
 */
import { test, expect, type Page } from '@playwright/test';
import { sidewaysOverflow, whatOverflows, widestSidewaysOverflow } from './geometry';
import { ROUTES } from './routes';

const PHONES = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
] as const;

type Surface = { readonly id: string; readonly kind: 'dragged' | 'panned'; readonly name: string };

/** Fails, naming what sticks out, if `overflow` is more than nothing. */
async function expectNoOverflow(page: Page, overflow: number, when: string) {
  if (overflow <= 0) return;
  const culprits = await whatOverflows(page);
  expect(
    overflow,
    `${when}: the page scrolls ${overflow}px sideways. ${culprits.length ? `Past the edge: ${culprits.join('; ')}` : 'Nothing sticks out now: whatever did was taken back.'}`,
  ).toBeLessThanOrEqual(0);
}

/**
 * Every swipe surface showing on the page — or in the dialog open over it,
 * which leaves the page behind out of reach — each marked with `data-swept`
 * so it can be found again. Named by the section it sits in, for a failure.
 */
function findSurfaces(page: Page): Promise<Surface[]> {
  return page.evaluate(() => {
    for (const marked of document.querySelectorAll('[data-swept]')) marked.removeAttribute('data-swept');
    const found: Surface[] = [];
    const within = document.querySelector('dialog[open]') ?? document.body;
    for (const element of within.querySelectorAll('*')) {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (box.width === 0 || box.height === 0 || style.visibility === 'hidden') continue;
      const kind =
        style.touchAction === 'pan-y'
          ? 'dragged'
          : /auto|scroll/.test(style.overflowX) && element.scrollWidth > element.clientWidth
            ? 'panned'
            : null;
      if (!kind) continue;
      const id = String(found.length);
      element.setAttribute('data-swept', id);
      const section = element.closest('section[id]');
      const classes = [...element.classList].map((name) => `.${name}`).join('');
      found.push({ id, kind, name: `${section ? `#${section.id} ` : ''}${element.tagName.toLowerCase()}${classes}` });
    }
    return found;
  });
}

/** Scrolls down to the foot a little under a screen at a time, watching each stop. */
async function sweepToFoot(page: Page) {
  for (let stop = 0; stop < 200; stop++) {
    const { top, atFoot } = await page.evaluate(() => {
      window.scrollBy(0, Math.round(window.innerHeight * 0.8));
      const doc = document.documentElement;
      return { top: Math.round(window.scrollY), atFoot: window.scrollY + window.innerHeight >= doc.scrollHeight - 1 };
    });
    // A moment at each stop, and a second at the foot for whatever the last
    // section does as it comes into view.
    await expectNoOverflow(page, await widestSidewaysOverflow(page, atFoot ? 1000 : 100), atFoot ? 'at the foot' : `scrolled ${top}px down`);
    if (atFoot) return;
  }
  throw new Error('the foot of the page was never reached');
}

/** Drags `surface` by its middle 40px past one edge of the screen, and lets go. */
async function drag(page: Page, surface: Surface, edge: 'left' | 'right') {
  const target = page.locator(`[data-swept="${surface.id}"]`);
  await target.scrollIntoViewIfNeeded();
  const box = (await target.boundingBox())!;
  const y = box.y + box.height / 2;
  const x = edge === 'left' ? -40 : page.viewportSize()!.width + 40;
  // Held, carried, let go, and whatever it does after: a thrown card is gone
  // and the pile closed up within 900ms.
  const [widest] = await Promise.all([
    widestSidewaysOverflow(page, 1500),
    (async () => {
      await page.mouse.move(box.x + box.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(x, y, { steps: 10 });
      await page.mouse.up();
    })(),
  ]);
  await expectNoOverflow(page, widest, `${surface.name} dragged past the ${edge} edge`);
}

/** Every surface found, dragged past both edges or panned to both ends. */
async function sweep(page: Page, surfaces: Surface[]) {
  for (const surface of surfaces) {
    if (surface.kind === 'panned') {
      await pan(page, surface);
    } else {
      await drag(page, surface, 'left');
      await drag(page, surface, 'right');
    }
  }
}

/**
 * Opens the whole screen behind the page's first Phone crop, zooms it in, and
 * sweeps what can be swiped there — the Screen mock pan a phone visitor
 * actually meets. Found as the button a whole screen's dialog follows, which
 * holds in either language. Returns what it swept; nothing when the page has
 * no crop.
 */
async function sweepWholeScreen(page: Page): Promise<Surface[]> {
  const opener = page.locator('button:has(+ dialog)').first();
  if ((await opener.count()) === 0) return [];
  await opener.scrollIntoViewIfNeeded();
  await opener.click();
  const whole = page.locator('dialog[open]');
  const zoom = whole.locator('button[aria-pressed]');
  await zoom.click();
  await expect(zoom).toHaveAttribute('aria-pressed', 'true');
  await expect(whole.getByRole('img')).toBeVisible();
  const surfaces = await findSurfaces(page);
  await sweep(page, surfaces);
  await page.keyboard.press('Escape');
  await expect(whole).toHaveCount(0);
  await expectNoOverflow(page, await sidewaysOverflow(page), 'with the whole screen closed');
  return surfaces;
}

/** Scrolls `surface` to its far end and back, as a finger would take it. */
async function pan(page: Page, surface: Surface) {
  const target = page.locator(`[data-swept="${surface.id}"]`);
  await target.scrollIntoViewIfNeeded();
  for (const [share, end] of [[1, 'far'], [0, 'near']] as const) {
    const [widest, reached] = await Promise.all([
      widestSidewaysOverflow(page, 600),
      target.evaluate((element, share) => {
        // Right to left, the rest of the screen is to the left: scrollLeft
        // runs from 0 down to minus the hidden width.
        const hidden = element.scrollWidth - element.clientWidth;
        const towards = getComputedStyle(element).direction === 'rtl' ? -1 : 1;
        element.scrollTo({ left: towards * hidden * share, behavior: 'instant' });
        return Math.abs(Math.abs(element.scrollLeft) - hidden * share) < 2;
      }, share),
    ]);
    expect(reached, `${surface.name} did not pan to its ${end} end`).toBe(true);
    await expectNoOverflow(page, widest, `${surface.name} panned to its ${end} end`);
  }
}

for (const phone of PHONES) {
  test.describe(`at ${phone.width}×${phone.height}`, () => {
    test.use({ viewport: phone });

    for (const { path } of ROUTES) {
      test(`${path} never scrolls sideways, at load, at its foot, or while anything on it is swiped`, async ({ page }) => {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expectNoOverflow(page, await widestSidewaysOverflow(page, 1000), 'at load');

        await sweepToFoot(page);

        await sweep(page, await findSurfaces(page));
        await expectNoOverflow(page, await sidewaysOverflow(page), 'after every swipe');

        await sweepWholeScreen(page);
      });
    }
  });
}

// What the sweep above relies on to find a surface, held to surfaces the site
// is known to have: were the finding to stop working, every page would sweep
// nothing, and pass.

test('the sweep finds the home page’s two card decks and its comparison', async ({ page }) => {
  await page.setViewportSize(PHONES[0]);
  await page.goto('/');

  const dragged = (await findSurfaces(page)).filter((surface) => surface.kind === 'dragged').map((surface) => surface.name.split(' ')[0]);
  expect(dragged.sort()).toEqual(['#ba', '#pain', '#proof']);
});

test('the sweep finds the pan in a zoomed whole screen', async ({ page }) => {
  await page.setViewportSize(PHONES[0]);
  await page.goto('/product');

  expect((await sweepWholeScreen(page)).map((surface) => surface.kind)).toEqual(['panned']);
});
