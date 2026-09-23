# 90: One typed test adapter for reading, editing and restoring CMS entries

**What to build:** one module the page-text suites use to read an entry, save a draft, publish, preview, and put the published version back when the test ends — typed from `src/payload-types.ts` — in place of the copies each suite carries.

**Why:** `tests/e2e/cms.ts` (653 lines, 31 changes in six weeks) is a set of constants and one-off helpers, and the real operations are rewritten in each suite: `discardDraft` in 9 of them, `save` in 9, `published` and `fields` in 10, `preview` in 10 (`home-text`, `page-text`, `product-text`, `site-words`, `tool-page-text`, `referral-page-text`, `partnership-page-text`, `trust-strip`, `search-settings`, `stale-render`). Each suite types its entry's shape by hand (`HomeEntry`, `home-text.spec.ts:30-54`), so a schema change breaks at run time, in ten places, rather than at compile time. Payload's admin internals leak into the helper too (`_index-1`, `tabs-field__tab-button--active`, `payload-preferences`, `cms.ts:307-351`). And each ticket adds a hard-coded test account: 20 today (`cms.ts:18-190`).

Found by the architecture review of 24 September 2026 (A7).

**Blocked by:** None. Easier after 89, which removes some of the rules this works around, but not blocked by it.

**Status:** ready-for-agent

- [ ] One adapter — `entry('home-page', …)` or similar — reads, saves as a draft, publishes, previews, and restores the published version automatically when the test ends, pass or fail
- [ ] Its types come from `payload-types.ts`: a renamed field fails `npm run typecheck`, not a test run
- [ ] The ten suites use it, and their local copies are deleted
- [ ] Test accounts are made per suite from its file name, not listed by hand; the lost-session retry (`readerGet` in `tests/e2e/forms.ts`, and ticket 81's `publishSettings`) lives in the adapter, once
- [ ] The admin-tab workaround moves behind the adapter
- [ ] The full suite is green with no test's intent changed; the ticket lists any assertion that had to move
