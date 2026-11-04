'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** How long a figure takes to count up to its value: Ahmed's 1.3 seconds. */
const DURATION = 1300;

/** How much of a figure must be on screen before it starts: Ahmed's 60%. */
const THRESHOLD = 0.6;

/**
 * A figure as written, split round its number: «35%» is `''`, 35 and `'%'`,
 * «1,250+» is `''`, 1250 and `'+'`. `null` for a figure with no number in it,
 * which has nothing to count.
 */
export function figureParts(figure: string): { before: string; value: number; after: string } | null {
  const match = /^(\D*?)(\d[\d,]*)(.*)$/s.exec(figure);
  if (!match) return null;
  const value = Number(match[2]!.replaceAll(',', ''));
  return Number.isFinite(value) ? { before: match[1]!, value, after: match[3]! } : null;
}

/** A number as the figures write it: Latin digits, thousands set off by commas. */
const written = (value: number) => Math.round(value).toLocaleString('en-US');

/**
 * Counts every `[data-count-up]` figure in `#<within>` up from nothing to its
 * value as it comes into view (ticket 105), as Ahmed's profile does. Renders
 * nothing.
 *
 * **The server's figure is the figure.** Every one arrives at its value, in
 * the first response (ADR-0001); this only takes one back to nothing while it
 * is still below the window, to count it up again when the visitor reaches it.
 * A figure already on screen, or scrolled past, keeps its value: counting it
 * would change a number the visitor may be reading. With reduced motion
 * nothing counts at all.
 *
 * What counts is the drawn figure only, which is hidden from screen readers;
 * each figure is also written out whole for them beside it, so nobody is ever
 * read a zero.
 */
export function CountUp({ within }: { within: string }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = document.getElementById(within);
    if (!section) return;

    const frames = new Set<number>();
    const counted = new Map<HTMLElement, string>();

    const count = (element: HTMLElement, parts: NonNullable<ReturnType<typeof figureParts>>) => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION);
        // Ahmed's easing: fast, settling into the value.
        const eased = 1 - (1 - progress) ** 3;
        element.textContent = `${parts.before}${written(parts.value * eased)}${parts.after}`;
        if (progress < 1) frames.add(requestAnimationFrame(step));
      };
      frames.add(requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const element = entry.target as HTMLElement;
          const parts = figureParts(counted.get(element) ?? '');
          if (parts) count(element, parts);
        }
      },
      { threshold: THRESHOLD },
    );

    for (const element of section.querySelectorAll<HTMLElement>('[data-count-up]')) {
      const figure = element.textContent ?? '';
      const parts = figureParts(figure);
      if (!parts || element.getBoundingClientRect().top < window.innerHeight) continue;
      counted.set(element, figure);
      element.textContent = `${parts.before}${written(0)}${parts.after}`;
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      for (const frame of frames) cancelAnimationFrame(frame);
      // Every figure back at its value, however far it had counted.
      for (const [element, figure] of counted) element.textContent = figure;
    };
  }, [within]);

  return null;
}
