# What the Rabaed website collects

**An inventory for the lawyer.** Prepared by the build team of شركة ربائد البناء (unified number 7050078786, Riyadh) on 20 September 2026, so that the Arabic Privacy Policy can be rewritten to describe the site as it actually is, before launch.

The Arabic version of this document is [`privacy-inventory.ar.md`](privacy-inventory.ar.md), and it says the same thing. Arabic is the binding language of the policy; this English version is for the team.

> **This is not a privacy policy and not legal advice.** It is a factual list: what the site asks people for, where each answer ends up, who can open it, and for how long. The lawyer writes the policy from it.

---

## 1. In three sentences

The site has **four forms**; three of them are live today and one is not yet connected. The most sensitive thing it collects is **uploaded documents from people joining the Referral Program** — an IBAN certificate, and optionally a commercial registration and a tax registration certificate — which are kept in private storage that has no public address at all. The site sets **no cookie on a visitor's browser**, shows no advertising, and sends nothing to any advertising or tracking company.

## 2. What the current Privacy Policy says that is not true of this site

Worth reading before the rewrite. The policy in force was written for the company in general, not for this website, and it describes collection that does not happen here:

- It says **credit card details** may be collected. The site never asks for a payment method, anywhere.
- It says data may be shared with **partners, affiliates, advertisers and sponsors**. Nothing on this site shares anything with any of them. The only outside companies involved are the three service providers in section 8, which hold the data on Rabaed's behalf and do nothing else with it.
- It describes a **mailing list** with an unsubscribe link at the bottom of each message. The site has no mailing list and sends no marketing email. It sends exactly two kinds of message, both in section 6.
- It says nothing about **uploaded documents**, which are the most sensitive thing the site now holds (section 4).
- It says nothing about **how long anything is kept**. Nothing is deleted automatically today; see section 5 and the decisions in section 11.

## 3. The forms, field by field

Every form is listed here in full. The first column is the name the field has inside the system — it appears beside each answer in the team's admin screen, so a question in this document can be matched to what the team sees. **The lawyer can ignore that column**; the plain-language description is beside it.

No form asks for a national ID number, a passport number, a date of birth, a payment method, health information, or anything else of that kind.

### Demo request — `demo-request`

**Where:** at the end of the home page, at the end of the product page, and beside the questions on the "Start" page. It is one form in three places, and all three store the same thing.
**Why it exists:** to book a 30-minute demonstration call.
**Live:** yes.

| Field name | What the visitor is asked for | Must they answer? | What is stored |
| --- | --- | --- | --- |
| `name` | Their full name | Yes | As typed |
| `email` | Their email address | Yes | As typed |
| `role` | Their role on the project: owner or developer, consultant, or contractor | Yes | One of three fixed values — «owner», «consultant», «contractor» — kept alongside the Arabic wording the visitor actually saw |
| `phone` | Their mobile number | Yes | As typed |
| `company` | The name of their company | No | As typed |
| `activeProjects` | How many projects they have running now | No | A number of up to four digits |

### Referral Program signup — `referral-signup`

**Where:** the Referral Program page, `/referral`.
**Why it exists:** to enrol an individual who refers clients, issue them a referral code, and be able to pay them the SAR 2,000 per project the programme promises.
**Live:** yes. This is the form that carries the most sensitive information on the site.

| Field name | What the visitor is asked for | Must they answer? | What is stored |
| --- | --- | --- | --- |
| `name` | Their full name | Yes | As typed |
| `phone` | Their mobile number | Yes | As typed |
| `email` | Their email address | Yes | As typed |
| `city` | The city they are in | Yes | As typed |
| `profession` | What they do: engineer, project manager, independent consultant, contractor, real-estate development advisor, content creator, or other | Yes | One of seven fixed values, kept alongside the Arabic wording the visitor saw |
| `employer` | Where they work | No | As typed |
| `ibanCertificate` | Their IBAN certificate, as a file — this is how their bank details reach Rabaed | Yes | The file itself, in private storage (section 4), plus its original filename, its type and its size |
| `accountHolder` | The name on the bank account, as it appears on the IBAN certificate | Yes | As typed |
| `commercialRegistration` | Their commercial registration, as a file, if they have one | No | As `ibanCertificate` above |
| `taxRegistrationCertificate` | Their tax registration certificate, as a file, if they have one | No | As `ibanCertificate` above |
| `acceptTerms` | A tick box: agreement to the Terms and the Privacy Policy | Yes | Recorded as «accepted», with the date and time of the submission |
| `declareNoConflict` | A tick box: a declaration that they have no conflict of interest | Yes | Recorded as «accepted», with the date and time of the submission |

**Two things about the uploaded files that the policy should not overlook.** The site asks for a certificate as a whole document, so whatever the issuing bank or authority printed on it arrives with it — an IBAN certificate commonly carries the account holder's national ID or Iqama number, and a tax registration certificate carries a VAT registration number. Rabaed does not ask for those numbers and does not copy them out of the document, but it does hold the document that contains them.

**No bank account number is typed into the site**, and the site never makes a payment. Paying a referrer happens outside the site, from the certificate.

### Partnership application — `partnership-application`

**Where:** the Partnership Program page, `/partnership`.
**Why it exists:** so an engineering office or project-management company can ask for a partnership meeting.
**Live:** yes.

| Field name | What the visitor is asked for | Must they answer? | What is stored |
| --- | --- | --- | --- |
| `company` | The name of the office or company | Yes | As typed |
| `commercialRegistration` | The office's commercial registration, as a file | Yes | The file itself, in private storage (section 4), plus its original filename, its type and its size |
| `city` | The city the office is in | Yes | As typed |
| `name` | The name of the person applying | Yes | As typed |
| `jobTitle` | Their position in the office | Yes | As typed |
| `phone` | Their mobile number | Yes | As typed |
| `email` | Their email address | Yes | As typed |
| `activity` | What the office does: consulting office, project management, contracting, real-estate development, or other | Yes | One of five fixed values, kept alongside the Arabic wording the visitor saw |
| `activeProjects` | How many projects it supervises now: 1–3, 4–10, 11–25, or more than 25 | Yes | One of four fixed values, kept alongside the Arabic wording the visitor saw |
| `clientType` | Who its clients mostly are: individual developers, development companies, government bodies, or a mixture | Yes | One of four fixed values, kept alongside the Arabic wording the visitor saw |
| `projectArea` | The average size of its projects, in square metres | Yes | One of four fixed values, kept alongside the Arabic wording the visitor saw |
| `partnershipMode` | Which kind of partnership it has in mind, or that it has not decided | Yes | One of four fixed values, kept alongside the Arabic wording the visitor saw |
| `goals` | What the office wants out of the partnership — free text, up to 2,000 characters | No | As typed. Whatever the applicant chooses to write ends up stored, so the policy should not promise that only the listed fields are held |

### Pour Tracker download — `tool-download`

**Where:** the tool page, `/tool`, in front of the free Pour Tracker file.
**Why it exists:** to know who is downloading the free tool.
**Live: not yet.** Today the page checks these answers in the visitor's own browser and **nothing is sent to Rabaed and nothing is stored**. The work that connects it is planned and is not done. It is listed here in full so that the policy the lawyer writes now is still correct on the day it is switched on; if the policy is written to cover only what is live today, it will have to be reopened then.

| Field name | What the visitor is asked for | Must they answer? | What will be stored |
| --- | --- | --- | --- |
| `firstName` | Their first name | Yes | As typed |
| `lastName` | Their family name | Yes | As typed |
| `countryCode` | Their country's dialling code | No | One of ten fixed values |
| `phone` | Their mobile number | Yes | As typed |
| `email` | Their email address | Yes | As typed |
| `company` | The name of their company | No | As typed |

### What is stored with every submission, besides the answers

The same few things are recorded with each one, whichever form it came from:

- **Which form it came from**, and **the date and time** it arrived.
- **The applicant's name, email and phone** a second time, in columns of their own, so that the team can search its list of submissions by them.
- **What became of each of the two emails** described in section 6 — sent, not sent, or failed.
- **A one-time reference** the form generates for the submission, so that a double click or a retry on a dropped connection does not create a second copy of the same request.
- **A one-way fingerprint of the sender's internet address.** The address itself is *not* stored. What is stored is a scrambled value computed from it, which cannot be turned back into an address; it exists only so the site can tell that five requests came from the same place within an hour and refuse a sixth. This is the site's protection against automated abuse, along with a hidden field that a person never sees and only an automated script would fill in. A submission refused for either reason is not stored at all.

## 4. Uploaded documents, and the private `documents` store

This is the part of the site that most needs describing in the policy.

**What is taken.** Four file fields across two forms: `ibanCertificate`, `commercialRegistration` and `taxRegistrationCertificate` on the Referral Program signup, and `commercialRegistration` on the Partnership application. Each may be a PDF, a PNG or a JPG image, of at most 10 MB. The site checks what a file actually contains, not just what it is named, and refuses anything else.

**Where they go.** Into a private storage area named `documents`, held by Supabase (section 8), separate from the site's public images. It has **no public address**: there is no link, guessable or otherwise, that hands a document to a member of the public. This was a deliberate architectural decision, recorded as ADR-0004, and it is verified by an automated test that tries to fetch an uploaded document without authorisation and requires the attempt to fail.

**Who can open one.** Only a signed-in member of the Rabaed team, from the submission's record in the admin. Opening it produces a fresh link that stops working after **10 minutes**, so a link that is copied, forwarded or left in an email is of no use to anyone. Beyond the team, the people holding the Supabase account credentials — the founders — can reach the store directly, as the owners of the account.

**Where they are never sent.** The alert email to the team (section 6) *names* the documents that came with a submission but never attaches them. A document therefore never travels through email, and never leaves the private store except as a 10-minute link opened by a signed-in editor.

**Deletion.** Deleting a submission in the admin deletes its uploaded documents from the store at the same time, deliberately: someone who asks for their details to be removed means the certificates too.

## 5. Where everything is kept, who can reach it, and for how long

| What | Where it is kept | Who can reach it | How long it is kept |
| --- | --- | --- | --- |
| Form submissions and their answers | A Supabase Postgres database | Any signed-in Rabaed editor; plus whoever holds the database credentials (the founders) | **Kept until someone deletes it by hand. There is no automatic deletion today** — a decision is needed (section 11) |
| Uploaded documents (section 4) | The private `documents` store at Supabase | Any signed-in Rabaed editor, through a 10-minute link; plus whoever holds the storage credentials | As above, and deleted together with their submission |
| Editor accounts (the team's own logins) | The same Supabase database | Any signed-in editor can see, invite and remove editors — there is one level of access, not several (ADR-0007) | Until the account is removed. The number of accounts is the control: access is given only to people who edit the site |
| Alert and confirmation emails | The company's Microsoft 365 mailbox, and the recipient's own inbox | Whoever has access to that mailbox | Whatever the Microsoft 365 mailbox is set to keep — **to be confirmed by the founders** (section 11) |
| Ordinary server records of requests to the site | Vercel, the hosting company | The Vercel team account | Vercel's own retention — **to be confirmed** (section 11) |
| Visitor analytics | Not installed yet — section 7 | — | — |
| Images and text the team publishes | The site's public image store and the same database | Public, by design — it is the website | Until the team changes it |

**One category in that last row deserves a line in the policy.** Published case studies name a real client and can carry a quotation attributed to a named person in a stated role. Those are published deliberately and, by the team's own rule, only with the client's agreement — but they are personal data about someone who is not the visitor, and a reader may ask about them.

**Access is drawn along one line only: signed in, or not.** Every editor can reach everything the CMS holds, submissions and uploaded documents included. Accounts are invitation-only — nobody can sign themselves up — and sessions last a working day.

## 6. Email: what the site sends, and through what

The site sends email through **the company's existing Microsoft 365 no-reply mailbox**, over an encrypted connection. No third-party email service is involved, and the mailbox's password is held only in the hosting configuration, never in the code.

Exactly two messages may go out, both triggered by a form submission and neither of them marketing:

1. **An alert to the Rabaed team**, at an address the team sets per form. It repeats every answer under the same wording the visitor saw, names any documents that came with it (never attaching them), gives the time in Riyadh, and links to the record in the admin. A reply to it goes to the applicant.
2. **A confirmation to the person who filled the form in**, in Arabic, telling them their request arrived and what happens next. Nothing else is ever sent to them; there is no list to unsubscribe from.

**Two conditions the policy should be written against.** While a form has no alert address set, it sends *nothing at all* — neither the alert nor the applicant's confirmation — and the submission is still stored. At the time of writing, no alert address has been supplied, so today the site stores submissions and sends no email whatsoever. Whatever happened to each message is recorded on the submission, so a failure is visible to the team rather than silent.

## 7. Analytics, cookies, and what the visitor's browser keeps

**The site sets no cookie on a visitor's browser, and no cookie banner is needed.** There is one cookie in the whole system and it is not a visitor's: the login session of a Rabaed editor signed in to the admin at `/maktab`. The site stores nothing in the browser's own storage either, and loads no script from any other company — no advertising pixel, no social media embed, no third-party fonts; the fonts are served from the site itself.

**Analytics is decided but not yet installed.** The build has not switched it on; when it does, it will be **cookie-free by requirement**, which is why no consent banner is planned. What it is intended to collect:

- How many people visit, which pages they read, and which site or search engine sent them — specifically including when an AI assistant such as ChatGPT, Perplexity or Claude did.
- How fast pages actually load for real visitors.
- Counts of events: how many form submissions were sent, how many tool downloads.

All of that is counted in aggregate. No profile of an individual is built, nothing is used for advertising, and nothing follows a visitor to another website.

> **One line of this section will need confirming once the tool is chosen.** Cookie-free analytics products differ in whether they handle a visitor's internet address at all, even briefly and without keeping it, and in which country their servers are. The lawyer should be given that answer before the policy is finalised; this document will be updated at that point.

## 8. The outside companies involved, and where the data sits

Three service providers hold Rabaed's data on Rabaed's behalf. None of them is paid to do anything else with it, and none is an advertising or data company.

| Company | What it holds | Where |
| --- | --- | --- |
| **Vercel** | Runs the website itself, and keeps ordinary technical records of requests to it | Region **to be confirmed** — by default an account is served from the United States unless it has been set otherwise |
| **Supabase** | The database (all form submissions) and the private document store | Region **to be confirmed** — the setup instructions call for the region nearest Saudi Arabia, and the founders should confirm which was chosen |
| **Microsoft 365** | The mailbox that sends the two emails, and the copies in it | The company's existing Microsoft 365 tenancy — region **to be confirmed** |

**These three answers matter more than their length suggests.** If personal data of people in Saudi Arabia is held outside the Kingdom, the Personal Data Protection Law treats that as a transfer abroad with its own conditions, and the policy has to say so. The technical answer to each is a single setting; nobody has yet written down what each is set to. See section 11.

## 9. What the site does not collect

Stated plainly, because the current policy implies otherwise and because a reader will want to know:

- **No payment details of any kind.** No card, no account number typed in, no payment is ever taken on the site.
- **No national ID, Iqama or passport number is ever asked for** — with the caveat in section 3 that an uploaded certificate may itself carry one.
- **No account for visitors.** There is nothing to sign up for; the only logins are the team's own.
- **No location, no device fingerprinting, no advertising identifier, no cross-site tracking.**
- **Nothing is sold, rented or traded**, and nothing goes to an advertiser.
- **The site is not aimed at children** and asks nothing that identifies a person's age.

## 10. If someone asks to see, correct or delete their data

How it works today, so the policy describes something the team can actually do:

- The team finds a person's submissions in the admin by searching their name, email address or phone number.
- Deleting a submission removes it and its uploaded documents together.
- There is no self-service: a person cannot log in to see or delete anything themselves, because there are no visitor accounts.
- The contact point published on the site today is **ahmed.s@rabaedapp.com** and **+966 57 676 7900**. Whether the policy should name a specific person as responsible for personal data is a question for the lawyer.

## 11. What the founders still need to decide or confirm

None of these is a technical obstacle; each is an answer the policy needs.

1. **How long each category is kept.** Nothing is deleted automatically today. A period is needed for form submissions, and one for uploaded documents — which may reasonably be shorter, since a certificate is needed to enrol and pay a referrer, not to keep indefinitely.
2. **The three regions** in section 8: where Vercel runs the site, where the Supabase database and document store are, and where the Microsoft 365 mailbox is.
3. **How long the Microsoft 365 mailbox keeps the alert and confirmation emails**, which are a second copy of every submission.
4. **Who is named as the contact** for a privacy question or a deletion request.
5. **The analytics tool**, once chosen, and whether it touches a visitor's internet address at all (section 7).
6. **What happens off the site with a referrer's bank details** once a payment is made: the site holds the certificate, but the payment runs through whatever the finance process is, and the policy covers the company, not only the website.
7. **A decision the build is waiting on:** whether an applicant's confirmation email should go out even before an alert address is set. Today neither is sent until one is.

## 12. Keeping this document true

Which fields each form has is fixed in the site's code, not editable by the team, precisely because every field reaches storage, spam protection and this document. The team can reword a question; only a developer can add one.

A test in the site's own test suite compares this document against the forms as they are built and fails if a field is added, removed or renamed without this document being updated in both languages. It is the mechanism that stops the policy quietly going out of date — but it can only check that a field is *listed*. Whether the policy the lawyer writes still fits is a human judgement, and a new field is the moment to ask for it.
