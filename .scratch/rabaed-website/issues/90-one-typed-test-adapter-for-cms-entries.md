# 90: One typed test adapter for reading, editing and restoring CMS entries

**What to build:** one module the page-text suites use to read an entry, save a draft, publish, preview, and put the published version back when the test ends — typed from `src/payload-types.ts` — in place of the copies each suite carries.

**Why:** `tests/e2e/cms.ts` (653 lines, 31 changes in six weeks) is a set of constants and one-off helpers, and the real operations are rewritten in each suite: `discardDraft` in 9 of them, `save` in 9, `published` and `fields` in 10, `preview` in 10 (`home-text`, `page-text`, `product-text`, `site-words`, `tool-page-text`, `referral-page-text`, `partnership-page-text`, `trust-strip`, `search-settings`, `stale-render`). Each suite types its entry's shape by hand (`HomeEntry`, `home-text.spec.ts:30-54`), so a schema change breaks at run time, in ten places, rather than at compile time. Payload's admin internals leak into the helper too (`_index-1`, `tabs-field__tab-button--active`, `payload-preferences`, `cms.ts:307-351`). And each ticket adds a hard-coded test account: 20 today (`cms.ts:18-190`).

Found by the architecture review of 24 September 2026 (A7).

**Blocked by:** None. Easier after 89, which removes some of the rules this works around, but not blocked by it.

**Status:** resolved

- [x] One adapter — `entry('home-page', …)` or similar — reads, saves as a draft, publishes, previews, and restores the published version automatically when the test ends, pass or fail
- [x] Its types come from `payload-types.ts`: a renamed field fails `npm run typecheck`, not a test run
- [x] The ten suites use it, and their local copies are deleted
- [x] Test accounts are made per suite from its file name, not listed by hand; the lost-session retry (`readerGet` in `tests/e2e/forms.ts`, and ticket 81's `publishSettings`) lives in the adapter, once
- [x] The admin-tab workaround moves behind the adapter
- [x] The full suite is green with no test's intent changed; the ticket lists any assertion that had to move

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **One adapter.** `tests/e2e/entries.ts` gives a test `cms`, a Playwright fixture:
>   - `cms.entry('home-page')` reads what is published, saves a draft, publishes, sends an entry the CMS is to refuse (`attempt`), lists the kept drafts and makes one the draft;
>   - `cms.preview(path)` opens the preview, and the fixture leaves it when the test ends.
>
>   When the test ends, pass or fail, each entry is put back. If what is published differs from what the test first read, that is published again. Otherwise, a draft the test saved is replaced by that same entry saved as the draft. It compares what is published rather than tracking the adapter's own saves, so a change published through the admin's own form (the start page's last test) is put back too.
>
>   `tests/e2e/entries.spec.ts` proves this on the second server. Tests marked to fail save a draft, publish through the adapter and publish around it; the test after each checks the entry is as it was, and that the change had really been made. It was checked red: with the put-back switched off, both checks failed.
> - **Types from `payload-types.ts`.** `Entry<'home-page'>` is the global's type with Payload's ids, dates and related documents (held as ids at depth 0) taken off. The suites' hand-written entry types are gone: each names its rows from it (`Entry<'home-page'>['situations']['situations'][number]`). `entries.spec.ts` holds a `@ts-expect-error` on a field the CMS does not have, so `npm run typecheck` fails if a made-up field is ever accepted. The refusal lists are typed as the entry too, product-text's per entry (`sending('closing-section', …)`).
> - **The ten suites** use it. Their `published`, `fields`, `save`, `discardDraft`, `preview`, the `afterEach` that left the preview, and their `try/finally` put-backs are deleted. From 4,522 lines to 3,601; `cms.ts` from 658 to 387.
> - **Accounts.** `tests/e2e/editors.ts`: a suite signs in as `<file name>-<worker>@rabaed.test` (`home-text-2@…`). Nobody lists them. The test server creates one account, the keyholder, which invites each on its first sign-in. One per worker as well as per suite means a suite's tests running side by side never share an account, which is what made sessions go missing (`form-submission`'s reader and editors did). The 23 hand-listed accounts are gone, and the test server starts with one `payload run` instead of 23.
>
>   The lost-session retry is `signedIn(request)`, once. The adapter, `readerGet`/`readerDelete` (`forms.ts`) and `publishDemoSettings` (`demo-request-api.ts`) all go through it, and it also signs in a context that never had a session. `DemoSettings` is typed from the schema too.
> - **The admin-tab workaround** is `cms.openInAdmin(slug)`, returning the section tabs' `openSection` and `expectSectionOpen`. `_index-1`, the tab classes and `payload-preferences` are now only in `entries.ts`.
> - **The full suite**, locally on 3190 with no other checkout's suite running: 1337 passed in 4.5 minutes. The run before it had 1336 passed and 1 failed, from a race this change did not cause (below).
>
> **What had to move.** No assertion was dropped or weakened. What changed:
> - **Optional words.** The schema says four words are optional that the hand types called required. `?.` is added on the units' and parties' opening paragraphs, which the tests assert are empty. `!` is added on `termsSummary.points[7].bold`, `audience.partnership.bold` and `privacy.tree.entries[0].description`, which are in the list of words the page must show.
> - **site-words' swipe-hint draft** sent `screenMocks: { swipeHint }` alone, leaving out the other three words of that group. The types refused it; it now sends the group with the hint reworded.
> - **Put back at the test's end.** The put-back now happens when the test ends rather than in `finally`. Where order mattered it is still explicit:
>   - trust-strip and search-settings put the draft back before deleting the picture it points at;
>   - product-text's English-descriptions test puts the entry back before asserting it is back.
> - **`screen-mock-phone.ts`'s `expectPhoneCrop`** now waits after Escape until the closed screen's history step is gone. Closing calls `history.back()`, which lands after the dialog hides, and a `page.goto` in that moment was cut short (`net::ERR_ABORTED`). Without the wait, product-text's Phone crop test failed 2 runs in 4 on one worker; with it, 0 in 4.
>
> **Found on the way:**
> - **A draft race, not caused here.** The first full run's one failure was product-text's Phone crop preview showing site-words' draft swipe hint. The preview draws every entry's draft, and the two suites run side by side. The same draft and check are on `main`. It is left to a follow-up task.
> - **Discarding a draft by restoring the newest published version, as the suites did, trusts the entry's history, and that history can mislead.** It blanked the English partnership form's settings here, because that global's oldest published version is an empty one. On CI it failed the adapter's own suite: `english-pages` had just published the closing section's English, and the version found by date was an older one, without it. The adapter therefore saves what the test first read as the draft. Reproduced locally by running `english-pages` then `entries` on one worker: red with the history restore, green with this.
> - **`GET /api/preview/exit` answers 405.** The suites' `afterEach` never actually left the preview, and neither does the fixture, which does the same. Harmless, since each test's page is new.
>
> **Merged with `main` after ticket 91** (25 September 2026). Search settings are each page's own now. `search-settings.spec.ts` was taken as ticket 91 wrote it and moved onto the adapter. So were ticket 91's two draft tests now in `product-text.spec.ts`: the search title, and the sharing picture, whose draft is put back before its picture is deleted. `english-pages.spec.ts` and `page-text.spec.ts` kept ticket 91's side; the schema types already carry the new `search` group.
>
> **Code review** (standards and spec, 24 September 2026). Taken:
> - The spec review's one bug: an entry re-read after a change published outside the adapter took the changed entry as the one to put back, so the start page was left with its reworded paragraph. It now keeps the first read, and `entries.spec.ts` checks this case.
> - product-text's refusals are typed.
> - `restore` fails in words when there is no published version.
> - `invite` reports a failure other than "already exists".
> - The step that makes a version the draft is written once.
> - A stale doc comment on `withEveryScreenReplaced` is corrected.
>
> Left as they are: the duplicated `Words`/`arabic` lines in the eight suites (each names a different path, and they read locally); and `cms.openInAdmin` delegating to `AdminEntry.open`.

