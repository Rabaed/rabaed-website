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
   `S3_SECRET_ACCESS_KEY`.
4. **Document storage.** **Storage → New bucket** again, named `documents`, and
   **not** public: it holds applicants' IBAN certificates and commercial
   registrations, which nobody may reach by address (ADR-0004). It uses the
   same S3 connection and key as `media`. Its name is `S3_DOCUMENTS_BUCKET`
   (`documents`). Without it, the site still builds, but a form that carries
   documents cannot be sent, and says so.
5. **Vercel.** In the project's **Settings → Environment Variables**, add the
   seven values above plus `PAYLOAD_SECRET`, a long random value (for example the
   output of `openssl rand -hex 32`). Recommended: a **second** Supabase project
   for the Preview environment, so that trying out a pull request can never
   change what is on the live site. If there is only one, previews and
   production share the same content.
6. **Create the database tables and the first account**, from a computer with
   the repository. These two commands need `DATABASE_URL` and `PAYLOAD_SECRET`
   set to production's values — and neither value should ever be typed into a
   terminal, pasted into a chat window or written into `.env.local`, which
   `npm run dev` also reads and would then point at the live content.

   Keep them in a file **outside the repository**, one `NAME=value` per line,
   and pass them from there for the command only:

   ```bash
   env $(grep -v '^#' ~/rabaed-production.env | xargs) npm run cms:migrate
   ```

   ```powershell
   Get-Content ~abaed-production.env | ForEach-Object { $n, $v = $_ -split '=', 2; Set-Item "env:$n" $v }; npm run cms:migrate
   ```

   A value typed on a command line is kept in the shell's history, where it
   outlives the task by months. One pasted into a chat window is worse: it is
   somewhere neither of you controls. If either happens, rotate both — the
   steps are in ticket 39a part 3.

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

### FAQs

The questions on the home, start, tool, referral and partnership pages are
edited under **FAQs** (ticket 22). The migrations import the 31 questions the
site launched with, word for word.

- Each question belongs to one page, chosen under **Page**. Drag questions up
  and down the list to order them; each page shows its own in that order. A
  question with an unpublished draft keeps its old place on the site until
  that draft is published.
- Untick **Shows on the page** to hide a question without losing its words or
  its place. Delete it to remove it for good.
- Like an article, a question is saved as a draft, previewed on its page, and
  reaches visitors only when published.
- In an answer, put a file name or other English text between backticks —
  `` `concrete_db.json` `` — to set it left to right. Write `{payout}` and
  `{clientDiscount}` for the Referral Program values: the site inserts the
  current amount, so no answer quotes an old one.

### Page text

Page words are edited under **Pages**: **Start page** (ticket 53), **Tool page**
(ticket 54), **Product page** (ticket 57), **Partnership page** (ticket 55),
**Referral Program page** (ticket 56) and **Home page** (ticket 58), and two
entries pages share — **Closing section** («كيف نبدأ معك», which the home and
product pages both end on, changed once for both) and **Screen mocks**. The
header, footer and index pages follow in ticket 59, and until then their words
are still in code. The migrations import each entry's words once, as they were.

- Each tab is one section of the page, in the page's order. Sections cannot be
  moved, added or removed.
- A section with **Shows on the page** can be hidden, keeping its words. A
  section that links on the site land on has no such switch, and always shows.
- Every word has an **Arabic** and an **English** field. The Arabic is always
  needed to publish. The English is needed only once **English** is added under
  **Published in**; until then the page is in Arabic alone, and nothing is ever
  filled in from the other language. Once English is listed, every change is
  published only with its English — a new step included — so write the
  English, or take English off the list for the time being.
- A list — steps, panels, cards, lines — can be added to, taken from and
  reordered by dragging, within the number the design holds. Steps, units and
  numbered cards are numbered by their order. A list the design is built around
  an exact count — the drawing of the tool in the tool page's hero, the product
  page's three parties, the home page's four hero statuses, four steps in each
  Record trail and four before-and-after steps — offers no **Add** and
  publishes only with that count.
- In the tool page's privacy points, put a Latin file name between backticks —
  `` `concrete_db.json` `` — to set it left to right, as in the questions. File
  names, pour references and the drawing's figures are one field for both
  languages, in Latin letters and figures only.
- In the partnership page's figures, write numerals as 0–9 — «3 أنماط» — and
  the page sets them in the figures' typeface.
- On the referral page, never type the payout or the discount: write
  `{payout}` and `{clientDiscount}`, as in the questions, and the page inserts
  the **Referral Program values**. A name in braces the site does not hold is
  refused.
- In the home page's before-and-after, put what is set in bold between
  asterisks — `*اسحب المقبض*`, as in WhatsApp — and start a new line where the
  card breaks its line.
- A before-and-after figure on the home page stays off the live site until its
  **Where the figure comes from** is filled in; visitors never see that field.
  A commitment, such as «أقل من يوم», always shows.
- The home page's hero drawings — the three buildings and the travelling
  document — can each be replaced by a picture of the same shape, or larger in
  the same proportions, on a transparent background. Remove it to bring the
  drawing back.
- The calculator's word after a number follows Arabic's counting: one word
  after 1, one after 2, one from 3 to 10, and one from 11 on («1 يوم»،
  «2 يومان»، «3 أيام»، «11 يوماً»).
- **Screen mocks** holds each screen's picture and what it shows in words: read
  out by screen readers and written under the picture, wherever a page shows
  it. With no picture chosen, the page shows the image exported from the
  studio. A replacement must be 1440×900, or larger in the same proportions
  (2880×1800 is sharpest); describe the new picture when replacing one, and
  remove it to bring the exported image back. Which screen a panel or a party
  shows is chosen on the page; what a mock depicts is a developer's to change,
  through the studio and `npm run mocks:export`.
- On a window just tall enough for the product page's units to travel
  sideways, a panel is only as tall as the window, so its title, line and text
  hold only what fits there.
- Every field holds only as many characters as its place in the design
  carries; the admin says so when a text is too long.
- Like an article, a change is saved as a draft, previewed on the page, and
  reaches visitors only when published. Where a button leads stays in code: an
  Editor changes what it says, not where it goes.

### Referral Program values

The payout for each project and the referred client's discount are set once,
under **Referral Program values** (ticket 56): a whole number of riyals, and a
whole percentage. Once published, every mention on the site follows — the
referral page, its search title, and every FAQ answer that names `{payout}` or
`{clientDiscount}`. Like a page, a change is saved as a draft and previewed on
the referral page first.

The Referral Terms state the same amounts in their own words, and changing a
value never rewrites them (ADR-0008). While the published Referral Terms do not
state the published values, a warning shows on the dashboard, on the values and
on the Referral Terms. It stops nothing from being published; it goes once a
version of the Referral Terms that states both values is published. The terms
are read for the figures — «2,500» or «٢٬٥٠٠», and «15%» — so an amount written
out only in words is not recognised, and any «15%» in the terms counts as the
discount, even one about something else.

### AI crawlers

Under **AI crawlers** there is one checkbox: whether the crawlers that collect
pages to *train* AI models — `GPTBot`, `ClaudeBot`, `CCBot`,
`Meta-ExternalAgent` — may read the site. It is ticked, and ticking or
unticking it and saving is the whole act: no draft, no publish. `robots.txt`
follows within moments.

The trade-off, in short. Training crawlers decide whether a model knows about
Rabaed *from the inside* in a year or two — answering from memory, with no
citation, no link and no visit. Refusing them keeps the writing from being
copied into models, and costs nothing today.

What the checkbox does **not** touch, and no setting can, is the other kind:
the crawlers that fetch a page at the moment somebody asks a question and name
the source in the answer — `OAI-SearchBot`, `Claude-SearchBot`,
`PerplexityBot`, `Googlebot` and the rest. Those are what decide whether Rabaed
is quoted *now*, and `robots.txt` allows them all, always.

`Google-Extended` and `Applebot-Extended` are not in the file on purpose: they
opt out of training alone and change nothing about appearing in Google's AI
Overviews. And `Googlebot` is never refused — refusing it hides the whole site
from Google, AI answers included.

Beside `robots.txt` the site serves **`llms.txt`**, a short summary of what
Rabaed is and a list of its pages for an AI assistant to read instead of
crawling. Nobody maintains it: it is written from the pages' own search
descriptions and from every article, case study and legal document published in
the CMS, and rebuilds whenever any of those is published.

### When a change adds to the CMS

A change that adds a field or a content type carries a **migration** in
`src/migrations/`: the instructions that bring the database's tables up to
date. **Production applies them itself**: its build runs the migrations before
building the pages (`scripts/migrate-production.mjs`). **Preview builds never
do**, so that trying out a pull request cannot change the tables the live site
reads. With a separate preview database, run `npm run cms:migrate` against it,
the same way as step 6 — from a file, not from the command line — when a pull
request that adds a migration needs a preview.

**A migration regenerated after a merge takes a new name** (see the parallel
sessions note below), so a preview database that was migrated before the
rebase has the old one and needs migrating again.

**Until that is done, the pull request's Vercel check goes red, and the red is
expected.** The build fails on the first page that reads a table the preview
database has not got yet — `column … does not exist`, or `relation … does not
exist`. It does not mean the change is broken: the same commit builds on
production, which migrates first. Migrate the preview database and redeploy
that deployment from Vercel, and the check goes green without a new commit.
Adding a table early is safe even where previews and production share one
database, because nothing reads it until the code that uses it is merged.

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

**Documents.** The Referral Program signup takes an IBAN certificate and, if
the referrer has them, a commercial registration and a tax registration
certificate: each a PDF or an image of at most 10 MB. They are checked by what
is in them, not only by their names, and kept in the private `documents`
bucket.

- A submission's **Documents** list each one, with an **Open document** link.
  The link works for 10 minutes and only for a signed-in editor; open the
  record again for a fresh one. A link copied into an email is no use to the
  person it is sent to.
- Deleting a submission deletes its documents from the bucket too.
- The alert email names the documents but never attaches them.

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
