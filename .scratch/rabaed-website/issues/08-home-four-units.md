# 08: Home — the four units tab strip

**What to build:** The section where a visitor switches between Rabaed's four units and sees the matching app screen change.

**Blocked by:** 04, 05

**Status:** ready-for-agent

- [ ] Tabs respond to click, hover and arrow keys, as on the Reference site
- [ ] Screen mocks are the exported images from ticket 05, not rebuilt markup
- [ ] Each mock carries a meaningful `alt` description and a visible caption stating the same claim in real text (ADR-0002)
- [ ] The stage breaks out of the 1180px content width up to a 1440px maximum, as on the Reference site
- [ ] Below 700px, mocks render at intrinsic width inside a horizontally scrollable container so visitors pan rather than squint
- [ ] Images carry explicit dimensions; no layout shift as they load
- [ ] Matches baselines at all eight widths
