# 28: Document uploads, delivered through the Referral signup

**What to build:** A referrer uploads an IBAN certificate and a commercial registration with their application. The documents are stored where nobody can reach them by guessing an address, and the team opens them from the submission record.

**Blocked by:** 27, 15

**Status:** ready-for-agent

- [ ] Uploads go to a **private** Supabase bucket; a direct URL without authorisation fails (ADR-0004)
- [ ] The team opens a document through a short-lived signed link from the submission record
- [ ] File type and size validated **on the server**, not only in the browser; 10 MB cap with an Arabic error message
- [ ] The visitor sees the filename, upload progress and a clear error if the file is rejected
- [ ] Upload fields keep the Reference site's label structure and selected-state styling
- [ ] Both consent checkboxes are required, and consent is recorded with the submission
- [ ] A test proves an uploaded document is not publicly retrievable

## Comments

**What ticket 15 leaves for this one.**

The signup form is `src/components/referral/signup-form.tsx`:

- **Its fields are ready.** Every field is named, and the starred ones, the IBAN certificate and both consents are already `required`.
- **Its submit button is disabled.**
- **Its small print still reads «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.»** That is true until this ticket, and must go with it.

The document fields are `src/components/upload-field.tsx`. They already show the chosen file's name and the green selected state. This ticket adds progress and the server's rejection.

**Moved by ticket 16**, from `src/components/referral/`, because the partnership application's commercial registration is the same field. Progress and rejection added here reach that form too; ticket 29 wires it.

**Plugs into ticket 27 (decided 13 September 2026).** The signup form becomes a form definition run through ticket 27's submission pipeline; the upload checks and private storage go inside that pipeline, behind a storage adapter, so ticket 29 reuses them. Its wording is editable by Editors; its fields are not (spec: Forms).

**The page promises a referral code «فوراً على جوالك وبريدك», and no ticket issues one.** See ticket 15's note for the founder.
