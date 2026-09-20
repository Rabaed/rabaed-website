# Parallel sessions

For a session working in a git worktree while other sessions take tickets from the same tracker. How to choose and claim a ticket is in "Taking an implementation ticket" in `docs/agents/issue-tracker.md`; this is what changes when others work alongside you.

## Working a ticket

1. **Claim** a ready ticket as `issue-tracker.md` describes. Done when `git ls-remote --heads origin ticket-NN` lists your branch.
2. **Test on the ticket's own port**, `TEST_PORT=31NN`: ticket 09 tests on 3109, ticket 12 on 3112. Done when the full suite is green on that port.
3. **Hand over**: push and open a pull request against `main`. Done when its `test` check is green. The founder decides when it is merged, and merging with `--delete-branch` releases the claim.
4. **Start the next ticket** on a new branch from a fresh `origin/main`, so it builds on everything merged since.

A claim is a convention, not a lock: two sessions claiming the same ticket in the same moment could both succeed. Each session is given its own lane of tickets, which keeps that rare.

## Where sessions collide

- **The home page** (`src/app/(ar)/page.tsx`, `src/styles/home.css`) changes with every home ticket, so those tickets belong to one lane.
- **Every new page** adds itself to `tests/e2e/routes.ts`, and many add to `src/styles/tokens.css` and `responsive.css`. Conflicts there are expected and small: update from `origin/main` and resolve them with `/resolving-merge-conflicts`.
- **Screen mock export** (`npm run mocks:export`) uses one fixed port and refuses to start when it is taken, so exports run one at a time.
- **Databases do not collide.** The test server's Postgres listens on `TEST_PORT + 2000` in a temporary directory named after the port; `npm run dev`'s listens on a port derived from the checkout's path, with its data in that checkout's `.data/`.
- **CMS migrations do.** Two tickets that each add a migration both edit `src/migrations/index.ts`, and each migration's snapshot assumes it is the latest. After updating from `origin/main`, keep main's migrations, delete your own, and run `npm run cms:migration -- <name>` again, so yours is written against the schema main now has.
- **A regenerated migration's file name is what already-migrated databases remember.** Payload matches applied migrations by name, so renaming one that a database has already run makes that database try to create the same types and tables a second time and stop — `type "enum_..." already exists` — with every later migration blocked behind it, including yours. So before regenerating, ask whether any database has already applied the old one. The preview database, which the founder migrates by hand, is the usual answer; another session's `.data/` is another. **If one has**, give the regenerated file its original name, and check the SQL matches the old statement for statement before trusting it. **If none has** — the ordinary case on a branch nobody has deployed — let it take the new name, which sorts last and makes its snapshot the whole schema.

  Recovering a database that was stranded this way needs no DDL, because the objects are already right: rename the rows instead, `UPDATE payload_migrations SET name = '<new name>' WHERE name = '<old name>'`, one per renamed file, then migrate again. Ticket 59 renamed two the preview had already run, and ticket 33's preview could not be migrated until those two rows were renamed to match.

- **Read a regenerated migration before keeping it.** It is written against the newest snapshot (`src/migrations/*.json`) by name, and when two branches merged in the order they were generated in reverse, that snapshot lacks the other branch's tables: the new migration creates them again, and fails on a fresh database. Remove those statements from its `up` and `down`, as ticket 56 did; its own snapshot is the whole schema, so the next migration starts from a complete one.
