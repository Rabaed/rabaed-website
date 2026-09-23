# 85: The home hero is taller than a phone's visible screen

**What is wrong:** below 981px the home hero is `100vh` (`src/styles/home.css:708-709`, `--hero-h: 100vh` and `.hero-grid { height: calc(100vh - 94px) }`). On a phone `100vh` is the screen with the browser's bars hidden, so while they show — which is when a visitor first arrives — the hero's foot is under the address bar, and what the hero was sized to show at once is not all seen. The Record section already avoids this on purpose with `svh` (ADR-0021).

This follows the Reference site exactly, so changing it is a deviation from `reference/` and needs the founder's yes and an ADR, as ADR-0019 and ADR-0021 were.

Found by the architecture review of 24 September 2026 (L5). **Due before launch**, if the founder wants it.

**Blocked by:** None.

**Status:** needs-triage — the founder decides whether the hero is sized to the screen with the bars showing

- [ ] The founder has seen the hero on their own phone (an iPhone with Safari's bars, a Galaxy with Chrome's) and chosen: keep `100vh` as the Reference site has it, or size it with `svh`
- [ ] If changed: the hero fits the screen with the bars showing at 360×640 and 390×664 (the sizes ADR-0021 holds to), and nothing jumps when the bars hide
- [ ] If changed: an ADR records it, and the Reference comparisons below 981px give up the hero's height by name
- [ ] Related: ticket 96 proposes one screen-height unit for the whole site; if the founder wants that, this ticket can fold into it
