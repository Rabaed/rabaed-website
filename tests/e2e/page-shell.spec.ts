/**
 * The frame every page sits in: header, footer, mobile panel, Partnerships
 * dropdown, and the header recolouring itself as it crosses from a dark
 * section to a light one (ticket 04).
 *
 * These assert what a visitor can observe — a link they can reach, a panel
 * that is not clipped, a header they can still read — rather than which
 * classes are set. The one exception is the header's colours, where the
 * ticket's requirement *is* the exact value.
 */
import { test, expect, type Page } from '@playwright/test';

/** Every destination the header offers, desktop and mobile alike. */
const NAV_LINKS = [
  { label: 'الرئيسية', href: '/' },
  { label: 'المنتج', href: '/product' },
  { label: 'ابدأ', href: '/start' },
  { label: 'برنامج الإحالة', href: '/referral' },
  { label: 'برنامج الشراكات', href: '/partnership' },
];

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 980, height: 900 };

/** The Reference site's two header treatments, to the value. */
const HEADER_OVER_DARK = {
  background: 'rgba(20, 22, 28, 0.72)',
  color: 'rgb(237, 238, 243)',
  borderBottomColor: 'rgba(255, 255, 255, 0.08)',
};
const HEADER_OVER_LIGHT = {
  background: 'rgba(250, 250, 248, 0.8)',
  color: 'rgb(34, 34, 34)',
  borderBottomColor: 'rgb(227, 225, 220)',
};

async function headerTreatment(page: Page) {
  return page.locator('.nav').evaluate((nav) => {
    const style = getComputedStyle(nav);
    return {
      background: style.backgroundColor,
      color: style.color,
      borderBottomColor: style.borderBottomColor,
    };
  });
}

test.describe('the page shell', () => {
  test('header and footer are in the server response', async ({ request }) => {
    const html = await (await request.get('/')).text();

    for (const link of NAV_LINKS) {
      expect(html).toContain(link.label);
      expect(html).toContain(`href="${link.href}"`);
    }
    expect(html).toContain('الشروط والأحكام');
    expect(html).toContain('سياسة الخصوصية');
  });

  test('the header stays above the page as it scrolls', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const top = async () => (await page.locator('.nav').boundingBox())!.y;
    expect(await top()).toBe(0);

    await page.evaluate(() => window.scrollTo(0, 1200));
    expect(await top()).toBe(0);
  });
});

test.describe('the Partnerships dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
  });

  test('starts closed', async ({ page }) => {
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'false');
    // In the dropdown: the Footer directory shows the same link, and always
    // has it showing (ticket 75).
    await expect(page.locator('.nsub-p').getByRole('link', { name: /برنامج الإحالة/ })).toBeHidden();
  });

  test('closes on a second click, having opened when the pointer arrived', async ({ page }) => {
    // A mouse opens it on the way in, so the click that follows is the one
    // that closes it again. Tapping is the case where a click opens it.
    await page.locator('.nsub').hover();
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'true');

    await page.locator('.nsub-t').click();
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens on a tap, where there is no hover to open it first', async ({ browser }) => {
    const context = await browser.newContext({ viewport: DESKTOP, hasTouch: true });
    const page = await context.newPage();
    await page.goto('/');

    await page.locator('.nsub-t').tap();
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.nsub-p').getByRole('link', { name: /برنامج الإحالة/ })).toBeVisible();

    await context.close();
  });

  test('opens on hover', async ({ page }) => {
    await page.locator('.nsub').hover();
    await expect(page.locator('.nsub-p').getByRole('link', { name: /برنامج الشراكات/ })).toBeVisible();
  });

  test('opens from the keyboard and closes on Escape', async ({ page }) => {
    await page.locator('.nsub-t').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'true');

    // Tab reaches the entries rather than skipping past the panel. It has to
    // be visible first: while it is still `visibility:hidden` its links are
    // not in the tab order at all, so tabbing early would jump past them and
    // the test would be measuring the transition rather than the markup.
    await expect(page.locator('.nsub-p a').first()).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('.nsub-p a').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes when the click lands elsewhere', async ({ page }) => {
    await page.locator('.nsub').hover();
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'true');

    await page.locator('h1').click();
    await expect(page.locator('.nsub-t')).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('the mobile panel', () => {
  // 1100px, and 981px until ticket 40: the language switcher did not fit in a
  // row that was already full at the longest words the CMS allows, so the row
  // gives way to the panel earlier instead (ADR-0015). Both sides of the
  // boundary are asserted, because a breakpoint written in one place and
  // believed in another is how the row and the panel both went missing once.
  test('replaces the desktop links at 1099px and not at 1100px', async ({ page }) => {
    await page.goto('/');

    await page.setViewportSize({ width: 1100, height: 900 });
    await expect(page.locator('.navtog')).toBeHidden();
    await expect(page.locator('.links')).toBeVisible();

    await page.setViewportSize({ width: 1099, height: 900 });
    await expect(page.locator('.navtog')).toBeVisible();
    await expect(page.locator('.links')).toBeHidden();

    await page.setViewportSize(MOBILE);
    await expect(page.locator('.navtog')).toBeVisible();
    await expect(page.locator('.links')).toBeHidden();
  });

  for (const width of [360, 980]) {
  test(`opens fully at ${width}px, showing every link inside the panel`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    await page.locator('.navtog').click();
    await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'true');

    const panel = page.locator('.mnav');

    // The panel opens by animating `max-height` to a fixed cap, and it clips
    // whatever does not fit under it — which is how the Reference site cuts
    // its own sign-in button in half. So "opens fully" is: once the animation
    // has settled, nothing is left outside the box. Add a link without raising
    // the cap and this is the assertion that notices.
    await expect
      .poll(
        () => panel.evaluate((el) => el.scrollHeight - el.clientHeight),
        { message: 'the open panel still clips its own content' },
      )
      .toBeLessThanOrEqual(0);

    for (const link of NAV_LINKS) {
      await expect(panel.getByRole('link', { name: link.label, exact: true })).toBeVisible();
    }
    await expect(panel.getByRole('link', { name: 'تسجيل الدخول' })).toBeVisible();
  });
  }

  test('closes on Escape', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await page.locator('.navtog').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes behind you when you follow a link', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await page.locator('.navtog').click();
    // The home link, so the panel is the only thing that changes: without
    // this the panel would still be open on the page you arrive at.
    await page.locator('.mnav').getByRole('link', { name: 'الرئيسية', exact: true }).click();

    await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'false');
  });
});

/**
 * Where ticket 76 departs from the Reference site's panel, by the founder's
 * decision of 23 September 2026 (ADR-0020): Login and the language on one row,
 * and the page behind the open panel dimmed, held still, and a tap away from
 * closing it.
 */
test.describe('the mobile panel, as ticket 76 draws it', () => {
  const PHONE = { width: 390, height: 812 };

  test('puts Login on the right and English on the left of one row, under the links', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');
    await page.locator('.navtog').click();

    const panel = page.locator('.mnav');
    const login = await panel.getByRole('link', { name: 'تسجيل الدخول' }).boundingBox();
    const language = await panel.getByRole('link', { name: 'English' }).boundingBox();
    const lastLink = await panel.locator('.msub a').last().boundingBox();
    const inside = await panel.locator('.wrap').evaluate((wrap) => {
      const box = wrap.getBoundingClientRect();
      const style = getComputedStyle(wrap);
      return box.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    });

    // One row: the two share a middle line, and both are under the links.
    expect(Math.abs(login!.y + login!.height / 2 - (language!.y + language!.height / 2))).toBeLessThan(2);
    expect(login!.y).toBeGreaterThanOrEqual(lastLink!.y + lastLink!.height);
    // Right to left, as Arabic reads: Login first, on the right.
    expect(login!.x).toBeGreaterThan(language!.x + language!.width);
    // A button sized to its words, not the full-width pill the Reference site draws.
    expect(login!.width).toBeLessThan(inside / 2);

    // The language link no longer reads as one more menu link.
    await expect(panel.locator('.mlang')).toHaveCSS('border-top-width', '0px');
    await expect(panel.locator('.mlang svg')).toBeVisible();
  });

  test('dims the page behind it and holds it still, and closing puts it back where it was', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600);

    await page.locator('.navtog').click();
    await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'true');

    // What lies under a point below the panel is the dimming, not the page.
    const below = { x: PHONE.width / 2, y: PHONE.height - 40 };
    await expect
      .poll(() =>
        page.evaluate(({ x, y }) => {
          const top = document.elementFromPoint(x, y);
          return top ? { dim: top.classList.contains('mscrim'), opacity: getComputedStyle(top).opacity } : null;
        }, below),
      )
      .toEqual({ dim: true, opacity: '1' });

    // A wheel or a swipe over it scrolls nothing.
    await page.mouse.move(below.x, below.y);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(600);

    await page.keyboard.press('Escape');
    await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => window.scrollY)).toBe(600);

    // And once it is closed the page scrolls again.
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  });

  test('closes when the dimmed page is tapped, and the tap reaches nothing under it', async ({ browser }) => {
    const context = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await page.locator('.navtog').tap();
      await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.mscrim')).toHaveCSS('opacity', '1');

      await page.touchscreen.tap(PHONE.width / 2, PHONE.height - 40);
      await expect(page.locator('.navtog')).toHaveAttribute('aria-expanded', 'false');
      await expect(page).toHaveURL(/\/$/);
    } finally {
      await context.close();
    }
  });

  test('changes nothing at 1100px and up', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.goto('/');
    // Even with the panel's class left on — as it would be by a tablet turned
    // sideways, a moment before the resize listener closes it — the row is
    // what shows, and neither the dimming nor the hold reaches past 1099px.
    await page.locator('.nav').evaluate((nav) => nav.classList.add('open'));
    await expect(page.locator('.mscrim')).toBeHidden();
    await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
  });
});

test.describe('the header colour toggle', () => {
  test('is dark over a dark section and light over a light one', async ({ page }) => {
    // 700px tall: one of the spec's height breakpoints, and short enough that
    // the page as it stands today can scroll its light section under the
    // header. That constraint disappears as tickets 06-11 lengthen the page.
    await page.setViewportSize({ width: 1280, height: 700 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    expect(await headerTreatment(page)).toEqual(HEADER_OVER_DARK);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(() => headerTreatment(page), { message: 'header did not turn light' })
      .toEqual(HEADER_OVER_LIGHT);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect
      .poll(() => headerTreatment(page), { message: 'header did not turn back dark' })
      .toEqual(HEADER_OVER_DARK);
  });
});

test.describe('layout integrity', () => {
  // The breakpoint contract from the spec, plus the widths the baselines use.
  const WIDTHS = [360, 390, 400, 560, 620, 640, 680, 700, 768, 820, 980, 981, 1024, 1280, 1440, 1600];

  for (const width of WIDTHS) {
    test(`no sideways scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      // Measured against clientWidth: the Reference site clips overflow
      // deliberately, which makes scrollWidth useless here (spec).
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - doc.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
