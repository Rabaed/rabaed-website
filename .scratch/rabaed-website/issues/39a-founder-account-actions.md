# 39a: Founder account actions

**What to do:** The two things in Stage 1 that need somebody with the company accounts. Ticket 03 raised them and nothing waits on them.

**Blocked by:** nothing technical.

**When:** the founder decided on 12 September 2026 to do **part 1, connecting Vercel, once ticket 04 is merged** — bringing it forward from the end of Stage 1, so that preview links exist for the page-by-page rebuild in tickets 05 onward. Part 2, the GitHub plan decision, stays at the end of Stage 1 alongside ticket 39.

**Status:** ready-for-human — the founder does these, not an agent

Full instructions, in plain language, are in [`docs/deployment.md`](../../../docs/deployment.md).

## 1. Connect Vercel to the GitHub repository

- [ ] Sign in to Vercel with the company GitHub account and import `Rabaed/rabaed-website`
- [ ] Install the Vercel GitHub app for the `Rabaed` organisation
- [ ] Accept every build setting as detected — Next.js needs no configuration from us, and no environment variable has to be set
- [ ] Confirm a pull request now gets its own preview link in a comment

**Note on the Vercel plan.** The repository belongs to an organisation and the site is commercial, so this needs a paid Vercel team rather than the free Hobby plan. That cost is part of this task.

**Why it moved earlier.** Until this is done there are no preview links, so work can only be looked at by running the site locally. Tickets 05–38 rebuild the site page by page, and each one is much easier to approve from a link than from a description.

## 2. Decide how a failing test blocks a merge

GitHub will not let a pull request with failing tests be merged — but only on a paid plan. On the Free organisation plan for a private repository the API answers: `Upgrade to GitHub Pro or make this repository public to enable this feature.` Making the repository public is not an option.

- [ ] Decide: upgrade the `Rabaed` organisation to the GitHub Team plan, or accept the convention of never merging a pull request showing a red cross
- [ ] If upgrading, apply the prepared rule:

```bash
gh api -X POST repos/Rabaed/rabaed-website/rulesets --input docs/github-ruleset.json
```

Until one or the other is settled, CI still runs on every pull request and still shows a red cross when it fails. What is missing is only the enforcement.
