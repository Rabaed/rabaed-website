# 37: Privacy inventory for the lawyer

**What to build:** A plain-language document the founders can hand to their lawyer, listing exactly what the site now collects, where it is stored, who can reach it and for how long — so the Arabic Privacy Policy can be updated before launch.

**Blocked by:** 27, 28

**Status:** resolved

- [x] Every field collected by every form is listed, in plain language, not technical terms
- [x] Document uploads called out specifically: IBAN certificates and commercial registrations, where they are stored and who can retrieve them
- [x] Storage location, retention period and access controls stated for each category
- [x] Analytics data collection described, including that it is cookie-free
- [x] Email processing described: the Microsoft 365 mailbox that sends alerts and confirmations
- [x] Written in Arabic and English, ready for the lawyer to work from
- [x] Delivered to the founders as a document, not only as a file in the repository

**Note:** the Privacy Policy currently describes a site that collects nothing. Launching without this is a real exposure under Saudi personal data law, given what the Referral form collects.

## Comments

**Built on 21 September 2026.** Where it is, and what it turned out to contain.

- **The inventory is `docs/privacy-inventory.ar.md`, with the English at `docs/privacy-inventory.md`.** Arabic is the binding language of the policy, so it is the one the lawyer works from; the English says the same thing for the team. Twelve sections: the four forms field by field, what is stored with every submission besides the answers, the uploaded documents, a table of where each category is kept and who can reach it, email, analytics and cookies, the outside companies, what the site does *not* collect, how a deletion request is handled today, and what is still to be decided.
- **Delivered as a page as well**, since a file in the repository is not something a founder hands to a lawyer: <https://claude.ai/artifact/UUZCKQULts81nQHFhYENFu>, both languages behind a switch, printable. It is private until shared from its own Share menu. The markdown is the source; the page is its picture, and a change to one is a change to both.

**What the writing turned up, none of it a code change.**

- **The policy in force describes a different site.** It says credit card details may be collected, that data may be shared with partners, affiliates, advertisers and sponsors, and that there is a mailing list with an unsubscribe link. None of that is true of this site. It says nothing about uploaded documents or about how long anything is kept. Section 02 lists this for the lawyer rather than leaving it to be noticed.
- **An IBAN certificate carries more than an IBAN.** The site asks for the certificate as a whole document, so the account holder's national ID or Iqama number usually arrives with it, and a tax registration certificate carries a VAT number. Rabaed asks for none of those and copies none of them out — but it holds the document that contains them, and the policy has to say so. The same point applies to a commercial registration.
- **The partnership application's free text is 2,000 characters of whatever the applicant chooses to write.** A policy that promises only the listed fields are held would be wrong about it.
- **Retention is a decision nobody has made.** Nothing is deleted automatically anywhere. The inventory states that plainly rather than inventing a period, and section 11 asks for one for submissions and a possibly shorter one for documents.
- **Three regions are unrecorded:** where Vercel runs the site, where the Supabase database and `documents` bucket are, and where the Microsoft 365 mailbox is. Each is one setting, and each decides whether the policy has to describe a transfer outside the Kingdom. They are the first thing section 11 asks the founders for.
- **The tool download form is listed in full although it stores nothing yet** (ticket 30). A policy written to cover only what is live today would have to be reopened the day that ticket lands.
- **Analytics is described as decided but not installed** (ticket 34), with the one line — whether the chosen tool touches a visitor's address at all — marked as owed to the lawyer before the policy is finalised. Ticket 34's last acceptance criterion writes that line.

**A test holds it to the forms.** `tests/e2e/privacy-inventory.spec.ts` compares both documents against `src/forms/` and fails if a field is added, removed or renamed without them: the set of field names in each form's table must equal the definition's, in both languages, and every uploaded document's field must be named in the section about the private store. It opens no browser, as the screen mock registry's own two checks do not. Prose cannot be tested for being true, but the thing that actually goes wrong here — a field added, the inventory forgotten, the lawyer's policy quietly out of date — now fails a run. `src/forms/definition.ts` and the deployment guide both say so where a developer will be standing.

**The convention the test reads:** inside a form's section, the only thing set in `code type` within a table row is a field's own name. Anything else — a stored value, a file type — is written in «guillemets».
