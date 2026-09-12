# 31: Search foundations

**What to build:** Everything a search engine needs to crawl the site correctly once the handbrake comes off, and everything a shared link needs to look credible.

**Blocked by:** 03, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17

**Status:** ready-for-agent

- [ ] Unique title and description on every page
- [ ] Self-referencing canonical URL on every page, and `hreflang` alternates per locale
- [ ] `sitemap.xml` generated from published content only
- [ ] `robots.txt` served, referencing the sitemap
- [ ] Favicon present on every page
- [ ] A real 1200×630 sharing image exists and resolves — the Reference site points at one that does not exist
- [ ] Open Graph and Twitter tags correct per page; the three pages that currently copy the homepage's are fixed
- [ ] `noindex` still applied everywhere outside production; removing it is ticket 39, not this one
