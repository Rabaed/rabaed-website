# 111: The sitemap and robots.txt follow what is published

**What to build:** a bug fix. On `rabaedapp.com`, `sitemap.xml` does not list `/profile` or `/en/profile`, though both are published, answer 200 and are in `llms.txt` (spec: Search and discovery; ticket 110's last check).

**Blocked by:** none.

**Status:** resolved

**Found (6 November 2026):** production serves `sitemap.xml` and `robots.txt` as the files written at the last deploy (4 November, while the profile waited unpublished). Publishing never reaches them, and neither does their ten-minute age (`revalidate = 600`, ADR-0016).

- **The live headers:** both are answered at the edge alone (`X-Vercel-Id: bom1::…`), with `Accept-Ranges`, an `ETag` and a `Last-Modified`. That is the same as `icon.png`, a file. `llms.txt`, built and marked the same way, goes through the function's region (`bom1::iad1::…`). It turned `STALE` after its ten minutes and was rebuilt on the next visit. The sitemap showed `HIT` at 3.6 hours old, and its newest `<lastmod>` is 25 October.
- **The cause, in Next 16.3.5:** the build hands the host its outputs (`node_modules/next/dist/build/adapter/build-complete.js`). It makes any route built ahead of time whose address is a metadata file's (`/sitemap.xml`, `/robots.txt`, by `isStaticMetadataFile`) a static file. The route's function is left out, and its age with it. It decides by the address alone, so a route handler at `sitemap.xml/route.ts` would be treated the same way. `llms.txt` is not a metadata file's name, which is why it works. A metadata route that is not built ahead of time stays a function ("Dynamic metadata routes … should remain app routes", in the same file).
- **Not the rebuild throwing**, as first guessed: there is no rebuild. A rebuild that failed would have been served `STALE`.

- [x] A test fails while a discovery file is one the build would hand the host as a static file, and passes after
- [x] `sitemap.xml` and `robots.txt` are built on each request, so a publish shows in them at once
- [x] The tests that hold their age and their marks say what is now true

**Built:** `src/app/sitemap.ts` and `src/app/robots.ts` export `dynamic = 'force-dynamic'` in place of their age. The build no longer makes either ahead of time, so the hand-over keeps each as a function. The page registry lists them (`DISCOVERY_FILES_ON_EACH_REQUEST`). `tests/unit/discovery-files-on-the-host.spec.ts` failed for both before the change and passes after. The age tests now exempt the two: `tests/unit/cached-page-age.spec.ts` holds that they are built on each request with no age, and `tests/e2e/cached-page-age.spec.ts` holds that no cache in front may keep them. `llms.txt` keeps its age and its marks.

**After the deploy:** ticket 110's check shows it on production: `rabaedapp.com/sitemap.xml` lists `/profile` and `/en/profile`, answered through the function's region (`X-Vercel-Id: …::iad1::…`), not by a file at the edge.
