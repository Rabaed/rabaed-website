# The CMS is the system of record for legal pages

`reference/HANDOFF.md` rule 1 states that the Terms, Privacy Policy and Referral Terms are generated verbatim from `reference/legal-source/*.docx` and must never be edited as page text — deliberately preserving three known typos to prove the point. We are moving those pages into the CMS and making the CMS authoritative.

The rule's purpose is provenance: being able to show what the binding text said on a given date. A versioned CMS entry with an author and timestamp serves that purpose better than a Word file edited by hand, and it lets the lawyer's corrections reach the site without a developer. The `.docx` files are imported once, verbatim including the typos, and then retained as the pre-launch archive.

## Consequences

- Legal entries require versioning with retained history and explicit publish; edit rights are restricted to the owner account.
- Keeping the `.docx` in sync by hand was rejected: two copies maintained manually always drift, which is the failure the original rule guarded against.
- The Arabic text is the binding version. Legal pages are not translated (see the spec's Out of Scope).
