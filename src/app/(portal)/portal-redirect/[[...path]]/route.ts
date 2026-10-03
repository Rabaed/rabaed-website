import type { NextRequest } from 'next/server';
import { forwardToProductApp } from '@/lib/product-app';

/**
 * The product app's API at this domain, sent on to where the product app
 * answers now (ADR-0026).
 *
 * Reached only through the `/api/1.1/*` rewrite in `next.config.ts`. Every
 * other old address of the product app's is the proxy's (`src/proxy.ts`),
 * which asks the product app before forwarding; an API call is forwarded
 * without asking, because there is no page to ask about.
 */

// There is no static answer to give: the address being asked for is the input.
export const dynamic = 'force-dynamic';

async function toProductApp(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;

  // `params` arrives decoded, so the segments are re-encoded on the way out,
  // or a segment with a space in it would be handed on with a raw space.
  const pathname = path.map(encodeURIComponent).join('/');

  // `request.nextUrl.search` keeps the query exactly as it arrived, which is
  // the whole value of the redirect for an invite link: the token is in it.
  const { search } = request.nextUrl;

  return forwardToProductApp(
    `/${pathname}`,
    search,
    request.cookies.getAll().map((cookie) => cookie.name),
  );
}

// Every method, because the product app's own API answers POST and the browser
// reaches it through whatever the page used.
export const GET = toProductApp;
export const HEAD = toProductApp;
export const POST = toProductApp;
export const PUT = toProductApp;
export const PATCH = toProductApp;
export const DELETE = toProductApp;
export const OPTIONS = toProductApp;
