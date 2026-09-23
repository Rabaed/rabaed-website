# 99: A test database left running on Windows is stopped before the next run starts

**What is wrong:** `scripts/test-server.mjs:66-75` stops the test run's Postgres only on `SIGINT`, `SIGTERM` or the server's own exit. On Windows, Playwright ends the server by killing its process tree, so `database.stop()` never runs. The next run then deletes the old scratch folder and starts a fresh Postgres, and fails with "shared memory block is still in use". Each lane has met this, and it has been cleared by hand each time, by finding and stopping that checkout's leftover Postgres.

The development database has the same weakness. On 24 September 2026 a failed `scripts/with-database.mjs` run left something holding the development database's port (55553) with no process that could be found. `npm run dev` in that checkout would not start, and a connection to the port hung.

Found by the architecture review of 24 September 2026 (L10).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Before starting, the test server reads `postmaster.pid` in its port's data folder and stops that Postgres if it is still running (`pg_ctl stop -m fast`, or ending the process named there), then starts afresh
- [ ] The development database's start (`scripts/local-database.mjs`, `startDatabase`) does the same, and says clearly when the port is held by something that is not its own Postgres, instead of failing with `undefined`
- [ ] Only this checkout's own database is ever stopped, identified by its data folder, never another lane's
- [ ] Checked on Windows by killing a run mid-way, then starting another
