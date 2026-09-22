# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Taking an implementation ticket

A ticket under `.scratch/<feature-slug>/issues/` is **ready** once every ticket on its `Blocked by` line is `resolved`. Any ready ticket may be taken, in any order.

- **Claim** it before building by pushing a branch named exactly `ticket-NN`, its two-digit number, from an up-to-date `origin/main`. Other sessions work in other checkouts and cannot see an edit to the ticket file until it is merged, but they can see a branch on GitHub: `git ls-remote --heads origin "ticket-*"`. The ticket's `Status:` line stays as it is until the ticket is resolved. **Only the claim branch may match `ticket-*`**: a side branch for evidence or a spike needs a name outside that glob, or it is read as a claim on a ticket nobody holds.
- **Resolve** it in the pull request that does the work: tick its boxes and set its `Status:` line to `resolved` on the ticket branch, so the status merges with the code. Left until afterwards it needs a branch and a pull request of its own, and until that merges `main` offers finished work to the next session that looks.
- **Release** it by deleting that branch on the remote — `git push origin --delete ticket-NN` — as soon as its pull request is merged, or when the ticket is abandoned. Until that happens the branch still says "taken", and the next session reads a claim on work that is already done.
- **Do not release it with `gh pr merge --delete-branch`.** That deletes the local branch too, and when another worktree has it checked out, it takes that checkout with it. `git push origin --delete` touches only the remote, which is the half the claim is read from.

The Frontier and Claim rules under Wayfinding operations below apply to `/wayfinder` maps only.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
