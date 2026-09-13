/**
 * Which transaction type the Record section shows, and whether its stamp is
 * on, for how far the visitor has scrolled through it — decided once, here, and
 * read by both the server, which draws the section at the start of its cycle,
 * and the browser, which moves it along. The two cannot disagree about what
 * "the start" looks like.
 *
 * The numbers are the Reference site's: nothing changes for the first 12% of
 * the way, the types then take equal shares of the rest, and the stamp comes on
 * for the last 10%. With five types each share is the Reference site's 0.176.
 */

/** How far into the section before the first type gives way to the second. */
const LEAD_IN = 0.12;

/** How far into the section before the Record is stamped complete. */
const STAMPED_AFTER = 0.9;

export type RecordMoment = { readonly chosen: number; readonly stamped: boolean };

/** Where the cycle stands at `progress`, from 0 at the start of the section to 1 at its end. */
export function recordAt(progress: number, count: number): RecordMoment {
  const share = (1 - LEAD_IN) / count;
  const chosen = Math.min(count - 1, Math.floor(Math.max(0, progress - LEAD_IN) / share));
  return { chosen, stamped: progress > STAMPED_AFTER };
}

export type TransactionTypeAppearance = {
  /** The Reference site's class for the chip of the type showing. */
  readonly chipClass: 'on' | undefined;
  /** Whether the trail this type leaves in the Record is out of sight. */
  readonly trailHidden: boolean;
};

/** How the chip and the trail for one transaction type look, when `chosen` is the type showing. */
export function transactionTypeAppearance(index: number, chosen: number): TransactionTypeAppearance {
  return {
    chipClass: index === chosen ? 'on' : undefined,
    trailHidden: index !== chosen,
  };
}
