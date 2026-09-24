# Publishing marks the site twice, the second time ten seconds later

Publishing marks every page stale and each is rebuilt on its next visit (`refreshSite` in `src/cms/revalidation.ts`). Ticket 64 found the one way that loses a change without anything going wrong: Next decides whether a cached page is past a mark by **when the page was written**, not by what is in it. A rebuild that read the words just before a publish and finished just after it writes the old words into the cache stamped later than the mark, and Next counts them as fresh. Nothing marks that page again until the next publish. ADR-0016's ten-minute age bounds how long it stays wrong; it does not stop it.

So publishing now marks the site a second time, **ten seconds after the first**, from `after()` — once the Editor's request has been answered. A rebuild that was already under way at the first mark has finished by the second, and its page is marked in turn. Next offers nothing that closes the window itself: every invalidation it has compares a timestamp against the entry's own, and a custom cache handler is ignored on Vercel. When we mark is the only lever. This was the founder's call on 23 September 2026, taken with ADR-0016 already in place: the cost below, against a rare page that stays wrong, and against a test suite that went red on it — three of sixty CI runs, on changes that could not have caused it.

**Ten seconds, and why ten.** The delay has to be longer than the slowest rebuild, measured from when a rebuild starts reading to when it writes. That was measured, not guessed: every page rebuild and discovery file timed over a full suite run at twenty workers, 362 builds in all.

| | builds | median | slowest |
|---|---|---|---|
| Arabic pages | 287 | 287ms | 6,228ms |
| English pages | 55 | 176ms | 6,300ms |
| `sitemap.xml` | 13 | 21ms | 189ms |
| `llms.txt` | 7 | 60ms | 143ms |

The slowest six, all near 6.2 seconds, came together in one burst as the server met its first wave of requests — the shape of a cold server in production. Below them the slowest was 1.9 seconds. `robots.txt` was not timed; it reads one setting. Ten seconds covers the burst with room for machines slower than the one measured, and is the ceiling the founder set: past it, the building session was to stop and bring the number back rather than build it in.

**What was not measured: CI.** The timings are from a twenty-core machine. CI's two-core runners, where ticket 62's red runs happened, run CI only on a pull request, and were not instrumented; the margin above is a judgement about them, not a measurement of them. If a publish wait on CI still reads `HIT` throughout after this, that is where to look first.

**The second mark is written with different tags from the first, and must stay that way.** Next keeps a request's marks after sending them, and a mark made in `after()` is sent only if its tag is new to that request. The obvious second mark — `refreshSite`'s own calls again — marks the same tags, and Next drops it without a word. Tried, it fails exactly as no fix does: the test below saw Next answer `HIT` for a full minute with a naive second mark firing at ten seconds. So the first mark goes through the root layout and each discovery file's address, and the second through each language's group layout, `/(ar)` and `/(en)`, the not-found page's own (it sits in neither group, and shows words from the CMS), and each discovery file's own layout segment. Every page and discovery file carries both tags (`x-next-cache-tags` in the build's `.meta` files), so either reaches it. A route handler's layout tag is Next deriving one from every path segment, not something its docs promise for route handlers; `revalidation.ts` says so where it relies on it.

## Consequences

- **An Editor sees no difference.** Publishing answers as it did; the second mark happens after.
- **Every publish costs a second rebuild of each page someone visits between the marks and after them,** and keeps the server awake for ten seconds — `after()` holds the function open on Vercel, which bills for it. A publish that marks the site several times in one request waits once (`secondMarkAsked` on the request's `context`).
- **A page caught by the race is wrong for at most ten seconds plus one rebuild**, not ten minutes. ADR-0016's age stays as the floor under every other way a mark can be lost.
- **A rebuild slower than ten seconds escapes the second mark** and falls back to the ten-minute age. None was measured; on CI, under far more load than production sees, one may happen, and a publish wait then reads `HIT` throughout. `tests/e2e/cms.ts` says so where that failure is reported.
- **Held by `tests/e2e/stale-render.spec.ts`,** which reproduces the race at the database rather than in the site's code: it locks the site settings, so a rebuild of `/tool` reads the tool page's words and then waits for the footer's; publishes new words while it waits; lets it go; checks the held rebuild answered with the words from before, so the race really was set up; and expects the new words to arrive. Without the second mark they never do. It runs with the suites that run last (`playwright.config.ts`), beside others that publish — a publish of theirs in its wait would rescue the page — so in the full suite it is a guard, and the proof that it fails without the fix is a run of it alone. *Amended 24 September 2026 (ticket 89):* it now runs on the test suite's second server, where suites run one at a time (`playwright.config.ts`), so no other suite's publish can land in its wait: in the full suite it is the proof as well as the guard.
- **Anyone reworking `refreshSite` must keep the two marks' tags apart.** The comment above `markAgain` says why, and the test is what catches it.
- **This is the previous caching model**, as ADR-0016 says of itself. The day Cache Components is turned on, `revalidatePath` behaves differently and this decision has to be revisited with it.
