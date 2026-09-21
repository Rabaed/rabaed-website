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
 * The colours ticket 36 changed for contrast, each beside the Reference site's
 * value it replaced (ADR-0011), as a computed style reports them.
 *
 * Every comparison reads both documents through this, so a part whose colour
 * is one of these reads as the Reference site's — and every other colour is
 * still compared to the value. That keeps the comparisons saying what they
 * were written to say ("this label is the accent, not grey") instead of the
 * two hundred `omit: ['color']` entries the alternative would need, which
 * would stop them saying anything about colour at all.
 *
 * It is applied to both pages, so a pair that already matched still matches:
 * `#836921` is the dark gold the Reference site's own badge uses, and reading
 * it as gold on both sides changes nothing about that badge.
 */
export const RECOLOURED: readonly (readonly [string, string])[] = [
  // The accent as text on a pale ground, and the two lifts of it on the tool
  // page's state pills.
  ['rgb(178, 58, 27)', 'rgb(249, 87, 56)'],
  ['rgb(255, 106, 76)', 'rgb(249, 87, 56)'],
  // The gold label, and the green and blue pills, dark on the pale legend and
  // lifted on the dark drawing.
  ['rgb(131, 105, 33)', 'rgb(204, 168, 64)'],
  ['rgb(17, 106, 76)', 'rgb(29, 158, 117)'],
  ['rgb(53, 183, 140)', 'rgb(29, 158, 117)'],
  ['rgb(44, 91, 190)', 'rgb(91, 141, 239)'],
  ['rgb(127, 166, 244)', 'rgb(91, 141, 239)'],
];

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

  return page.evaluate(
    ({
      root,
      omitFromRoot,
      parts,
      recoloured,
    }: {
      root: string;
      omitFromRoot: Measurement[];
      parts: { selector: string; omit: Measurement[] }[];
      recoloured: [string, string][];
    }) => {
      /** A colour ticket 36 changed, read as the Reference site's (RECOLOURED). */
      const asReference = (value: string) =>
        recoloured.reduce((read, [now, before]) => read.split(now).join(before), value);
      const base = document.querySelector(root);
      if (!base) return null;
      const origin = base.getBoundingClientRect();
      const round = (n: number) => Math.round(n * 100) / 100;

      const of = (element: Element, omit: Measurement[]) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        // The stand-in families are a loading device, not a typeface choice:
        // they hold the fallback's place at the width IBM Plex Sans Arabic
        // sets Arabic at, and by the time anything is measured the real face
        // is in use (ADR-0012). `fontFamily` reports the whole declared stack
        // whatever is rendering, so left in they would fail every comparison
        // on the site against a Reference site that does not declare them —
        // while saying nothing about what either page is set in.
        const family = style.fontFamily.replace(/"Arabic stand-in[^"]*", /g, '');
        const measured: Record<Measurement, unknown> = {
          top: round(box.top - origin.top),
          left: round(box.left - origin.left),
          height: round(box.height),
          width: round(box.width),
          color: asReference(style.color),
          background: asReference(style.backgroundColor),
          // All four edges: a rule on one side is invisible to a reading of another.
          borderColor: asReference(
            [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(' '),
          ),
          font: `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${family}`,
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
    {
      root: region.root,
      omitFromRoot: [...(region.omitFromRoot ?? [])],
      parts,
      recoloured: RECOLOURED.map(([now, before]) => [now, before] as [string, string]),
    },
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
