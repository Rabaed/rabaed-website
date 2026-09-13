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
          color: style.color,
          background: style.backgroundColor,
          // All four edges: a rule on one side is invisible to a reading of another.
          borderColor: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(' '),
          font: `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${style.fontFamily}`,
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
