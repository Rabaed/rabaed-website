# 46: Bug — `npm run dev` edits AGENTS.md and next-env.d.ts

**What is wrong:** Starting the development server rewrites two committed files without being asked:

- **`AGENTS.md`** gains a large `<!-- BEGIN:nextjs-agent-rules -->` block of Next.js guidance appended to the repo's own instructions. The log line is `✓ Generated AGENTS.md for AI agents. Set 'agentRules: false' in next.config to disable.`
- **`next-env.d.ts`** has its two imports rewritten from `./.next/types/…` to `./.next/dev/types/…`. `npm run build` writes them back. The file says "This file should not be edited" at the bottom of itself.

So `npm run dev` and `npm run build` leave the working tree dirty in two different ways, and whichever ran last decides what `git status` shows.

**Reported by:** ticket 06, on running the dev server to check an animation. Both files were reverted by hand; nothing was committed.

**Blocked by:** nothing.

**Status:** resolved

## Done when

- [x] `npm run dev` leaves `git status` clean
- [x] `AGENTS.md` contains only what this repo wrote
- [x] The `127.0.0.1` hydration trap is either fixed or written down where somebody will find it — fixed

## Comments

Fixed as part of "Step 0", the preparation for running several agent sessions at once (ticket 48): with three sessions, every one that started the dev server would have been editing the repo's own agent instructions.

### AGENTS.md

`agentRules: false` in `next.config.ts` turns the generation off. The option name was confirmed against the guide bundled with the installed Next.js, `node_modules/next/dist/docs/01-app/02-guides/ai-agents.md`.

Next.js recommends leaving it on, and the block it writes has one genuinely useful instruction: read the version-matched documentation in `node_modules/next/dist/docs/` before writing Next.js code, because the installed version is newer than most training data. That is exactly how the option name above was confirmed. So the instruction is kept — written into `AGENTS.md` by hand, in this repo's words — and only the automatic rewriting is switched off.

`CLAUDE.md` was never changed by the dev server, even before the fix: Next.js's addition to it is the single line `@AGENTS.md`, which this repo's `CLAUDE.md` already begins with.

### next-env.d.ts

Next.js's own documentation settles this one: the file "should not be tracked by version control … Add it to `.gitignore`. If your project already tracks the file, remove it from Git" (`03-api-reference/05-config/02-typescript.md`). It is ignored now and removed from Git.

The file still has to exist for the typecheck, and CI typechecks *before* it builds — so `npm run typecheck` runs `next typegen` first, which the same documentation names for exactly this: making sure the file is present before type-checking without running a full build.

### The 127.0.0.1 hydration trap

Fixed rather than written down. `next dev` refuses its own resources to any origin but `localhost`, so a page opened at `http://127.0.0.1:<port>` loaded but never hydrated, and every client behaviour silently did nothing — an easy address to reach for, and an hour lost in ticket 06 before it was spotted. `allowedDevOrigins: ['127.0.0.1']` in `next.config.ts` lets it through. The option affects the development server only; the test suite and the scripts run against `next start`, which never had the problem.

### Verified, before and after

With both new options removed from the config, the dev server rewrote `AGENTS.md`, and a page opened at `127.0.0.1` did not respond — the mobile menu did not open when clicked. With both present, `AGENTS.md` and `CLAUDE.md` were byte-identical before and after the dev server ran, the menu opened, and `git status` showed only the change's own files.

A typecheck from a clean checkout's state — no `next-env.d.ts`, no generated types — passed and regenerated the file. The full suite passed afterwards: 183 tests.
