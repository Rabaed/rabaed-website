# Screen mocks are exported images, not rebuilt markup

The Reference site depicts Rabaed app screens as 30–37 KB blocks of hand-written, absolutely positioned, inline-styled HTML — six or more of them, machine-generated, at a fixed 1440×900. `reference/HANDOFF.md` requires that product screenshots stay HTML/CSS and warns against text inside images. We are exporting them as images instead.

Rebuilding them as components would be the single largest cost in the project, and bilingual support doubles it; the real Rabaed app does not exist yet, so no genuine screenshots are available. Instead the mock markup is kept in the repo as a private studio route and rendered to images by a script, per locale — preserving the co-founder's work pixel-exactly while removing thousands of lines of imitation markup from the production bundle.

## Consequences

- Text inside a Screen mock is invisible to search engines, AI crawlers and screen readers. Every mock must therefore ship with a meaningful `alt` description and a visible caption carrying the same claim in real text.
- Headline and body copy must never be delivered as an image; this exception is for Screen mocks only.
- Regenerating a mock is a script run, not a design job, so mocks stay editable.
