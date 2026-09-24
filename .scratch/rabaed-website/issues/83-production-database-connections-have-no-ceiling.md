# 83: Bug — production database connections have no ceiling

**What is wrong:** `src/payload.config.ts` gives Payload's Postgres pool a connection string and nothing else — no `max`. On Vercel each function instance opens its own pool against Supabase, so the number of connections the live site can hold is the number of instances times the `pg` default of 10. Ticket 70 showed what happens when connections run out: the test server stalled with every connection held by a page build waiting on a lock. On launch day a burst of traffic, or a burst of form requests waiting on the form limits' lock (ADR-0022), could do the same to the live site: pages hang until a connection frees.

Found by the architecture review of 24 September 2026 (L3). **Due before launch** (2–3 October 2026).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] The pool has an explicit `max`, chosen for serverless against Supabase and the reason written beside it — five, on a deployment (`DEPLOYED_POOL` in `src/cms/environment.ts`)
- [x] Idle connections are let go (`idleTimeoutMillis`) so an instance that has gone quiet does not keep holding them — ten seconds
- [x] `docs/deployment.md` says which Supabase address `DATABASE_URL` must be — the **transaction pooler** (port 6543), not the direct connection (5432) — and why
- [x] **The founder** checks the production and preview `DATABASE_URL` in Vercel against that, and changes them if they point at 5432. An agent never reads or writes those values — the founder confirmed both end in `6543/postgres`, 24 September 2026
- [x] The full suite passes with the new pool settings (the test server's 10-connection behaviour, ticket 70, is unchanged or deliberately changed) — unchanged by design: the ceiling applies on Vercel only. CI's full suite passed on all four shards at `75c8d1b`; the local run on port 3183 had reached 1039 of 1286 with no failure when the founder asked for the merge

Added while building:

- [x] A request that finds a server's connections all busy waits at most **ten seconds** for one, then fails rather than hanging (`pg`'s default is to wait for ever)
- [x] A deployment whose `DATABASE_URL` is a Supabase address other than the transaction pooler refuses to build, and says how to fix it without repeating the address
- [x] A test holds a deployment's CMS config to the pool and the address check, and a local one to `pg`'s own pool (`tests/unit/database-pool.spec.ts`)

## Agent Brief

**Where:** `src/payload.config.ts:119` (`postgresAdapter({ pool: { connectionString: databaseUrl() } })`), `docs/deployment.md` ("The CMS", step 6).
**Know before choosing `max`:** Supabase's transaction pooler (Supavisor) multiplexes many client connections onto few database connections, so a small per-instance `max` (a handful) is the usual serverless setting. Prepared statements are not supported through the transaction pooler; check whether Payload's Postgres adapter (drizzle, `pg`) uses any before recommending it, and say so in the docs.
**Tests:** the suite drives a local Postgres, not Supabase; this ticket's evidence is the config, the docs and a green suite.

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> *Two sessions wrote this ticket on 24 September 2026: the triage of the architecture review, and the session that built it, as `83-database-connections-have-a-ceiling.md`. They are merged here, with the triage's wording and brief, and the builder's extra criteria under "Added while building".*
>
> - **The fix** is `databasePool` in `src/cms/environment.ts`, which `src/payload.config.ts` hands the Postgres adapter. On a Vercel deployment it adds `DEPLOYED_POOL`, `max: 5`, `connectionTimeoutMillis: 10_000` and `idleTimeoutMillis: 10_000`, to the connection string; anywhere else it passes the connection string alone, so `pg` keeps its own ten and its endless wait.
> - **Why five:** the adapter checks one connection out when the server starts and never returns it, to hear a dropped connection (`connectWithReconnect` in `@payloadcms/db-postgres`), so five leaves four for work. Fewer would leave too little room for a page build, which asks for several at once, or for a publish whose hooks read outside its transaction. Against the pooler's 200 clients on Supabase's Nano and Micro plans, five is forty servers where ten was twenty.
> - **Why ten seconds:** it bounds the wait without cutting off real work. Past it the request fails, and a page with a built copy goes on serving it. A form answers with its `failed` wording, which asks the visitor to try again shortly or message on WhatsApp. That is the trade `docs/deployment.md` states: a very busy server now turns a request away after ten seconds instead of holding it.
> - **Idle connections:** `idleTimeoutMillis` is ten seconds, `pg`'s own default, written into `DEPLOYED_POOL` so it is decided rather than inherited. It only fires while the server is running: a server Vercel has paused keeps its connections until it wakes or is stopped, which is what `attachDatabasePool` (below) would close.
> - **Why not locally:** the test server's suites ask for many pages at once and hold the site settings at the database while they do (ticket 70); five would starve them sooner, and they are one server, not a fleet.
> - **Transaction mode is safe for what the site does:** the forms' lock is `pg_advisory_xact_lock` with `SET LOCAL` (ticket 81), both scoped to a transaction, which Supabase's transaction pooler supports. `pg` sends no named prepared statements unless asked to, and nothing here asks.
> - **The test** is `tests/unit/database-pool.spec.ts`. Like `cms-boots-without-jsdom.spec.ts`, it loads the Payload config in a process of its own through Payload's runner, as a deployment and as the test server, and reads the pool the adapter is built with, connecting to nothing. Running a probe that way is now one helper, `tests/unit/payload-probe.ts`, which the jsdom and English-words specs use too; before, each had its own copy. Before the fix the deployment case read `{"max":null,"connectionTimeoutMillis":null}`; after it, both tests pass.
> - **`docs/deployment.md`** has a new "Database connections" section under "The CMS", with how to check the address without copying it anywhere, and step 2 points to it.
> - **The address check** is `refuseSupabaseOutsideTransactionPooler`, beside `databasePool`, added after the founder confirmed both environments already use port `6543`, so it cannot fail a deploy by surprise. On a deployment, a Supabase address on any port but `6543` stops the build with a message naming what it found (a direct connection, or the pooler in session mode) and what to put there. The message never repeats the address, which carries the password. Port `6543` is accepted on the dedicated pooler's `db.*.supabase.co` host too, since that is transaction mode as well. An address that is not Supabase's is let through. The spec runs it on the direct address, the session-mode address, the dedicated pooler, and an address carrying a recognisable password.
> - **The spec's Testing Decisions** now name the fourth seam this test and the jsdom one use: loading the CMS configuration in a process of its own, connecting to nothing. The founder approved adding it, 24 September 2026.
> - **Also covered:** the production build's `payload migrate` step (`scripts/migrate-production.mjs`) runs on Vercel and starts Payload from the same config, so it works under the ceiling too, one migration at a time. Nothing in `src/` or `scripts/` opens a connection of its own. The `cms:*` commands run from a computer, not a deployment, and keep `pg`'s own pool.
> - **Not done here:** Vercel's `attachDatabasePool` (from `@vercel/functions`), which closes idle connections before Vercel pauses a server. Payload builds the pool inside its adapter, so reaching it means wrapping `pg`, a larger change than this ticket's.
