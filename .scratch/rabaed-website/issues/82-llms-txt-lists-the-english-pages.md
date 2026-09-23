# 82: Bug — llms.txt lists none of the English pages

**What is wrong:** `llms.txt` — the summary an AI assistant reads instead of crawling the site (ticket 33) — lists the Arabic pages, articles, case studies and legal documents, and nothing in English. Its own comment says it stays Arabic "until ticket 42 writes the English pages", and ticket 42 is done: the English home page and pages are published on the deployed site. So an assistant asked about Rabaed in English is pointed at Arabic pages only, and the English articles written for exactly those questions (ticket 43) are nowhere in it.

Found by the architecture review of 24 September 2026 (L6).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Every page published in English is listed at its English address, described in the words its own `<meta name="description">` gives — the English home page among them, since the Arabic home page is the file's heading, not the English one's
- [ ] Every article and case study published in English is listed at its English address, described by its summary; the English blog and case studies indexes are listed once they have something to list
- [ ] Nothing is listed in English before it is published in English — the same rule the sitemap follows (`src/app/sitemap.ts`), so the file never points an assistant at a notice or a placeholder
- [ ] The legal documents stay Arabic only: their Arabic is binding (spec: Out of Scope)
- [ ] The English entries are under English headings, after the Arabic, with the company described in English above them
- [ ] A test publishes an English page and an English article and finds each in the file, and each leaves again when unpublished or deleted

## Comments
