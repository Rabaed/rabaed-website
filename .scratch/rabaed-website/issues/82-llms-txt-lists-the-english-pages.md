# 82: Bug — llms.txt lists none of the English pages

**What is wrong:** `llms.txt` — the summary an AI assistant reads instead of crawling the site (ticket 33) — lists the Arabic pages, articles, case studies and legal documents, and nothing in English. Its own comment says it stays Arabic "until ticket 42 writes the English pages", and ticket 42 is done: the English home page and pages are published on the deployed site. So an assistant asked about Rabaed in English is pointed at Arabic pages only, and the English articles written for exactly those questions (ticket 43) are nowhere in it.

Found by the architecture review of 24 September 2026 (L6).

**Blocked by:** None (can start immediately).

**Status:** resolved — one part of the last criterion is not driven by a test; see below

- [x] Every page published in English is listed at its English address, described in the words its own `<meta name="description">` gives — the English home page among them, since the Arabic home page is the file's heading, not the English one's
- [x] Every article and case study published in English is listed at its English address, described by its summary; the English blog and case studies indexes are listed once they have something to list
- [x] Nothing is listed in English before it is published in English — the same rule the sitemap follows (`src/app/sitemap.ts`), so the file never points an assistant at a notice or a placeholder
- [x] The legal documents stay Arabic only: their Arabic is binding (spec: Out of Scope)
- [x] The English entries are under English headings, after the Arabic, with the company described in English above them
- [x] A test publishes an English page and an English article and finds each in the file, and the article leaves again when it is deleted
- [ ] An English page leaves again when it is unpublished — not driven by a test (below)

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **The fix** is in `src/app/llms.txt/route.ts`. `sections(locale)` builds a language's pages, articles and case studies. The Arabic half is as it was, and the English half follows it after the legal documents. A marketing page is listed in English once `inEnglish` finds it published, the sitemap's rule. The English home page leads the English pages, labelled «Rabaed» because its short name is «Home». The company's English line joins the summary at the top once there is any English.
> - **One step stricter than the sitemap:** an index whose lead is not published in the language is left out, since the file quotes the lead. `getIndexLead` throws for such a language, which would otherwise fail the whole file. The route's comment says so.
> - **Tests**, both red against the code before the fix:
>   - `english-pages.spec.ts` publishes the English start page and holds `llms.txt` to it: under `## Pages in English`, after the Arabic, described word for word as the page's own meta description, with no Arabic in the line. The English company line is present. `/en/product` (unpublished) and every English legal address are absent.
>   - `ai-crawlers.spec.ts` publishes an English article and finds it at `/en/blog/<slug>` under `## Articles in English`, with the English blog index. It is gone again after the article is deleted.
>   - The fixed-list test sets the English entries aside, as it does the case studies.
>   - Both suites pass, 16 tests.
> - **Not driven by a test:**
>   - An English page leaving when it is unpublished. `english-pages.spec.ts` keeps the start page published for the rest of its stage, and the suites beside it share its server; ticket 89 would make this testable.
>   - The English home page's entry. The test database has the English home page as a draft, and publishing it would change `/en` for the suites beside it.
>   - English case studies and their index. They run through the same `section` and index rule as the articles, which are tested.
> - **Code review** (standards and spec, 24 September 2026):
>   - The copy of the sitemap's page list now points at ticket 92, which merges them.
>   - An index's lead is read by the caller's choice, not a flag.
>   - The comment names the one place the file is stricter than the sitemap.
>   - The per-language checks stay spread across `pageEntries`, a judgement call left for ticket 92's registry.
