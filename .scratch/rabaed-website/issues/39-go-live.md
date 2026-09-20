# 39: Go live

**What to build:** The Arabic site becomes public at `rabaedapp.com`. This is the ticket where the handbrake comes off, and it is deliberate rather than accidental.

**Blocked by:** every preceding ticket except the Stage 2 set (40–43) and ticket 21, which is replaced by tickets 53–59; and tickets 53–59

**Status:** ready-for-agent

- [ ] Updated Privacy Policy from the lawyer published before anything becomes public
- [ ] Ticket 47 closed — no figure on the page without a recorded source
- [ ] `noindex` removed from production — and only production
- [ ] Ticket 39a done first — the site must be deployed on Vercel before a domain can point at it
- [ ] Domain pointed from GoDaddy to Vercel; HTTPS verified; `www` and bare domain resolve consistently
- [ ] Lead alert address supplied and a live test submission received end to end, including the applicant's confirmation
- [ ] Real social account links in place, or the icons removed
- [ ] Full test suite green: baselines at eight widths, zero console errors, zero failed requests, zero horizontal overflow
- [ ] Sitemap submitted to Google Search Console; structured data validated live
- [ ] All nine pages reachable, every internal link resolving, the tool downloading
- [ ] Analytics confirmed recording real visits

## Waiting on the founders

Gathered here on 20 September 2026 because each of these is on the critical path to launch and none of them can be finished by a developer. They are tickets of their own; this is the list that says the site cannot go live while any is open.

- [ ] **Ticket 47 — the four proof figures have no source.** Each figure's card stays off the public site until the founders say what it is measured against. The site enforces this itself: a figure with no source is not shown on a public deployment.
- [ ] **Ticket 49 — the real Pour Tracker file** from the co-founder. Until then the download is ticket 18's placeholder, which advertises the tool rather than being it.
- [ ] **Ticket 45 — the Arabic eyebrows set in DM Mono**, a design decision about a typeface with no Arabic glyphs.
- [ ] **Ticket 39a part 2 — how a failing test blocks a merge**, and **part 3 — the database password**, the one item here with a security consequence.

**Note:** the Reference site's six `noindex` tags were correct while it was a prototype. This ticket is the one place they are removed, so the site cannot launch invisible by accident.

## Comments

**From ticket 32 (15 September 2026).** "Structured data validated live" means pasting the live home, product, start and one blog post address into Google's Rich Results Test (https://search.google.com/test/rich-results) and the Schema Markup Validator (https://validator.schema.org/). The suite checks the same things offline, but only a live check sees what Google sees. Expect the Rich Results Test to call the software application data ineligible for a rich result: Google shows one only with a price and a rating, which the site deliberately never states (spec: SEO and GEO). That is not an error; the Schema Markup Validator should report none. The company's social accounts in its structured data are the ones published in site settings, so publishing the real accounts before launch fills both the footer icons and the structured data at once.
