import type { ReactNode } from 'react';
import { CardDeckBehaviour } from '@/components/home/card-deck-behaviour';
import { DIRECTIONS, cardAtRest, type ReadingDirection } from '@/components/home/card-deck-stack';

/** The words a deck is drawn with, handed down by the section it sits in. */
export type CardDeckWords = {
  /** Names the deck for a screen reader, and says how to use it. */
  readonly label: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  /** The line under the buttons telling a visitor the cards can be moved. */
  readonly hint: string;
};

/**
 * A pile of cards a visitor throws aside one at a time — by dragging, by touch,
 * by the arrow keys, or with the two buttons under it. Used twice on the home
 * page: the situations from the field, and the figures after launch.
 *
 * A server component. Every card's content is in the first response, and so is
 * the stack itself, fanned out with the first card on top (see
 * `card-deck-stack.ts`); `CardDeckBehaviour` makes it respond.
 *
 * Only the top card is exposed to assistive technology. The five behind it are
 * `aria-hidden` — they are drawn, but a screen reader announcing six cards at
 * once would be reading out a pile rather than a card. The counter and the two
 * labelled buttons say where in the deck the visitor is.
 */
export function CardDeck({
  id,
  label,
  previousLabel,
  nextLabel,
  hint,
  direction,
  tone = 'dark',
  cards,
}: {
  id: string;
  /** Names the deck for a screen reader, and says how to use it. */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** The line under the buttons telling a visitor the cards can be moved. */
  hint: string;
  /**
   * The page's reading direction. The server needs it to fan the pile the
   * right way, and it is written onto the deck so the browser reads the same
   * answer rather than working out its own.
   */
  direction: ReadingDirection;
  /** `light` for a deck on a light section. */
  tone?: 'dark' | 'light';
  /** The content of each card, in order. The deck draws the card around it. */
  cards: readonly ReactNode[];
}) {
  const count = cards.length;
  const { previousArrow, nextArrow } = DIRECTIONS[direction];

  return (
    <div className={tone === 'light' ? 'deck-wrap deck-lt' : 'deck-wrap'}>
      <div
        className="deck"
        id={id}
        data-direction={direction}
        tabIndex={0}
        role="group"
        aria-label={label}
      >
        {cards.map((card, index) => {
          const rest = cardAtRest(index, count, direction);
          return (
            <article
              key={index}
              className={rest.top ? 'pcard top' : 'pcard'}
              aria-hidden={rest.top ? 'false' : 'true'}
              style={{
                zIndex: rest.zIndex,
                opacity: rest.opacity,
                pointerEvents: rest.pointerEvents,
                transform: rest.transform,
              }}
            >
              {card}
            </article>
          );
        })}
      </div>

      <div className="deck-ui">
        <button type="button" data-deck="previous" aria-controls={id} aria-label={previousLabel}>
          {previousArrow}
        </button>
        <span className="deck-count">
          <b>1</b> / {count}
        </span>
        <button type="button" data-deck="next" aria-controls={id} aria-label={nextLabel}>
          {nextArrow}
        </button>
      </div>
      <div className="deck-hint">{hint}</div>

      <CardDeckBehaviour deckId={id} />
    </div>
  );
}
