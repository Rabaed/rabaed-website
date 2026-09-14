# 57: The product page's text, the closing section and the Screen mocks in the CMS

**What to build:** Ahmed changes anything the product page says — the journey through the four units, what each party sees, what stays inside each party — replaces a Screen mock's picture, description or caption, and rewords the block the home and product pages both end on, once for both.

**Blocked by:** 53

**Status:** ready-for-agent

- [ ] Every section's words and pictures on the product page are read from the CMS: the hero, the journey panels, the custom strip, the roles, the review cycles
- [ ] Every list is editable, except the three parties: the roles and the review cycles stay locked at three (spec: Content model)
- [ ] The journey (`#journey`) cannot be hidden: the hero's second button lands on it. Every other section can be, except the closing section with the demo request form
- [ ] **The closing section** («كيف نبدأ معك» and its steps) is one CMS entry shared by the home and product pages, so the two cannot drift apart; its section with the demo request form (`#demo`) cannot be hidden
- [ ] **Screen mocks:** each mock's picture, description and caption are replaceable in the CMS, once for every page that shows that mock. A replacement must be 1440×900, and the check that exported images match their markup skips mocks replaced in the admin (spec: Screen mocks)
- [ ] Limits where the design cannot carry more: the journey panels are the height of the window and clip long copy, and the custom strip's badge can overlap a long title
- [ ] A migration imports the product page's words, the closing section and the mocks' descriptions verbatim, and their static copy goes
- [ ] The product page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the home page (ticket 58, which uses this ticket's closing section and mocks), changing what a mock depicts (still a developer's job through the studio), the demo request form's wording (ticket 27), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53. The closing section and the Screen mocks sit here because the product page is the first of the two pages that share them.

**Parallel sessions.** Touches the product page, the shared closing section and Screen mock picture, and the mock export check. Run it beside tickets 54, 55, 56 and 59 once ticket 53 is merged, but before ticket 58: the home page uses both shared pieces.
