# The product app is asked whether it has the page

Supersedes [ADR-0025](0025-the-portals-old-addresses-on-this-domain-are-named-and-forwarded.md).

Until it moved, the **product app** (GLOSSARY.md) answered at `rabaedapp.com`, and its addresses went out where they cannot be recalled: invite emails with a registration token in them, submittal emails, the links inside Excel exports, the QR codes printed on letters. Now the **Marketing site** answers there, and each of those addresses has to reach the product app at `app.rabaedapp.com` instead.

ADR-0025 named the product app's addresses in `next.config.ts` and forwarded those. On 3 October 2026 the founder chose this instead: **for an address this site has no page for, the proxy asks the product app whether it has one.** If it has, the visitor is sent there with the address exactly as it came. If it has not, the request carries on, matches nothing, and this site's own not-found page answers, as it always has.

## Why asking beats either list

Every rule tried before this one failed one of two ways.

- **Forward everything this site does not serve** (the first version of ADR-0025). It takes the site's own not-found page with it: `/ar`, refused so that Arabic has one address, left for the product app; so did `/admin`, which pointed every scanner at it; so did every mistyped address. Five tests refused it.
- **Name the product app's pages** (ADR-0025 as merged). It fails silently: a page nobody named is a printed QR code that reaches a 404, and nobody notices until a customer does.
- **Name this site's pages and forward the rest.** The same as the first, written out by hand.

Asking keeps both things that were in conflict. A page the product app has always reaches it, named or not; a page neither has always reaches this site's not-found page.

## How the question is asked

**The page is the first segment.** In the product app, everything after the first segment is the page's parameters, so `/project/abc` and `/project/xyz` are one question: does `project` exist? A copy named in front is part of it: `/version-test/signin` answered 200 and `/version-test/nope` 404, and a page added to the test copy exists there before it exists live (`src/lib/product-app-address.ts`).

**Anything but 404 means it has the page.** A page that needs a sign-in answered 302, and the folder files sit in 403. Reading only 200 as "has it" would refuse exactly the links in emails and exports.

**It fails open.** No answer within 1.5 seconds, or an error of the product app's own, forwards the visitor anyway. Wrong that way, they see the product app's not-found page; wrong the other way, a printed link breaks because the product app was slow once.

**Answers are remembered, errors are not.** "Has it" for a day, "has not" for an hour, a failure not at all. An hour of 404s for a letter's QR code because the product app was restarting would be the worst way to be wrong. At most a thousand answers are kept, so a scanner's thousands of invented addresses cannot grow the memory without end.

## Why the proxy

Because this site's not-found page renders properly only when nothing has matched. A route that asked the product app and then called `notFound()` would get Next's bare error document instead (`src/app/not-found.tsx` records that being tried). The proxy can ask first and, when the answer is no, step aside.

**The site's own addresses never reach it.** The proxy runs before every request its matcher covers, cached page or not, and on a site whose search standing rests on its speed, a page view should not wait on it for nothing. And because the question fails open, an address of this site's that was asked about would be forwarded whenever the product app was down — taking this site's own pages and images with it. `SITE_SEGMENTS` names them, read from the page registry wherever it can be, and two tests hold it to what the repository really serves and to the matcher, which Next accepts only as a literal.

**The product app's API is the exception.** `/api/1.1/*` stays a rewrite to a route handler, unchanged. Payload answers everything under `/api/`, so it is this site's segment and the proxy never sees it; and an API call is not a link anyone follows, so there is nothing to ask.

## Consequences

- **No list on either side needs keeping.** A page the product app gains is reached from an old address within the hour. A page this site gains is its own the moment it is in the page registry.
- **The answer depends on the product app's behaviour staying as observed.** If it ever answered a missing page with 200 and a "not found" screen of its own, the proxy would forward everything it was asked about. Failing open makes that safe, but nothing would announce it: `scripts/check-portal-redirects.mjs` asserts that `/nothing-here` still answers 404, and is the check that would.
- **`/admin` must answer 404 at the product app.** It answered 302 on the day this was decided, and the founder is renaming it. Until then the proxy forwards it, and `/admin` points scanners at the product app.
- **The question cannot be asked until `app.rabaedapp.com` answers.** Before then every question fails, and every address this site has no page for is forwarded. Nothing reaches the proxy's question but addresses nobody follows yet, since `rabaedapp.com` still points at the product app — but the checker can only be trusted once the new address answers.
- **The suite asks a stand-in** (`scripts/fake-product-app.mjs`), which answers as the real one did on the day. `PRODUCT_APP_ORIGIN` points the site at it. No deployment sets it.
