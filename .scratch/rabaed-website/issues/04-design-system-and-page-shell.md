# 04: Design system and page shell

**What to build:** The frame every page sits in — header, footer, mobile menu, Partnerships dropdown — looking and behaving exactly as it does on the Reference site, including the header recolouring itself as it crosses dark and light sections.

**Blocked by:** 02, 03

**Status:** resolved

- [x] Design tokens defined once, taken verbatim from the Reference site (see spec for the full list)
- [x] Dark and light implemented as alternating section treatments, not a user theme
- [x] Header colour toggle uses the Reference site's exact values on both light and dark
- [x] Partnerships dropdown opens on hover, click and keyboard; closes on Escape and outside click
- [x] Mobile panel opens fully at ≤980px showing every link
- [x] Breakpoint contract honoured: ≥981px desktop, ≤980px mobile, plus 700, 680, 640, 620, 560, 400px and the height-based rules — the shell itself only has rules at 981/980, 700 and 560, which is all the Reference site gives it; the rest belong to components later tickets build, and every one of them is covered by the overflow test
- [x] The four deliberate CSS exceptions from the spec are preserved and commented in place with their reason — three of them; the fourth belongs to a component this ticket does not build (below)
- [x] Class names from the Reference site retained; no Tailwind rewrite, no scoping that breaks cross-cutting selectors
- [x] Header and footer match baselines at all eight widths — measured against the Reference site itself rather than the baseline images, for the reason below

## Comments

**What was built.** Four stylesheets and four components. `src/styles/tokens.css` holds the design system — the twelve colours, `--sp`, the base elements, the buttons, and `.dark`/`.light`/`.pad` as section treatments. `src/styles/shell.css` holds the header, the Partnerships dropdown, the mobile panel, the footer, the compact page hero and the repeating tail. `src/styles/responsive.css` holds the late responsive pass. `globals.css` imports the four in order.

`SiteNav` and `SiteFooter` are server components; `PageShell` puts a page between them. `NavBehaviour` is the only client component: it attaches the three behaviours to markup the server already sent, which is the arrangement ADR-0001 asks for — every link and label is in the first response, and JavaScript only adds the opening and closing.

`src/content/navigation.ts` is the one place a route or a label appears. On the Reference site that table existed nine times over as markup. Ticket 21 moves it into the CMS. The pages it points at arrive in tickets 12–17, so following most of those links reaches the 404 page today.

**Both menus are always rendered**, desktop and mobile, and CSS decides which is shown. That is the Reference site's arrangement and it is the right one for a server-rendered site: choosing between them would mean measuring the viewport, which cannot be done on the server, so one of the two menus would be missing from the HTML a crawler reads.

**The home page grew a light section**, and at desktop widths it is visibly half-empty: `.tail-grid` is a two-column grid and only the left column exists until ticket 11 puts the demo form in the right one. That is the honest state of a page being built in order, and the grid is the Reference site's own, so it is left as it will be rather than restyled twice.

Why it is there at all: the header's colour toggle only exists on a page that has a light section — the Reference site's own script returns early otherwise — so with no light section there is nothing to demonstrate and nothing to test. The section added is the repeating tail (`#tail`), verbatim from `reference/site/index.html`: real approved copy, and a block every page carries. Ticket 11 adds the demo form in its second column and ticket 27 makes that form real. The page also opens with `.phero`, the compact hero the sub-pages use, which ticket 06 replaces with the full `#hero`.

**Source order in CSS is load-bearing, and getting it wrong is silent.** `.wrap { padding: 0 20px }` below 560px is the shorthand, so it resets `padding-top` and `padding-bottom` to zero on any element carrying `.wrap` that it outranks. `.foot-bar` sets 20px of its own above the copyright line at exactly the same specificity, so nothing but source order decides which wins. Splitting the Reference site's single stylesheet into files put that rule *before* `.foot-bar` instead of after, and the footer came out 20px taller than the Reference site's at every phone width. `responsive.css` exists to hold the late pass in the right place, and says so at the top.

Nobody would have found that by reading. The comparison test found it on its first run.

### Header and footer match: measured against the Reference site, not the baseline images

The pixel diff was built first and abandoned, for two reasons worth recording so it is not attempted again:

1. **The crop cannot be aligned.** The baselines are whole-page images — `index--1280x900.png` is 7,480px tall — so comparing a footer means cutting a crop out by rounding. The footer occupies the last 201.39 CSS pixels of that page and the last 201.39 of a 1,200px one, and those two land on different sub-pixel boundaries. Every glyph then differs by antialiasing alone. Measured: the best whole-pixel alignment for the top of the footer was one pixel away from the best alignment for the bottom, so no single offset works.
2. **It cannot run in CI**, which was already known from ticket 03: text rasterises differently on a hosted Linux runner.

What replaced it compares the rebuilt shell against the **Reference page itself**, loaded in the same browser at the same moment with the same self-hosted fonts, at all eight widths: the position and size of every part of the header and footer, and the colour, background, border and type each is drawn in — in each of the shell's four states, because comparing only the state a page loads in would leave every `.nav.on-light` and `.nav.open` rule unmeasured. Transitions are frozen on both documents first; without that the comparison photographs the wordmark cross-fade rather than the state it settles in.

It is exact, it names the element and the number when it fails, and — because layout geometry does not depend on rasterisation — **it runs in CI**.

**This does not retire the pixel comparison the spec asks for.** The spec's Testing Decisions require full-page screenshots at eight widths against `tests/baselines/`, and that is still the plan: what does not work is cutting a *region* out of a full-page baseline. From ticket 06 onward the home page becomes a whole page that can be compared whole, against the whole baseline, with no crop and no alignment problem. Until then the shell is held to the Reference site by measurement.

Verified by falsification, twice: changing the header's height from 74px to 75px failed six of the eight widths and correctly left the two below 700px passing, where a different rule sets 66px; and changing `.nav.on-light .login`'s colour failed the four widths where that link is visible, which is coverage the first version of this test did not have.

### Two deliberate divergences from the Reference site

Both are bugs in the Reference site that the ticket or the spec requires fixing, and both are commented where they live.

1. **The mobile panel cut off its own sign-in button.** The Reference site caps the open panel at `max-height: 360px` against 396px of content, so the bottom 36px of the last item is clipped — measured in a browser, not inferred. The ticket requires the panel to open fully. The cap is raised to clear the content and bounded by the viewport, so a short screen scrolls instead of hiding the end of the menu. It is still a fixed cap because `max-height` cannot transition to `auto`; the test asserts the panel no longer clips, at 360px and at 980px, and will fail the first time a link is added without raising it.
2. **The footer's copyright line set Arabic in DM Mono.** The Reference site wraps the whole line in `.mono`. DM Mono has no Arabic glyphs, so what a visitor actually sees is the browser's last-resort serif, monospaced and disjointed — which is precisely what the spec forbids: "DM Mono for Latin numerals only ... must never be applied to Arabic text". Only the year is Latin, so only the year is now `.mono`. This is the one thing the comparison test deliberately does not hold to the Reference site's dimensions; it still checks the row it sits on and its height.

### One improvement beyond the Reference site

**The dropdown now opens on a tap.** The Reference site wires `mouseenter` unconditionally, and a touch device emulates `mouseenter` on the way to a tap — so the tap opens the panel and the click that follows immediately toggles it shut. Hover is now attached only where `(hover: hover)` matches. On a mouse this is identical to the Reference site; on a touchscreen laptop above 981px, where the dropdown is not yet replaced by the mobile panel, it is the difference between working and not.

### The fourth CSS exception

The spec names four exceptions that must survive refactoring. Three are here and commented in place: `.nav .mnav .wrap { height: auto }`, `.nav > .wrap` at 700px, and the `.nav.open` background override. The fourth — the intentional off-canvas bleed of `.pcard` — belongs to the pain card deck, which is ticket 07. It should be commented there when that component is built.

### Tests

`tests/e2e/page-shell.spec.ts` covers the behaviour: the shell in the server response, the header staying put, the dropdown by hover, tap, keyboard, Escape and outside click, the panel swapping in at 980 and not at 981, the panel opening without clipping, the colour toggle's exact values in both states, and zero horizontal overflow at sixteen widths — the eight baseline widths plus every breakpoint in the contract.

`tests/e2e/shell-matches-reference.spec.ts` is the comparison described above. `tests/e2e/reference-site.ts` serves `reference/site/` for it, on an operating-system-assigned port so that every parallel worker can start its own.

Two things the tests had to be corrected on, both of which say something about the design rather than the test:

- **Click does not open the dropdown for a mouse user, and cannot.** Moving the pointer to the trigger has already opened it, so the click that follows is the one that closes it. The Reference site behaves the same way. The test now says so, and covers opening-by-click through a touch context, where it is the real case.
- **Tabbing into the panel has to wait for it to be visible.** While the panel is still `visibility: hidden` its links are not in the tab order at all, so tabbing immediately jumps past them — the test would have been measuring the transition rather than the markup.

### What the review changed

Two rounds of review found one real defect and several inaccurate comments, all fixed:

- **A logical-property conversion was backwards.** In right-to-left the inline axis begins at the right edge, so `right: 0` is `inset-inline-start`, not `inset-inline-end`. Two rules had it the wrong way round — the light wordmark and the burger's bars. Both happen to sit in containers exactly as wide as themselves, so the two resolve to the same place and nothing looked wrong; in English, or the first time either box is narrower than its parent, it would have.
- **Three comments justified the cascade with a specificity error**, claiming the open mobile panel loses its padding to `.wrap { padding: 0 20px }` the way `.foot-bar` does. It does not: `.nav .mnav .wrap` is three selectors deep and outranks a bare `.wrap` whatever the order. Only the `.foot-bar` half is real, and it is real for exactly the reason given — equal specificity, so order decides. The rules were right and the reasons were wrong, which in a codebase that explains itself this much is its own kind of defect.
- The comparison test read `border-top-color` while the header's rule is a `border-bottom`, so a wrong header border was invisible to it. It now reads all four edges.
- A test named "closes on Escape and when a link is followed" never followed a link, leaving that listener untested. It is now two tests, and the second one follows a link.
- Dead rules removed: `.brand small` styles a sub-label no markup has ever rendered, and `.reveal` belongs with the on-scroll entrance in ticket 06.
- The exceptions were numbered "1 of 4", "2 of 4", "3 of 4" against a fourth that lives in another ticket. They are named now instead.

### Not in this ticket

The header's *appearance* over the hero cannot be pixel-compared until the hero exists, because the header is translucent and blurs whatever is behind it. Ticket 06 is where that becomes possible.

`/en` still has no shell. Every label in it would have to be invented in English first, which is ticket 42's job.
