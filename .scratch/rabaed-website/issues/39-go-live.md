# 39: Go live

**What to build:** The Arabic site becomes public at `rabaedapp.com`. This is the ticket where the handbrake comes off, and it is deliberate rather than accidental.

**Blocked by:** every preceding ticket except the Stage 2 set (40–43) and ticket 21, which is replaced by tickets 53–59; and tickets 53–59

**Status:** ready-for-human — go-live is set for the weekend of 2–3 October 2026, when the founder points the domain; what is left before then is his, listed under «Left for launch day» below

- [x] ~~Updated Privacy Policy from the lawyer published before anything becomes public~~ — *the founder's call, 23 September 2026, with the lawyer's agreement: the site launches with the current policy, and the lawyer's version replaces it when it arrives, about two weeks from 23 September — a few days after launch*
- [x] Ticket 47 closed — no figure on the page without a recorded source
- [ ] `noindex` removed from production — and only production
- [x] Ticket 39a done first — the site must be deployed on Vercel before a domain can point at it — *parts 1, 3 and 4 done; part 2 is after launch and blocks nothing*
- [ ] Domain pointed from GoDaddy to Vercel; HTTPS verified; `www` and bare domain resolve consistently
- [ ] Lead alert address supplied and a live test submission received end to end, including the applicant's confirmation
- [x] Real social account links in place, or the icons removed — *LinkedIn and X, in the production footer on 23 September 2026*
- [ ] Full test suite green: baselines at eight widths, zero console errors, zero failed requests, zero horizontal overflow
- [ ] Sitemap submitted to Google Search Console; structured data validated live
- [ ] All nine pages reachable, every internal link resolving, the tool downloading
- [x] Analytics confirmed recording real visits — *the founder sees the graphs, 23 September 2026 (ticket 39a part 4); worth a second look once the domain brings real visitors*

## Waiting on the founders

Gathered here on 20 September 2026 because each of these is on the critical path to launch and none of them can be finished by a developer. They are tickets of their own; this is the list that says the site cannot go live while any is open.

- [x] **Ticket 47 — the four proof figures have no source.** *Sourced and published by migration, 23 September 2026.* Each figure's card stays off the public site until the founders say what it is measured against. The site enforces this itself: a figure with no source is not shown on a public deployment.
- [ ] **Ticket 49 — the real Pour Tracker file** from the co-founder. *Received 23 September 2026; in pull request #79.* Until then the download is ticket 18's placeholder, which advertises the tool rather than being it.
- [x] **Ticket 45 — the Arabic eyebrows set in DM Mono**, a design decision about a typeface with no Arabic glyphs.
- [x] **Ticket 39a part 2 — how a failing test blocks a merge**, and **part 3 — the database password**, the one item here with a security consequence. *Part 3 done; part 2 moved to after launch.*

**Note:** the Reference site's six `noindex` tags were correct while it was a prototype. This ticket is the one place they are removed, so the site cannot launch invisible by accident.

## Comments

**From ticket 32 (15 September 2026).** "Structured data validated live" means pasting the live home, product, start and one blog post address into Google's Rich Results Test (https://search.google.com/test/rich-results) and the Schema Markup Validator (https://validator.schema.org/). The suite checks the same things offline, but only a live check sees what Google sees. Expect the Rich Results Test to call the software application data ineligible for a rich result: Google shows one only with a price and a rating, which the site deliberately never states (spec: SEO and GEO). That is not an error; the Schema Markup Validator should report none. The company's social accounts in its structured data are the ones published in site settings, so publishing the real accounts before launch fills both the footer icons and the structured data at once.

**The founder's decisions of 23 September 2026.**

- **The domain is pointed the weekend of 2–3 October 2026** — «not this weekend, the following weekend». Nothing public changes before then: `rabaedapp.com` goes on serving the old site, and the new one stays behind Vercel's login on its own addresses.
- **The Privacy Policy stays as it is for launch.** The lawyer's version arrives about two weeks from 23 September — a few days after the domain is pointed — and the lawyer is content for the current one to stand until then. Publishing it is an edit to the policy in the CMS (ticket 25), and needs no deploy.

**Left for launch day, in order.** The founder's first, then the checks that only mean something once the domain is live.

1. **Supply the lead alert address** in the CMS (**Form settings → بريد التنبيهات**), and send one real test through a form, checking the team's alert and the applicant's confirmation both arrive.
2. **Point `rabaedapp.com` and `www` at Vercel** from GoDaddy, and add both domains to the Vercel project.
3. **Set `SITE_INDEXABLE=true`** on Vercel's production environment only, and redeploy — the whole of removing `noindex` (ticket 03).
4. **Submit the sitemap** (`https://rabaedapp.com/sitemap.xml`) in Google Search Console.
5. **Then the agent's checks against the live domain:** HTTPS and `www` resolving to one address, every page and internal link, the tool downloading, the structured data in Google's two validators (the ticket 32 comment above), and the suite green once more.
