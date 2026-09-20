# 63: A new field on a page's entry breaks every fresh database

**What is wrong:** Adding a field to a page's CMS entry makes an older migration fail on any database built from scratch — the test server's, a preview's, a new deployment's — while production carries on unaffected. The failure is `column "…" does not exist`, pointing at a migration that has not changed and a column it never mentions.

**Blocked by:** nothing.

**Status:** ready-for-agent

- [ ] A field can be added to any page's entry without an older migration failing on a database built from scratch
- [ ] The eight data migrations that seed the page entries are held to what they wrote when they were written, whatever the schema says later: `20260915_040105_import_start_page`, `..._import_product_page_closing_section_and_screen_mocks`, `..._import_tool_page`, `..._import_partnership_page`, `..._import_referral_page`, `..._import_home_page`, `20260920_182914_import_site_words_and_index_leads`, `20260920_204226_import_trust_strip`
- [ ] The whole suite passes against a fresh database, which is the only place this shows
- [ ] `docs/deployment.md` says what a data migration may and may not do, so the next one does not reintroduce it
- [ ] Ticket 26's search settings can then move onto the pages they describe, if that is still wanted

**Not this ticket:** changing what any migration imported. The words stay exactly as they are.

## Comments

**Why it happens.** A data migration that writes through Payload's local API — `payload.updateGlobal({ slug: 'home-page', … })` — builds its statement from the schema the code declares *today*, not the schema as of that migration. Add a column to `home_page` and `import_home_page` selects it, though the database at that point in its history has not got it yet. Production never notices: it applied the migration before the column existed, and migrations do not run twice.

**Where it has bitten so far.** Ticket 33 hit it on site settings and went round it by giving its one field a global of its own. Ticket 26 hit it on all six page entries and went round it the same way, with the founder's agreement on 20 September 2026: its search settings are one entry of their own rather than three fields on each page. That is twice now, and the workaround costs an Editor a second place to look.

**The likely fix**, to be confirmed while building: write the seeding as raw SQL naming the columns that existed when the migration was written, as the schema migrations beside them already do. The words themselves are already frozen in `src/migrations/*-import/words.ts` and do not move. The home page's entry is the hard one — several nested list tables, each needing its rows and its version rows — so a helper that turns a frozen entry into `INSERT` statements is likely worth more than eight hand-written migrations.

**How to know it is fixed:** add a scratch field to a page global, run the suite against a fresh database (`TEST_PORT=3163 npx playwright test`), and watch it pass; then take the field out again.
