# 94: A page's content loader reads through an adapter, and shapes what it read in a step that can be tested alone

**What to build:** split each loader in `src/content/pages/*.ts` into two steps:
- **reading the entries**, through an adapter: Payload on the site, and an in-memory set of entries in a test;
- **a pure step** that shapes what was read into the page for a locale.

A generic "the word in this language" step replaces most of the ~290 mechanical `words()` copies (home 85, tool 59, referral 46, partnership 44, product 39, start 16).

**Why:** the loaders hold real rules, and those rules can be tested only by publishing through the admin in a browser and polling until the page shows the change. Examples:
- the hero's button is hidden when the four units are hidden;
- units are numbered by their place, and filled to four (`fillToFour`);
- where each link leads.

Those publish-and-wait tests are the ones that time out on CI (tickets 60–62). `pageEntry` imports `@payload-config` and `next/headers` directly, so no loader can run without Payload. The rules also mix with plain copying, which the reader has to skip past to find them. The "sections fetch nothing" rule in `page-content.ts` is already breaking down: `screen-mock-picture.tsx` calls `getSwipeHint` (ticket 77), and `structured-data.tsx:184` fetches the header once per breadcrumb step.

Found by the architecture review of 24 September 2026 (A4).

**Blocked by:** 95. Testing the pure step directly is a second test seam, which the spec permits only for "pure calculation with no I/O" and names two of (spec: Testing Decisions).

**Status:** needs-triage — worth exploring; it depends on the spec change in 95, and a first page (the home page) should prove the shape before the rest follow

- [ ] The founder has agreed to the spec change in 95
- [ ] The home page's loader is split first. Its rules are tested directly, and the browser tests that existed only to reach those rules are trimmed. The ticket reports how much faster those tests run
- [ ] If the shape holds, the other five loaders follow, in this ticket or in tickets of their own
- [ ] Components get what they show from their loader, and fetch nothing themselves: the swipe hint and the breadcrumb names included
