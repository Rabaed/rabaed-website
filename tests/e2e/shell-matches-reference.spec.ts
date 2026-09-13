/**
 * "Header and footer match the Reference site at all eight widths" (ticket 04),
 * measured rather than eyeballed.
 *
 * It compares the rebuilt shell against the Reference page itself, in the same
 * browser, at the same moment — position and size of every part, and the
 * colours and type it is drawn in.
 *
 * **Why not a pixel diff against `tests/baselines/`.** That was tried first and
 * it does not work here, for two reasons. The baselines are whole-page images,
 * so a crop has to be cut from them by rounding, and the footer lands on a
 * different sub-pixel boundary in a 7,480px page than in a 1,200px one — every
 * glyph then differs by antialiasing alone and the comparison says nothing.
 * And a pixel diff cannot run on a hosted runner at all, because text
 * rasterises differently there.
 *
 * Geometry has neither problem. It is exact, it names the element and the
 * number when it fails, and it is the same on any machine — so unlike the
 * image baselines, this one can run in CI. It found a real difference on its
 * first run: below 560px the footer was 20px taller than the Reference site's,
 * because `.wrap { padding: 0 20px }` is shorthand and has to come after
 * `.foot-bar`'s own padding in the cascade to erase it (see `responsive.css`).
 *
 * It compares the shell in each of its states — as it loads, over a light
 * section, with the mobile panel open, and both at once — because otherwise
 * every `.nav.on-light` and `.nav.open` rule, which is a second palette and
 * the whole appearance of the panel, would go unmeasured.
 *
 * Selecting by class name is deliberate here. Everywhere else these tests go
 * through what a visitor can see; this one is comparing two documents that are
 * meant to be the same document, and the Reference site's class names are the
 * only names both of them share.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  freezeTransitions,
  openReferencePage,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

/** The eight widths the visual baselines were captured at (ticket 02). */
const WIDTHS = [360, 390, 768, 820, 1024, 1280, 1440, 1600];

/**
 * Everything measured, relative to its region. Both documents carry all of
 * these, and both are on their home page, so the active link is the same one.
 */
const HEADER_PARTS = [
  '.nav > .wrap',
  '.brand',
  '.brand .lg.d',
  '.brand .lg.l',
  '.links',
  '.links > a:nth-child(1)',
  '.links > a:nth-child(2)',
  '.links > a:nth-child(3)',
  '.nsub',
  '.nsub-t',
  '.nsub-p',
  '.nav-cta',
  '.login',
  '.nav-cta .btn.p',
  '.navtog',
  '.mnav',
  '.mnav .wrap',
  '.mnav .msub',
  '.mnav .mlogin',
];

const FOOTER_PARTS = [
  'footer > .wrap',
  '.brand.foot',
  '.brand.foot .lg',
  '.social',
  '.social a:nth-child(1)',
  '.social a:nth-child(5)',
  '.foot-bar',
  '.foot-legal',
  '.foot-legal a:nth-child(1)',
  '.foot-legal a:nth-child(2)',
];

/**
 * The one part of the footer the rebuild deliberately draws differently.
 *
 * The Reference site wraps the whole copyright line in `.mono`, which sets DM
 * Mono — a face with no Arabic glyphs — so its Arabic falls through to the
 * browser's last-resort serif. The spec forbids exactly that, so the rebuild
 * puts only the year in `.mono`. Different fonts mean a different width, so
 * the line is measured for the row it occupies and its height, and nothing
 * more. See `src/components/site-footer.tsx`.
 */
const DIVERGENT = '.foot-bar > div:last-child';

/**
 * The states the shell has. Comparing only the one a page loads in would leave
 * every `.nav.on-light` and `.nav.open` rule unchecked — a whole second
 * palette, and the mobile panel's entire appearance.
 *
 * They are set by adding the classes rather than by scrolling and clicking,
 * because what is being compared here is two stylesheets. The behaviour that
 * puts those classes on, and the inline colours that come with `on-light`,
 * are asserted in `page-shell.spec.ts`.
 */
const STATES: Record<string, readonly string[]> = {
  'as it loads': [],
  'over a light section': ['on-light'],
  'with the mobile panel open': ['open'],
  'light, with the mobile panel open': ['on-light', 'open'],
};

/**
 * With the panel open, its height is the second deliberate divergence: the
 * Reference site's stops at its 360px cap with the sign-in button cut in half,
 * and the rebuild's runs to the full 396.19px of content (see
 * `src/styles/shell.css`). That difference, and the header height that
 * contains it, are the two numbers this comparison must not hold to the
 * Reference site. Everything else about the open panel still is — where each
 * item sits inside it, and every colour and typeface it is drawn in.
 */
function dropOpenPanelHeights(measurement: Record<string, unknown>) {
  for (const key of ['self', '.mnav']) {
    const part = measurement[key];
    if (part && typeof part === 'object') delete (part as Record<string, unknown>).height;
  }
  return measurement;
}

async function setState(page: Page, classes: readonly string[]) {
  await page.evaluate((classes) => {
    const nav = document.querySelector('.nav')!;
    nav.classList.remove('on-light', 'open');
    nav.classList.add(...classes);
    // The dropdown is compared open throughout: closed, its panel is
    // `visibility: hidden` and every rule inside it goes unmeasured.
    document.querySelector('.nav .nsub')?.classList.add('open');
  }, [...classes]);
}

async function measure(page: Page, region: string, parts: readonly string[]) {
  return page.evaluate(
    ({ region, parts, divergent }: { region: string; parts: string[]; divergent: string | null }) => {
      const root = document.querySelector(region)!;
      const origin = root.getBoundingClientRect();
      const round = (n: number) => Math.round(n * 100) / 100;

      const of = (element: Element, rowOnly = false) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        // A deliberately different width also lands in a different place once
        // the footer centres itself below 700px, so the divergent line is held
        // to the row it occupies and the height it takes.
        if (rowOnly) return { top: round(box.top - origin.top), height: round(box.height) };
        return {
          top: round(box.top - origin.top),
          left: round(box.left - origin.left),
          height: round(box.height),
          width: round(box.width),
          color: style.color,
          background: style.backgroundColor,
          // All four edges: the header's own rule is a `border-bottom`, so
          // reading only the top would have made a wrong header border
          // invisible to this comparison.
          borderColor: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(' '),
          font: `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${style.fontFamily}`,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
        };
      };

      const result: Record<string, unknown> = { self: of(root) };
      if (divergent) {
        const element = root.querySelector(divergent);
        result[divergent] = element ? of(element, true) : null;
      }
      for (const part of parts) {
        const element = root.querySelector(part);
        result[part] = element ? of(element) : null;
      }
      return result;
    },
    { region, parts: [...parts], divergent: region === 'footer' ? DIVERGENT : null },
  );
}

test.describe('the shell matches the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const width of WIDTHS) {
    test(`header and footer at ${width}px`, async ({ browser, baseURL }) => {
      const viewport = { width, height: 900 };
      const referenceContext = await browser.newContext({ viewport });
      const rebuiltContext = await browser.newContext({ viewport });

      try {
        const reference = await referenceContext.newPage();
        await openReferencePage(reference, site, 'index.html');
        await freezeTransitions(reference);

        const rebuilt = await rebuiltContext.newPage();
        await rebuilt.goto(baseURL!);
        await rebuilt.evaluate(() => document.fonts.ready);
        await freezeTransitions(rebuilt);

        for (const [state, classes] of Object.entries(STATES)) {
          await setState(reference, classes);
          await setState(rebuilt, classes);

          const open = classes.includes('open');
          const shape = (m: Record<string, unknown>) => (open ? dropOpenPanelHeights(m) : m);

          expect(shape(await measure(rebuilt, '.nav', HEADER_PARTS)), `header ${state}`).toEqual(
            shape(await measure(reference, '.nav', HEADER_PARTS)),
          );
        }

        expect(await measure(rebuilt, 'footer', FOOTER_PARTS), 'footer').toEqual(
          await measure(reference, 'footer', FOOTER_PARTS),
        );
      } finally {
        await referenceContext.close();
        await rebuiltContext.close();
      }
    });
  }
});
