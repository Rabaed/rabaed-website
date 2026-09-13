/**
 * Opens the site in preview, where pages show saved drafts instead of what is
 * published (spec: user story 41). The admin's Preview button comes here.
 *
 * Next's guide secures this with a secret shared between CMS and site. The CMS
 * here *is* the site, so the editor's own login is checked instead: nothing to
 * leak, and nothing that works for someone who is not signed in.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { getPayload } from 'payload';

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response('Sign in to the admin to preview.', { status: 401 });

  (await draftMode()).enable();
  redirect(sitePath(request.nextUrl.searchParams.get('path')));
}

/**
 * A path on this site, never another. `//evil.example` looks like a path and
 * is an address on another host, and so are `/\evil.example` and a slash, a
 * tab and a slash — browsers read a backslash as a slash and drop tabs. Rather
 * than list the tricks, the path is resolved the way a browser would resolve
 * it, and refused unless it stays on this site.
 */
function sitePath(path: string | null): string {
  const here = 'https://this-site.invalid';
  if (!path?.startsWith('/')) return '/';
  try {
    const resolved = new URL(path, here);
    return resolved.origin === here ? `${resolved.pathname}${resolved.search}${resolved.hash}` : '/';
  } catch {
    return '/';
  }
}
