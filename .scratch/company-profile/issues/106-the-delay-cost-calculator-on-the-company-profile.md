# 106: The Company profile shows the Delay-cost calculator

**What to build:** section 05, "The hidden cost" (`#cost`): the shared Delay-cost calculator from ticket 103 on the Company profile, with the profile's own show switch (spec: The Delay-cost calculator).

**Blocked by:** 102, 103.

**Lane:** 1a

**Status:** resolved

- [x] The calculator on the Company profile is the home page's component, with its words from the shared entry, in the page's language
- [x] Its button is an Editor's, label and link (default «احجز عرضاً لترى كيف نمنعه» → `/#demo`, `/en#demo`)
- [x] The same inputs give the same total on both pages, which a test checks
- [x] The profile has its own switch to show it, and hiding it leaves the home page's showing

**Built:** the button's words and link are the profile's own (`cost.callToActionLabel`, `cost.callToActionLink`), as every button on the page is: a profile-only label changes the profile's button and leaves the home page's alone. The label arrives empty, which means the shared entry's `callToActionLabel` (ADR-0029); the link arrives `/#demo`, `/en#demo`. No section number yet: the planner adds it once the other sections show how numbers are drawn. The section is `#cost`, light, as the home page's `#calc` is. The English page is not previewed in `tests/e2e/profile-calculator.spec.ts`: on the first test server it is drawn only once the header and footer's English is approved, which every other suite's preview would draw too; the English link's default is asserted on the entry instead.
