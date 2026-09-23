# 83: Bug — nothing caps the database connections the live site opens, and a request waits for one forever

**What is wrong:** `src/payload.config.ts` hands the Postgres adapter a connection string and nothing else, so every server Vercel runs the site on takes `pg`'s defaults: up to ten connections each, and **no limit on how long a request waits for one**. Under a spike Vercel starts more servers, and ten each is what they ask Supabase for. Supabase's smaller plans take 60 direct connections, or 200 clients through its pooler. Past that, and whenever one server's ten are all busy, a page build, a form or the admin waits for a connection with nothing to end the wait but Vercel's five-minute function limit. In plain words: a traffic spike on launch day could leave pages hanging.

Found by the architecture review of 24 September 2026 (L3). Ticket 70 met the same default from the other side: the test server stalled once its ten were taken.

**Blocked by:** None (can start immediately).

**Status:** resolved — the founder's check of the address is the one box left

- [x] On every Vercel deployment, each server holds at most **five** connections to the database
- [x] A request that finds them all busy waits at most **ten seconds** for one, then fails rather than hanging
- [x] The test server and `npm run dev` keep `pg`'s own pool, so the suites behave as they did (ticket 70)
- [x] `docs/deployment.md` says why the pooler address matters, what the ceiling buys against Supabase's limits, and how to check which address a deployment uses
- [x] A test holds a deployment's CMS config to the ceiling and the wait, and a local one to `pg`'s own pool
- [ ] **The founder checks** that `DATABASE_URL` on production and on the Preview environment is Supabase's transaction pooler (port `6543`), as `docs/deployment.md` step 2 says. Neither the code nor CI can see it.

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **The fix** is `databasePool` in `src/cms/environment.ts`, which `src/payload.config.ts` hands the Postgres adapter. On a Vercel deployment it adds `max: 5` and `connectionTimeoutMillis: 10_000` to the connection string; anywhere else it passes the connection string alone, so `pg` keeps its own ten and its endless wait.
> - **Why five:** the adapter checks one connection out when the server starts and never returns it, to hear a dropped connection (`connectWithReconnect` in `@payloadcms/db-postgres`), so five leaves four for work. Fewer would leave too little room for a page build, which asks for several at once, or for a publish whose hooks read outside its transaction. Against the pooler's 200 clients on Supabase's Nano and Micro plans, five is forty servers where ten was twenty.
> - **Why ten seconds:** it bounds the wait without cutting off real work. Past it the request fails, and a page with a built copy goes on serving it.
> - **Why not locally:** the test server's suites ask for many pages at once and hold the site settings at the database while they do (ticket 70); five would starve them sooner, and they are one server, not a fleet.
> - **Transaction mode is safe for what the site does:** the forms' lock is `pg_advisory_xact_lock` with `SET LOCAL` (ticket 81), both scoped to a transaction, which Supabase's transaction pooler supports. `pg` sends no named prepared statements unless asked to, and nothing here asks.
> - **The test** is `tests/unit/database-pool.spec.ts`. Like `cms-boots-without-jsdom.spec.ts`, it loads the Payload config in a process of its own through Payload's runner, as a deployment and as the test server, and reads the pool the adapter is built with, connecting to nothing. Before the fix the deployment case read `{"max":null,"connectionTimeoutMillis":null}`; after it, both tests pass.
> - **`docs/deployment.md`** has a new "Database connections" section under "The CMS", with how to check the address without copying it anywhere, and step 2 points to it.
> - **Not done here:** Vercel's `attachDatabasePool` (from `@vercel/functions`), which closes idle connections before Vercel pauses a server. Payload builds the pool inside its adapter, so reaching it means wrapping `pg`, a larger change than this ticket's.
