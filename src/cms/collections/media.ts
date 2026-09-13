import type { CollectionConfig, ImageUploadFormatOptions } from 'payload';
import { signedIn } from '../access';
import { localMediaDirectory } from '../environment';

/**
 * WebP rather than AVIF. Every browser the site supports shows it, and it
 * encodes several times faster — which matters because the conversion runs
 * inside the upload request, on a serverless function with a time limit.
 */
const WEBP: ImageUploadFormatOptions = { format: 'webp', options: { quality: 82 } };

/**
 * Every image Ahmed uploads (spec: user story 47). Whatever arrives — a PNG
 * from a designer, a JPEG off a phone — is stored as WebP, alongside three
 * narrower copies for the browser to choose between. A size wider than the
 * original is not made: enlarging a photograph only makes it heavier.
 *
 * SVG is not accepted. An SVG is a document that can carry script, and served
 * from the site's own domain it would run with the site's authority. If the
 * Trust strip needs vector logos (ticket 20), that is a decision to make there
 * with a sanitiser, not a default to inherit here.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { ar: 'صورة', en: 'Image' },
    plural: { ar: 'الصور', en: 'Images' },
  },
  access: {
    // Images are published by being placed on a page; the files themselves
    // are public.
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  upload: {
    staticDir: localMediaDirectory(),
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
    formatOptions: WEBP,
    imageSizes: [
      { name: 'small', width: 480, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'medium', width: 960, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'large', width: 1600, withoutEnlargement: true, formatOptions: WEBP },
    ],
    adminThumbnail: 'small',
  },
  fields: [
    {
      // Spec: every image has an `alt`. Required here so the page never has
      // to invent one.
      name: 'alt',
      type: 'text',
      required: true,
      label: { ar: 'وصف الصورة (لقارئات الشاشة)', en: 'Alternative text' },
    },
  ],
};
