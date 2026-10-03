import type { Words } from './page-fields';

/**
 * Words the Pour Tracker's screen says in more than one place: its upload, its
 * account of its releases, and the fields that name a release in the entry
 * and in the record of release numbers (tickets 100 and 101). Kept here so
 * the places stay in step. Words only: the admin's browser loads it too.
 */

export const RELEASE_FIELD_LABELS = {
  sha256: { ar: 'رمز التحقق (SHA-256)', en: 'Checksum (SHA-256)' },
  releaseNumber: { ar: 'رقم الإصدار', en: 'Release number' },
  size: { ar: 'الحجم (بايت)', en: 'Size (bytes)' },
  fileName: { ar: 'اسم الملف المرفوع', en: 'File uploaded' },
} satisfies Record<string, Words>;

/** Said of a release older than what visitors download now — allowed, but said (ticket 101). */
export const OLDER_THAN_LIVE: Words = {
  ar: 'أقدم من الإصدار الذي يحمّله الزوار الآن',
  en: 'older than the release visitors download now',
};

/** What visitors download while no release is published. */
export const THE_CODE_COPY: Words = {
  ar: 'النسخة المحفوظة مع الموقع',
  en: 'the copy kept with the code',
};
