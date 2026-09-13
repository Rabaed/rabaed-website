import Image from 'next/image';
import { SCREEN_MOCK_DESCRIPTIONS, type DescribedScreenMock } from '@/content/screen-mock-descriptions';
import { findScreenMock, screenMockImagePath } from '@/screen-mocks/registry';

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
export function ScreenMockPicture({ mock, sizes }: { mock: DescribedScreenMock; sizes: string }) {
  const entry = findScreenMock(mock);
  if (!entry) throw new Error(`No Screen mock called "${mock}" in src/screen-mocks/registry.ts`);
  const description = SCREEN_MOCK_DESCRIPTIONS[mock];

  return (
    <>
      <div className="win">
        <div className="vs-shot-wrap">
          <Image
            className="vs-shot"
            src={screenMockImagePath('ar', entry.id)}
            alt={description}
            width={entry.width}
            height={entry.height}
            sizes={sizes}
            loading="eager"
            fetchPriority="low"
          />
        </div>
      </div>
      <p className="shot-cap" aria-hidden="true">
        {description}
      </p>
    </>
  );
}
