'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { recordAt, transactionTypeAppearance } from '@/components/home/record-state';
import { REDUCED_MOTION } from '@/lib/motion';
import { readingDirectionOf } from '@/lib/reading-direction';

/** Where the box that holds still is the window's height, and the Reference site's own measure of the section applies. */
const DESKTOP = '(min-width: 981px)';
/** Everywhere else. Named as well, because `gsap.matchMedia` only builds when one of its conditions holds. */
const NARROW = '(max-width: 980px)';
/** Where the section switches from dark to light: half-way through the Reference site's blend. */
const LIT_FROM = '12.5% top';

/**
 * Sets the Record section moving as the visitor scrolls through it, attached to
 * markup the server already sent. Renders nothing.
 *
 * - **Dark to light.** 12.5% of the way in, the section and its card switch to
 *   the light treatment together, and back again above that point. The switch
 *   is the `lit` class; the stylesheet decides how it looks and how long it
 *   takes.
 * - **The five transaction types.** The card shows each type's trail in turn,
 *   and the stamp comes on at the end (`record-state.ts`). A change fades the
 *   old trail out and brings the new one in step by step, as on the Reference
 *   site. The types follow the stretch the section holds still for, which
 *   the stylesheet makes: from its top meeting the window's top to where it
 *   lets go.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate**, three times:
 *
 * - **Below 981px the section holds still too** (ticket 80, ADR-0021). The
 *   Reference site stops holding it there, so its cycle has no distance to
 *   run and a quick swipe passes the Record by. Here it holds for as far as
 *   on a desktop window, and the types follow the same stretch. The box that
 *   holds also carries the paragraph after the card, below the screen, so it
 *   lets go before the section's foot meets the window's by the paragraph's
 *   height, and the stretch is measured as the section less the box.
 * - **The section does not blend from dark to light under the scroll.** The
 *   Reference site scrubs its ground and its words towards each other over its
 *   first quarter, and they meet in a grey against which nothing can be read —
 *   1.1:1 at worst, for as long as the visitor stops there (ticket 69). Here
 *   the section switches at one point, 12.5% of the way in — half-way through
 *   the Reference site's blend — and the switch runs on its own for 0.4s, so
 *   the grey lasts that long and no scroll position can hold it. With reduced
 *   motion it happens in one step.
 * - **With reduced motion nothing fades.** A trail changes at once. The types
 *   still follow the scroll, because scrolling is the only way to reach them.
 *
 * `gsap.matchMedia` builds all of it for the window and the preference there
 * are, and takes it apart and builds it again when either changes. Teardown
 * reverts everything and puts the first trail back, so React's development
 * double-invocation starts again from what the server drew.
 */
export function RecordBehaviour() {
  useEffect(() => {
    const section = document.getElementById('record');
    const box = section?.querySelector<HTMLElement>('.sticky');
    const stamp = section?.querySelector<HTMLElement>('.stamp');
    if (!section || !box || !stamp) return;
    const chips = [...section.querySelectorAll<HTMLElement>('.rec-types span')];
    const trails = [...section.querySelectorAll<HTMLElement>('.rec-entry')];
    if (trails.length === 0 || chips.length !== trails.length) return;

    const titleOf = (trail: HTMLElement) => trail.querySelector<HTMLElement>('.h b')!;
    const listOf = (trail: HTMLElement) => trail.querySelector<HTMLElement>('.tl')!;
    const stepsOf = (trail: HTMLElement) => [...trail.querySelectorAll<HTMLElement>('.tl > li')];
    const everyPart = trails.flatMap((trail) => [titleOf(trail), listOf(trail), ...stepsOf(trail)]);

    gsap.registerPlugin(ScrollTrigger);

    // The steps of a new trail slide in from 10px towards where a line
    // begins: from the left, reading right to left.
    const enterFrom = readingDirectionOf(section) === 'rtl' ? -10 : 10;
    const start = recordAt(0, trails.length);
    let chosenNow = start.chosen;
    let reducedMotion = false;

    /** Marks the chip, and shows the trail, of the type `chosen` — at once. */
    const markChip = (chosen: number) =>
      chips.forEach((chip, index) => {
        chip.className = transactionTypeAppearance(index, chosen).chipClass ?? '';
      });
    const showTrail = (chosen: number) =>
      trails.forEach((trail, index) => {
        trail.hidden = transactionTypeAppearance(index, chosen).trailHidden;
      });

    const choose = (chosen: number) => {
      if (chosen === chosenNow) return;
      chosenNow = chosen;
      markChip(chosen);

      // Whatever is fading stops where it is, so a change of mind half-way
      // through cannot be overtaken by the change it replaced.
      gsap.killTweensOf(everyPart);
      if (reducedMotion) {
        gsap.set(everyPart, { clearProps: 'opacity,transform' });
        showTrail(chosen);
        return;
      }

      const inSight = trails.filter((trail) => !trail.hidden);
      gsap.to(
        inSight.flatMap((trail) => [titleOf(trail), listOf(trail)]),
        {
          opacity: 0,
          duration: 0.16,
          onComplete: () => {
            gsap.set(everyPart, { clearProps: 'opacity,transform' });
            showTrail(chosen);
            const trail = trails[chosen];
            gsap.fromTo(titleOf(trail), { opacity: 0 }, { opacity: 1, duration: 0.22 });
            gsap.fromTo(
              stepsOf(trail),
              { opacity: 0.2, x: enterFrom },
              { opacity: 1, x: 0, duration: 0.32, stagger: 0.09, ease: 'power2.out' },
            );
          },
        },
      );
    };

    const follow = (self: ScrollTrigger) => {
      const moment = recordAt(self.progress, trails.length);
      choose(moment.chosen);
      stamp.classList.toggle('on', moment.stamped);
    };

    const media = gsap.matchMedia();

    media.add({ desktop: DESKTOP, narrow: NARROW, reduced: REDUCED_MOTION }, (context) => {
      const { desktop, reduced } = context.conditions as { desktop: boolean; reduced: boolean };
      reducedMotion = reduced;

      ScrollTrigger.create({
        trigger: section,
        start: LIT_FROM,
        end: 'max',
        onToggle: (self) => section.classList.toggle('lit', self.isActive),
      });

      const cycle = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: desktop ? 'bottom bottom' : () => `+=${section.offsetHeight - box.offsetHeight}`,
        onUpdate: follow,
      });
      // A window resized past the breakpoint can leave the visitor anywhere in
      // the section, and a new trigger only reports a change of progress.
      follow(cycle);

      return () => section.classList.remove('lit');
    });

    // Below 981px the held stretch ends where the box, paragraph and all,
    // meets the section's foot, and the box's height moves when the webfont
    // arrives.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      media.revert();
      gsap.killTweensOf(everyPart);
      gsap.set(everyPart, { clearProps: 'opacity,transform' });
      chosenNow = start.chosen;
      markChip(start.chosen);
      showTrail(start.chosen);
      stamp.classList.toggle('on', start.stamped);
    };
  }, []);

  return null;
}
