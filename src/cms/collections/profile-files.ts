import path from 'node:path';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIError, type CollectionConfig, type PayloadRequest } from 'payload';
import { signedIn } from '../access';
import { localProfileFileDirectory, mediaBucket } from '../environment';
import { inAdminLanguage } from '../page-fields';
import { refreshSiteWhenUploadChanges } from '../revalidation';
import { uploadedFile } from '../uploaded-file';

/**
 * The largest file an Editor can upload here, in megabytes.
 *
 * A file goes from the Editor's browser straight to the bucket
 * (`clientUploads` in `payload.config.ts`), so the deployment's 4.5 MB limit
 * on a request does not apply. This one is the site's: a video on the page is
 * downloaded by every visitor who watches it. It stays under Payload's own
 * `upload.limits.fileSize`, 10 MB, past which Payload cuts a file short
 * instead of refusing it, so that a file too large is refused here, with a
 * message that says so.
 *
 * Ahmed's videos are 0.8 to 5.4 MB, and his PDFs about 1.7 to 2.0 MB.
 */
export const LARGEST_PROFILE_FILE_MB = 8;

const LARGEST_PROFILE_FILE_BYTES = LARGEST_PROFILE_FILE_MB * 1024 * 1024;

/**
 * The bucket's folder the files are kept in. The bucket is the one the site's
 * images are kept in, and a file there under a name an image already has
 * would replace it.
 */
export const PROFILE_FILE_FOLDER = 'profile';

/** What the admin says a video must be, wherever it asks for one. */
export const VIDEO_RULE = {
  ar: `ملف MP4 بترميز H.264 وبلا صوت، حجمه ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر. اضغط الفيديو قبل رفعه إن كان أكبر.`,
  en: `An MP4 in H.264 with no sound, ${LARGEST_PROFILE_FILE_MB} MB at most. Compress a larger video before uploading it.`,
} as const;

/** What the admin says a PDF must be. */
export const PDF_RULE = {
  ar: `ملف PDF حجمه ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر.`,
  en: `A PDF of ${LARGEST_PROFILE_FILE_MB} MB at most.`,
} as const;

/**
 * What the file's own first bytes say it is, rather than what the upload
 * says, as the sharing images are measured: an MP4 begins with its `ftyp`
 * box, four bytes in, and a PDF with `%PDF-`.
 */
function kindOf(start: Buffer): 'video' | 'pdf' | null {
  if (start.length >= 12 && start.toString('latin1', 4, 8) === 'ftyp') return 'video';
  if (start.toString('latin1', 0, 5) === '%PDF-') return 'pdf';
  return null;
}

/** As much of a file as `kindOf` reads. */
const START_BYTES = 12;

/**
 * A file the Editor's browser had already put in the bucket, taken out of it
 * again once it is refused: the bucket is public, and nothing else would
 * ever remove it.
 */
async function forgetSentFile(file: NonNullable<PayloadRequest['file']>): Promise<void> {
  const bucket = mediaBucket();
  if (!bucket || !('clientUploadContext' in file)) return;
  const context = file.clientUploadContext as { prefix?: string } | undefined;
  const client = new S3Client({
    endpoint: bucket.endpoint,
    region: bucket.region,
    // Supabase Storage answers S3 requests by path, not by subdomain.
    forcePathStyle: true,
    credentials: { accessKeyId: bucket.accessKeyId, secretAccessKey: bucket.secretAccessKey },
  });
  const key = path.posix.join(context?.prefix || PROFILE_FILE_FOLDER, file.name);
  await client.send(new DeleteObjectCommand({ Bucket: bucket.bucket, Key: key }));
}

/**
 * The Company profile's files, kept exactly as they were uploaded, under the
 * name they were uploaded with: the five before-and-after videos (ticket 108)
 * and the four Profile PDFs (ticket 104).
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
      ar: `فيديوهات «قبل وبعد» وملفات الـPDF الأربعة للملف التعريفي، محفوظة كما رُفعت. MP4 أو PDF، ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر للملف.`,
      en: `The Company profile’s before-and-after videos and its four PDFs, kept exactly as uploaded. An MP4 or a PDF, ${LARGEST_PROFILE_FILE_MB} MB at most each.`,
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
     */
    beforeOperation: [
      async ({ operation, req }) => {
        const file = req.file;
        if ((operation !== 'create' && operation !== 'update') || !file) return;
        const { start, size } = await uploadedFile(file, START_BYTES);
        const refusal = !kindOf(start)
          ? { ar: 'الملف يجب أن يكون MP4 أو PDF.', en: 'This must be an MP4 or a PDF.' }
          : size > LARGEST_PROFILE_FILE_BYTES
            ? {
                ar: `الملف ${LARGEST_PROFILE_FILE_MB} ميغابايت على الأكثر، وهذا ${(size / 1024 / 1024).toFixed(1)} ميغابايت. اضغطه ثم ارفعه من جديد.`,
                en: `A file can be ${LARGEST_PROFILE_FILE_MB} MB at most, and this one is ${(size / 1024 / 1024).toFixed(1)} MB. Compress it, then upload it again.`,
              }
            : null;
        if (!refusal) return;
        await forgetSentFile(file);
        throw new APIError(inAdminLanguage(req, refusal), 400, undefined, true);
      },
    ],
    /** The page that shows it is built again with it (ticket 84). */
    afterChange: [refreshSiteWhenUploadChanges],
    afterDelete: [refreshSiteWhenUploadChanges],
  },
};
