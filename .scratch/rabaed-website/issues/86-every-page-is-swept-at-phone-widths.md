# 86: One test loads every page at phone widths and fails on any sideways scroll

**What to build:** a single sweep that opens every route of the site at 360px and 390px wide and fails if the page is ever wider than the screen — at load, after scrolling to the foot, and while each swipe surface (the card decks, the before-and-after knob, the Screen mock pan) is dragged to both ends. The spec already asks for "zero horizontal overflow, measured against `clientWidth`" on every page; today it is checked section by section, by the suites that happened to find a bug (tickets 71, 72, 74, 80), and 11 specs compute the overflow themselves instead of using `sidewaysOverflow` in `tests/e2e/geometry.ts`.

Phones are where most of the bugs of the last week were found. **Due before launch**: it is cheap, and it guards every page at once.

Found by the architecture review of 24 September 2026 (A10a).

**Blocked by:** None (can start immediately).

**Status:** resolved — no page overflows today; nothing to report

- [x] Every route in `tests/e2e/routes.ts`, in both languages where the page exists, is loaded at 360×640 and 390×844
- [x] At each: no sideways overflow at load, at the foot of the page, and at every frame while each swipe surface is dragged to either end (`widestSidewaysOverflow` exists for sampling every frame)
- [x] The specs that compute overflow themselves use `geometry.ts` instead, or say why they cannot
- [x] Any page that fails today is reported in this ticket with what overflows, not fixed silently in the same pull request

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **The sweep** is `tests/e2e/phone-sweep.spec.ts`. It covers every route in `routes.ts` at 360×640 and 390×844, 24 tests in all. On each page it:
>   - watches every frame for a second at load;
>   - scrolls down to the foot a little under a screen at a time, watching each stop and then a full second at the foot;
>   - drags and pans everything on the page that can be swiped;
>   - opens the whole screen behind the page's first Phone crop, zooms it in and pans it.
> - **Swipe surfaces are found on the page, not listed.** A surface to drag is any element with `touch-action: pan-y`: the two card decks and the before-and-after comparison. Each is dragged 40px past both edges of the screen and let go, with every frame watched for 1.5s. A surface to pan is any box that scrolls sideways inside itself. Each is scrolled to its far end and back, with every frame watched.
> - **Where the Screen mock pan is.** With the test database's content, every Screen mock on a page shows its Phone crop (ticket 78). So on a phone, the pan a visitor meets is the whole screen, zoomed in. The sweep opens the first whole screen on each page; every one is the same component. A replaced screen's pan on the page itself stays with `product-text.spec.ts`, which uploads the replacement.
> - **Two tests hold the finding itself:**
>   - The home page's two decks and its comparison are found.
>   - `/product`'s zoomed whole screen yields one pan.
>
>   Without these, a finding that stopped working would sweep nothing and pass.
> - **Checked red.** A planted 500px element failed at load and was named: `div.planted (-140px to 360px of 360px)` in Arabic, and the right edge in English. A planted pan was scrolled to both ends. Each drag was checked to do something: it threw a deck card both ways, and it moved the seam to 0 and to 100.
> - **A failure names what overflows.** `whatOverflows` in `geometry.ts` lists each outermost element that reaches past the edge the page can scroll towards, with nothing around it clipping it.
> - **No page fails today**, at either width, so there is nothing to report.
> - **The specs that computed overflow themselves** now use `sidewaysOverflow`, `widestSidewaysOverflow` or the new `sidewaysOverflowOf(box)`, for one box's own overflow. The specs moved over are `blog`, `case-studies`, `english-pages`, `home-card-decks`, `home-four-units`, `home-hero`, `page-shell`, `phone-crops` and `site-words`. Five reads stay as they are, on purpose:
>   - `product-journey.spec.ts` and `product-roles.spec.ts` read the window's hidden width in the same in-page read as the picture it holds. Moved out, the window has to be found again by an XPath that is harder to read than the one line it replaces (code review).
>   - `phone-crops.spec.ts` (`canPan`) asks the opposite question: that a zoomed screen *can* pan.
>   - `product-text.spec.ts` (`swipe`) uses the hidden width to drive the swipe, not to check it.
>   - `site-words.spec.ts` has one condition of a polled in-page read of the header row, taken together with the positions beside it.
> - **Not covered:** English pages other than `/en` and `/en/blog`. The test database holds them as drafts, so their English addresses are notices until the founder publishes ticket 42's drafts. `english-pages.spec.ts` checks the one page it publishes for overflow at load.
> - **Code review** (standards and spec, 24 September 2026):
>   - Taken:
>     - the zoomed whole screen is swept;
>     - the pan finding is held by a test;
>     - the foot is watched for a second, not 100ms;
>     - `drag` takes an edge rather than a position;
>     - the two product specs went back to their in-page read.
>   - Left:
>     - `whatOverflows` and `findSurfaces` each build their own label, because both run inside the page;
>     - `site-words`'s one-line `sideways` stays, to keep its call sites short;
>     - the pan is scrolled by script, not by a finger. What it measures is the page's overflow, which is the same either way.
