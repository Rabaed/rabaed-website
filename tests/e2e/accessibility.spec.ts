/**
 * The site read with a screen reader and driven from a keyboard (ticket 36).
 *
 * Four things are asked of every page, and each fails in its own way:
 *
 *  1. **axe finds nothing.** The automated pass the spec asks for
 *     (spec: Accessibility), held to WCAG 2.1 A and AA — which is where
 *     colour contrast lives, including the muted greys the dark sections are
 *     full of.
 *  2. **Every picture says what it is.** `alt` present on every image, and
 *     non-empty on every Screen mock, because a mock *is* the explanation of
 *     a screen nobody can see (ADR-0002).
 *  3. **Everything can be reached and operated from the keyboard, visibly.**
 *     Tab reaches every control the page offers, and each one looks different
 *     while it holds focus.
 *  4. **Turning motion down leaves the page whole.** Not "the animations
 *     stop" — the sentences the animation would have revealed are still
 *     there, and still readable.
 *
 * axe is run against the page as it arrives, before anything is scrolled:
 * what a visitor meets. The states behind a click belong to the suites that
 * open them.
 */
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './routes';
import { SCREEN_MOCKS } from '../../src/screen-mocks/registry';

/**
 * The standard the ticket names. `wcag21aa` carries the contrast rule;
 * `best-practice` is deliberately left out, so that what fails here is a
 * standard somebody can be held to rather than axe's own house style.
 */
const STANDARD = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * The one combination the founder kept as it is (ADR-0011): white lettering on
 * the brand accent, which is what the primary button — and the chips that share
 * its treatment — are made of. It reaches 3.25:1 where AA asks 4.5:1, and the
 * only ways to close that are to darken the brand orange on every page or to
 * set every button label at 18.66px bold. The accent as *text* was darkened
 * instead, and this pair was left.
 *
 * Listed as a pair rather than by turning the rule off, so that any other
 * colour that falls short — a new one, or one of these on a different ground —
 * still fails here.
 */
const ACCEPTED = [{ foreground: '#ffffff', background: '#f95738' }];

/** Whether axe's account of one element is the accepted pair and nothing else. */
function accepted(failureSummary: string | undefined): boolean {
  return ACCEPTED.some(
    (pair) =>
      failureSummary?.includes(`foreground color: ${pair.foreground}, background color: ${pair.background}`) ?? false,
  );
}

/** The rule, the elements and the fix, rather than a count. */
function describeViolations(violations: { id: string; impact?: string | null; help: string; nodes: { target: unknown[]; failureSummary?: string }[] }[]): string {
  return violations
    .map((violation) => {
      const where = violation.nodes.map(
        (node) => `      ${node.target.join(' ')}\n        ${node.failureSummary?.replace(/\n/g, '\n        ')}`,
      );
      return `  ${violation.id} (${violation.impact}): ${violation.help}\n${where.join('\n')}`;
    })
    .join('\n');
}

for (const route of ROUTES) {
  test(`${route.path} passes the automated accessibility checks`, async ({ page }) => {
    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);

    const { violations } = await new AxeBuilder({ page }).withTags(STANDARD).analyze();

    const unaccepted = violations
      .map((violation) => ({ ...violation, nodes: violation.nodes.filter((node) => !accepted(node.failureSummary)) }))
      .filter((violation) => violation.nodes.length > 0);

    expect(describeViolations(unaccepted), `${route.path} has accessibility violations`).toBe('');
  });
}

for (const route of ROUTES) {
  test(`every image on ${route.path} has alt text`, async ({ page }) => {
    await page.goto(route.path);

    // Present, not merely non-empty: an empty `alt` is how a picture says it
    // is decoration and should be passed over, and several here are. A
    // *missing* one leaves a screen reader reading out a file name.
    const missing = await page
      .locator('img:not([alt])')
      .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src));

    expect(missing, `images with no alt attribute on ${route.path}`).toEqual([]);
  });
}

test('every Screen mock the site shows describes itself', async ({ page }) => {
  const described = new Map<string, string>();

  // The two pages that show them. A mock appears on both and is described
  // once for both, in the CMS's Screen mocks entry (ticket 57).
  for (const path of ['/', '/product']) {
    await page.goto(path);
    for (const picture of await page.locator('img[data-screen-mock]').all()) {
      const mock = await picture.getAttribute('data-screen-mock');
      const description = (await picture.getAttribute('alt')) ?? '';
      expect(description.trim(), `the Screen mock "${mock}" on ${path} has no description`).not.toBe('');
      described.set(mock!, description);
    }
  }

  // Every mock in the registry is one of them, so a mock added without a
  // description fails here rather than shipping a silent picture.
  expect([...described.keys()].sort()).toEqual(SCREEN_MOCKS.map((mock) => mock.id).slice().sort());
});

/**
 * What a control looks like, in the properties a focus style is written in —
 * installed in the page rather than passed to each `evaluate`, because a
 * helper cannot be handed across that boundary and the two readings of it,
 * at rest and focused, have to be the same reading.
 */
const LOOK = `window.__look = (element) => {
  const of = (node) => {
    const style = getComputedStyle(node);
    return [style.outline, style.boxShadow, style.backgroundColor, style.color, style.borderColor].join('|');
  };
  // Its descendants too: the card decks and the before/after handle draw
  // their ring on a child rather than on the control itself.
  return [element, ...element.querySelectorAll('*')].map(of).join('//');
}`;

declare global {
  interface Window {
    __look: (element: Element) => string;
  }
}

type Stop = { probe: string | null; tag: string; name: string; changed: boolean };

/**
 * Every control the page offers, in the order Tab reaches them, and whether
 * each one looks different while it holds focus.
 *
 * Tab rather than `element.focus()`: `:focus-visible` — which is what every
 * focus style in this repo is written against — only matches when the browser
 * believes the visitor is using a keyboard, and a scripted `focus()` on a
 * button does not convince it. So the test has to press the key.
 *
 * The walk stops when focus leaves the document for the browser's own
 * chrome, or when it returns to a control it has already been to, which is
 * the whole page having been round once.
 */
async function tabThrough(page: Page): Promise<Stop[]> {
  await page.evaluate(LOOK);
  await page.evaluate(() => {
    const focusable = 'a[href], button, input, select, textarea, summary, [tabindex]';
    const candidates = [...document.querySelectorAll<HTMLElement>(focusable)].filter((element) => {
      // Three deliberate absences from the tab order, each already the right
      // answer: a disabled control (the submit button, until the form is
      // filled in), a `tabindex="-1"` one (the forms' bot trap, and the
      // duplicate links inside a Trust strip copy or an entry card), and
      // anything a screen reader is told to skip.
      if (element.matches(':disabled')) return false;
      if (element.getAttribute('tabindex') === '-1') return false;
      return !element.closest('[aria-hidden="true"]');
    });
    candidates.forEach((element, index) => {
      element.dataset.focusProbe = String(index);
    });
  });

  /** How each control looks at rest, to compare against how it looks focused. */
  const atRest = await page.evaluate(() => {
    const resting: Record<string, string> = {};
    for (const element of document.querySelectorAll<HTMLElement>('[data-focus-probe]')) {
      resting[element.dataset.focusProbe!] = window.__look(element);
    }
    return resting;
  });

  const stops: Stop[] = [];
  const seen = new Set<string>();

  // Generous, and bounded: a walk that does not end is itself the bug this
  // number exists to report.
  for (let step = 0; step < 400; step += 1) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((resting: Record<string, string>) => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body) return null;
      const probe = active.dataset.focusProbe ?? null;
      return {
        probe,
        tag: active.tagName.toLowerCase(),
        name: (
          active.getAttribute('aria-label') ||
          active.getAttribute('placeholder') ||
          active.getAttribute('name') ||
          active.textContent ||
          active.className ||
          ''
        )
          .trim()
          .slice(0, 40),
        // Anything about it or its contents that the focus changed.
        changed: probe === null || window.__look(active) !== resting[probe],
      };
    }, atRest);

    if (!stop) break;
    if (stop.probe !== null && seen.has(stop.probe)) break;
    if (stop.probe !== null) seen.add(stop.probe);
    stops.push(stop);
  }

  return stops;
}

for (const route of ROUTES) {
  test(`every control on ${route.path} is reachable by keyboard, and shows it`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);

    const stops = await tabThrough(page);

    // No assertion that the walk found anything: a page with nothing to
    // operate — the English blog index before ticket 43 gives it articles —
    // is not a page with an unreachable control. What the page does offer is
    // held to both counts below, the second of which reads the page rather
    // than the walk and so cannot pass by finding nothing.
    const invisible = stops.filter((stop) => !stop.changed).map((stop) => `${stop.tag} «${stop.name}»`);
    expect(invisible, `controls that look the same focused as unfocused on ${route.path}`).toEqual([]);

    // Everything the page offers, not only what the walk happened to pass: a
    // control the tab order skips is one a keyboard visitor cannot use at all.
    const reached = stops.map((stop) => stop.probe).filter((probe): probe is string => probe !== null);
    const unreached = await page.evaluate((visited: string[]) => {
      const visible = (element: HTMLElement) => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden';
      };
      return [...document.querySelectorAll<HTMLElement>('[data-focus-probe]')]
        .filter((element) => visible(element) && !visited.includes(element.dataset.focusProbe!))
        .map((element) => {
          const name =
            element.getAttribute('aria-label') ||
            element.getAttribute('placeholder') ||
            element.getAttribute('name') ||
            element.textContent ||
            element.className ||
            '';
          return `${element.tagName.toLowerCase()} «${name.trim().slice(0, 40)}»`;
        });
    }, reached);

    expect(unreached, `controls the keyboard never reaches on ${route.path}`).toEqual([]);
  });
}

test.describe('with motion turned down', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  for (const route of ROUTES) {
    test(`${route.path} is still complete and readable`, async ({ page }) => {
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);

      // The page's own copy, seen rather than merely served: `server-rendering`
      // proves it reaches the browser, this proves the visitor can read it.
      for (const phrase of route.text) {
        await expect(page.getByText(phrase, { exact: false }).first()).toBeVisible();
      }

      // Nothing the animation would have brought in is left behind it. The
      // entrance is the one that hides things — it fades up from `opacity: 0`
      // — so with it turned off every `.reveal` must be fully opaque.
      const faded = await page.locator('.reveal').evaluateAll((elements) =>
        elements
          .filter((element) => Number(getComputedStyle(element).opacity) < 1)
          .map((element) => element.textContent?.trim().slice(0, 40) ?? '<no text>'),
      );
      expect(faded, `${route.path} left content faded out with motion turned down`).toEqual([]);
    });
  }
});
