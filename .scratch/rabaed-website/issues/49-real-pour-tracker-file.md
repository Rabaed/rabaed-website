# 49: The real Pour Tracker file

**What to build:** Visitors who download the Pour Tracker receive the tool itself — the file that logs pours, counts down to the 7 and 28-day cube tests and writes to a project folder — instead of the page that advertises it.

**Blocked by:** 18. Requires one human step first: the founder obtains the actual Concrete Pour Tracker HTML file from the co-founder.

**Status:** resolved — the co-founder's build 2026-08-25.7 is the download, byte for byte; see the Comments

- [x] The real tool file is in the repo, served at `/downloads/Rabaed-Pour-Tracker.html` in place of the file ticket 18 put there
- [x] Same treatment as ticket 18: brand spelled ربائد, no code that sends a visitor's details anywhere, works from a local disk with no network — *met as delivered and checked on what the tool does, not by editing the file, which cannot be edited; see the Comments*
- [x] `tests/e2e/pour-tracker-download.spec.ts` asserts what the tool does (logging a pour shows its 7 and 28-day dates) rather than the sales page's headline and form

## Comments

**Found on 13 September 2026, while building ticket 18.** `reference/site/pour-tracker.html` is not the tool. It is the tool's own claymorphic sales page: a hero, the problem, six features, how it works, a privacy section, requirements, a sign-up form, an FAQ and an upgrade pitch. Nothing in it logs a pour, runs a countdown or opens a folder. Its stylesheet header says it was "Extracted from the Concrete Pour Tracker, 2026-08-24", so the tool existed, but `reference/HANDOFF.md` describes this file as "the tool file itself" and the Reference site's `tool.html` downloads it as `Rabaed-Pour-Tracker.html`.

Every copy in the founder's folders (`Agentic Website`, `Claude RABA`, `Sousi`, `rabaed-b`) is the same 108,993-byte sales page.

The founder chose to ship ticket 18 with the sales page as the download anyway, so the delivery path, headers and tests exist, and to replace the file once the real one is in hand. Until then the download is not the tool, which matters most at go-live (ticket 39) and for the tool download form (ticket 30).

**The sales page's own form says things that are no longer true (review of ticket 18).** The site sends the file as a download, so its built-in form only ever runs on a visitor's disk. There it collects a name, phone and email and sends them nowhere, yet its consent line still says we may contact them, and after submitting it says the download has started when nothing downloads. Ticket 18 left the wording alone because it ships the file "as-is" and changing what a visitor reads is the founder's call. Replacing the file with the real tool makes this go away; if that is delayed, the wording needs a decision.

**Done, 23 September 2026.** The founder put the file in `Agentic Website/Pour tool/`: `index.html`, build 2026-08-25.7, with a checksum file its SHA-256 matches. It replaces ticket 18's placeholder at `public/downloads/Rabaed-Pour-Tracker.html`.

- **Shipped byte for byte, not given ticket 18's treatment.** The tool's code is deliberately made unreadable, and it checks itself: a copy that has been changed tells its user it is «not the official Rabaed release». So nothing in it may be corrected here — not a spelling, not a line ending. The test holds the checksum, and `.gitattributes` keeps git's line-ending normalisation off the file, as it does for `reference/`.
- **The ticket 18 checks are made on what the tool does instead**, because its code cannot be searched. On every screen a visitor passes through to log a pour, and its upgrade panel, in Arabic and in English, the brand is never رَبَاعِد, and it reads ربائد and Rabaed. Used online through the same walk, it makes no request but the Google Fonts ones the tool page already declares. Offline it opens, switches language and logs a pour with no error. **This is a walk through the tool, not a reading of every line**: a screen or an action the walk does not reach — the backup, the CSV export, the printed sheet — is covered only by the checksum holding the file to the release that was walked through, and by the co-founder's word that it sends nothing, which the tool page repeats.
- **Logging a pour is tested end to end.** A pour cast on 1 September 2026 is due its 7-day test on 8 September and its 28-day on 29 September, and lands in the project folder's `concrete_db.json`. The folder picker is a native dialog no test can answer, so `tests/e2e/project-folder.ts` hands the tool a folder held in memory instead.
- **Its one link out that was found is `https://rabaedapp.com/#contact`**, on its «upgrade to the cloud version» panel. Neither the old site nor this one had a `#contact`, so the closing section's grid — the «how we start» steps and the demo request form — now carries it, clear of the header as `#demo` is. It is on the home and product pages alike. The link works once `rabaedapp.com` points at this site (ticket 39).
- **For the co-founder, not fixed here:** the tool always opens in English, whatever the browser's language, and a visitor who came from the Arabic site switches it with its «ع» button; it remembers the choice after that. The tool page promises «واجهة عربية كاملة», which is true, but not that it opens in Arabic. An Arabic default would be a new build from the co-founder; the test checks only that it opens and switches, so it does not stand in the way of one.
- **The sales page's form problem noted above is gone** with the sales page.
