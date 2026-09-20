# 62: Bug — the same wait for a published change is on the default in four more suites

**What is wrong:** Ticket 60 gave the six page-text suites a wait sized to what a publish actually costs. Twenty-one more waits in five other suites have no bound of their own for the same thing — a change published in the CMS reaching a visitor. Ticket 61 has since given every retrying assertion twenty seconds, so these are no longer on five; but the home page's publish wait has been seen to take longer than twenty seconds on a hosted runner (ticket 60), so a number sized for riding out a stall is not necessarily enough for a page rebuild.

- `tests/e2e/blog.spec.ts`: lines 110, 193, 194, 214, 235, 286, 323, 328, 329, 341, 358, 370
- `tests/e2e/case-studies.spec.ts`: 162, 216, 217, 233
- `tests/e2e/faqs.spec.ts`: 221
- `tests/e2e/cms.spec.ts`: 135, 153, 263 (the site settings' WhatsApp number, and a legal page's search description)
- `tests/e2e/form-submission.spec.ts`: 323, where a form's published wording has to reach all three places it appears

**Reported by:** two full local runs while verifying ticket 60, 20 September 2026, both `TEST_PORT=3160 npm test -- --grep-invert @pixel --workers=20`, both before ticket 61 raised the default:

- 884 passed, 3 failed — one of them `tests/e2e/blog.spec.ts:335` › "an article exists per language, and a missing translation offers the one that exists", "Timeout 5000ms exceeded while waiting on the predicate" at line 370, `expect.poll(… .status).toBe(200)` on an article just created.
- 893 passed, 1 failed — `tests/e2e/form-submission.spec.ts:380` › "wording an editor publishes reaches the form in all three places, and the confirmation", the same timeout at line 323, waiting for a published placeholder to reach a page.

Nothing was wrong with the article or the wording. Ticket 60's own eleven waits, measured in the same runs, took up to 10.4 seconds under that load — and more than twenty seconds on a hosted runner.

**Blocked by:** nothing. Take it after ticket 60 is merged, so that `reachesVisitors` in `tests/e2e/cms.ts` is there to follow. Less urgent than when it was filed: ticket 61's twenty seconds covers most of these most of the time.

**Status:** ready-for-agent

## Why it happens

The same reason as ticket 60, which `tests/e2e/cms.ts` now sets out above `reachesVisitors`: publishing marks every page of the site for rebuilding, the next visit to a marked page renders it again, and on a loaded machine that render queues behind every other page the run has since asked for.

These twenty are not all the same shape as ticket 60's eleven, so they cannot all take the same helper unchanged: some wait for a status, one for a list of titles in order, one for a footer link, one for a search description. What they can share is the budget and the reason for it.

## Worth considering while fixing it

Every one of these waits is as long as it is because a publish anywhere marks the whole site
(`refreshSite` in `src/cms/revalidation.ts`). That is deliberate, and the comment there says why: the pages a change appears on are easy to under-count. Narrowing it would shorten every wait in the suite and make the site quicker for visitors after an edit, and it would need an ADR to overrule the reasoning that is there — which is a separate decision from making the tests honest, and should not be smuggled into this ticket.

## Done when

- [ ] Each of the twenty-one waits as long as what it waits for can take, from the same measured budget as ticket 60's, wherever ticket 61's twenty seconds is not enough for it
- [ ] A change that genuinely never arrives still fails, and says so in words
- [ ] The full suite is green under load, repeatedly

## Comments

**A twenty-second one of these fails on this machine, 21 September 2026 (from the ticket 61 lane).** `case-studies.spec.ts:133` › "publishing the first case study reveals the section and its link; unpublishing the last hides them again" failed twice in four full local runs at twenty workers (`TEST_PORT=3161 npm test -- --grep-invert @pixel --workers=20`), and passed at eight:

    tests/e2e/case-studies.spec.ts:166
    expect(locator).toHaveAttribute('href', '/case-studies') failed
    Timeout: 20000ms, element(s) not found

That is the header of `/product` still being the one built before the case study was published — the same wait as the rest of this ticket's, on ticket 61's twenty seconds rather than a budget of its own. **Line 166 is not on the list above**, which has 162 from the same test: it is a `toHaveAttribute` rather than an `expect.poll`, so a sweep for polls would miss it, and so may other assertions in these suites that wait for a publish without looking like a wait.
