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

**Status:** ready-for-agent

- [ ] One module lists the marketing pages. It is written out by hand, so the sitemap's rule — "listed by name, not found by walking the routes, so nothing can wander in" — still holds
- [ ] The sitemap, `llms.txt`, the search settings tabs, the FAQ keys, the Arabic-only notices, `PageSlug` and the refresh list read it; their own lists are deleted
- [ ] A test walks `src/app` and fails when a route file is neither in the registry nor named in its exclusions (the studio, the admin, the API routes…), each exclusion with its reason
- [ ] `tests/e2e/routes.ts` stays restated rather than imported, for the reason it gives, but a test holds it to the registry
- [ ] "Page registry" is added to `CONTEXT.md`
- [ ] Adding a page is described in one place, and the ticket counts the files it now takes
