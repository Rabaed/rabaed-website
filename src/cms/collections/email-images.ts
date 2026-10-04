import type { CollectionConfig } from 'payload';
import { signedIn } from '../access';
import { localEmailImageDirectory } from '../environment';
import { FORMS_GROUP } from '../globals/form-settings';

/**
 * The images the confirmation email shows: its banner and any picture in its
 * text (ADR-0028). A library of their own, apart from the site's images,
 * because those are stored as WebP (`./media.ts`) and Outlook on Windows
 * shows no WebP in an email. These are kept as the JPEG, PNG or GIF they were
 * uploaded as, with one copy at most 1200 pixels wide — twice the email's
 * width, for a sharp picture on a phone — that the email shows.
 *
 * Anyone may read one: the applicant's mail client fetches it, signed in to
 * nothing. No SVG, which no mail client shows.
 */
export const EmailImages: CollectionConfig = {
  slug: 'email-images',
  labels: {
    singular: { ar: 'صورة بريد', en: 'Email image' },
    plural: { ar: 'صور البريد', en: 'Email images' },
  },
  admin: {
    group: FORMS_GROUP,
    description: {
      ar: 'صور رسالة التأكيد: شعارها وما يُضاف داخل نصها. JPEG أو PNG أو GIF، لأن Outlook لا يعرض صور WebP في البريد.',
      en: 'Images for the confirmation email: its banner and pictures in its text. JPEG, PNG or GIF, since Outlook shows no WebP in an email.',
    },
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  hooks: {
    /**
     * Each file named `email-…` before it is written: the bucket is the one
     * the site's images and sharing images are kept in, side by side, and a
     * PNG of these and a sharing image uploaded under one name would
     * otherwise take the same name there, the second overwriting the first.
     */
    beforeOperation: [
      ({ operation, req }) => {
        const file = req.file;
        if ((operation === 'create' || operation === 'update') && file && !file.name.startsWith('email-')) file.name = `email-${file.name}`;
      },
    ],
  },
  upload: {
    staticDir: localEmailImageDirectory(),
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    // No `formatOptions`: each is kept in the format it arrived in.
    imageSizes: [{ name: 'email', width: 1200, withoutEnlargement: true }],
    adminThumbnail: 'email',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      maxLength: 160,
      label: { ar: 'وصف الصورة', en: 'Alternative text' },
      admin: {
        description: {
          ar: 'يظهر مكان الصورة حين يحجبها بريد المستلم، وكثير من البريد يحجبها حتى يسمح بها القارئ.',
          en: 'Shown in the image’s place when the recipient’s mail blocks it, as much mail does until the reader allows images.',
        },
      },
    },
  ],
};
