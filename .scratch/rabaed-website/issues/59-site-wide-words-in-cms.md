# 59: The header, footer and index-page words in the CMS

**What to build:** Ahmed changes the words every page shares — the header menu's labels, the footer's lines and link labels, the not-found page — and the one line under the blog's and the case studies' headings, without a developer.

**Blocked by:** 53

**Status:** ready-for-agent

- [ ] The header menu's labels and the footer's text and link labels are read from the CMS, localised, and shared by every page
- [ ] Which pages the header and footer link to stays in code: an Editor changes what a link says, never where it goes, so no link can lead to a page that does not exist
- [ ] The not-found page's words, and the lead lines of the blog index and the case studies index, are read from the CMS
- [ ] A menu label is limited to what fits on one line of the header at desktop width
- [ ] A migration imports today's words verbatim, and their static copy in `src/content/navigation.ts`, `src/content/blog.ts` and `src/content/case-studies.ts` goes
- [ ] Every page still matches its baselines at all eight widths, and the existing suite passes without rewriting its expected text

**Not this ticket:** the contact details and social links (site settings, ticket 19, done), and search titles and descriptions (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** Ticket 21 named only the six marketing pages, but tickets 04 and 23 and the comments in `src/content/navigation.ts`, `blog.ts` and `case-studies.ts` all say ticket 21 makes these words editable. This ticket gives them a home.

**Parallel sessions.** Touches the header and footer, which every page renders, so every page's baselines re-run. Run it beside tickets 54–57 once ticket 53 is merged; conflicts are unlikely, since no page ticket touches the header or footer.
