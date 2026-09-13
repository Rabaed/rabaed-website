# Every Editor has full CMS access

ADR-0003 restricted edit rights on legal documents to an owner account. The founder overruled that on 13 September 2026: the team is small, the lawyer will never log into the CMS and sends changes to an Editor, so whoever is given access can change every page, legal pages included. There is one role, not an owner/editor split.

## Consequences

- ADR-0003's provenance still holds without the restriction: legal documents keep versioning with retained history, an author and timestamp per version, and an explicit publish. The record of who changed the binding text, and when, is what protects it; not who was allowed to.
- Ticket 25's "edit rights are restricted to the owner account" acceptance criterion and the spec's matching line no longer apply.
- Any Editor can invite and remove other Editors, so the number of accounts is the control: give access only to people who edit.
