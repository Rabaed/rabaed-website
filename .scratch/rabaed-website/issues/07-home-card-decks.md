# 07: Home — card decks

**What to build:** Both draggable quote decks on the homepage: the field-pain deck and the proof deck. A visitor drags a card aside to reveal the next one.

**Blocked by:** 04

**Status:** resolved

- [x] One deck implementation reused by both sections, matching the Reference site's drag behaviour
- [x] Works by pointer, touch and keyboard
- [x] The one-time nudge hint on first scroll into view is preserved
- [x] The intentional off-canvas bleed of the pain cards is preserved and commented as deliberate
- [x] Matches baselines at all eight widths — measured against the Reference site itself, at all sixteen viewports, for the reason ticket 04 records
- [x] Zero horizontal overflow measured against `clientWidth` — including in every frame of a card being thrown off the side

## Comments

**What was built.** Two sections on the home page, in the Reference site's order: «تعرف هذه المواقف؟» straight after the Trust strip, and «ماذا يتغيّر بعد التشغيل؟» where it will sit once tickets 08-10 have filled in the space between them. Both gaps are marked in `src/app/(ar)/page.tsx`.

One deck serves both. `src/components/home/card-deck.tsx` is a server component that draws the pile, the counter and the two buttons around whatever card content it is given; `card-deck-behaviour.tsx` is the client component that makes it respond; `card-deck-stack.ts` holds the geometry, the timings and everything that mirrors with the reading direction, which both of them read.

The sections are `situations.tsx` and `figures.tsx`. Their cards are data in `src/content/field-situations.ts` and `src/content/proof-figures.ts`, and the line both decks share is in `src/content/card-deck.ts` — all ready for ticket 21 to move into the CMS. The sections keep the Reference site's ids, `#pain` and `#proof`, because the stylesheet is written against them; everywhere a name is ours to choose, they are "situations" and "figures".

`src/components/reveal-on-scroll.tsx` adds the `.reveal` entrance — a line rising into view as it is reached — which this is the first ticket to need. It is mounted once in `PageShell`, so every later page picks it up by adding the class.

### The stack is drawn on the server

The Reference site only ever arranges the pile from its script. Until that script runs, all six cards lie on exactly the same spot in document order — so the card on top is the *sixth*, under a counter reading "1". With JavaScript off it stays that way.

The rebuild computes each card's place in the pile — offset, scale, turn, stacking order, and whether a screen reader is given it — on the server, from the same function the script uses after every throw. The first response has the first card on top and the five behind it hidden from assistive technology, and nothing moves when the script arrives. It is the arrangement ADR-0001 asks for, and the one `hero-stations.ts` set up for the hero.

The server also writes the reading direction onto the deck, and the script reads it back rather than working it out again, so the two can never disagree about which way the pile fans.

### One deck, read in the page's direction

The mechanics are the Reference site's, number for number: the 95px throw threshold; the 130% throw with its 40px drop and 18° turn; the 0.06 lift, 0.05 turn and 460px fade while dragging; the 400ms and 420ms glides; the 700ms and 520ms nudge; the 11px, 15px, 3% and 2.4° fan. They are named in `card-deck-stack.ts` rather than written inline.

Every direction is read off the page rather than assumed to be Arabic, and decided in one place, `DIRECTIONS`. Reading right to left, the next card leaves leftward, the pile fans to the left, the left arrow key and the left-pointing button go forward, and the nudge leans left. Reading left to right, all of it mirrors. The spec asks for one stylesheet serving both directions, and the Trust strip's marquee already works this way.

### The bleed, commented

The spec names four CSS exceptions that must survive refactoring. Ticket 04 commented three; the fourth, "the intentional off-canvas bleed of `.pcard`", is here now, at `#pain` in `src/styles/home.css`. The pile fans behind the top card and a thrown card flies well past the edge of a phone screen, on purpose, and `overflow-x: clip` cuts the overhang at the section's edge without making the section a scroll container. The comment says why `hidden` would be wrong — it forces `overflow-y` to `auto` with it — and names the test that fails if the rule goes.

### `.reveal` is hidden by script, and only when it will not blink

The Reference site sets `.reveal { opacity: 0 }` in CSS and leaves it to the script to undo. Without the script — JavaScript off, or still downloading — every revealed sentence is invisible; on this page that is the section's closing line, «المشكلة أن الإجراء تحتها يدوي، ومشتّت». The rebuild sends it visible.

It is then held back only if the visitor has not reached it yet. A line already on screen when the script runs — the page reloaded part-way down, opened from a link to `#pain`, or with its scroll position restored — is left exactly as it arrived; hiding it then, to fade it back in, would make a sentence vanish while it was being read. With reduced motion nothing is held back at all.

### Four unsourced figures, kept off every public deployment

The figures deck's first four cards state figures — 3.6×, 7×, 31% and 22% — and nothing in the project's documents says where they come from. The spec forbids exactly that, twice. The founder was asked and expressed no preference.

Every figure now carries a `source`, and those four are `null`. **A card with no source is left off every public deployment** — preview and production alike, indexable or not — through `isPubliclyDeployed()` in `src/lib/environment.ts`. Local builds and the test suite still draw all six, so the deck is tested and compared whole. Setting a source is what puts a figure on the site; nothing else does.

Checked by hand: a build made as a Vercel preview served none of the four figures or their claims, still served both commitment cards, and counted its figures deck "/ 2". The automated suite builds as a local build on purpose and does not exercise the guard; **ticket 47** records how to repeat the check, and ticket 39 waits on it — no longer as a safety net, but because a two-card deck is probably not the section the founders want to launch with.

The Reference site's placeholder testimonial — a play button that plays nothing, beside a line saying it is waiting for a recording, attributed to a project manager who does not exist yet — is left out entirely. Ticket 47 says when it comes back.

### Where the Reference site's CSS actually ends up

The Reference site builds the light card in four passes over the dark one, each overriding parts of the last. `home.css` carries where those passes end up rather than all four in sequence. Two findings along the way:

- **A gap that never applied.** Below 981px the Reference site narrows the gap between the heading and the figures deck to 34px — in a rule that an earlier `#proof .proof-2col { gap: 56px }` outranks. What visitors get, and what the baselines recorded, is 56px, so that is what is written, with the reason beside it.
- **Rules not carried over.** Those a later pass erases before they reach the page, and those for elements this deck's markup never has — `.pcard .cost b`, `.deck-lt .pcard .n`, `.deck-lt .pcard .lbl`.

Every one of those judgements is held to the Reference site by the comparison below, which would fail on the first one that was wrong.

### Tests

`tests/e2e/home-card-decks.spec.ts` runs every behavioural test against **both** decks, from one list — the executable form of "one deck implementation reused by both sections". For each: the first card on top with JavaScript off; the buttons forward, back, and round from the first card to the last; six throws bringing the first card back; the arrow keys; a short drag dropping the card back and a long one throwing it, in either direction; a finger swipe through the browser's real touch pipeline; the page never scrolling sideways while a card is held past the edge or in any frame of a throw, at 360, 820 and 1280px; the nudge happening once, not again on a second visit, not for a visitor who has already moved the deck, and not with reduced motion. And the section's closing line: visible with JavaScript off, rising into view when reached, not blinking when the page opens already scrolled to it, and simply there with reduced motion.

Which card is on top is read through the accessibility tree, since the five behind it are hidden from it — the answer a sighted visitor gets by looking.

`tests/e2e/home-decks-match-reference.spec.ts` is the comparison: position, size, colour and type of every part of both decks against the Reference page, at all sixteen viewports, with reduced motion on. Every card in each pile is measured, not only the top one — a card's box includes its transform, so this is what holds the fan to the Reference site. The figures section is measured as three regions, each from its own origin, because the missing placeholder makes its heading column shorter and moves the deck up once the columns stack.

**The figures deck forgives 0.05px, and the reason is measured.** The first run failed at ten viewports. Every failure was 0.01px — less than one of the browser's 1/64px layout units — always a `top` or a `height`, and only inside the figures deck. A box inside a turned card is measured after the turn, and the figures section sits at a different height on the two pages, because the rebuild's page is not yet whole, so the same turn rounds a hundredth of a pixel differently. The situations section sits at the same height on both pages, never drifted, and is still compared exactly. Numbers within tolerance are snapped to the Reference site's before an exact `toEqual`, so a real difference still fails with its full diff.

**Verified by falsification.** Changing the width of the figures deck's bars by one pixel failed exactly the six tall desktop viewports where that rule applies. Changing the deck's height by one pixel in the short-window rules failed exactly the six short viewports. Changing the fan's offset from 11px to 12px per card failed all sixteen. And removing the "already reached" check from `.reveal` failed exactly the no-blink test and nothing else.

### What the review changed

Two reviews, one against the repo's standards and one against this ticket. The ticket review found no fidelity defects — it checked every CSS value in every media query, every timing, threshold and transform, and the copy. What both found, and what was done:

- **The figures were guarded by a checkbox on ticket 39, and that was not enough.** Ticket 39a puts the site on public Vercel addresses first, and `noindex` does not stop anyone reading a page. The guard described above replaced the checkbox as the protection.
- **`.reveal` could blink.** The first version hid every revealed line on arrival, including one already on screen; its comment claimed that could not happen. It now leaves reached lines alone, with a test that opens the page at `#pain`.
- **The tolerance was too broad, and its comment was wrong.** It applied to every region, though drift had only been seen in the figures deck, and it justified itself by saying every rule was a whole or half pixel — which 11.5px, `.1em` and a 1.62 line height are not. It now applies to the figures deck alone, and says what was measured.
- **Overflow in flight was only checked at 360px.** Now at 360, 820 and 1280.
- **Direction was decided in five places.** Now one table, and the browser reads the server's answer instead of deriving its own.
- **The deck's numbers were loose in the behaviour code**, and the throw transform was written twice. They are named functions of `card-deck-stack.ts` now.
- **Smaller.** The hint was hard-coded inside the shared deck while every other label was passed in; it is content now. The sections had three names each — `Pain`, `FIELD_SITUATIONS`, "the situations deck" — and are `Situations` and `Figures`. A type called `Card` clashed with the deck's `cards`. The list of sixteen viewports had been written twice and is shared from `tests/e2e/reference-site.ts`, beside `freezeTransitions`, which had been written twice as well. Two comments were inaccurate and a test's header claimed it used no class names when it did.
- **One finding checked and not acted on.** `unicode-bidi: isolate` on the figures deck's phrase looked like an unmarked addition; it is not — the Reference site gives it to every `b` in the card. It is commented now, so the question does not come up again.
- **One smell left as it is.** The figures deck's rules below 981px and at short heights repeat nine declarations, because the Reference site does; collapsing them would mean inventing a breakpoint it does not have.

### Not covered

**The large quotation mark behind each situation** is a `::before` with no box a script can measure, so it is the one part of either deck the comparison cannot see. Its `left` became a logical property, which renders identically in Arabic.

**"No duplicates in development"** is protected by construction and was not separately checked by hand. Every listener is a named function removed on teardown, every timer and frame goes through a set that teardown cancels, the scroll trigger is killed, and the pile is put back exactly as the server drew it. Running the development server to check would also trip bug 46, which rewrites `AGENTS.md`.

**The deployment guard** has no automated test, because the suite builds as a local build on purpose. It was checked by hand, as above.
