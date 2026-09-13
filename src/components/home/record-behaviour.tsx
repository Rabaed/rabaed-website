'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { recordAt, recordTypeAppearance } from '@/components/home/record-state';
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
 * - **The five kinds.** The card shows each kind's record in turn, and the
 *   stamp comes on at the end (`record-state.ts`). A change fades the old
 *   record out and brings the new one in step by step, as on the Reference
 *   site.
 *
 * Two things differ from the Reference site, on purpose:
 *
 * - **Below 981px the kinds follow the card across the window.** There the
 *   section is only as tall as the window, so the Reference site's cycle —
 *   from the section's top meeting the window's top to its bottom meeting the
 *   window's bottom — has no distance to run, and jumps from the first kind
 *   straight to the stamped last. Here the cycle runs while the card's centre
 *   crosses the middle 70% of the window, so every kind is seen.
 * - **With reduced motion nothing blends or fades.** A record changes at once,
 *   and the section and its card change colour together, in one step, 12.5%
 *   of the way in — half-way through the blend. A blend passes through a grey
 *   against which neither dark words nor light ones can be read; a step never
 *   does. The kinds still follow the scroll, because scrolling is the only way
 *   to reach them.
 *
 * `gsap.matchMedia` builds all of it for the window and the preference there
 * are, and takes it apart and builds it again when either changes. Teardown
 * reverts everything and puts the first record back, so React's development
 * double-invocation starts again from what the server drew.
 */
export function RecordBehaviour() {
  useEffect(() => {
    const section = document.getElementById('record');
    const card = section?.querySelector<HTMLElement>('.rec-card');
    const stamp = section?.querySelector<HTMLElement>('.stamp');
    if (!section || !card || !stamp) return;
    const chips = [...section.querySelectorAll<HTMLElement>('.rec-types span')];
    const records = [...section.querySelectorAll<HTMLElement>('.rec-entry')];
    if (records.length === 0 || chips.length !== records.length) return;

    const titleOf = (record: HTMLElement) => record.querySelector<HTMLElement>('.h b')!;
    const listOf = (record: HTMLElement) => record.querySelector<HTMLElement>('.tl')!;
    const stepsOf = (record: HTMLElement) => [...record.querySelectorAll<HTMLElement>('.tl > li')];
    const everyPart = records.flatMap((record) => [titleOf(record), listOf(record), ...stepsOf(record)]);

    gsap.registerPlugin(ScrollTrigger);

    // The steps of a new record slide in from 10px towards where a line
    // begins: from the left, reading right to left.
    const enterFrom = readingDirectionOf(section) === 'rtl' ? -10 : 10;
    const start = recordAt(0, records.length);
    let showing = start.chosen;
    let still = false;

    const reveal = (chosen: number) => {
      records.forEach((record, index) => {
        record.hidden = recordTypeAppearance(index, chosen).recordHidden;
      });
    };

    const choose = (chosen: number) => {
      if (chosen === showing) return;
      showing = chosen;
      chips.forEach((chip, index) => chip.classList.toggle('on', recordTypeAppearance(index, chosen).chipOn));

      // Whatever is fading stops where it is, so a change of mind half-way
      // through cannot be overtaken by the change it replaced.
      gsap.killTweensOf(everyPart);
      if (still) {
        gsap.set(everyPart, { clearProps: 'opacity,transform' });
        reveal(chosen);
        return;
      }

      const onShow = records.filter((record) => !record.hidden);
      gsap.to(
        onShow.flatMap((record) => [titleOf(record), listOf(record)]),
        {
          opacity: 0,
          duration: 0.16,
          onComplete: () => {
            gsap.set(everyPart, { clearProps: 'opacity,transform' });
            reveal(chosen);
            const record = records[chosen];
            gsap.fromTo(titleOf(record), { opacity: 0 }, { opacity: 1, duration: 0.22 });
            gsap.fromTo(
              stepsOf(record),
              { opacity: 0.2, x: enterFrom },
              { opacity: 1, x: 0, duration: 0.32, stagger: 0.09, ease: 'power2.out' },
            );
          },
        },
      );
    };

    const follow = (self: ScrollTrigger) => {
      const moment = recordAt(self.progress, records.length);
      choose(moment.chosen);
      stamp.classList.toggle('on', moment.stamped);
    };

    const media = gsap.matchMedia();

    media.add({ desktop: DESKTOP, narrow: NARROW, reduced: REDUCED_MOTION }, (context) => {
      const { desktop, reduced } = context.conditions as { desktop: boolean; reduced: boolean };
      still = reduced;

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
      showing = start.chosen;
      chips.forEach((chip, index) => chip.classList.toggle('on', recordTypeAppearance(index, start.chosen).chipOn));
      reveal(start.chosen);
      stamp.classList.toggle('on', start.stamped);
    };
  }, []);

  return null;
}
