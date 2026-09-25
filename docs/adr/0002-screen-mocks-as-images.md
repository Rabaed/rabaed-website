# Screen mocks are exported images, not rebuilt markup

The Reference site depicts Rabaed app screens as 30–37 KB blocks of hand-written, absolutely positioned, inline-styled HTML — six or more of them, machine-generated, at a fixed 1440×900. `reference/HANDOFF.md` requires that product screenshots stay HTML/CSS and warns against text inside images. We are exporting them as images instead.

Rebuilding them as components would be the single largest cost in the project, and bilingual support doubles it; the real Rabaed app does not exist yet, so no genuine screenshots are available. Instead the mock markup is kept in the repo as a private studio route and rendered to images by a script, per locale — preserving the co-founder's work pixel-exactly while removing thousands of lines of imitation markup from the production bundle.

## Consequences

- Text inside a Screen mock is invisible to search engines, AI crawlers and screen readers. Every mock must therefore ship with a meaningful `alt` description and a visible caption carrying the same claim in real text.
- Headline and body copy must never be delivered as an image; this exception is for Screen mocks only.
- Regenerating a mock is a script run, not a design job, so mocks stay editable.
- "Private" means two things (ticket 98). The studio is never indexed, on any deployment: `noindex` on the page and in an `X-Robots-Tag` header, and never in the sitemap or `llms.txt`. And it does not answer on the production deployment at all: `src/proxy.ts` returns not found there, decided on each request from `VERCEL_ENV`. It still answers locally, on the test servers and on previews, where the export script, the suite and the founder's review of a pull request need it — a preview is behind Vercel's sign-in, so there it is private because nobody else can reach it.
