# 61: Bug — assertions against the admin time out on CI

**What is wrong:** `tests/e2e/home-text.spec.ts` › "the hero has no switch to hide it; every other section of the home page has one" clicks each of the admin's eight section tabs and asserts that «Shows on the page» is visible after each click. On a hosted runner the admin does not always finish re-rendering a tab inside the five seconds Playwright gives an assertion by default, and the test fails though nothing is wrong with the admin.

Nothing in `playwright.config.ts` sets an `expect` timeout, so every assertion in the repository — and every `expect.poll` that names no timeout of its own — runs on that same default.

**Reported by:** CI run 35529201175 on pull request #44, 20 September 2026, on the re-run of the `e2e (2/4)` shard: `expect(locator).toBeVisible() failed / Expected: visible`, 225 passed and 1 failed. Pull request #44 changes one line of a markdown file under `.scratch/` — no source, no tests, nothing the site builds — so no change of ours is behind it. The same shard on the same pull request had failed once before that on the publish wait ticket 60 covers, and on pull request #41 twice. Everything passes locally: that exact shard gave 226 passed (`TEST_PORT=3129 npm test -- --grep-invert @pixel --shard=2/4`), and three full local runs gave 887 passed.

**Blocked by:** nothing. Ticket 60 is the same root cause — Playwright's defaults against a two-core runner — in the eleven waits for a published change to reach a visitor, and fixes those with a budget of their own; this is what is left once those are done.

**Status:** resolved

## Why it happens

Clicking a tab in the admin makes the admin render a panel of fields — React work in the browser, on a runner with two cores that is also serving the request and running the test. `toBeVisible` retries until Playwright's default five seconds is up, and that number was chosen by Playwright, not by anything about how long the admin takes.

## What has to be decided

Two remedies, and they are not equivalent:

1. **Per assertion, waiting for what the admin is actually doing** — the shape ticket 50 and ticket 60 took. Honest where the wait is one identifiable piece of work, and it leaves every other assertion in the repository on a default that will trip the next one.
2. **One `expect` timeout in `playwright.config.ts`** for the whole suite. It covers every assertion at once, including ones nobody has seen fail yet, and it slows every genuine failure down by the difference: a test asserting something that will never be true takes the new timeout to say so.

Whichever is chosen, a number in the config wants the same thing ticket 60's wanted: a measurement on a hosted runner to size it, not a guess.

## Done when

- [x] The eight tab assertions pass on a hosted runner, repeatedly
- [x] The number they wait for is measured rather than guessed, and says where it comes from
- [x] A switch that genuinely never appears still fails the test, in words
- [x] The full suite is green

## Comments

**Built on 20 September 2026.** The measurement changed what this ticket was about, so the reasoning matters more than the diff.

**The click was never lost.** The Playwright trace from run 35529201175 (artifact `playwright-report-1`, job 106127627178) shows, at the moment of failure, `button "Trust strip" [active]` while the panel beside it still held the Hero's fields — "Line above the heading", "Title Lines*", and the Hero's own description. So the tab did switch; what lagged was the panel's re-render. That ruled out the other reading worth ruling out, a click landing before the admin had hydrated, which no timeout would have fixed.

**The runner is not slow, which is the surprise.** A temporary spec timed the same re-render on the hosted runner, inside the shard that fails: **4ms at its fastest, 22ms median, 51ms at p90, 99ms at its slowest** over 32 samples, with the global's first paint 242–410ms. Idle on a twenty-core developer machine it is 4–45ms. So the runner is about twice as slow, not a thousand times — and a re-render that takes 99ms at its worst does not take five seconds because of arithmetic. The failure is an occasional **stall**, and no distribution of 32 samples can size one.

That is what decided the number. Twenty seconds is not an allowance for slow work — it is headroom for a stall, and it costs a passing assertion nothing, because a retrying assertion returns the moment it is true.

**One number in the config, not eight in a test.** The remedy this ticket framed as a choice resolved itself once the cause was known: a stall can hit any retrying assertion, and the eight tabs on the home page are simply where it was seen first. The same loop is in `partnership-page-text.spec.ts` and `page-text.spec.ts`, and ticket 60's session reproduced it in the partnership one locally under load. Fixing eight assertions would have left the rest on a default that would trip the next one, which is what this ticket warned about.

**The test deadline had to move with it.** `playwright.config.ts` set no `timeout` either, so a test got Playwright's default thirty seconds. These tests walk a row of tabs and assert after each — eight on the home page, five on the partnership page — and under a full suite at twenty workers those assertions *pass*, but slowly, and their sum reaches the deadline: ticket 60's session recorded thirty seconds crossed across five of them with none of them failing. A bigger `expect` budget without a bigger deadline only converts an assertion's message into «Test timeout of 30000ms exceeded», which says nothing about what was expected.

**Ticket 60's budget is thirty seconds and this one is twenty, on purpose.** Those waits are a whole server render of a page that publishing has marked stale, measured at 10.4 seconds under load; they carry their own timeout and are not covered by this one. This number is sized against a re-render measured at 99ms. Where an assertion should fail fast it still says so itself — the two `{ timeout: 500 }` checks in the reference comparisons.

### Verified

- **It still fails when the thing never appears.** With the locator changed to one that matches nothing, the test failed in words: «Trust strip / expect(locator).toBeVisible() failed / Timeout: 20000ms / element(s) not found», named by its section and reported as the assertion rather than as a test timeout. The change was reverted.
- **Under load.** The full suite at twenty workers on a twenty-core machine: 886 passed. Every admin tab loop passed, including the partnership one that ticket 60's session had seen fail this way.
- **On the runner.** The measurement itself ran green in shard 2/4, the shard that had been failing.

### Seen while measuring, and not fixed here

Two other failures under twenty-worker load, neither an assertion budget and neither this ticket's:

- `health.spec.ts` › «/blog loads with no console errors and no failed requests», from a 500 on `/api/media/file/image-…-480x270.webp` — the server logged «File … for collection media is missing on the disk». A media file is being removed while another test renders a page that wants it. Ticket 60's session saw the same. Worth a ticket of its own.
- `home-before-after-and-calculator-match-reference.spec.ts:139` › «dragged, at 1024x900», a bare thirty-second test timeout under load. The deadline raised here may well settle it; if it recurs, it needs its own look rather than a bigger number.

### Two things found while bringing `main` in

**Ticket 33's raised bound could not have been reached.** `home-text.spec.ts`'s revalidation poll was given `{ timeout: 60_000 }` on that branch, inside a test whose deadline was still Playwright's default thirty seconds — so the poll would have been cut off at thirty with «Test timeout of 30000ms exceeded», which says nothing about the publish it was waiting for, and the extra thirty seconds it asked for were unreachable. The deadline raised here is what lets that bound mean what it says. It is the same trap this ticket's own budget had to avoid, found in someone else's fix.

**The line number in the CI logs is the reporter's, not a phantom file.** Ticket 33's notes leave it open, «worth a moment's suspicion from whoever next reads a line number in these logs»: CI reported the failing test at `home-text.spec.ts:628` while every commit has it at 540. It is not a mystery and nothing is out of step — Playwright's own `--list` prints 628 for that test on an ordinary checkout:

    npx playwright test --grep-invert @pixel --shard=2/4 --list
    [chromium] › e2e\home-text.spec.ts:628:1 › a change to the home page published reaches visitors

So the reporter numbers a `test()` by something other than the source line, and a line number from these logs should be matched to a test by **name**, not by counting lines.

**Twenty seconds did not settle it, from the ticket 60 lane (20 September 2026).** A full local run of ticket 60's branch with this ticket's `playwright.config.ts` already in it — `TEST_PORT=3160 npm test -- --grep-invert @pixel --workers=20`, 891 passed, 3 failed — failed twice on this shape, in two files in the one run:

- `home-text.spec.ts` › "the hero has no switch to hide it; every other section of the home page has one", on the Situations tab
- `referral-page-text.spec.ts` › "the sections the hero lands on have no switch to hide them; a section that can hide has one"

Both read `expect(locator).toBeVisible() failed … Timeout: 20000ms … Error: element(s) not found`, so the panel had not rendered the switch after twenty whole seconds. That does not look like the stall this ticket measured at 4–99ms: something the admin does after a tab is clicked sometimes does not happen at all, and a longer bound cannot cover that. Worth reopening as its own question — what the admin is doing with the click, not how long it is given — before the number here is raised again.

The third failure in that run was the `/blog` media-file 500 already noted above. Ticket 60's own eleven waits passed in that run, as in every other.

## Reopened, and what the admin is doing with the click

**Built on 21 September 2026**, on the question the note above left open. The answer is not a number, so the twenty seconds in `playwright.config.ts` stay exactly as they were.

**The admin undoes the click.** A page entry's tabs are Payload's (`@payloadcms/ui/dist/fields/Tabs`), and Payload remembers which tab an editor last had open. When the form mounts it fetches that preference — one `GET /api/payload-preferences/global-<slug>` — and when the answer lands it sets the open tab to the remembered one, whenever that is. A tab clicked while the request is still in flight is therefore set, and then unset: the button keeps the focus the click gave it, the panel beside it goes back to the remembered section's fields, and on a first visit the remembered section is the first tab — the Hero. Nothing retries, because from the admin's point of view nothing failed.

That is the CI failure exactly, including the part of it that read as a contradiction. The trace from run 35529201175 showed `button "Trust strip" [active]` beside the Hero's fields: `[active]` in an accessibility snapshot is the focused element, not the open tab. The click was never lost; its effect was.

**Held up on purpose, it happens every time.** Delaying that one request with `page.route` reproduces it at will. The timeline below is one local run, and the shape is the same however long the hold:

    262ms   GET  /api/payload-preferences/global-home-page   (held)
    282ms   the entry has loaded
    352ms   Trust strip clicked; the open tab is Trust strip
    1881ms  the open tab is Trust strip
    2271ms  the GET let through
    2283ms  <- 200
    3900ms  the open tab is Hero

**So no bound could have covered it.** `toBeVisible` was waiting for a switch the admin had already taken away, and would have gone on waiting; twenty seconds failed for the same reason five did. What is wrong is the order of two things, not the time allowed for either — which is why the note above was right that this needed reopening rather than a bigger number.

**A stall is still the trigger, which is why only CI sees it.** The window is the length of that one request. On a machine nobody is squeezing it closes in tens of milliseconds and a test never gets inside it; on a two-core runner that is also serving the page and driving the browser it is occasionally long enough — twice, in two suites, in the one twenty-worker run recorded above. Both of those tests are among the ones changed here.

**The fix is in the tests, and it is the order.** Two helpers in `tests/e2e/cms.ts`, used by the six page-text suites:

- `openPageEntry(page, slug)` goes to the entry and does not hand it back until the admin has had its answer. The restore happens once and the admin keeps the preference for the life of the page, so every click after that is the editor's own and there is nothing left to undo it.
- `openSection(page, name)` clicks the tab and waits for it to be the open one — `tabs-field__tab-button--active`, which is how Payload marks it. A failure there says «the Situations section did not open» instead of leaving a later assertion to report a missing switch it cannot account for.

**`openSection` also closes a way for these tests to pass wrongly.** Clicking a tab and reading the panel took for granted that the panel was that tab's. It need not be: the restore can put another section there, and the section it remembers is whichever the last test left open, which is not the first. A run in which the admin reopened some other hideable section would have found a switch and agreed that the section under test had one — whatever that section actually has. All twenty-eight tabs these six suites open were read that way.

**Why not fix the admin instead.** It is a real defect for an editor too — open a page entry, click a section in the moment before the admin has heard back, and it bounces to the one that was open last — but it is Payload's, in a component of theirs, and every way of reaching it from here is worse than the bug. A field's own `admin.components.Field` replaces the whole tabs field, and Payload's `TabContent` reads that same custom component back through `useField` and renders it, which by the look of the code is a loop. A custom provider cannot reach the preferences context, which Payload does not export. Patching `node_modules` would add a dependency and a postinstall step to the site, against a file compiled by the React compiler whose memo slots are numbered. What is left is worth saying rather than building: an editor who meets this clicks the tab again.

### Verified

All on `TEST_PORT=3161`, on the machine this was written on: 20 cores.

- **The guard is real.** `home-text.spec.ts` now holds that request up for two seconds and asserts that the section it opens stays open. With the wait inside `openPageEntry` skipped, it fails where it should — «the test was given the entry before the admin had asked which tab to reopen» — and passes with it. The first reproduction, before any fix, ended with the Hero's fields in the panel and no switch anywhere, which is the CI failure to the letter.
- **The six suites together:** 43 passed, every tab loop among them.
- **The full suite:** 922 passed at eight workers, green. Four more runs at twenty workers — about 145 tabs opened under load in all — never failed a tab assertion, and failed nothing this changed.

### Seen in those twenty-worker runs, and not this ticket's

- **The server dropped connections**, `apiRequestContext.get: read ECONNRESET`, once in each of three runs and in a different test each time: `cms.spec.ts` on `GET /`, `start-page.spec.ts` on `GET /start`, `page-text.spec.ts` on an API read before it had done anything. Never at eight workers. It is the machine at twenty workers rather than anything a test does, which is why it is written down here rather than filed.
- **`case-studies.spec.ts:133`** twice, waiting for a published case study to put its link in the header of `/product` and giving up at twenty seconds. That is ticket 62's shape — a publish wait on a budget sized for a re-render — and its line is noted on that ticket.
- The two failures recorded further up as seen while measuring were not looked at again: the `/blog` 500 from a resized image another test has removed, and the drag in `home-before-after-and-calculator-match-reference.spec.ts` that ran out of its deadline under load. Neither recurred here.
