# 03: Live skeleton on Vercel

**What to build:** One real Arabic page, served from Next.js, reachable on a private Vercel preview link, invisible to search engines. This proves the whole delivery path — commit, pull request, preview, merge — before any design work depends on it.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Next.js App Router application, server-rendered; primary content is never client-rendered (ADR-0001)
- [ ] Locale-aware routing in place from the start: Arabic at `/`, English reserved at `/en`, `lang` and `dir` set per locale
- [ ] IBM Plex Sans Arabic and DM Mono self-hosted as `woff2`; no request to Google Fonts
- [ ] `noindex` applied automatically to every non-production environment
- [ ] Connected to the GitHub repository so each pull request gets its own preview URL
- [ ] Page text is present in the server response with JavaScript disabled
- [ ] Playwright runs against the built app in CI, and CI blocks merging when it fails
