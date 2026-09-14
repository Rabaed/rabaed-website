# 28: Document uploads, delivered through the Referral signup

**What to build:** A referrer uploads an IBAN certificate and a commercial registration with their application. The documents are stored where nobody can reach them by guessing an address, and the team opens them from the submission record.

**Blocked by:** 27, 15

**Status:** resolved

- [x] Uploads go to a **private** Supabase bucket; a direct URL without authorisation fails (ADR-0004)
- [x] The team opens a document through a short-lived signed link from the submission record
- [x] File type and size validated **on the server**, not only in the browser; 10 MB cap with an Arabic error message
- [x] The visitor sees the filename, upload progress and a clear error if the file is rejected
- [x] Upload fields keep the Reference site's label structure and selected-state styling
- [x] Both consent checkboxes are required, and consent is recorded with the submission
- [x] A test proves an uploaded document is not publicly retrievable

## Comments

**What ticket 15 leaves for this one.**

The signup form is `src/components/referral/signup-form.tsx`:

- **Its fields are ready.** Every field is named, and the starred ones, the IBAN certificate and both consents are already `required`.
- **Its submit button is disabled.**
- **Its small print still reads «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.»** That is true until this ticket, and must go with it.

The document fields are `src/components/upload-field.tsx`. They already show the chosen file's name and the green selected state. This ticket adds progress and the server's rejection.

**Moved by ticket 16**, from `src/components/referral/`, because the partnership application's commercial registration is the same field. Progress and rejection added here reach that form too; ticket 29 wires it.

**Ticket 27 is built (14 September 2026).** The pipeline is `src/forms/submission.ts`, and how a form plugs in is at the end of ticket 27's comments. Two things this ticket meets there: the pipeline reads only text entries from the form data (`entry` ignores files), and Next's server action body limit defaults to 1 MB, below the 10 MB cap (`serverActions.bodySizeLimit` in `next.config.ts`). A field definition (`FieldDefinition` in `src/forms/definition.ts`) describes typed text and lists only, and `use-answers.tsx` handles inputs and selects; this ticket gives definitions a way to describe a document and a consent checkbox, and puts the storage adapter inside `submit`.

**Plugs into ticket 27 (decided 13 September 2026).** The signup form becomes a form definition run through ticket 27's submission pipeline; the upload checks and private storage go inside that pipeline, behind a storage adapter, so ticket 29 reuses them. Its wording is editable by Editors; its fields are not (spec: Forms).

**The page promises a referral code «فوراً على جوالك وبريدك», and no ticket issues one.** See ticket 15's note for the founder.

**Built on 15 September 2026.** Where things are, and what was decided along the way.

- **Definitions describe documents and consents.** A field is typed text, a list, a `document` (a PDF, PNG or JPEG of at most 10 MB) or a `consent` (always required). `src/forms/referral-signup.ts` is the signup's definition; its wording is a settings global in the CMS, like the demo request form's, with a "too large" and a "wrong type" message per document.
- **Every form now sends to one route, `/api/forms/<form>`**, instead of the server action ticket 27 used, because only a request the page makes itself can report upload progress (`src/forms/send.ts`, `use-submission.ts`). The route refuses a request whose `Origin` is another site, which the server action had done on its own. The demo request form moved to it too.
- **The server checks each document by its first bytes**, not its name or what the browser claims, and by its size, before anything is stored. Documents go to storage first and the record after; if the record fails, the documents are removed.
- **Private storage sits behind an adapter** (`src/forms/documents.ts`): the Supabase bucket named by `S3_DOCUMENTS_BUCKET` on a deployment, using the media bucket's S3 connection, and a folder locally and in tests. It refuses to be the media bucket. A deployment without it still builds, but a form carrying documents fails to send and says so.
- **Documents open through `/api/form-documents/<submission>/<field>`**, which needs both a signed link that expires after 10 minutes (HMAC with the CMS secret) and a signed-in editor. The admin shows an **Open document** link per document, made fresh each time the record is read. Supabase's own signed URLs are not used: the documents never get an address outside this route.
- **Deleting a submission deletes its documents** from storage.
- **Consent is recorded** as `accepted` on each consent's answer, beside the submission's date.
- **Messages sit under each row** rather than inside it, and a refused file turns its card red while a missing one keeps the empty card, so the form still measures as the Reference site's. The small print's height is left out of that comparison: its words now describe the documents.
- **Needs a founder step before the preview or production can take a signup:** create a private `documents` bucket in Supabase and set `S3_DOCUMENTS_BUCKET` in Vercel (`docs/deployment.md`, step 4).
