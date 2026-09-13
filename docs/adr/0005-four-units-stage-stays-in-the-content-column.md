# The four-units screen stays in the content column

`reference/HANDOFF.md` describes the home page's «أربع وحدات» section with a stage that breaks out of the site's 1180px content width and widens to as much as 1440px — `--sw: min(1440px, calc(100vw - 64px))` — and ticket 08 repeats it as an acceptance criterion, "as on the Reference site". We are not building it.

No page in `reference/site/` contains that rule. The section was redesigned after the handoff was written: the stylesheet marks the change "v3.4 · four units — the five cards in a column on the right, the screen takes the rest", and from 981px up the tabs stand in a 290px column while the screen fills the remainder of the 1180px width, no taller than the window. Below 981px it is centred at up to 820px. The visual baselines were captured from that design, and the Reference site — not the handoff — is the specification for appearance (CLAUDE.md). So the handoff's description and the ticket's criterion contradict the ticket's own "matches baselines", and the Reference site wins.

## Consequences

- `tests/e2e/home-four-units-match-reference.spec.ts` holds the stage to the Reference site's current layout at all sixteen baseline viewports, so a later change towards the breakout fails loudly rather than drifting in.
- If a wider screen is still wanted, it is a new design decision, made on purpose and with new baselines — not a restoration of something the Reference site has.
- Where the handoff and the Reference site disagree elsewhere, the same order applies: the handoff describes intent at the time it was written, and the Reference site is what shipped.
