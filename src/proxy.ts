import { NextResponse } from 'next/server';
import { servesScreenMockStudio } from './lib/environment';

/**
 * Closes the Screen mock studio on the production deployment (ticket 98,
 * ADR-0002), and does nothing anywhere else.
 *
 * Here rather than in the studio's pages, because those are built ahead of
 * time: a check inside them would be read once, when the site is built, and
 * which deployment is answering is a fact about the request, not the build.
 * The proxy runs on every request it matches, before any built page is served
 * (`tests/e2e/studio-in-production.spec.ts` serves one build both ways).
 *
 * A bare not-found, not the site's page for it: that page reads its words from
 * the CMS, and a request nobody should be making has no business opening a
 * database connection.
 */
export function proxy() {
  if (servesScreenMockStudio()) return NextResponse.next();
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/**
 * `STUDIO_PREFIX` in `src/screen-mocks/registry.ts`, written out because Next
 * reads the matcher by static analysis and accepts only a literal.
 * `tests/e2e/studio-in-production.spec.ts` asks for studio pages by the
 * registry's own paths, so the two cannot drift apart unnoticed.
 */
export const config = {
  matcher: '/studio/:path*',
};
