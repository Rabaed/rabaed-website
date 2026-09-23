# 96: Swiping and the screen's height are handled one way across the site

**What to build:**
- One "swipe surface" convention, with one CSS rule set and one drag behaviour, shared by the card decks, the before-and-after knob and the Screen mock pan.
- One unit for the screen's height.
- One breakpoint token.

**Why:** each phone bug of the last week was fixed where it surfaced (tickets 71, 72, 74, 77, 80), each with a `home.css` patch and a test of its own:
- **Sideways gestures on a page that scrolls down are handled section by section:** `touch-action: pan-y` on the card deck and the comparison (`home.css:165`, `:540`); `overflow-x: clip` on four sections and the body (`home.css:156`, `:199`, `:533`, `tokens.css:89`); sideways-scrolling stages (`home.css:335`, `product.css:48`).
- **The screen's height is measured four ways:** `100vh` in the hero and the product journey (`home.css:34`, `:708-709`), `svh` and `lvh` in the Record (`home.css:449-471`), and `dvh` in the mobile menu (`shell.css:141`, `:199`).
- **The 980/981px breakpoint is written out 62 times in 17 files**, two of them JavaScript (`record-behaviour.tsx:11-13`, `journey-behaviour.tsx:15`).

Found by the architecture review of 24 September 2026 (A10b).

**Blocked by:** 86 (the sitewide phone sweep, which has to be in place to show that nothing moved), and 85 (the hero's height, which the founder decides first).

**Status:** needs-triage — measuring every height with the bars showing (`svh`) departs from the Reference site's `100vh`, like ADR-0019 and ADR-0021 did, so it is the founder's call and needs an ADR

- [ ] **The founder decides** the screen-height unit for the whole site. An ADR records it, extending ADR-0021 rather than contradicting it
- [ ] The breakpoint is one token for CSS and one constant for JavaScript
- [ ] The three swipe surfaces share one convention and one drag behaviour, or the ticket says why one must differ
- [ ] Ticket 86's sweep and the Reference comparisons pass unchanged, except where the ADR names a change
