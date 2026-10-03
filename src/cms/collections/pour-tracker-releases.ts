import type { CollectionConfig } from 'payload';
import { signedIn } from '../access';

/**
 * Every Pour Tracker **Release** (CONTEXT.md) the CMS has kept, by its release
 * number (ticket 101, ADR-0024): what holds a release number to the one file
 * it names, for good. An upload whose number is here with another file is
 * refused; the same file under the same number is the same release.
 *
 * Kept apart from the Pour Tracker entry's history because that history is a
 * record of what was published, and only the last hundred saves of it: a
 * release uploaded and never saved, or saved long ago, would slip through it.
 *
 * Written only by the upload, through the local API. Hidden from the admin's
 * menu: it is bookkeeping, not something an Editor edits.
 */
export const PourTrackerReleases: CollectionConfig = {
  slug: 'pour-tracker-releases',
  labels: {
    singular: { ar: 'إصدار متتبّع الصبّات', en: 'Pour Tracker release' },
    plural: { ar: 'إصدارات متتبّع الصبّات', en: 'Pour Tracker releases' },
  },
  access: {
    read: signedIn,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: { hidden: true, useAsTitle: 'releaseNumber' },
  fields: [
    {
      name: 'releaseNumber',
      type: 'text',
      label: { ar: 'رقم الإصدار', en: 'Release number' },
      required: true,
      unique: true,
      index: true,
    },
    { name: 'sha256', type: 'text', label: { ar: 'رمز التحقق (SHA-256)', en: 'Checksum (SHA-256)' }, required: true },
    { name: 'size', type: 'number', label: { ar: 'الحجم (بايت)', en: 'Size (bytes)' }, required: true },
    { name: 'fileName', type: 'text', label: { ar: 'اسم الملف المرفوع', en: 'File uploaded' } },
  ],
};
