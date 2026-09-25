# A Pour Tracker release is published from the CMS, on its checksum alone

Ticket 49 shipped the Pour Tracker as a file in the site's code: release 2026-08-25.7, byte for byte, held there by a test that knows its checksum and walks through the tool. The tests check that the brand reads ربائد, that it makes no request but the Google Fonts ones, that it opens offline, and that a logged pour shows its 7 and 28-day dates. A new release therefore needed a developer.

On 25 September 2026 the founder chose to have Ahmed, who builds each **Release** (CONTEXT.md), publish it himself from the CMS. He uploads the release's HTML file together with its checksum file. The CMS accepts the upload only when the two match, and publishes it with the Publish button, like any other content. From then on it is what visitors download, at the same address and under the same name, `Rabaed-Pour-Tracker.html`.

**A release is accepted on its checksum, not after a walk-through.** The checksum proves the file is the one its builder delivered, undamaged and not mixed up with another. It does not prove what is inside. The walk-through runs only on the site's code, never on an upload, so a release published from the CMS goes live without it. What it would have checked is Ahmed's responsibility as its builder. Two alternatives were turned down:

- **Accepting any file.** Nothing would catch the wrong file, or a damaged one.
- **A developer approving each release before it goes live.** It is the only way to put every release through the walk-through, but Ahmed would have to wait on someone for every release, which is what this change is meant to end.

**The copy in the code stays, as the fallback.** It is served whenever the CMS holds no published release, so the download can never be empty. It is also the release the tests walk through, so ticket 49's checks keep guarding the delivery: the headers, the download name, what the tool does. A developer refreshes it with a recent release from time to time; that is the only way a new release gets the full walk-through. It is never urgent, and a release is never held back for it.

## Consequences

- **What visitors download is no longer fixed by the code.** The test that holds the code copy to its checksum is about the fallback, not about what the site serves. Checking what is live means checking the CMS.
- **A release number names one file for good.** The CMS refuses a release number already used for a different file, and a checksum file that names no release number. An older release number than the live one is allowed, labelled as older, because going back is Ahmed's call; so is restoring an earlier release from the CMS's history.
- **The CMS's Pour Tracker screen shows three releases:** the live one and when it was published, the one waiting to be published, and the fallback in the code. The last one tells Ahmed what visitors would get if his were removed.
- **Visitors keep the release they downloaded.** Nobody is told of a new one. Emailing past downloaders is a marketing and privacy decision of its own, out of scope here.
