/**
 * How each tab and each screen in the profile's platform section looks, given
 * which unit is chosen.
 *
 * `Platform` draws the first choice into the response on the server and
 * `PlatformBehaviour` redraws every choice after it in the browser; deciding it
 * in one place means the two cannot disagree about what "chosen" looks like.
 * The same arrangement as the home page's four units (`four-units-state.ts`).
 */

/** The unit chosen in the first response: the first. */
export const FIRST_UNIT = 0;

export type UnitAppearance = {
  readonly tabClass: string;
  readonly selected: 'true' | 'false';
  readonly panelClass: string;
};

export function unitAppearance(index: number, chosen: number): UnitAppearance {
  const isChosen = index === chosen;
  return {
    tabClass: isChosen ? 'pf-unit on' : 'pf-unit',
    selected: isChosen ? 'true' : 'false',
    panelClass: isChosen ? 'pf-screen on' : 'pf-screen',
  };
}
