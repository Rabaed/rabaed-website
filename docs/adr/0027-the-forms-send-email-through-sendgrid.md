# The forms send email through SendGrid

The spec has the forms send through the company's Microsoft 365 no-reply mailbox, over SMTP with a password, and "no third-party email service" (spec: Stack and hosting). Once the mailbox's address and password were set on Vercel, on 4 October 2026, every alert and confirmation failed: Microsoft answered `535 5.7.3 Authentication unsuccessful` to a password that signed in to the mailbox correctly, with **Authenticated SMTP** ticked for the account. The tenant refuses password sign-in over SMTP; ticket 27 had named the risk. Ahmed received nothing from any form.

The founder chose on 5 October 2026 to **send through SendGrid** instead, where `rabaedapp.com` is already an authenticated domain (its `em228` CNAMEs at GoDaddy) and `noreply@rabaedapp.com` a verified sender.

- **SendGrid's HTTP API**, `POST /v3/mail/send`, with a key restricted to **Mail Send**. It goes out over HTTPS, which a Vercel function always has, and a refusal comes back with a status and SendGrid's reason, which the function log keeps. `nodemailer` leaves the project.
- **`MAIL_FROM` and `SENDGRID_API_KEY`, both or neither**, as `MAIL_USER` and `MAIL_PASSWORD` were. Without them the site sends nothing and records each email as not sent.
- **Click, open and subscription tracking are switched off on every message**, in the request itself, so that a setting changed in SendGrid's dashboard cannot turn them on. Click tracking would send the alert's link to the record through SendGrid's address; open tracking hides an image that reports when a message is read.

## Considered options

- **Microsoft 365 with OAuth** (an Entra app registration allowed to send as the mailbox, through Microsoft Graph). It keeps the spec's rule of no third party, and needs no licence beyond the mailbox's own. It needs an admin to register the app and grant it permission in the tenant, and its own credentials to rotate. SendGrid was already set up and verified.
- **Switching password SMTP back on for the tenant.** It means loosening a protection that covers every account in the company, to suit one form.

## Consequences

- **A third company sees every submission's answers**, in the alert, and the applicant's address and name, in the confirmation. The privacy inventory names SendGrid in sections 5, 6, 8 and 11, for the lawyer.
- **The alert lands in the team's Microsoft 365 inbox as before**, and replying to it still goes to the applicant.
- **No copy is kept in a "Sent" folder.** SendGrid's activity record of each message is what is left to check a delivery against.
