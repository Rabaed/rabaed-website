# 66: A maximum age under every cached page

**What is wrong:** Nothing makes a cached page rebuild except a publish marking it
stale. So anything that loses a mark leaves that page showing words from before it
— not for a while, but until somebody publishes again. Ticket 64 found one way to
lose a mark; a hook that throws, a request that never lands, a region that missed
the mark are others we have not had yet. There is no floor under any of them.

**Blocked by:** nothing.

**Status:** needs-triage

- [ ] Every page a visitor can reach is rebuilt at most a set time after it was
      last built, whether or not anything was published
- [ ] The three discovery files too — they are routes of their own and no
      layout covers them
- [ ] The number is written down with the reason it is that number
- [ ] Publishing still reaches the site in under a second in the ordinary case:
      the age is a floor under failure, not the way a change travels
- [ ] Held by a test that fails without it
- [ ] An ADR records the decision, because it sets how stale a page may be
- [ ] `docs/deployment.md` says what the age is, under the caching section

**Not this ticket:** the race in ticket 64. This does not close the window — a page
caught by it is still wrong. It bounds how long it stays wrong.

## Why this rather than waiting

`refreshSite` in `src/cms/revalidation.ts` is the standard Payload and Next
pattern, and it is right. What is missing beside it is the thing almost every
CMS on a cache also runs: a plain time limit, so a mark that goes astray costs
minutes rather than costing until the next publish. It is the cheapest change in
this family and it covers failures we have not met yet, not only ticket 64's.

## Where it goes

The two site layouts — `src/app/(ar)/layout.tsx` and `src/app/(en)/en/layout.tsx`
— sit above all twenty pages, and a segment takes the lowest age in its chain, so
setting it there covers every page without twenty edits to keep in step. Check
that against `node_modules/next/dist/docs/` before writing it: the installed Next
is 16.3.5 and this is exactly the kind of thing that has moved.

`src/app/llms.txt/route.ts`, the sitemap and `robots.txt` are routes beside the
layouts, the same reason `DISCOVERY_FILES` exists in `revalidation.ts`. Each needs
its own.

`(payload)` — the admin — and `(studio)` must not get one. Neither is cached and
neither is a page a visitor reads.

## What it costs

Next rebuilds when somebody asks for a page whose age has run out, not on a timer.
On a site with no visitors it costs nothing; on this one it costs about one extra
render per page per window, and only for windows in which somebody visited.

Worth knowing before picking the number: the visitor who arrives first after the
age runs out is still served the old page while the rebuild happens behind them.
So the real bound is the age plus one render, and it is the second visitor who
sees the change. That argues for a number chosen as "how far behind may a page be
when something has gone wrong", not as a publishing delay.

## Comments

**What was checked against the installed Next before this was filed.** The
ticket asks the implementer to verify the mechanism still exists, so that check
was done at filing time — Next 16.3.5, `cacheComponents` not enabled in
`next.config.ts`:

- `export const revalidate = <seconds>` is **still the mechanism**, but it has
  moved out of the Route Segment Config reference and into the guide
  `01-app/02-guides/caching-without-cache-components.md`. The segment-config
  index now lists only `dynamicParams`, `runtime`, `preferredRegion` and
  `maxDuration`, which makes it look removed. It is removed **only when Cache
  Components is enabled** — this project does not enable it, so the option is
  live. Read that guide, not the segment-config reference.
- That guide confirms the assumption this ticket rests on: "The lowest
  `revalidate` across each layout and page of a single route will determine the
  revalidation frequency of the _entire_ route." So the two layouts do cover the
  pages beneath them.
- The value must be statically analysable — `revalidate = 600` is valid,
  `revalidate = 60 * 10` is not. That rules out expressing the number as a
  computation, which is worth knowing before writing it down "with the reason it
  is that number".
- **Worth a line in the ADR:** this is the previous caching model. The day Cache
  Components is turned on, `revalidate` is removed and `cacheLife` is the
  replacement. The ADR should say that, so whoever enables it knows this
  decision has to move with it.

**The route groups, as they actually are.** `src/app/(ar)/layout.tsx` and
`src/app/(en)/en/layout.tsx` both exist. `DISCOVERY_FILES` in
`src/cms/revalidation.ts` is exactly `['/sitemap.xml', '/llms.txt',
'/robots.txt']`, matching the second criterion. Two small corrections to "Where
it goes": only `llms.txt` is a `route.ts` — the other two are the metadata-file
convention, `src/app/sitemap.ts` and `src/app/robots.ts`. And there is a third
route group the exclusion list does not name, `(forms)`, which holds two API
routes and no pages; it wants no age either, for the same reason as `(payload)`
and `(studio)`.
