import { APIError, type CollectionConfig } from 'payload';
import { signedIn } from '../access';
import { localProfileFileDirectory } from '../environment';
import { inAdminLanguage } from '../page-fields';
import { refreshSiteWhenImageChanges } from '../revalidation';

/**
 * The largest file an Editor can upload here, in megabytes. **This is
 * Vercel's limit, not the site's**: a request sent to a deployment carries at
 * most about 4.5 MB (Vercel Functions' request body limit), and an upload goes
 * up through one, so a larger file is refused before the CMS ever sees it,
 * with an error that says nothing useful. Held here a little under that, with
 * a message that does say, so that an Editor on a local machine, where the
 * limit is not, finds the same rule as on rabaedapp.com.
 *
 * Ahmed's videos are 0.8 to 5.4 MB, and his PDFs about 1.7 to 2.0 MB. His
 * largest video, Documents, is a default in `public/` and is never uploaded.
 */
export const LARGEST_PROFILE_FILE_MB = 4;

const LARGEST_PROFILE_FILE_BYTES = LARGEST_PROFILE_FILE_MB * 1024 * 1024;

/** What the admin says a video must be, wherever it asks for one. */
export const VIDEO_RULE = {
  ar: `ملف MP4 بترميز H.264 وبلا صوت، حجمه ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر: الموقع لا يستقبل ملفاً أكبر. اضغط الفيديو قبل رفعه إن كان أكبر.`,
  en: `An MP4 in H.264 with no sound, ${LARGEST_PROFILE_FILE_MB} MB at most: the site cannot take a larger file. Compress a larger video before uploading it.`,
} as const;

/** What the admin says a PDF must be. */
export const PDF_RULE = {
  ar: `ملف PDF حجمه ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر: الموقع لا يستقبل ملفاً أكبر.`,
  en: `A PDF of ${LARGEST_PROFILE_FILE_MB} MB at most: the site cannot take a larger file.`,
} as const;

/**
 * What the file's own first bytes say it is, rather than what the upload
 * says, as the sharing images are measured: an MP4 begins with its `ftyp`
 * box, four bytes in, and a PDF with `%PDF-`.
 */
function kindOf(data: Buffer): 'video' | 'pdf' | null {
  if (data.length >= 12 && data.toString('latin1', 4, 8) === 'ftyp') return 'video';
  if (data.toString('latin1', 0, 5) === '%PDF-') return 'pdf';
  return null;
}

/**
 * The Company profile's files, kept exactly as they were uploaded: the five
 * before-and-after videos (ticket 108) and the four Profile PDFs (ticket 104).
 *
 * A collection of its own because `media` turns every upload into WebP
 * (`./media.ts`): what is uploaded here is what is served, as the sharing
 * images are (`./sharing-images.ts`). No `formatOptions`, no `imageSizes`.
 * The videos' posters are pictures, and stay in `media`.
 *
 * Anyone may read one: a visitor's browser fetches it, signed in to nothing.
 * Payload serves each at `/api/profile-files/file/<name>`, a byte range at a
 * time when a browser asks for one, from the bucket or from the local folder.
 */
export const ProfileFiles: CollectionConfig = {
  slug: 'profile-files',
  labels: {
    singular: { ar: 'ملف الملف التعريفي', en: 'Company profile file' },
    plural: { ar: 'ملفات الملف التعريفي', en: 'Company profile files' },
  },
  admin: {
    description: {
      ar: `فيديوهات «قبل وبعد» وملفات الـPDF الأربعة للملف التعريفي، محفوظة كما رُفعت. MP4 أو PDF، ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر للملف: الموقع لا يستقبل ملفاً أكبر.`,
      en: `The Company profile’s before-and-after videos and its four PDFs, kept exactly as uploaded. An MP4 or a PDF, ${LARGEST_PROFILE_FILE_MB} MB at most each: the site cannot take a larger file.`,
    },
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  upload: {
    staticDir: localProfileFileDirectory(),
    mimeTypes: ['video/mp4', 'application/pdf'],
    // No `formatOptions` and no `imageSizes`: what is uploaded is what is served.
  },
  fields: [],
  hooks: {
    /**
     * Before anything is written or unwritten, for the reason the sharing
     * images give: a replacement refused any later would already have deleted
     * the file it replaces.
     *
     * Each file is named `profile-…` too: the bucket is the one the site's
     * images are kept in, and a name taken there would be overwritten.
     */
    beforeOperation: [
      ({ operation, req }) => {
        const file = req.file;
        if ((operation !== 'create' && operation !== 'update') || !file?.data) return;
        if (!kindOf(file.data)) {
          throw new APIError(inAdminLanguage(req, { ar: 'الملف يجب أن يكون MP4 أو PDF.', en: 'This must be an MP4 or a PDF.' }), 400, undefined, true);
        }
        if (file.data.length > LARGEST_PROFILE_FILE_BYTES) {
          const size = (file.data.length / 1024 / 1024).toFixed(1);
          throw new APIError(
            inAdminLanguage(req, {
              ar: `الملف ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر، وهذا ${size} ميغابايت. اضغطه ثم ارفعه من جديد.`,
              en: `A file can be ${LARGEST_PROFILE_FILE_MB} MB at most, and this one is ${size} MB. Compress it, then upload it again.`,
            }),
            400,
            undefined,
            true,
          );
        }
        if (!file.name.startsWith('profile-')) file.name = `profile-${file.name}`;
      },
    ],
    /** The page that shows it is built again with it (ticket 84). */
    afterChange: [refreshSiteWhenImageChanges],
    afterDelete: [refreshSiteWhenImageChanges],
  },
};
