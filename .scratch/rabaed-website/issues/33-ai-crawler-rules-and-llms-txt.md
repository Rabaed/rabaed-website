# 33: AI crawler rules and llms.txt

**What to build:** The GEO layer: telling AI systems which crawlers may read the site, and giving them a clean summary of what Rabaed is and where its pages are.

**Blocked by:** 31

**Status:** ready-for-agent

- [ ] `robots.txt` distinguishes retrieval and citation crawlers from training crawlers, following the handoff's draft
- [ ] Retrieval and citation crawlers are allowed: they are how Rabaed gets quoted in AI answers
- [ ] Training crawler policy is a single switch the founders can flip, defaulting to allowed, with the trade-off written down
- [ ] `llms.txt` served, based on the handoff's draft, listing the pages and describing the product in Rabaed's own words
- [ ] `llms.txt` is regenerated from CMS content rather than hand-maintained, so it cannot go stale
- [ ] Both files are reachable and correctly typed

**Note from ticket 05:** the Screen mock studio must be excluded from the sitemap. It is already `noindex` unconditionally, but it should not be listed. `STUDIO_PREFIX` in `src/screen-mocks/registry.ts` is the prefix to filter on, and ticket 05's checklist leaves that box open until this ticket ticks it.
