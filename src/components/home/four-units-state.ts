/**
 * How each tab, screen and caption in the four-units section looks, given
 * which tab is chosen.
 *
 * Two components need the answer and they are on opposite sides of the
 * server/client line: `FourUnits` draws the first choice into the response, and
 * `FourUnitsBehaviour` redraws every choice after it. Deciding it in one place
 * means the page a script-less visitor sees and the page after a click cannot
 * disagree about what "chosen" looks like.
 */

/** The tab chosen in the first response: the first unit. */
export const FIRST_CHOSEN = 0;

export type UnitTabAppearance = {
  readonly tabClass: string;
  readonly selected: 'true' | 'false';
  readonly panelClass: string;
  /** Whether the caption under the screen is hidden. */
  readonly hintHidden: boolean;
};

export function unitTabAppearance(index: number, chosen: number): UnitTabAppearance {
  const isChosen = index === chosen;
  return {
    tabClass: isChosen ? 'jt-s on' : 'jt-s',
    selected: isChosen ? 'true' : 'false',
    panelClass: isChosen ? 'jt-shot on' : 'jt-shot',
    hintHidden: !isChosen,
  };
}
