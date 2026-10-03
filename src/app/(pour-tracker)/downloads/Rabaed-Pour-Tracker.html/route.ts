import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * The Pour Tracker a visitor downloads (tickets 18 and 49), at the address the
 * tool page's form links to.
 *
 * A route rather than a file in `public/`, because what it sends is a choice
 * (ADR-0024): the release Ahmed has published from the CMS, or — while there
 * is none — the copy kept with the site's code, which is all it sends so far.
 * A file in `public/` would be served ahead of any route at its address, and
 * the choice could never be made.
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

export async function GET() {
  const bytes = await readFile(CODE_COPY);
  return new Response(new Uint8Array(bytes), {
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
