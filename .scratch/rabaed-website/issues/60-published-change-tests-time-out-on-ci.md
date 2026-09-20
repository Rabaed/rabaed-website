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

**Status:** ready-for-agent

## Why it happens

Publishing a page's entry calls `revalidatePath('/', 'layout')` (`src/cms/revalidation.ts`), which marks every page stale; Next rebuilds a stale page on its next visit and serves the old one until that rebuild finishes. So the wait is not "a moment" — it is one whole server render of that page, and the test's own requests are what triggers it.

Five seconds is the `expect.poll` default, chosen by Playwright, not by anything about this wait. It is enough on a developer machine, where a rebuild of the home page takes well under a second. A hosted runner has two cores and one Playwright worker (`.github/workflows/ci.yml`), and shares them with the Next server that is rebuilding the page, so the same rebuild can take many times longer. Nothing in the test says how long a rebuild is allowed to take, so the number that decides whether CI is green is Playwright's default.

## Done when

- [ ] Each of the eleven waits as long as a rebuild of that page can take on the slowest machine the suite runs on, and says where that number comes from
- [ ] A change that genuinely never arrives still fails the test, and says so in words
- [ ] The eleven pass repeatedly under load, from running the suite rather than from repeating one test as one editor — two logins to one account in the same instant erase each other's session (`tests/e2e/forms.ts`)
- [ ] The full suite is green
