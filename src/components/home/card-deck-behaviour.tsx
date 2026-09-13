'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DECK,
  DIRECTIONS,
  cardAtRest,
  held,
  nudged,
  offThePile,
} from '@/components/home/card-deck-stack';
import { prefersReducedMotion } from '@/lib/motion';
import { readingDirectionOf } from '@/lib/reading-direction';

/**
 * Makes one `CardDeck` respond, attached to markup the server already sent:
 *
 * - **Drag** the top card — by mouse, pen or finger, since all three arrive as
 *   pointer events. Past 95px, letting go throws it to the back of the pile;
 *   short of that it drops back into place.
 * - **The buttons** and **the arrow keys** throw it or bring the last one back.
 * - **A one-time nudge** the first time the section scrolls into view: the top
 *   card leans aside and settles, to show it can be moved. Never for a visitor
 *   who has already moved it, and never with reduced motion — it is a hint, and
 *   the spec skips hints for anyone who has asked for less movement.
 *
 * The mechanics are the Reference site's, number for number; the numbers
 * themselves live in `card-deck-stack.ts`. Everything is undone on teardown —
 * listeners, timers, the scroll trigger, and the stack itself — so React's
 * development double-invocation starts its second run from exactly what the
 * server drew.
 *
 * Renders nothing.
 */
export function CardDeckBehaviour({ deckId }: { deckId: string }) {
  useEffect(() => {
    const deck = document.getElementById(deckId);
    const wrap = deck?.closest('.deck-wrap');
    const section = deck?.closest('section');
    if (!deck || !wrap || !section) return;

    const cards = [...deck.querySelectorAll<HTMLElement>('.pcard')];
    const count = wrap.querySelector('.deck-count b');
    const previous = wrap.querySelector<HTMLButtonElement>('[data-deck="previous"]');
    const next = wrap.querySelector<HTMLButtonElement>('[data-deck="next"]');
    if (cards.length === 0 || !count || !previous || !next) return;

    // The direction the server fanned the pile for, read back rather than
    // worked out again, so the two can never disagree about which way is
    // forward.
    const direction = readingDirectionOf(deck);
    const { ahead, forwardKey, backKey } = DIRECTIONS[direction];

    /** `order[0]` is the card on top. */
    let order = cards.map((_, index) => index);
    /** A throw or a return is under way; input waits for it to finish. */
    let busy = false;
    /** The visitor has moved the deck themselves, so there is nothing left to hint at. */
    let touched = false;

    // Every timer and frame goes through these, so teardown can cancel the
    // lot — a throw's timeout firing after unmount would restack a deck that
    // a remount has already restacked.
    const timers = new Set<number>();
    const frames = new Set<number>();
    const later = (run: () => void, ms: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        run();
      }, ms);
      timers.add(timer);
    };
    const nextFrame = (run: () => void) => {
      const frame = requestAnimationFrame(() => {
        frames.delete(frame);
        run();
      });
      frames.add(frame);
    };

    const place = () => {
      order.forEach((index, depth) => {
        const card = cards[index];
        const rest = cardAtRest(depth, cards.length, direction);
        card.classList.toggle('top', rest.top);
        card.style.zIndex = String(rest.zIndex);
        card.style.opacity = String(rest.opacity);
        card.style.pointerEvents = rest.pointerEvents;
        card.style.transform = rest.transform;
        card.setAttribute('aria-hidden', rest.top ? 'false' : 'true');
      });
      count.textContent = String(order[0] + 1);
    };
    const glide = (card: HTMLElement, on: boolean) => card.classList.toggle('glide', on);

    /** Throws the top card off towards `side` and closes the stack up behind it. */
    const throwTop = (side: 1 | -1) => {
      if (busy) return;
      busy = true;
      const card = cards[order[0]];
      glide(card, true);
      card.style.transform = offThePile(side);
      card.style.opacity = '0';
      later(() => {
        order.push(order.shift()!);
        glide(card, false);
        place();
        nextFrame(() => {
          busy = false;
        });
      }, DECK.throwMs);
    };

    /** Brings the bottom card back to the top, in from the side cards are thrown to. */
    const bringBack = () => {
      if (busy) return;
      busy = true;
      order.unshift(order.pop()!);
      const card = cards[order[0]];
      glide(card, false);
      card.style.opacity = '0';
      card.style.transform = offThePile(ahead);
      nextFrame(() => {
        glide(card, true);
        place();
        later(() => {
          glide(card, false);
          busy = false;
        }, DECK.glideMs);
      });
    };

    // ---- dragging ----
    let startX = 0;
    let dragged = 0;
    let holding: HTMLElement | null = null;

    const onPointerDown = (event: PointerEvent) => {
      if (busy) return;
      const top = cards[order[0]];
      if (!top.contains(event.target as Node)) return;
      holding = top;
      startX = event.clientX;
      dragged = 0;
      touched = true;
      glide(top, false);
      top.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!holding) return;
      dragged = event.clientX - startX;
      const pose = held(dragged);
      holding.style.transform = pose.transform;
      holding.style.opacity = String(pose.opacity);
    };
    const onRelease = () => {
      if (!holding) return;
      const card = holding;
      holding = null;
      if (Math.abs(dragged) > DECK.throwAfterPx) {
        throwTop(dragged > 0 ? 1 : -1);
      } else {
        glide(card, true);
        card.style.opacity = '1';
        place();
        later(() => glide(card, false), DECK.throwMs);
      }
    };

    // ---- buttons and keys ----
    const onNext = () => {
      touched = true;
      throwTop(ahead);
    };
    const onPrevious = () => {
      touched = true;
      bringBack();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === forwardKey) {
        event.preventDefault();
        onNext();
      } else if (event.key === backKey) {
        event.preventDefault();
        onPrevious();
      }
    };

    deck.addEventListener('pointerdown', onPointerDown);
    deck.addEventListener('pointermove', onPointerMove);
    deck.addEventListener('pointerup', onRelease);
    deck.addEventListener('pointercancel', onRelease);
    deck.addEventListener('pointerleave', onRelease);
    deck.addEventListener('keydown', onKeyDown);
    next.addEventListener('click', onNext);
    previous.addEventListener('click', onPrevious);

    place();

    // ---- the one-time nudge ----
    gsap.registerPlugin(ScrollTrigger);
    const nudge = prefersReducedMotion()
      ? null
      : ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          once: true,
          onEnter: () => {
            later(() => {
              if (touched || busy) return;
              const card = cards[order[0]];
              glide(card, true);
              card.style.transform = nudged(ahead);
              later(() => {
                place();
                later(() => glide(card, false), DECK.glideMs);
              }, DECK.nudgeHoldMs);
            }, DECK.nudgeDelayMs);
          },
        });

    return () => {
      nudge?.kill();
      timers.forEach((timer) => window.clearTimeout(timer));
      frames.forEach((frame) => cancelAnimationFrame(frame));
      deck.removeEventListener('pointerdown', onPointerDown);
      deck.removeEventListener('pointermove', onPointerMove);
      deck.removeEventListener('pointerup', onRelease);
      deck.removeEventListener('pointercancel', onRelease);
      deck.removeEventListener('pointerleave', onRelease);
      deck.removeEventListener('keydown', onKeyDown);
      next.removeEventListener('click', onNext);
      previous.removeEventListener('click', onPrevious);

      // Back to the stack the server drew, first card on top.
      order = cards.map((_, index) => index);
      cards.forEach((card) => glide(card, false));
      place();
    };
  }, [deckId]);

  return null;
}
