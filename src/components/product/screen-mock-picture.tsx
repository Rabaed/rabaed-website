import Image from 'next/image';
import { findScreenMock, screenMockImagePath, type ScreenMock } from '@/screen-mocks/registry';

export type ScreenMockPictureContent = {
  /** Which Screen mock, by its id in `src/screen-mocks/registry.ts`. */
  readonly mock: ScreenMock['id'];
  /** What it shows, in words: the picture's `alt` and the caption under it (ADR-0002). */
  readonly description: string;
};

/**
 * A Screen mock on the product page: ticket 05's exported picture in the
 * Reference site's `.win`, and under it the caption ADR-0002 requires.
 *
 * Two siblings rather than one box, so the parent decides how they share its
 * space — a journey panel gives the screen whatever height the caption leaves
 * it, a role lets both be as tall as they are.
 *
 * The caption is hidden from screen readers only because they already hear the
 * same words as the picture's description; announcing them twice would say
 * nothing new.
 *
 * **Loaded eagerly, at low priority.** A lazy picture is fetched when it nears
 * the window, and neither place this stands lets the browser see it coming: a
 * journey panel travels in from off the side of a clipped track, and a role is
 * `display: none` until its tab is chosen. Lazily, both would arrive blank and
 * fill in while the visitor watched. Low priority keeps them behind everything
 * the first screen needs.
 */
export function ScreenMockPicture({ content, sizes }: { content: ScreenMockPictureContent; sizes: string }) {
  const entry = findScreenMock(content.mock);
  if (!entry) throw new Error(`No Screen mock called "${content.mock}" in src/screen-mocks/registry.ts`);

  return (
    <>
      <div className="win">
        <div className="vs-shot-wrap">
          <Image
            className="vs-shot"
            src={screenMockImagePath('ar', entry.id)}
            alt={content.description}
            width={entry.width}
            height={entry.height}
            sizes={sizes}
            loading="eager"
            fetchPriority="low"
          />
        </div>
      </div>
      <p className="shot-cap" aria-hidden="true">
        {content.description}
      </p>
    </>
  );
}
