# 60: Bug — the tests that wait for a published change time out on CI

**What is wrong:** Eleven assertions publish a change in the CMS and wait for it to reach a visitor with `expect.poll` and its default five seconds. Publishing marks every page stale and the page is rebuilt on its next visit (`src/cms/revalidation.ts`), and on a hosted runner that rebuild does not always finish inside five seconds — so the test fails though nothing is wrong with publishing, revalidation or the page.

The eleven, two in each suite but one on the product page:

- `tests/e2e/home-text.spec.ts:532` and `:553`
- `tests/e2e/page-text.spec.ts:211` and `:235`
- `tests/e2e/partnership-page-text.spec.ts:289` and `:306`
- `tests/e2e/product-text.spec.ts:547`
- `tests/e2e/referral-page-text.spec.ts:294` and `:311`
- `tests/e2e/tool-page-text.spec.ts:315` and `:332`

**Reported by:** CI run 35527266467 on pull request #41 (ticket 29), 20 September 2026. `tests/e2e/home-text.spec.ts` › "a change to the home page published reaches visitors" failed on the `e2e (2/4)` shard with `expect(received).toContain(expected)` and "Timeout 5000ms exceeded while waiting on the predicate"; the HTML it received was the page as it stood before the change. The same shard passed locally (`TEST_PORT=3129 npm test -- --grep-invert @pixel --shard=2/4`, 226 passed) and three full local runs gave 887 passed. The shard was re-run on CI and went green, which is what a flaky wait looks like.

The home page is the heaviest page to rebuild, which is why it trips first. The other ten wait the same way on lighter pages.

**Blocked by:** nothing.

**Status:** resolved

## Why it happens

Publishing a page's entry calls `revalidatePath('/', 'layout')` (`src/cms/revalidation.ts`), which marks every page stale; Next rebuilds a stale page on its next visit and serves the old one until that rebuild finishes. So the wait is not "a moment" — it is one whole server render of that page, and the test's own requests are what triggers it.

Five seconds is the `expect.poll` default, chosen by Playwright, not by anything about this wait. (Ticket 61 has since put every retrying assertion on twenty seconds in `playwright.config.ts`; that number is sized for riding out a stall in work that takes milliseconds, and this wait's work is a whole page render.) It is enough on a developer machine, where a rebuild of the home page takes well under a second. A hosted runner has two cores and one Playwright worker (`.github/workflows/ci.yml`), and shares them with the Next server that is rebuilding the page, so the same rebuild can take many times longer. Nothing in the test says how long a rebuild is allowed to take, so the number that decides whether CI is green is Playwright's default.

## Done when

- [x] Each of the eleven waits as long as a rebuild of that page can take on the slowest machine the suite runs on, and says where that number comes from
- [x] A change that genuinely never arrives still fails the test, and says so in words
- [x] The eleven pass repeatedly under load, from running the suite rather than from repeating one test as one editor — two logins to one account in the same instant erase each other's session (`tests/e2e/forms.ts`)
- [x] The full suite is green

## Comments

**What the wait is.** Publishing marks every page of the site for rebuilding (`refreshSite` in `src/cms/revalidation.ts`), and Next answers the next visit to a marked page from a fresh render of it. Measured on an idle machine, that render is all there is: over twelve publishes of the home page, the first ask after the publish came back with the change every time, `x-nextjs-cache: MISS`, in 31 to 92 milliseconds. Nothing is ever served stale here, so a wait of five seconds looked generous — until the page has to queue.

**Why it queues.** One publish marks the whole site, not the page that changed. Whatever else the run then asks for is rendered again too, and the wait's own page waits its turn. That is what makes the tail so long: in three full-suite runs at twenty workers the eleven waits ran 19 milliseconds to 10.4 seconds, and the 10.4 was five times the second-worst wait in its own run. A hosted runner has two cores and one worker and shares them with the server, which is how the same wait passed five seconds there three times in two days — and then twenty seconds once, having passed at that bound on all four shards twice in between (commit `d7aceb9`). A runner is slower than anything measurable here by more than an order of magnitude, and unevenly so.

**The fix** is one helper the CMS suites share, `reachesVisitors` in `tests/e2e/cms.ts`:

- **A minute**, with the measurements and the reasoning written above it: about three times the worst the runner has actually been seen to take, where a budget taken off the median — or off the 10.4 seconds this machine could produce — would have passed every run recorded here and flaked on the runner, which is how five seconds came to be in the tests at all. It costs a passing run nothing, since every wait returns as soon as the words arrive.
- **A failure says what never arrived**, how long it waited and what Next said of the page it last sent — `MISS` where it rendered the page for that request, `STALE` where it was still rendering, `HIT` where it answered from what it had built before. `HIT` after a minute is the shape of a revalidation that never happened.
- **The test is given room for the wait.** The helper adds the budget to the running test's own deadline, so the bound is reachable whatever the config allows a test — two minutes since ticket 61, thirty seconds before it. Without that, a wait that really did run out would end as "Test timeout exceeded", which names nothing, and a bound beyond the test's deadline would never be reached at all: that is what the minute on the home page's poll in `d7aceb9` amounted to while the deadline was still thirty seconds.
- **A wait past five seconds is a line in the log** — the default these tests used to take, so a run that logs one is a run that would have failed before. A runner drifting towards the bound says so in a green run rather than a red one.

**Five of the eleven could not fail.** The «published in English» tests polled for a word — the page's Arabic heading — that is in the page before the publish as well as after it, because publishing a page in English is meant to leave its Arabic page exactly as it was. So the poll returned on its first ask, and the `not.toContain('>English<')` check after it could be reading the page as it stood rather than the rebuild. There is nothing in an unchanged page to wait for, so those five now publish the trailing space these suites already use as a change no screenshot shows and no suite reads (each file's own header says which paragraph), together with the English, and wait for that space: the page they then read was built from the publish. The claim they make is unchanged, and it is now actually tested.

**Two fixes met here.** While this was being built, the lane on ticket 33 hit the same failure and put the home page's poll alone on twenty seconds (`60f7ee9`) and then on a minute (`d7aceb9`), deliberately as a generous bound rather than a tuned one, leaving the other ten waits on the default. That merged into `main` first, and its evidence is the most valuable thing in this ticket: it is the only observation of what the runner really costs, above twenty seconds. This supersedes it — the inline bound and its comment are gone, the eleven share one helper, and the number is theirs, raised from the thirty seconds these measurements alone would have justified. What the inline bound could not do is outlive its own test: sixty seconds inside a test Playwright stops at thirty was never reachable, which is why the helper lengthens the test's deadline.

**What this does not do.** It leaves `playwright.config.ts` alone, which was the right division of labour: ticket 61 measured the runner and set the suite-wide numbers there — twenty seconds for a retrying assertion, two minutes for a test — and merged first. This is the wait that needs more than a suite-wide number, because what it waits for is a whole page render rather than a re-render that takes milliseconds. Ticket 62 has what is left: the same publish wait in five other suites, which have ticket 61's twenty seconds and no bound of their own.

### Verified

All on `TEST_PORT=3160`, on the machine this was written on: 20 cores, and 20 workers unless said otherwise.

- **The eleven, under load:** six full-suite runs (`npm test -- --grep-invert @pixel --workers=20`), 44 samples of the eleven waits, none failed. Four runs were 887 passed; the other two failed only in assertions this ticket does not touch (below). The waits themselves: 19ms to 10.4s, median around a third of a second.
- **Idle, for contrast:** 19 to 307 milliseconds, across the six suites alone and a `--repeat-each=2` run of `home-text.spec.ts`.
- **They still fail when the change never arrives.** With `refreshSite` made to return early behind a temporary `BREAK_REVALIDATION` flag, all eleven failed, each in about 20 seconds (the budget at the time; a minute now), each naming its own change and reporting `HIT` — the page Next had built before. Every one of those eleven would have passed that test before this ticket if it had been one of the five. The flag was removed; to repeat the proof, add `if (process.env.BREAK_REVALIDATION) return;` to `refreshSite` and run the six suites with it set.
- **To measure the waits again**, widen the log's condition to `waited > REBUILT_IN / 2 || process.env.MEASURE_REBUILD` and run with `MEASURE_REBUILD=1`. That is how the numbers above were taken.
- **Main, for comparison:** main's own copies of the seven files, at the same 20 workers, 887 passed.

**Failures seen in these runs that are not this ticket's**, each in an assertion left untouched: the admin's tab panels (`partnership-page-text.spec.ts:187`, the shape ticket 61 covers, and a local reproduction of it); `blog.spec.ts:370`, five seconds for an article just created, which is ticket 62's; `home-before-after-and-calculator-match-reference.spec.ts:139` twice, a bare 30-second test timeout on a drag under load, which belongs with ticket 61; and twice a 500 from a resized image on `/blog` (`health.spec.ts`), which is neither and is unexplained — worth a ticket of its own if it shows up on a run nobody is squeezing.

**Two runs were thrown away rather than read.** `--workers=40` exhausted the machine's memory (`VirtualAlloc failed`, 357 failures, the server refusing connections), and two full suites started at once in one checkout failed because `next build` refuses to run twice in the same directory. Neither says anything about the fix.
