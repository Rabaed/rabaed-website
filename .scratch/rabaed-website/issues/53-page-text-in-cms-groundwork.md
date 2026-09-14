# 53: Page text in the CMS — the groundwork, proven on the start page

**What to build:** Ahmed opens the start page in the admin, rewords its hero, adds a fourth step, hides the free tool teaser, previews the page and publishes it himself. The pieces he uses — sections that show or hide, lists he can add to and reorder, limits that stop a card overflowing, pictures he can replace — are the ones every other page is then built from.

**Blocked by:** 19, 22, 52

**Status:** ready-for-agent

- [ ] Page text is stored localised: each page list is one list shared across locales, each item holding its text per locale (spec: Content model). Arabic and English exist; neither is ever filled in from the other
- [ ] A page is published in a locale only once every item has that locale's text (spec: Content model). Publishing the Arabic never publishes an empty English page — ticket 23 found that Payload's per-field localisation shares one draft and publish state across languages, so this has to be designed for, not assumed
- [ ] Every grid holding a list an Editor manages lays out any number of items neatly, without changing how today's counts look (spec: Design system)
- [ ] Each marketing page is one CMS entry holding a fixed run of sections in a fixed order. An Editor cannot add, remove or reorder sections
- [ ] A section an Editor may hide has a switch for it; a section something links to has none. On the start page that is the questions with the demo request form (`#faq`, where the home page's «كل الأسئلة» and the hero land)
- [ ] Lists: an Editor adds, removes and reorders items. A list the design builds around an exact count can be locked at it (the page tickets use this)
- [ ] Every text field carries the length its place in the design can hold, and every list its item limit; the admin refuses more, with a message in Arabic and English, and the visitor's page never breaks
- [ ] A picture on a page is replaceable from the admin; a replacement needs its description for screen readers, and keeps the shape its place needs
- [ ] Like an article, a page change is saved as a draft, previewed on the page itself, and reaches visitors only when published; publishing refreshes the site
- [ ] `src/content/pages/page-content.ts` reads a page from the CMS in the locale asked for, and refuses a locale the page is not published in — never another locale's words (ticket 52's `inLocale`, kept)
- [ ] **The start page proves it:** its hero, its steps and its free tool teaser, and its Questions section's eyebrow and heading, are read from the CMS. The steps lay out any number neatly (the Reference site's grid only looked right in threes), and three still match the baseline
- [ ] A migration imports the start page's words verbatim as its first published version, and the start page's static copy in `src/content/pages/start.ts` goes
- [ ] The start page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text
- [ ] The CMS tests follow ticket 22's rule: nothing is published that a suite running alongside could see
- [ ] `docs/deployment.md` tells Editors how page editing works

**Not this ticket:** the Trust strip (ticket 20), the FAQ entries themselves (ticket 22, done), each page's search title, description and sharing image (ticket 26), the other five pages (tickets 54–58), and the header, footer and index-page words (ticket 59).

## Comments

**Split from ticket 21 (15 September 2026).** Ticket 21 was the widest ticket in the set, and as one pull request it would have been too large to review. It became this ticket and tickets 54–59; ticket 21's closing comment maps each of its criteria to where it went.

**Why the groundwork comes with a page.** The spec's one test seam is the running site (Testing Decisions), so machinery no page uses cannot be tested. The start page is the smallest page, and it exercises every piece: a hero, a list in a grid, a section that hides, a linked section that cannot.

**Worth knowing before starting.**

- **Localisation is new to the CMS.** Blog posts, case studies and FAQs keep one entry per language (spec: Content model); turning on per-field localisation for pages must not change their tables or their data. Check the generated migration for exactly that.
- **Pages read the CMS the way FAQs already do** (`src/cms/faqs.ts`): published content for visitors, the latest draft while an Editor previews.
- **Preview builds do not migrate.** A pull request adding CMS tables needs `npm run cms:migrate` run from its branch against the preview database before its preview builds (`docs/deployment.md`).

**Parallel sessions.** This changes the CMS configuration and `src/content/pages/page-content.ts`, which every page ticket builds on. Take it with no other page ticket open, and merge it before tickets 54–59 start.
