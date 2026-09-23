# 87: Bug — the case studies link shows before the first story if an Editor ends its path with «/»

**What is wrong:** the header and the Footer directory hide the case studies link until the first story is published in that language (`shownWith`, `src/content/site-words.ts:79-82`). It recognises the link by comparing its path exactly with `CASE_STUDIES_PATH`. The link's path is an Editor's to type, and `site-words.ts:140` shows paths may end in a slash — so `/case-studies/` slips past the filter, and the menu leads to a page that is not there yet.

Found by the architecture review of 24 September 2026 (L7).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The link is recognised however its path is written: with or without a trailing slash, and in English at `/en/case-studies` as well
- [ ] A test publishes the header's link as `/case-studies/` with no story published and finds no case studies link, then publishes a story and finds it
- [ ] Either the CMS normalises the paths Editors type in the menu and footer, or the comparison does; the ticket says which, and why
