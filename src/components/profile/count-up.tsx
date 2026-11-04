'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** How long a figure takes to count up to its value: Ahmed's 1.3 seconds. */
const DURATION = 1300;

/** How much of a figure must be on screen before it starts: Ahmed's 60%. */
const THRESHOLD = 0.6;

/**
 * A figure as written, split round its number, and how to write a number on
 * the way up the way the figure writes its own: «35%» counts 0 to 35 before a
 * «%»; «1,250+» counts with its thousands set off; «2.5x» keeps one decimal.
 * `null` for a figure with no number in it, which has nothing to count.
 */
function counting(figure: string): { readonly at: (share: number) => string } | null {
  const match = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s.exec(figure);
  if (!match) return null;
  const [, before, number, after] = match as unknown as [string, string, string, string];
  const value = Number(number.replaceAll(',', ''));
  if (!Number.isFinite(value)) return null;
  const decimals = number.split('.')[1]?.length ?? 0;
  const write = (each: number) =>
    number.includes(',')
      ? each.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : each.toFixed(decimals);
  // The last frame is the figure exactly as written.
  return { at: (share) => (share >= 1 ? figure : `${before}${write(value * share)}${after}`) };
}

/**
 * Counts every `[data-count-up]` figure in the section `#<section>` up from
 * nothing to its value as it comes into view (ticket 105), as Ahmed's profile
 * does. Renders nothing.
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
 * read a zero. It is counted in the text React rendered, never in place of it,
 * so React still holds the text it wrote.
 */
export function CountUp({ section }: { section: string }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const within = document.getElementById(section);
    if (!within) return;

    const frames = new Set<number>();
    const waiting = new Map<Element, { text: Text; figure: string; at: (share: number) => string }>();

    const count = ({ text, at }: { text: Text; at: (share: number) => string }) => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION);
        // Ahmed's easing: fast, settling into the value.
        text.data = at(progress < 1 ? 1 - (1 - progress) ** 3 : 1);
        if (progress < 1) frames.add(requestAnimationFrame(step));
      };
      frames.add(requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const figure = entry.isIntersecting ? waiting.get(entry.target) : undefined;
          if (!figure) continue;
          observer.unobserve(entry.target);
          count(figure);
        }
      },
      { threshold: THRESHOLD },
    );

    for (const element of within.querySelectorAll('[data-count-up]')) {
      const text = element.firstChild;
      if (!(text instanceof Text) || element.getBoundingClientRect().top < window.innerHeight) continue;
      const figure = text.data;
      const at = counting(figure)?.at;
      if (!at) continue;
      waiting.set(element, { text, figure, at });
      text.data = at(0);
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      for (const frame of frames) cancelAnimationFrame(frame);
      // Every figure back at its value, however far it had counted.
      for (const { text, figure } of waiting.values()) text.data = figure;
    };
  }, [section]);

  return null;
}
