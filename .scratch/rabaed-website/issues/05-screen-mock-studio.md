# 05: Screen mock studio and image export

**What to build:** A repeatable way to turn the co-founder's hand-built app screens into images, so they can be placed on pages without carrying thousands of lines of imitation markup into production. Changing a label later is a script run, not a redesign.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] The Reference site's mock markup is preserved in the repo behind a studio route, excluded from the sitemap and blocked from indexing
- [ ] A script renders each Screen mock and exports an optimised image at high resolution, with dimensions recorded
- [ ] The export is locale-aware by construction, so an English set can be produced later without rework (ADR-0002)
- [ ] Arabic set exported for every mock used on the Home and Product pages
- [ ] Exported images match their Reference site counterparts against the baselines
- [ ] A single documented command regenerates all mocks
