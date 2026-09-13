/**
 * Has the visitor asked for less movement?
 *
 * The one place the query is written, because it is written in two languages:
 * the stylesheets carry `@media (prefers-reduced-motion: reduce)` for the
 * layout decisions, and every animated component asks this before it starts.
 * The two have to agree — a strip that stops moving but keeps the layout of a
 * moving strip shows four logos out of eight — and a media query mistyped in
 * one of them fails open, animating away with nothing to show for it.
 *
 * Answers `false` on the server, where nobody is watching yet. Components call
 * it from an effect, so that is never the answer that reaches a visitor.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(REDUCED_MOTION).matches;
}

/**
 * The query itself, for a component that has to follow the preference as it
 * changes rather than ask once — handed to `gsap.matchMedia`, which rebuilds
 * an animation when its answer does.
 */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
