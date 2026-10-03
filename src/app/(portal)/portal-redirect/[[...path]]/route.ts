import type { NextRequest } from 'next/server';

/**
 * The portal's old addresses on this domain, sent to where the portal lives now.
 *
 * Until the move, `rabaedapp.com` *was* the Bubble portal, and its addresses
 * are in invite emails, submittal emails, Excel exports and the QR codes
 * printed on letters — none of which can be recalled. Once the apex serves
 * this site instead, each of those links would land on a marketing page, or
 * on a 404, and the person holding the letter has no way to know where the
 * page went.
 *
 * Reached only through the rewrites in `next.config.ts`, which name the
 * portal's addresses rather than claiming everything this site does not
 * serve. Anything not named there is this site's to answer, including its
 * not-found page — see ADR-0025 for why the broader rule was given up.
 */
const PORTAL = 'https://app.rabaedapp.com';

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

  // `params` arrives decoded, so the segments are re-encoded on the way out.
  // Without this a stored file address like
  // `/fileupload/<id>/Inspection Request 1.pdf` would be handed to the portal
  // with raw spaces in it.
  const pathname = path.map(encodeURIComponent).join('/');

  // `request.nextUrl.search` keeps the query exactly as it arrived, which is
  // the whole value of the redirect for an invite link: the token is in it.
  const { search } = request.nextUrl;

  return new Response(null, {
    status: STATUS,
    headers: {
      Location: `${PORTAL}/${pathname}${search}`,
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
