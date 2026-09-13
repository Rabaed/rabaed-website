# 10: Home — before/after seam and delay-cost calculator

**What to build:** Two interactive sections: the draggable before/after comparison whose columns flip as the seam passes, and the calculator where a visitor sets project value, delay days and duration to see what delays cost.

**Blocked by:** 04

**Status:** resolved

- [x] Seam responds to pointer drag and keyboard; the column flip band matches the Reference site
- [x] The one-time auto-sweep hint runs, and is skipped under reduced motion
- [x] Calculator preserves the Reference site's formula exactly: financing at 8% per year plus site overhead at 10% spread across the project duration
- [x] Slider ranges match the Reference site; the track repaints as values change
- [x] The calculation is covered by a direct unit test — the one permitted exception to the single-seam rule (see spec)
- [x] Numerals render correctly in Arabic context
- [x] Matches baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports
- [x] The homepage as a whole now matches baselines at all eight widths — every section in the Reference site's order and as tall as the Reference site's, at all sixteen viewports, except where an earlier ticket decided otherwise; see below

## Comments

**What was built.** The last two sections of the home page, after the Record, where the Reference site has them.

- «نفس الاعتماد… بطريقتين.» — four moments in one material approval, each a card that shows the usual way or Rabaed's, and a seam the visitor drags across them. Every step to the right of the seam shows Rabaed's way, and a verdict under the cards says which way won. `src/components/home/before-after.tsx` is a server component, `before-after-behaviour.tsx` moves it, and the arithmetic — the 11% band over which a card turns, how each face rises and fades, the verdict, the 6% key step — is `before-after-seam.ts`, number for number the Reference site's.
- «كم يكلفك أسبوع تأخير اعتماد واحد؟» — three sliders and what the delay they describe costs. `delay-calculator.tsx` is a server component, `delay-calculator-behaviour.tsx` redraws it, and what it writes for any setting — the readings, the cost and its two parts, each track filled up to its thumb — is decided once in `delay-calculator-state.ts`, which both read. The formula is `src/lib/delay-cost.ts`.

The copy is in `src/content/before-after.ts` and `src/content/delay-calculator.ts`.

### The formula, and its unit test

Financing is the project's value at 8% a year for the days of delay; site overhead is 10% of the value spread across the project's months at 30.4 days each, for the days of delay. The operations are written in the Reference site's order, and the total is rounded on its own rather than added from its rounded parts — so the calculator opens on 84,405 riyals, as the Reference site's does, not 84,404.

`tests/unit/delay-cost.spec.ts` is the direct unit test the spec permits. It runs under Playwright, so CI needs nothing new, but asks for no page and opens no browser; `playwright.config.ts` now looks in `tests/` rather than `tests/e2e/` to find it. Every figure it expects was worked out by hand from the Reference site's script, not read back from the module: the starting settings, both ends of every slider, that the total is rounded once, that cost grows in step with the delay, and that a longer project thins the overhead and leaves financing alone.

### Deliberate differences

- **Arabic set in DM Mono is set in the Arabic face.** The Reference site sets «84,405 ر.س», every slider reading («7 أيام»), the comparison's two tags («الطريقة المعتادة») and each card's channel («ورق») in DM Mono, which has no Arabic glyphs — the defect the footer, the guarantee pill and the four units already fix. Only the numbers are DM Mono now. Two typefaces put their baselines at different heights, so lining a DM Mono number up with an Arabic word would make the line 1px taller at 17px and 3px at 52px; the number is given no line height of its own, which keeps it on the shared baseline and the line exactly as tall as the Reference site's. The Arabic face draws «ر.س» narrower than the fallback did, so on a phone the cost now fits on one line where the Reference site wraps it onto two.
- **The comparison opens as the script paints it.** Until the Reference site's script runs — and for good without JavaScript — both faces of every card are drawn on top of each other and all three verdicts overlap. The stylesheet here draws the seam at rest from the start: the two right-hand cards turned over (the first of each row of two, on a phone), the half-way verdict, both tags half shown. A test holds that equal to what the script paints.
- **A thumb on the comparison can still scroll the page.** The Reference site's `touch-action: none` makes most of a phone's screen unscrollable; `pan-y` gives vertical swipes to the page and keeps sideways ones for the seam, as the card deck does.
- **The hint gives way to the visitor.** It never starts once the seam has been moved, and taking hold of the seam while it runs stops it, where the Reference site's sweep carries on and pulls the seam back out of a visitor's hand. The card deck's nudge already behaves this way.
- **The sliders say their readings.** Each carries `aria-valuetext` — «30,000,000 ر.س» — so a screen reader hears riyals and days rather than a bare 30000000.

**Kept as the Reference site has it.** The seam, the wash behind it and the tags are physical — the usual way on the left, Rabaed's on the right — because they are a picture with a left and a right; the English site revisits them (ticket 42). And the slider readings say «1 أيام» and «6 شهراً», where Arabic would say «يوم واحد» and «6 أشهر»: the founders' copy is not reworded in code, and this is worth raising with them before ticket 21 moves it into the CMS.

### The home page as a whole

`tests/e2e/home-whole-page-matches-reference.spec.ts` checks, at all sixteen viewports, that the page has the Reference site's sections in the Reference site's order, each as tall as the Reference site's. Every section already has a part-by-part comparison measured from its own top, so equal heights in the same order are what put everything on the page where the Reference site has it.

It found every section that is deliberately a different height, and each is listed in the spec with the ticket that decided it and the windows where it reaches: the Trust strip below 981px (ticket 06), the four units' captions (ticket 08), the Record below 981px (ticket 09), the calculator on a phone (this ticket), the figures section below 981px, where the placeholder testimonial is left out (tickets 07 and 47), and the closing section's disabled button, 2px taller (ticket 11). Every other section — the hero, the situations deck, the before-and-after, the questions, the footer — is exactly as tall as the Reference site's at every viewport, and the listed ones are wherever their reason does not reach.

### Tests

`tests/e2e/home-before-after.spec.ts`: the whole comparison in the first response; on a desktop window and a phone, dragging the seam to either end and back turns exactly the cards it passes, with the matching verdict and the handle announcing where it is; pressing anywhere brings the seam there; the arrow keys move it 6% and stop at either end; the cards still follow the seam after the window narrows to two columns; with JavaScript off it opens looking as it does with it on; with reduced motion there is no sweep; without, the seam sweeps right, all the way left and back to the middle, once, without announcing it; taking hold of the seam stops the sweep; and it still works after leaving the page and coming back.

`tests/e2e/home-calculator.spec.ts`: the calculator and its starting figures in the first response; the sliders' ranges and starting values; each slider changing the cost, its parts and its reading at once; the keyboard moving a slider, «10 أيام» becoming «11 يوماً»; the numbers in DM Mono and the words in the Arabic face, each number to the right of its word, and the breakdown reading in order; and, with JavaScript off, the tracks filled at their starting positions exactly as the script fills them.

`tests/e2e/home-before-after-and-calculator-match-reference.spec.ts`: both sections, part by part, at all sixteen viewports at rest, and their state — every face's opacity and transform, the verdicts, the tags, the calculator's words and track colouring; the seam dragged to seventeen points across three widths, finely around each column's centre so every card is caught part of the way over, and moved by the arrow keys, compared face by face; and the calculator's words, figures and track colouring for five settings of the sliders.

**Verified by falsification.** Widening the band over which a card turns from 11% to 12% failed exactly the seam comparisons — dragged at all three widths, and by the arrow keys, whose 6% steps land inside the wider band. Removing the rule that keeps a DM Mono number from making its line taller failed the calculator's comparison at all sixteen viewports, and the whole-page check at every window from 768px up, where the calculator's height is compared, and not on a phone, where it is not. Letting the hint carry on after the visitor takes hold of the seam failed exactly the test that it stops. Raising the financing rate to 9% failed the four unit tests that check a figure, and left the three that check a proportion or the formatting passing.

**Two test mistakes the first runs found.** The verdicts fade over a quarter of a second, so a test reading one straight after a drag caught it part-way; it waits for the fade now. And two drags stopped within 5.5% of a card's centre, where a card is, correctly, only part of the way over; they stop clear of every centre now.

### Not covered

**"No duplicates in development"** is protected by construction — every listener removed, the hint and its trigger killed, and the seam's inline drawing taken off the page on teardown — and was not separately checked by hand, for the reason ticket 07 gives.

**A finger dragging the seam** is not tested: Playwright's touchscreen can tap but not drag. The seam listens to pointer events, which a finger sends as a mouse does.
