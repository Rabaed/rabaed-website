import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { namedInChecksumFile } from './release';

/**
 * The copy of the Pour Tracker kept with the site's code: the fallback the
 * download sends while the CMS has no release published (ADR-0024), and a
 * release like any other — its number names its file for good (ticket 101).
 *
 * Read off disk where it is needed, as the download route reads the file
 * itself; `outputFileTracingIncludes` in `next.config.ts` puts it beside each
 * route that does. Imports are relative: the CMS loads it too.
 */
export const CODE_COPY_DIRECTORY = path.join(process.cwd(), 'src', 'pour-tracker', 'fallback');

/** The code copy's release number and checksum, as its checksum file names them. */
export async function codeCopyRelease(): Promise<{ releaseNumber: string; sha256: string }> {
  const { sha256, releaseNumber } = namedInChecksumFile(await readFile(path.join(CODE_COPY_DIRECTORY, 'index.html.sha256'), 'utf8'));
  if (!sha256 || !releaseNumber) throw new Error('The code copy’s checksum file names no checksum or no release number.');
  return { releaseNumber, sha256 };
}
