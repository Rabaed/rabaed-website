# 70: Bug — the stale-render test's lock can hold the whole test server for two minutes

**What is wrong:** `tests/e2e/stale-render.spec.ts` (ticket 64) holds the site settings at the database while a build of `/tool` waits on them, publishes the tool page, and lets go. On 23 September 2026 a local run of the suite on port 3143, beside another checkout's suite on the same machine, failed six tests of the `runs-last` project together: stale-render with `apiRequestContext.post: Test timeout of 120000ms exceeded`, and launch-articles, english-pages and ai-crawlers with `Request context disposed` or waits that ran out. CI was green on the same commits.

**Blocked by:** nothing.

**Status:** resolved — the hold is bounded at ten seconds, and a run that reaches the bound says why

- [x] The cause confirmed or refuted by reproducing it, with what the database was doing at the time
- [x] The lock can never be held longer than a few seconds, whatever the test or the machine is doing
- [x] The test still proves ticket 64's fix: run alone, it fails without the second mark in `src/cms/revalidation.ts` — `HIT` for the whole sixty seconds — and passes with it
- [x] If running suites side by side on one machine is the underlying problem, `docs/agents/parallel-sessions.md` says so

## What happened: a deadlock, not a slow test

The guess on the way in was that, under load, the test's publish ran long while the lock was held, and the lock stalled the suites beside it into their own timeouts. Close, but the publish did not run long. It could not run at all.

Every page's footer reads the site settings, so while they are locked every page being built waits — and each build waiting **holds one of the server's database connections while it waits**. The server has ten (`pg`'s pool default; `src/payload.config.ts` sets none). The suites beside stale-render in `runs-last` ask for pages all the while. Once ten builds are waiting, the test's publish has no connection to publish with: it waits for the lock to go, and the lock goes only once the publish has answered. Nothing ended that but the test's two-minute deadline, and every page asked for in those two minutes waited with it — which is the five failures beside it.

## Reproduced

On the machine this was written on, port 3170, watching `pg_stat_activity` every 200ms:

| Run | Builds waiting on the lock, at most | Result |
| --- | --- | --- |
| `runs-last` alone, idle machine | 8 of 10 connections | 28 passed; the publish landed while 6 were waiting |
| `runs-last`, twenty busy-looping processes beside it | 7 of 10 | 28 passed |
| The lock held and every route asked for at once (a throwaway spec) | 9, with all 10 of the server's connections open | the publish **got no answer in 8 seconds**; let go, it answered in 298ms |

So an ordinary local run already comes within two connections of the deadlock. Twenty workers — Playwright's default on a twenty-core machine — ask for more pages at once than CI's two do, which is why CI has not seen it. A second checkout's suite on the same machine slows everything down, and more builds pile up before the publish: that is what took it the rest of the way on 23 September. Busy-looping processes alone did not.

## What changed

All in `tests/e2e/stale-render.spec.ts`; nothing in the site.

- **A ceiling on the hold, `HELD_AT_MOST`, ten seconds.** A timer rolls the lock back at the ceiling whatever the test is doing. A publish the lock held up is answered as soon as it goes, and the test then fails in words that name the cause, rather than at two minutes. A normal hold is about four seconds.
- **Postgres bounds it too**, for the case where the test process itself stalls: `idle_in_transaction_session_timeout` ends the locking session two seconds after the ceiling, and `lock_timeout` gives up on taking the lock after two seconds rather than queueing. A queued exclusive lock holds up every reader behind it just as a granted one does.
- **Deadlines on every request made while it is held.** The publishes and the build of `/tool` each outlive the ceiling but not the test, and the wait for the build to arrive gives up at three seconds.

Checked on port 3170:

- **Alone, with the fix:** passed; `/tool` had the new words 6.4s after the publish.
- **Alone, without the second mark** (`markAgain()` commented out for the run): `never reached a visitor at /tool in 60063ms; Next said HIT`.
- **Alone, with every route asked for while the lock was held**, so the pool starves inside the real test: the lock waits ended about ten seconds after they began, and the test failed with the ceiling's message.
- **The full suite:** 1175 passed.

## What this does not fix

Under enough load, the test can still reach the ceiling and fail, now alone and in ten seconds. It then says why, and the suites beside it lose ten seconds rather than two minutes. Making it certain would mean giving the test server a bigger pool, which is a setting in the site's own code for the tests' sake. It would also only move the threshold, not remove it.

## Comments
