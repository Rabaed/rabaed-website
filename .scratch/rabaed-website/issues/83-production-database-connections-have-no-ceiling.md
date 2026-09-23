# 83: Bug — production database connections have no ceiling

**What is wrong:** `src/payload.config.ts` gives Payload's Postgres pool a connection string and nothing else — no `max`. On Vercel each function instance opens its own pool against Supabase, so the number of connections the live site can hold is the number of instances times the `pg` default of 10. Ticket 70 showed what happens when connections run out: the test server stalled with every connection held by a page build waiting on a lock. On launch day a burst of traffic, or a burst of form requests waiting on the form limits' lock (ADR-0022), could do the same to the live site: pages hang until a connection frees.

Found by the architecture review of 24 September 2026 (L3). **Due before launch** (2–3 October 2026).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent — one step is the founder's (below)

- [ ] The pool has an explicit `max`, chosen for serverless against Supabase and the reason written beside it
- [ ] Idle connections are let go (`idleTimeoutMillis`) so an instance that has gone quiet does not keep holding them
- [ ] `docs/deployment.md` says which Supabase address `DATABASE_URL` must be — the **transaction pooler** (port 6543), not the direct connection (5432) — and why
- [ ] **The founder** checks the production and preview `DATABASE_URL` in Vercel against that, and changes them if they point at 5432. An agent never reads or writes those values
- [ ] The full suite passes with the new pool settings (the test server's 10-connection behaviour, ticket 70, is unchanged or deliberately changed)

## Agent Brief

**Where:** `src/payload.config.ts:119` (`postgresAdapter({ pool: { connectionString: databaseUrl() } })`), `docs/deployment.md` ("The CMS", step 6).
**Know before choosing `max`:** Supabase's transaction pooler (Supavisor) multiplexes many client connections onto few database connections, so a small per-instance `max` (a handful) is the usual serverless setting. Prepared statements are not supported through the transaction pooler; check whether Payload's Postgres adapter (drizzle, `pg`) uses any before recommending it, and say so in the docs.
**Tests:** the suite drives a local Postgres, not Supabase; this ticket's evidence is the config, the docs and a green suite.
