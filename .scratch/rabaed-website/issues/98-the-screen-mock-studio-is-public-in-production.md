# 98: The Screen mock studio can be opened by anyone on the live site

**What is wrong:** ADR-0002 calls the studio route (`src/app/(studio)/studio/[locale]/[mock]`) "a private studio route". It is prerendered into the production build and answers anyone at `/studio/…`. It is `noindex` and shows only the Screen mocks, so the harm is small. But the ADR and the site disagree, and it is one more address a scanner finds.

Previews need it: ticket 78 showed the founder the Phone crops on a studio page of a preview deployment, which Vercel's SSO already guards. So only production is the question.

Found by the architecture review of 24 September 2026 (L9).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] On the production deployment `/studio/…` answers not found. On previews, locally and on the test server it works as it does now (`npm run mocks:export`, `screen-mocks.spec.ts`, the founder's preview review)
- [ ] It is decided at request time from the deployment's environment (`src/lib/environment.ts` has `isPubliclyDeployed`), not by leaving the route out of the build, so a preview keeps it
- [ ] ADR-0002's wording says what "private" means now
- [ ] A test holds the production behaviour, with the environment set as production sets it
