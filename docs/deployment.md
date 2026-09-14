# Deployment

The site is a Next.js application hosted on Vercel, deployed from the GitHub
repository (ADR-0004). Nothing is deployed by hand: pushing to a branch and
opening a pull request is the whole process.

## How a change reaches the internet

1. Work happens on a branch and arrives as a pull request.
2. GitHub Actions builds the site and runs the end-to-end tests
   (`.github/workflows/ci.yml`), split across four machines at once so the
   result comes back in minutes. The pull request shows the outcome as one
   check, `test`; a red cross means the change is broken.
3. Vercel builds the same commit and comments on the pull request with a
   **preview link** — a real, working copy of the site at that change, on its
   own web address. This is what you look at to approve the work.
4. Merging into `main` deploys to production.

Every environment except production tells search engines and AI assistants to
ignore it, so preview links can be shared freely without the unfinished site
turning up in Google.

## One-time setup

Two steps only a person with the accounts can do. Neither blocks development —
the site builds and tests locally without them.

### 1. Connect Vercel to GitHub

1. Sign in at [vercel.com](https://vercel.com) with the company GitHub account.
2. **Add New… → Project**, and install the Vercel GitHub app for the `Rabaed`
   organisation when it asks, granting it access to `rabaed-website`.
3. Import `rabaed-website`. Leave every build setting on its default — Vercel
   detects Next.js on its own, and the repository carries no override.
4. Deploy.

From then on Vercel builds every push automatically and adds the preview link
to each pull request.

Nothing needs to be configured for the pre-launch indexing block: it is on by
default in every environment, including production.

### 2. Make a failing test block a merge

GitHub can refuse to merge a pull request whose tests failed. That setting —
branch protection — is **not available on the Free organisation plan for a
private repository**; GitHub returns:

> Upgrade to GitHub Pro or make this repository public to enable this feature.

Until the `Rabaed` organisation is on the Team plan, CI still runs on every
pull request and still shows a red cross when it fails, but GitHub will let
someone merge anyway. Making the repository public is not an option, so the
choice is the Team plan or the convention of not merging a red pull request.

Once the organisation is upgraded, this makes the check mandatory:

```bash
gh api -X POST repos/Rabaed/rabaed-website/rulesets --input docs/github-ruleset.json
```

## Node version

CI pins the exact version in `.nvmrc`. `package.json` states a floor
(`engines.node`) rather than the same pin, so Vercel is free to use whichever
current Node it defaults to — pinning a version Vercel later retires would
break deploys for no benefit.

## Environment variables

`.env.example` lists them, with what each is for. They are set in Vercel's
project settings, per environment, and never committed.

Locally none has to be set. On Vercel, the CMS variables below are required in
every environment — a deployment without them fails to build, and says which
one is missing.

## The CMS

Ahmed edits the site at **`/maktab`** on the site's own address
(`rabaedapp.com/maktab` once launched). It is Payload CMS, running inside the
same application as the site; its content is stored in a Supabase Postgres
database and uploaded images in Supabase Storage (ADR-0004).

Nobody can create an account from the sign-in page. The first account is made
from the command line (step 5 below); after that, an editor invites others from
inside the admin under **Editors**.

### One-time setup

This needs somebody with the company accounts. Until it is done, Vercel cannot
build the site — so it has to happen **before the CMS pull request is merged**,
or production deployments stop.

1. **Create a Supabase project** at [supabase.com](https://supabase.com), in
   the region nearest Saudi Arabia, with a strong database password kept in the
   company password manager.
2. **Database address.** In the project, **Connect → Transaction pooler**, copy
   the connection string and put the database password into it. This is
   `DATABASE_URL`.
3. **Image storage.** **Storage → New bucket**, named `media`, set to public:
   the images on the site are public anyway. Then **Storage → Settings → S3
   connection**: note the endpoint and region, and create an access key. These
   are `S3_BUCKET` (`media`), `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID` and
   `S3_SECRET_ACCESS_KEY`. Applicant documents do **not** go in this bucket;
   they get a private one of their own in ticket 28.
4. **Vercel.** In the project's **Settings → Environment Variables**, add the
   six values above plus `PAYLOAD_SECRET`, a long random value (for example the
   output of `openssl rand -hex 32`). Recommended: a **second** Supabase project
   for the Preview environment, so that trying out a pull request can never
   change what is on the live site. If there is only one, previews and
   production share the same content.
5. **Create the database tables and the first account**, from a computer with
   the repository. Set `DATABASE_URL` and `PAYLOAD_SECRET` to production's
   values **in the terminal, for these commands only** — never in `.env.local`,
   which `npm run dev` also reads and would then point at the live content.

   ```bash
   npm run cms:migrate
   ```

   ```bash
   npm run cms:create-editor -- ahmed@rabaedapp.com
   ```

   The second command prints a temporary password once. Hand it over privately;
   Ahmed changes it after signing in. Close the terminal afterwards.

### Legal documents

The Terms, the Privacy Policy and the Referral Program Terms are edited under
**Legal documents** (ADR-0003). The migrations import them once, word for
word, as each document's first version, dated 1 September 2026 like the
approved documents. From then on the CMS is the only place they change; the
Word files in `reference/legal-source/` stay as the pre-launch archive.

- **Save Draft** keeps an edit without publishing it; **Preview** shows it on
  the real page. Only **Publish changes** reaches visitors. Nothing saves by
  itself.
- Every save is kept under **Versions**, with its date and the Editor who made
  it, and none is ever deleted. Any version can be opened and restored; a
  restore is itself a new version. Restoring a draft gives a draft, which
  visitors see only once it is published. Restoring a published version
  straight away, rather than as a draft, publishes it again.
- Visitors always see the newest published version, and the page's
  «آخر تحديث» is the day it was published.
- A legal document cannot be unpublished, added or deleted: each is a page of
  the site. To change one back, restore an earlier version and publish it.

### When a change adds to the CMS

A change that adds a field or a content type carries a **migration** in
`src/migrations/`: the instructions that bring the database's tables up to
date. **Production applies them itself**: its build runs the migrations before
building the pages (`scripts/migrate-production.mjs`). **Preview builds never
do**, so that trying out a pull request cannot change the tables the live site
reads. With a separate preview database, run `npm run cms:migrate` against it,
the same way as step 5, when a pull request that adds a migration needs a
preview.

For developers: after changing the CMS configuration, `npm run cms:migration --
<name>` writes the migration, and `npm run cms:generate` refreshes the admin's
import map and `src/payload-types.ts`. Payload writes the migration's type
imports as value imports, which this project's compiler settings refuse; mark
them `type` by hand.

### Forms

Every request sent from a form on the site is kept under **Forms → Form
submissions**, newest first, whether or not any email went out about it. Each
record shows what became of its two emails: the alert to the team and the
confirmation to the applicant.

Each form that sends has its own settings under **Forms**: its heading, button
and small print, every field's label, placeholder and error message, what the
visitor is told after sending, the confirmation email, and the **alert
address**. They follow the same Save Draft, Preview and Publish as the site
settings. Which fields a form has is fixed: each field is stored and covered by
the Privacy Policy, so adding one is a developer's change.

- **While a form's alert address is empty, it sends no email at all** — no
  alert, and no confirmation to the applicant. Requests are still stored. Set
  the address once the team is ready to answer them.
- A request with the hidden trap field filled in, or a sixth request from the
  same network address within an hour, is turned away and not stored.

### Email

The forms send from the company's Microsoft 365 no-reply mailbox, over SMTP
(`smtp.office365.com`, port 587, TLS).

1. In the Microsoft 365 admin centre, open the no-reply mailbox's account →
   **Mail → Manage email apps**, and tick **Authenticated SMTP**.
2. In Vercel, add `MAIL_USER` (the mailbox's address) and `MAIL_PASSWORD` for
   each environment that should send email. Leave them out of Preview if trying
   out a pull request should never email anyone.
3. Set each form's alert address in the admin.

Without the two variables the site works the same and sends no email; each
submission records its emails as not sent.

> Microsoft has been retiring password sign-in ("basic authentication") for
> SMTP in Microsoft 365. If the tenant refuses it, the mailbox's emails will
> show as failed on every submission; the mail adapter (`src/forms/mail.ts`)
> is the one place to change to a sign-in Microsoft accepts.

### Not there yet

- **Admin password reset.** The admin's "forgot password" does not use the
  forms' mailbox, so it sends nothing, and the reset cannot be finished another
  way. Until then an editor who forgets their password is given a new one by
  another editor, under **Editors**.
