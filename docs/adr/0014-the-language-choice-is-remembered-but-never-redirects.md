# The language choice is remembered, and never redirects

Ticket 40 asks that a visitor's choice of language "persists between visits but never overrides an explicit URL". Those two halves pull against each other, and which way the tension is resolved decides how every page of the site is served.

**Read one way, it means a redirect.** Somebody picks English, comes back a week later, types `rabaedapp.com`, and lands on `/en`. To do that the server has to read a cookie before it answers — which on Vercel means Next's middleware, and middleware runs on *every* request to the site.

That is a real cost, and not only a bill. Every page here is prerendered at build time and served from the edge cache: `X-Nextjs-Prerender: 1`, `X-Vercel-Cache: HIT`. Putting a function in front of them adds an invocation to each one, and it adds moving parts to the caching behaviour that ticket 64 is already fighting — where a render that finishes after a publish can leave a page wrong until the next publish. The site does not need a second thing that can go wrong between a visitor and a cached page.

**So the choice is remembered, and it never sends anybody anywhere.** The switcher records the language a visitor picked, in that browser. What it buys is that the switcher knows where the visitor has been and the site can act on it later. What it does not do is move anybody: `/` is the Arabic home page for everyone who asks for it, and `/en` is the English one, always, first visit or fiftieth.

This reading also honours the second half of the sentence exactly rather than approximately. **Every URL is an explicit URL.** A visitor who types the domain asked for the domain; a link somebody shared shows the page it names; a crawler is served what it requested. There is no state in which the address bar and the page disagree, which is the failure mode language redirects are known for — and search engines dislike, because a crawler following `hreflang` to `/en` and being bounced to `/` has been told the alternates are a lie.

The founder chose this on 22 September 2026, over the redirecting alternative, with the cost of each stated.

## Consequences

- **Every page stays a static file at the edge.** No middleware, no per-request function, nothing added to the caching story. The site is as fast after this ticket as before it.
- **`hreflang` stays honest.** Each locale's URL serves that locale to anyone who asks, so the alternates a crawler is given are the pages it gets.
- **"Persists between visits" is narrower than it sounds, and that is deliberate.** The choice is remembered in the browser, not acted on by the server. A visitor who wants English on a later visit clicks the switcher again, or bookmarks `/en`. Nobody is ever stranded in a language they did not ask for, which is the failure the redirect risks.
- **The record is per browser, and may not be there at all.** It is `localStorage`, which is empty in a private window, on another device, and wherever site data has been cleared or blocked — so nothing the visitor can see is allowed to depend on it, and reading it is wrapped rather than trusted.
- **No automatic language detection either**, from `Accept-Language` or anywhere else. `src/lib/locales.ts` already says the URL decides the locale, always; this is the same rule, and a redirect would have been the first exception to it.
- **If the redirect is ever wanted**, it is a later ticket and a later ADR, and it starts by measuring what middleware costs on this site rather than by assuming it is free.
