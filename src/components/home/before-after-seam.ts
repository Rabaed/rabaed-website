/**
 * The before-and-after comparison's arithmetic, number for number the
 * Reference site's (`reference/site/index.html`, "Before / after").
 *
 * Positions are percentages across the comparison **from its left edge**, and
 * Rabaed's way is **on the side of the seam a line begins on**: reading right
 * to left, the steps begin on the right, Rabaed's way is to the right of the
 * seam, and dragging the seam leftward turns them over in order. An English
 * page is the same picture turned round (ticket 42): its steps begin on the
 * left, Rabaed's way is to the left of the seam, and dragging it rightward
 * turns them over. Physical rather than logical on purpose — the seam, the
 * wash behind it and the two tags are a picture with a left and a right.
 */
import type { ReadingDirection } from '@/lib/reading-direction';

/** Where the seam rests. */
export const SEAM_AT_REST = 50;

/**
 * The one-time hint's sweep: from where no step is turned over to where every
 * one is — right to left in Arabic, left to right in English.
 */
export const HINT_SWEEP: Record<ReadingDirection, { readonly from: number; readonly to: number }> = {
  rtl: { from: 100, to: 0 },
  ltr: { from: 0, to: 100 },
};

/** How far one press of an arrow key moves the seam. */
export const SEAM_KEY_STEP = 6;

/** How wide, as a share of the comparison, the stretch is over which a step turns over. */
const FLIP_BAND = 11;

export function clampSeam(position: number): number {
  return Math.max(0, Math.min(100, position));
}

/**
 * How far over a step is — 0 showing the usual way, 1 showing Rabaed's — for
 * where its column's centre is and where the seam is. Half-way exactly when
 * the seam crosses the centre, and all the way over 5.5% either side of it.
 */
export function turnedOver(columnCentre: number, seam: number, direction: ReadingDirection): number {
  const past = direction === 'rtl' ? columnCentre - seam : seam - columnCentre;
  return Math.max(0, Math.min(1, past / FLIP_BAND + 0.5));
}

/** How the step's two faces are drawn, `turned` of the way over: the arriving face rises into place, the leaving one lifts away. */
export function facesAt(turned: number) {
  return {
    rabaed: { opacity: String(turned), transform: `translateY(${(1 - turned) * 14}px) scale(${0.97 + turned * 0.03})` },
    usual: { opacity: String(1 - turned), transform: `translateY(${-turned * 14}px) scale(${1 - turned * 0.03})` },
  };
}

export type Verdict = 'usual' | 'rabaed' | 'between';

/** The verdict under the comparison: which way won, or neither yet. A step counts once it is more than half-way over. */
export function verdictFor(stepsOver: number, stepCount: number): Verdict {
  if (stepsOver >= stepCount) return 'rabaed';
  if (stepsOver <= 0) return 'usual';
  return 'between';
}
