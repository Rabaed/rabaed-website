# 106: The Company profile shows the Delay-cost calculator

**What to build:** section 05, "The hidden cost" (`#cost`): the shared Delay-cost calculator from ticket 103 on the Company profile, with the profile's own show switch (spec: The Delay-cost calculator).

**Blocked by:** 102, 103.

**Lane:** 1a

**Status:** resolved

- [x] The calculator on the Company profile is the home page's component, with its words from the shared entry, in the page's language
- [x] Its button is an Editor's, label and link (default «احجز عرضاً لترى كيف نمنعه» → `/#demo`, `/en#demo`)
- [x] The same inputs give the same total on both pages, which a test checks
- [x] The profile has its own switch to show it, and hiding it leaves the home page's showing

**Built:** the label is the shared entry's `callToActionLabel` (one set of words, ADR-0029), so changing it changes both pages' buttons; the link is the profile's own (`cost.callToActionLink`), as every link on the page is. The section is `#cost`, light, as the home page's `#calc` is. The English page is not previewed in `tests/e2e/profile-calculator.spec.ts`: on the first test server it is drawn only once the header and footer's English is approved, which every other suite's preview would draw too; the English link's default is asserted on the entry instead.
