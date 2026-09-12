# 39a: Founder account actions

**What to do:** The two things in Stage 1 that need somebody with the company accounts. Ticket 03 raised them and nothing waits on them.

**Blocked by:** nothing technical.

**When:** the founder decided on 12 September 2026 to do **part 1, connecting Vercel, once ticket 04 is merged** — bringing it forward from the end of Stage 1, so that preview links exist for the page-by-page rebuild in tickets 05 onward. Part 2, the GitHub plan decision, stays at the end of Stage 1 alongside ticket 39.

**Status:** part 1 done (12 September 2026); part 2 outstanding

Full instructions, in plain language, are in [`docs/deployment.md`](../../../docs/deployment.md).

## 1. Connect Vercel to the GitHub repository

- [x] Sign in to Vercel with the company GitHub account and import `Rabaed/rabaed-website`
- [x] Install the Vercel GitHub app for the `Rabaed` organisation
- [x] Accept every build setting as detected — Next.js needs no configuration from us, and no environment variable has to be set
- [ ] Confirm a pull request now gets its own preview link in a comment

**Done.** A production deployment of `8a64ad9` succeeded on 12 September 2026 at `rabaed-website-iourhxa1e-rabaed.vercel.app`, reported back to GitHub as a successful Production deployment.

**One thing to know: Vercel Deployment Protection is on.** Fetching that URL without a session redirects to `vercel.com/sso-api`, so a deployment link only opens for somebody signed in to the Vercel team. That is Vercel's default for a team, and it is a sensible one — an unfinished site behind a login is safer than one merely marked `noindex`. It has two consequences worth deciding on:

- The founder can open preview links; anyone outside the Vercel team cannot, so a link cannot simply be forwarded to a client or a lawyer for review. Vercel's own sharing link, or turning protection off for previews, are the two ways round it.
- The site's own indexing block cannot be checked from outside while protection is on, because nothing gets past the login to see it. It is verified in the test suite against a real build, and it is unconditional until ticket 39 sets `SITE_INDEXABLE`.

Protection does not apply to a production custom domain, so pointing `rabaedapp.com` at Vercel in ticket 39 will make the site publicly reachable — which is the point by then.

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
