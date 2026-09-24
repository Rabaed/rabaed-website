# 91: A page can be published in English on its own, and "is it in English?" is cheap to ask

**What is wrong:** two things, tangled together.

1. **All six pages share one search settings entry**, and its English check covers the whole entry (`src/cms/page-fields.ts:99`, `src/cms/globals/search-settings.ts:82-117`). So to publish one page in English, an Editor must first write English search titles and descriptions for all six. Ticket 63 left moving each page's search fields onto its own entry as its one unchecked item: "now possible, and not done here".
2. **Whether a page is published in English is answered by building the whole English page** — its questions, its form's words, the Trust strip, the Screen mocks — every time the Arabic page renders, and for each page when the sitemap and `llms.txt` are built (`inEnglish` and `publishedLocales`, `src/content/pages/page-content.ts:112-133`). Which entries decide it is known only inside each page's loader, and is written out again in `docs/deployment.md` and `tests/e2e/english-pages.spec.ts:221,276`.

Found by the architecture review of 24 September 2026 (A5).

**Blocked by:** None.

**Status:** resolved

- [x] **The founder decides** whether each page's search title and description move onto that page's own entry; if yes, an ADR records it
- [x] If moved: a migration carries the published search settings, in both languages, onto each page's entry, and retires the old entry; the admin shows them beside the page's other words
- [x] A small module answers "is page P published in language L?" from the entries that decide it, without building the page; the sitemap, the switcher, the notices and `llms.txt` (ticket 82) ask it
- [x] Which entries decide each page's English is stated once, and the docs and tests read it from there

## Comments

**The founder's decision, 24 September 2026:** move them. Each page's search title, description and sharing image are now the last tab of its own entry, **الظهور في البحث والمشاركة**, and the shared entry is gone. ADR-0023 records it.

**What was built.**

- `src/cms/search-fields.ts` is the tab, added last to each of the six page entries; the referral page's may name `{payout}` as before. The old global is deleted.
- **The move is three migrations**, because it is data between two schema changes and `npm run cms:rebase-migrations` folds a branch's generated migrations into one: `…_115211_set_aside_search_settings` copies each page's words into a table of its own, `…_115212_search_settings_on_each_page` (generated) adds the page columns and drops the old tables, and `…_115213_move_search_settings_onto_pages` puts the words onto the pages and drops the table. A published version of a page gets the search settings as last published; a draft gets them as last saved, so the English proposal waiting on a page (ticket 42) carries its search title's English; the entry's own row, which Payload keeps as last published, gets the published ones. Both languages and the sharing picture move. `down` rebuilds the old entry from what was published. Checked on a throwaway database: up, down and up again.
- `src/content/pages/page-entries.ts` lists the entries each page reads, once. `src/content/pages/languages.ts` answers "is page P published in L" from them — `isPublishedIn`, `publishedLocales`, `inEnglish` — through `entryLanguages` in `src/cms/pages.ts`, which shares the per-request read the page itself makes. The Arabic routes (switcher, `hreflang`), the English routes (the notice), the sitemap and `llms.txt` ask it; none builds a page to find out any more.
- **Docs and tests read the list.** `tests/e2e/english-pages.spec.ts` approves each page's entries from it, and its preview test now approves them page by page, fewest entries first, and requires a 200 — so a page reading an entry the list leaves out fails. `docs/deployment.md`'s table is held to the list by `tests/unit/page-entries.spec.ts`.
- The search suite reads each page's entry; its two tests that save drafts moved into `product-text.spec.ts`, which owns the product page's drafts, so two suites never save drafts of one entry side by side. A new test holds that a page published in English without its search title's English is refused, naming the field.

**One change a search engine sees:** a marketing page's `lastModified` in the sitemap is now its own entry's last publication, not the shared entry's; the blog index, legal pages and case studies index carry none, since the shared entry described none of them.

**For the preview and production databases:** production migrates itself on deploy. The preview database needs `npm run cms:migrate` as usual; the move drops the shared entry's tables, so once it has run there, other branches' previews that still read that entry fail until they update from `main`.
