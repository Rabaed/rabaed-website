# The portal's old addresses on this domain are named, and forwarded

Until the move, `rabaedapp.com` **was** the Bubble portal. Its addresses went out and cannot be recalled: invite emails carrying a registration token, submittal emails, the links inside Excel exports, the QR codes printed on letters, the stored addresses of private files. On the day the apex serves this site instead, every one of them lands here.

On 3 October 2026 the founder chose to move the portal to `app.rabaedapp.com` and give the apex to this site. So this site answers for the portal's past as well as its own present.

**The portal's addresses are named in `next.config.ts`, and everything else is this site's.** Each named address is rewritten to `src/app/(portal)/portal-redirect/[[...path]]/route.ts`, which answers with the same path and query on the portal. The names are the two Bubble version prefixes — `/version-test/` and `/version-live/`, which carry a copy of every page below them — plus `/api/1.1/`, `/fileupload/`, and the portal pages its emails and printed letters point at.

**The first attempt was the opposite rule, and the test suite refused it.** A `fallback` rewrite on `/:path*` runs after Next has checked every page, route and public file, so "everything this site does not serve" is one line and never needs touching again. It is the shape the problem seems to ask for, and it is wrong: *this site does not serve its own not-found page either*. With that rule, `/ar` — which the site refuses on purpose, so that Arabic has exactly one address — left for the portal. So did `/admin`, which answers 404 precisely so that a scanner finds nothing, and which under the broader rule pointed every scanner straight at `app.rabaedapp.com`. So did every mistyped address, in place of the Arabic not-found page whose words come from the CMS. Five tests failed and each was right (`tests/e2e/localisation.spec.ts`, `tests/e2e/cms.spec.ts`, `tests/e2e/site-words.spec.ts`).

The cost of naming them is real and is accepted: **a page added to the Bubble portal from now on has to be named here too**, where the broader rule would have carried it. That is a small cost for a portal being migrated away from, and the alternative was giving up the site's own 404.

A third shape was turned down outright: **a catch-all page that redirects in the browser** answers 200 before it moves anyone, loses the method on a POST, and asks a visitor to run JavaScript to reach a page they already named.

**They are claimed in `beforeFiles`, before this site's own files.** Two of them have to be: Payload's catch-all (`src/app/(payload)/api/[...slug]/route.ts`) answers everything under `/api/`, so `/api/1.1/wf/redeem-invite` would otherwise get Payload's 404 rather than reaching the portal. The rest are there for the same reason stated as a rule — these addresses belong to the portal whatever this site adds later, because the links already exist on paper.

**307 first, 308 after a week.** Both keep the method and the body, which 301 and 302 do not — a POST that arrives has to still be a POST when it reaches the portal. 308 is the honest answer, since the portal has moved for good, but a browser caches it indefinitely and a wrong one cannot be taken back from the machines that stored it. A week of 307 costs only the SEO signal.

## Consequences

- **A page added to the portal has to be named here.** The forwarding is a list, so a Bubble page nobody adds to it lands on this site's not-found page. This is the price of keeping that not-found page at all.
- **A page here may never take a portal address.** `/signin`, `/registration`, `/verify`, `/submittal`, `/project`, `/projects_list`, and anything under `/version-`, `/api/1.1/` or `/fileupload/` are claimed before this site's files, so a page added at one of those addresses would simply never be reached.
- **A browser cannot POST across the redirect.** A cross-origin POST with a JSON body is preflighted, and no browser follows a redirect on a preflight. Anything in a page that calls the portal's API must call `app.rabaedapp.com` directly. The redirect is a net for links, not a way to keep an integration working.
- **`scripts/check-portal-redirects.mjs` is the gate**, and it checks three directions, not one: addresses that must leave, addresses this site serves, and addresses this site **refuses** — `/ar`, `/admin`, `/nothing-here`. The third group is there because the first attempt passed every forwarding case while breaking the site.
- **The sign-in button is content, not code.** `signInUrl` lives in the CMS. The seed in `src/migrations/site-words-import/` is for fresh environments; production is changed in `/maktab` on the day.
