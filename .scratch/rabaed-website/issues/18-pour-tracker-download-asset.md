# 18: Pour Tracker download file

**What to build:** The free tool itself, ready to be delivered as a download: a single self-contained file the visitor keeps and opens offline.

**Blocked by:** 01

**Status:** resolved

- [x] The Reference site's `pour-tracker.html` is carried over as-is, keeping its own claymorphic look and its existing Arabic/English switcher — at `public/downloads/Rabaed-Pour-Tracker.html`, with the two small changes noted below
- [x] The brand misspelling رَبَاعِد is corrected to ربائد everywhere in the file — six places
- [x] Its unconfigured Google Sheet submission code is removed; lead capture happens on the site, not inside the file
- [x] The file opens and works correctly from a local disk with no network connection
- [x] Served under the download name used by the Reference site — `/downloads/Rabaed-Pour-Tracker.html`, sent as an attachment and never indexed (`next.config.ts`)

## Comments

**The file is not the tool (13 September 2026).** `reference/site/pour-tracker.html` is the Pour Tracker's own sales page, not the tool itself; see ticket 49. The founder chose to ship it as the download anyway, and to swap in the real file once it is in hand.

**Two changes beyond "as-is", both so the file works once downloaded.** Its own download button pointed at `pour-tracker.html`, a name that never sits next to a downloaded copy; it now points at `Rabaed-Pour-Tracker.html`. And opened from a disk, Chromium ignores `download` on a `file://` page and reloads it instead, wiping the form and never showing the confirmation, so the button skips the download there — the visitor already has the file — and the "did not start? click here" link is hidden. The `dataset.busy` check that only the removed sending code used went with it.

**Fonts still come from Google.** The file's own FAQ, and `tool.html`'s, say the two web fonts are the only thing fetched online and that offline it falls back to the system font. `tests/e2e/pour-tracker-download.spec.ts` allows exactly those requests to fail and nothing else.
