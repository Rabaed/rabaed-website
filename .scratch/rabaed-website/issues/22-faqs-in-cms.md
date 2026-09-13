# 22: FAQs in the CMS

**What to build:** Ahmed adds, edits, reorders and removes FAQ entries on any page that has them, and the structured data follows automatically.

**Blocked by:** 19, 11, 52

**Status:** ready-for-agent

- [ ] FAQ entries are grouped by the page they appear on: Home, Start, Referral, Partnership and Tool
- [ ] All 31 existing entries are migrated verbatim from the Reference site
- [ ] Entries render as native disclosure elements so the answers stay readable to search engines and AI
- [ ] Reordering and hiding work from the admin
- [ ] The visible answer text and the structured data are generated from the same source, so they can never drift apart
- [ ] One Questions section serves every page with FAQs, given the page's group and its heading; the five page-specific wrappers (`home/`, `referral/`, `tool/`, `start/` and `partnership/questions.tsx`) go, and the start page's questions-beside-the-form layout becomes a variant of it

## Comments

**Added on 13 September 2026** from the architecture review. `Faq` already had a small interface, but four wrappers copied the section and heading markup around it — five once ticket 16 added the partnership page's — the tool page through `TeaserHead` in `tool/parts.tsx`, the others inline. Collapsing them gives this ticket and ticket 32 one module to change. **Blocked by 52**, which gives each page one content module; the Questions section then receives its entries rather than importing them.
