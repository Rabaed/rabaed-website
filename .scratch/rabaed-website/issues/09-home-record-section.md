# 09: Home — the Record section

**What to build:** The scroll-driven section explaining the Record: the background transitions from dark to light as the visitor scrolls, while the card cycles through five transaction types.

**Blocked by:** 04

**Status:** resolved

- [x] Scrubbed background and border transition matches the Reference site
- [x] The five transaction types cycle in step with scroll progress — on a desktop window exactly as on the Reference site; below 981px, where the Reference site's cycle cannot run, while the card crosses the window (see below)
- [x] The header's colour toggle stays correct across this section's boundary
- [x] Content is complete and readable with reduced motion enabled
- [x] Animation is cleaned up on navigation and refreshed after layout changes
- [x] Matches baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports

## Comments

**What was built.** «لا نسأل "من اعتمد؟" نفتح المعاملة.» — the copy on one side, and on the other a card showing the record one kind of transaction leaves: who sent it, its receipt, who checked it, how it was decided. As the visitor scrolls through, the section turns from dark to light, the card works through the five kinds — letter, material approval, work inspection request, schedule update, payment certificate — and ends stamped «✓ سجل كامل». It sits after the four units, where the Reference site has it.

`src/components/home/record.tsx` is a server component; `record-behaviour.tsx` is the client component that moves it. Which kind shows and whether the stamp is on, for how far the visitor has scrolled, is decided once in `record-state.ts`, which both read, so the section a script-less visitor sees and the start of the cycle cannot disagree. The copy is in `src/content/record-types.ts`.

### Every record is in the page

The Reference site has one record in its markup and rewrites its words from a script. Here all five are in the first response, the first showing and the rest `hidden`, so nothing a crawler or a visitor without JavaScript reads depends on scrolling — as with the four units' screens. The Reference site's markup and its script disagree about the first record's last step; the script's wins, because it rewrites the markup before the section is in view, so it is what visitors read.

### Three deliberate differences

- **Below 981px the section is padded, and never shorter than its content.** The Reference site holds its content in a box exactly one window tall. On a desktop window everything fits, and there the two are the same box. On a phone it does not: the copy hangs over the four-units section above and about 100px of the card is covered by the section below. Here the box grows to hold its content, and below 981px carries the page's usual section padding, since at 768px the Reference site leaves the content 30px from its edges.
- **Below 981px the kinds follow the card.** The Reference site's cycle runs from the section's top meeting the window's top to its bottom meeting the window's bottom. Below 981px the section is only as tall as the window, so that distance is nothing, and the card jumps from the first kind straight to the stamped last — measured on the Reference site at 390px and 768px. Here the cycle runs while the card's centre crosses the middle 70% of the window, so every kind is seen. On a desktop window the Reference site's trigger is used unchanged.
- **With reduced motion nothing blends or fades.** A record changes at once, and the section and its card change colour together in one step, 12.5% of the way in — half-way through the blend. The blend passes through a grey against which neither the dark words nor the light ones can be read, which the ticket's "readable with reduced motion" rules out; a step never does. The kinds still follow the scroll, because scrolling is the only way to reach them. The Reference site ignores the preference here.

None of these overrules `reference/HANDOFF.md`, which only names the section, so there is no ADR.

### The header

The section ends light but is not a `.light` section, so the header stays dark over it, as on the Reference site, and turns light where the next light section starts. Nothing here pins or adds scrolling, so the header's trigger needs no re-measuring on its account.

### Tests

`tests/e2e/home-record.spec.ts`: the whole section, all five records, in the first response; the first record, dark and unstamped, with JavaScript off; on 1440×900 and 1280×550 each kind at a point inside its share of the scroll and the stamp only at the end, and back again; on 390px and 768px every kind in turn, in order both ways, each change while the card is in view; the section and card blending dark to light and back; the header dark at the top, middle and end of the section and light at the next light section; nothing spilling out of the section at five sizes; the cycle still right after resizing from 1600×900 to 1024×700 to 390×900; still right after leaving for the product page and coming back, with no errors; and with reduced motion, a chosen record there at once, and the words readable against the section and the card — contrast of at least 4.5 — at every one of forty points through the scroll, on a desktop and a phone.

`tests/e2e/home-record-match-reference.spec.ts` compares the section, the copy, the chips, the card, every part of the record showing and the stamp against the Reference page at all sixteen baseline viewports, at rest. Below 981px, the section's own height and where its content sits in it are left out; everything inside the content is still compared. With motion on, it compares the section's and card's colours at nine points through their change at four sizes, and which kind is marked and whether the stamp is on at thirteen points through the cycle on two desktop windows.

`openBothPages` takes a `motion` option for the scroll comparisons, which need motion on; every other caller keeps reduced motion.

**Verified by falsification.** Holding the box to `height: 100vh` again failed the spill test at 360px. Starting the card's blend at 16% instead of 12% failed exactly the four colour comparisons. The first build left `gsap.matchMedia` with conditions that neither held on a phone with motion on — it builds only when one does — and exactly the phone and tablet tests failed; the `narrow` condition fixed them.

### Not covered

**"No duplicates in development"** is protected by construction — `gsap.matchMedia` reverted and every tween killed on teardown, and the first record put back — and was not separately checked by hand, for the reason ticket 07 gives.

**The light card keeps the dark treatment's greys** for its rules, times and second lines, so the rules all but vanish on white and the small grey text is faint. That is the Reference site, carried over; it is the kind of thing ticket 36's accessibility pass decides.
