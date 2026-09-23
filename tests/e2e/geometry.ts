import type { Page } from '@playwright/test';

/**
 * Measuring pages — shared by the specs that compare a section with the same
 * section on the Reference site, and by the ones that check a page never
 * scrolls sideways.
 *
 * A region is measured from one element's top-left corner, its root, so two
 * documents whose sections sit at different heights on the page can still be
 * compared: only where things are *within* the region counts.
 *
 * Each selector is measured across every element it matches, not only the
 * first, so a list of five tabs is five comparisons, and a tab that went
 * missing fails on the count rather than quietly comparing nothing.
 */

/** One thing measured about an element. */
export type Measurement =
  | 'top'
  | 'left'
  | 'height'
  | 'width'
  | 'color'
  | 'background'
  | 'borderColor'
  | 'font'
  | 'display'
  | 'visibility'
  | 'opacity';

/**
 * The measurements to leave out of a part a deliberate difference moves up or
 * down the page — everything but its position across, its width and its
 * colours, which are still held.
 */
export const EVERYTHING_BUT_ACROSS: readonly Measurement[] = ['top', 'height', 'font', 'display', 'visibility', 'opacity'];

/**
 * How a comparison reads an element's colours and its typeface, installed in
 * the page by `installReadings` below and shared by all three of the specs
 * that measure a document against the Reference site.
 *
 * It is source rather than a function because it is read inside the page, and
 * a function cannot be handed across that boundary. One copy rather than three
 * because the two things it does are two deliberate divergences this ticket
 * introduced, and a fourth spec that starts comparing documents should inherit
 * both rather than rediscover them.
 *
 * **Colour (ADR-0011).** The colours ticket 36 changed for contrast read as
 * the Reference site's value they replaced, so a comparison still says what it
 * was written to say — "this label is the accent, not grey" — instead of the
 * two hundred `omit: ['color']` entries the alternative would need, which
 * would stop it saying anything about colour at all. Both documents are read
 * this way, so a pair that already matched still matches: `#836921` is the
 * dark gold the Reference site's own badge uses, and reading it as gold on
 * both sides changes nothing about that badge.
 *
 * **Only where the text is what changed.** `border-color` and `background`
 * start out as `currentColor`, so on most elements they simply report the
 * text's colour — which is why they have to be read the same way. They are
 * read that way *only when the element's own text is one of the changed
 * inks*. A fill, a rule or a ring is not text, ADR-0011 leaves it at the
 * accent, and one that turned up as the deeper orange is a real difference
 * this still fails on.
 *
 * **Typeface (ADR-0012).** The stand-in families are stripped out. They hold
 * the fallback's place at the width IBM Plex Sans Arabic sets Arabic at, and
 * by the time anything is measured the real face is in use — but `fontFamily`
 * reports the whole declared stack whatever is rendering, so left in they
 * would fail every comparison against a Reference site that does not declare
 * them, while saying nothing about what either page is set in.
 *
 * **The label face (ADR-0018).** An Arabic label is set in Thmanyah Sans where
 * the Reference site sets DM Mono, which has no Arabic glyphs. It reads as the
 * DM Mono it replaced, as the colours do, so a comparison still holds the
 * label's weight, size and line height — and Thmanyah turning up where the
 * Reference site set the body face still fails, as DM Mono there would.
 */
const READINGS = `window.__readings = (style) => {
  const recoloured = ${JSON.stringify([
    // The accent as text on a pale ground, and the lift of it on the tool
    // page's state pills over the dark drawing.
    ['rgb(178, 58, 27)', 'rgb(249, 87, 56)'],
    ['rgb(255, 106, 76)', 'rgb(249, 87, 56)'],
    // The gold label, and the green and blue pills, deeper on the pale legend
    // and lifted on the dark drawing.
    ['rgb(131, 105, 33)', 'rgb(204, 168, 64)'],
    ['rgb(17, 106, 76)', 'rgb(29, 158, 117)'],
    ['rgb(53, 183, 140)', 'rgb(29, 158, 117)'],
    ['rgb(44, 91, 190)', 'rgb(91, 141, 239)'],
    ['rgb(127, 166, 244)', 'rgb(91, 141, 239)'],
  ])};
  const asReference = (value) => recoloured.reduce((read, [now, before]) => read.split(now).join(before), value);
  const color = asReference(style.color);
  const textChanged = color !== style.color;
  // All four edges: a rule on one side is invisible to a reading of another.
  const border = [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(' ');
  const family = style.fontFamily.startsWith('"Thmanyah Sans"') ? '"DM Mono", monospace' : style.fontFamily.replace(/"Arabic stand-in[^"]*", /g, '');
  return {
    color,
    background: textChanged ? asReference(style.backgroundColor) : style.backgroundColor,
    borderColor: textChanged ? asReference(border) : border,
    font: style.fontWeight + ' ' + style.fontSize + '/' + style.lineHeight + ' ' + family,
  };
};`;

/** Puts `READINGS` in the page. Call it once per document, before measuring. */
export async function installReadings(page: Page) {
  await page.evaluate(READINGS);
}

declare global {
  interface Window {
    __readings: (style: CSSStyleDeclaration) => {
      color: string;
      background: string;
      borderColor: string;
      font: string;
    };
  }
}

/**
 * A selector to measure in full, or one with the measurements a deliberate
 * difference changes left out — which should be said in a comment beside it.
 */
export type Part = string | { readonly selector: string; readonly omit: readonly Measurement[] };

export type Region = {
  /** Names the region when a comparison fails. */
  readonly name: string;
  /** Everything in the region is measured from this element's top-left corner. */
  readonly root: string;
  /** Measurements of the root itself to leave out. */
  readonly omitFromRoot?: readonly Measurement[];
  readonly parts: readonly Part[];
};

export async function measureRegion(page: Page, region: Region) {
  const parts = region.parts.map((part) =>
    typeof part === 'string' ? { selector: part, omit: [] } : { selector: part.selector, omit: [...part.omit] },
  );

  await installReadings(page);

  return page.evaluate(
    ({ root, omitFromRoot, parts }: { root: string; omitFromRoot: Measurement[]; parts: { selector: string; omit: Measurement[] }[] }) => {
      const base = document.querySelector(root);
      if (!base) return null;
      const origin = base.getBoundingClientRect();
      const round = (n: number) => Math.round(n * 100) / 100;

      const of = (element: Element, omit: Measurement[]) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const measured: Record<Measurement, unknown> = {
          top: round(box.top - origin.top),
          left: round(box.left - origin.left),
          height: round(box.height),
          width: round(box.width),
          ...window.__readings(style),
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
        };
        for (const key of omit) delete measured[key];
        return measured;
      };

      const result: Record<string, unknown> = { self: of(base, omitFromRoot) };
      for (const part of parts) {
        result[part.selector] = [...base.querySelectorAll(part.selector)].map((element) => of(element, part.omit));
      }
      return result;
    },
    { root: region.root, omitFromRoot: [...(region.omitFromRoot ?? [])], parts },
  );
}

/**
 * How far the page could scroll sideways, in pixels; zero or less means not at
 * all. Measured against `clientWidth`, because the Reference site clips
 * overflow deliberately, which makes `scrollWidth` alone useless (spec).
 */
export async function sidewaysOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
}
