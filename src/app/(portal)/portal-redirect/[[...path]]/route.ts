import type { NextRequest } from 'next/server';
import { productAppUrl } from '@/lib/product-app';

/**
 * The product app's API at this domain, sent on to where the product app
 * answers now (ADR-0026).
 *
 * Reached only through the `/api/1.1/*` rewrite in `next.config.ts`. Every
 * other old address of the product app's is the proxy's (`src/proxy.ts`),
 * which asks the product app before forwarding; an API call is forwarded
 * without asking, because there is no page to ask about.
 */

/**
 * 307 until the cutover has been watched for a week, then 308.
 *
 * 308 is the honest answer — the portal has moved for good — but it is
 * cached by browsers indefinitely, and a wrong one cannot be taken back from
 * the machines that stored it. 307 says the same thing to a visitor and
 * costs only the lost SEO signal, which a week does not spend.
 *
 * Both preserve the method and the body, which 301 and 302 do not: a POST
 * that arrives here has to still be a POST when it reaches the portal.
 */
const STATUS = 307;

// There is no static answer to give: the address being asked for is the input.
export const dynamic = 'force-dynamic';

async function toPortal(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;

  // `params` arrives decoded, so the segments are re-encoded on the way out,
  // or a segment with a space in it would be handed on with a raw space.
  const pathname = path.map(encodeURIComponent).join('/');

  // `request.nextUrl.search` keeps the query exactly as it arrived, which is
  // the whole value of the redirect for an invite link: the token is in it.
  const { search } = request.nextUrl;

  return new Response(null, {
    status: STATUS,
    headers: {
      Location: productAppUrl(`/${pathname}`, search),
      // A redirect that turns out to be wrong should stop being served the
      // moment it is fixed, not when a CDN decides to ask again.
      'Cache-Control': 'no-store',
    },
  });
}

// Every method, because the portal's own API answers POST and the browser
// reaches it through whatever the page used.
export const GET = toPortal;
export const HEAD = toPortal;
export const POST = toPortal;
export const PUT = toPortal;
export const PATCH = toPortal;
export const DELETE = toPortal;
export const OPTIONS = toPortal;
