/**
 * How each tab and each party's panel in the roles section looks, given which
 * party is chosen.
 *
 * `Roles` draws the first choice into the response on the server and
 * `RolesBehaviour` redraws every choice after it in the browser; deciding it in
 * one place means the two cannot disagree about what "chosen" looks like. The
 * same arrangement as the home page's four units (`four-units-state.ts`).
 */

/** The party chosen in the first response: the Owner. */
export const FIRST_ROLE = 0;

export type RoleAppearance = {
  readonly tabClass: string;
  readonly selected: 'true' | 'false';
  readonly panelClass: string;
};

export function roleAppearance(index: number, chosen: number): RoleAppearance {
  const isChosen = index === chosen;
  return {
    tabClass: isChosen ? 'tab on' : 'tab',
    selected: isChosen ? 'true' : 'false',
    panelClass: isChosen ? 'role on' : 'role',
  };
}
