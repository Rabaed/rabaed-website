'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { recordAt, transactionTypeAppearance } from '@/components/home/record-state';
import { REDUCED_MOTION } from '@/lib/motion';
import { readingDirectionOf } from '@/lib/reading-direction';

/** Where the section holds still while the visitor scrolls through it. */
const DESKTOP = '(min-width: 981px)';
/** Everywhere else. Named as well, because `gsap.matchMedia` only builds when one of its conditions holds. */
const NARROW = '(max-width: 980px)';

/**
 * Sets the Record section moving as the visitor scrolls through it, attached to
 * markup the server already sent. Renders nothing.
 *
 * - **Dark to light.** The section's ground and words blend to the light
 *   treatment over its first quarter, and the card to white from 12% to 32% —
 *   the Reference site's ranges, following the scroll exactly.
 * - **The five transaction types.** The card shows each type's trail in turn,
 *   and the stamp comes on at the end (`record-state.ts`). A change fades the
 *   old trail out and brings the new one in step by step, as on the Reference
 *   site.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate**, twice:
 *
 * - **Below 981px the types follow the card across the window.** There the
 *   section is only as tall as the window, so the Reference site's cycle —
 *   from the section's top meeting the window's top to its bottom meeting the
 *   window's bottom — has no distance to run, and jumps from the first type
 *   straight to the stamped last. Here the cycle runs while the card's centre
 *   crosses the middle 70% of the window, so every type is seen.
 * - **With reduced motion nothing blends or fades.** A trail changes at once,
 *   and the section and its card change colour together, in one step, 12.5%
 *   of the way in — half-way through the section's blend. A blend passes
 *   through a grey against which neither dark words nor light ones can be
 *   read; a step never does. The types still follow the scroll, because
 *   scrolling is the only way to reach them.
 *
 * `gsap.matchMedia` builds all of it for the window and the preference there
 * are, and takes it apart and builds it again when either changes. Teardown
 * reverts everything and puts the first trail back, so React's development
 * double-invocation starts again from what the server drew.
 */
export function RecordBehaviour() {
  useEffect(() => {
    const section = document.getElementById('record');
    const card = section?.querySelector<HTMLElement>('.rec-card');
    const stamp = section?.querySelector<HTMLElement>('.stamp');
    if (!section || !card || !stamp) return;
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

      if (reduced) {
        ScrollTrigger.create({
          trigger: section,
          start: '12.5% top',
          end: 'max',
          onToggle: (self) => section.classList.toggle('lit', self.isActive),
        });
      } else {
        gsap.to(section, {
          backgroundColor: '#FAFAF8',
          color: '#222222',
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: '25% top', scrub: true },
        });
        gsap.to(card, {
          backgroundColor: '#ffffff',
          borderColor: '#E3E1DC',
          ease: 'none',
          scrollTrigger: { trigger: section, start: '12% top', end: '32% top', scrub: true },
        });
      }

      const cycle = ScrollTrigger.create(
        desktop
          ? { trigger: section, start: 'top top', end: 'bottom bottom', onUpdate: follow }
          : { trigger: card, start: 'center 85%', end: 'center 15%', onUpdate: follow },
      );
      // A window resized past the breakpoint can leave the visitor anywhere in
      // the section, and a new trigger only reports a change of progress.
      follow(cycle);

      return () => section.classList.remove('lit');
    });

    // Every length above is measured against the section's height, which on a
    // narrow window is its content's, and that moves when the webfont arrives.
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
