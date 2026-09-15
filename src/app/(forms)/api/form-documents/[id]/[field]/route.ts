import config from '@payload-config';
import type { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import { isValidDocumentLink } from '@/forms/document-links';
import { documentStore } from '@/forms/documents';

/** Never kept by a browser or a proxy, and never indexed. */
const PRIVATE = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' };

/**
 * An applicant's document, for an editor (ADR-0004): the one way a document
 * leaves private storage.
 *
 * Two things are required, and either missing is enough to refuse. The link
 * must be one the admin made — signed, for this submission and this field, and
 * not yet expired (`src/forms/document-links.ts`) — so an address cannot be
 * guessed or reused. And whoever opens it must be signed in to the admin, so a
 * link that is forwarded or leaks is no use to anyone else.
 */
export async function GET(request: NextRequest, context: RouteContext<'/api/form-documents/[id]/[field]'>) {
  const { id, field } = await context.params;
  const query = request.nextUrl.searchParams;
  if (!/^\d+$/.test(id) || !isValidDocumentLink(id, field, query.get('expires'), query.get('signature'))) {
    return new Response('This link is not valid, or it has expired. Open the document again from the admin.', {
      status: 403,
      headers: PRIVATE,
    });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response('Sign in to the admin to open documents.', { status: 401, headers: PRIVATE });

  const submission = await payload.findByID({
    collection: 'form-submissions',
    id: Number(id),
    depth: 0,
    disableErrors: true,
    overrideAccess: false,
    user,
  });
  const kept = submission?.documents?.find((each) => each.field === field);
  const store = kept?.key ? documentStore() : null;
  const bytes = kept?.key && store ? await store.get(kept.key) : null;
  if (!kept || !bytes) return new Response('There is no such document.', { status: 404, headers: PRIVATE });

  return new Response(Buffer.from(bytes), {
    headers: {
      ...PRIVATE,
      'Content-Type': kept.contentType ?? 'application/octet-stream',
      'Content-Length': String(bytes.byteLength),
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(kept.fileName ?? 'document')}`,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
