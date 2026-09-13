# 13: Start page

**What to build:** The "how we start" page: three steps to going live, the guarantee, the FAQ, and the free tool teaser.

**Blocked by:** 04, 11

**Status:** resolved

- [x] All sections match baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports; see below for what is left out and why
- [x] FAQ entries use native disclosure elements
- [x] The demo request form is marked up as a real form, ready to be wired in ticket 27
- [x] The page does **not** load the animation library or homepage animation code it has no use for — the Reference site ships both and must not be copied in that respect
- [x] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.

**What was built.** `/start`, in the Reference site's order: the page hero «كيف نبدأ معك — وكل ما قد تسأل عنه.», the Trust strip, the three steps «فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.» with the guarantee's card marked out, the seven questions «قبل أن تسأل» with the demo request form beside them, and under both the free tool teaser «سجل صبّات الخرسانة ونتائج التكسير». Every word, the title and the description are verbatim from `reference/site/start.html` and in the first response.

The two sections are server components in `src/components/start/` — `steps.tsx` and `questions.tsx` — and their styles are `src/styles/start.css`. Nothing on the page has a client component of its own.

- **The questions** are ticket 11's `<details>`. `src/components/faq.tsx` now has `FaqEntries`, the questions alone, and `Faq`, the same questions in the row of cards the home page uses; the start page stacks its longer list in a column with `FaqEntries`. The seven are `START_FAQ` in `src/content/faq.ts`. The home page's three stay a list of their own, though the words are the same, so reordering one page's questions cannot change the other's.
- **The form** is ticket 11's `DemoRequestForm`, so ticket 27 wires the home, product and start pages at once. Its submit button stays disabled until then, and the Reference site's fake «وصلنا طلبك» is not carried over.

### No animation code the page has no use for

The Reference start page carries all of GSAP, ScrollTrigger and the whole home page script: hero loop, card decks, journey pin, record section, before and after, calculator. The only things that move on it are the header's colour toggle and, in the rebuild, the Trust strip.

- **GSAP and ScrollTrigger do load**, because the header's colour toggle and the Trust strip marquee are on this page and are built on them. Removing GSAP from them would change every page, and the spec keeps GSAP as the site's one animation library.
- **Nothing else does.** None of the home page's hero loop, card decks or four units, nor the product page's journey or roles, reaches `/start`: they are client components only their own pages import.
- **The `.reveal` entrance moved out of `PageShell`** into the home page, the only page with a `.reveal` element. It had been mounted on every page, which on this one would have been the Reference site's mistake again: a script run for elements the page does not contain.

### Deliberate differences from the Reference site

- **The step labels «01 · إعداد», «02 · تشغيل», «03 · ضمان»** set the Arabic face, with only the numeral in DM Mono, as the guarantee pill does. The Reference site sets the whole label in DM Mono, which has no Arabic glyphs. They keep its .12em letter-spacing; noted on bug 45. The page's four eyebrows are still `.eyebrow` and wait on that decision.
- **«تحميل الأداة» leads to the tool page** (`/tool`), where the Reference site's button goes nowhere (`href="#"`). The tool page describes the Pour Tracker and delivers it (CONTEXT.md). Until ticket 14 builds it, the link reaches the 404 page, as the header's links to unbuilt pages do.
- **«الأسئلة الشائعة ↓» and the home page's «كل الأسئلة»** land on `#faq` 78px short, with `scroll-margin-top` instead of the Reference site's script — the same as `#demo`. The jump is instant rather than smooth.
- **The disabled submit button**, ticket 11's: 2px taller than the Reference site's, which moves the tool teaser 2px down wherever the form stacks under the questions.
- **The Trust strip travels**, as ticket 06 decided.

### Tests

- **`tests/e2e/start-page.spec.ts`**
  - Every section and every answer in the first response, with no fake confirmation.
  - The steps in order, with the guarantee last.
  - Each question a `<details>` that opens and closes with JavaScript off, and from the keyboard.
  - The form's six named fields, and nothing pretending to send it.
  - Both hero links landing clear of the header.
  - The form beside the questions at 1280px and under them at 980px.
  - The tool teaser's link.
  - No sideways scrolling at all sixteen baseline viewports.
  - **The animations test:** the scripts `/start` loads contain none of six markers, each a string from one behaviour's source — the `.reveal` entrance, hero loop, card decks, four units, journey, roles. A second test finds each marker on the page that uses it, so a marker the build renames or drops fails there instead of letting the first pass vacuously.
- **`tests/e2e/start-matches-reference.spec.ts`** compares, part by part, at all sixteen baseline viewports:
  - the hero
  - the steps
  - the questions (closed) and the form
  - the tool teaser

  Left out, and only where they reach: the step labels' typeface; the form's differences, as ticket 11 recorded them; the section's and grid's height; and the tool teaser's place when stacked. The Trust strip and the header are not compared here (tickets 06 and 04).
- **The form's comparison parts** moved from `tests/e2e/closing-section.ts` to `tests/e2e/demo-request-form.ts`, which both the closing section and the start page measure the form with.
- **`/start` is in `tests/e2e/routes.ts`**, so the server-rendering, health, fonts, indexing and localisation suites cover it.

**Verified by falsification**, each break run on its own build:

- **Three breaks in one build**, each aimed at a different test, failed exactly those 18 tests:
  - A step card's padding off by one pixel failed all sixteen comparisons.
  - Taking away `#faq`'s scroll margin failed exactly the «الأسئلة الشائعة ↓» test.
  - Mounting the product page's `RolesBehaviour` on the start page failed exactly the animations test.
- **Comparing the step labels' typeface** failed all sixteen viewports.
- **Comparing the tool teaser's place when stacked** failed exactly 360, 390, 768 and 820px, the four widths where the form stacks under the questions.
- **Mounting `RevealOnScroll` on the start page** failed exactly the animations test.
  - Its marker had first been `.reveal`, unquoted. That failed with the entrance already gone, because React's `revealOrder` and Next's `revealAfter` contain it too.
  - The marker is now the quoted selector `".reveal"`, which only the entrance's own code contains.

### What the review changed

Two reviews, standards and spec. The spec review checked every piece of copy against the Reference page character for character and found it verbatim, and the standards review checked every CSS value and found them exact. What they did find:

- **The `.reveal` entrance still loaded on this page**, from `PageShell`. It is the home page's now, and the animations test looks for it.
- **This ticket was not written up.** It is now.
- **Comments claiming more than the code did.**
  - The page said it loaded no other animation code while `PageShell` still did.
  - `start.css` said every value was compared, when the labels' typeface is not and the scroll margin is held elsewhere.
- **The guarantee's card was found by its position** in the list. Each step now says whether it is the guarantee.
- **The home page's questions were the start page's first three by slicing**, which tied one page's list to the other's order and blurred the grouping ticket 22 keeps. They are a list of their own again.

Checked and left:

- **The form and FAQ behaviour tests repeat the home page's.** Each page's spec says what a visitor meets on that page; the geometry, which is long and easy to get subtly wrong, is the part now shared.
- **The header and footer on `/start` are not compared** against the Reference start page. `shell-matches-reference.spec.ts` compares them on the home page, from the same component; the product page left them there too.
- **The animations test reads scripts until the network is idle.** A chunk loaded later, on scroll or interaction, would be missed. Nothing on this page loads one.
- **One flaky run, not this page's.** Once, in a full-suite run after `RevealOnScroll` left `PageShell`, `product-journey.spec.ts`'s «the journey is measured again when the window changes size» failed. It then passed five times of five on its own, and the full suite passed again untouched. Worth watching if it recurs under load.
