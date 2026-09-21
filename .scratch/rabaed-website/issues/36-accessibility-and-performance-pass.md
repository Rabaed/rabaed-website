# 36: Accessibility and performance pass

**What to build:** The site works for people using screen readers and keyboards, and loads fast on a mobile connection in Saudi Arabia.

**Blocked by:** 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17

**Status:** resolved — two founder decisions on the way, both recorded as ADRs: ADR-0011 on the brand orange, ADR-0012 on the webfont

- [x] Automated accessibility checks pass on every page — axe against WCAG 2.1 A and AA, twelve routes, in `tests/e2e/accessibility.spec.ts`
- [x] Every Screen mock has a meaningful description; every image has `alt` text
- [x] Every interactive element is reachable and operable by keyboard, with a visible focus state — Tab walks every page and every control it passes looks different while it holds focus; a site-wide `:focus-visible` ring puts one on the links, fields and buttons the Reference site left to the browser, and the calculator's sliders get theirs back
- [x] Colour contrast meets the standard, including the muted greys on dark sections — one listed exception, white on the accent fill, which the founder kept (ADR-0011)
- [x] No layout shift as images and fonts load — from 0.003–0.12 down to 0.001–0.053, and the page's own shift, with the webfont cached, held to 0.001 on every route. The swap itself is measured at its cause, the stand-in's width against the real face (ADR-0012)
- [x] Page-speed targets met on a simulated mobile connection — the largest element paints inside 2.5s on Slow 4G on every route, and each page's weight is held to a ratchet
- [x] No page ships the animation library or code it does not use — the tool, referral, partnership, legal, blog and English pages now load no GSAP at all
- [x] With reduced motion enabled, every page remains complete and readable

## Comments

**GSAP on pages that move nothing but the header (ticket 14, 13 September 2026).** The header's colour toggle (`src/components/nav-behaviour.tsx`) is built on GSAP's ScrollTrigger, so every page loads GSAP and ScrollTrigger. On the tool page that toggle is the only thing that uses them. The Reference tool page does the same toggle with a plain scroll listener and loads no GSAP at all. The start page loads it for the Trust strip as well, so there it is used twice. Whether the toggle should be rebuilt without GSAP, so that pages like these load none, is this ticket's call: it changes the header on every page, and the spec keeps GSAP as the site's one animation library.

**The toggle is a plain scroll listener now (21 September 2026).** The spec's performance budget says a page must not ship the animation library where it is unused, and with the toggle built on ScrollTrigger there was no such page — the header is on all of them. So the toggle reads the two elements' positions on scroll, at the same two offsets ScrollTrigger was given, and GSAP loads only where something is actually animated: the home and product pages, and the start page for the Trust strip. The library is still the site's one animation library and nothing else changed about it. `tests/e2e/performance.spec.ts` holds every route to the table in `animation-code.ts` from both sides, so a page that starts loading it, or stops, fails.

**What the automated check actually found (21 September 2026).** Nothing structural — no missing label, landmark, heading or `alt` on any of the twelve routes. Every single violation was colour contrast, and almost every one was the brand orange `#F95738`, which is 2.7–3.3:1 as small text on the pale grounds against the 4.5:1 the standard asks. The founder chose to split the colour rather than move it (ADR-0011). The three things that were nothing to do with the accent — the Record chips dimmed to `.32`, the tool page's gold warning, and its state pills — were simply fixed.

**Two things this ticket found and left for a later one.** Both are written into the budgets in `tests/e2e/performance.spec.ts` so whoever takes them starts with the evidence:

- **The Arabic webfont is ~205 KB on every page**, five faces at four weights. Cutting it means setting the site in fewer weights, which is a design change.
- **The Screen mocks are ~370 KB on the home and product pages.** Below 700px each is drawn 1040 CSS pixels wide and panned across (tickets 08 and 12), so a phone is sent the widest copy of every one, and every panel is fetched at once because a panel behind a tab is `display: none` and would otherwise arrive blank in front of the visitor.

The one weight this ticket did cut: the header's wordmark was a 41 KB PNG on every page and is now a 13 KB WebP, drawn by `npm run brand:export` from the founders' own file in `reference/brand/`.

**The runner has no Arabic face (21 September 2026).** The first CI run went red on five of the twelve shift readings, at 0.08 to 0.13 — worse than the numbers this ticket started from, on the same commit that measures 0.001 to 0.053 on a developer's machine. The hosted Linux runner draws Arabic in a last-resort face that no `local()` can name, no `size-adjust` can rescue, and no visitor has. A budget that held on both machines would have been worth nothing on either. So the per-route reading is taken on the page's *second* load, with the webfont already cached and no swap in it, and held to 0.001 — what is left there is the page's own doing and is the same on every machine — and the swap is measured once, at the thing that decides it: how wide the stand-in sets a line of the site's Arabic against the real face. ADR-0012 records it.
