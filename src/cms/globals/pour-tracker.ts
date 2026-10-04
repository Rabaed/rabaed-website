import { createHash } from 'node:crypto';
import {
  addDataAndFileToRequest,
  type Endpoint,
  type GlobalConfig,
  type Payload,
  type TextFieldSingleValidation,
} from 'payload';
import { signedIn } from '../access';
import { inAdminLanguage, type Words } from '../page-fields';
import { RELEASE_FIELD_LABELS } from '../pour-tracker-words';
import { documentStore } from '../../forms/documents';
import { codeCopyRelease } from '../../pour-tracker/code-copy';
import { checkedRelease, isOlderRelease } from '../../pour-tracker/release';

/**
 * The Pour Tracker **Release** (GLOSSARY.md) visitors download: Ahmed uploads
 * one here, and it reaches the download when he publishes it (ticket 100,
 * ADR-0024). While none is published, visitors receive the copy kept with the
 * site's code (`src/pour-tracker/fallback/`).
 *
 * The file itself is never a field. It goes to the private documents store —
 * a folder here, a private bucket on a deployment, never a public address —
 * under its SHA-256, and this entry names it. So a release is stored once,
 * exactly as delivered, and the CMS's history of this entry is a history of
 * which release was live.
 *
 * **Every save is checked, drafts included** (ticket 101). The admin's
 * Versions → Restore puts a version of a global back live at once, writing
 * the database directly with no check of its own; so every version it can
 * restore has to have been a checked one when it was saved.
 */

/**
 * What names a kept release: the entry's four fields, and the record of
 * release numbers. Its file is the one stored under `sha256`.
 */
export type KeptRelease = { sha256: string; releaseNumber: string; size: number; fileName: string };

/**
 * The upload's answer: the release kept, and whether it is older than what
 * visitors download now — allowed, since going back is Ahmed's call, but said
 * before he publishes it (ticket 101).
 */
export type UploadAnswer = KeptRelease & { olderThanLive: boolean };

/** Where a release's file is kept in the documents store: under its own checksum. */
export function releaseKey(sha256: string): string {
  return `pour-tracker/${sha256}.html`;
}

/**
 * What visitors download now, as the download route would send it: the
 * published release while its file is held and still matches its checksum,
 * and otherwise the code copy. `since` is when the published release went
 * out — the last time what is live changed, by Publish or by Restore — and
 * `missing` that a release is published whose file the store does not hold.
 */
export type VisitorsDownload = { releaseNumber: string; since: string | null; fromCms: boolean; missing: boolean };

export async function visitorsDownload(payload: Payload): Promise<VisitorsDownload> {
  const codeCopy = await codeCopyRelease();
  const published = await payload.findGlobal({ slug: 'pour-tracker', draft: false, depth: 0, overrideAccess: true });
  const fallBack = (missing: boolean) => ({ releaseNumber: codeCopy.releaseNumber, since: null, fromCms: false, missing });
  if (!published.sha256 || !published.releaseNumber) return fallBack(false);
  const bytes = await documentStore()?.get(releaseKey(published.sha256));
  if (!bytes || createHash('sha256').update(bytes).digest('hex') !== published.sha256) return fallBack(true);
  return { releaseNumber: published.releaseNumber, since: published.updatedAt ?? null, fromCms: true, missing: false };
}

const NOT_SIGNED_IN: Words = {
  ar: 'سجّل الدخول إلى لوحة التحكم لرفع إصدار.',
  en: 'Sign in to the admin to upload a release.',
};

const TWO_FILES: Words = {
  ar: 'الإصدار ملفان معاً: ملف HTML وملف التحقق ‎.sha256 المسلَّم معه. ارفعهما كليهما.',
  en: 'A release is two files together: the HTML file and the .sha256 checksum file delivered with it. Upload both.',
};

const TOO_LARGE: Words = {
  ar: 'أحد الملفين أكبر من 10 ميغابايت، أكبر بكثير من أي إصدار. تأكد أنك اخترت ملفَي الإصدار.',
  en: 'One of the files is larger than 10 MB, far larger than any release. Check that you picked the release’s two files.',
};

/** A release number already naming another file: said with the number, so Ahmed knows which. */
function clash(releaseNumber: string): Words {
  return {
    ar: `رقم الإصدار ${releaseNumber} يدل على ملف آخر من قبل. رقم الإصدار يدل على ملف واحد إلى الأبد: إن كان هذا إصداراً جديداً فله رقم جديد.`,
    en: `Release ${releaseNumber} already names a different file. A release number names one file for good: if this is a new build, it needs a new number.`,
  };
}

const NOWHERE_TO_KEEP: Words = {
  ar: 'لا يوجد على هذا الخادم مكان آمن لحفظ الإصدار، فلم يُحفظ. أبلغ المطوّر.',
  en: 'There is nowhere safe to keep a release on this server, so it was not kept. Tell the developer.',
};

const NOT_UPLOADED: Words = {
  ar: 'لا يوجد إصدار مرفوع بهذا الرمز وهذا الرقم. ارفع ملفَي الإصدار أولاً، ثم انشره.',
  en: 'No release with this checksum and this release number has been uploaded. Upload the release’s two files first, then publish it.',
};

/**
 * The entry may only name a release the CMS checked and kept: a checksum and
 * a release number that its record holds together, with the file in the
 * store. So no save — through the admin or the API, draft or published —
 * can name a checksum typed in, one whose upload was refused, or a release
 * under another release's number. An entry naming nothing is the code copy.
 */
const namesAKeptRelease: TextFieldSingleValidation = async (value, { req, siblingData }) => {
  const releaseNumber = (siblingData as { releaseNumber?: string | null } | undefined)?.releaseNumber;
  if (!value) return releaseNumber ? inAdminLanguage(req, NOT_UPLOADED) : true;

  const recorded = await req.payload.find({
    collection: 'pour-tracker-releases',
    where: { sha256: { equals: value } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });
  if (recorded.docs[0]?.releaseNumber !== releaseNumber) return inAdminLanguage(req, NOT_UPLOADED);

  const store = documentStore();
  if (!store) return inAdminLanguage(req, NOWHERE_TO_KEEP);
  if (!(await store.get(releaseKey(value)))) return inAdminLanguage(req, NOT_UPLOADED);
  return true;
};

type Uploaded = { data: Buffer; name: string; truncated?: boolean };

/** One uploaded file of a field's, however many were sent under its name. */
function onlyFile(files: unknown): Uploaded | null {
  const file = Array.isArray(files) ? files[0] : files;
  return file && typeof file === 'object' && 'data' in file ? (file as Uploaded) : null;
}

/** The file the record of release numbers holds under `releaseNumber`, if any. */
async function recordedUnder(payload: Payload, releaseNumber: string): Promise<string | null> {
  const known = await payload.find({
    collection: 'pour-tracker-releases',
    where: { releaseNumber: { equals: releaseNumber } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return known.docs[0]?.sha256 ?? null;
}

/**
 * The upload: both files of a release, checked against each other and against
 * the record of release numbers before anything is kept. A pair that does not
 * match, or that claims a number already naming another file, is refused, and
 * nothing is stored. A pair that passes is stored and recorded, and its details
 * are answered for the entry to name — it still waits for Publish, like every
 * other change.
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
    // Past the upload limit, the parser cuts a file short rather than refusing
    // it, and a cut file would be refused as not matching its checksum.
    if (html.truncated || checksum.truncated) return Response.json({ problem: TOO_LARGE }, { status: 413 });

    const bytes = new Uint8Array(html.data);
    const checked = checkedRelease(bytes, new Uint8Array(checksum.data));
    if (!checked.ok) return Response.json({ problem: checked.problem }, { status: 400 });

    // A release number names one file for good (ticket 101): the code copy's
    // number as much as any upload's. Checked before anything is kept.
    const { releaseNumber, sha256 } = checked;
    const codeCopy = await codeCopyRelease();
    const recorded = await recordedUnder(req.payload, releaseNumber);
    const named = releaseNumber === codeCopy.releaseNumber ? codeCopy.sha256 : recorded;
    if (named && named !== sha256) return Response.json({ problem: clash(releaseNumber) }, { status: 409 });

    const store = documentStore();
    if (!store) return Response.json({ problem: NOWHERE_TO_KEEP }, { status: 503 });
    await store.put(releaseKey(sha256), bytes, 'text/html');

    const kept: KeptRelease = { sha256, releaseNumber, size: bytes.byteLength, fileName: html.name };
    if (!recorded) {
      try {
        await req.payload.create({ collection: 'pour-tracker-releases', data: kept, overrideAccess: true });
      } catch (error) {
        // Another upload recorded the number in between: the record's unique
        // index refused this one. Whether that is a clash is the record's say.
        const now = await recordedUnder(req.payload, releaseNumber);
        if (!now) throw error;
        if (now !== sha256) return Response.json({ problem: clash(releaseNumber) }, { status: 409 });
      }
    }

    const live = await visitorsDownload(req.payload);
    const answer: UploadAnswer = { ...kept, olderThanLive: isOlderRelease(releaseNumber, live.releaseNumber) };
    return Response.json(answer);
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
    // Drafts are checked as well as Publish: Restore puts any saved version
    // back live without checking it (see above).
    drafts: { validate: true },
    max: 100,
  },
  endpoints: [uploadRelease],
  fields: [
    {
      // What visitors download now, what waits for Publish, and the code copy (ticket 101).
      name: 'releases',
      type: 'ui',
      admin: { components: { Field: '/cms/components/pour-tracker-releases-panel#PourTrackerReleasesPanel' } },
    },
    {
      // The two file pickers, and the buttons that check and keep a release or remove it.
      name: 'release',
      type: 'ui',
      admin: { components: { Field: '/cms/components/pour-tracker-release#PourTrackerRelease' } },
    },
    {
      name: 'sha256',
      type: 'text',
      label: RELEASE_FIELD_LABELS.sha256,
      admin: { readOnly: true },
      validate: namesAKeptRelease,
    },
    { name: 'releaseNumber', type: 'text', label: RELEASE_FIELD_LABELS.releaseNumber, admin: { readOnly: true } },
    { name: 'size', type: 'number', label: RELEASE_FIELD_LABELS.size, admin: { readOnly: true } },
    { name: 'fileName', type: 'text', label: RELEASE_FIELD_LABELS.fileName, admin: { readOnly: true } },
  ],
};
