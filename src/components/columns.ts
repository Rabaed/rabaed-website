/**
 * How a grid holding a list an Editor manages lays out however many items it
 * is given (spec: Design system): all in one row while they fit, and otherwise
 * as few rows as possible, filled as evenly as they go — four in two rows of
 * two rather than three and one alone.
 */

/** Class names for the number of columns at desktop widths (`start.css`, `programmes.css`, `tokens.css`). */
export const COLUMN_CLASS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four' } as const;

/**
 * A strip of badged cards for `count` cards at desktop widths (`tokens.css`):
 * two across is `.strip` itself, so today's two cards keep their markup, and
 * four sit in two rows of it; one card takes the whole row, and so does the
 * last of an odd number.
 *
 * Never three across: a card a third of the row wide would bring a long title
 * under the badge in its corner, which a card half the row wide or wider keeps
 * clear of — the product page's custom strip and the referral page's offer.
 */
export function stripClass(count: number): string {
  return count % 2 === 1 ? 'strip odd' : 'strip';
}

/** How many columns `count` items take at desktop widths, at most `maxColumns`. */
export function columnsFor(count: number, maxColumns: 3 | 4): 1 | 2 | 3 | 4 {
  if (count <= maxColumns) return Math.max(count, 1) as 1 | 2 | 3 | 4;
  return Math.ceil(count / Math.ceil(count / maxColumns)) as 1 | 2 | 3 | 4;
}
