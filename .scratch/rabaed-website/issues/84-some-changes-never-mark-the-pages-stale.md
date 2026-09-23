# 84: Bug — replacing an image does not refresh the pages that show it, and the not-found page has no maximum age

**What is wrong:** two holes in how a change reaches the cached pages (ADR-0016, ADR-0017).

1. **Images.** Every content collection and global calls `refreshSite` after a change — except the two image collections, `src/cms/collections/media.ts` and `sharing-images.ts`, whose only hooks are the before-change sanitiser and size checks. An Editor who fixes a logo's alt text or replaces a Trust strip logo sees the old one until each page's ten-minute maximum age runs out. If replacing the file deletes the old one (`deleteAssociatedFiles`), pages point at a missing file until then.
2. **The not-found page.** Publishing marks it stale with the rest, but it carries no `revalidate`, so it has no maximum age — the one cached page ADR-0016's promise does not reach. `tests/unit/cached-page-age.spec.ts` checks only the folders and files it names, and it does not name this one.

Found by the architecture review of 24 September 2026 (L4, L8). **Due before launch** for the images.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Saving, replacing or deleting an image in either collection marks the site stale, as every other collection does (`refreshSiteWhenSaved` or its equivalent, `src/cms/revalidation.ts`)
- [ ] A test replaces a Trust strip logo's alt text and finds the new text on the home page well inside ten minutes
- [ ] `src/app/not-found.tsx` (or its segment) carries the ten-minute age, and `cached-page-age.spec.ts` holds it to it
- [ ] If a replaced file is deleted before the pages are rebuilt, the ticket says what a visitor sees in that moment (checked, not assumed)
