# Parallel sessions

For a session working in a git worktree while other sessions take tickets from the same tracker. How to choose and claim a ticket is in "Taking an implementation ticket" in `docs/agents/issue-tracker.md`; this is what changes when others work alongside you.

## Sessions

One **Orchestrator** and two **Mains** run the work; each ticket is built by its own **lane** session. A session's name says which it is: `Orchestrator`, `Main 2`, `Main 1, lane B – ticket 102`.

| Session | Job | Works in |
|---|---|---|
| Orchestrator | Assigns specs to Mains, keeps the rule files, settles shared-file claims, merges ready pull requests, cleans up after merges | its own worktree, for rule-file pull requests only |
| Main 1, Main 2 | Plans the specs that name it: grill, spec, tickets, answering its lanes | its own worktree |
| Lane 1a–1d, 2a–2d | Builds one ticket and opens its pull request | its own app-made worktree, one ticket per session |

Every session leaves the main folder (`D:\Rabaed Work\Agentic Website`) on `main` and unedited, apart from the board below.

### Orchestrator

1. **Assigns** a spec once the founder says which Main takes it: a `**Main:** 1` or `**Main:** 2` line under the title of its `spec.md`.
2. **Keeps the rule files** — `CLAUDE.md`, `AGENTS.md`, `docs/agents/*` — in small docs-only pull requests from its own worktree. Other sessions send it the change they want.
3. **Settles claims**: decides between two Mains wanting the same shared file, and sets the merge order when two open pull requests touch one file.
4. **Merges** a lane's pull request on the founder's go, once the lane has said "PR #n ready" and `test` is green on its head: `gh pr merge <n> --merge`, one at a time. A pull request behind `main` or conflicting goes back to its lane to merge `origin/main` and go green again. Then it tells the owning Main.
5. **Cleans up** after a merge: checks the ticket merged `resolved`, the claim branch is released and the lane's board line is gone, and asks the lane (or the founder) about anything left.
6. **Checks in** every 30 minutes while lanes run, with the prompt below, and writes one line per check-in to its scratchpad's `check-in-log.md`.

The founder alone starts lanes, settles `decide` tickets and approves deleting a remote branch. Auto-merge stays off. A command one session's permissions refused is not run for it by another.

```
Orchestrator check-in. Quietly:
1. Handle messages from Mains and lanes.
2. gh pr list --repo Rabaed/rabaed-website --state open --json number,title,isDraft,mergeable,headRefName
   Conflicting or behind main: tell its lane to merge origin/main and go green again.
   Said "ready" and test green on its head: merge it if the founder has said to; otherwise tell the founder it is ready.
3. A failed test check: read the run's log and send the fix to the owning Main.
4. After a merge: the ticket is resolved, the claim branch released, the board line gone.
5. A board.md line whose ticket-NN branch is merged or gone is stale: ask its Main.
Start no lanes and settle no decide tickets without the founder.
```

### Main 1 and Main 2

1. **Grills** a spec with the founder (`/mattpocock-skills:grilling`, `/mattpocock-skills:domain-modeling`). The decisions land as an ADR plus `GLOSSARY.md` entries, in a docs-only pull request that merges before the spec does.
2. **Writes the spec and its tickets** under `.scratch/<feature>/` as `issue-tracker.md` describes, each ticket with a `**Lane:** 1a` … `**Lane:** 1d` line (Main 2: `2a` … `2d`), in a docs-only pull request that merges before any lane starts. Tickets that touch the same files share a lane, so they queue instead of colliding.
3. **Numbers** a ticket or ADR one past the highest on `origin/main` and on every open branch (`git ls-remote --heads origin`). The other Main may still take the same number; whichever merges second renumbers.
4. **Proposes** its lane sessions once the founder says go: a fresh worktree session per ticket, which the founder starts.
5. **Answers** its lanes and reviews their pull requests against the spec. Building a ticket is the lane's job; a rule-file change goes to the Orchestrator.

### Lanes

1. **Takes** the lowest-numbered ticket with its `**Lane:**` line that is ready and unclaimed, then follows "Working a ticket" below.
2. **Builds test-first** (`/mattpocock-skills:tdd`) and reviews its own diff (`/mattpocock-skills:code-review`) before handing over.
3. **Writes the board**: its `board.md` line on claiming, a `claims.md` line before changing a shared file.
4. **Says "PR #n ready"** to the Orchestrator once the pull request is open, reviewed and green. After the merge it removes its board line, appends a RELEASE for each claim and says "lane done #n". The founder archives the session.

## The board

Live state sits in `D:\Rabaed Work\Agentic Website\.claude\coordination\`, in the main folder so every worktree on the machine reads the same copy, by that absolute path. It is git-ignored: nothing in it is committed.

- **`board.md`** — one line per ticket being built, added on claiming and removed after the merge. The claim branch is still the claim; the board says who holds it.

  `102 | Main 1, lane B | ticket-102 | started 2026-11-04 10:20`

- **`claims.md`** — shared-file claims, appended and never edited. A file is held while its last line is a CLAIM.

  `CLAIM src/styles/home.css — Main 1, lane B, ticket 102 — 2026-11-04 10:25`
  `RELEASE src/styles/home.css — ticket 102 (PR #130) — 2026-11-04 15:02`

  The shared files: the home page (`src/app/(ar)/page.tsx`, `src/styles/home.css`), `package.json`, `package-lock.json`, `.github/workflows/*` and `src/payload.config.ts`. Two lanes change a shared file one after the other: across Mains the claims decide, within one Main the tickets share a lane.

## Working a ticket

1. **Claim** a ready ticket as `issue-tracker.md` describes. Done when `git ls-remote --heads origin ticket-NN` lists your branch.
2. **Test on the ticket's own port**, `TEST_PORT` = 3100 plus the ticket number: ticket 09 tests on 3109, ticket 102 on 3202. Done when the full suite is green on that port.
3. **Resolve the ticket on its branch** as `issue-tracker.md` describes. Done before the pull request opens, so the `Status:` line merges with the work rather than needing a pull request of its own.
4. **Hand over**: push and open a pull request against `main`. Done when its `test` check is green. The founder decides when it is merged.
5. **Release the claim** once it is merged, as `issue-tracker.md` describes. Done when `git ls-remote --heads origin ticket-NN` comes back empty.
6. **The next ticket** on the lane goes to a new lane session, on a new branch from a fresh `origin/main`, so it builds on everything merged since.

A claim is a convention, not a lock: two sessions claiming the same ticket in the same moment could both succeed. Each lane has its own tickets, which keeps that rare.

## Where sessions collide

- **The home page** (`src/app/(ar)/page.tsx`, `src/styles/home.css`) changes with every home ticket, so those tickets belong to one lane.
- **Every new page** adds itself to `tests/e2e/routes.ts`, and many add to `src/styles/tokens.css` and `responsive.css`. Conflicts there are expected and small: update from `origin/main` and resolve them with `/resolving-merge-conflicts`.
- **Screen mock export** (`npm run mocks:export`) uses one fixed port and refuses to start when it is taken, so exports run one at a time.
- **Suites run side by side collide in time, though not in data.** Each checkout's suite has its own server and database, but they share the machine, and every page build, publish and wait is slower for it. `stale-render.spec.ts` holds the site settings at the database for a few seconds, and while they are held every page build waits, holding one of the server's ten database connections as it does. On 23 September 2026 two suites running at once slowed things enough that all ten were taken, and the test's publish waited for a lock that was waiting for it: six tests failed at the two-minute deadline, on changes that could not have caused it, while CI was green (ticket 70). That hold now lets go at ten seconds, and since ticket 89 it happens on the second test server, where nothing else runs beside it. A machine running two suites can still turn a pass into a fail, though. **A local red that CI does not share, from a run made while another suite was running, is not yet a result:** run it again alone before acting on it. When a lane's run must be trusted, such as the full run before handing over, start it when no other checkout's suite is running.
- **Databases do not collide.** A run starts two test servers (ticket 89): the one most suites use on `TEST_PORT`, and the one the suites that publish use on `TEST_PORT + 1000`. Each server's Postgres listens 2000 above it, in a temporary directory named after its port. `npm run dev`'s listens on a port derived from the checkout's path, with its data in that checkout's `.data/`. `studio-in-production.spec.ts` starts one more server, with no database, on `TEST_PORT + 4000` (ticket 98). `TEST_PORT` is therefore held to four digits, 1024 to 8999.
- **CMS migrations do, and one command settles them.** Each schema migration's snapshot (`src/migrations/*.json`) assumes it is the latest, so two tickets that each add one cannot both be right once they meet. After merging `origin/main`, run `npm run cms:rebase-migrations`, read what it changed in `src/migrations/`, and commit it. Done when it ends on "Done", which it says only once every migration has run on a database built from scratch.

  It deletes the branch's own schema migrations — those `main` has no file of — and has Payload write them again, as one, against main's newest snapshot. **Each keeps its name while it still sorts after all of main's**, because a database that ran it knows it by name. When one does not, the branch's migrations all move after main's, in their order: left before them they would run first on a database built from scratch, and main's snapshot, newer by name, would be what the next migration is diffed against, without this branch's tables. It marks the new migration's type imports `type`, keeps the comments above its `up` and `down`, and regenerates `payload-types.ts` and the admin's import map.

  `src/migrations/index.ts` is not committed — Payload reads the folder — so it never conflicts. A merge that says main deleted it is settled with `git rm src/migrations/index.ts`. `payload-types.ts` still can conflict: take either side, and the command writes it again. CI's `npm run cms:check-migrations` fails a pull request whose configuration asks for something no migration makes, or whose generated code is out of date.

  What the command cannot decide:

  - **Whether a database it cannot reach ran a migration under a name it moved.** Payload matches applied migrations by name, so such a database tries to create the same types and tables a second time and stops — `type "enum_..." already exists` — with every later migration blocked behind it. When the command moves a name it prints `UPDATE payload_migrations SET name = …` statements, one per migration, and renames the rows in this checkout's `.data/` itself. The preview database, which the founder migrates by hand, is the usual other one: if it was migrated for this branch, those statements have to run on it before it is migrated again. Ticket 33's preview could not be migrated until ticket 59's two renamed rows were renamed to match.
  - **Whether the SQL still says what it said.** The command compares the regenerated `up` with what it replaces, statement for statement, and prints any difference. A statement added to a schema migration by hand is not generated again: put it back. And where the SQL differs, a database that ran the old one lacks what the new one makes, so renaming its rows would claim otherwise.
  - **What a folded migration did.** Two schema migrations of the branch's become one, under the first one's name and with its comments: say what the second did.
  - **A branch that changed the configuration but has no schema migration of its own.** The command stops; write one with `npm run cms:migration -- <name>`.
