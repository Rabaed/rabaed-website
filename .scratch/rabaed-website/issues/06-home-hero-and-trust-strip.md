# 06: Home — hero and Trust strip

**What to build:** A visitor lands on the homepage and sees the animated hero — a document travelling between Owner, Consultant and Contractor — followed by the moving bar of client logos.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Hero matches baselines at all eight widths, including `100vh` with a 760px minimum at ≥981px and auto-height below
- [ ] The hero loop animation is preserved: travelling document, pulse ring, changing status text
- [ ] Trust strip moves continuously, pauses on hover, and falls back to the company name as text if a logo image is missing
- [ ] With reduced motion enabled, the loop is skipped and all content stays legible
- [ ] GSAP is a proper dependency, scoped and cleaned up on unmount; no duplicates in development
- [ ] Zero horizontal overflow measured against `clientWidth`
- [ ] Zero console errors and zero failed requests
