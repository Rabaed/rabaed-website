# 05: Screen mock studio and image export

**What to build:** A repeatable way to turn the co-founder's hand-built app screens into images, so they can be placed on pages without carrying thousands of lines of imitation markup into production. Changing a label later is a script run, not a redesign.

**Blocked by:** 03

**Status:** resolved

- [x] The Reference site's mock markup is preserved in the repo behind a studio route, blocked from indexing — unconditionally, unlike the rest of the site
- [ ] Excluded from the sitemap — **nothing to exclude it from yet**: there is no sitemap until ticket 33, which is cross-referenced to the prefix the registry exports
- [x] A script renders each Screen mock and exports an optimised image at high resolution, with dimensions recorded
- [x] The export is locale-aware by construction, so an English set can be produced later without rework (ADR-0002)
- [x] Arabic set exported for every mock used on the Home and Product pages
- [x] Exported images match their Reference site counterparts against the baselines — compared against the Reference site itself, pixel for pixel, for the reason below
- [x] A single documented command regenerates all mocks

## Comments

**What was built.** Eight Screen mocks, 260 KB of markup, lifted verbatim out of `reference/site/product.html` into `src/screen-mocks/ar/`. A studio route renders one per URL at 1440×900 and nothing else; `npm run mocks:export` photographs each of them and writes `public/screen-mocks/ar/<id>.webp`. The dimensions are recorded in the registry and asserted against the exported files, rather than in a generated manifest that nothing would read.

The eight are the five the home page and the product page share — `correspondence`, `kanban`, `daily-report`, `documents`, `stamped-sheet` — and three the product page adds: `overview`, `approvals-table`, `submittal`. The five shared ones are byte-identical between the two Reference pages, checked by hashing both copies before taking either, so there is one file each rather than two that could drift.

**The markup is read from disk, not imported.** ADR-0002's whole point is that none of this reaches production pages. An import would put every byte into a bundle; `readFile` leaves them as files that only the studio route ever opens, and `next.config.ts` lists the directory under `outputFileTracingIncludes` so the deployment still carries them. They are the only thing in this codebase passed to `dangerouslySetInnerHTML`, and both the locale and the id are checked against fixed lists before a path is built, so no URL can name a file of its own.

**Locale-aware by construction.** The route is `/studio/<locale>/<mock>`, the export loops over locales, and the output path carries the locale. Which locales exist is read from disk rather than declared, so ticket 41 adds an English set by adding `src/screen-mocks/en/` — no code changes, and no half-announced locale from a constant nobody updated.

**No `alt` text in the registry, deliberately.** The Reference site describes the same mock differently depending on where it stands: `correspondence` is "شاشة المراسلات الرسمية في ربائد" on the home page and a full sentence about reference numbers and waiting times on the product page. The description belongs to the claim the mock is making, so it is written at the placement — tickets 06 and 12 — along with the visible caption ADR-0002 requires beside it.

**Lossless WebP at 2880×1800.** They are masters, not what a visitor downloads: at 150–250 KB each they are far too heavy to serve directly, and the placing tickets put them through `next/image`, which resizes and re-encodes per request. Lossless is what makes the freshness test below possible at all — a lossy encode could not be compared to a fresh render exactly.

### "Match their Reference site counterparts": compared against the Reference site, not the baseline images

Same conclusion as ticket 04, for a sharper reason. On a Reference page a mock is scaled down to fit its column — 820px wide on the home page — so the baseline holds a shrunken copy. Comparing a 2880px master against it would be comparing two different resamplings, and would say nothing about whether the markup survived the move.

Instead each mock is rendered in the studio and on the Reference page it came from, in the same browser at the same moment, at 1:1, and compared pixel for pixel. Zero differences allowed. Verified by falsification: changing one project number in `documents.html` from `PRJ-2026-014` to `PRJ-2027-014` fails both this comparison and the freshness one below.

Getting that to zero took four corrections, each of which was a real difference between the two documents rather than a flaw in the idea:

1. **Nothing behind it.** A mock draws on transparency, so on a Reference page the header, the hero and the section colour show straight through it. The mock is now moved to be the only thing in the document before the shutter.
2. **Nothing beside it.** A Reference page carries five mocks. An early attempt pinned them all to the same corner, and the screenshot came back as four screens painted over the one asked for.
3. **Its own layout left alone.** Overriding the mock's `position` and `overflow` to force whole-pixel coordinates moved two pixels — enough to put the exported image and a fresh render of it permanently at odds. Only the enclosing document is normalised now.
4. **Not centred.** The mock centres itself with `margin-inline: auto`, and half the leftover space lands on a half-pixel whenever a scrollbar makes the viewport an odd width, shifting a gradient one pixel against the studio.

What remained after that was three pixels on one mock, in the outermost trail of a card shadow, differing by one step of alpha out of 255. Rather than tolerate a pixel budget — a budget large enough to cover it also turned out to be large enough to hide a changed digit, which is how that idea was rejected — both images are composited onto an opaque backdrop first. That turns a one-step alpha difference into a one-step colour difference, far below what pixelmatch counts, and leaves everything visible exactly as visible. The backdrop is magenta rather than white, because the mocks are full of white and on white "drew a white card" and "drew nothing" compare equal.

### The committed images cannot go stale

A second test decodes each committed `.webp` and compares it to a fresh render of the studio, at zero difference. Without it the failure is silent and slow: somebody edits a label, nobody re-runs the export, and the site serves last month's picture with this month's markup in the repo to prove it was fixed.

### The studio

`/studio/<locale>/<id>` is one mock alone, and there is nothing else under `/studio`. Its root layout sits *below* the `[locale]` segment so that it can read it: a mock inherits its direction from the document, and hoisting the layout above the segment for tidiness is exactly how an English set ends up rendered right to left.

`noindex` is set two ways and neither depends on the environment — the layout's metadata, and a header rule in `next.config.ts` that sits outside the `isIndexable()` check. Unlike the site's block, which lifts at launch, the studio's is permanent: it shows the same screens as the pages that are meant to rank. Keeping it out of the sitemap is ticket 33's, using the `STUDIO_PREFIX` the registry exports; that ticket carries a note.

The studio layout imports the site's stylesheet as well as its own, because a mock inherits `box-sizing`, `line-height` and the base font size from the page around it — and the comparison above would find every difference the moment that inheritance diverged.

### What the review changed

- **English mocks would have rendered right to left.** The studio's root layout hardcoded `lang="ar" dir="rtl"` above the `[locale]` segment, which quietly made the ticket's "locale-aware by construction" claim false. Moving the layout below the segment fixed it, and took the studio's index page with it — an unasked-for page that was also advertising eight English links that all 404.
- **The export script could not be trusted to clean up after itself.** It launched the browser outside the `try`, so a failure there orphaned the server; it spawned `npm` through a shell, so on Windows killing the handle killed the shell and left the server holding the port; and it piped stdout to nobody, which stops a chatty server dead once the buffer fills. It now runs Next's own binary under this Node, and refuses to start at all if something is already listening — the one failure mode that produces plausible, wrong images.
- **A half-finished run destroyed the committed images.** It wiped the output directory before rendering anything. Everything is rendered first now, and only then replaced.
- **`--only` is gone.** A partial run is how a set of images ends up half one version and half another, and the full run takes under a minute.
- **The indexing test could pass for the wrong reason.** Its `X-Robots-Tag` came from the site-wide pre-launch header, which disappears at launch, so it was not testing the studio's own permanence at all. That header rule now exists for the studio unconditionally.
- **`readScreenMockMarkup` took a string id**, with its safety in a comment saying the caller had checked it against the registry. It takes a `ScreenMock` now, so the filename can only come from the registry.
- **Two new tests** close a gap the reviews found: every comparison iterated the registry, so a mock quietly dropped from it would take its own coverage with it. One test holds the registry, the markup on disk and the exported images to the same list; another holds that list to what the Home and Product pages actually use.

Verified afterwards: re-running `npm run mocks:export` produces byte-identical images and leaves port 4400 free.

### One thing worth knowing

`src/screen-mocks/registry.ts` and `markup.ts` import each other and `../lib/locales.ts` by relative path *with the extension*, rather than through the `@/` alias used everywhere else in `src/`. The export script imports both modules under plain Node, which resolves neither tsconfig paths nor extensionless specifiers. `allowImportingTsExtensions` is on in `tsconfig.json` for the same reason. Anything else added to `src/screen-mocks/` that the script might import needs the same treatment.
