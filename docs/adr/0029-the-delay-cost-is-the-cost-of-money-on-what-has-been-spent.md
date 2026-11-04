# The delay cost is the cost of money on what has been spent

The Delay-cost calculator has used the Reference site's formula since ticket 10. It adds two costs: **financing**, the project's whole value at 8% a year for the days of delay, and **site overhead**, 10% of the value spread across the project's months. Its sliders are the project's value, the days of delay and the project's length in months. At 30M SAR, 7 days and 18 months it shows 84,405 SAR.

Ahmed's Company profile (approved by him on 31 October 2026) estimates it another way. It counts **only the cost of money on what has already been spent**: the project's value × its progress so far × 8% a year, for the days handover slips. Money spent comes back only at handover, so each day of delay holds it out for a day longer. The sliders are the value, the days of delay and the progress (5–100%, in steps of 5). At 60M SAR, 7 days and 50% it shows 46,027 SAR.

**The founder chose Ahmed's method for every page on 4 November 2026: the home page as well as the Company profile.** The calculator keeps the home page's look. Its words become one set, kept in the CMS once and shown on both pages, so the two cannot disagree.

## Considered options

- **Keep the Reference formula on the home page, and Ahmed's on the Company profile.** Two answers to the same question, on the same site, a click apart.
- **Ahmed's method plus site overhead.** It gives a larger number, but overhead is a cost the contractor carries, not the owner the calculator speaks to. And Ahmed's assumptions note already says what the estimate leaves out: delayed revenue, supervision fees, contractor claims and penalties.

## Consequences

- **This overrules the Reference site**, which `CLAUDE.md` treats as the specification. Ticket 10's "preserves the Reference site's formula exactly" no longer holds, and the home page's calculator differs from `reference/site/index.html`'s on purpose. Do not restore it.
- **The home page's number falls.** The method counts less, and the default value changes from 30M to 60M SAR. The result shows one figure, "on X SAR spent so far", in place of the financing and overhead lines.
- **The project-length slider goes, and a progress slider comes.** `src/lib/delay-cost.ts` and its direct test (`tests/unit/delay-cost.spec.ts`, the second seam the spec allows) change with it. Ahmed's three acceptance cases become the test's: 30M, 7 days and 100% give 46,027; 200M, 7 days and 50% give 153,425; 300M, 60 days and 100% give 3,945,205.
- **The words move out of the home page's CMS entry** into one shared entry, like the Trust strip, with each page keeping its own switch to show or hide the calculator.
