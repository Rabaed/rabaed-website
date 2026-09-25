# 100: Ahmed publishes a Pour Tracker release from the CMS

**What to build:** Ahmed uploads a new Pour Tracker **Release** (CONTEXT.md) in the CMS: the release's HTML file and its checksum file, the pair he delivers every release as. The CMS refuses the pair if they do not match. Once he presses Publish, the next visitor who downloads the Pour Tracker receives that release, at the same address and under the same name as today. While the CMS holds no published release, visitors receive the copy kept with the site's code, exactly as they do now. The decision and its trade-off are ADR-0024.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The CMS has a Pour Tracker screen, in Arabic and English like the rest of the admin, where an Editor uploads a release as two files: the HTML file and its checksum file (a SHA-256 and the release number, as `Pour tool/index.html.sha256` holds for release 2026-08-25.7)
- [ ] A pair whose HTML file does not match its checksum is refused, and the message says so in the Editor's language; nothing is stored
- [ ] An uploaded release waits for Publish, like every other document in the CMS; until then visitors keep receiving the release they received before
- [ ] After Publish, the very next download is the new release, with no cached copy in between. It is the file Ahmed uploaded, byte for byte (no line endings or characters changed), and the checksum of the downloaded copy matches his checksum file
- [ ] The download is unchanged in every other way: the same address, saved as `Rabaed-Pour-Tracker.html`, sent as an attachment and never indexed. Visitors are only ever sent the site's own address, never the storage's, and the file is never opened as a page on the site
- [ ] With no release published, the download is the copy in the code, and ticket 49's checks of it still pass unchanged
- [ ] Tests cover: a matching pair uploaded, published and then downloaded byte for byte; a mismatched pair refused; an unpublished release not served; no release at all falling back to the code copy. The test release is a small file of its own with its own checksum, so the tests never depend on a real release
