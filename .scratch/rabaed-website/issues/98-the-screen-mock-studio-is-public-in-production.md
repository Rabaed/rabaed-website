# 98: The Screen mock studio can be opened by anyone on the live site

**What is wrong:** ADR-0002 calls the studio route (`src/app/(studio)/studio/[locale]/[mock]`) "a private studio route". It is prerendered into the production build and answers anyone at `/studio/…`. It is `noindex` and shows only the Screen mocks, so the harm is small. But the ADR and the site disagree, and it is one more address a scanner finds.

Previews need it: ticket 78 showed the founder the Phone crops on a studio page of a preview deployment, which Vercel's SSO already guards. So only production is the question.

Found by the architecture review of 24 September 2026 (L9).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] On the production deployment `/studio/…` answers not found. On previews, locally and on the test server it works as it does now (`npm run mocks:export`, `screen-mocks.spec.ts`, the founder's preview review)
- [x] It is decided at request time from the deployment's environment (`src/lib/environment.ts` has `isPubliclyDeployed`), not by leaving the route out of the build, so a preview keeps it
- [x] ADR-0002's wording says what "private" means now
- [x] A test holds the production behaviour, with the environment set as production sets it

## Comments

**Resolved (ticket-98).** `src/proxy.ts` matches `/studio/:path*` and answers a bare 404 when `servesScreenMockStudio()` (`src/lib/environment.ts`) is false, which is when `VERCEL_ENV` is `production`. Read on each request, so the studio's pages stay prerendered and one build answers as whichever deployment serves it.

- The answer is a plain-text 404, not the site's not-found page: that page reads its words from the CMS, and a request nobody should make has no business opening a database connection. A scanner can tell this 404 apart from the site's own; the review that found this called the harm small, and this removes the pages, which was the point.
- `isPubliclyDeployed` was not the right test after all: it is true on previews too, and previews must keep the studio (ticket 78). The new function asks the narrower question.
- `tests/e2e/studio-in-production.spec.ts` starts the first test server's build a second time with `VERCEL=1` and `VERCEL_ENV=production`, on `TEST_PORT + 4000` and with no database, and asks for studio pages in both languages (404); then once more with `VERCEL_ENV=preview` (200, the mock's markup). The same build answering both ways is what shows the decision is made at request time.
