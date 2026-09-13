# 12: Product page

**What to build:** The full product page, including the pinned horizontal journey — the section where the page holds still and four panels move sideways as the visitor scrolls — plus the role tabs for Owner, Consultant and Contractor, and the internal approval loops section.

**Blocked by:** 04, 05

**Status:** resolved

- [x] Pinned horizontal journey works at ≥981px **and** at short viewport heights, gated exactly as the Reference site gates it (`min-width: 981px and min-height: 551px`)
- [x] Movement direction is correct for right-to-left; dot indicators track progress
- [x] Below the gate, the journey degrades to the vertical layout as on the Reference site
- [x] Pinning survives navigating away and back; positions are refreshed after layout changes; no duplicate animations in development
- [x] Role tabs switch their Screen mocks; mocks are exported images with descriptions and captions
- [x] Matches baselines at all eight widths, including short-height captures — measured against the Reference site itself, at all sixteen baseline viewports, with the caption's effect on the screen left out on short windows (see below)
- [x] Zero console errors, zero failed requests, zero horizontal overflow

**Note:** the spec flags this as the most fragile part of the site. Expect it to need the most care and the most test attention.

## Comments

**What was built.** `/product`, in the Reference site's order: the page hero, the Trust strip, the journey «أربع وحدات. سجل واحد يجمعها.», the custom strip «ومشروعك يحتاج أكثر؟», the roles «ماذا يرى كل طرف حين يفتح المنصة؟», the review cycle «ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟», and the closing section with the demo request form. Every word is verbatim from `reference/site/product.html` and in the first response.

The sections are server components in `src/components/product/`, their copy in `src/content/{journey,roles,inner-cycle}.ts`, their styles in `src/styles/product.css`. The two that move have a client component each beside them — `journey-behaviour.tsx`, `roles-behaviour.tsx` — attached to markup the server already drew.

### The journey

Five panels, the four units and the Record, pinned by GSAP's `matchMedia` on exactly `(min-width: 981px) and (min-height: 551px)`, with the Reference site's own numbers: 0.6px of scrolling per pixel of travel, a 0.8-second catch-up, five marks lit to `round(progress × 4)`. Below the gate the stylesheet stacks the panels, including the Reference site's quirk at 550px tall and below, where a stacked panel keeps its short-window height and two columns because the fallback rule is outranked — that is what the baselines recorded, and it is commented in place.

Each way the spec warns this breaks is guarded in `journey-behaviour.tsx`:

- **Direction.** Right to left, the panels after the first lie to its left, so the track travels right. Read from the direction the server wrote, not assumed.
- **The room under the heading** (`--jh`) is measured before every refresh — a resize, the webfont arriving, a tab chosen — not once.
- **Everything below the pin.** The header's colour toggle is created first and measured the page without the thousands of pixels the pin adds, so the header turned light half-way across the dark panels. The pin now measures first (`refreshPriority`) and the rest are re-measured after it.
- **Crossing the gate** builds and tears down the pin, spacer and all.
- **Development's double run** cannot leave two pins: teardown reverts everything.
- **Leaving the page.** The section sits inside a plain wrapper, because GSAP moves it into a spacer element and React removes elements before running their teardown; without the wrapper a client-side navigation away would throw. The site's links are full page loads today, so this could not happen yet — it is there so that it never can.

**Reduced motion does not stop the pin**, as on the Reference site: the track moves only while the visitor scrolls it. If that is to change, it is ticket 36's decision.

### Captions under the screens, and what that costs on a short window

ADR-0002 requires every Screen mock to carry a visible caption stating the same claim in words; the Reference site has none. Each screen — five in the journey, three in the roles — is ticket 05's exported image with its description as `alt` and the same sentence as a caption under it, styled as the home page's `.jt-hint`.

In a pinned panel there is no spare height for it: on a short window the Reference site sizes the screen to fill the panel exactly. So the screen's column fits the two together — the caption takes the height it needs and the screen the rest, up to its full size. Wherever the panel is tall enough, which is every 900px-tall viewport, the screen is the Reference site's size; on short windows it is smaller by the caption. A test holds the screen and caption inside the panel, and holds the screen as large as that room allows.

**One description per mock, now in one place.** Ticket 08 suggested it: `src/content/screen-mock-descriptions.ts` holds the product page's eight descriptions, and the home page's four units read their five from it too. The words on the home page did not change.

The pictures load eagerly at low priority: a journey panel travels in from off the side of a clipped track and a role is hidden until chosen, so a lazily loaded picture would arrive blank and fill in while the visitor watched.

### Deliberate differences from the Reference site

- **With JavaScript off, a wide window stacks the journey.** The Reference site leaves panels two to five out of reach off the side with no script to bring them in. The rule is in a `<noscript>`, so no visitor whose script runs ever gets it.
- **Arabic labels in the Arabic face**: «المخرَج», «حسب المشروع», «دورة داخلية · محجوبة», «ما يعبر رسمياً», and the two headings of the note under the review cycle. The Reference site sets them in DM Mono, which has no Arabic glyphs — the same local fix tickets 04, 06 and 08 made. Their letter-spacing is the Reference site's, and noted on bug 45, whose decision about `.eyebrow` should cover them too.
- **The role tabs are tabs**: a tab list, each tab saying whether it is selected, and the arrow keys moving between them in the reading direction. The Reference site's are plain buttons that respond to a click only. All three stay in the tab order, as the home page's four units do; whether tab lists become a single tab stop is ticket 36's.
- **The hero's «ابدأ من الوحدات ↓»** lands 78px short of the journey, with `scroll-margin-top` instead of the Reference site's script — the same thing ticket 11 did for `#demo`.
- **The Trust strip travels**, as ticket 06 decided; the product page uses the home page's component.

### The closing section

Ticket 11 landed while this was in progress, with `ClosingSection` built for both pages. The product page ends on it, so its three «احجز عرضاً حياً» / «اسأل عنها في العرض التوضيحي» links reach the form. Its comparison region moved into `tests/e2e/closing-section.ts`, which both pages' comparisons now measure it with.

### Tests

- **`tests/e2e/product-journey.spec.ts`** — through what a visitor sees: where the section sits in the window, which panel is in view, how many marks are lit, the header's colour.
  - The full journey (held at the start with the second panel to the left, three marks half-way, the Record in view with five marks at the end, and scrolling on after) at 1440×900, 1600×900, 981×900, 1440×700, 1280×600 and 1280×551 — both edges of the gate.
  - Stacked, and scrolling past like any section, at 1280×550, 980×900 and 390×900.
  - The heading, panel, screen and caption all fitting on short windows, with the screen as large as fits.
  - The header dark all the way through the pin and light after it.
  - Crossing the gate and back; resizing while pinned; leaving the page and coming back with no page errors.
  - JavaScript off; every screen the exported picture with its caption; captions centred under their screens; a phone panning a 1040px screen; no sideways scrolling at sixteen widths.
- **`tests/e2e/product-roles.spec.ts`** — every party in the first response; the Owner chosen with JavaScript off; choosing by click and by arrow keys; every screen the exported picture with its caption under it; panning on a phone.
- **`tests/e2e/product-matches-reference.spec.ts`** — every section against the Reference page at all sixteen baseline viewports: the hero, the journey's heading, marks, track and every part of every panel, the pin's length on the page and how far the track has travelled at its end, the custom strip, each of the three roles chosen in turn, the review cycle, and the closing section. The Trust strip is left out (ticket 06), and so is what is inside a screen (`screen-mocks.spec.ts`).
- `/product` is in `tests/e2e/routes.ts`, so the server-rendering, health, fonts, indexing and localisation suites cover it. The localisation test compared every route's alternates against every other route, which only worked while the site had one page per locale; each route now names its own.

**Verified by falsification**, one deliberate break at a time:

- Removing the pin's `refreshPriority` failed exactly the header test.
- Moving the gate to 600px tall failed exactly the 1280×551 journey and the short-window fit.
- Removing the `<noscript>` failed exactly the JavaScript-off test.
- Reversing the direction failed exactly the nine tests that travel the journey.
- Stopping the screen giving way to its caption failed exactly the short-window fit.

An earlier version of that last break changed nothing, because a second rule still let the screen shrink — which is why both rules carry the weight.

**No duplicate animations in development**, checked by hand: on `next dev`, which runs every effect twice, `/product` had one pin spacer, a pin of the length the travel predicts, a track that travelled exactly its width, five marks lit at the end, and no errors — before and after choosing a role.

**Found along the way.** A picture loaded from a resized copy made each screen a quarter of a pixel taller than the Reference site's, differently at each size, because a browser switches to the proportions of the file it receives and a 750px copy cannot be exactly 1.6 times as wide as tall. The screen's proportions are now stated in CSS. And the resize test first passed for the wrong reason: its "wait until settled" compared two readings a moment apart, before the page re-measured.

### What the review changed

Two reviews, standards and spec.

- **The product page had no demo form**, so its links to `#demo` went nowhere. Ticket 11 had just landed; the page uses its closing section.
- **Leaving the page after pinning could throw** on a client-side navigation — the wrapper above.
- **The short-window screen size was compared against nothing.** The fit test now holds the screen as large as the room allows.
- **The tab behaviour was written twice**, here and in the home page's four units. It is `src/lib/tab-strip.ts`, used by both.
- **Each four-units tab carried its mock and its description**, when one names the other. It carries the mock.
- **Names.** `Organisation` for a party's review cycle is `ReviewCycle`. `offCentre` was true when centred. `RESET_LABEL` and `screen` held lists of measurements left out, and say so.
- **Comments that no longer said what the code did**: the registry still said descriptions were written at each placement, and `product.css` claimed every rule was scoped.

Checked and left:

- **The journey's `flow` uses two marks, `'←'` and `'·'`, among the party names.** A typed union was considered; it made the content file harder to read against the Reference markup for no behaviour it protects.
- **`party` is a string, not the three parties as a type.** The Owner is «المالك / المطوّر» in one place and «المالك» in another on the Reference site, and ticket 21 makes these CMS text.
- **`TrustStrip` is imported from `components/home/`**, and `'ar'` / `rtl` are written into the product components as they are into the home page's. Moving shared components and the English site (tickets 40–42) are their own work.
