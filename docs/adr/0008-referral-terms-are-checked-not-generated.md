# Referral Terms are checked against the Referral Program values, never generated from them

The Referral page must never disagree with the Referral Terms about the payout or the client discount. We hold the Referral Program values once and show them on the page, but the Referral Terms keep their own verbatim, versioned text (ADR-0003): changing a value does not rewrite the terms. Instead the CMS warns, on both the values and the Referral Terms, whenever the published terms do not state the current values, until an Editor publishes a matching terms version.

## Considered Options

- **Generate the terms from the values**: rejected, because the site would be writing binding legal text by itself, and the record of what the lawyer's wording said on a date would stop being the lawyer's wording.
- **One action that changes both at once**: rejected as machinery for a change expected about once a year.
- **Fail the test suite on a mismatch**: not enough on its own, because content edits made in the CMS never run the tests. The warning has to live in the CMS.
