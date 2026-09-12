# 39a: Founder account actions

**What to do:** The two things in Stage 1 that need somebody with the company accounts, gathered in one place so they are done once, together, at the end of Stage 1 rather than interrupting the build. Deferred here deliberately by the founder (12 September 2026); ticket 03 raised them and does not wait on them.

**Blocked by:** nothing technical. Do these alongside 39, before the site goes public.

**Status:** ready-for-human — the founder does these, not an agent

Full instructions, in plain language, are in [`docs/deployment.md`](../../../docs/deployment.md).

## 1. Connect Vercel to the GitHub repository

- [ ] Sign in to Vercel with the company GitHub account and import `Rabaed/rabaed-website`
- [ ] Install the Vercel GitHub app for the `Rabaed` organisation
- [ ] Accept every build setting as detected — Next.js needs no configuration from us, and no environment variable has to be set
- [ ] Confirm a pull request now gets its own preview link in a comment

**Note on the Vercel plan.** The repository belongs to an organisation and the site is commercial, so this needs a paid Vercel team rather than the free Hobby plan. That cost is part of this task.

**Note on what deferring costs.** Until this is done there are no preview links, so work on tickets 04–38 can only be looked at by running the site locally. Nothing in the build is blocked by it — only the founder's ability to click a link and see the result.

## 2. Decide how a failing test blocks a merge

GitHub will not let a pull request with failing tests be merged — but only on a paid plan. On the Free organisation plan for a private repository the API answers: `Upgrade to GitHub Pro or make this repository public to enable this feature.` Making the repository public is not an option.

- [ ] Decide: upgrade the `Rabaed` organisation to the GitHub Team plan, or accept the convention of never merging a pull request showing a red cross
- [ ] If upgrading, apply the prepared rule:

```bash
gh api -X POST repos/Rabaed/rabaed-website/rulesets --input docs/github-ruleset.json
```

Until one or the other is settled, CI still runs on every pull request and still shows a red cross when it fails. What is missing is only the enforcement.
