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

## Seen once at the full minute, on a runner (20 September 2026)

Not one of the twenty-one above — this was ticket 60's own wait, at its measured budget, on the partnership page:

```
Error: the partnership page's reworded paragraph never reached a visitor at
/partnership in 60065ms; Next said HIT of the page it last sent
```

`tests/e2e/partnership-page-text.spec.ts`, shard 3 of 4, run 35538148646, on a commit whose whole diff was markdown and one test file. `HIT` for the entire minute means Next answered every one of those 240 requests from what it had built before — not a render that queued behind others and arrived late, but a page that was never rebuilt at all, or was marked after the wait began.

That is a different failure from a budget being too small, and raising the number would not have caught it. Worth establishing which it is before this ticket picks a number for the other twenty-one: if a publish can fail to mark a page, every wait in the suite is waiting on something that may never come, and the budget is beside the point.

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

**It cost a run again on 21 September 2026, in ticket 30.** `tool-page-text.spec.ts` › "a change published reaches visitors" timed out after 60 seconds on shard 4 — *"Next said HIT of the page it last sent"* — and passed on a re-run with no change, and passes locally 24 of 24. So it is this ticket's flake rather than a regression.

Worth noting for whoever takes this: **the tool page grew a read that day**. Ticket 30 gave it the download form's own words (`formPageWording(TOOL_DOWNLOAD)`), so its rebuild does one more CMS read than it did, and on a two-core runner that is enough to push it past the budget more often. The budget is the thing to fix — the read is correct and every other page already does the same — but it means this suite is now the likeliest of the five to go red, and the argument for doing this ticket sooner rather than later.

**And again the same hour, on a pull request that changes one markdown file.** This one — tracker text, no code — lost shard 2 to `home-calculator`'s publish wait, at `/`, with the same sixty seconds and the same `HIT`. A docs-only change cannot have caused it, so this is now proven to be the suite's own, not any ticket's.

**Worth saying before anyone raises the number: sixty seconds of `HIT` may not be slowness at all.** `reachesVisitors` (ticket 60) asks every 250 milliseconds and reports what Next said of the page it last sent. A render that is merely slow answers `MISS` or `STALE` and then arrives; a page that answers `HIT` for sixty seconds running is a page whose cache nothing invalidated. Both failures said `HIT`. That points at `refreshSiteWhenPublished` → `revalidatePath('/', 'layout')` not reaching those pages on that runner, rather than at a budget too small — and raising the budget would then only make the suite slower before it fails.

So this ticket is a diagnosis before it is a number: reproduce with `x-nextjs-cache` logged on every poll, and find whether the revalidation happened at all, before deciding what the wait should be. `/diagnosing-bugs` is the shape of it — a command that already goes red, then the cause.

## The diagnosis this ticket asked for first

**The sixty seconds of `HIT` is neither a small budget nor a lost mark.** The mark happens; the publish is fine. What happens is that a render which started *before* the publish finishes *after* it, and writes the words it read — the ones the publish replaced — back into the cache. Next decides whether a cached page is past a mark by when the page was written, not by what is in it (`areTagsExpired` in `node_modules/next/dist/server/lib/incremental-cache/tags-manifest.external.js`, against the `Date.now()` that `FileSystemCache.set` stamps as it writes). A page written after the mark therefore counts as fresh, holding what the publish replaced, and every request after it is a `HIT` of that — until somebody publishes again.

So the answer to the question this ticket raised is the second one, and worse than it looked: **the page is not late, it is wrong**, and no budget reaches it. Raising the number only makes such a run slower before it goes red. That is now **ticket 64**, where it belongs: it is a visitor-facing bug — an Editor publishes and the site can keep serving the old page — and the fix changes what publishing does on every page, which is a founder's call and an ADR.

**Reproduced, deterministically, 21 September 2026**, three rounds, three stuck pages, 115 consecutive `HIT`s each, on the machine this was written on. A knob held a render open (`SLOW_RENDER_MS` in `cachedEntry`, `src/cms/pages.ts`, added for the experiment and removed after); then: publish anything so the site is marked; ask for `/tool`, so a render starts and reads the words as they are; publish the change under test while that render is still going; then ask for `/tool` until the change shows. It never shows. Without the knob, the same script on an idle machine got the change in 22–300ms every time, `MISS`. The full recipe and the source citations are in ticket 64.

**What that leaves for this ticket**, unchanged: the twenty-one waits have no bound of their own for a rebuild that can take longer than twenty seconds on a runner. A budget is still the right answer for them — for the ordinary case of a page queueing behind every other page the run has asked for, which is what ticket 60 measured.

## The fix

**One more helper beside `reachesVisitors`** in `tests/e2e/cms.ts`, `reaching(what, read)`: the same minute, the same lengthening of the test's own deadline, and a failure that names what never arrived — for the waits that read something other than a page's own words, which is all twenty-one of these (a status, the titles on an index in order, a link in a header, a search description, a placeholder in a form). It wraps `expect.poll`, so every call site keeps the assertion it already made.

**A wait now names the page the next assertion reads.** The publish-wait in `case-studies.spec.ts` waited for the home page and then asserted on `/product`, `/start`, `/case-studies`, the case study's own page, its English address and the sitemap — none of which the home page's arrival says anything about, because each is built again on its own next visit. That is the failure the ticket 61 lane saw at line 166, which was read as a twenty-second budget being too small and was never a budget problem at all. Each of those pages is now waited for where it is read.

**The second half of that test, and two assertions after it, were waiting for nothing**: the unpublished case study's own address and its disappearance from the sitemap were read without a wait, a line after two waits that happened to cover them most of the time. They have their own now.
