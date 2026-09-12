# 02: Capture visual baselines of the Reference site

**What to build:** A permanent photographic record of the Reference site as it looks today, so every rebuilt page can be proved to match it. This must happen before anything is rebuilt — once work starts, the original is no longer reproducible.

**Blocked by:** 01

**Status:** resolved — 160 baselines committed under `tests/baselines/reference/`

- [x] Playwright captures full-page screenshots of all nine Reference pages (plus `pour-tracker.html` — see the note below)
- [x] Eight widths: 360, 390, 768, 820, 1024, 1280, 1440, 1600
- [x] Short-viewport captures included, because the pinned sections are tuned for laptop heights
- [x] IBM Plex Sans Arabic is available locally during capture; a missing Arabic font invalidates every baseline
- [x] Baselines committed to the repository with a short README explaining what they are and that they are never regenerated from the rebuild
- [x] A single documented command re-runs the capture against the Reference site

## Comments

**What was built.** `npm run baselines:capture` (`scripts/capture-baselines.mjs`) serves `reference/site/` over a local HTTP server, drives Chromium through Playwright, and writes `tests/baselines/reference/<page>/<page>--<width>x<height>.png`. 160 images: ten pages — the nine site pages plus `pour-tracker.html`, which ships as-is and so needs a baseline of its own — across eight widths at 900px tall plus eight short viewports (1280 and 1440 wide at 840, 700, 600 and 550px tall, the four height breakpoints the Reference site actually carries, with 550 also below the pinned journey's `min-height:551px` gate).

**Fonts.** `npm run fonts:sync` (`scripts/sync-fonts.mjs`) copies IBM Plex Sans Arabic (400/500/600/700), DM Mono (400/500) and Plus Jakarta Sans (400–800) out of `@fontsource` into `assets/fonts/`, preserving Google's subset and `unicode-range` split so glyph selection is unchanged. The capture intercepts each page's Google Fonts request and answers it with those files, and blocks every other outbound request. IBM Plex Sans Arabic and DM Mono are what ticket 03 self-hosts; Plus Jakarta Sans is there only because `pour-tracker.html` requests it — the Pour Tracker keeps its own design system, and the spec leaves it intact.

Two guards make a font failure loud, both verified by deliberately breaking them and watching the run abort:

- **Availability.** The interceptor reads the families out of the requested URL and aborts if `assets/fonts/` has no copy of one. Without it, a family we do not have is *answered* rather than blocked, so the page falls back to `system-ui` with nothing in the log to show for it. The pages do not all request the same families, so this was a live hole: nothing was serving Plus Jakarta Sans to `pour-tracker.html`.
- **Actually rendered.** After load, any page containing Arabic text must have an Arabic-covering face loaded. Checking by family name is not enough: the family is split by `unicode-range`, and its Latin face loads from the Latin text on every page, so a name-only check reports success with the Arabic file missing — precisely the failure the ticket's criterion exists to prevent.

The second guard started out stricter, demanding that every requested family be loaded, and that is wrong: a page may link a family it never renders. `pour-tracker.html` is the case — in its default right-to-left mode `body` puts IBM Plex Sans Arabic first, and that covers Latin too, so Plus Jakarta Sans is only reached once the language switcher is used. The captured baselines were never wrong about it; the family is synced so the interceptor can be honest and so the tool's English view is covered if it is ever captured.

**Reproducibility.** `npm run baselines:verify` re-captures into a temporary directory and pixel-compares against the committed set, writing `.actual.png` and `.diff.png` under `test-results/` for anything that differs, and flagging any committed baseline the capture no longer produces. It is how you check the baselines still describe the Reference site without overwriting them. Filtered runs (`--only`, `--widths`) write to `test-results/baselines-partial/` for the same reason: they drop the short viewports, so letting one land in the committed set would leave it half old and half new.

Getting to byte-identical runs took two fixes worth recording:

1. The before/after seam was being photographed mid-sweep. Fixed by rendering every non-scrub animation to the end of one pass before the shutter.
2. The hero document then still moved between runs. Rewinding its infinite timeline to frame 0 does not reset it, because the loop writes `style.left` from an `onUpdate` — GSAP does not own the property and cannot revert it. Seeking *forward* to the end of a pass re-runs those writes and is repeatable. The screenshot is additionally repeated until two consecutive frames match, which covers the one-time hints that run on `setTimeout` and CSS transitions rather than through GSAP.

**Known limit, worth its own ticket later.** Every image is the page at scroll offset 0, so a pinned or scrubbed section appears as a tall band holding only its first frame — about 2,700px of it on `product.html`, the only page with the pinned horizontal journey. This is faithful rendering rather than a capture artefact, and it still catches a change in pin geometry, but it does not record what those panels look like part-way through their scrub. The per-page rebuild tickets should cover that with interaction tests, and a filmstrip capture of the journey would be a reasonable addition if they do not.
