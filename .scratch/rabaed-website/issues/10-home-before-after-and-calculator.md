# 10: Home — before/after seam and delay-cost calculator

**What to build:** Two interactive sections: the draggable before/after comparison whose columns flip as the seam passes, and the calculator where a visitor sets project value, delay days and duration to see what delays cost.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Seam responds to pointer drag and keyboard; the column flip band matches the Reference site
- [ ] The one-time auto-sweep hint runs, and is skipped under reduced motion
- [ ] Calculator preserves the Reference site's formula exactly: financing at 8% per year plus site overhead at 10% spread across the project duration
- [ ] Slider ranges match the Reference site; the track repaints as values change
- [ ] The calculation is covered by a direct unit test — the one permitted exception to the single-seam rule (see spec)
- [ ] Numerals render correctly in Arabic context
- [ ] Matches baselines at all eight widths
- [ ] The homepage as a whole now matches baselines at all eight widths — handed on from ticket 11, which landed before 09 and 10. If ticket 09 lands after this one, this criterion moves there
