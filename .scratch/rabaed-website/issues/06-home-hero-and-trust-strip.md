# 06: Home — hero and Trust strip

**What to build:** A visitor lands on the homepage and sees the animated hero — a document travelling between Owner, Consultant and Contractor — followed by the moving bar of client logos.

**Blocked by:** 04

**Status:** resolved

- [x] Hero matches baselines at all eight widths, including `100vh` with a 760px minimum at ≥981px and auto-height below — measured against the Reference site itself rather than the baseline images, for the reason ticket 04 records, and at the eight short viewports as well as the eight widths
- [x] The hero loop animation is preserved: travelling document, pulse ring, changing status text
- [x] Trust strip moves continuously, pauses on hover, and falls back to the company name as text if a logo image is missing
- [x] With reduced motion enabled, the loop is skipped and all content stays legible
- [x] GSAP is a proper dependency, scoped and cleaned up on unmount; no duplicates in development
- [x] Zero horizontal overflow measured against `clientWidth`
- [x] Zero console errors and zero failed requests

## Comments

**What was built.** The home page opens with the real `#hero` — the three-line promise, the two calls to action, the 60-day guarantee, and beside them the diagram of the three parties with a document travelling between them — and the Trust strip below it. The compact `.phero` that stood in for the hero since ticket 04 is gone.

`src/components/home/hero.tsx` and `src/components/home/trust-strip.tsx` are server components: every word, both wordmarks of the diagram and every client's mark are in the first response. `HeroLoop` and `TrustStripMarquee` are the only client components, and each attaches behaviour to markup that is already complete — the arrangement ADR-0001 asks for, and the same one `NavBehaviour` uses.

`src/components/home/hero-stations.ts` holds the diagram as data: where each party stands, and the journey a document makes between them. The Reference site carried those coordinates twice — once as inline styles on the markup, once as a lookup table in its script — so the drawing and the animation could disagree. Here they read the same numbers.

`src/content/trust-strip.ts` holds the eight companies. Ticket 20 moves them into the CMS; the shape of the module is already the shape the CMS will hand back.

CSS is `src/styles/home.css`, imported between `shell.css` and `responsive.css` — whose position stays last for the reason written at the top of it. `.ctas` and `.guar` went to `tokens.css` instead, beside `.btn`: each appears on six of the Reference site's nine pages, so they are pieces a page is built from rather than anything the home page owns.

### The Trust strip travels, where the Reference site's does not

This is the one part of the ticket that departs from the Reference site by design, and the spec asks for it outright: "As a visitor, I want the Trust strip to move continuously and pause when I hover" (user story 9). The Reference site lets eight logos wrap onto as many lines as they need.

The reason is the list's future rather than its present. From ticket 20 the logos are CMS content that Ahmed adds as clients sign, and a bar that grows a row taller with each one is a bar that eventually pushes the page around. A rail of fixed height does not.

**It loops by moving half its own width.** The row is rendered twice and the track travels 50% — so the second copy lands exactly where the first began, and the seam is somewhere nobody can see it. GSAP writes `xPercent` into the transform as a literal `%`, which means that stays true whatever the marks measure: a logo fails to load, the row narrows, and the loop is still seamless with nothing re-measured. Only the speed drifts, by less than the width of one logo, which is why there is no `ResizeObserver` here.

The second copy is `aria-hidden`, and its images carry an empty `alt`. A screen reader that read the client list out twice would be describing a marquee's implementation.

**Direction is not decoration.** In right-to-left the second copy lays out to the *left* of the first, so the track has to travel right; left-to-right is the mirror. The sign is read off the document's computed direction. Getting it wrong does not look like a bug — it looks like a strip that scrolls into empty space once and stops.

**Reduced motion is handled in the stylesheet, not the component.** A strip that is not going to move has to show all eight marks rather than the four that fit behind a fade, so under the preference it stops being a rail: the list wraps, and the second copy goes away. That is a layout decision, and CSS is where layout decisions belong. The component reads the same preference only to know not to start.

### Two defects found in the hero loop, both real, both fixed

**1. The document opened at the wrong building, for 0.85 seconds, on every visit.**

A GSAP `fromTo` applies its "from" the moment it is *created*, not when it starts. The loop builds three of them in a row — Contractor→Consultant, Consultant→Owner, Owner→Contractor — so as the timeline was assembled each one set its own starting position and the last one won. The document sat on the Owner's tower until the opening hold expired and the first hop moved it.

This was in production, not only in development, and the first version of the test suite missed it: polling for "the document reached the Consultant" cannot see a document that was somewhere wrong *before* the first hop, because by the time the poll looks it has already left.

`immediateRender: false` on each hop fixes it — the same flag the Reference site already carries on its pulse tween, for the same reason. The Reference site avoided the problem in its own way, by animating a proxy object and writing `style.left` by hand from an `onUpdate`.

The test that now catches it samples `#h-doc` every frame for five seconds, keeps only the frames where the document is standing on a tower rather than between two, and asserts the first three are Contractor, Consultant, Owner. Verified by falsification: remove the flag and that test alone fails.

**2. `revert()` is not the same as putting things back.**

GSAP unwinds each tween to the value it recorded, which is close to but not the same as the inline styles the server wrote. In development, where React runs every effect twice, the second run would start from whatever the first left behind. The teardown now reads `style.cssText` off the document, the pulse and the status pill before anything touches them, and restores exactly that after `context.revert()`.

### The centring moved from the script into the stylesheet

The Reference site centres the document and the pulse ring on their stations from JavaScript, with `gsap.set({ xPercent: -50, yPercent: -50 })`. Until that runs the document hangs below and to the right of the Contractor's tower, and with JavaScript off it stays there.

The rebuild states it in CSS, so it is right in the first response. It has to be the standalone `translate` property rather than a `transform`, and that is the whole reason it works: GSAP animates `transform`, so a `transform` here would be overwritten the moment the ring is scaled. The two compose, and the percentage stays live — the ring is sized in `%`, so a translate cached in pixels would drift on every resize.

### The diagram's coordinates stay physical, deliberately

Ticket 04 converted every `left`/`right` in the shell to a logical property, because one stylesheet serves both directions. Inside the art box they stay physical, and that is marked in place. These are coordinates in a picture, not the start and end of a line of text: the Owner's tower stands above and between the other two in Arabic and in English alike, and mirroring it in one direction would move the buildings out from under the dashed routes drawn between them.

### A third instance of the DM Mono problem, fixed; a fourth, logged

The Reference site sets the whole of "60 يوماً" in DM Mono, which has no Arabic glyphs — so the word beside the numeral falls through to the browser's last-resort monospace. The spec forbids it outright, and ticket 04 fixed the same defect in the footer's copyright line. Only the numeral is Latin, so only the numeral is `.mono`. Different typeface, different width, so the guarantee pill is the one part of the hero the comparison test holds only to the row it occupies and the height it takes — exactly as ticket 04 handles the copyright.

The fourth instance is `.eyebrow`, which sets DM Mono for labels that are entirely Arabic, on every section of every page. It is not fixed here: the rule is site-wide, the fix changes the site's typographic voice, and in English DM Mono is the right face. Logged as **ticket 45** for the founder to decide.

### Tests

`tests/e2e/home-hero.spec.ts` covers behaviour: the hero's height contract at three viewports, the opening screen in the server response, the document's resting position with JavaScript off, the journey in order, the status text at each arrival and round again, the pulse ring appearing, the strip's names in the server response, the client list read out once rather than twice, the strip moving and stopping under the pointer, the text fallback for a mark that fails to load, and the whole of it with reduced motion on.

`tests/e2e/home-matches-reference.spec.ts` is the comparison: the hero's every part — position, size, colour, border and type — against the Reference page itself, loaded in the same browser with the same self-hosted fonts, at all sixteen viewports the baselines were captured at.

The short ones are not a formality. The hero's `(min-width: 981px) and (max-height: 700px)` block is six rules that shrink the headline, the lead, the diagram and the gap between them, and at 900px tall not one of them is exercised — a wrong number in any of them would have passed all eight widths.

**Both pages are loaded with reduced motion on**, which is what makes that comparison a measurement rather than a race. The hero's whole point is a document that does not stay still, and photographing two independent animations "at the same moment" compares wall-clock luck. With the preference set, both sites park the document at the Contractor and leave it there — the Reference site's own script does that, and so does the rebuild — so every position in the diagram is a fact about the stylesheet. What moves is asserted in the other file, where it belongs.

The Trust strip is deliberately not in that comparison. It is the part that departs from the Reference site by design.

Verified by falsification, three times: moving `#hero`'s top padding by one pixel failed the four widths at 981px and above and correctly left the four below passing, where a different rule sets 98px; moving the Consultant's station by one percent failed every viewport; and changing the gap between the diagram and its status pill by one pixel — a rule that only exists below 700px of height — failed exactly the six short viewports and nothing else.

**One defect the tests found on their own.** The text fallback never appeared, because `.logos .slot img { display: block }` outranks the `display: none` a browser gives a `hidden` element. The mark now has its own `img[hidden]` rule, and the name deliberately has no `display` of its own to fight.

### What is not covered by an automated test

**"No duplicates in development."** React's double-invocation only happens in development, and this suite runs against the built application by deliberate policy — so there is no seam at which to assert it. Worse, two copies of this particular loop would be nearly invisible: they would start together and write the same values every frame, so nothing would jitter.

It was checked by hand instead, by driving the development server with Playwright and sampling `#h-doc` every frame: the position advances monotonically through each hop, with no reversals, which is one timeline's work. That check is what found both defects above. The protection itself is by construction — `gsap.context` for everything created, `revert()` plus an explicit restore on teardown — and the second defect above is exactly what happens when that is not right.

The same method will serve tickets 07-11, which add six more animated sections.

## What the review changed

Two rounds, one on standards and one against the ticket. Nine findings, all acted on; the two that mattered most were both about coverage rather than code.

- **The comparison never saw a short window.** Eight widths, all at 900px tall, left the hero's entire `max-height: 700px` block unmeasured. It now runs at all sixteen viewports the baselines use, and the falsification above is what proves the new eight are doing work.
- **The Trust strip's widest failure case was untested.** The strip is the one thing here that grows when it breaks: a mark that fails to load is replaced by a company name, and the longest of those is thirty characters. Two tests now pin it — every mark missing at 360px, and the same thing again with reduced motion on, where the rail stops clipping and is therefore the case that could actually push the page sideways. Measured: the longest name draws at 175px inside a 320px rail, so the margin is real rather than lucky.
- **A test was reading an inline style.** "Visits the three parties" compared `doc.style.left` against strings, which is the component's own bookkeeping rather than anything a visitor can see. It now measures the document's centre against the art box, to within a tenth of a percent — and still fails when the `immediateRender` flag is removed, which is the only thing that made it worth writing.
- **`min-width: 0` on the rail was justified by a comment that was wrong.** The claim was that without it the strip would set the width of the page. It would not: `overflow: hidden` already lets a flex item shrink below its content, so the declaration is redundant *today*. It earns its place as insurance for the reduced-motion branch, which sets `overflow: visible` — and the comment now says that instead.
- **The two additions the marquee needed were unexplained.** The fade at the rail's ends and the phone layout that gives the rail its own line are both departures from the Reference site with no counterpart there, and both are consequences of the strip moving. Each is now marked and argued where it lives, the way ticket 04 marks its divergences.
- Smaller: the same image's intrinsic size was born twice in one change in two different shapes, a tuple and an object — now one; `TRUST_STRIP_LABEL` and `TRUST_STRIP_TITLE` said nothing about which was visible and which was announced — now `TRUST_STRIP_CAPTION` and `TRUST_STRIP_SECTION_NAME`; and the reduced-motion media query, written out in two components and three stylesheet blocks, now has one home in `src/lib/motion.ts` so the JavaScript and the CSS cannot drift apart.
- **One finding argued with and kept.** The review put `.ctas` and `.guar` in `shell.css` beside `.phero`, on the grounds that `tokens.css` is the design system and these are hero furniture. They are not: each appears on six of the Reference site's nine pages, inside the home page's `#hero` and every sub-page's `.phero` alike, so they are pieces a page is built from rather than part of the frame a page sits in. They stay with `.btn`, and the comment now says why rather than leaving the next reader to ask.

### Two things logged rather than fixed

- **Ticket 45** — `.eyebrow` sets Arabic text in DM Mono, site-wide. Needs a decision, not a patch.
- **Ticket 46** — `npm run dev` appends generated Next.js guidance to this repo's own `AGENTS.md` and rewrites `next-env.d.ts`, so the development server leaves the working tree dirty. Also worth writing down: `next dev` refuses `127.0.0.1` as an origin, so a page opened there never hydrates and every client behaviour silently does nothing.

### Not in this ticket

The hero's two calls to action point at `#demo` and `#journey`, and neither section exists yet — the demo form is ticket 27 inside ticket 11's closing block, and the journey is ticket 08. Until then they behave as the Reference site's own anchors do on its sub-pages.

The home page still cannot be compared *whole* against its baseline, because tickets 07-11 have not put the middle of it there yet. When they have, the whole-page pixel comparison the spec asks for becomes possible.

Bug 44 — the closing section's empty second column — is untouched and still open.
