'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * How far down the window an element's top edge has to come before it rises
 * in: 90%, the Reference site's `top 90%`.
 */
const ARRIVES_AT = 0.9;

/**
 * `.reveal`: an element that rises 28px into place and fades in the first time
 * it scrolls into view. Mark any element with the class and this picks it up.
 * Renders nothing.
 *
 * **It hides elements from here, not from the stylesheet — a deliberate change
 * from the Reference site.** The Reference site sets `.reveal { opacity: 0 }`
 * in CSS and relies on its script to undo it, so with JavaScript off, or while
 * the script is still downloading, every revealed sentence is invisible. The
 * rebuild promises complete content in the first response (ADR-0001), so the
 * page arrives with everything visible.
 *
 * **Only what the visitor has not reached yet is then held back.** An element
 * already on screen or scrolled past when this runs — the page reloaded
 * part-way down, opened from a link to a section, or with its scroll position
 * restored — is left exactly as it arrived. Hiding it then, to fade it back in,
 * would make a sentence the visitor was already reading vanish in front of
 * them.
 *
 * With reduced motion nothing is held back at all: the spec asks that content
 * stay "complete and legible", and a fade-in is exactly the motion that was
 * turned down.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element, index) => {
        if (element.getBoundingClientRect().top < window.innerHeight * ARRIVES_AT) return;

        gsap.fromTo(
          element,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            // Neighbours revealed together arrive a beat apart, in threes.
            delay: (index % 3) * 0.08,
            scrollTrigger: { trigger: element, start: `top ${ARRIVES_AT * 100}%`, once: true },
          },
        );
      });
    });

    return () => context.revert();
  }, []);

  return null;
}
