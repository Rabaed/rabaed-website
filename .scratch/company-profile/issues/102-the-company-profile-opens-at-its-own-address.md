# 102: The Company profile opens at its own address, with the home page's hero and the Trust strip

**What to build:** the Company profile's first slice, from end to end (spec: The page; Sections). The page has:
- an address in both languages;
- an entry in the Page registry and in the CMS;
- the home page's hero, with Ahmed's words and the two new buttons;
- the shared Trust strip;
- the site's header and footer.

Nothing in the header or the Footer directory links to it. Nothing is shown on rabaedapp.com until it is published.

**Blocked by:** None (can start immediately).

**Lane:** 2a

**Status:** resolved

- [x] `/profile` and `/en/profile` are routes, built the way `docs/deployment.md` "Adding a page" describes: a `profile-page` CMS entry with its search tab, a loader, a page component, and both route files. Everything that page needs is listed in `MARKETING_PAGES`, `tests/e2e/routes.ts` and the hand-kept suite lists
- [x] `profile` is one of the site's own segments (`SITE_SEGMENTS` and the literal matcher in `src/proxy.ts`, ADR-0026), and `tests/unit/product-app-address.spec.ts` agrees
- [x] While its Arabic is unpublished, `/profile` answers 404 and is absent from `sitemap.xml` and `llms.txt`. Once it is published, it answers 200 and is in both. `/en/profile` shows the English notice until its English is published. The seed leaves both unpublished
- [x] No seed adds the page to the header menu or the Footer directory
- [x] The hero is the home page's component (`src/components/home/hero.tsx`), with its words from the profile's own CMS tab: Ahmed's eyebrow, three-line heading, lead and badges from `../source/*.json`. Its two buttons are "Book a live demo" → `/#demo` (`/en#demo`) and "WhatsApp us" → the site's WhatsApp address. Each has a label and a link an Editor can change, and an empty WhatsApp link means site settings' address. The home page's hero renders exactly as before
- [x] The Trust strip is the shared one, with the profile's own show switch
- [x] The page has its own search title and description and a Sharing image (Ahmed's `og-ar.png` and `og-en.png` as defaults)
- [x] Tests cover all of the above, through the running site, on the ticket's own port

## Resolution

Built on branch `ticket-102`. One departure from the first box: `/profile` is **not** in `tests/e2e/routes.ts`. The migrations leave it unpublished, as this ticket asks, so on the first test server it is not found, and every suite that walks `routes.ts` would fail on it. It is named in `NOT_IN_ROUTES_TS` (`tests/unit/page-registry.spec.ts`) beside the case studies index, for the same reason, and `tests/e2e/profile-page.spec.ts` publishes it on the second server and holds it there: not found and unlisted before, then 200, in `sitemap.xml` and `llms.txt`, with its title, description, sharing image and breadcrumb trail. `cached-page-age.spec.ts` lists both addresses; `ai-crawlers.spec.ts` leaves it out of its fixed list, since the profile suite leaves it published on that server. Once the founder publishes it (ticket 110), whether the test database should publish it too, so that `routes.ts` and the suites that walk it cover it, is a decision for then.
