# 03: Live skeleton on Vercel

**What to build:** One real Arabic page, served from Next.js, reachable on a private Vercel preview link, invisible to search engines. This proves the whole delivery path — commit, pull request, preview, merge — before any design work depends on it.

**Blocked by:** 01

**Status:** ready-for-human — the application, its tests and CI are in place; connecting Vercel and making CI mandatory are account steps only the founder can take (see `docs/deployment.md`)

- [x] Next.js App Router application, server-rendered; primary content is never client-rendered (ADR-0001)
- [x] Locale-aware routing in place from the start: Arabic at `/`, English reserved at `/en`, `lang` and `dir` set per locale
- [x] IBM Plex Sans Arabic and DM Mono self-hosted as `woff2`; no request to Google Fonts
- [x] `noindex` applied automatically to every non-production environment
- [ ] Connected to the GitHub repository so each pull request gets its own preview URL — **awaiting the founder**, steps in `docs/deployment.md`
- [x] Page text is present in the server response with JavaScript disabled
- [x] Playwright runs against the built app in CI
- [ ] CI blocks merging when it fails — **blocked**: branch protection is unavailable on the Free organisation plan for a private repository

## Comments

**What was built.** Next.js 16 (App Router, React 19, TypeScript) at the repository root, so Payload CMS can later mount inside the same application (spec: Stack and hosting). `npm run dev` for development, `npm test` for the end-to-end suite, `npm run typecheck` for types. Two pages: the Arabic home page carrying the Reference site's own hero copy verbatim, and the reserved English page at `/en`. Both are deliberately unstyled beyond a typeface — the design system and the page shell are ticket 04, and a placeholder that guesses at the tokens is a placeholder somebody later has to notice and unpick.

**Routing: two root layouts, no middleware.** Arabic lives in the `(ar)` route group and English under `(en)/en`. A route group contributes nothing to the URL, so Arabic is served at `/` without a rewrite, and each group carries its own root layout, which is what lets the two locales differ in `lang` and `dir`.

The alternative — a single `[locale]` tree with middleware rewriting `/` to `/ar` — was rejected because it gives every Arabic page two addresses that then have to be undone in canonical tags forever, and because the middleware would have to grow an exclusion list as Payload's admin and API routes arrive. The cost of this choice is that a page shared by both locales needs a short route file in each group; that is visible and typed, where a rewrite is neither. `tests/e2e/localisation.spec.ts` asserts `/ar` is a 404, which is the thing that would quietly regress if someone later reached for a rewrite.

**The 404 is the one place two root layouts cost something.** A URL matching neither group is inside neither layout, and Next 16 renders `src/app/not-found.tsx` in a bare default document of its own — an `<html>` with no `lang` and no `dir`, which lays Arabic out left to right. Two fixes were tried and rejected, both recorded in the file itself: rendering `<html>` from `not-found.tsx` nests inside Next's document and the browser discards it, so the page silently keeps the wrong direction; and a catch-all route in the `(ar)` group calling `notFound()` — the arrangement that would put the 404 inside the Arabic layout — answers with the framework's bare error document and no server-rendered content at all. What ships instead declares `lang` and `dir` on the content element, which is what a screen reader and the bidirectional algorithm actually read. The document-level `lang` is missing, on a page that is `noindex` and has no design of its own yet. `tests/e2e/localisation.spec.ts` asserts the 404's status, its direction and its text.

The English site's own 404 belongs to ticket 40: today an unmatched `/en/...` URL gets the Arabic one.

**Fonts.** `scripts/sync-fonts.mjs` now writes a second stylesheet, `assets/fonts/site-fonts.css`, holding only the two families the Marketing site renders. The capture script keeps using `fonts.css`, which still has all three — the Pour Tracker's Plus Jakarta Sans has to be available to ticket 02's interceptor but must never reach production CSS. The site imports `site-fonts.css` through `src/styles/globals.css`, so the build emits content-hashed `woff2`, and only for families that are actually declared.

Plain `@font-face` rather than `next/font/local`, deliberately. `next/font` cannot express a per-subset `unicode-range`, and Google's subset split is exactly what ticket 02 preserved so that glyph selection in the rebuild matches the baselines. Rendering the same text through a merged face would change the one variable the visual comparison exists to hold still. The cost is that Next does not preload the font files, so there is a brief fallback flash; that belongs to ticket 36's performance pass, and `font-display: swap` keeps the text readable meanwhile.

**Indexing.** `isIndexable()` in `src/lib/environment.ts` requires two things at once, because there are two ways to become visible by accident. `VERCEL_ENV` blocks every preview and development deployment automatically and permanently. `SITE_INDEXABLE` keeps *production* blocked as well, because pushing to `main` creates a production deployment long before the site is fit to be found — user story 62 is not satisfied by the environment check alone. Ticket 39 sets `SITE_INDEXABLE=true` on Vercel's production environment, and that is the whole of go-live for indexing.

It is applied twice: as `<meta name="robots">` from the root layouts, and as an `X-Robots-Tag` header from `next.config.ts`. The meta tag only exists inside an HTML body a crawler chose to parse; the header covers everything else it may fetch, and is what a `HEAD` request sees.

The suite asserts the blocked case, which is the state this ticket is responsible for. Proving that production *does* become indexable belongs to ticket 39, and cannot be tested from here without a second build: the pages are statically prerendered, so the environment is baked in at build time — which is correct on Vercel, where each environment builds separately.

**Tests.** Five files under `tests/e2e/`, all at the one seam the spec allows: the built application driven by Playwright. `tests/e2e/routes.ts` is the list every suite iterates, so a later ticket adds a page in one place and inherits server-rendering, localisation, indexing, font and console-error coverage for it.

Each guard was verified by breaking the thing it watches and confirming the run goes red:

- Making `isIndexable()` return `true` failed both indexing tests.
- Swapping the self-hosted `@import` for a Google Fonts one failed the two "asks Google Fonts for nothing" tests **and left the Arabic-face test passing** — Google served the font. Removing the font entirely inverted that exactly: the Google tests passed and the Arabic-face test failed. Neither half of the font check substitutes for the other, which is the same lesson ticket 02 recorded.
- Moving the home page's copy behind `'use client'` and a `useEffect` failed both Arabic server-rendering tests. ADR-0001 is now enforced rather than assumed.

`@playwright/test` is pinned to 1.56.1 to match the `playwright` already in the repository. That version pins the Chromium the visual baselines were captured with; bumping it changes text rasterisation and invalidates the comparison.

**What the review changed.** Two findings were real defects rather than style. The 404's nested `<html>`, described above, was found by reading the built output rather than the source. And the canonical-URL assertion was vacuous: written as a regular expression, the Arabic home page's pattern reduced to `/?$`, an optional slash before end-of-string, which matches every string. It hid a second bug — `metadataBase` fell back to port 3000 while the suite runs the server on 3100, so every canonical URL under test named a port nothing was listening on. Both are now asserted as exact absolute URLs, verified by pointing every canonical at `/` and watching the run go red.

**Kept, against the review.** Gating *production* on `SITE_INDEXABLE` was called ticket 39's work. It stays: without it the first push to `main` creates a production deployment that invites crawlers in, which is the exact failure user story 62 names. Ticket 39 flips one environment variable rather than writing the mechanism.

**Dropped, on the review.** The English page had translated hero copy; `/en` now says only that the English site is coming, because English marketing copy written here is copy nobody has approved and ticket 42 would have to unpick. Open Graph and Twitter tags came out of `pageMetadata` — they belong with the sharing image and structured data in ticket 32, and a half-version of them now is worse than none. A dead `.mono` rule that anticipated the design system came out of `globals.css`.

**CI.** `.github/workflows/ci.yml` runs on every pull request and every push to `main`: typecheck, then `npm test`, which builds the application and runs the suite against the build. `npm run baselines:verify` is deliberately not in it — pixel comparison against baselines captured on a different machine would fail for reasons unrelated to the change. **This needs deciding before ticket 04**, which is the first ticket whose acceptance depends on matching the baselines: either that comparison stays a local step, or the baselines move to a pinned rendering environment that CI can reproduce.

**Two things need the founder.** Both are written up in plain language in `docs/deployment.md`.

1. **Vercel is not connected yet.** Importing the repository is a five-click job in the Vercel dashboard and needs no configuration on our side — no build settings, no environment variables, and the indexing block is on by default in every environment. Until it is done there are no preview links.
2. **CI cannot block a merge.** Branch protection is not available on the Free organisation plan for a private repository; the GitHub API answers `Upgrade to GitHub Pro or make this repository public to enable this feature.` Making the repository public is not an option. So this is a decision: the GitHub Team plan, or the convention of not merging a pull request with a red cross. `docs/github-ruleset.json` holds the rule ready, and `docs/deployment.md` has the one command that applies it the day the organisation is upgraded.
