# 46: Bug — `npm run dev` edits AGENTS.md and next-env.d.ts

**What is wrong:** Starting the development server rewrites two committed files without being asked:

- **`AGENTS.md`** gains a large `<!-- BEGIN:nextjs-agent-rules -->` block of Next.js guidance appended to the repo's own instructions. The log line is `✓ Generated AGENTS.md for AI agents. Set 'agentRules: false' in next.config to disable.`
- **`next-env.d.ts`** has its two imports rewritten from `./.next/types/…` to `./.next/dev/types/…`. `npm run build` writes them back. The file says "This file should not be edited" at the bottom of itself.

So `npm run dev` and `npm run build` leave the working tree dirty in two different ways, and whichever ran last decides what `git status` shows.

**Reported by:** ticket 06, on running the dev server to check an animation. Both files were reverted by hand; nothing was committed.

**Blocked by:** nothing.

**Status:** ready-for-agent

## Why it matters here more than usual

`AGENTS.md` is this repo's instructions to its own agents, and `CLAUDE.md` includes it by reference. An agent that runs `npm run dev`, does its work and commits with `git add -A` would commit generated content into the file that tells the next agent how to behave — and the content is generic Next.js advice, not this project's.

It is appended rather than overwritten, so nothing has been lost. It is still a file changing itself behind the person editing it.

## The fix

`agentRules: false` in `next.config.ts` turns off the `AGENTS.md` generation; the Next.js documentation in `node_modules/next/dist/docs/` is the place to confirm the option name against the installed version before setting it.

`next-env.d.ts` is Next.js's own file and the churn is between its dev and build modes, so the options are to leave it alone and accept the noise, or to decide which form is committed and say so somewhere a reviewer will see it.

Worth checking at the same time: `next dev` also refuses `127.0.0.1` as a dev origin, so a page opened on `http://127.0.0.1:<port>` never hydrates and every client behaviour silently does nothing. `http://localhost:<port>` works. That cost an hour in ticket 06 and is worth a line in the deployment notes or an `allowedDevOrigins` entry.

## Done when

- [ ] `npm run dev` leaves `git status` clean
- [ ] `AGENTS.md` contains only what this repo wrote
- [ ] The `127.0.0.1` hydration trap is either fixed or written down where somebody will find it
