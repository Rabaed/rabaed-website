/**
 * Which way the page reads, and what that turns round.
 *
 * The site serves Arabic right to left and English left to right from one
 * stylesheet and one set of components (spec: Routing and localisation), so
 * anything a visitor moves with the keyboard — a thrown card, a chosen tab —
 * has to know which arrow means "next". In Arabic it is the left one.
 *
 * It is decided here once. The server writes the direction onto the element it
 * drew, as `data-direction`, and the browser reads that back with
 * `readingDirectionOf` rather than working it out again, so the two can never
 * disagree about which way is forward.
 */

export type ReadingDirection = 'rtl' | 'ltr';

type ArrowKey = 'ArrowLeft' | 'ArrowRight';

export const ARROW_KEYS: Record<ReadingDirection, { readonly forward: ArrowKey; readonly back: ArrowKey }> = {
  rtl: { forward: 'ArrowLeft', back: 'ArrowRight' },
  ltr: { forward: 'ArrowRight', back: 'ArrowLeft' },
};

/**
 * The arrow that points onward, the way the page reads: at the end of a link
 * drawn in code, and between two things one follows the other. «←» in Arabic,
 * «→» in English — the character itself rather than one turned round by the
 * stylesheet, since it is read out with the link it ends.
 */
export const ONWARD: Record<ReadingDirection, '←' | '→'> = { rtl: '←', ltr: '→' };

/** The direction the server wrote onto `element` as `data-direction`. */
export function readingDirectionOf(element: HTMLElement): ReadingDirection {
  return element.dataset.direction === 'ltr' ? 'ltr' : 'rtl';
}
