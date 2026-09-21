# 64: Seven more data migrations still seed through Payload

**What is wrong:** Ticket 63 stopped a field added to a page's entry from breaking every database built from scratch, by freezing the nine imports that seed the page entries as SQL. Seven data migrations were left as they were, and each still carries the same trap: the day a field is added to what one of them seeds, an untouched migration starts naming a column the database has not reached yet, and every fresh database — the test server's, a preview's, a new deployment's — stops there with `column … does not exist`.

**Blocked by:** nothing. Ticket 63 is resolved, and built the tool this needs.

**Status:** needs-triage

- [ ] `20260913_191346_publish_contact_points` — the site settings
- [ ] `20260914_061635_import_legal_documents` — the Terms, the Privacy Policy and the Referral Terms
- [ ] `20260914_193520_import_faq_entries` — the 31 questions
- [ ] `20260914_194144_publish_demo_request_wording` — the demo request form's words
- [ ] `20260914_222809_publish_referral_signup_wording` — the Referral Program signup's words
- [ ] `20260920_170917_publish_partnership_application_wording` — the partnership application's words
- [ ] `20260921_101500_import_launch_articles` — the six launch articles and their covers
- [ ] `tests/unit/data-migrations.spec.ts` has an empty `PREDATING` list, and the rule it holds has no exception left but the upload
- [ ] The whole suite passes against a fresh database

**Not this ticket:** changing what any migration imported. The words, the documents and the articles stay exactly as they are — the round trip in ticket 63 is how that is shown: freeze, then freeze again, and the file comes back identical.

## Comments

**How much of it is already done.** `npm run cms:freeze-seed` does the work: add a migration to `IMPORTS` in `scripts/freeze-seed.ts`, run it, and it writes the statements out beside the words. `npm run cms:migrate-fresh` says in about thirty seconds whether the chain still runs on a database built from scratch. `docs/deployment.md` describes both under "What a data migration may and may not do".

**Where it will need thought, rather than the tool.**

- **The four that hold their words inline.** `publish_contact_points` and the three form wordings have their Arabic written out in the migration itself, not in a frozen module beside it. Freezing them moves the words into generated SQL, where nobody can read them. Each wants its words lifted into a `words.ts` of its own first, as the nine have, so that the readable record survives — and so that the test holding the frozen SQL to the frozen words covers them too.
- **The legal documents are dated on purpose.** `import_legal_documents` sets every timestamp to 1 September 2026, the day the approved text carries, with an `UPDATE` after the import. The freezer writes a timestamp column as `now()`, which is right for the other eight and wrong for this one: it needs its dates kept, which is a setting the freezer does not have yet.
- **The launch articles upload their covers.** Like the Trust strip's marks, those stay `payload.create`, and the rows that point at them are found by file name. `import_launch_articles` also creates the posts as drafts, and its `down` reads them back through Payload to delete the covers with their files — that part is a rollback and stays.

**Why it is worth doing rather than waiting for it to bite.** Ticket 43 writes the English blog and the English case studies, and ticket 42 the English pages: a field added to Posts, to the FAQs or to the legal documents is the likely shape of all three. Each would stop every fresh database at a migration nobody touched, with an error pointing at a column that migration never mentions — which is exactly the half-day ticket 63 spent working out the first time.
