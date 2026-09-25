# 92: One registry of the marketing pages, which every list of pages reads

**What to build:** one hand-written list of the site's marketing pages — each page's key, path, the loader that reads it, its names, its search settings key and whether it has questions — from which every other list of pages is read, and a test that fails when a route of the site is in neither the registry nor its list of exclusions.

**Why:** "which pages exist" is written out about ten times, and each comment says it was copied from another:
- `src/app/sitemap.ts:18` and `:25-32` (two lists in one file)
- `src/app/llms.txt/route.ts` (`MARKETING_PAGES`, ticket 82, a third copy)
- `src/content/arabic-only-pages.ts:54-66`, `src/cms/legal-pages.ts`, `src/cms/faq-pages.ts`
- `SEARCH_PAGES` and six hand-written `pageTab` calls, `src/cms/globals/search-settings.ts:82-117` (its comment says the tabs are built from the list; they are not)
- the `PageSlug` union, `src/cms/pages.ts:19-32`
- the refresh list, `src/cms/revalidation.ts:18,27`, and `tests/unit/cached-page-age.spec.ts:41-59`
- `tests/e2e/routes.ts`, and the table in `docs/deployment.md`

`'/product'` appears in 12 source files and 28 test files, and adding one page touches 18–20 files. Nothing makes the lists agree. The not-found page's missing maximum age (ticket 84) is the first drift found.

Found by the architecture review of 24 September 2026 (A2).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] One module lists the marketing pages. It is written out by hand, so the sitemap's rule — "listed by name, not found by walking the routes, so nothing can wander in" — still holds
- [x] The sitemap, `llms.txt`, the search settings tabs, the FAQ keys, the Arabic-only notices, `PageSlug` and the refresh list read it; their own lists are deleted
- [x] A test walks `src/app` and fails when a route file is neither in the registry nor named in its exclusions (the studio, the admin, the API routes…), each exclusion with its reason
- [x] `tests/e2e/routes.ts` stays restated rather than imported, for the reason it gives, but a test holds it to the registry
- [x] "Page registry" is added to `CONTEXT.md`
- [x] Adding a page is described in one place, and the ticket counts the files it now takes

## Comments

**What was built.** `src/lib/page-registry.ts` is the page registry: the six marketing pages (`MARKETING_PAGES` — each page's address, short name, own CMS entry and its admin name, the entries it shares, and its Questions section's id or `null`), the site's other pages (`SITE_PAGES` — the blog and case studies indexes, with everything beneath them, and the three legal documents), the discovery files, the not-found page, and `NOT_PAGES` — the admin, the API, the Screen mock studio and the legal documents' English notice — each with its reason. It imports nothing but types, because the CMS configuration and the tests read it too. It absorbs ticket 91's `page-entries.ts`.

**Who reads it now, their own lists deleted:**

- the sitemap and `llms.txt`, the latter with each page's module from `src/content/pages/loaders.ts`, a record keyed by the registry that fails to compile when a page is missing — the loaders stay out of the registry because it may not read the CMS;
- the FAQ page keys, their paths, section ids and admin labels (`src/cms/faq-pages.ts`);
- the English notices (`src/content/arabic-only-pages.ts`), headed by each page's English name;
- each page's module, for its short name, and each page's CMS entry, for its slug, admin label and preview path;
- `PageSlug` (`src/cms/pages.ts`), the legal pages' paths, the blog and case studies paths;
- the refresh list (`src/cms/revalidation.ts`: the discovery files and the not-found page) and `tests/unit/cached-page-age.spec.ts`, which finds each route by its address and the uncached ones from `NOT_PAGES`;
- `english-pages.spec.ts`, `page-entries.spec.ts` and `english-fields.probe.ts`.

**One visible change:** the partnership page's entry is named "Partnership Program page" in the English admin, as its questions' page list already named it; it was "Partnership page". The Arabic is unchanged.

**The search settings tabs** on the ticket's list no longer exist: ticket 91 moved each page's search title onto its own entry, as `searchTab()`, so there is no list of them left to read.

**The tests.** `tests/unit/page-registry.spec.ts` walks `src/app` (with `tests/unit/app-routes.ts`, which works out each route file's address as Next does) and fails on a route neither listed nor excluded, on a listed page with no route, on an exclusion naming no route, and when `tests/e2e/routes.ts` and the registry disagree. Checked failing by taking the studio's exclusion away.

**Adding a page** is `docs/deployment.md`, «Adding a page»: seventeen files by hand — twelve for the page and five end-to-end tests that restate the site's pages on purpose, for the reason `routes.ts` gives — besides the page's own section components, where the architecture review counted 18 to 20. The gain is less in the count than in what can drift: every file outside those tests now reads the registry, or fails to compile or to pass until it does.

**The code review found**, and this fixes: the maximum-age test had stopped checking the layouts of the uncached routes (it now checks each route, and separately any layout above nothing but uncached routes — shown failing on an age added to `(payload)/layout.tsx`); the route walk now knows Next's other metadata files and parallel-route slots; the sitemap takes every page but the case studies' index from the registry rather than naming four; and the guide no longer claims an index or a legal document is one line. The legal documents keep their own keys in `legal-pages.ts`, which carries what only they have — how their clauses are linked to — and reads their addresses from the registry.

