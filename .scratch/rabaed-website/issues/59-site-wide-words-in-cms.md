# 59: The header, footer and index-page words in the CMS

**What to build:** Ahmed changes the words every page shares — the header menu's labels, the footer's lines and link labels, the not-found page — and the one line under the blog's and the case studies' headings, without a developer.

**Blocked by:** 53

**Status:** ready-for-agent

- [ ] The header menu's labels and the footer's text and link labels are read from the CMS, localised, and shared by every page
- [ ] The not-found page's words, and the lead lines of the blog index and the case studies index, are read from the CMS
- [ ] A menu label is limited to what fits on one line of the header at desktop width
- [ ] A migration imports today's words verbatim, and their static copy in `src/content/navigation.ts`, `src/content/blog.ts` and `src/content/case-studies.ts` goes
- [ ] Every page still matches its baselines at all eight widths, its text is in the server response with JavaScript disabled, and the existing suite passes without rewriting its expected text
- [ ] An English page never shows the Arabic header or footer in place of missing English words

**Not this ticket:** the contact details and social links (site settings, ticket 19, done), and search titles and descriptions (ticket 26).

## Comments

**Split from ticket 21 (15 September 2026).** Ticket 21 named only the six marketing pages, but tickets 04 and 23 and the comments in `src/content/navigation.ts`, `blog.ts` and `case-studies.ts` all say ticket 21 makes these words editable. This ticket gives them a home.

**To put to the founder before building:** whether an Editor may change where a header or footer link goes, or only what it says. The spec lists navigation and footer as CMS globals without saying. Keeping the destinations in code means no link can lead to a page that does not exist; letting Editors change them means a new page can be linked without a developer.

**From ticket 32 (15 September 2026).** Each inner page's breadcrumb structured data names the page with the same words as its menu entry: `meta.name` in the page's content module (`'المنتج'`, `'ابدأ'`, `'برنامج الإحالة'`, `'برنامج الشراكات'`), `'الرئيسية'` / `'Home'` for the home step in `src/components/structured-data.tsx`, and the blog's and case studies' eyebrows. Nothing ties those to the menu's labels. When the labels move into the CMS, decide whether a rename in the menu should rename the breadcrumb too; if so, read one from the other. `tests/e2e/structured-data.spec.ts` restates the names it expects, so an intended rename updates it there too.

**The founder's answers (20 September 2026).**

- **An Editor sets where a link goes, as well as what it says.** A page added later can be linked without a developer. The shape is checked — a path on the site, or a full `https://` address — but not the destination: refusing an address that matches nothing would refuse the very link this allows, and one that matches nothing reaches the site's own not-found page. Recorded in the spec (Content model).
- **Renaming a page in the menu renames it in the trail search results show.** `breadcrumbData` reads each step's name from the menu where the menu names that page, so the two cannot disagree; the tool page, an article and a legal document, which the menu does not name, keep the names their own words give them.

**Decided while building (20 September 2026).**

- **One entry, not three.** The spec named navigation and footer as separate globals; they are tabs of one entry with the not-found page, because the three are published together and in one language. Splitting them would mean a second set of tables and a second publish to remember, for no editing gain.
- **The two index leads are an entry of their own**, because they exist in English as well: a page is published in a language only with every word of it written in that language, and the header and footer have no English until ticket 40. Putting them together would force English header words that nothing shows.
- **The header is full at the Reference site's words.** Measured at 981px, the narrowest width that draws the menu as a row: four links and the Partnerships word carry eleven characters each, beside a twelve-character sign-in link and a fifteen-character demo button — exactly what those words measure today, «قصص العملاء» included. A twelfth character or a fifth link pushes the row past the header's edge; a fifth link would fit only at eight characters, shorter than the words the site has. So the CMS holds four links and rewording within that room, and a longer menu is a design decision rather than a limit to raise. `tests/e2e/site-words.spec.ts` fills the menu to those numbers and measures the row at 981, 1280 and 1600.
- **The wordmark, the demo button's destination and the year stay in code.** The wordmark leads home whatever the menu says; the demo button lands on a section of the page it is on, not a page, so its address is not an editable one; and the footer's year is code, with the words after it the Editor's.
- **Alternative text and the labels a screen reader hears stay in code**, as ticket 57 settled for pictures: they name fixed things — the wordmark, the menu button, each social network — rather than saying anything to a reader.
- **An English page shows no header or footer at all**, as before this ticket: `EditorialFrame` gives an English page a bare `<main>` until ticket 40. Where the trail needs the home page's name in English it uses its own, because the menu has no English to give.
- **The not-found page reads the CMS**, which makes it a page that can fail: every database is given these words by a migration, and one without them says so, as every other page in the CMS does.

**Parallel sessions.** Touches the header and footer, which every page renders, so every page's baselines re-run. Run it beside tickets 54–57 once ticket 53 is merged. No page ticket touches the header or footer, but every one of tickets 53–59 adds a CMS migration, and two branches' migrations collide: after updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again (`docs/agents/parallel-sessions.md`).
