# 89: The suites that publish get a test server and database of their own

**What to build:** a second test server with its own Postgres, for the suites that publish what others read or hold locks others wait on — so that isolation is a mechanism, not a rule.

**Why:** every suite shares one server and database today, so a publish in one is seen by all. What keeps the run honest is a set of rules and budgets: the `RUNS_LAST` list and its teardown project (`playwright.config.ts:22`, and the comment at lines 97–123); "ticket 22's rule" that a suite may not publish what its neighbours read; a hard-coded account per suite; and stacked timeouts (20s per assertion, 120s per test, 60s more per publish wait, `tests/e2e/cms.ts:477-510`). Tickets 60, 61, 62, 64 and 70 were all about this. `stale-render.spec.ts` holding a real row once took every one of the server's ten connections and five other tests with it. The result is reds that nobody believes and re-runs, which is how a real regression gets through.

It also blocks a test ticket 81 wanted: the site-wide limit of thirty confirmations an hour (ADR-0022) cannot be filled while other suites expect confirmations from the same server.

Found by the architecture review of 24 September 2026 (A8).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Playwright starts two web servers (`webServer` accepts a list), each with its own database, on ports derived from `TEST_PORT` so parallel lanes still do not collide
- [ ] The suites in `RUNS_LAST`, and any suite that publishes a shared global, run against the second
- [ ] What that makes unnecessary is removed, or its comment says why it stays: the teardown project, the ordering comments, the per-suite "don't publish" rules
- [ ] A test fills the site-wide confirmation limit (`CONFIRMATION_LIMIT` in `src/forms/submission.ts`) on the second server, and ADR-0022's Consequences are updated
- [ ] CI's shard times grow by no more than the second server's start-up; the ticket reports before and after
