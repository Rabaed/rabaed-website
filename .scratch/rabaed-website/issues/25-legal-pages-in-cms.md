# 25: Legal pages in the CMS

**What to build:** Ahmed and the company's lawyer edit the Terms, Privacy Policy and Referral Terms directly, and every version is kept with its date and author, so the company can prove what its terms said on any given day.

**Blocked by:** 19, 17

**Status:** ready-for-agent

- [ ] The three legal documents are imported verbatim, typos included, as the first version (ADR-0003)
- [ ] Every edit creates a retained version recording who changed it and when; earlier versions can be viewed and restored
- [ ] Publishing a legal change is an explicit action, never an automatic save
- [ ] Edit rights are restricted to the owner account; other editors cannot change legal text
- [ ] The last-updated date shown on the page comes from the published version
- [ ] The `.docx` files stay in the repository as the pre-launch archive and are no longer edited
