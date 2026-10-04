# The confirmation email is designed in the CMS

The applicant's confirmation was plain text that Ahmed edited per form and language, sent with an HTML copy that relied on `white-space:pre-line` — which Outlook ignores, so it arrived as one long line. The founder asked on 5 October 2026 for Ahmed to be able to design it, with pictures, "like the newsletters", and chose **one banner for every form**.

- **A frame the site draws, with parts Ahmed fills.** The email is the site's card, 600 pixels wide, built of tables with every style inline (`src/forms/email-frame.ts`, shared with the team's alert). Ahmed sets a banner, the text and a button; he does not write HTML. A pasted layout would break in Outlook, and an English email needs its own left-to-right layout.
- **The text is rich text** (`confirmationMessage`): paragraphs, two heading sizes, bold, italic, underline, lists, links and pictures, drawn by `src/forms/confirmation-email.ts` from Lexical's own nodes rather than Payload's HTML converter, which writes classes no mail client reads. A link goes only to a web, mail or phone address. The `{الاسم}` rule of ADR-0022 holds in every text node.
- **One banner, in a global of its own** (`confirmation-email`), without drafts: chosen is sent.
- **Pictures in a library of their own** (`email-images`), kept as the JPEG, PNG or GIF they arrived as, with a copy at most 1200 pixels wide that the email shows. The site's images are WebP (`media`), and Outlook on Windows shows no WebP in an email. They are public, at the site's own address, since the applicant's mail client fetches them signed in to nothing; their files are named `email-…`, apart from the site's other images in the same bucket.
- **The plain text it was written in before is read into the rich text** until an Editor first saves it (`writtenBefore`): `confirmationBody` stays as a hidden column, so no data migration rewrites what was published, and every form sends what it sent until Ahmed changes it. The plain-text part of each email is drawn from the rich text the same way back (`tests/unit/confirmation-email.spec.ts` holds every form's text to coming out as it went in).
- **A preview under the text** (`/api/preview/confirmation-email`), for signed-in Editors, drawn from what was last saved with an example name, served with a policy that runs nothing and loads nothing but images.

## Considered options

- **A box for HTML.** Most freedom; every mistake reaches the applicant, and Outlook breaks most layouts written for a browser.
- **A newsletter tool** (MailerLite, which the domain already has). Built for campaigns, not for answering one person's request; and a request is not consent to a mailing list.
- **A banner per form.** Not asked for; one is one image to keep current.

## Consequences

- **Pictures may not show at first.** Outlook and others hold back pictures until the reader allows them, so the text has to say everything, and each picture's description is required. An email that is mostly pictures is also likelier to be filtered as spam; the frame gives the text the room.
- **Opening the email asks the site for its pictures**: an ordinary request in Vercel's records, which the privacy inventory names. Nothing in the email tracks who opened it (ADR-0027 switches SendGrid's tracking off).
- **`confirmationBody` is a column kept for reading only.** Once every form's confirmation has been saved as rich text it can be dropped, with its field.
