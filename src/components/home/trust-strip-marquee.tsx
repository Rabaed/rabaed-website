'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

/** CSS pixels per second. Slow enough to read a name as it goes by. */
const TRAVEL_SPEED = 40;

/**
 * The Trust strip's two behaviours, attached to markup the server already
 * sent: the rail travels, and a mark that fails to load gives way to the
 * company's name in text. Renders nothing.
 *
 * **Why it travels by a percentage.** The track is the client list twice over,
 * so moving it by exactly half its own width lands the second copy where the
 * first began — the seam every marquee has, put somewhere it cannot be seen.
 * GSAP writes `xPercent` into the transform as a literal `%`, so that stays
 * true whatever the marks measure: one fails to load and the row gets
 * narrower, and the loop is still seamless without being re-measured. Only the
 * speed drifts, by less than the width of one logo.
 *
 * **Reduced motion is handled in the stylesheet, not here.** A strip that is
 * not going to move must show all eight marks rather than the four that fit,
 * so it wraps and drops the second copy — a layout decision, and CSS is where
 * layout decisions belong. This component reads the same preference only to
 * know not to start.
 */
export function TrustStripMarquee() {
  useTravel();
  useTextFallbackForMissingLogos();
  return null;
}

function useTravel() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>('.logos-rail');
    const track = rail?.querySelector<HTMLElement>('.logos-track');
    const row = track?.querySelector<HTMLElement>('.logos-row');
    if (!rail || !track || !row) return;

    if (prefersReducedMotion()) return;

    const width = row.getBoundingClientRect().width;
    if (width === 0) return;

    // Enough copies of the row to cover the rail and one more to follow the
    // last off the end. Two were enough for the eight marks the strip shipped
    // with, whose row is wider than any rail; a strip of two marks (ticket 20
    // lets an Editor keep as few as one) is a short row that would otherwise
    // drag a band of empty bar across the screen behind it.
    const rows = () => track.querySelectorAll<HTMLElement>('.logos-row');
    const needed = Math.max(2, Math.ceil(rail.getBoundingClientRect().width / width) + 1);
    for (let index = rows().length; index < needed; index += 1) {
      const copy = row.cloneNode(true) as HTMLElement;
      copy.classList.add('copy');
      copy.setAttribute('aria-hidden', 'true');
      // The marks in a copy are decoration, and its links are already in the
      // tab order once, a row above.
      for (const mark of copy.querySelectorAll('img')) mark.setAttribute('alt', '');
      for (const link of copy.querySelectorAll('a')) link.setAttribute('tabindex', '-1');
      track.append(copy);
    }

    // Right-to-left lays the second copy out to the *left* of the first, so
    // the track has to travel right to bring it into view; left-to-right is
    // the mirror of that. Getting the sign wrong does not look like a bug —
    // it looks like a strip that scrolls into empty space once and stops.
    const towards = getComputedStyle(document.documentElement).direction === 'rtl' ? 1 : -1;

    const context = gsap.context(() => {
      // One row's width, whatever the track holds: the copy behind the first
      // arrives exactly where the first began, which is the seam. Measured in
      // pixels rather than as a share of the track, so adding a copy above
      // cannot change where the loop closes.
      const travel = gsap.to(track, {
        x: width * towards,
        duration: width / TRAVEL_SPEED,
        ease: 'none',
        repeat: -1,
      });

      const pause = () => travel.pause();
      const resume = () => travel.resume();
      rail.addEventListener('mouseenter', pause);
      rail.addEventListener('mouseleave', resume);

      return () => {
        rail.removeEventListener('mouseenter', pause);
        rail.removeEventListener('mouseleave', resume);
      };
    }, rail);

    return () => context.revert();
  }, []);
}

/**
 * A mark that does not arrive leaves the company unnamed, which is the one
 * thing this strip exists to do. Both cases are covered: an image that had
 * already failed before this ran — which is what happens to a cached failure,
 * where no `error` event is coming — and one that fails afterwards.
 */
function useTextFallbackForMissingLogos() {
  useEffect(() => {
    const slots = [...document.querySelectorAll<HTMLElement>('.logos .slot')];

    const undo = slots.map((slot) => {
      const mark = slot.querySelector('img');
      const name = slot.querySelector('b');
      if (!mark || !name) return () => {};

      const fallBackToText = () => {
        mark.hidden = true;
        name.hidden = false;
      };

      if (mark.complete && mark.naturalWidth === 0) fallBackToText();
      mark.addEventListener('error', fallBackToText);

      return () => {
        mark.removeEventListener('error', fallBackToText);
        mark.hidden = false;
        name.hidden = true;
      };
    });

    return () => undo.forEach((restore) => restore());
  }, []);
}
