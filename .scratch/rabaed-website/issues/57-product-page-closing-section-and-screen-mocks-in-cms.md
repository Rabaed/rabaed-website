# 57: The product page's text, the closing section and the Screen mocks in the CMS

**What to build:** Ahmed changes anything the product page says — the journey through the four units, what each party sees, what stays inside each party — replaces a Screen mock's picture, description or caption, and rewords the block the home and product pages both end on, once for both.

**Blocked by:** 53

**Status:** ready-for-agent

- [ ] Every section's words and pictures on the product page are read from the CMS: the hero, the journey panels, the custom strip, the roles, the review cycles
- [ ] Every list is editable, except the three parties: the roles and the review cycles stay locked at three (spec: Content model)
- [ ] The journey (`#journey`) cannot be hidden: the hero's second button lands on it (found in ticket 52; the spec's and ticket 21's lists of linked sections did not name it). Every other section can be, except the closing section with the demo request form
- [ ] Every grid holding an editable list lays out any number of items neatly, and today's counts still match the baselines
- [ ] **The closing section** («كيف نبدأ معك» and its steps) is one CMS entry shared by the home and product pages, so the two cannot drift apart; its section with the demo request form (`#demo`) cannot be hidden
- [ ] **Screen mocks:** each mock's picture, description and caption are replaceable in the CMS, once for every page that shows that mock. A replacement must be 1440×900, and the check that exported images match their markup skips mocks replaced in the admin (spec: Screen mocks)
- [ ] A picture on a page is replaceable from the admin: a replacement needs its description for screen readers, and keeps the shape its place needs (moved from ticket 53, whose start page has no pictures)
- [ ] Limits where the design cannot carry more: the journey panels are the height of the window and clip long copy, and the custom strip's badge can overlap a long title
- [ ] A migration imports the product page's words, the closing section and the mocks' descriptions verbatim, and their static copy goes
- [ ] The product page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the Trust strip (ticket 20), the home page (ticket 58, which uses this ticket's closing section and mocks), changing what a mock depicts (still a developer's job through the studio), the demo request form's wording (ticket 27), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53. The closing section and the Screen mocks sit here because the product page is the first of the two pages that share them.

**Decided while building (15 September 2026).**

- **The home page reads both shared entries already.** The closing section and the Screen mocks are each one CMS entry, and a shared entry that only the product page read would let the two pages drift apart the moment an Editor changed it. So `src/content/pages/home.ts` takes its closing section and its four units' screens from the CMS now; the rest of the home page's words, the four tabs' titles included, stay ticket 58's.
- **A mock's description and its caption are one field.** ADR-0002 has the caption state the same claim as the picture's description, and today's code uses one text for both; two fields would only let them disagree. It is written in Arabic and English, as page words are, rather than taken from the image library's own description, which holds one language.
- **A replacement is 1440×900 or larger in the same proportions**, not exactly 1440×900: the exported images are 2880×1800, so a replacement exactly 1440×900 would be the one picture on the page that looks soft on a dense screen. `pictureField` in `src/cms/page-fields.ts` refuses any other shape, or smaller, on publishing.
- **The export check skips a mock a page shows with a picture other than its export.** Every mock's picture names its mock (`data-screen-mock`), and the check reads the home and product pages as a visitor receives them rather than the CMS: the checks run side by side, and side by side sign-ins to one account erase each other's sessions. A mock no page shows just now, its section hidden, is still checked. The test server's database is new on every run, so there no mock is ever replaced and the check runs for all eight.
- **A published replacement is not tested as a visitor sees it**, because publishing one would change the picture the product and home pages' own suites check as they run beside it (ticket 22's rule). The preview is tested, and `src/cms/pages.ts` reads what visitors see and what an Editor previews at one depth, so the two cannot differ in whether a picture comes with its image — the one way they did, until review.
- **The hero cannot be hidden either**, beyond the journey and the closing section the ticket names: it holds the page's only main heading, as on the start page (ticket 53).
- **Three or five cards in the custom strip are never a row of three.** A card a third of the row wide brings a 32-character title under the badge, so the last of an odd number takes the whole row, and no card is narrower than today's.
- **The closing steps' labels are held to 10 characters**, as short as today's «إعداد» and «تشغيل» leave room for; the design sets them on one line whatever their length, so the limit is what keeps the text beside them from being pushed aside.
- **The limits were measured on the Reference site, not guessed.** At 981×551, the smallest window that pins the journey, today's second panel has 31px to spare. A panel holds a 40-character title, an 80-character line, 200 characters of text and four parties of 16 characters, under a one-line heading of 40; `tests/e2e/product-text.spec.ts` fills every panel to those limits and checks the words stay inside. The custom strip's card title is held to 32 characters, which stays clear of the badge at every desktop width (the Reference site's longest is 31).
- **On a phone the badge already sits over today's card titles**, on the Reference site as here (360 and 390px). No limit fixes that, and moving the badge would change a layout the baselines hold, so it is left as it is. Worth a design decision if it bothers anyone.
- **The row of parties under a panel is a list of parties, each saying what follows it**: an arrow to the next, a break before another route, or nothing. The arrow and the break are drawn by the page, so an English page draws its arrow the other way.
- **The Record's panel is a switch on a panel**, and its name («المخرَج») is one word for the section, so a panel never needs a name it does not show.
- **The product page's Trust strip got a switch**, as the start page's did (ticket 53).

**Parallel sessions.** Touches the product page, the shared closing section and Screen mock picture, and the mock export check. Run it beside tickets 54, 55, 56 and 59 once ticket 53 is merged, but before ticket 58: the home page uses both shared pieces. Every one of tickets 53–59 adds a CMS migration, and two branches' migrations collide: after updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again (`docs/agents/parallel-sessions.md`).
