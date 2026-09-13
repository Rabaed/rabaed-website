'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SEAM_AT_REST,
  SEAM_KEY_STEP,
  clampSeam,
  facesAt,
  turnedOver,
  verdictFor,
  type Verdict,
} from '@/components/home/before-after-seam';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Makes the before-and-after comparison move, attached to markup the server
 * already sent. Renders nothing.
 *
 * - **Pressing** anywhere on the comparison brings the seam there, and
 *   **dragging** carries it — by mouse, pen or finger.
 * - **The arrow keys**, on the handle, move it 6% at a time.
 * - **A one-time hint** the first time the section comes into view: the seam
 *   jumps to the right, sweeps all the way left, and settles in the middle, to
 *   show what dragging does. Never with reduced motion (spec: Animation), and —
 *   **DIVERGENCE FROM THE REFERENCE SITE, deliberate** — never once the visitor
 *   has moved the seam themselves, and cut short if they take hold of it while
 *   it runs. The Reference site lets a sweep already under way wrench the seam
 *   back out of a visitor's hand; the card deck's nudge already gives way.
 *
 * Each step's column is measured once and again whenever the window changes
 * size, since the columns go from four across to two across below 981px.
 *
 * Teardown removes every listener, kills the hint and its trigger, and takes
 * the seam's drawing back off the page, so React's development double-invocation
 * starts again from what the server drew.
 */
export function BeforeAfterBehaviour() {
  useEffect(() => {
    const section = document.getElementById('ba');
    const comparison = section?.querySelector<HTMLElement>('.cmp');
    const handle = comparison?.querySelector<HTMLElement>('[role="slider"]');
    const usualTag = comparison?.querySelector<HTMLElement>('.cmp-tag.tb');
    const rabaedTag = comparison?.querySelector<HTMLElement>('.cmp-tag.ta');
    if (!section || !comparison || !handle || !usualTag || !rabaedTag) return;

    const steps = [...comparison.querySelectorAll<HTMLElement>('.cmp-col')].map((column) => ({
      column,
      usual: column.querySelector<HTMLElement>('.fb')!,
      rabaed: column.querySelector<HTMLElement>('.fa')!,
      centre: SEAM_AT_REST,
    }));
    const verdicts: Record<Verdict, HTMLElement | null> = {
      usual: section.querySelector('.cmp-verdict.bad'),
      rabaed: section.querySelector('.cmp-verdict.good'),
      between: section.querySelector('.cmp-verdict.mid'),
    };
    if (steps.length === 0) return;

    let seam = SEAM_AT_REST;
    let dragging = false;
    /** The visitor has moved the seam, so there is nothing left to hint at. */
    let touched = false;
    let hint: gsap.core.Timeline | null = null;

    /** Where each step's column's centre is, as a percentage across the comparison. */
    const measure = () => {
      const across = comparison.getBoundingClientRect();
      steps.forEach((step) => {
        const box = step.column.getBoundingClientRect();
        step.centre = ((box.left + box.width / 2 - across.left) / across.width) * 100;
      });
    };

    const paint = () => {
      let stepsOver = 0;
      steps.forEach((step) => {
        const turned = turnedOver(step.centre, seam);
        if (turned > 0.5) stepsOver += 1;
        const faces = facesAt(turned);
        Object.assign(step.rabaed.style, faces.rabaed);
        Object.assign(step.usual.style, faces.usual);
      });
      const verdict = verdictFor(stepsOver, steps.length);
      (Object.keys(verdicts) as Verdict[]).forEach((which) => {
        const element = verdicts[which];
        if (element) element.style.opacity = which === verdict ? '1' : '0';
      });
      // One tag at a time: each fades as its way leaves the comparison.
      const share = stepsOver / steps.length;
      rabaedTag.style.opacity = String(share);
      usualTag.style.opacity = String(1 - share);
    };

    /** Draws the seam at `position`, and everything it decides. The hint moves it this way: its positions are not the visitor's, so they are not announced. */
    const placeSeam = (position: number) => {
      seam = clampSeam(position);
      comparison.style.setProperty('--p', `${seam}%`);
      paint();
    };
    /** Moves the seam where the visitor put it, and tells assistive technology where that is. */
    const moveSeam = (position: number) => {
      placeSeam(position);
      handle.setAttribute('aria-valuenow', String(Math.round(seam)));
    };

    const takeHold = () => {
      touched = true;
      hint?.kill();
      hint = null;
    };

    const fromPointer = (event: PointerEvent) => {
      const across = comparison.getBoundingClientRect();
      moveSeam(((event.clientX - across.left) / across.width) * 100);
    };
    const onPointerDown = (event: PointerEvent) => {
      takeHold();
      dragging = true;
      comparison.classList.add('drag');
      comparison.setPointerCapture?.(event.pointerId);
      fromPointer(event);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (dragging) fromPointer(event);
    };
    const onRelease = () => {
      dragging = false;
      comparison.classList.remove('drag');
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      takeHold();
      moveSeam(seam + (event.key === 'ArrowLeft' ? -SEAM_KEY_STEP : SEAM_KEY_STEP));
    };
    const onResize = () => {
      measure();
      paint();
    };

    comparison.addEventListener('pointerdown', onPointerDown);
    comparison.addEventListener('pointermove', onPointerMove);
    comparison.addEventListener('pointerup', onRelease);
    comparison.addEventListener('pointercancel', onRelease);
    handle.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    measure();
    moveSeam(SEAM_AT_REST);

    // ---- the one-time hint ----
    gsap.registerPlugin(ScrollTrigger);
    const hintTrigger = prefersReducedMotion()
      ? null
      : ScrollTrigger.create({
          trigger: section,
          start: 'top 62%',
          once: true,
          onEnter: () => {
            if (touched) return;
            const sweep = { position: SEAM_AT_REST };
            hint = gsap
              .timeline({ delay: 0.3 })
              .set(sweep, { position: 100, onUpdate: () => placeSeam(100) })
              .to(sweep, { position: 0, duration: 1.8, ease: 'power2.inOut', onUpdate: () => placeSeam(sweep.position) })
              .to(sweep, { position: SEAM_AT_REST, duration: 0.8, ease: 'power2.out', onUpdate: () => placeSeam(sweep.position) }, '+=.35');
          },
        });

    return () => {
      hintTrigger?.kill();
      hint?.kill();
      comparison.removeEventListener('pointerdown', onPointerDown);
      comparison.removeEventListener('pointermove', onPointerMove);
      comparison.removeEventListener('pointerup', onRelease);
      comparison.removeEventListener('pointercancel', onRelease);
      handle.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);

      // Back to what the server drew: the seam at rest, drawn by the stylesheet.
      comparison.classList.remove('drag');
      comparison.style.setProperty('--p', `${SEAM_AT_REST}%`);
      handle.setAttribute('aria-valuenow', String(SEAM_AT_REST));
      for (const element of [usualTag, rabaedTag, ...Object.values(verdicts), ...steps.flatMap((step) => [step.usual, step.rabaed])]) {
        element?.style.removeProperty('opacity');
        element?.style.removeProperty('transform');
      }
    };
  }, []);

  return null;
}
