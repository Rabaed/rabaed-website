# 52: One place per page for its text

**What to build:** Each marketing page gets its words, lists and pictures from one place, and its sections draw what they are handed — the way the legal pages already work. Nothing a visitor sees changes. This is what lets ticket 21 move the text into the CMS one page at a time, and ticket 42 reuse every section in English.

**Blocked by:** 16

**Status:** ready-for-agent

- [ ] Home, product, start, tool, referral and partnership each read their content through one content module per page, given a locale
- [ ] Section components receive their text, lists and images as input; none imports from `src/content/` or carries Arabic copy of its own — `ClosingSection` and the page heroes written inline in `page.tsx` included
- [ ] Client components receive their labels from the server-rendered page
- [ ] Content is shaped as ticket 21 will store it: fixed sections, each with its fields, its lists, and whether it shows
- [ ] The Referral Program values are held once and inserted wherever the referral page and its FAQ quote them; the Referral Terms keep their own text (ADR-0008)
- [ ] Asking for a locale a page has no content in is refused, never answered with another locale's content
- [ ] Pages still match baselines at all eight widths, page text is present in the server response with JavaScript off, and the existing suite passes without rewriting its expected text

**Not this ticket:** form wording (ticket 27) and the shape of the FAQ section (ticket 22). The legal pages already work this way and are left alone.

## Comments

**Why this exists (13 September 2026).** An architecture review of page text and forms found about half the marketing text written as JSX literals across roughly 35 section components and 5 page files, 23 direct `@/content/*` imports inside sections, and the referral payout and client discount typed 18 times across 6 files. Ticket 21 would have had to reach all of them. The model is the legal pages: `<LegalDocumentPage document={TERMS} />` receives a document and draws it, so ticket 25 only changes where `TERMS` comes from. The founder chose this, with the decisions recorded in the spec's Content model section and ADR-0007 and ADR-0008.

**Parallel sessions.** This touches every marketing page. Take it in a lane with no other page ticket open, and after ticket 16 has merged.
