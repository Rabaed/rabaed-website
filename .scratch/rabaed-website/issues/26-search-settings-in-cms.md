# 26: Search settings in the CMS

**What to build:** Ahmed controls how each page appears in Google and when shared on WhatsApp or LinkedIn — its title, its description and its sharing image.

**Blocked by:** 19, 31

**Status:** ready-for-agent

- [ ] Every page, post and case study carries editable title, description and sharing image fields
- [ ] Sensible defaults are generated when a field is left empty, so nothing is ever blank
- [ ] Length guidance is shown in the admin so titles and descriptions are not silently cut off in results
- [ ] Changes are reflected in the page's tags, in the sitemap entry and in the sharing preview

## Comments

**From ticket 31 (15 September 2026).** Every page's title, description, canonical, Open Graph and Twitter tags come from one function, `pageMetadata` in `src/lib/metadata.ts`. It uses one sharing image for all pages, `public/og-rabaed.png` (drawn by `npm run brand:export`); a page's own image belongs as an optional argument there, falling back to that one. Keep `openGraph` and `twitter` set whole in that function — Next.js merges metadata shallowly, so setting part of either anywhere else drops the rest. `tests/e2e/search-foundations.spec.ts` holds every page to a unique title and description and to an image of exactly 1200×630.

**From ticket 33 (20 September 2026).** Two things waiting here.

1. **`llms.txt` follows this ticket without being touched.** It is generated from each page's `meta.description` — the same value `pageMetadata` puts in the page's `<meta name="description">` — by way of the page's content module (`src/content/pages/*.ts`). Move those descriptions into the CMS and `llms.txt` becomes CMS-driven with no edit to `src/app/llms.txt/route.ts`. `tests/e2e/ai-crawlers.spec.ts` asserts the two agree, so a description that reaches the page but not the file fails.

2. **Adding a field to a page global will break every fresh database, and production will not tell you.** A data migration that writes through Payload's local API — `20260915_040105_import_start_page` and its five siblings — selects every column the *current* schema declares. Add a column to `start_page` today and that migration, written before the column existed, fails with `column "..." does not exist` on any database built from scratch: the test server, a preview, a new deployment. Production is unaffected, because it applied the migration before the column existed.

   Ticket 33 hit this on `site-settings` and went around it by giving its one field a global of its own. This ticket cannot go around it: the fields belong on the page globals the `import_*` migrations seed. The fix is to make those data migrations schema-independent — raw SQL naming the columns that existed when they were written — before adding the fields, or the whole suite goes red on a database nobody can debug from production.
