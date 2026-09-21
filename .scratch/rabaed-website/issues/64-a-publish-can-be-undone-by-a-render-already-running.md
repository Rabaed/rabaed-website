# 64: Bug — a publish can be undone by a render that was already running

**What is wrong:** An Editor publishes, the change reaches the site, and then the site goes back to the words from before it — for good, until somebody publishes again. Visitors see the old page; the Editor, who checks in preview or after a rebuild, may not. On CI it is a red run on a page nobody touched, with Next reporting a cache `HIT` for the whole of a sixty-second wait (ticket 62).

**Blocked by:** nothing. The decision below wants the founder before the code does.

**Status:** needs-info — what it costs to fix is a founder's call (below)

- [ ] A change an Editor publishes reaches every page, whatever was being rendered at the time
- [ ] The cost of the fix — a page built more than once per publish, or a wait before the second mark — is written down and agreed
- [ ] Held by a test that fails without the fix, at a seam that does not ship a delay knob in the page's own code
- [ ] An ADR records the decision, because it changes what publishing does on every page

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
