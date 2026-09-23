# 86: One test loads every page at phone widths and fails on any sideways scroll

**What to build:** a single sweep that opens every route of the site at 360px and 390px wide and fails if the page is ever wider than the screen — at load, after scrolling to the foot, and while each swipe surface (the card decks, the before-and-after knob, the Screen mock pan) is dragged to both ends. The spec already asks for "zero horizontal overflow, measured against `clientWidth`" on every page; today it is checked section by section, by the suites that happened to find a bug (tickets 71, 72, 74, 80), and 11 specs compute the overflow themselves instead of using `sidewaysOverflow` in `tests/e2e/geometry.ts`.

Phones are where most of the bugs of the last week were found. **Due before launch**: it is cheap, and it guards every page at once.

Found by the architecture review of 24 September 2026 (A10a).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Every route in `tests/e2e/routes.ts`, in both languages where the page exists, is loaded at 360×640 and 390×844
- [ ] At each: no sideways overflow at load, at the foot of the page, and at every frame while each swipe surface is dragged to either end (`widestSidewaysOverflow` exists for sampling every frame)
- [ ] The specs that compute overflow themselves use `geometry.ts` instead, or say why they cannot
- [ ] Any page that fails today is reported in this ticket with what overflows, not fixed silently in the same pull request
