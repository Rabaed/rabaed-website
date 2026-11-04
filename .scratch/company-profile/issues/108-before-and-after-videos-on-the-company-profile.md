# 108: Before and after: five videos on the Company profile

**What to build:** Ahmed's section 09 (`#compare`), the site's first videos (spec: Sections, in order; the videos).

**Blocked by:** 102 (the page has to exist).

**Lane:** 2b

**Status:** resolved

- [x] Five pill tabs (approvals, documents, correspondence, dashboard, daily report). Each panel has its question, its three-row "Before / With Rabaed" table, its video and its note, and every word is an Editor's
- [x] Each video plays muted and looping while it is on screen, and pauses off screen and when its tab is left. Under reduced motion, Save-Data or a 2G connection it waits behind its poster and its «شغّل المقارنة» / "Play the comparison" button. Nothing is fetched before it is needed
- [x] The five MP4s and their posters (Ahmed's `media/clips/` and `poster-0N-960.webp`) are defaults in `public/profile/clips/`. An Editor can replace each in the CMS, through a collection or field that keeps an MP4 as it is (the `media` collection turns uploads into WebP)
- [x] The section cannot be hidden, because the Profile PDFs link to `#compare`
- [x] Any Content-Security-Policy the site sends allows the videos from where they are served
- [x] Tests cover a video starting only once on screen, staying still under reduced motion, and a replacement video being served
