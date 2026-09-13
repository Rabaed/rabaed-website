# 30: Tool download form

**What to build:** A site engineer gives their details and receives the Pour Tracker file. Unlike the Reference site, the details are actually captured before the download begins.

**Blocked by:** 27, 14, 18

**Status:** ready-for-agent

- [ ] Submission is stored **before** the download is delivered
- [ ] The file downloads under the expected name and opens correctly offline
- [ ] Arabic validation; the submit button stays disabled until the form is valid
- [ ] Alert email and applicant confirmation working
- [ ] A failed submission does not silently deliver the file, and a delivery failure is visible rather than silent
- [ ] Downloads are countable, so the team can see how many leads the tool produces

## Comments

**Left for this ticket by ticket 14 (13 September 2026).** The tool page's download form validates as the Reference site does, and unlocks once the details are valid, but a valid submit sends nothing and delivers nothing: the spec delivers the file only after the submission is recorded. Three things wait here:

- **The panel for after the download has started.** On the Reference site the form is replaced by «تم — التحميل بدأ», a line naming `Rabaed-Pour-Tracker.html`, three numbered steps — save it somewhere lasting, open it in Chrome or Edge, choose a project folder — and «لم يبدأ التحميل؟ اضغط هنا». Its markup is in `reference/site/tool.html` (`#tl-done`) and its styles are `.tl-done`, `.tl-ok` and `.tl-steps` in that page's stylesheet. Neither was carried over, since there was no download to confirm.
- **Two sentences on the page promise the download starts at once** — «أكمل البيانات ويبدأ التحميل مباشرة» beside the form, and «املأ البيانات بالأسفل ويبدأ التحميل مباشرة» in the first step. They are true once this ticket is done.
- **Where the form is:** `src/components/tool/download-form.tsx`; its rules are in `download-details.ts`, apart from the form so the server can check the same ones. The field names are `firstName`, `lastName`, `countryCode`, `phone`, `email`, `company`; the Reference site's «أخرى» country code, `+other`, is sent as `other`.
