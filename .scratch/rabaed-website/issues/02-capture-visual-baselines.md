# 02: Capture visual baselines of the Reference site

**What to build:** A permanent photographic record of the Reference site as it looks today, so every rebuilt page can be proved to match it. This must happen before anything is rebuilt — once work starts, the original is no longer reproducible.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Playwright captures full-page screenshots of all nine Reference pages
- [ ] Eight widths: 360, 390, 768, 820, 1024, 1280, 1440, 1600
- [ ] Short-viewport captures included, because the pinned sections are tuned for laptop heights
- [ ] IBM Plex Sans Arabic is available locally during capture; a missing Arabic font invalidates every baseline
- [ ] Baselines committed to the repository with a short README explaining what they are and that they are never regenerated from the rebuild
- [ ] A single documented command re-runs the capture against the Reference site
