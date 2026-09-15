# 21: All page text in the CMS

**What to build:** Ahmed edits any headline, paragraph, label, image or list on any of the six marketing pages, switches sections off, and publishes the change himself — and the admin will not let him break the design.

**Blocked by:** 19, 25, 52, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16

**Status:** wontfix — not built as one ticket: replaced by tickets 53–59, which carry all of its work (see the last comment)

- [ ] Every page's copy is stored as localised content, not hardcoded in the markup: each page's content module (ticket 52) reads from the CMS
- [ ] Images on every page are replaceable from the admin
- [ ] Editors add, remove and reorder the items of every list, except where the design is built around an exact count: the before/after steps (4), the calculator's sliders (3), the hero's buildings (3), the three parties
- [ ] Grids that only looked right in sets — the referral how-it-works steps in fours, the start and tool steps in threes, the referral offer cards and terms summary in twos — lay out any count neatly, and today's counts still match baselines
- [ ] Editors can switch a section off, except sections that links point at: `#demo`, the start page's `#faq`, the tool page's `#get` and `#how`, the referral page's `#signup` and `#how`
- [ ] Section order is fixed
- [ ] Wherever the design cannot carry more, the admin enforces a character or item limit; the visitor's page never breaks (spec: Content model)
- [ ] The Referral Program values are one global; page text that quotes them inserts the value, and changing it updates every mention
- [ ] While the published Referral Terms do not state the current values, the admin warns on the values, on the Referral Terms and on the dashboard; publishing is not blocked (ADR-0008)
- [ ] Screen mock images, descriptions and captions are replaceable; a replacement keeps the 1440×900 shape, and the export check skips replaced mocks
- [ ] Each page list is one list shared across locales, each item holding text per locale
- [ ] Pages still match baselines at all eight widths after the content move
- [ ] Page text remains present in the server response with JavaScript disabled
- [ ] An entry with no translation in the requested locale is never silently substituted

**Note:** this is the widest ticket in the set. Migrate page by page, keeping the baselines green between each.

## Comments

**Widened on 13 September 2026** by the founder's decisions after the architecture review: visitor experience wins over editing freedom, Editors change words, pictures and lists but not section order, and every Editor has every right (ADR-0007). The spec's Content model section holds the full set.

**Where the limits will bite (surveyed 13 September 2026 — re-check against the code).**

- The tightest cards are the home figure cards (344×296, 268px tall on short screens, `home.css`) and the pain cards (340×348).
- The before/after cards are absolutely positioned with a minimum height, and the closing steps' labels do not wrap.
- The product journey panels are the height of the window with overflow hidden, so long copy is clipped rather than overflowing.
- The custom strip's badge is absolutely positioned and can overlap a long title.
- The before/after cards' starting state uses `nth-child` for 4 columns (2 on mobile), which is part of why that count stays locked.

**Blocked by 25** because the Referral Terms warning compares the values with the published Referral Terms, which ticket 25 moves into the CMS.

**Split (15 September 2026).** Too wide for one pull request, this ticket is replaced by seven, each one reviewable on its own preview link. Nothing is dropped; its criteria went here:

| Ticket 21's criterion | Now in |
|---|---|
| Copy stored localised, each page's content module reads the CMS | 53 (how), 54–58 (each page) |
| Images replaceable | 53 (how), 54–58 |
| Lists editable, except the exact counts | 53 (how); 57 the three parties; 58 the hero's buildings, the before/after steps, the calculator's sliders |
| Grids that only looked right in sets | 53 start steps; 54 tool steps; 56 referral steps, offer and terms summary |
| Sections switch off, except linked ones | 53 (how) and `#faq`; 54 `#get`, `#how`; 55 `#path`, `#apply`; 56 `#signup`, `#how`; 57 `#journey`, `#demo` |
| Section order fixed | 53 |
| Limits where the design cannot carry more | 53 (how), 54–58 with ticket 21's survey |
| Referral Program values one global | 56 |
| The Referral Terms warning | 56 |
| Screen mocks replaceable | 57 |
| Page lists shared across locales | 53 |
| Baselines, text with JavaScript off, no substituted locale | every one of 53–59 |

Ticket 59 is new: the header, footer, not-found page and index-page lines, which tickets 04 and 23 expected this ticket to cover but its criteria never named. The code comments that still say "ticket 21 moves this into the CMS" mean these tickets.

Order: 53 alone first; then 54, 55, 56, 57 and 59 side by side; then 58, which uses 57's closing section and Screen mocks.
