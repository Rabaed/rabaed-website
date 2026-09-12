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
