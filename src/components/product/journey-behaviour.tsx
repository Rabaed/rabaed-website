'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { readingDirectionOf } from '@/lib/reading-direction';

/**
 * The window the journey pins in: the Reference site's gate, exactly. Below it
 * the stylesheet stacks the panels, and there is nothing here to undo.
 *
 * The height matters as much as the width (reference/HANDOFF.md, 7.3): on a
 * window shorter than 551px a panel sized to fit it would be too short to read.
 */
const PINS = '(min-width: 981px) and (min-height: 551px)';

/**
 * Pixels of scrolling per pixel the track travels — the Reference site's
 * `JOURNEY_SCROLL`, which it turned down from 1 to shorten the page without
 * changing the animation.
 */
const SCROLL_PER_TRAVEL = 0.6;

/** Seconds the track takes to catch up with the scroll, so it glides rather than jerks. */
const CATCH_UP = 0.8;

/**
 * Sets the journey travelling: while the visitor scrolls through it, the
 * section holds at the top of the window and the track of panels slides
 * sideways, with the progress marks lighting up as it goes. Attached to markup
 * the server already sent. Renders nothing.
 *
 * **The spec calls this the most fragile part of the site**, and every line
 * below guards one of the ways it breaks.
 *
 * - **Direction.** Right to left, the panels after the first are laid out to
 *   its *left*, so the track travels right to bring them in. It reads the
 *   direction the server wrote rather than assuming Arabic.
 * - **The room under the heading.** Panels start below the heading, whose
 *   height depends on the font, the window and how the words wrap. It is
 *   measured and handed to the stylesheet as `--jh` — before every refresh, so
 *   a window resized or a webfont arriving is measured again before anything
 *   that depends on it.
 * - **Everything below the pin.** Pinning adds thousands of pixels of
 *   scrolling to the page. Triggers created earlier — the header's colour
 *   toggle is one, and its component runs first — measured the page without
 *   them, and would fire half-way across the journey. `refreshPriority` makes
 *   this pin measure first and the refresh after creating it re-measures the
 *   rest.
 * - **Crossing the gate.** `gsap.matchMedia` builds the pin when the window
 *   fits and takes it apart, pin spacer and all, when it stops fitting.
 * - **Development.** Teardown reverts everything, so React running this twice
 *   cannot leave two pins stacked in one page.
 *
 * **Reduced motion does not stop it**, as on the Reference site. The track only
 * moves while the visitor scrolls it, and a section that pinned for some
 * visitors and stacked for others would be two layouts to keep right; ticket
 * 36's accessibility pass is where that decision belongs if it is revisited.
 */
export function JourneyBehaviour() {
  useEffect(() => {
    const section = document.getElementById('journey');
    const head = section?.querySelector<HTMLElement>('.j-head');
    const track = section?.querySelector<HTMLElement>('.track');
    if (!section || !head || !track) return;
    const marks = [...section.querySelectorAll<HTMLElement>('.dots i')];

    gsap.registerPlugin(ScrollTrigger);

    // The heading floats over the top of a pinned section; stacked, it takes
    // its own place and the panels need no room reserved. The breathing space
    // under it is the Reference site's: less on a short window.
    const reserveRoomForHeading = () => {
      const floating = getComputedStyle(head).position === 'absolute';
      const room = head.offsetTop + head.offsetHeight + (window.innerHeight <= 700 ? 18 : 26);
      section.style.setProperty('--jh', floating ? `${room}px` : '0px');
    };

    const lightUpTo = (last: number) => marks.forEach((mark, index) => mark.classList.toggle('on', index <= last));

    reserveRoomForHeading();
    ScrollTrigger.addEventListener('refreshInit', reserveRoomForHeading);

    const towards = readingDirectionOf(section) === 'rtl' ? 1 : -1;
    const media = gsap.matchMedia();

    media.add(PINS, () => {
      reserveRoomForHeading();
      // Everything past the first window's width. A function, so that every
      // refresh measures it again rather than keeping the first answer.
      const travel = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => towards * travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${travel() * SCROLL_PER_TRAVEL}`,
          pin: true,
          scrub: CATCH_UP,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1,
          // One mark per panel, lit up to the panel nearest in view.
          onUpdate: (self) => lightUpTo(Math.round(self.progress * (marks.length - 1))),
        },
      });

      return () => lightUpTo(0);
    });

    ScrollTrigger.refresh();

    // The heading's height, and so every length above, changes once the
    // webfont replaces the fallback.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      media.revert();
      ScrollTrigger.removeEventListener('refreshInit', reserveRoomForHeading);
      section.style.removeProperty('--jh');
      lightUpTo(0);
    };
  }, []);

  return null;
}
