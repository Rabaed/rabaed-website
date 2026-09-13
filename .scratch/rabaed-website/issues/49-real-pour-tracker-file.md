# 49: The real Pour Tracker file

**What to build:** Visitors who download the Pour Tracker receive the tool itself — the file that logs pours, counts down to the 7 and 28-day cube tests and writes to a project folder — instead of the page that advertises it.

**Blocked by:** 18. Requires one human step first: the founder obtains the actual Concrete Pour Tracker HTML file from the co-founder.

**Status:** needs-info

- [ ] The real tool file is in the repo, served at `/downloads/Rabaed-Pour-Tracker.html` in place of the file ticket 18 put there
- [ ] Same treatment as ticket 18: brand spelled ربائد, no code that sends a visitor's details anywhere, works from a local disk with no network
- [ ] `tests/e2e/pour-tracker-download.spec.ts` asserts what the tool does (logging a pour shows its 7 and 28-day dates) rather than the sales page's headline and form

## Comments

**Found on 13 September 2026, while building ticket 18.** `reference/site/pour-tracker.html` is not the tool. It is the tool's own claymorphic sales page: a hero, the problem, six features, how it works, a privacy section, requirements, a sign-up form, an FAQ and an upgrade pitch. Nothing in it logs a pour, runs a countdown or opens a folder. Its stylesheet header says it was "Extracted from the Concrete Pour Tracker, 2026-08-24", so the tool existed, but `reference/HANDOFF.md` describes this file as "the tool file itself" and the Reference site's `tool.html` downloads it as `Rabaed-Pour-Tracker.html`.

Every copy in the founder's folders (`Agentic Website`, `Claude RABA`, `Sousi`, `rabaed-b`) is the same 108,993-byte sales page.

The founder chose to ship ticket 18 with the sales page as the download anyway, so the delivery path, headers and tests exist, and to replace the file once the real one is in hand. Until then the download is not the tool, which matters most at go-live (ticket 39) and for the tool download form (ticket 30).

**The sales page's own form says things that are no longer true (review of ticket 18).** The site sends the file as a download, so its built-in form only ever runs on a visitor's disk. There it collects a name, phone and email and sends them nowhere, yet its consent line still says we may contact them, and after submitting it says the download has started when nothing downloads. Ticket 18 left the wording alone because it ships the file "as-is" and changing what a visitor reads is the founder's call. Replacing the file with the real tool makes this go away; if that is delayed, the wording needs a decision.
