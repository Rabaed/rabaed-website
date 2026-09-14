# 52: One place per page for its text

**What to build:** Each marketing page gets its words, lists and pictures from one place, and its sections draw what they are handed — the way the legal pages already work. Nothing a visitor sees changes. This is what lets ticket 21 move the text into the CMS one page at a time, and ticket 42 reuse every section in English.

**Blocked by:** 16

**Status:** resolved

- [x] Home, product, start, tool, referral and partnership each read their content through one content module per page, given a locale
- [x] Section components receive their text, lists and images as input; none imports from `src/content/` or carries Arabic copy of its own — `ClosingSection` and the page heroes written inline in `page.tsx` included
- [x] Client components receive their labels from the server-rendered page
- [x] Content is shaped as ticket 21 will store it: fixed sections, each with its fields, its lists, and whether it shows
- [x] The Referral Program values are held once and inserted wherever the referral page and its FAQ quote them; the Referral Terms keep their own text (ADR-0008)
- [x] Asking for a locale a page has no content in is refused, never answered with another locale's content
- [x] Pages still match baselines at all eight widths, page text is present in the server response with JavaScript off, and the existing suite passes without rewriting its expected text

**Not this ticket:** form wording (ticket 27) and the shape of the FAQ section (ticket 22). The legal pages already work this way and are left alone.

## Comments

**Why this exists (13 September 2026).** An architecture review of page text and forms found about half the marketing text written as JSX literals across roughly 35 section components and 5 page files, 23 direct `@/content/*` imports inside sections, and the referral payout and client discount typed 18 times across 6 files. Ticket 21 would have had to reach all of them. The model is the legal pages: `<LegalDocumentPage document={TERMS} />` receives a document and draws it, so ticket 25 only changes where `TERMS` comes from. The founder chose this, with the decisions recorded in the spec's Content model section and ADR-0007 and ADR-0008.

**Parallel sessions.** This touches every marketing page. Take it in a lane with no other page ticket open, and after ticket 16 has merged.

**Resolved (14 September 2026).** Each page reads `get<Page>Page(locale)` from `src/content/pages/`, and `src/content/pages/page-content.ts` holds the rules they share. What ticket 21 and ticket 42 inherit, and decided here rather than asked for:

- **Types live with the sections.** Each section exports the content it draws (`ProductJourneyContent`, `ReferralSignupContent`, …) and content files import those types, so a section cannot quietly start reading a source of its own. The legal pages keep their own arrangement.
- **A module returns one locale's view**: fixed sections, their fields and lists, and `shows`. How the CMS stores a list across locales (spec: one list, text per locale) is ticket 21's; the static files behind the modules hold Arabic only, some as `{ ar: … }` records and some as bare lists.
- **Hiding.** A section something links to is a `LinkedSection` and always shows: the closing section with the demo form, the start page's questions, the tool page's download and how-it-works, the referral page's signup and how-it-works, the product page's journey, and the partnership page's path and application. **Heroes always show** — each carries its page's only `<h1>` — which the spec did not say.
- **Exact counts are locked in the types**: the before/after steps (4), the calculator's sliders (3), the hero's buildings (3), and the three parties in the product page's roles and review cycles.
- **The refusal** (`inLocale` throws `ContentNotInLocale`) has no test: nothing asks for English yet, and the spec's one seam is the running site. Ticket 40's routes are where it becomes observable.
- **Left alone:** the four forms' wording (ticket 27), the FAQ entries in `src/content/faq.ts` (ticket 22; only the `FaqEntry` type moved into `faq.tsx`), the header and footer (`src/content/navigation.ts`), and the legal pages. The `←` and `✓` marks the Reference site draws in their own spans stay in the sections as design.
- **The Referral Program values** are `REFERRAL_PROGRAM_VALUES` in `src/content/referral-program.ts`, inserted in the referral page's search title and description, hero, how-it-works, offer, signup and one FAQ answer.

Verified: the server HTML of all six pages matches a build from before the change, apart from the order of two tags in the head of the tool, referral and partnership pages, which now match the other three; the full suite passes unchanged.
