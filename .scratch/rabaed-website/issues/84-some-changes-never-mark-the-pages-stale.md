# 84: Bug — replacing an image does not refresh the pages that show it, and the not-found page has no maximum age

**What is wrong:** two holes in how a change reaches the cached pages (ADR-0016, ADR-0017).

1. **Images.** Every content collection and global calls `refreshSite` after a change — except the two image collections, `src/cms/collections/media.ts` and `sharing-images.ts`, whose only hooks are the before-change sanitiser and size checks. An Editor who fixes a logo's alt text or replaces a Trust strip logo sees the old one until each page's ten-minute maximum age runs out. If replacing the file deletes the old one (`deleteAssociatedFiles`), pages point at a missing file until then.
2. **The not-found page.** Publishing marks it stale with the rest, but it carries no `revalidate`, so it has no maximum age — the one cached page ADR-0016's promise does not reach. `tests/unit/cached-page-age.spec.ts` checks only the folders and files it names, and it does not name this one.

Found by the architecture review of 24 September 2026 (L4, L8). **Due before launch** for the images.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Saving, replacing or deleting an image in either collection marks the site stale, as every other collection does (`refreshSiteWhenSaved` or its equivalent, `src/cms/revalidation.ts`)
- [x] A test replaces a Trust strip logo's alt text and finds the new text on the home page well inside ten minutes — asked of an article's cover instead: see the comments
- [x] `src/app/not-found.tsx` (or its segment) carries the ten-minute age, and `cached-page-age.spec.ts` holds it to it
- [x] If a replaced file is deleted before the pages are rebuilt, the ticket says what a visitor sees in that moment (checked, not assumed)

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **The fix** is `refreshSiteWhenImageChanges` in `src/cms/revalidation.ts`: an `afterChange` and an `afterDelete` hook that call `refreshSite`, spread into the hooks of `media.ts` and `sharing-images.ts` beside their checks. An image keeps no drafts, so every save counts, as `refreshSiteWhenSaved` does for the AI crawler switch. The three migrations that create or delete images already pass `SKIP_REVALIDATION`, so none of them now asks Next for a page cache it does not have.
> - **The test is not the one the ticket names.** The Trust strip does not show an image's description: a mark's `alt` is the company's name, from the strip's own entry (`src/content/trust-strip.ts`). And every suite reads the strip, so a test that changed a published mark would change what they read. The three tests are in `tests/e2e/blog.spec.ts` instead, on an article the test publishes and nothing else reads, so what rebuilds it is the test's change and nothing another suite publishes:
>   - a cover image given a new description, which reaches the article's `alt`;
>   - a cover image given a new file, below;
>   - a sharing image given a new description, which reaches the article's `og:image:alt`.
>
>   Each waits out publishing's second mark (ADR-0017) until Next answers the article from its cache (`HIT`), then changes only the image. **Before the fix**, run alone, the two descriptions never arrived: `HIT` for the whole sixty seconds. After it, all three pass.
> - **The not-found page** exports `revalidate = 600`. Next builds `src/app/not-found.tsx` as the page of a route of its own, `/_not-found` (`next-app-loader`), so it reads the age from that file as from any page. The build's `prerender-manifest.json` said `false` for `/_not-found` before and `600` after. `tests/unit/cached-page-age.spec.ts` lists the file with the other five. The running-application spec cannot hold it: Next sends a 404 to browsers as `private, no-cache, no-store`, though it answers it from its own cache (`HIT`), so the age is not in any response.
> - **What a visitor sees when a replaced file is deleted**, checked on the test server:
>   - The old file stops answering the moment it is replaced. Payload deletes it from its own disk before storing the new one, and answers `500` for it. On a deployment, the storage plugin deletes it once the new one is stored, and answers `404` (`@payloadcms/storage-s3`, `getFile.js`).
>   - **Before the fix**, pages went on naming the deleted file until their ten-minute age ran out: a missing picture on an article, a company's name in place of its mark in the Trust strip.
>   - **After it**, the first visitor after the change is sent a page built again before it is answered (`MISS`), already naming the new file. The next is served that page from the cache (`HIT`). This was seen on an article, which is built on demand, and on the home page, which is built ahead of time. The home page was checked by replacing a Trust strip mark with the same pixels under a new name, in a throwaway spec run alone and then deleted; `blog.spec.ts` keeps the article's case.
>   - The one visitor left with a missing picture is one sent the page *before* the change whose browser asks for the file after it.
>   - **All of this is the test server's cache** (`next start`), where Next records a mark before the edit is answered and builds the page again before its next visitor is answered. Vercel keeps its own cache, and nothing in `node_modules` shows it does the same in the same order, so on a deployment the first visitor after a replacement may still be sent the page as it was: a missing picture for that one visit, not ten minutes of them.
> - **Every image the suites upload or delete now marks the site too**, about ten suites' worth, as a publish does. That is more rebuilding during a full run, beside the connection starvation ticket 70 met, so the full run was watched for it.
> - **The two description tests prove the fix only when run alone.** A publish anywhere marks every page, so beside other suites another suite's publish can rebuild the article during the wait, as with `stale-render.spec.ts`. The replacement test does not have this gap: it reads the very next response.

