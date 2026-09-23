# 97: Adding one field of words takes a schema change, not a seed migration as well

**What to build:** the code's own words become a words field's default and its fallback, so that adding a field of words to a page needs only its schema migration. Seed migrations remain for content with no home in code: the legal text, the articles.

**Why:** one new field of words costs about 20 files today. The swipe hint (8e68acc, ticket 77) and the Footer directory (b056e70, ticket 75) each touched 20. About 8 of those are plumbing:
- a schema migration, and a second migration to publish the words;
- `seed.ts` and `words.ts` in a `*-import` folder;
- a line in `src/migrations/index.ts`;
- a 35,000-line snapshot;
- `payload-types.ts`;
- a new entry in `tests/unit/data-migrations.spec.ts`'s hand-kept list of about 40 imports.

The seed exists only so that a required field is not empty. `src/forms/settings.ts` already falls back to the code's own words when the CMS has none, so the pattern is proven in this repo. Tickets 63 and 68 exist only to repair seeds written through Payload, which broke any database built from scratch.

Found by the architecture review of 24 September 2026 (A6).

**Blocked by:** 88 (the migration command, which this would change again).

**Status:** needs-triage — speculative. It turns on how Payload applies a field's default to a global row that already exists, which nobody has checked. And it narrows ticket 63's frozen-seed rule, so it needs an ADR, or a later session will "restore" the seeds

- [ ] A spike answers, on a real database, whether a new field with a default appears filled on an existing, published global — in both languages, and in the admin as well as on the site
- [ ] If it does: one field of words is added this way end to end, as the proof, and an ADR records the narrowed rule
- [ ] If it does not: the ticket records why, and is closed `wontfix`, so the next review does not suggest it again
