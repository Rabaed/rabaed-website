# 51: Split the CI tests across four machines

**What to build:** The `test` check runs the end-to-end suite on four GitHub machines at once, each with its own quarter of the tests, so a pull request waits about five minutes for its result instead of about fifteen.

**Blocked by:** nothing.

**Status:** ready-for-agent

- [ ] The suite runs on four machines in parallel, each with a different quarter of the tests, and together they run every test exactly once
- [ ] The pull request still shows one check named `test`, the name `docs/github-ruleset.json` requires, and it fails if any machine fails or is cancelled
- [ ] Typecheck runs once, not on every machine
- [ ] A failing machine uploads its own Playwright report
- [ ] The time a pull request waits for `test` is measured before and after

## Why

A pull request waited 13–15 minutes for `test` on 13 September 2026 (PR #17). Setup and the build take about a minute. The rest is the suite, and the runner's log says why: "Running 585 tests using 1 worker". Playwright uses half the machine's cores by default, and the hosted runner for this private repository is small enough that half its cores is one. The same suite takes about 1.5 minutes on a 20-core development machine with 10 workers.

Running two workers on the same small runner was considered and not chosen: it would save less, and ticket 50 shows what load does to the timing-sensitive tests. Larger paid runners are a billing decision for the founder.

## Comments
