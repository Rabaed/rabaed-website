# 103: The Delay-cost calculator counts the cost of money on what has been spent

**What to build:** Ahmed's method on the home page's calculator (ADR-0029, spec: The Delay-cost calculator). The calculator gets:
- a progress slider in place of the project-length slider;
- one result line, "on X SAR spent so far", in place of the financing and overhead lines;
- Ahmed's words and defaults.

Its words move out of the home page's CMS entry into one shared entry, so the Company profile can show the same calculator (ticket 106).

**Blocked by:** None (can start immediately).

**Lane:** 1a

**Status:** ready-for-agent

- [ ] `src/lib/delay-cost.ts` computes value × progress% × 8% a year ÷ 365 × days. Its parts are value 1M–300M step 1M (default 60M), days 1–60 (default 7) and progress 5–100% step 5 (default 50). No site overhead
- [ ] `tests/unit/delay-cost.spec.ts` holds Ahmed's three acceptance cases: 46,027, 153,425 and 3,945,205 (ADR-0029)
- [ ] The home page's calculator keeps its look. The project-length slider becomes progress (with a «%» unit). The two breakdown lines become one, «على X ر.س مصروفة حتى الآن» / "on X SAR spent so far". The total and its button are unchanged in place and size
- [ ] Its words come from one shared CMS entry, like the Trust strip, seeded with Ahmed's words from `../source/*.json` (`cost` in each). They replace the home page's calculator words, which leave the home page's entry. The home page keeps its switch to show the calculator
- [ ] `tests/e2e/home-calculator.spec.ts` checks the new sliders and result, and that an Editor's change to the shared words reaches the home page
- [ ] Claims `src/app/(ar)/page.tsx` / `src/styles/home.css` in `claims.md` before changing them, if it does
