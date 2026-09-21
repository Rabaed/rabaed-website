# 63: A new field on a page's entry breaks every fresh database

**What is wrong:** Adding a field to a page's CMS entry makes an older migration fail on any database built from scratch — the test server's, a preview's, a new deployment's — while production carries on unaffected. The failure is `column "…" does not exist`, pointing at a migration that has not changed and a column it never mentions.

**Blocked by:** nothing.

**Status:** resolved

- [x] A field can be added to any page's entry without an older migration failing on a database built from scratch
- [x] The eight data migrations that seed the page entries are held to what they wrote when they were written, whatever the schema says later: `20260915_040105_import_start_page`, `..._import_product_page_closing_section_and_screen_mocks`, `..._import_tool_page`, `..._import_partnership_page`, `..._import_referral_page`, `..._import_home_page`, `20260920_182914_import_site_words_and_index_leads`, `20260920_204226_import_trust_strip`, `20260920_211936_import_search_settings`
- [x] The whole suite passes against a fresh database, which is the only place this shows
- [x] `docs/deployment.md` says what a data migration may and may not do, so the next one does not reintroduce it
- [ ] Ticket 26's search settings can then move onto the pages they describe, if that is still wanted — **now possible, and not done here**: moving them is a change to where an Editor looks, which is the founder's to want. `import_search_settings` is frozen like the rest, so a fourth field on that entry no longer breaks anything either.

**Not this ticket:** changing what any migration imported. The words stay exactly as they are.

## Comments

**Why it happens.** A data migration that writes through Payload's local API — `payload.updateGlobal({ slug: 'home-page', … })` — builds its statement from the schema the code declares *today*, not the schema as of that migration. Add a column to `home_page` and `import_home_page` selects it, though the database at that point in its history has not got it yet. Production never notices: it applied the migration before the column existed, and migrations do not run twice.

**Where it has bitten so far.** Ticket 33 hit it on site settings and went round it by giving its one field a global of its own. Ticket 26 hit it on all six page entries and went round it the same way, with the founder's agreement on 20 September 2026: its search settings are one entry of their own rather than three fields on each page. That is twice now, and the workaround costs an Editor a second place to look.

**The likely fix**, to be confirmed while building: write the seeding as raw SQL naming the columns that existed when the migration was written, as the schema migrations beside them already do. The words themselves are already frozen in `src/migrations/*-import/words.ts` and do not move. The home page's entry is the hard one — several nested list tables, each needing its rows and its version rows — so a helper that turns a frozen entry into `INSERT` statements is likely worth more than eight hand-written migrations.

**Ticket 26's own migration is on the list.** It seeds the search settings the same way, so a fourth field on that entry would break fresh databases exactly as a field on a page's entry does today. Going round the trap did not avoid laying it again — which is the argument for fixing it rather than going round it a third time.

**How to know it is fixed:** add a scratch field to a page global, run the suite against a fresh database (`TEST_PORT=3163 npx playwright test`), and watch it pass; then take the field out again.


**What was built.** Each of the nine imports now executes frozen SQL — `INSERT` statements naming the columns its tables had at that point in the chain — instead of calling `payload.updateGlobal`. The statements are in a generated `seed.ts` beside the words each import already had; the words themselves did not move, and nothing about what was imported changed.

Nobody wrote those statements by hand. `npm run cms:freeze-seed` (`scripts/freeze-seed.ts`) starts an empty database, replays the migrations one at a time, and around each import records every table that gained rows — the version tables and the nested lists included — writing them out as SQL. The home page's entry, the one the ticket called the hard one, came out as 135 statements across 26 tables without anybody counting them.

Two things it does rather than dump literally: a timestamp column is written `now()`, so a fresh database still dates its first version the day it was built; and the Trust strip's marks are found by the file name they were stored under rather than by the id of that moment, because the **upload** is the one part no `INSERT` can stand in for — the mark has to be converted and written to storage, so it goes on being created through Payload.

**How it was checked.**

1. The failure first, on a database built from scratch: a scratch field on the start page's hero, `npm run cms:migrate-fresh`, and `column _start_page_v.version_hero_scratch_field63_ar does not exist` from `import_start_page` — the ticket's account exactly.
2. The same scratch field, plus a fourth field on every one of the search settings' six page tabs, against the frozen imports: green.
3. **Round trip.** With the imports frozen, running the freezer again dumps what the frozen SQL inserted. All nine files came back byte for byte identical, so the SQL writes precisely what the local API wrote.
4. `npm run cms:migrate-fresh` green, and the whole suite green against the fresh database the test server builds.

**What is not fixed.** Seven data migrations still seed through Payload: the site settings, the three forms' wording, the legal documents, the FAQs and the launch articles. They are the same trap, still set — a field added to Posts, which ticket 43's English blog is likely to want, would stop a fresh database at `import_launch_articles`. They are ticket 64, and `tests/unit/data-migrations.spec.ts` names all seven exactly, so a new one fails the suite and converting one of these without striking it off fails too.

**A fast way to see it.** `npm run cms:migrate-fresh` migrates a throwaway database from nothing in about thirty seconds. The whole suite says the same thing in minutes, because the test server builds a fresh database too — but this is the loop to work in.
