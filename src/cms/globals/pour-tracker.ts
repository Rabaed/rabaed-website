import { addDataAndFileToRequest, type Endpoint, type GlobalConfig, type TextFieldSingleValidation } from 'payload';
import { signedIn } from '../access';
import { documentStore } from '../../forms/documents';
import { checkedRelease } from '../../pour-tracker/release';

/**
 * The Pour Tracker **Release** (CONTEXT.md) visitors download: Ahmed uploads
 * one here, and it reaches the download when he publishes it (ticket 100,
 * ADR-0024). While none is published, visitors receive the copy kept with the
 * site's code (`src/pour-tracker/fallback/`).
 *
 * The file itself is never a field. It goes to the private documents store —
 * a folder here, a private bucket on a deployment, never a public address —
 * under its SHA-256, and this entry names it. So a release is stored once,
 * exactly as delivered, and the CMS's history of this entry is a history of
 * which release was live: restoring an old version names its file again.
 */

type Words = { readonly ar: string; readonly en: string };

/** Where a release's file is kept in the documents store: under its own checksum. */
export function releaseKey(sha256: string): string {
  return `pour-tracker/${sha256}.html`;
}

const NOT_SIGNED_IN: Words = {
  ar: 'سجّل الدخول إلى لوحة التحكم لرفع إصدار.',
  en: 'Sign in to the admin to upload a release.',
};

const TWO_FILES: Words = {
  ar: 'الإصدار ملفان معاً: ملف HTML وملف التحقق ‎.sha256 المسلَّم معه. ارفعهما كليهما.',
  en: 'A release is two files together: the HTML file and the .sha256 checksum file delivered with it. Upload both.',
};

const NOWHERE_TO_KEEP: Words = {
  ar: 'لا يوجد على هذا الخادم مكان آمن لحفظ الإصدار، فلم يُحفظ. أبلغ المطوّر.',
  en: 'There is nowhere safe to keep a release on this server, so it was not kept. Tell the developer.',
};

const NOT_UPLOADED: Words = {
  ar: 'لا يوجد إصدار مرفوع بهذا الرمز. ارفع ملفَي الإصدار أولاً، ثم انشره.',
  en: 'No release with this checksum has been uploaded. Upload the release’s two files first, then publish it.',
};

/**
 * The entry may only name a file the store holds, so that what is published
 * is always a release that was checked and kept — never a checksum typed in,
 * or one whose upload was refused. Run on Publish: Payload does not validate
 * drafts, and a draft is sent to no one.
 */
const namesAKeptRelease: TextFieldSingleValidation = async (value, { req }) => {
  if (!value) return true;
  const words = req.i18n?.language === 'ar' ? 'ar' : 'en';
  const store = documentStore();
  if (!store) return NOWHERE_TO_KEEP[words];
  if (!/^[0-9a-f]{64}$/.test(value) || !(await store.get(releaseKey(value)))) return NOT_UPLOADED[words];
  return true;
};

/** One uploaded file of a field's, however many were sent under its name. */
function onlyFile(files: unknown): { data: Buffer; name: string } | null {
  const file = Array.isArray(files) ? files[0] : files;
  return file && typeof file === 'object' && 'data' in file ? (file as { data: Buffer; name: string }) : null;
}

/**
 * The upload: both files of a release, checked against each other before
 * anything is kept. A pair that does not match is refused, and nothing is
 * stored. A pair that does is stored, and its details are answered for the
 * entry to name — it still waits for Publish, like every other change.
 */
const uploadRelease: Endpoint = {
  path: '/release',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ problem: NOT_SIGNED_IN }, { status: 401 });

    await addDataAndFileToRequest(req);
    const html = onlyFile(req.files?.html);
    const checksum = onlyFile(req.files?.checksum);
    if (!html || !checksum) return Response.json({ problem: TWO_FILES }, { status: 400 });

    const bytes = new Uint8Array(html.data);
    const checked = checkedRelease(bytes, new Uint8Array(checksum.data));
    if (!checked.ok) return Response.json({ problem: checked.problem }, { status: 400 });

    const store = documentStore();
    if (!store) return Response.json({ problem: NOWHERE_TO_KEEP }, { status: 503 });
    await store.put(releaseKey(checked.sha256), bytes, 'text/html');

    return Response.json({
      sha256: checked.sha256,
      releaseNumber: checked.releaseNumber,
      size: bytes.byteLength,
      fileName: html.name,
    });
  },
};

export const PourTracker: GlobalConfig = {
  slug: 'pour-tracker',
  label: { ar: 'متتبّع الصبّات', en: 'Pour Tracker' },
  access: {
    read: signedIn,
    readVersions: signedIn,
    update: signedIn,
  },
  versions: {
    drafts: true,
    max: 100,
  },
  endpoints: [uploadRelease],
  fields: [
    {
      // The two file pickers and the button that checks and keeps a release.
      name: 'release',
      type: 'ui',
      admin: { components: { Field: '/cms/components/pour-tracker-release#PourTrackerRelease' } },
    },
    {
      name: 'sha256',
      type: 'text',
      label: { ar: 'رمز التحقق (SHA-256)', en: 'Checksum (SHA-256)' },
      admin: { readOnly: true },
      validate: namesAKeptRelease,
    },
    {
      name: 'releaseNumber',
      type: 'text',
      label: { ar: 'رقم الإصدار', en: 'Release number' },
      admin: { readOnly: true },
    },
    {
      name: 'size',
      type: 'number',
      label: { ar: 'الحجم (بايت)', en: 'Size (bytes)' },
      admin: { readOnly: true },
    },
    {
      name: 'fileName',
      type: 'text',
      label: { ar: 'اسم الملف المرفوع', en: 'File uploaded' },
      admin: { readOnly: true },
    },
  ],
};
