# 04: Design system and page shell

**What to build:** The frame every page sits in — header, footer, mobile menu, Partnerships dropdown — looking and behaving exactly as it does on the Reference site, including the header recolouring itself as it crosses dark and light sections.

**Blocked by:** 02, 03

**Status:** ready-for-agent

- [ ] Design tokens defined once, taken verbatim from the Reference site (see spec for the full list)
- [ ] Dark and light implemented as alternating section treatments, not a user theme
- [ ] Header colour toggle uses the Reference site's exact values on both light and dark
- [ ] Partnerships dropdown opens on hover, click and keyboard; closes on Escape and outside click
- [ ] Mobile panel opens fully at ≤980px showing every link
- [ ] Breakpoint contract honoured: ≥981px desktop, ≤980px mobile, plus 700, 680, 640, 620, 560, 400px and the height-based rules
- [ ] The four deliberate CSS exceptions from the spec are preserved and commented in place with their reason
- [ ] Class names from the Reference site retained; no Tailwind rewrite, no scoping that breaks cross-cutting selectors
- [ ] Header and footer match baselines at all eight widths
