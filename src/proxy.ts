import { NextResponse, type NextRequest } from 'next/server';
import { servesScreenMockStudio } from './lib/environment';
import { forwardToProductApp, productAppHas } from './lib/product-app';
import { productAppPage } from './lib/product-app-address';
import { STUDIO_PREFIX } from './screen-mocks/registry';

/**
 * Runs before the pages its matcher covers are served — the studio, and every
 * address that is not this site's own — for two reasons that each need a fact
 * about the request rather than about the build.
 *
 * **Closing the Screen mock studio on the production deployment** (ticket 98,
 * ADR-0002), and nothing anywhere else. Here rather than in the studio's
 * pages, because those are built ahead of time: a check inside them would be
 * read once, when the site is built, and which deployment is answering is a
 * fact about the request, not the build
 * (`tests/e2e/studio-in-production.spec.ts` serves one build both ways). A
 * bare not-found, not the site's page for it: that page reads its words from
 * the CMS, and a request nobody should be making has no business opening a
 * database connection.
 *
 * **Sending the product app's old addresses on to it** (ADR-0026). Until it
 * moved, the product app answered at `rabaedapp.com`, and its addresses are
 * in emails, exports and printed letters. For an address this site has no
 * page for, the product app is asked whether it has one: if it does, the
 * visitor is sent there; if it does not, the request goes on, matches nothing,
 * and this site's own not-found page answers it exactly as before. Done here
 * because that page renders properly only when nothing has matched — a route
 * calling `notFound()` gets Next's bare error document instead
 * (`src/app/not-found.tsx`).
 */
export async function proxy(request: NextRequest) {
  const { pathname: asItCame, search } = request.nextUrl;
  // Next matches pages, and this proxy's matcher, against the decoded path, so
  // every decision here is made on it too — or `/%73tudio` would be matched as
  // the studio and then not recognised as it. The address is sent on as it
  // came.
  const pathname = decoded(asItCame);

  if (pathname === STUDIO_PREFIX || pathname.startsWith(`${STUDIO_PREFIX}/`)) {
    if (servesScreenMockStudio()) return NextResponse.next();
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const page = productAppPage(pathname);
  if (page === null) return NextResponse.next();

  // Only a plain "lacks" stays here. `unknown` forwards too: a printed link
  // must not break because the product app was slow once.
  if ((await productAppHas(page)) === 'lacks') return NextResponse.next();

  return forwardToProductApp(asItCame, search);
}

/** A path percent-decoded, or as it is where it is not validly encoded. */
function decoded(pathname: string): string {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
}

/**
 * The studio, and every address that is not this site's own — which is to
 * say, every address the product app might have. Not the site's own pages:
 * the proxy runs before every request it matches, cached page or not, and a
 * page of this site's would wait on it for nothing on every view.
 *
 * The segments left out are `SITE_SEGMENTS`
 * (`src/lib/product-app-address.ts`) — `studio` among them, which the first
 * pattern takes back in — written out because Next reads the matcher by
 * static analysis and accepts only a literal.
 * `tests/unit/product-app-address.spec.ts` holds the two together.
 */
export const config = {
  matcher: [
    '/studio/:path*',
    '/((?!(?:product|start|tool|referral|partnership|blog|case-studies|terms|privacy|referral-terms|sitemap\\.xml|llms\\.txt|robots\\.txt|_not-found|maktab|api|studio|portal-redirect|en|_next|icon\\.png|apple-icon\\.png|brand|downloads|hero|logos|og-rabaed\\.png|screen-mocks)(?:/|$)).+)',
  ],
};
