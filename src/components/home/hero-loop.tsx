'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import {
  HERO_JOURNEY,
  HERO_STATIONS,
  HERO_START,
  type HeroStatuses,
  type Station,
} from '@/components/home/hero-stations';
import { prefersReducedMotion } from '@/lib/motion';

/** Seconds, all of them the Reference site's own. */
const HOP = 1.05;
const PULSE = 0.95;
/** The pause after an arrival, long enough to read the status before the next move. */
const HOLD = 0.85;
/** The breath between one full round of the Record and the next. */
const BETWEEN_ROUNDS = 0.35;

/**
 * Sets the hero diagram going: a document hops from the Contractor to the
 * Consultant to the Owner and back, a ring pulses where it lands, and the
 * status pill says what just happened.
 *
 * Attached to markup the server already sent, so the diagram is complete
 * before this runs and stays complete if it never does. Renders nothing. What
 * the pill reads is handed down by `Hero`, since the words are the page's.
 *
 * **Reduced motion stops it before it starts.** The loop is the whole of this
 * component, and a hero that ran it slowly or once would still be a hero that
 * moves. What is left is the same picture, still, with the pill stating the
 * promise rather than a moment in a story the visitor will not see unfold.
 *
 * **The timeline is built inside a `gsap.context` and reverted on teardown**,
 * so React's development double-invocation cannot leave a second copy running
 * against the first (spec: Animation). Two copies would be hard to *see* —
 * they start together and write the same values — which is exactly why this
 * has to be right by construction rather than caught by looking.
 *
 * **Reverting is not quite the same as putting things back.** GSAP unwinds
 * each tween to the value it recorded, which is close but not identical to the
 * inline styles the server wrote — so the teardown reads those styles first
 * and restores them verbatim afterwards. Without it, development's second run
 * starts from whatever the first left behind rather than from the markup.
 */
export function HeroLoop({
  statuses,
  statusAtRest,
}: {
  /** What the pill reads at each step of the journey. */
  statuses: HeroStatuses;
  /** What it reads when the loop is not going to run. */
  statusAtRest: string;
}) {
  useEffect(() => {
    const art = document.getElementById('hero-art');
    const doc = document.getElementById('h-doc');
    const pulse = document.getElementById('h-pulse');
    const status = document.getElementById('h-status');
    if (!art || !doc || !pulse || !status) return;

    // The hero exactly as the server drew it, read before anything touches it.
    const asDrawn = {
      doc: doc.style.cssText,
      pulse: pulse.style.cssText,
      status: status.textContent,
    };
    const restore = () => {
      doc.style.cssText = asDrawn.doc;
      pulse.style.cssText = asDrawn.pulse;
      status.textContent = asDrawn.status;
    };

    if (prefersReducedMotion()) {
      status.textContent = statusAtRest;
      return restore;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: BETWEEN_ROUNDS });
      // A tween on a throwaway object: the timeline needs a gap of a known
      // length, and `.to({}, ...)` is how GSAP spells one.
      const hold = () => timeline.to({}, { duration: HOLD });

      let from: Station = HERO_START;
      timeline.set(status, { textContent: statuses[0] });
      hold();

      for (let step = 1; step < HERO_JOURNEY.length; step += 1) {
        const to = HERO_STATIONS[HERO_JOURNEY[step]];

        // `fromTo` rather than `to`: every position is stated outright, so a
        // repeat cannot drift from wherever the last round happened to leave
        // the document.
        //
        // `immediateRender: false` is what keeps that honest. A `fromTo`
        // applies its "from" the moment it is *created*, not when it starts —
        // so building three of them in a row leaves the document wherever the
        // last one begins, which is the Owner's tower. It sat there for the
        // first 0.85 seconds of every visit until this was found; the pulse
        // below carries the same flag for the same reason.
        timeline.fromTo(
          doc,
          { left: `${from.left}%`, top: `${from.top}%` },
          {
            left: `${to.left}%`,
            top: `${to.top}%`,
            duration: HOP,
            ease: 'power2.inOut',
            immediateRender: false,
          },
        );

        // The ring expands where the document lands, and the pill changes at
        // the same instant — `'<'` starts both with the arrival, not after it.
        timeline
          .set(pulse, { left: `${to.left}%`, top: `${to.top}%` })
          .fromTo(
            pulse,
            { opacity: 0.85, scale: 0.72 },
            { opacity: 0, scale: 1.35, duration: PULSE, ease: 'power2.out', immediateRender: false },
            '<',
          )
          .set(status, { textContent: statuses[step] }, '<');

        hold();
        from = to;
      }
    }, art);

    return () => {
      context.revert();
      restore();
    };
  }, [statuses, statusAtRest]);

  return null;
}
