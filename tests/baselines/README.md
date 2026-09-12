# Visual baselines of the Reference site

These PNGs are a photographic record of `reference/site/` — the nine hand-built
Arabic pages plus the Pour Tracker — as they looked before any rebuilding
started. They are the oracle for "the rebuild looks identical".

**They are never regenerated from the rebuild.** If a comparison fails, the
rebuild is wrong until proven otherwise. Re-capturing is only ever a response to
a deliberate, reviewed change to the capture method itself — never a way to make
a failing comparison pass.

## Re-running the capture

```bash
npm run baselines:capture
```

That is the single documented command. It serves `reference/site/` over
`http://127.0.0.1:4321`, drives Chromium through Playwright, and rewrites
`tests/baselines/reference/` from scratch. It takes about eight minutes.

To check that the committed images still describe the Reference site — and that
capture is reproducible on your machine — re-capture into a temporary directory
and diff, without overwriting anything:

```bash
npm run baselines:verify
```

Useful flags while working on the script: `-- --only=index,product` and
`-- --widths=1440`. A filtered run writes to `test-results/baselines-partial/`
rather than the committed set, because it also drops the short viewports and
would otherwise leave a set that is half old capture and half new. Only the
unfiltered command rewrites `tests/baselines/reference/`. `baselines:verify`
writes nothing except diffs for images that fail, under `test-results/`.

`capture-log.txt` records what the last full run captured, and any console
errors, failed requests or blocked external requests seen on the Reference site.

## What is captured

160 full-page screenshots: 10 pages × 16 viewports.

**Eight widths at 900px tall** — 360, 390, 768, 820, 1024, 1280, 1440, 1600.
These are fixed by the spec and by `reference/HANDOFF.md` section 7.7. 900px is
above the tallest height breakpoint, so this sweep is the "tall desktop" case.

**Eight short viewports** — 1280 and 1440 wide, at 840, 700, 600 and 550px tall.
The Reference site carries height-based media queries at exactly those four
heights, all gated to `min-width:981px`, and the pinned horizontal journey
additionally needs `min-height:551px`. Capturing on the breakpoint values
exercises each band; 550 also lands below the journey's gate, so the unpinned
fallback is recorded too.

Files are named `<page>/<page>--<width>x<height>.png`.

## Why the capture is set up the way it is

**Fonts are served from `assets/fonts/`, never from Google.** The Reference
pages link a Google Fonts stylesheet; the capture intercepts that request and
answers it with the self-hosted `woff2` faces instead. Chromium falls back
silently when a face is missing, and a baseline set captured in a fallback face
is worse than none — every later comparison would fail for the wrong reason.

Two checks make that failure loud instead of silent.

**Is the family available?** The pages do not all ask for the same ones: the
nine site pages want IBM Plex Sans Arabic and DM Mono, while `pour-tracker.html`
wants Plus Jakarta Sans and IBM Plex Sans Arabic, because the Pour Tracker keeps
its own design system. The interceptor reads the families out of the requested
URL and aborts if `assets/fonts/` has no copy of one — otherwise the request is
*answered* rather than blocked, and the page falls back to `system-ui` with
nothing in the log to show for it.

**Did Arabic actually render in it?** After load, any page containing Arabic
text must have an Arabic-covering face loaded. Checking by family name is not
enough: the family is split by `unicode-range`, and its Latin face loads from
the Latin text on every page, so a name-only check would pass with the Arabic
file missing.

The second check deliberately stops there. Requiring every *requested* family to
have loaded would fail pages that are rendering perfectly, because a page can
link a family it never uses — `pour-tracker.html` reaches Plus Jakarta Sans only
once its language switcher is used, and renders no Arabic at weight 400 at all.

Run `npm run fonts:sync` if `assets/fonts/` is ever missing or a family is
added.

**Every other outbound request is blocked**, so capture works offline and no
third party can change what the baselines look like.

**Animations are settled before the shutter.** Each page is walked top to bottom
so every `once:true` ScrollTrigger entrance fires, then returned to the top.
Every animation is then rendered at the end of one pass — its resting state —
and the GSAP ticker is stopped. Finally the screenshot is repeated until two
consecutive frames are identical, because some of the Reference site's one-time
hints run on `setTimeout` and CSS transitions, outside GSAP's control. Runs
produce byte-identical files; `npm run baselines:verify` is how you check that.

Rewinding animations to their *first* frame was tried and does not work, which
is worth knowing before anyone changes it back. The hero loop moves its document
by writing `style.left` from an `onUpdate`, so GSAP does not own that property
and cannot revert it — seeking back to zero resets the status text but leaves the
document wherever wall-clock time happened to put it, and the baseline moves
between runs. Seeking forward re-runs those writes.

## Known limits of this record

**Every image is the page at scroll offset 0.** Sections driven by a scrubbed or
pinned ScrollTrigger reserve their full scroll distance in the document, so they
appear in the screenshots as a tall band containing only their first frame. On
`product.html` — the only page carrying the pinned horizontal journey — that is
a band of roughly 2,700px at desktop widths; on `index.html` the scrubbed record
section does the same on a smaller scale. This is a faithful rendering, not a
capture artefact — a rebuild that pins identically produces an identical band,
so the baselines still catch a change in pin geometry. They do **not** record
what those panels look like part-way through their scrub. The per-page rebuild
tickets cover that through interaction tests.

**Hover, focus and open states are not captured.** Nothing is hovered, nothing
is focused, dropdowns and the mobile panel are closed.

**Chromium only**, at `deviceScaleFactor: 1`, locale `ar-SA`, timezone
`Asia/Riyadh`, with `prefers-reduced-motion` unset. The reduced-motion rendering
is a separate concern and is asserted behaviourally, not by screenshot.
