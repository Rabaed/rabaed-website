# 54: The tool page's text in the CMS

**What to build:** Ahmed changes anything the tool page says about the free Pour Tracker — its hero, why it exists, what it does, the steps, where its files live, what it needs, the upsell — and publishes it himself, without breaking the page.

**Blocked by:** 53

**Status:** ready-for-agent

- [ ] Every section's words on the tool page are read from the CMS, including the words drawn in the hero's picture of the tool and the download section's own heading and lines (that picture is drawn in markup, so the tool page has no image to replace; replaceable pictures are ticket 57's)
- [ ] Every list is editable: the reasons, the feature cards, the steps, the privacy points and folder tree, the requirement cards, the upsell's list
- [ ] The how-it-works steps lay out any number neatly (the Reference site's grid only looked right in threes), and three still match the baseline
- [ ] The download section (`#get`) and how-it-works (`#how`) cannot be hidden: the hero's two buttons land on them. Every other section can be
- [ ] Wherever a card or a line has a fixed size, the admin enforces its limit
- [ ] A migration imports the tool page's words verbatim as its first published version, and its static copy goes
- [ ] The tool page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the download form's fields and wording (tickets 27 and 30), the FAQ entries (ticket 22), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53.

**Parallel sessions.** Touches only the tool page's module, components and a migration of its own, so it can run beside tickets 55, 56, 57 and 59 once ticket 53 is merged. Every one of tickets 53–59 adds a CMS migration, and two branches' migrations collide: after updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again (`docs/agents/parallel-sessions.md`).
