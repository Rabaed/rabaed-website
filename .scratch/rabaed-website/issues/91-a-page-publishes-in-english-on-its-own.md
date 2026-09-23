# 91: A page can be published in English on its own, and "is it in English?" is cheap to ask

**What is wrong:** two things, tangled together.

1. **All six pages share one search settings entry**, and its English check covers the whole entry (`src/cms/page-fields.ts:99`, `src/cms/globals/search-settings.ts:82-117`). So to publish one page in English, an Editor must first write English search titles and descriptions for all six. Ticket 63 left moving each page's search fields onto its own entry as its one unchecked item: "now possible, and not done here".
2. **Whether a page is published in English is answered by building the whole English page** — its questions, its form's words, the Trust strip, the Screen mocks — every time the Arabic page renders, and for each page when the sitemap and `llms.txt` are built (`inEnglish` and `publishedLocales`, `src/content/pages/page-content.ts:112-133`). Which entries decide it is known only inside each page's loader, and is written out again in `docs/deployment.md` and `tests/e2e/english-pages.spec.ts:221,276`.

Found by the architecture review of 24 September 2026 (A5).

**Blocked by:** None.

**Status:** needs-triage — moving the search fields changes where an Editor edits a page's search title, which is the founder's call, and it moves live content

- [ ] **The founder decides** whether each page's search title and description move onto that page's own entry; if yes, an ADR records it
- [ ] If moved: a migration carries the published search settings, in both languages, onto each page's entry, and retires the old entry; the admin shows them beside the page's other words
- [ ] A small module answers "is page P published in language L?" from the entries that decide it, without building the page; the sitemap, the switcher, the notices and `llms.txt` (ticket 82) ask it
- [ ] Which entries decide each page's English is stated once, and the docs and tests read it from there
