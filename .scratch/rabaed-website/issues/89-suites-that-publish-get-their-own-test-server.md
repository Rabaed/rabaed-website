# 89: The suites that publish get a test server and database of their own

**What to build:** a second test server with its own Postgres, for the suites that publish what others read or hold locks others wait on — so that isolation is a mechanism, not a rule.

**Why:** every suite shares one server and database today, so a publish in one is seen by all. What keeps the run honest is a set of rules and budgets: the `RUNS_LAST` list and its teardown project (`playwright.config.ts:22`, and the comment at lines 97–123); "ticket 22's rule" that a suite may not publish what its neighbours read; a hard-coded account per suite; and stacked timeouts (20s per assertion, 120s per test, 60s more per publish wait, `tests/e2e/cms.ts:477-510`). Tickets 60, 61, 62, 64 and 70 were all about this. `stale-render.spec.ts` holding a real row once took every one of the server's ten connections and five other tests with it. The result is reds that nobody believes and re-runs, which is how a real regression gets through.

It also blocks a test ticket 81 wanted: the site-wide limit of thirty confirmations an hour (ADR-0022) cannot be filled while other suites expect confirmations from the same server.

Found by the architecture review of 24 September 2026 (A8).

**Blocked by:** None (can start immediately).

**Status:** resolved — the second criterion only in part, by decision; see below

- [x] Playwright starts two web servers (`webServer` accepts a list), each with its own database, on ports derived from `TEST_PORT` so parallel lanes still do not collide
- [ ] The suites in `RUNS_LAST`, and any suite that publishes a shared global, run against the second — the `RUNS_LAST` suites do; the suites that publish only a trailing space, and `cms.spec.ts`, stay on the first (below)
- [x] What that makes unnecessary is removed, or its comment says why it stays: the teardown project, the ordering comments, the per-suite "don't publish" rules
- [x] A test fills the site-wide confirmation limit (`CONFIRMATION_LIMIT` in `src/forms/submission.ts`) on the second server, and ADR-0022's Consequences are updated
- [x] CI's shard times grow by no more than the second server's start-up; the ticket reports before and after

## Comments

> *Built 24 September 2026.* How each criterion was checked:
>
> - **Two servers.** `webServer` is a list of two in `playwright.config.ts`:
>   - the first on `TEST_PORT`, as before;
>   - the second on `TEST_PORT + 1000`, with its Postgres, like every test server's, 2000 above it.
>
>   Lanes on `31NN` get `41NN` and `61NN`, clear of each other and of the development databases from 55000. Playwright starts the two one after the other, so the second (`scripts/test-server.mjs --publishing`) never builds. It migrates a database of its own, creates the same editors, and serves a copy of the first server's build: `.next` without its cache, about 100 MB, copied in a second or two, with `distDir` read from `TEST_BUILD_DIR` in `next.config.ts`.
>   - **A copy, not the same folder:** a server writes the pages it rebuilds into its build folder, so two servers sharing one would each serve pages built from the other's database.
>   - **Its own address written in:** the pages the build made ahead of time name the first server's address, while pages the second server rebuilds name its own. Left alone, a page would change address on its first rebuild. The copy therefore has `127.0.0.1:<first port>` rewritten to the second port in every file.
>   - **Why `TEST_PORT` is now held to 1024–8999:** the rewrite only keeps each `.rsc` file's recorded lengths right when both ports have the same number of digits. The test server refuses a pair that does not.
>   - **The form suites' outbox and documents folders** are now worked out from the port of the server the running test's project uses (`tests/e2e/forms.ts`).
> - **What runs on the second:** the six `RUNS_LAST` suites and the new `confirmation-limit.spec.ts`, as the `publishing` project, with `workers: 1`. No two of them ever run at once, so none can publish while another is waiting or holds a lock. That is the mechanism the ticket asks for, both between the two servers and on the second one.
> - **Not moved, by decision:**
>   - **The suites that publish only a trailing space:** `home-text`, `page-text`, `product-text`, `tool-page-text`, `referral-page-text`, `partnership-page-text`, `site-words` and `faqs`. On the second server they would clash with what runs there. For example, `page-text` holds the English start page to being a notice while `english-pages` publishes it.
>   - **`cms.spec.ts`**, which publishes site settings, for the same reason: `stale-render` publishes and locks them too.
>
>   One at a time there would stop the clashes, but it would add their whole run time to the one worker the second server has, which would lengthen every local run by several minutes. Their "ticket 22's rule" comments stay as they were, because what they say is still true: they run beside the suites that read their pages. Moving them is a follow-up if it is ever wanted, most cheaply as a third server.
> - **Removed:**
>   - the `runs-last` teardown project and its comment;
>   - the retry in `english-pages.spec.ts` that approved a draft again when `stale-render` published the tool page beside it.
>
>   The comments that said a suite "runs last" or "beside" another now say where it runs. The tolerance in `ai-crawlers.spec.ts` stays, with comments that say why: a suite before it on the same server can leave an English page published, or a case study or article the file still names until its next rebuild. `stale-render.spec.ts` keeps its ten-second bound, for a page a suite before it marked for rebuilding. ADR-0017 is amended: with nothing beside it, stale-render's full-suite run is the proof as well as the guard.
> - **The site-wide limit:** `confirmation-limit.spec.ts` fills it.
>   - It counts the confirmations the hour already holds, then sends one request past what is left, each from an address and a network address of its own.
>   - It asserts all were stored and alerted, all but one confirmed, one `withheld`, and no mail sent to that one.
>   - It deletes its submissions afterwards, which frees the hour for the suites after it. `english-pages`' confirmation test passed when run straight after it.
>   - It fails if the hour is already spent.
>
>   It was checked red: told the limit is 29, it failed on the missing `withheld`. The demo request helpers it shares with `form-submission.spec.ts` moved into `tests/e2e/demo-request-api.ts`. ADR-0022's Consequences are amended.
> - **CI before and after**, as whole job times per shard, then the tests alone:
>
>   | | shard 1 | shard 2 | shard 3 | shard 4 |
>   |---|---|---|---|---|
>   | before, PR #103: job | 8:06 | 6:42 | 6:49 | 3:58 |
>   | before, PR #103: tests | 5:07 | 4:19 | 3:54 | 1:47 |
>   | before, PR #102: job | 8:26 | 7:07 | 7:55 | 5:40 |
>   | before, PR #102: tests | 4:59 | 4:22 | 4:39 | 2:24 |
>   | after, PR #105: job | 10:06 | 9:12 | 6:45 | 7:56 |
>   | after, PR #105: tests | 4:43 | 4:03 | 3:19 | 2:42 |
>   | after: second server's start-up | 1:52 | 1:27 | 1:06 | 1:51 |
>
>   The tests themselves take no longer; the slowest shard's are a little quicker. Each shard used to run all of the `RUNS_LAST` suites, because a teardown project is not divided between machines; now they are divided like the rest. What the jobs gained is the second server's start-up, which is what the criterion allows. Most of that start-up is creating the twenty-odd editor accounts, one `payload run` each, which a later ticket could do in one.
> - **CI has two workers, not one.** `.github/workflows/ci.yml`'s comment says a hosted runner gives Playwright one worker, but every shard's log says "using 2 workers" (a public repository's runner has four cores). The comment is left to a ticket of its own.
> - **Locally** the full suite passes: 1321 tests, in 6.1 minutes, against 4.4 before. The second server's suites run one after another, beside everything else, and on twenty workers that chain now decides when the run ends.
> - **Code review** (standards and spec, 24 September 2026):
>   - Taken:
>     - the ADR amendments now keep the original words and add a dated note, as ADR-0016's does;
>     - the two servers' shared settings are one object;
>     - the parameter names in the copy script are clearer;
>     - `forms.ts`'s port helper is renamed for what it reads;
>     - the address rewrite covers every file of the build, not three kinds;
>     - the limit test fails in plain words if the hour is already spent;
>     - a comment in `blog.spec.ts` that described stale-render's old arrangement is corrected.
>   - The review's main finding, that the second criterion is met only for the `RUNS_LAST` suites, is recorded above as a decision.
