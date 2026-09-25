# Parallel sessions

For a session working in a git worktree while other sessions take tickets from the same tracker. How to choose and claim a ticket is in "Taking an implementation ticket" in `docs/agents/issue-tracker.md`; this is what changes when others work alongside you.

## Working a ticket

1. **Claim** a ready ticket as `issue-tracker.md` describes. Done when `git ls-remote --heads origin ticket-NN` lists your branch.
2. **Test on the ticket's own port**, `TEST_PORT=31NN`: ticket 09 tests on 3109, ticket 12 on 3112. Done when the full suite is green on that port.
3. **Resolve the ticket on its branch** as `issue-tracker.md` describes. Done before the pull request opens, so the `Status:` line merges with the work rather than needing a pull request of its own.
4. **Hand over**: push and open a pull request against `main`. Done when its `test` check is green. The founder decides when it is merged.
5. **Release the claim** once it is merged, as `issue-tracker.md` describes. Done when `git ls-remote --heads origin ticket-NN` comes back empty.
6. **Start the next ticket** on a new branch from a fresh `origin/main`, so it builds on everything merged since.

A claim is a convention, not a lock: two sessions claiming the same ticket in the same moment could both succeed. Each session is given its own lane of tickets, which keeps that rare.

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
