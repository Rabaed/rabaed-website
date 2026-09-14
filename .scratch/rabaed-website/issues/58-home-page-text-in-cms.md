# 58: The home page's text in the CMS

**What to build:** Ahmed changes anything the home page says — the hero, the field situations, the four units, the Record, the before-and-after, the calculator's words, the figures — and publishes it himself, and the admin keeps every card inside its frame.

**Blocked by:** 53, 57

**Status:** ready-for-agent

- [ ] Every section's words and pictures on the home page are read from the CMS, including the hero diagram's party names and statuses, the deck hints, and the calculator's words
- [ ] Every list is editable, except where the design is built around an exact count: the hero's buildings (3), the before/after steps (4) and the calculator's sliders (3) stay locked (spec: Content model)
- [ ] The four units' screens use ticket 57's replaceable Screen mocks, and the page ends on ticket 57's shared closing section
- [ ] Limits where the design cannot carry more: the figure cards (344×296, 268px tall on short screens) and the situation cards (340×348); the before/after cards, which are absolutely positioned with a minimum height; the closing steps' labels, which do not wrap
- [ ] A figure with no source stays off the page, as it does today (`isAttributed`), and an Editor sees in the admin why a figure is not showing (ticket 47 is where the founders supply the sources)
- [ ] Every section but the closing section can be hidden
- [ ] A migration imports the home page's words verbatim as its first published version, and its static copy and data files go
- [ ] The home page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the Trust strip (ticket 20), the FAQ entries (ticket 22), the calculator's formula (`src/lib/delay-cost.ts`, which stays code), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53. The largest page, taken last, once the shared pieces exist.

**Where the limits bite** is ticket 21's survey of 13 September 2026, re-checked against today's code before setting any limit. The before/after cards' starting state uses `nth-child` for four columns (two on mobile), which is part of why that count stays locked.

**Parallel sessions.** Touches only the home page's module, components and data files, and a migration of its own. Take it after ticket 57 is merged.
