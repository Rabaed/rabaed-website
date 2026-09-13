# 08: Home — the four units tab strip

**What to build:** The section where a visitor switches between Rabaed's four units and sees the matching app screen change.

**Blocked by:** 04, 05

**Status:** resolved

- [x] Tabs respond to click, hover and arrow keys, as on the Reference site
- [x] Screen mocks are the exported images from ticket 05, not rebuilt markup
- [x] Each mock carries a meaningful `alt` description and a visible caption stating the same claim in real text (ADR-0002) — the Reference site's own full description of each screen, as both; see below
- [ ] The stage breaks out of the 1180px content width up to a 1440px maximum, as on the Reference site — **not built, because the Reference site no longer does it** (ADR-0005)
- [x] Below 700px, mocks render at intrinsic width inside a horizontally scrollable container so visitors pan rather than squint — at 1040px, which is the Reference site's width for it
- [x] Images carry explicit dimensions; no layout shift as they load
- [x] Matches baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports

## Comments

**What was built.** «أربع وحدات. سجل واحد يجمعها.» — five tabs, and beside them the app screen for whichever is chosen: the four units, and a fifth tab for the Record they produce. It sits after the situations deck, where the Reference site has it.

`src/components/home/four-units.tsx` is a server component: every tab, all five screens, all five captions and the link to the product page are in the first response, with the first tab chosen. `four-units-behaviour.tsx` is the client component that switches between them. How a tab, its screen and its caption look for a given choice is decided once, in `four-units-state.ts`, which both read — so the page a script-less visitor sees and the page after a click cannot disagree. The tabs are data in `src/content/four-units.ts`, each naming its Screen mock by the id `src/screen-mocks/registry.ts` gives it; a name the registry does not know stops the build and says which.

The teaser head and foot — `.tz-head`, `.tz-foot`, `.tz-more` — went into `tokens.css` rather than `home.css`, because four Reference pages carry them: home, partnership, referral and tool.

### The screens are pictures, not markup

The Reference site carries the five mocks inline in this section — about 120 KB of hand-positioned HTML — and scales each to fit its box with a script on every resize. Here each is the image ticket 05 exported, placed through `next/image`, which serves a size for the screen asking for it rather than the 2880px master (ADR-0002). There is no fitting script: a picture scales itself.

### The stage does not break out to 1440px — ADR-0005

The ticket asks for the stage to break out of the 1180px column up to 1440px, "as on the Reference site", and `reference/HANDOFF.md` describes the rule. **No Reference page contains it.** The section was redesigned after the handoff was written — the stylesheet marks it "v3.4 · four units" — so that at 981px and above the tabs stand in a 290px column and the screen fills the rest of the 1180px width, no taller than the window, and below 981px the screen is centred at up to 820px. The baselines were captured from that.

The ticket's fourth criterion and its seventh therefore cannot both be met, and the Reference site is the oracle for appearance. The section follows it, the comparison test holds it there, and because this overrules the handoff, it is recorded as **ADR-0005**, as CLAUDE.md asks. If the wider stage is still wanted, it is a design change to make on purpose, not a restoration.

### The caption, and what it says

ADR-0002: a Screen mock's text is a picture of text, invisible to search engines, AI crawlers and screen readers, so "every mock must ship with a meaningful `alt` description and a visible caption carrying the same claim in real text". The Reference site has no caption.

**Both are the Reference site's full description of each screen — taken from its product page.** The home page's own Reference markup only *names* each screen — «شاشة المراسلات الرسمية في ربائد» — which says which screen it is and nothing about what is on it, and nearly repeats the tab's title. The product page describes the same five screens, which are byte-identical images, in full: «شاشة المراسلات الرسمية في ربائد: خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف». That is a claim about what the picture shows, and it is the founders' own copy, so nothing is invented. The first version of this ticket used the bare names; the spec review caught that they were labels rather than claims.

The caption sits under the screen, changes with the tab, and is **centred on the screen** — the captions are held to the same width as the stage, so on a short window, where the screen is narrower than its column, the caption stays under the picture rather than drifting to the middle of the column. It is hidden from screen readers only because they already hear the same words as the image's description.

It uses the Reference site's own class and rule, `.jt-hint` — written for a line of text under this stage, and never used there.

**A note for ticket 12.** Ticket 05 kept descriptions out of the registry because the Reference site describes a mock differently on each page. For these five that is no longer true: home and product now say the same sentence. When ticket 12 places them on the product page, it may be the moment to keep one description per mock in one place.

### Two more deliberate differences

- **«المخرَج» is set in the Arabic face.** The fifth tab's small label is Arabic, and the Reference site sets it in DM Mono, which has no Arabic glyphs — the defect the footer (ticket 04) and the guarantee pill (ticket 06) were already fixed for. Bug 45 covers the site-wide `.eyebrow`, which is a decision rather than a patch; this one is local.
- **Reduced motion switches off the cross-fade.** The screen changes at once instead of fading and rising 8px into place — the spec's "animations are skipped".

### Where the Reference site's CSS actually ends up

The Reference site's short-window rules give the tabs, the stage and the link other paddings and margins — `.jt-s { padding: 14px 13px }`, `.jt-stage { max-width: 640px }`, `.tz-foot { margin-top: 18px }` — but in rules that the desktop grid's `#jt` selectors outrank, so on this section they never apply. Only the tab titles' 14.5px and the caption's margin change at short heights, and that is all `home.css` writes. `.tz-foot`'s 18px does apply to teasers on other pages, so it stays in `tokens.css` for them.

This section's rules, media queries included, are kept together in `home.css` rather than spread across the shared breakpoint blocks, because the rules and the ones that override them only make sense read side by side.

### Tests

`tests/e2e/home-four-units.spec.ts`: the whole section in the first response, every screen's description as its `alt`; the first unit chosen with JavaScript off; choosing by click, by the pointer arriving, and by the arrow keys with focus moving and wrapping round; every screen actually arriving as ticket 05's exported picture, with a caption matching its description; the caption's words centred under the screen and within its width, at a wide window, a short one and a phone; nothing below the stage moving while the pictures are held back for two seconds; a phone showing the screen at 1040px, panning inside the stage without the page scrolling sideways; and, with reduced motion, a chosen screen being there at once.

`tests/e2e/home-four-units-match-reference.spec.ts` compares the heading, the rule, every tab and each part of it, the stage, all five screens' boxes and the link against the Reference page at all sixteen baseline viewports. What is inside a screen is not compared here — the Reference site draws markup and the rebuild shows the picture of it, which `screen-mocks.spec.ts` already holds to that markup pixel for pixel. The caption makes the section taller, so the section's height and the link's height on the page are left out; the link is still measured in full from its own corner, and the caption's own position is held by the behaviour spec. «المخرَج»'s typeface is left out; its box is not.

**Verified by falsification.** Widening the gap between the tabs by one pixel in the desktop grid failed exactly the twelve viewports at 981px and above. Narrowing the phone's panned screen to 1000px failed exactly 360px and 390px. Swapping the arrow keys failed exactly the keyboard test. Removing the rule that holds the captions to the screen's width failed exactly the short window, 1280×550 — the one case where the screen is narrower than its column.

**One limit worth stating.** The layout-shift test proves nothing moves as the pictures land, but not which of two things prevents it: the stage keeps the screen's proportions in CSS, and `next/image` writes each picture's dimensions onto it. Either would hold the page still on its own here.

### Shared along the way

- **`tests/e2e/geometry.ts`** — measuring a region against the Reference site, and measuring sideways overflow. The comparison specs had each carried their own copy; this would have been the third.
- **`openBothPages`** in `tests/e2e/reference-site.ts` — the two pages side by side with reduced motion, fonts loaded and transitions frozen, which the hero, deck and four-units comparisons had each written out in full. Re-verified after the move by breaking one rule under each: the hero comparison failed exactly the six tall desktop viewports where its 110px padding applies (at 700px and shorter a different rule sets 94px), and the deck comparison failed the same six viewports it failed in ticket 07.
- **`src/lib/reading-direction.ts`** — which arrow key means "next", and reading the direction the server wrote. The deck had its own copy; this section would have been a second.

### What the review changed

Two reviews. The spec review found the section faithful — every CSS value, the cascade, the key mapping and the copy — and the standards review found no breach of a written standard. What they did find:

- **The descriptions were labels, not claims.** Now the product page's full descriptions, above.
- **The breakout decision had no record where this repo keeps decisions that overrule the handoff.** Now ADR-0005.
- **The caption's position was compared against nothing**, and on a short window it sat under the column rather than the picture. It is centred on the screen now, with a test that fails without the rule that does it.
- **The tabs worked out the reading direction for themselves**, which undid ticket 07's review. They read the server's answer through the shared module now.
- **"Which tab is chosen" was written in four places** across the server and the browser. It is one function.
- **Duplicated test code** — the sideways-overflow check, the image-arrived check, and the comparison set-up — is shared.
- **A new class name, `.jt-cap`, where the Reference site had one.** It is `.jt-hint`.
- **Names that said the wrong thing.** `ACROSS_ONLY` listed what is left *out*; it is `EVERYTHING_BUT_ACROSS`. `FourUnit` named a list whose fifth member is not a unit; it is `UnitTab`, in `UNIT_TABS`. `screen` held a description; it is `description`. `Measured` is `Measurement`, and its type is no longer widened to plain strings.
- **Checked and left.** A mock's id is a plain string, checked when the page is built rather than by the type — the registry's own ids are strings, and a wrong one stops the build naming it.

### Not covered

**"No duplicates in development"** is protected by construction — every listener removed on teardown and the first tab put back — and was not separately checked by hand, for the reason ticket 07 gives.

**The Reference site's tabs are all in the tab order**, and so are these, rather than the single-stop tab list the ARIA pattern describes. Changing how the keyboard moves through the page is a behaviour change the ticket did not ask for; it is the kind of thing ticket 36's accessibility pass decides.
