'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * How far a visitor has to pan before the hint has done its work. Far enough
 * that a thumb resting on the picture, or a page scroll that drifts, does not
 * count; near enough that the first real swipe does.
 */
const SWIPED = 24;

/**
 * Sent to a panning box when the Screen mock in it is replaced by another: the
 * home page's six units share one box, and choosing a unit shows a screen the
 * visitor has not swiped yet. The box goes back to where panning begins and
 * the hint shows again, so each screen is met as the first one was.
 */
export const SCREEN_MOCK_CHANGED = 'screen-mock-changed';

/**
 * The box a Screen mock pans in on a phone, and the hint that says it can be
 * swiped (ticket 77).
 *
 * At 700px and narrower a Screen mock is drawn 1040px wide in a box that pans
 * sideways (tickets 08 and 12). Nothing said so, and a visitor took the third
 * of the screen they could see for the whole of it. So the box fades out each
 * edge that has more of the screen behind it, and the hint sits over the foot
 * of the picture until the visitor has swiped once.
 *
 * The box and the hint are both in the first response; this only keeps three
 * facts about the box current as it is panned — whether there is more before
 * it, whether there is more after it, and whether it has been swiped — and the
 * stylesheet draws the fades and fades the hint from those
 * (`src/styles/screen-mocks.css`). Before this runs, the box is drawn as it
 * rests: at the edge where panning begins, more to come.
 *
 * **The hint is hidden from screen readers.** It is an instruction for a
 * thumb, and the picture's description already says what the screen shows
 * (ADR-0002), which is what a screen reader needs and gets.
 *
 * Above 700px nothing pans, and the stylesheet shows neither the hint nor a
 * fade.
 *
 * **DIVERGENCE FROM THE REFERENCE SITE, deliberate:** it pans the same box
 * with neither a hint nor a fade. The founder asked for both on 23 September
 * 2026, when a phone showed a third of a screen and said nothing about the
 * rest.
 */
export function ScreenMockPan({
  className,
  hint,
  children,
}: {
  /** The panning box's own class, which the page's stylesheet sizes it by. */
  className: string;
  /** The hint's words, or `null` where the page's language has none published yet. */
  hint: string | null;
  children: ReactNode;
}) {
  const pan = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = pan.current;
    if (!box) return;

    const read = () => {
      // Right to left, `scrollLeft` runs from 0 to minus the hidden width, so
      // how far along the box is panned is its size either way.
      const hidden = box.scrollWidth - box.clientWidth;
      const along = Math.abs(box.scrollLeft);
      box.dataset.moreStart = String(along > 1);
      box.dataset.moreEnd = String(hidden - along > 1);
      if (!box.dataset.swiped && along > SWIPED) box.dataset.swiped = 'true';
    };
    const changed = () => {
      delete box.dataset.swiped;
      box.scrollTo({ left: 0, behavior: 'instant' });
      read();
    };

    read();
    box.addEventListener('scroll', read, { passive: true });
    box.addEventListener(SCREEN_MOCK_CHANGED, changed);
    // Turning a phone, or a window crossing 700px, changes how much is hidden.
    window.addEventListener('resize', read);

    return () => {
      box.removeEventListener('scroll', read);
      box.removeEventListener(SCREEN_MOCK_CHANGED, changed);
      window.removeEventListener('resize', read);
      delete box.dataset.moreStart;
      delete box.dataset.moreEnd;
      delete box.dataset.swiped;
    };
  }, []);

  return (
    <>
      <div ref={pan} className={className} data-pan="">
        {children}
      </div>
      {/* A span, not a paragraph: the pages' own rules for a paragraph in a
          journey panel or a role would set its margins, ink and size. */}
      {hint ? (
        <span className="pan-hint" aria-hidden="true">
          <svg className="pan-hint-i" viewBox="0 0 20 12" width="18" height="11" focusable="false">
            <path d="M1 6h18M5 2 1 6l4 4M15 2l4 4-4 4" />
          </svg>
          {hint}
        </span>
      ) : null}
    </>
  );
}
