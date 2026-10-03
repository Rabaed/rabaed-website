# The site forwards every address it does not serve to the portal

Until the move, `rabaedapp.com` **was** the Bubble portal. Its addresses went out and cannot be recalled: invite emails carrying a registration token, submittal emails, the links inside Excel exports, the QR codes printed on letters, the stored addresses of private files. On the day the apex serves this site instead, every one of them lands here.

On 3 October 2026 the founder chose to move the portal to `app.rabaedapp.com` and give the apex to this site. So this site answers for the portal's past as well as its own present.

**The rule is "whatever is left", not a list.** `next.config.ts` declares a `fallback` rewrite, which Next consults only after it has checked every page, route and public file. Anything this site serves is served; everything else reaches `src/app/(portal)/portal-redirect/[[...path]]/route.ts`, which answers with the same path and query on the portal. Neither side ever has to be told what the other added. Two alternatives were turned down:

- **A list of the portal's addresses.** It is the obvious shape, and it is wrong here twice over: Bubble gains pages without telling us, and this site's own pages come from the CMS, so the list would go stale the first time Ahmed publishes one. A stale list does not fail loudly — it forwards a page that exists, or serves a 404 where a letter's QR code pointed.
- **A catch-all page that redirects in the browser.** It answers 200 before it moves anyone, loses the method on a POST, and asks a visitor to run JavaScript to reach a page they already named.

**`/api/1.1/*` is claimed before the filesystem, because `fallback` would never see it.** Payload's own catch-all (`src/app/(payload)/api/[...slug]/route.ts`) matches every address under `/api/`, so nothing there is ever a filesystem miss: `/api/1.1/wf/redeem-invite` would answer Payload's 404 and the fallback would not run. `/api/1.1/` is Bubble's prefix and Payload does not use it, so it is safe to claim in `beforeFiles`. This is the one place the two systems' addresses overlap, and the only hand-written exception.

**307 first, 308 after a week.** Both keep the method and the body, which 301 and 302 do not — a POST that arrives has to still be a POST when it reaches the portal. 308 is the honest answer, since the portal has moved for good, but a browser caches it indefinitely and a wrong one cannot be taken back from the machines that stored it. A week of 307 costs only the SEO signal.

## Consequences

- **A landing page may never take a portal address.** Adding `/signin`, `/registration`, `/verify`, `/submittal`, `/project`, `/projects_list`, or anything under `/version-`, `/api/` or `/fileupload/`, silently captures an address that printed letters point at. The same goes for a catch-all page at the top level: it would match everything and the fallback would never run. `/blog/[slug]`, `/case-studies/[slug]` and `/en/[page]` are safe because they sit under a prefix.
- **A browser cannot POST across the redirect.** A cross-origin POST with a JSON body is preflighted, and no browser follows a redirect on a preflight. Anything in a page that calls the portal's API must call `app.rabaedapp.com` directly. The redirect is a net for links, not a way to keep an integration working.
- **`scripts/check-portal-redirects.mjs` is the gate**, and it checks both directions. Half its cases are addresses that must **not** leave — the nine pages, `/en`, `/maktab`, `/api/users` — because a rule that forwards everything passes every portal case and takes the marketing site down with it.
- **The sign-in button is content, not code.** `signInUrl` lives in the CMS. The seed in `src/migrations/site-words-import/` is for fresh environments; production is changed in `/maktab` on the day.
