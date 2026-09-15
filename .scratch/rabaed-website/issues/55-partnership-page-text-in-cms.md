# 55: The partnership page's text in the CMS

**What to build:** Ahmed changes anything the Partnership Program page says to engineering offices — its figures, the idea, who it is for, the modes, what a partner gets, the path to joining — and publishes it himself, without breaking the page.

**Blocked by:** 53

**Status:** ready-for-agent

- [ ] Every section's words are read from the CMS, including the hero's three figures and the application section's own heading, lead and reassurances
- [ ] Every list is editable: the hero figures, the audience, the modes, the benefits, the stages of the path, the reassurances
- [ ] The modes and the path's stages lay out any number neatly, and today's counts still match the baselines
- [ ] The path (`#path`) and the application (`#apply`) cannot be hidden: the hero's buttons and the path's own link land on them (found in ticket 52; ticket 21's list of linked sections did not name them). Every other section can be
- [ ] Wherever a card or a line has a fixed size, the admin enforces its limit
- [ ] A migration imports the partnership page's words verbatim as its first published version, and its static copy goes
- [ ] The partnership page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text

**Not this ticket:** the application form's fields and wording (ticket 29), the FAQ entries (ticket 22), and the search title and description (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** See ticket 53.

**Parallel sessions.** Touches only the partnership page's module, components and a migration of its own, so it can run beside tickets 54, 56, 57 and 59 once ticket 53 is merged. Every one of tickets 53–59 adds a CMS migration, and two branches' migrations collide: after updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again (`docs/agents/parallel-sessions.md`).

**Decided while building (15 September 2026).**

- **The generated migration re-created ticket 57's tables.** Payload writes a migration against the newest snapshot by name, and on `main` that is `20260915_064014_tool_page.json`, generated on ticket 54's branch before ticket 57's product page, closing section and Screen mocks were merged. So `npm run cms:migration` wrote those tables again beside the partnership page's, which would fail on every database. Only the partnership page's statements were kept in `20260915_195429_partnership_page.ts`; its snapshot holds the whole schema as it now is, so migrations generated after this one merges are written against the right tables. Tickets 56, 58 and 59 generating theirs before then will meet the same thing: keep only their own statements.
- **The hero has no switch either**, as on the tool page: it holds the page's only heading.
- **The hero's figures are words, not a figure and a unit.** An Editor writes «3 أنماط» or «بلا رسوم» as one line; the page sets whatever numerals it holds, written 0–9, in DM Mono, as the Reference site's markup did by hand (`src/content/pages/partnership.ts`).
- **The modes' note is three fields** — the sentence, the words in bold, the rest of the line — and the page draws the spaces between them, as the tool page does with its bold openings.
- **The audience stays two to a row** at desktop widths, whatever its count, as the design builds it; a single kind of firm takes the whole width. The stages are one under another, so any number already lays out.
