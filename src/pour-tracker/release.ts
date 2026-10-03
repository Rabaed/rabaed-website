import { createHash } from 'node:crypto';

/**
 * The check a Pour Tracker **Release** (CONTEXT.md) passes before the CMS
 * keeps it (ticket 100, ADR-0024): its HTML file against the checksum file
 * its builder delivers with it.
 *
 * A release is accepted on its checksum, not on what is inside it. The
 * checksum proves the file is the one its builder delivered — undamaged, and
 * not mixed up with another — so the file is compared as the bytes it is,
 * never read as text: a file re-saved with its line endings changed is a
 * different file, and is refused.
 *
 * Pure, so the narrow seam the spec permits for pure calculation tests it
 * directly (`tests/unit/pour-tracker-release.spec.ts`).
 */

type Words = { readonly ar: string; readonly en: string };

export type CheckedRelease =
  | {
      readonly ok: true;
      /** The HTML file's SHA-256, in lower case. */
      readonly sha256: string;
      /** The release number its checksum file names, such as `2026-08-25.7`. */
      readonly releaseNumber: string;
    }
  | { readonly ok: false; readonly problem: Words };

const NOT_A_CHECKSUM: Words = {
  ar: 'لا يوجد في ملف التحقق رمز SHA-256. ارفع ملف ‎.sha256 المسلَّم مع الإصدار، الذي يبدأ برمز الملف المكوّن من 64 حرفاً.',
  en: 'This checksum file has no SHA-256 in it. Upload the .sha256 file delivered with the release, which begins with the file’s 64-character checksum.',
};

const NAMES_NO_RELEASE: Words = {
  ar: 'ملف التحقق لا يذكر رقم الإصدار، فلا يُعرف أي إصدار هذا. ارفع ملف ‎.sha256 المسلَّم مع الإصدار، وفيه سطر مثل «build 2026-09-23.3».',
  en: 'This checksum file names no release number, so there is no telling which release this is. Upload the .sha256 file delivered with the release, which has a line such as “build 2026-09-23.3”.',
};

const DOES_NOT_MATCH: Words = {
  ar: 'ملف HTML هذا لا يطابق ملف التحقق: ليس الملف الذي حُسب منه الرمز. ارفع ملفَي الإصدار نفسه، HTML و‎.sha256، كما سُلِّما دون تعديل.',
  en: 'This HTML file does not match its checksum file: it is not the file the checksum was made from. Upload the release’s own HTML and .sha256 files, exactly as they were delivered.',
};

/**
 * A SHA-256 at the start of a line, however its tool wrote it: `sha256sum`'s
 * two spaces, its ` *` for a file read as binary, or capitals. Sixty-four
 * hexadecimal digits and then the end of the word, so that 63 or 65 are not
 * read as a checksum.
 */
const SHA256_LINE = /^([0-9a-f]{64})(?=\s|$)/im;

/** The line that names the release: `build 2026-08-25.7`. */
const BUILD_LINE = /^build\s+(\S+)\s*$/im;

/** Whether `html` is the file `checksum` was made from, and which release it is. */
export function checkedRelease(html: Uint8Array, checksum: Uint8Array): CheckedRelease {
  const written = new TextDecoder().decode(checksum);
  const expected = SHA256_LINE.exec(written)?.[1]?.toLowerCase();
  if (!expected) return { ok: false, problem: NOT_A_CHECKSUM };

  const sha256 = createHash('sha256').update(html).digest('hex');
  if (sha256 !== expected) return { ok: false, problem: DOES_NOT_MATCH };

  // A release number names one file for good (ticket 101), so a release that
  // names none could never be told apart from the next.
  const releaseNumber = BUILD_LINE.exec(written)?.[1];
  if (!releaseNumber) return { ok: false, problem: NAMES_NO_RELEASE };

  return { ok: true, sha256, releaseNumber };
}

/** A release number in its builder's form: the day it was built, and that day's build. */
const RELEASE_NUMBER = /^(\d{4}-\d{2}-\d{2})\.(\d+)$/;

/**
 * Whether release `candidate` is older than release `than`: built on an
 * earlier day, or earlier on the same day. The day's build is a number, so
 * build 10 follows build 3. A number not in that form is compared as text,
 * digits as numbers, which orders it consistently if not meaningfully.
 */
export function isOlderRelease(candidate: string, than: string): boolean {
  const a = RELEASE_NUMBER.exec(candidate);
  const b = RELEASE_NUMBER.exec(than);
  if (!a || !b) return candidate.localeCompare(than, 'en', { numeric: true }) < 0;
  if (a[1] !== b[1]) return a[1] < b[1];
  return Number(a[2]) < Number(b[2]);
}
