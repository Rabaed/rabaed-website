# 39: Go live

**What to build:** The Arabic site becomes public at `rabaedapp.com`. This is the ticket where the handbrake comes off, and it is deliberate rather than accidental.

**Blocked by:** every preceding ticket except the Stage 2 set (40–43)

**Status:** ready-for-agent

- [ ] Updated Privacy Policy from the lawyer published before anything becomes public
- [ ] `noindex` removed from production — and only production
- [ ] Domain pointed from GoDaddy to Vercel; HTTPS verified; `www` and bare domain resolve consistently
- [ ] Lead alert address supplied and a live test submission received end to end, including the applicant's confirmation
- [ ] Real social account links in place, or the icons removed
- [ ] Full test suite green: baselines at eight widths, zero console errors, zero failed requests, zero horizontal overflow
- [ ] Sitemap submitted to Google Search Console; structured data validated live
- [ ] All nine pages reachable, every internal link resolving, the tool downloading
- [ ] Analytics confirmed recording real visits

**Note:** the Reference site's six `noindex` tags were correct while it was a prototype. This ticket is the one place they are removed, so the site cannot launch invisible by accident.
