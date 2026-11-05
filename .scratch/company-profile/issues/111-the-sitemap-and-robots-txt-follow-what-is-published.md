# 111: The sitemap and robots.txt follow what is published

**What to build:** a bug fix. On `rabaedapp.com`, `sitemap.xml` does not list `/profile` or `/en/profile`, though both are published, answer 200 and are in `llms.txt` (spec: Search and discovery; ticket 110's last check).

**Blocked by:** none.

**Status:** open

**Found (6 November 2026):** production serves `sitemap.xml` and `robots.txt` as the files written at the last deploy (4 November, while the profile waited unpublished). Publishing never reaches them, and neither does their ten-minute age (`revalidate = 600`, ADR-0016).

- **The live headers:** both are answered at the edge alone (`X-Vercel-Id: bom1::…`), with `Accept-Ranges`, an `ETag` and a `Last-Modified`. That is the same as `icon.png`, a file. `llms.txt`, built and marked the same way, goes through the function's region (`bom1::iad1::…`). It turned `STALE` after its ten minutes and was rebuilt on the next visit. The sitemap showed `HIT` at 3.6 hours old, and its newest `<lastmod>` is 25 October.
- **The cause, in Next 16.3.5:** the build hands the host its outputs (`node_modules/next/dist/build/adapter/build-complete.js`). It makes any route built ahead of time whose address is a metadata file's (`/sitemap.xml`, `/robots.txt`, by `isStaticMetadataFile`) a static file. The route's function is left out, and its age with it. It decides by the address alone, so a route handler at `sitemap.xml/route.ts` would be treated the same way. `llms.txt` is not a metadata file's name, which is why it works. A metadata route that is not built ahead of time stays a function ("Dynamic metadata routes … should remain app routes", in the same file).
- **Not the rebuild throwing**, as first guessed: there is no rebuild. A rebuild that failed would have been served `STALE`.

- [ ] A test fails while a discovery file is one the build would hand the host as a static file, and passes after
- [ ] `sitemap.xml` and `robots.txt` are built on each request, so a publish shows in them at once
- [ ] The tests that hold their age and their marks say what is now true
- [ ] After the deploy, `rabaedapp.com/sitemap.xml` lists `/profile` and `/en/profile`, and the response comes from the function, not a fixed file
