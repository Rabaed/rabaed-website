# 31: Search foundations

**What to build:** Everything a search engine needs to crawl the site correctly once the handbrake comes off, and everything a shared link needs to look credible.

**Blocked by:** 03, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17

**Status:** resolved

- [x] Unique title and description on every page
- [x] Self-referencing canonical URL on every page, and `hreflang` alternates per locale
- [x] `sitemap.xml` generated from published content only
- [x] `robots.txt` served, referencing the sitemap
- [x] Favicon present on every page
- [x] A real 1200×630 sharing image exists and resolves — the Reference site points at one that does not exist
- [x] Open Graph and Twitter tags correct per page; the three pages that currently copy the homepage's are fixed
- [x] `noindex` still applied everywhere outside production; removing it is ticket 39, not this one

## Comments

**What was built (15 September 2026).** Titles, descriptions, canonical URLs, `hreflang`, the sitemap and the pre-launch `noindex` were already in place from earlier tickets; this ticket added the rest and the tests that hold all of it.

- `src/app/robots.ts`: one rule letting every crawler reach every page, and the sitemap's address. Nothing is disallowed — a crawler refused a page never reads its `noindex` — and the CMS admin's address is not named, which would publish it. Ticket 33 splits the rule.
- `src/lib/metadata.ts`: `pageMetadata` now also sets each page's Open Graph and Twitter tags from its own title, description and canonical URL, so no page can carry another's.
- `public/og-rabaed.png` (the address the Reference site named), `src/app/icon.png` and `src/app/apple-icon.png`, drawn by `npm run brand:export` from the brand files and the home page's approved headline.
- `tests/e2e/search-foundations.spec.ts`: a unique title and description on every page, each page's sharing tags describing itself, an image of exactly 1200×630 that resolves, a favicon that resolves, `robots.txt`, and a sitemap listing exactly the site's pages at their canonical addresses.

**Changed on the way.** The product, start, tool, referral and partnership pages named English versions at `/en/product` and so on, which do not exist; `routes.ts` asserted those links. They now name Arabic alone until tickets 40 and 42 switch English on, which adds them back. Later pages of the blog index now have their own description.

**Left as they are, deliberately.**
- Later pages of the blog index (`/blog/page/2` onward) stay out of the sitemap, as ticket 23 left them; a crawler reaches them from the index.
- The notice shown where an article or case study has no translation carries only a title and `noindex`: it is never meant to be found or shared.
- Articles and case studies are `og:type` `website`; their article description is structured data, ticket 32.
- The sharing image is Arabic, on the English placeholder too; ticket 26 gives pages images of their own.
