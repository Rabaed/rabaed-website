/**
 * How each tab and each panel in the profile's before-and-after section
 * looks, given which comparison is chosen.
 *
 * `Compare` draws the first choice into the response on the server and
 * `CompareBehaviour` redraws every choice after it in the browser; deciding it
 * in one place means the two cannot disagree about what "chosen" looks like.
 * The same arrangement as the platform section's (`platform-state.ts`).
 */

/** The comparison chosen in the first response: the first. */
export const FIRST_COMPARISON = 0;

export type ComparisonAppearance = {
  readonly selected: 'true' | 'false';
  readonly panelClass: string;
};

export function comparisonAppearance(index: number, chosen: number): ComparisonAppearance {
  const isChosen = index === chosen;
  return {
    selected: isChosen ? 'true' : 'false',
    panelClass: isChosen ? 'pf-cmp-panel on' : 'pf-cmp-panel',
  };
}
