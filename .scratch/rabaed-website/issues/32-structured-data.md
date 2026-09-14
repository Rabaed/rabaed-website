# 32: Structured data

**What to build:** The machine-readable description of Rabaed that lets Google and AI assistants quote the site accurately instead of guessing.

**Blocked by:** 31, 22

**Status:** ready-for-agent

- [ ] Organisation data on every page, including the unified number and the real social accounts
- [ ] Software application data on the Home and Product pages
- [ ] FAQ data generated verbatim from the visible FAQ text — rewording it would be a mismatch
- [ ] Breadcrumb data on inner pages; website data on the homepage; article data on blog posts
- [ ] **No ratings and no offers are emitted**, because no genuine ones exist
- [ ] All structured data passes schema validation, and the test asserts the FAQ data matches the visible text

## Comments

**From ticket 22 (14 September 2026).** Build the FAQ data from the entries a page's Questions section is handed — `pageQuestions` in `src/cms/faqs.ts`, through `withQuestions` — with `plainText` from `src/components/inline-text.tsx`. Never from the `answer` field as the CMS stores it: that holds backticks around Latin names and `{payout}` where the page shows the amount, so it would disagree with what a visitor reads.
