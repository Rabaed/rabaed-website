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
 * what a visitor meets. The states behind a click, a scroll or a tab belong to
 * the suites that open them — **and that is a real limit, not a tidy division
 * of labour.** The Record section's stamp was missed by exactly this: it is
 * `opacity: 0` until the section has been scrolled through, so axe never saw
 * that its ground turns white under it (ticket 36 found it by reading the
 * stylesheet, and `home.css` says so beside the rule). A state worth showing a
 * visitor is worth a contrast check, and one added later will not get it here.
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

/**
 * The reasons axe gives for not being able to judge contrast that are the
 * question not applying rather than an answer it is withholding. Each was
 * looked at once, on this site, and each is the same handful of elements:
 *
 *  - **Only non-text characters.** The arrows on the "read more" links and in
 *    the Partnerships trigger, the `+` and `–` on a question, the bullets in a
 *    list. They are drawing, and they say nothing a reader has to read.
 *  - **Overlapped by another element.** The before/after slider's two arrows,
 *    which sit over the picture they move across, and a card's number under
 *    its own overlay.
 *  - **A background gradient.** The hero's glow, a faint wash of the accent
 *    over the dark ground, under text that is already held to that ground.
 */
const UNDECIDABLE = [
  'Element content contains only non-text characters',
  'background color could not be determined because it is overlapped by another element',
  'background color could not be determined due to a background gradient',
];

/** Whether every reason axe gave for one element is one of those. */
function undecidable(failureSummary: string | undefined): boolean {
  return UNDECIDABLE.some((why) => failureSummary?.includes(why) ?? false);
}

/**
 * Whether axe's account of one element names an accepted pair. It is the whole
 * account that is forgiven, because axe writes one pair per element for this
 * rule: a second shortfall on the same element would be a second element in
 * the report, not a second line here.
 */
function accepted(failureSummary: string | undefined): boolean {
  return ACCEPTED.some(
    (pair) =>
      failureSummary?.includes(`foreground color: ${pair.foreground}, background color: ${pair.background}`) ?? false,
  );
}

/** The rule, the elements and the fix, rather than a count. */
function describeChecks(violations: { id: string; impact?: string | null; help: string; nodes: { target: unknown[]; failureSummary?: string }[] }[]): string {
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

    const { violations, incomplete } = await new AxeBuilder({ page }).withTags(STANDARD).analyze();

    const unaccepted = violations
      .map((violation) => ({ ...violation, nodes: violation.nodes.filter((node) => !accepted(node.failureSummary)) }))
      .filter((violation) => violation.nodes.length > 0);

    expect(describeChecks(unaccepted), `${route.path} has accessibility violations`).toBe('');

    // What axe could not decide, which it keeps in a bucket of its own. Read
    // rather than dropped: contrast it cannot compute lands here rather than
    // above, and a page that quietly filled up with it would look as clean as
    // one with nothing wrong. Only the three reasons below are let through,
    // each of them axe saying the question does not apply, so a fourth kind of
    // undecidable arrives as a failure rather than as silence.
    const undecided = incomplete
      .map((check) => ({ ...check, nodes: check.nodes.filter((node) => !undecidable(node.failureSummary)) }))
      .filter((check) => check.nodes.length > 0);

    expect(describeChecks(undecided), `${route.path} has checks axe could not decide`).toBe('');
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

/** What to call a control in a failure, when it has no words of its own. */
const NAMES = `window.__names = (element) =>
  (element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.getAttribute('name') || element.textContent || element.className || '')
    .trim()
    .slice(0, 40);`;

declare global {
  interface Window {
    __look: (element: Element) => string;
    __names: (element: Element) => string;
  }
}

type Stop = { probe: string; tag: string; name: string; changed: boolean };

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
  await page.evaluate(NAMES);
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
      // Nothing this walk asked about: a control it deliberately left
      // unstamped, or something outside the page. Skipped rather than
      // counted, so a stop nobody asked about cannot pass for one that showed
      // its focus.
      const probe = active.dataset.focusProbe;
      if (probe === undefined) return 'skip' as const;
      return {
        probe,
        tag: active.tagName.toLowerCase(),
        name: window.__names(active),
        // Anything about it or its contents that the focus changed.
        changed: window.__look(active) !== resting[probe],
      };
    }, atRest);

    if (!stop) break;
    if (stop === 'skip') continue;
    if (seen.has(stop.probe)) break;
    seen.add(stop.probe);
    stops.push(stop);
  }

  return stops;
}

/**
 * Both sides of the 981px breakpoint, because each offers different controls:
 * above it the header's links and the Partnerships dropdown are in the tab
 * order, below it they are behind a burger and it is the burger that has to be
 * reachable. Opening the panel is `page-shell.spec.ts`; this is about what the
 * page offers before anything is opened.
 */
const KEYBOARD_WIDTHS = [
  { where: 'a desktop', width: 1280, height: 900 },
  { where: 'a phone', width: 390, height: 844 },
];

for (const route of ROUTES) {
  for (const viewport of KEYBOARD_WIDTHS) {
    test(`every control on ${route.path} is reachable by keyboard on ${viewport.where}, and shows it`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);

      const stops = await tabThrough(page);

      // No assertion that the walk found anything: a page with nothing to
      // operate — the English blog index before ticket 43 gives it articles —
      // is not a page with an unreachable control. What the page does offer is
      // held to both counts below, the second of which reads the page rather
      // than the walk and so cannot pass by finding nothing.
      const invisible = stops.filter((stop) => !stop.changed).map((stop) => `${stop.tag} «${stop.name}»`);
      expect(invisible, `controls that look the same focused as unfocused on ${route.path} at ${viewport.width}px`).toEqual([]);

      // Everything the page offers, not only what the walk happened to pass: a
      // control the tab order skips is one a keyboard visitor cannot use at all.
      const reached = stops.map((stop) => stop.probe);
      const unreached = await page.evaluate((visited: string[]) => {
        const visible = (element: HTMLElement) => {
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden';
        };
        return [...document.querySelectorAll<HTMLElement>('[data-focus-probe]')]
          .filter((element) => visible(element) && !visited.includes(element.dataset.focusProbe!))
          .map((element) => `${element.tagName.toLowerCase()} «${window.__names(element)}»`);
      }, reached);

      expect(unreached, `controls the keyboard never reaches on ${route.path} at ${viewport.width}px`).toEqual([]);
    });
  }
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
