# 48: Several agent sessions working tickets at the same time

**What to build:** More than one agent session can implement tickets at once — each in its own git worktree — without the sessions stopping each other's test runs, taking the same ticket, or hesitating because the rules say tickets go one at a time in number order.

**Blocked by:** nothing.

**Status:** resolved

- [x] Two copies of the repo on one machine can run the test suite at the same time
- [x] The rule for choosing a ticket allows any ticket whose blockers are resolved, in any order
- [x] A session can tell which tickets another session already holds
- [x] Sessions have one place to read how to work alongside others

## Comments

**Why now.** The founder decided on 13 September 2026 to run three sessions at once. Before that could start safely, three things stood in the way; this ticket is two of them, and the third was ticket 46, fixed in the same pull request.

### The test port

`playwright.config.ts` started the site on port 3100 every time and refuses, on purpose, to reuse a server already running there, so a second copy of the repo running its tests stopped at once with "is already used". The port is now read from `TEST_PORT`, defaulting to 3100, and a value that is not a usable port stops the run with a message saying so.

Checked with a stand-in server holding port 3100: without `TEST_PORT` the run stopped with "is already used"; with `TEST_PORT=3101` all six tests of the run passed; with `TEST_PORT=abc` it stopped with the new message.

### Choosing and claiming a ticket

`CLAUDE.md` said the tickets were "worked in number order", which an agent follows literally. It now says any ticket whose blockers are all resolved may be taken, in any order, and points at the one rule for it: "Taking an implementation ticket" in `docs/agents/issue-tracker.md`.

**A claim is a pushed branch named exactly `ticket-NN`.** Sessions work in separate checkouts, so an edit to a ticket file in one is invisible to the others until it is merged; a branch on GitHub is visible to all of them. The fixed name means two sessions cannot hold one ticket under two branch names, and merging with `--delete-branch` releases it, so finished tickets do not stay "held". It is a convention rather than a lock — two sessions claiming in the same moment could both succeed — which is why each session is also given its own lane.

`issue-tracker.md` already had a "Claim" rule — set `Status: claimed` — and "first by number wins". Both belong to `/wayfinder` maps, not to implementation tickets, and the new section says so, so an agent does not apply them here. `claimed` is not a status this repo's tickets use.

### The lanes are in the tracker, not only in advice

The plan gives session C the start, tool, referral and partnership pages only after ticket 11 has merged, because 11 builds the FAQ's disclosure pattern and the form markup all four reuse. Tickets 13–16 were blocked only by 04, so a session following the rule above could have taken them early and built those pieces a second time. **Ticket 11 is now on each of their Blocked by lines**, with a comment saying why.

### How sessions work alongside each other

`docs/agents/parallel-sessions.md`, which `CLAUDE.md` points to when working in a git worktree: claim, test on `TEST_PORT=31NN` (ticket 12 tests on 3112, so no session asks another which port is free), hand over a pull request, start the next ticket from a fresh `origin/main`, and where collisions are expected.

### For the founder: setting up a session

Once per extra session, from the main checkout with `main` up to date:

```bash
git worktree add --detach ../rabaed-b origin/main
```

then `npm ci` inside the new folder, and open the session on that folder.

**Worth knowing:** Claude's memory for this project, and any `.claude/settings.local.json` permissions, are tied to the folder a session is opened on. A session opened on `../rabaed-b` starts without them — including the note that explanations should be in plain language.

### What the review changed

- **The claim was overstated.** A pushed branch was called "the claim other sessions check" as if it were a lock. It is a convention, and the doc now says so; the branch name is fixed so two sessions cannot claim one ticket under two names, and merging releases it.
- **Two claim rules disagreed.** The new doc defined claiming while `issue-tracker.md` already had a Claim rule. There is one rule now, in `issue-tracker.md`, and the wayfinding rules are marked as wayfinding's.
- **"Taken blockers first" read as "do the blocking tickets first."** The wording now says any ready ticket may be taken in any order.
- **Session C's wait for ticket 11 existed only in advice.** It is on tickets 13–16's Blocked by lines.
- **The doc for agents carried steps for the founder**, restated the test config's explanation of the port, and ended two steps without saying when they were done. The founder's steps are here instead, the explanation lives only in `playwright.config.ts`, and every step ends on a check.
- **CLAUDE.md pointed at the doc on a condition an agent cannot observe** — "more than one session is implementing tickets" — and now on one it can: working in a git worktree.
