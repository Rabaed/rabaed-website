# 12: Product page

**What to build:** The full product page, including the pinned horizontal journey — the section where the page holds still and four panels move sideways as the visitor scrolls — plus the role tabs for Owner, Consultant and Contractor, and the internal approval loops section.

**Blocked by:** 04, 05

**Status:** ready-for-agent

- [ ] Pinned horizontal journey works at ≥981px **and** at short viewport heights, gated exactly as the Reference site gates it (`min-width: 981px and min-height: 551px`)
- [ ] Movement direction is correct for right-to-left; dot indicators track progress
- [ ] Below the gate, the journey degrades to the vertical layout as on the Reference site
- [ ] Pinning survives navigating away and back; positions are refreshed after layout changes; no duplicate animations in development
- [ ] Role tabs switch their Screen mocks; mocks are exported images with descriptions and captions
- [ ] Matches baselines at all eight widths, including short-height captures
- [ ] Zero console errors, zero failed requests, zero horizontal overflow

**Note:** the spec flags this as the most fragile part of the site. Expect it to need the most care and the most test attention.
