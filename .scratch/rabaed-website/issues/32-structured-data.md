# 32: Structured data

**What to build:** The machine-readable description of Rabaed that lets Google and AI assistants quote the site accurately instead of guessing.

**Blocked by:** 31, 22

**Status:** resolved

- [x] Organisation data on every page, including the unified number and the real social accounts
- [x] Software application data on the Home and Product pages
- [x] FAQ data generated verbatim from the visible FAQ text — rewording it would be a mismatch
- [x] Breadcrumb data on inner pages; website data on the homepage; article data on blog posts
- [x] **No ratings and no offers are emitted**, because no genuine ones exist
- [x] All structured data passes schema validation, and the test asserts the FAQ data matches the visible text

## Comments

**From ticket 22 (14 September 2026).** Build the FAQ data from the entries a page's Questions section is handed — `pageQuestions` in `src/cms/faqs.ts`, through `withQuestions` — with `plainText` from `src/components/inline-text.tsx`. Never from the `answer` field as the CMS stores it: that holds backticks around Latin names and `{payout}` where the page shows the amount, so it would disagree with what a visitor reads.

**What was built (15 September 2026).** Every kind of structured data is built in one place, `src/components/structured-data.tsx`, typed against schema.org with `schema-dts`, so a property schema.org does not define fails the typecheck. Each page renders what it carries through `<StructuredData>`, which escapes `<` so no CMS text can close the script tag.

- **Organisation** on every page of both locales, from `SiteDocument`: the names, legal name and unified number from `src/content/company.ts`, and the email, phone and social accounts as *published* in site settings. An account nobody has supplied is left out, where the footer shows `#`; none is supplied yet, and `cms.spec.ts` publishes one and checks it reaches the data. The unified number is an `identifier`, not the `taxID` the handoff's draft used: it is the establishment's national number, not a tax number (ADR-0009).
- **Software application** on the home and product pages; **website** on the home page; **FAQ** on the five pages with questions, left out when the section is hidden or empty; **breadcrumbs** on every inner page — the pages in `tests/e2e/routes.ts`, the blog's later pages, articles, and the case studies index and pages; **article** (`BlogPosting`) on blog posts, its description the answer-first opening paragraph.
- No ratings, reviews or offers anywhere; the test scans every page for them.
- `tests/e2e/structured-data.spec.ts` and `structured-data.ts` check it from each page's first response: parses, has the schema.org context and a type, carries what each type requires, and the FAQ data equals the visible questions and answers word for word. `blog.spec.ts` checks an article's.

**Left for later.** Case study pages carry breadcrumbs but no article data: the ticket names article data for blog posts. A page's breadcrumb name is `meta.name` in its content module (`'المنتج'`, `'ابدأ'` …), beside its search title, so it moves into the CMS with the page (tickets 54–58). It repeats the page's menu label rather than reading it from the navigation, which ticket 59 moves separately. The offline checks cover what each type must carry, not everything a validator checks; the live check is ticket 39's.
