import Image from 'next/image';
import type { Media } from '@/payload-types';
import { findScreenMock, screenMockImagePath, type ScreenMock } from '@/screen-mocks/registry';

export type ScreenMockPictureContent = {
  /** Which Screen mock, by its id in `src/screen-mocks/registry.ts`. */
  readonly mock: ScreenMock['id'];
  /** What it shows, in words: the picture's `alt` and the caption under it (ADR-0002). */
  readonly description: string;
  /** The picture an Editor put in place of the exported image, in the same shape (ticket 57); `null` for the export. */
  readonly replacement: Media | null;
};

/**
 * A Screen mock's picture alone: an Editor's replacement where there is one
 * (ticket 57), and otherwise ticket 05's exported image. Both are drawn in the
 * mock's 1440×900 box, which the admin holds a replacement to.
 *
 * Either way the picture names its mock (`data-screen-mock`), which is how the
 * check on exported images tells a replaced mock from one still exported
 * (`tests/e2e/screen-mocks.spec.ts`).
 *
 * The export goes through `next/image`, which serves a size for the screen
 * asking. A replacement is already a set of sizes, made when it was uploaded
 * (`collections/media.ts`), so the browser is handed those to choose from.
 */
export function ScreenMockImage({
  content,
  sizes,
  eager = false,
  className,
}: {
  content: ScreenMockPictureContent;
  sizes: string;
  /** Fetched at once, at low priority, rather than when it nears the window. */
  eager?: boolean;
  className?: string;
}) {
  const entry = findScreenMock(content.mock);
  if (!entry) throw new Error(`No Screen mock called "${content.mock}" in src/screen-mocks/registry.ts`);
  const loading = eager ? { loading: 'eager', fetchPriority: 'low' } as const : {};

  const replacement = content.replacement;
  if (replacement?.url) {
    const copies = [replacement.sizes?.small, replacement.sizes?.medium, replacement.sizes?.large].flatMap((copy) =>
      copy?.url && copy.width ? [`${copy.url} ${copy.width}w`] : [],
    );
    if (replacement.width) copies.push(`${replacement.url} ${replacement.width}w`);
    return (
      <img
        className={className}
        data-screen-mock={entry.id}
        src={replacement.url}
        srcSet={copies.join(', ') || undefined}
        alt={content.description}
        width={entry.width}
        height={entry.height}
        sizes={sizes}
        {...loading}
      />
    );
  }

  return (
    <Image
      className={className}
      data-screen-mock={entry.id}
      src={screenMockImagePath('ar', entry.id)}
      alt={content.description}
      width={entry.width}
      height={entry.height}
      sizes={sizes}
      {...loading}
    />
  );
}

/**
 * A Screen mock on the product page: its picture in the Reference site's
 * `.win`, and under it the caption ADR-0002 requires.
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
  return (
    <>
      <div className="win">
        <div className="vs-shot-wrap">
          <ScreenMockImage className="vs-shot" content={content} sizes={sizes} eager />
        </div>
      </div>
      <p className="shot-cap" aria-hidden="true">
        {content.description}
      </p>
    </>
  );
}
