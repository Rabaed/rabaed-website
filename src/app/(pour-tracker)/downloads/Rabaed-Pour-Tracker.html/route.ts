import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import config from '@payload-config';
import { getPayload } from 'payload';
import { releaseKey } from '@/cms/globals/pour-tracker';
import { documentStore } from '@/forms/documents';

/**
 * The Pour Tracker a visitor downloads (tickets 18 and 49), at the address the
 * tool page's form links to.
 *
 * A route rather than a file in `public/`, because what it sends is a choice
 * (ADR-0024): the release Ahmed has published from the CMS, or — while there
 * is none — the copy kept with the site's code. A file in `public/` would be
 * served ahead of any route at its address, and the choice could never be
 * made.
 *
 * The code copy is read off disk, as the Screen mock studio reads its markup,
 * and `outputFileTracingIncludes` in `next.config.ts` puts it in the server
 * bundle beside this route. It is sent as the bytes it is: a release is
 * shipped exactly as delivered (ticket 49), so nothing here reads it as text.
 */
const CODE_COPY = path.join(process.cwd(), 'src', 'pour-tracker', 'fallback', 'index.html');

/** The name it is saved under — the Reference site's, and the one the form and its email give. */
const DOWNLOAD_NAME = 'Rabaed-Pour-Tracker.html';

/**
 * Asked for at the moment it is downloaded, never built ahead: once a
 * published release can replace the code copy, the very next download has to
 * be that release, with no cached copy in between.
 */
export const dynamic = 'force-dynamic';

/**
 * The release published in the CMS, or `null` for the code copy.
 *
 * The download can never be empty (ADR-0024), so anything short of the right
 * file sends the code copy instead: no release published, its file not in the
 * documents store, a file that no longer matches the checksum it was kept
 * under, or a CMS that could not be asked. Each but the first is logged, since
 * each means visitors are not getting what Ahmed published.
 */
async function publishedRelease(): Promise<Uint8Array<ArrayBuffer> | null> {
  let payload;
  try {
    payload = await getPayload({ config });
    const entry = await payload.findGlobal({ slug: 'pour-tracker', draft: false, depth: 0 });
    if (!entry.sha256) return null;

    const bytes = await documentStore()?.get(releaseKey(entry.sha256));
    if (!bytes) {
      payload.logger.error(`The published Pour Tracker release ${entry.releaseNumber} is not in the documents store; sending the code copy.`);
      return null;
    }
    if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
      payload.logger.error(`The published Pour Tracker release ${entry.releaseNumber} no longer matches its checksum; sending the code copy.`);
      return null;
    }
    return new Uint8Array(bytes);
  } catch (error) {
    const why = 'The published Pour Tracker release could not be read; sending the code copy.';
    if (payload) payload.logger.error({ err: error }, why);
    else console.error(why, error);
    return null;
  }
}

export async function GET() {
  const bytes = (await publishedRelease()) ?? new Uint8Array(await readFile(CODE_COPY));
  return new Response(bytes, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': String(bytes.byteLength),
      // Saved, never opened as a page on the site.
      'Content-Disposition': `attachment; filename="${DOWNLOAD_NAME}"`,
      // Never indexed, so a search result cannot hand it out past the form
      // ticket 30 puts in front of it — though anyone given the link can
      // still fetch it.
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  });
}
