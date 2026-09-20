import type { CollectionConfig } from 'payload';
import { signedIn } from '../access';
import { localSharingImageDirectory } from '../environment';

/**
 * The picture a page shows when its link is shared — on WhatsApp, on LinkedIn,
 * in a search result's card (ticket 26).
 *
 * A collection of its own rather than a folder in `media`, because a sharing
 * image is the one picture on this site that is not for the site to draw:
 *
 *  - **It is never re-encoded.** `media` stores everything as WebP, which is
 *    right for a photograph on a page and wrong here: WhatsApp and several
 *    other places that unfurl a link fetch the file themselves and show
 *    nothing when it is not a PNG or a JPEG.
 *  - **It is never resized.** The narrower copies `media` makes are for a
 *    browser to choose between; nothing chooses here, and a card is drawn
 *    from the one file named in the tag.
 *  - **It is one exact size.** 1200×630 is what the places that unfurl links
 *    crop to, and a picture of another shape is cropped by each of them
 *    differently — which is the one thing a sharing image must not be.
 *
 * `scripts/export-brand-images.mjs` draws the site's own, `public/og-rabaed.png`,
 * which every page falls back to.
 */
export const SHARING_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const SharingImages: CollectionConfig = {
  slug: 'sharing-images',
  labels: {
    singular: { ar: 'صورة مشاركة', en: 'Sharing image' },
    plural: { ar: 'صور المشاركة', en: 'Sharing images' },
  },
  access: {
    // The file is fetched by whatever is unfurling the link, which is signed
    // in to nothing.
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  upload: {
    staticDir: localSharingImageDirectory(),
    // PNG alone: a JPEG unfurls as well, but the site's own image is a PNG
    // and one kind of file is one thing to check.
    mimeTypes: ['image/png'],
    // No `formatOptions` and no `imageSizes`: what is uploaded is what is
    // served, for the reasons above.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: { ar: 'وصف الصورة (لمن لا تظهر له)', en: 'Alternative text' },
      admin: {
        description: {
          ar: 'ما تقوله الصورة، لمن يسمع الرابط بدل أن يراه.',
          en: 'What the picture says, for anyone who hears the link rather than sees it.',
        },
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        // Payload measures the file before this runs, so the size is here to
        // check — and a picture of the wrong shape is refused rather than
        // cropped differently by every place that unfurls it.
        const { width, height } = data ?? {};
        if (width === undefined || height === undefined) return data;
        if (width === SHARING_IMAGE_SIZE.width && height === SHARING_IMAGE_SIZE.height) return data;

        const message =
          req?.i18n?.language === 'en'
            ? `A sharing image must be exactly ${SHARING_IMAGE_SIZE.width}×${SHARING_IMAGE_SIZE.height} pixels. This one is ${width}×${height}.`
            : `صورة المشاركة يجب أن تكون ${SHARING_IMAGE_SIZE.width}×${SHARING_IMAGE_SIZE.height} بكسل بالضبط. هذه ${width}×${height}.`;
        throw new Error(message);
      },
    ],
  },
};
