# 61: Bug — assertions against the admin time out on CI

**What is wrong:** `tests/e2e/home-text.spec.ts` › "the hero has no switch to hide it; every other section of the home page has one" clicks each of the admin's eight section tabs and asserts that «Shows on the page» is visible after each click. On a hosted runner the admin does not always finish re-rendering a tab inside the five seconds Playwright gives an assertion by default, and the test fails though nothing is wrong with the admin.

Nothing in `playwright.config.ts` sets an `expect` timeout, so every assertion in the repository — and every `expect.poll` that names no timeout of its own — runs on that same default.

**Reported by:** CI run 35529201175 on pull request #44, 20 September 2026, on the re-run of the `e2e (2/4)` shard: `expect(locator).toBeVisible() failed / Expected: visible`, 225 passed and 1 failed. Pull request #44 changes one line of a markdown file under `.scratch/` — no source, no tests, nothing the site builds — so no change of ours is behind it. The same shard on the same pull request had failed once before that on the publish wait ticket 60 covers, and on pull request #41 twice. Everything passes locally: that exact shard gave 226 passed (`TEST_PORT=3129 npm test -- --grep-invert @pixel --shard=2/4`), and three full local runs gave 887 passed.

**Blocked by:** nothing. Ticket 60 is the same root cause — Playwright's defaults against a two-core runner — in the eleven waits for a published change to reach a visitor, and fixes those with a budget of their own; this is what is left once those are done.

**Status:** ready-for-agent

## Why it happens

Clicking a tab in the admin makes the admin render a panel of fields — React work in the browser, on a runner with two cores that is also serving the request and running the test. `toBeVisible` retries until Playwright's default five seconds is up, and that number was chosen by Playwright, not by anything about how long the admin takes.

## What has to be decided

Two remedies, and they are not equivalent:

1. **Per assertion, waiting for what the admin is actually doing** — the shape ticket 50 and ticket 60 took. Honest where the wait is one identifiable piece of work, and it leaves every other assertion in the repository on a default that will trip the next one.
2. **One `expect` timeout in `playwright.config.ts`** for the whole suite. It covers every assertion at once, including ones nobody has seen fail yet, and it slows every genuine failure down by the difference: a test asserting something that will never be true takes the new timeout to say so.

Whichever is chosen, a number in the config wants the same thing ticket 60's wanted: a measurement on a hosted runner to size it, not a guess.

## Done when

- [ ] The eight tab assertions pass on a hosted runner, repeatedly
- [ ] The number they wait for is measured rather than guessed, and says where it comes from
- [ ] A switch that genuinely never appears still fails the test, in words
- [ ] The full suite is green
