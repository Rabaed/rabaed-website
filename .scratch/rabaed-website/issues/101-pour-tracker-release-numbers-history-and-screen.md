# 101: Release numbers are guarded, and Ahmed can see and restore Pour Tracker releases

**What to build:** Ticket 100 lets Ahmed publish a Pour Tracker **Release** (CONTEXT.md). This ticket makes that safe to do over time. A release number always names one file. The Pour Tracker screen tells Ahmed what visitors get now, what is waiting, and what they would get without his release. And he can go back to an earlier release himself. See ADR-0024, Consequences.

**Blocked by:** 100.

**Status:** ready-for-agent

- [ ] A checksum file that names no release number is refused, and the message says so in the Editor's language
- [ ] A release number already used for a different file is refused. The same file under the same number is not a new release, so uploading it again does not count as a clash
- [ ] A release number older than the live one is accepted, but clearly labelled as older than the live release before Ahmed publishes it
- [ ] The Pour Tracker screen shows three releases, each by release number: the one visitors download now and when it was published; the one waiting for Publish, if any; and the fallback kept with the site's code (today 2026-08-25.7)
- [ ] Ahmed can restore an earlier release from the CMS's history and publish it, with no developer needed; the next download is that release, byte for byte
- [ ] Removing the published release makes visitors receive the fallback again, and the screen says so
- [ ] The deployment guide says how a developer refreshes the fallback in the code with a recent release — the file and its checksum, and the release number and checksum the tests hold — and why: it is the only way a release gets ticket 49's walk-through. It is never urgent
- [ ] Tests cover each refusal, the older-release label, a restore reaching the download, and a removal falling back
