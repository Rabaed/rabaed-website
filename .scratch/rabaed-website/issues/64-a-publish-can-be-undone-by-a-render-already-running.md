# 64: Bug — a publish can be undone by a render that was already running

**What is wrong:** An Editor publishes, the change reaches the site, and then the site goes back to the words from before it — for good, until somebody publishes again. Visitors see the old page; the Editor, who checks in preview or after a rebuild, may not. On CI it is a red run on a page nobody touched, with Next reporting a cache `HIT` for the whole of a sixty-second wait (ticket 62).

**Blocked by:** nothing. The founder's call is made — mark twice, see "Decision" at the foot.

**Status:** resolved — publishing marks the site again ten seconds later, ADR-0017

- [x] A change an Editor publishes reaches every page, whatever was being rendered at the time
- [x] The cost of the fix — a page built more than once per publish, or a wait before the second mark — is written down and agreed
- [x] Held by a test that fails without the fix, at a seam that does not ship a delay knob in the page's own code
- [x] An ADR records the decision, because it changes what publishing does on every page

## How it happens

Publishing marks every page for rebuilding (`refreshSite` in `src/cms/revalidation.ts`), and Next rebuilds a marked page on its next visit. Next decides whether a page it has cached is past a mark by **when the page was written**, not by what is in it: `areTagsExpired(tags, lastModified)` in `node_modules/next/dist/server/lib/incremental-cache/tags-manifest.external.js` treats an entry as expired only where the mark is *later* than the entry's own timestamp, and `FileSystemCache.set` stamps an entry `Date.now()` as it writes it.

So a render that starts before a publish and finishes after it writes the words from before the publish into the cache, stamped after the mark — and Next counts that as fresh. Nothing marks it again until the next publish, so it is not a page that arrives late. It is a page that never arrives.

    read the words  ──►  publish marks the site  ──►  render finishes and is cached
         (old)                    (mark)                  (old words, newer stamp)

On an idle machine a render is 20–90ms and the window is almost nothing. Under load it is seconds: the suite publishes from twenty workers while every page is being asked for, and a hosted runner renders on two cores. That is the shape of the failures in ticket 62 — including one on a pull request whose whole diff was markdown.

## Reproduced

Three rounds, three stuck pages, 115 consecutive `HIT`s each, 21 September 2026, on the machine this was written on. With a knob that holds a render open (`SLOW_RENDER_MS`, added to `cachedEntry` in `src/cms/pages.ts` for the experiment and removed after):

1. publish anything — the site is marked, so the next visit renders;
2. ask for `/tool` — the render starts and reads the words as they are;
3. publish the change under test while that render is still going;
4. ask for `/tool` until the change shows.

It never shows. Without the knob, the same script on an idle machine gets the change in 22–300ms every time, `MISS` — which is why this has only ever been seen on a loaded machine.

## What could be done, and what it costs

Next offers nothing that closes the window: every invalidation it has — `revalidatePath`, `revalidateTag`, `updateTag` — is a timestamp compared against the entry's own, and a custom cache handler is ignored on Vercel, which runs its own. So the lever we have is **when we mark**.

- **Mark twice: at the publish, and again a few seconds later.** A render in flight at the first mark has finished by the second, so its stale page is expired and the next visit rebuilds it from what is published. Costs a second rebuild of each page an Editor's publish touches, and needs the server to stay awake between the two — `after()` from `next/server` on Vercel, which bills for the wait. The delay has to be longer than a render can take: measured, not guessed.
- **Do nothing and let the tests absorb it.** No wait can: the page is not late, it is wrong until the next publish. This is the option that leaves ticket 62's suites red now and then, and leaves visitors on the old page.
- **Report it upstream.** Worth doing whatever else is decided, but it is not a fix on any timescale of ours.

**The founder's call** is the first one: a publish costing every page two rebuilds instead of one, and a few seconds of function time, against a rare page that stays wrong until the next publish. Ticket 62 is what it costs today — a suite that goes red on changes that cannot have caused it.

## Seen again — on the pull request that diagnosed it

Run 35568626883, shard 3 of 4, 21 September 2026, the branch for ticket 62:

```
Error: the partnership page's reworded paragraph never reached a visitor at
/partnership in 60254ms; Next said HIT of the page it last sent
```

`partnership-page-text.spec.ts`, one of ticket 60's eleven waits — not one of the twenty-one ticket 62 touched, and on a branch whose whole diff is tests and tracker text. The other three shards passed, and so did four full runs of the same suite on a twenty-core machine. That is this ticket exactly: a page re-cached by a render that was already going, sixty seconds of `HIT`, nothing late about it.

It is worth saying plainly what that means for the suite: **CI will go red like this now and then whatever the tests do**, on changes that cannot have caused it, until this is fixed. Each time costs a re-run. That is the running cost to weigh against the cost of the fix.

## Comments

**A rung the options list was missing.** The three options above are "mark twice",
"do nothing" and "report upstream", and the middle one is harsher than it needs to
be. What makes this bug expensive is not that the window exists — it is that a page
caught by it stays wrong until the next publish, because nothing else in the site
ever rebuilds a page. Ticket 66 puts a maximum age under every cached page, which
does not close the window but turns "wrong until somebody publishes" into "wrong
for a few minutes".

That changes what this ticket is deciding. With 66 in place the question stops being
about correctness and becomes one about speed: should an Editor's change reach
visitors in under a second every time, or is within the backstop good enough on the
rare occasion the race is lost? That is a much cheaper decision to get wrong, and it
can be taken after watching how often CI goes red with 66 in place rather than
before.

**Suggested order:** ticket 66 first — it is unblocked, needs no founder's call
beyond the number, and covers failures beyond this one. Ticket 67 alongside it,
costing nothing. Then this ticket, with real numbers behind it.

**Still true whatever is decided:** the founder's call on marking twice, and the ADR
it needs, because it changes what publishing does on every page.

## Decision

**Mark twice.** The founder's call, 23 September 2026, taken with ticket 66's
ten-minute age already on `main`.

- **What publishing does from here:** every publish marks the site stale at
  once, as `refreshSite` does today, and marks it again after a delay, so that
  a render already running at the first mark has finished by the second and
  its stale page is rebuilt on the next visit. An Editor's change reaches
  visitors in under a second every time, not "almost always, and within ten
  minutes otherwise".
- **The cost, agreed:** each page a publish touches is built twice rather than
  once, and the server stays awake for the delay after the Editor's request has
  been answered — `after()` from `next/server`, billed on Vercel. The Editor
  sees no difference: the second mark happens after the response.
- **The delay is measured, not guessed, and its ceiling is ten seconds.** It
  must be longer than the slowest render the site does. If the measurement
  says ten seconds is not enough, **stop and bring the number to the founder
  before building**: a render that slow means something else is wrong, and the
  founder wants to hear that rather than have it built in.

**Why now rather than waiting for numbers**, which is what the comment above
suggested. Ticket 66 made a lost race cost minutes rather than days, so what
decided it was the test runs, which 66 does not help (a publish wait gives up
after sixty seconds). Three of the last sixty CI runs went red on it, all on
the partnership page, 20 and 21 September — none in the forty-odd since, but
with three lanes opening pull requests each one costs a re-run and a session
chasing a failure its change could not have caused. Lane A, which builds this,
is otherwise waiting on ticket 40, so building it costs no one any time.

**Still required, unchanged:**

- An ADR recording what publishing now does — check `origin/main` and every
  open branch for the next free number first; two lanes have collided on ADR
  numbers twice this week.
- A test that fails without the fix, at a seam that does not ship a delay knob
  in the page's own code (the experiment's `SLOW_RENDER_MS` was removed for
  that reason).
- The pull request touches the publishing path in `src/cms/`, so it needs the
  ticket 39a part 5 preview check before it merges.

## Answer

**Resolved, 23 September 2026, branch `ticket-64`.** `refreshSite` marks the
site as before and then, from `after()`, again ten seconds later. ADR-0017 has
the decision and the numbers.

**The delay, measured.** 362 builds timed over a full suite at twenty workers:
Arabic pages median 287ms, English 176ms, the discovery files under 200ms. The
slowest six, 6.1 to 6.3 seconds, came in one burst as the server met its first
wave of requests; below them the slowest was 1.9 seconds. Ten seconds covers the
burst with room for slower machines, and is the founder's ceiling — no need to
bring a number back.

**What the obvious fix would have done: nothing.** Next keeps a request's marks
after sending them and sends a mark made in `after()` only if its tag is new to
the request, so marking the same paths again is dropped in silence. Shown, not
read: with a naive second mark at ten seconds the test below failed exactly as
it does with no fix, `HIT` for the whole minute. The second mark goes through
tags the first does not use — each language's group layout, `/(ar)` and
`/(en)`, and each discovery file's own layout segment — which every page and
discovery file carries beside the first mark's (`x-next-cache-tags`).

**The test, `tests/e2e/stale-render.spec.ts`,** holds a build of `/tool` open at
the database, with nothing in the site's code: it locks the site settings, which
the footer reads after the tool page's own words; publishes new words to the
tool page while that build waits; holds it three seconds more, as a slow build
would be held; lets it go; and waits for the new words.

- Without the fix: never, `Next said HIT` for sixty seconds.
- With the naive second mark: the same.
- With the fix: they arrive 6.7 seconds into the wait — ten seconds after the
  publish, less the three it held the build.

Two things learned on the way, both in the test's comments: a visitor's page
reads the tool page's words from the version history, not the entry, and
Postgres answers `pg_stat_activity` from one snapshot per transaction, so the
test watches from a second connection.

**The first box, precisely:** every page, for any build shorter than ten seconds
— which is every build measured. A build slower than that falls back to ADR-0016's
ten minutes; on CI, under far more load than production sees, one may, and a
publish wait would then read `HIT` throughout (`tests/e2e/cms.ts` says so).
