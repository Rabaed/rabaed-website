/**
 * A card deck's geometry and timing, in one place.
 *
 * Two components read these and they are on opposite sides of the
 * server/client line: `CardDeck` draws the stack into the first response, and
 * `CardDeckBehaviour` moves the cards in the browser. The Reference site only
 * ever computed the stack in its script, so until that script ran the six cards
 * lay on exactly the same spot in document order — the *last* card on top,
 * under a counter reading "1". Drawing it on the server puts the right card on
 * top in the first response, with JavaScript off, and with no jump when the
 * script arrives (ADR-0001).
 *
 * Every number is the Reference site's own.
 */

export type ReadingDirection = 'rtl' | 'ltr';

/** How long things take, and how far a card must travel before it counts as thrown. */
export const DECK = {
  /** How long a thrown card takes to leave before the stack closes up behind it. */
  throwMs: 400,
  /** How long a card takes to glide back into its place. */
  glideMs: 420,
  /** How far a card has to be dragged before letting go throws it rather than dropping it back. */
  throwAfterPx: 95,
  /** The pause between the section coming into view and the hint, so the eye has landed first. */
  nudgeDelayMs: 700,
  /** How long the hint holds the top card aside. */
  nudgeHoldMs: 520,
} as const;

type Direction = {
  /** The side the next card leaves towards: -1 is left, 1 is right. */
  readonly ahead: 1 | -1;
  readonly forwardKey: 'ArrowLeft' | 'ArrowRight';
  readonly backKey: 'ArrowLeft' | 'ArrowRight';
  readonly previousArrow: '←' | '→';
  readonly nextArrow: '←' | '→';
};

/**
 * Everything about a deck that mirrors with the reading direction.
 *
 * Reading right to left, "next" is leftward: the next card leaves to the left,
 * the pile fans out to the left behind the top card, the left arrow key moves
 * forward and the next button points left. Reading left to right, every one of
 * those mirrors. Written once here, so no part of the deck can disagree with
 * another about which way is forward.
 */
export const DIRECTIONS: Record<ReadingDirection, Direction> = {
  rtl: { ahead: -1, forwardKey: 'ArrowLeft', backKey: 'ArrowRight', previousArrow: '→', nextArrow: '←' },
  ltr: { ahead: 1, forwardKey: 'ArrowRight', backKey: 'ArrowLeft', previousArrow: '←', nextArrow: '→' },
};

/** The pile at rest: each card behind the top one sits further out, higher, smaller and more turned. */
const FAN = { outPx: 11, upPx: 15, shrink: 0.03, turnDeg: 2.4, visibleCards: 4 };
/** A thrown card leaves 130% of its own width off the side, dropping and turning as it goes. */
const THROWN = { acrossPercent: 130, dropPx: 40, turnDeg: 18 };
/** A card being dragged lifts and turns in proportion, and fades — but never below 35%. */
const HELD = { liftPerPx: 0.06, turnPerPx: 0.05, fadeOverPx: 460, faintest: 0.35 };
/** The hint leans the top card a little aside. */
const NUDGED = { acrossPx: 46, dropPx: 4, turnDeg: 2.4 };

export type CardAtRest = {
  readonly top: boolean;
  readonly zIndex: number;
  readonly opacity: number;
  readonly pointerEvents: 'auto' | 'none';
  readonly transform: string;
};

/**
 * Where the card `depth` places behind the top one sits. Beyond the fourth the
 * cards are hidden — a fan of six would be a smear. Only the top card takes the
 * pointer, so a drag can only ever pick up the card a visitor can see.
 */
export function cardAtRest(depth: number, count: number, direction: ReadingDirection): CardAtRest {
  const side = DIRECTIONS[direction].ahead;
  return {
    top: depth === 0,
    zIndex: count - depth,
    opacity: depth >= FAN.visibleCards ? 0 : 1,
    pointerEvents: depth === 0 ? 'auto' : 'none',
    transform: `translate3d(${side * depth * FAN.outPx}px,${-depth * FAN.upPx}px,0) scale(${1 - depth * FAN.shrink}) rotate(${side * depth * FAN.turnDeg}deg)`,
  };
}

/** A card off the side of the pile — on its way out, or waiting to be brought back in. */
export function offThePile(side: 1 | -1): string {
  return `translate3d(${side * THROWN.acrossPercent}%,${THROWN.dropPx}px,0) rotate(${side * THROWN.turnDeg}deg)`;
}

/** The top card, `dragged` pixels from where it was picked up. */
export function held(dragged: number): { transform: string; opacity: number } {
  return {
    transform: `translate3d(${dragged}px,${Math.abs(dragged) * HELD.liftPerPx}px,0) rotate(${dragged * HELD.turnPerPx}deg)`,
    opacity: Math.max(HELD.faintest, 1 - Math.abs(dragged) / HELD.fadeOverPx),
  };
}

/** The top card, leaning aside to show that it moves. */
export function nudged(side: 1 | -1): string {
  return `translate3d(${side * NUDGED.acrossPx}px,${NUDGED.dropPx}px,0) rotate(${side * NUDGED.turnDeg}deg)`;
}
