# 22: FAQs in the CMS

**What to build:** Ahmed adds, edits, reorders and removes FAQ entries on any page that has them, and the structured data follows automatically.

**Blocked by:** 19, 11, 52

**Status:** resolved

- [x] FAQ entries are grouped by the page they appear on: Home, Start, Referral, Partnership and Tool
- [x] All 31 existing entries are migrated verbatim from the Reference site
- [x] Entries render as native disclosure elements so the answers stay readable to search engines and AI
- [x] Reordering and hiding work from the admin
- [x] The visible answer text and the structured data are generated from the same source, so they can never drift apart
- [x] One Questions section serves every page with FAQs, given the page's group and its heading; the five page-specific wrappers (`home/`, `referral/`, `tool/`, `start/` and `partnership/questions.tsx`) go, and the start page's questions-beside-the-form layout becomes a variant of it

## Comments

**Added on 13 September 2026** from the architecture review. `Faq` already had a small interface, but four wrappers copied the section and heading markup around it — five once ticket 16 added the partnership page's — the tool page through `TeaserHead` in `tool/parts.tsx`, the others inline. Collapsing them gives this ticket and ticket 32 one module to change. **Blocked by 52**, which gives each page one content module; the Questions section then receives its entries rather than importing them.

**Resolved (14 September 2026).** FAQs are the `faq-entries` collection (`src/cms/collections/faq-entries.ts`): one entry per question per language, on one of the five pages (`src/cms/faq-pages.ts`), imported by the migration `20260914_193520_import_faq_entries` from the frozen `src/migrations/faq-import/entries.ts`. Each page module adds its page's questions with `pageQuestions` (`src/cms/faqs.ts`) and hands them to the one `Questions` section (`src/components/questions.tsx`). Decided here, rather than asked for:

- **Like an article, a question is saved as a draft, previewed and published.** Order is dragged in the admin's list (Payload's `orderable`). Hiding is a **Shows on the page** tick box that keeps the question's words and place, and can be previewed before it is published; unpublishing and deleting also take a question off its page.
- **Answers are plain text with two marks**, because a textarea cannot show formatting and rich text would be more than an answer needs: a Latin file name between backticks is set left to right in DM Mono, and `{payout}` / `{clientDiscount}` insert the Referral Program values, so ticket 52's "held once" still holds for the referral page's answer. An answer naming an unknown value or leaving a backtick open is refused. `answerText` turns an answer into what the page draws; ticket 32 builds its FAQ structured data from the same entries with `plainText`.
- **Limits:** a question 160 characters, an answer 800 — several times the longest the Reference site has.
- **A page whose questions are all hidden** leaves its row of cards out rather than drawing a heading over nothing. The start page's section stays, because links land on it and its form stands in it.
- **The Questions section's markup:** the home page's heading lost a wrapper `div` that had no style of its own; every other page's HTML is unchanged. The home page keeps its section id `fq`, and no rule across its top.
- **Tests:** `tests/e2e/faqs.spec.ts` publishes only an addition to the end of one referral answer, which no other suite can notice. Everything else it adds, hides, reorders or removes stays a draft and is checked in the editor's preview, because every page's words and pictures are being checked by other suites at the same moment.
