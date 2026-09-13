/**
 * Which kind of transaction the Record section shows, and whether its stamp is
 * on, for how far the visitor has scrolled through it — decided once, here, and
 * read by both the server, which draws the section at the start of its cycle,
 * and the browser, which moves it along. The two cannot disagree about what
 * "the start" looks like.
 *
 * The numbers are the Reference site's: nothing changes for the first 12% of
 * the way, the kinds then take equal shares of the rest, and the stamp comes on
 * for the last 10%. With five kinds each share is the Reference site's 0.176.
 */

/** How far into the section before the first kind gives way to the second. */
const LEAD_IN = 0.12;

/** How far into the section before the record is stamped complete. */
const STAMPED_AFTER = 0.9;

export type RecordMoment = { readonly chosen: number; readonly stamped: boolean };

/** Where the cycle stands at `progress`, from 0 at the start of the section to 1 at its end. */
export function recordAt(progress: number, count: number): RecordMoment {
  const share = (1 - LEAD_IN) / count;
  const chosen = Math.min(count - 1, Math.floor(Math.max(0, progress - LEAD_IN) / share));
  return { chosen, stamped: progress > STAMPED_AFTER };
}

/** How the chip and the record for one kind look, when `chosen` is the kind showing. */
export function recordTypeAppearance(index: number, chosen: number) {
  return {
    chipOn: index === chosen,
    recordHidden: index !== chosen,
  };
}
