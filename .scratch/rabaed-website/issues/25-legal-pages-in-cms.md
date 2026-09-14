# 25: Legal pages in the CMS

**What to build:** Ahmed enters the company lawyer's changes to the Terms, Privacy Policy and Referral Terms himself — the lawyer never logs in — and every version is kept with its date and author, so the company can prove what its terms said on any given day.

**Blocked by:** 19, 17

**Status:** resolved

- [x] The three legal documents are imported verbatim, typos included, as the first version (ADR-0003)
- [x] Every edit creates a retained version recording who changed it and when; earlier versions can be viewed and restored
- [x] Publishing a legal change is an explicit action, never an automatic save
- [x] Every Editor can edit legal text, and each version records which Editor published it (ADR-0007 replaces the earlier owner-only rule)
- [x] The last-updated date shown on the page comes from the published version
- [x] The `.docx` files stay in the repository as the pre-launch archive and are no longer edited

## Comments

**What was built.**

- **A `legal-documents` collection** (`src/cms/collections/legal-documents.ts`) with exactly three entries — Terms, Privacy Policy, Referral Program Terms — each holding the title, the line under it, the search title and description, the introduction, the clauses (heading, whether the contents list names it, text, contact box) and the see-also line. Nobody can add, delete or unpublish one: each is a page of the site, and a page always has a published version to show.
- **Rich text in Payload's Lexical editor**, limited to what the documents use: paragraphs, bulleted lists, bold and links, with a "written left to right" option on a link for a phone number written with spaces. `@payloadcms/richtext-lexical` is added, pinned to 3.89.0 like the rest of Payload. The page draws the saved text with its own small renderer (`src/components/legal-document.tsx`), producing the same markup as before, so the pages look as they did.
- **Versions.** Drafts, no autosave, and `maxPerDoc: 0` — every version is kept. Save Draft keeps an edit, Preview shows it on the page, only Publish changes reaches visitors. Each version records its Editor in `editedBy`, written out as name and email rather than linked to the account, so the record outlives a removed account; whatever a request sends there is replaced by the signed-in Editor. When is Payload's own `updatedAt`. Restoring a version is itself a new version, recorded as the restoring Editor's.
- **The import.** A schema migration, then a data migration that creates the three documents from the approved text in `src/migrations/legal-import/` — moved from `src/content/legal/` and frozen: the site no longer reads it. The first versions are recorded as «استيراد النص المعتمد قبل الإطلاق» and dated 1 September 2026, the date the approved text and its pages already gave, not the day the migration runs.
- **The date on the page** is the published version's `updatedAt`, in Riyadh. The first version an Editor publishes is dated the day it is published.
- **Pages stay prerendered.** Publishing a document marks its own page stale; a saved draft changes nothing.
- `docs/deployment.md` has a "Legal documents" section in plain language.

**Every Editor (ADR-0007).** No restriction was built; `src/cms/access.ts` no longer promises one.

**Not in this ticket:** the warning when the Referral Terms do not state the Referral Program values (ADR-0008) is ticket 56's (split from ticket 21), which is blocked by this one.

**Tests** (`tests/e2e/cms.spec.ts`, "legal documents"):

- each document has exactly one version, published, by the import, dated 1 September 2026, and its page says so;
- an edit typed into a clause in the admin and saved is not on the page, and is in the preview;
- publishing reaches the page, which is then dated today, and the version records the Editor;
- unpublishing, deleting and creating a document are refused;
- a saved edit and a restore of the imported version are each a new version recording the Editor, the imported version opens in the admin, every earlier version remains, and visitors saw none of it.

`legal-pages.spec.ts` still holds the pages to the Word documents and Reference pages word for word. In the test database that is the imported version, so it is now the check that the import was verbatim.

**Tests that publish, beside tests that read the words.** A publish changes a page's date, and the word-for-word suites run at the same time against the same server. Playwright project dependencies were considered for running the CMS tests last, and rejected: under `--shard` a dependency project runs whole on every machine that needs it, which would run most of the suite twice. Instead the CMS tests publish only a search description, which nothing else reads, save clause edits only as drafts, and check the imported date first, before anything publishes; `legal-pages.spec.ts` no longer compares the date line.

**A Payload behaviour the tests ran into.** A restored version's `createdAt` is copied from the document, so for the imported documents it is 1 September 2026. Versions are ordered by `updatedAt`, as the admin's Versions list is.

**Verified by falsification.** Each guard was broken on purpose and `cms.spec.ts` run against the build.

1. **Pages always reading drafts, the unpublish guard removed, and the page dated by `createdAt`** — three tests failed, each on its break: the unpublish test (the unpublish answered 200), the publish test (the page still said 1 September after publishing), and the import test (a page reading the draft was dated by the version's own copy of the document's timestamps, which the import had not backdated).
   - That last failure was a real bug, not only the break: an Editor previewing an imported document would have seen the day the migration ran. The import now backdates those copies too.
   - The draft test did **not** fail with pages reading drafts. Nothing rebuilds a page after a draft alone is saved, so a draft never reaches a prerendered page, whichever version it reads — the trap ticket 19 recorded. The publish test now saves a draft straight after publishing, before the page is rebuilt, and checks the rebuilt page shows what is published.
2. **Autosave switched on** could not be tried: autosave needs a column the migrations do not create, so the import itself fails. Autosave cannot arrive by a configuration change alone; it would take a migration, which a review would see.
3. **The signed-in Editor not recorded** — exactly the publish test and the restore test failed, each finding the import's «استيراد النص المعتمد قبل الإطلاق» where the Editor's address should be.
4. **Pages always reading drafts**, again, with the strengthened publish test and the import's timestamps fixed — exactly the publish test failed, finding the draft's «— مسودة بعد النشر» on the rebuilt Privacy Policy. The import test now held.
5. **Publishing no longer refreshing the page** — exactly the publish test failed, the Privacy Policy still carrying its old search description.

**What the standards review changed.**

- **A list typed into the see-also line would have vanished.** That line is drawn as one run of text, and only its paragraphs were read. Each list item is now a line too.
- **Comments that had gone stale.** `SKIP_REVALIDATION` was described as site settings' alone; the legal documents use it too. The renderer's inline drawing now says it handles line breaks as well, and draws anything else as the words inside it.
- **Test helpers.** The "newest published version" filter was written twice; it is `latestPublishedVersion` in `tests/e2e/cms.ts`, and versions have a `LegalVersion` type instead of inline annotations. The restore test's `terms` variable held the Referral Terms; it is `referralTerms`.

Checked and left:

- **The version tests read Payload's versions API.** The spec asks tests not to assert CMS implementation details. The versions API is the running application's record of who changed what and when — the thing this ticket exists to keep — and the admin's Versions list shows the same facts in a table the tests could only scrape. The admin is still driven for what an Editor does by hand: typing an edit, Save Draft, Preview, Publish changes, opening an old version.
- **The legal documents' refresh-on-publish hook** has the shape of site settings'. Each refreshes different pages; one shared helper would be two lines.

**What the spec review changed.**

- **Restoring a draft could have put it on the site unpublished.** The admin offers a draft version only a plain restore, and a plain restore copies the version, draft status and all, onto the document itself. The page read the document, so its next rebuild would have shown the draft's text with nobody having published it. Visitors' pages now read the **newest published version from the history**, never the document, so only Publish changes what they see, and the date shown is that version's own. The restore test now restores the draft itself, forces every page to rebuild, and checks the published text is still what visitors get. Verified by putting the old reading back: exactly that test failed, finding the draft's «— عنوان معدّل» on the rebuilt Referral Terms.
- `docs/deployment.md` says what a restore does: a restored draft is a draft; a published version restored straight away is published again.

Checked and left:

- **The date while previewing** is the day the draft was saved, not a published date — there is none yet for a draft. A preview banner already says the page is not what visitors see.
- **More than the words is editable** — the search title and description, the line under the title, whether a clause is in the contents — and the renderer handles line breaks, new-tab links and unsafe addresses. All of it follows from what the editor allows; none of it reaches visitors except through Publish.

**Merged with `main`** while the pull request waited, after ticket 52 (one content module per page) and ticket 23 (the blog) landed:

- **The migrations run after the blog's.** The legal schema migration was generated again on top of the blog's, as `20260914_061634_legal_documents`, followed by `20260914_061635_import_legal_documents`, so each migration's snapshot of the tables holds everything before it. The earlier pair had run on no shared database.
- **Publishing a legal document rebuilds the whole site** through `main`'s `refreshSite`, as the blog and site settings now do, instead of the document's page alone. The sitemap lists the legal pages, and it is refreshed with them.
- **The date** is drawn by `main`'s shared `ArabicDate` from `riyadhDay`, fed the published version's timestamp.
- **The full suite passed on the merged code**, 747 tests with the blog's, on `TEST_PORT=3225`.

**The full suite** passed, 728 tests, on the final code after both reviews' changes, on `TEST_PORT=3225` rather than this ticket's 3125: an earlier run's database left port 5125 listed as listening under a process that no longer exists, and a new database refused to start there.

The unpublish, delete and create refusals, and keeping every version (`maxPerDoc: 0`), are not broken on purpose here beyond the first build: a retention limit of Payload's default 100 would only show after a hundred saves.
