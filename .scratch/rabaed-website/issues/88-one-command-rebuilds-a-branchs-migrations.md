# 88: One command rebuilds a branch's migrations after a merge, and CI catches a schema that drifted

**What to build:** the procedure every CMS ticket follows after merging `main` — today three paragraphs of prose in `docs/agents/parallel-sessions.md`, which pull in opposite directions — as one command, plus a CI check that fails when the configuration and the migrations disagree.

**Why:** in the repo's first twelve days `src/migrations/index.ts` was touched in 45 commits, 15 of them merges resolved by hand; `payload-types.ts` in 45. The procedure has already stranded the preview database once (104a7ee: rows in `payload_migrations` renamed by hand) and had migrations written twice over (07ade5b, b591489). Ticket 81 met it again: Payload writes a migration's type imports as value imports, which this project refuses; the `index.ts` entry loses its trailing comma; and `scripts/with-database.mjs` always migrates before running its command, so `payload migrate:down` through it is undone at once. Every extra lane working in parallel makes this worse.

Found by the architecture review of 24 September 2026 (A1).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent — the last criterion is the founder's decision, taken after launch

- [ ] `npm run cms:rebase-migrations` (or similar) drops this branch's own migrations, regenerates them against `main`'s newest snapshot — keeping a name a database may already have applied, as `parallel-sessions.md` says — marks their type imports `type`, and regenerates `payload-types.ts` and the import map
- [ ] `src/migrations/index.ts` is derived from the folder, not typed by hand, so it never conflicts
- [ ] A CI step fails when the configuration has anything no migration creates (`payload migrate:create` would write a non-empty migration), or when `payload-types.ts` is not what the configuration generates
- [ ] `parallel-sessions.md`'s migration section becomes "run this command", with the edge cases the command cannot decide left in prose
- [ ] **After launch, the founder decides:** squash the chain (26 snapshots, 14 MB) into one baseline that the production and preview databases record as already applied. Production already holds published content, so this needs the founder and an ADR; it is not part of this ticket's pull request
