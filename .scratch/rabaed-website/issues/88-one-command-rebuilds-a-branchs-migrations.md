# 88: One command rebuilds a branch's migrations after a merge, and CI catches a schema that drifted

**What to build:** the procedure every CMS ticket follows after merging `main` — today three paragraphs of prose in `docs/agents/parallel-sessions.md`, which pull in opposite directions — as one command, plus a CI check that fails when the configuration and the migrations disagree.

**Why:** in the repo's first twelve days `src/migrations/index.ts` was touched in 45 commits, 15 of them merges resolved by hand; `payload-types.ts` in 45. The procedure has already stranded the preview database once (104a7ee: rows in `payload_migrations` renamed by hand) and had migrations written twice over (07ade5b, b591489). Ticket 81 met it again: Payload writes a migration's type imports as value imports, which this project refuses; the `index.ts` entry loses its trailing comma; and `scripts/with-database.mjs` always migrates before running its command, so `payload migrate:down` through it is undone at once. Every extra lane working in parallel makes this worse.

Found by the architecture review of 24 September 2026 (A1).

**Blocked by:** None (can start immediately).

**Status:** resolved — `npm run cms:rebase-migrations` and `npm run cms:check-migrations`; the last criterion stays open, the founder's decision after launch

- [x] `npm run cms:rebase-migrations` (or similar) drops this branch's own migrations, regenerates them against `main`'s newest snapshot — keeping a name a database may already have applied, as `parallel-sessions.md` says — marks their type imports `type`, and regenerates `payload-types.ts` and the import map
- [x] `src/migrations/index.ts` is derived from the folder, not typed by hand, so it never conflicts
- [x] A CI step fails when the configuration has anything no migration creates (`payload migrate:create` would write a non-empty migration), or when `payload-types.ts` is not what the configuration generates
- [x] `parallel-sessions.md`'s migration section becomes "run this command", with the edge cases the command cannot decide left in prose
- [ ] **After launch, the founder decides:** squash the chain (26 snapshots, 14 MB) into one baseline that the production and preview databases record as already applied. Production already holds published content, so this needs the founder and an ADR; it is not part of this ticket's pull request

## Comments

**Names are kept while they still sort after all of main's, not always.** The first criterion asks for "a name a database may already have applied" to be kept. A kept name that sorts before one of main's leaves main's snapshot newest by name, so the next migration anyone writes would be diffed against a schema without this branch's tables, and the third criterion's check fails the pull request. Kept that way, the branch's migrations would also run before main's on a database built from scratch. So when one of them sorts too early, they all move after main's, in their order, and the command prints the `UPDATE payload_migrations …` statements a database that ran the old names needs (renaming them in the checkout's own `.data/` itself). A database stranded that way needs no DDL, only those rows (see "CMS migrations" in `docs/agents/parallel-sessions.md`).

**`src/migrations/index.ts` is not committed.** Payload's `migrate` reads the folder and never the index, and it rewrites the index whenever it writes a migration, so a committed index could not stay derived. `.gitignore` and `tsconfig.json` leave it out; `scripts/freeze-seed.ts`, the one thing that imported it, reads the folder with Payload's `readMigrationFiles`. A branch that merges `main` after this and has edited the index gets a modify/delete conflict: `git rm src/migrations/index.ts`.

**Beyond the criteria:** the check also compares the admin's import map, which the command regenerates beside `payload-types.ts`; and the command ends by running every migration on a database built from scratch, which is what ticket 56's stale-snapshot migrations would have failed.
