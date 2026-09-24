import { getImageProps } from 'next/image';
import type { ReactNode } from 'react';
import { ScreenMockPan } from '@/components/screen-mock-pan';
import { ScreenMockWhole } from '@/components/screen-mock-whole';
import { getSwipeHint, getWholeScreenWords } from '@/content/site-words';
import type { Locale } from '@/lib/locales';
import type { Media } from '@/payload-types';
import {
  findScreenMock,
  PHONE_CROP,
  phoneCropImagePath,
  screenMockImagePath,
  type ScreenMock,
} from '@/screen-mocks/registry';

/**
 * How wide a Phone crop is drawn: across the page's column, 20px in from
 * either edge (`responsive.css`), and only ever at 700px and narrower. Its
 * copies are chosen for this, not for the whole screen's far wider box.
 */
const PHONE_CROP_SIZES = 'calc(100vw - 40px)';

export type ScreenMockPictureContent = {
  /** Which Screen mock, by its id in `src/screen-mocks/registry.ts`. */
  readonly mock: ScreenMock['id'];
  /** The language of the page it is on, whose exported image it shows (ticket 41). */
  readonly locale: Locale;
  /** What it shows, in words: the picture's `alt` and the caption under it (ADR-0002). */
  readonly description: string;
  /**
   * The picture an Editor put in place of the exported image for this
   * language's pages, in the same shape (tickets 57, 41); `null` for the export.
   */
  readonly replacement: Media | null;
  /**
   * The Phone crop an Editor uploaded beside it for this language's pages, in
   * the exported crop's shape (ticket 79); `null` for none.
   */
  readonly phoneCrop: Media | null;
};

/** An image an Editor uploaded, with its file. */
type UploadedImage = Media & { url: string };

/**
 * An uploaded image as the browser is offered it: every copy made of it when
 * it was uploaded (`collections/media.ts`), and the upload itself, by width.
 */
function uploadedSrcSet(image: UploadedImage): string {
  const copies = [image.sizes?.small, image.sizes?.medium, image.sizes?.large].flatMap((copy) =>
    copy?.url && copy.width ? [`${copy.url} ${copy.width}w`] : [],
  );
  if (image.width) copies.push(`${image.url} ${image.width}w`);
  return copies.join(', ') || image.url;
}

/** An image field's value with a file behind it, or `null`. */
function uploaded(image: Media | null): UploadedImage | null {
  return image?.url ? (image as UploadedImage) : null;
}

/**
 * A Screen mock's picture alone: an Editor's replacement where there is one
 * (ticket 57), and otherwise ticket 05's exported image in the page's own
 * language (ticket 41) — an English page never shows the Arabic screens. Both
 * are drawn in the mock's 1440×900 box, which the admin holds a replacement to.
 *
 * Either way the picture names its mock (`data-screen-mock`), which is how the
 * check on exported images tells a replaced mock from one still exported
 * (`tests/e2e/screen-mocks.spec.ts`).
 *
 * The export goes through `next/image`, which serves a size for the screen
 * asking. A replacement is already a set of sizes, made when it was uploaded
 * (`collections/media.ts`), so the browser is handed those to choose from.
 *
 * **On a phone it is its Phone crop** (ticket 78, ADR-0022): at 700px and
 * narrower the browser is offered the crop instead of the whole screen, and
 * fetches only that; the picture is marked `data-phone-crop`, which the
 * stylesheet draws it in the crop's shape by; and a button over it opens the
 * whole screen (`screen-mock-whole.tsx`) — the replacement, where there is
 * one. Which crop (ticket 79):
 *
 * - the one an Editor uploaded for this language, if there is one;
 * - otherwise the exported one, while the screen is not replaced;
 * - otherwise none. An exported crop would show the screen that was replaced,
 *   so a phone is shown the replacement whole, to swipe (ticket 77).
 *
 * A language whose words for the button are not published yet has no crop
 * either, and is swiped the same way.
 */
export async function ScreenMockImage({
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
  const replacement = uploaded(content.replacement);
  const uploadedCrop = uploaded(content.phoneCrop);
  const exported = screenMockImagePath(content.locale, entry.id);

  // The whole screen, as every width above a phone's shows it.
  const wholeScreen = { alt: content.description, width: entry.width, height: entry.height, sizes, ...loading };
  const screen = replacement
    ? { ...wholeScreen, src: replacement.url, srcSet: uploadedSrcSet(replacement) }
    : getImageProps({ ...wholeScreen, src: exported }).props;

  const hasCrop = !!uploadedCrop || !replacement;
  const wholeWords = hasCrop ? await getWholeScreenWords(content.locale) : null;
  if (!wholeWords) return <img {...screen} className={className} data-screen-mock={entry.id} />;

  const cropSrcSet = uploadedCrop
    ? uploadedSrcSet(uploadedCrop)
    : getImageProps({
        src: phoneCropImagePath(content.locale, entry.id),
        alt: content.description,
        width: PHONE_CROP.width,
        height: PHONE_CROP.height,
        sizes: PHONE_CROP_SIZES,
      }).props.srcSet;

  return (
    <>
      <picture>
        <source
          media="(max-width: 700px)"
          srcSet={cropSrcSet}
          sizes={PHONE_CROP_SIZES}
          width={PHONE_CROP.width}
          height={PHONE_CROP.height}
        />
        {/* The whole screen as it is drawn without a `<picture>` round it:
            `next/image`'s own props for an export, from `getImageProps`. */}
        <img {...screen} className={className} data-screen-mock={entry.id} data-phone-crop="" />
      </picture>
      <ScreenMockWhole
        src={replacement?.url ?? exported}
        width={entry.width}
        height={entry.height}
        description={content.description}
        words={wholeWords}
      />
    </>
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
        <PanningScreen locale={content.locale} className="vs-shot-wrap">
          <ScreenMockImage className="vs-shot" content={content} sizes={sizes} eager />
        </PanningScreen>
      </div>
      <p className="shot-cap" aria-hidden="true">
        {content.description}
      </p>
    </>
  );
}

/**
 * The box a Screen mock pans in on a phone, with the hint that says it can be
 * swiped over its foot (ticket 77), in the page's language. The hint's words
 * are the CMS's, with the other words every page shares.
 *
 * Its parent is the frame the hint is placed in, and the stylesheet positions
 * the hint against it (`src/styles/screen-mocks.css`).
 */
export async function PanningScreen({
  locale,
  className,
  children,
}: {
  locale: Locale;
  /** The panning box's own class, which the page's stylesheet sizes it by. */
  className: string;
  children: ReactNode;
}) {
  return (
    <ScreenMockPan className={className} hint={await getSwipeHint(locale)}>
      {children}
    </ScreenMockPan>
  );
}
