import { APIError, type CollectionConfig, type ImageUploadFormatOptions } from 'payload';
import { signedIn } from '../access';
import { localMediaDirectory } from '../environment';
import { inAdminLanguage } from '../page-fields';
import { refreshSiteWhenImageChanges } from '../revalidation';

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
 * SVG is accepted, and is the one format stored as it arrived rather than as
 * WebP: a vector has no pixels to re-encode, and rasterising a client's logo
 * would throw away the reason it was sent as a vector. Payload resizes none of
 * it either (`canResizeImage`), so what is stored is the file itself — which
 * is why nothing is stored until `sanitisedSvg` has been through it
 * (ADR-0010). An SVG is a document that can carry script, and served from the
 * site's own domain it would run with the site's authority.
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
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'],
    formatOptions: WEBP,
    imageSizes: [
      { name: 'small', width: 480, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'medium', width: 960, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'large', width: 1600, withoutEnlargement: true, formatOptions: WEBP },
    ],
    adminThumbnail: 'small',
  },
  hooks: {
    // Every page that shows an image is marked stale when it changes (ticket 84).
    ...refreshSiteWhenImageChanges,
    /**
     * Before the file is written anywhere: an uploaded SVG is replaced by what
     * survives the sanitiser, and one with nothing left — or one carrying a
     * document declaration — is refused with the reason, in the Editor's own
     * language. A PNG or a JPEG passes straight through.
     *
     * Payload runs this before it writes anything (`generateFileData`), so a
     * refusal leaves no file behind. Were `useTempFiles` ever turned on, the
     * file would be on disk before this and the buffer this changes ignored:
     * the sanitiser would then have to read and write that file instead.
     */
    beforeOperation: [
      async ({ operation, req }) => {
        const file = req.file;
        if ((operation !== 'create' && operation !== 'update') || !file?.data) return;
        // What the file *is*, not what the upload said it was: a drawing sent
        // under a photograph's type would otherwise go by untouched.
        const written = file.data.toString('utf8');
        if (file.mimetype !== 'image/svg+xml' && !/^\s*(<\?xml|<!--|<svg[\s>])/i.test(written)) return;

        // Fetched here rather than imported at the top, so that jsdom — which
        // the sanitiser builds its DOM from, and which is a whole HTML engine —
        // is loaded by an SVG upload and by nothing else. Imported at the top it
        // would be loaded to *boot* the CMS, because this collection is part of
        // the Payload config: the admin, the CMS's own API and the form
        // pipeline would each drag it in before serving anything. That is not
        // hypothetical. It took the CMS off the internet (ticket 65).
        const { sanitisedSvg } = await import('../svg-sanitiser');

        const result = sanitisedSvg(written);
        if (!result.ok) throw new APIError(inAdminLanguage(req, result.problem), 400, undefined, true);

        file.data = Buffer.from(result.svg, 'utf8');
        file.size = file.data.byteLength;
      },
    ],
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
