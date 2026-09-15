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
