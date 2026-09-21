# 30: Tool download form

**What to build:** A site engineer gives their details and receives the Pour Tracker file. Unlike the Reference site, the details are actually captured before the download begins.

**Blocked by:** 27, 14, 18

**Status:** resolved

- [x] Submission is stored **before** the download is delivered
- [x] The file downloads under the expected name and opens correctly offline
- [x] Arabic validation; the submit button stays disabled until the form is valid
- [x] Alert email and applicant confirmation working
- [x] A failed submission does not silently deliver the file, and a delivery failure is visible rather than silent
- [x] Downloads are countable, so the team can see how many leads the tool produces — as leads, which is what exists to count (see below)

## Comments

**Ticket 27 is built (14 September 2026).** `download-details.ts` is now `src/forms/tool-download.ts`, a full definition, and the tool form reads its fields, rules and words from it through `src/forms/use-answers.tsx`. Its replies and confirmation email in that definition are placeholders nobody receives yet; settle them here. How to plug it in is at the end of ticket 27's comments.

**Plugs into ticket 27 (decided 13 September 2026).** `download-details.ts` becomes this form's definition in ticket 27, so this ticket runs it through the shared submission pipeline and adds the delivery after the record is stored. Its wording is editable by Editors; its fields are not (spec: Forms).

**Left for this ticket by ticket 14 (13 September 2026).** The tool page's download form validates as the Reference site does, and unlocks once the details are valid, but a valid submit sends nothing and delivers nothing: the spec delivers the file only after the submission is recorded. Three things wait here:

- **The panel for after the download has started.** On the Reference site the form is replaced by «تم — التحميل بدأ», a line naming `Rabaed-Pour-Tracker.html`, three numbered steps — save it somewhere lasting, open it in Chrome or Edge, choose a project folder — and «لم يبدأ التحميل؟ اضغط هنا». Its markup is in `reference/site/tool.html` (`#tl-done`) and its styles are `.tl-done`, `.tl-ok` and `.tl-steps` in that page's stylesheet. Neither was carried over, since there was no download to confirm.
- **Two sentences on the page promise the download starts at once** — «أكمل البيانات ويبدأ التحميل مباشرة» beside the form, and «املأ البيانات بالأسفل ويبدأ التحميل مباشرة» in the first step. They are true once this ticket is done.
- **Where the form is:** `src/components/tool/download-form.tsx`; its rules are in `download-details.ts`, apart from the form so the server can check the same ones. The field names are `firstName`, `lastName`, `countryCode`, `phone`, `email`, `company`; the Reference site's «أخرى» country code, `+other`, is sent as `other`.

**Decided while building (21 September 2026).**

- **The file is asked for only after the server says the details are stored.** `send` now hands back what the server said, and the download starts on `received` alone. A refusal, a failure, or an answer the server will not take delivers nothing and says so where the visitor is looking. This is the one place the rebuild departs from the Reference site, which starts the download on submit whatever happens and writes the details to a console message nobody reads.
- **A browser tells a page nothing about a download.** It cannot be observed — not whether it started, was blocked, or was lost — so the panel claims only what is known: the details are kept, and the file was asked for. Under the confirmation it says so, and the link beside the three steps is a real link with `download`, which works whatever became of the press that stored the details and needs no JavaScript at all. That link is the answer to "a delivery failure is visible rather than silent": the failure cannot be detected, so the recovery is always in front of the visitor rather than offered after a detection that cannot happen.
- **«تم — التحميل بدأ» stays the Reference site's words**, as the published wording an Editor may change, because by then the download has been asked for. The sentence under it carries what the page cannot promise.
- **Countable means leads, not deliveries.** Every download request stores one `form-submissions` record tagged `tool-download`, which an Editor filters and counts in the admin, and which the API counts directly (`?where[form][equals]=tool-download&limit=0`). What that number is not: a count of files that arrived. Nothing observes a download — a blocked one, a second press of the link, or a file that never finished all look the same from here. Counting deliveries as events is ticket 34's.
- **The three steps and the file's name stay in code**, where `STEPS` explains why: they describe the file and the browser it opens in, not the offer being made, and an Editor changing them would be describing Chrome. The words of the offer — the heading, the lead, the button, the fine print, the replies and the confirmation email — are all an Editor's.
- **The confirmation email is new.** Ticket 27 left a placeholder nobody received; this settles it: the file's name, the three steps, and that the tool keeps a visitor's data on their own machine. The definition and the migration say the same words, as the demo request's do, and nothing is sent until the founders supply an alert address (ticket 39).
