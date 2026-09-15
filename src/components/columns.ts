/**
 * How a grid holding a list an Editor manages lays out however many items it
 * is given (spec: Design system): all in one row while they fit, and otherwise
 * as few rows as possible, filled as evenly as they go — four in two rows of
 * two rather than three and one alone.
 */

/** Class names for the number of columns at desktop widths (`start.css`, `programmes.css`, `tokens.css`). */
export const COLUMN_CLASS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four' } as const;

/** How many columns `count` items take at desktop widths, at most `maxColumns`. */
export function columnsFor(count: number, maxColumns: 3 | 4): 1 | 2 | 3 | 4 {
  if (count <= maxColumns) return Math.max(count, 1) as 1 | 2 | 3 | 4;
  return Math.ceil(count / Math.ceil(count / maxColumns)) as 1 | 2 | 3 | 4;
}
