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
4. **If the change could reach the CMS** — anything under `src/cms/`, the
   Payload config, the form routes, or a dependency they load — open
   `/maktab` on that preview link before you merge, and check it shows the
   sign-in page rather than an error. The marketing pages are no guide here:
   they are built once and served from cache, so they go on answering
   normally for hours after the live half of the site has stopped. The CMS
   was down for a day that way in September 2026, with every public page
   still answering `200` (ticket 65). Nothing else catches it — the tests
   run where the fault does not appear, and a preview link opens only for
   you.
5. Merging into `main` deploys to production.

Every environment except production tells search engines and AI assistants to
ignore it, so preview links can be shared freely without the unfinished site
turning up in Google.

## Caching

Pages are built ahead of time and kept, so a visitor gets one instantly rather
than waiting for it to be assembled. That means a page has to be rebuilt before
a change shows on it, and two separate things cause that:

- **Publishing in the CMS.** Publishing marks every page — and `sitemap.xml`,
  `llms.txt` and `robots.txt` with them — as out of date, and each is rebuilt
  the next time somebody asks for it. This is how a change normally travels,
  and it arrives in under a second. **Ten seconds later it marks them all
  again**, for the reason below. Saving, replacing or deleting an image does
  the same, though an image is never published: whatever page shows it
  changes with it (ticket 84).
- **The maximum age: ten minutes.** Whatever becomes of those marks, no page is
  older than ten minutes before it is rebuilt anyway.

The second mark is there for one failure the first cannot see. A rebuild that
was already running when you published can finish afterwards and put the old
words back, and Next has no way to tell they are old: it goes by when a page
was written, not by what is in it (ticket 64). Left alone, that page stays
wrong **until somebody publishes again**. Ten seconds is longer than any
rebuild took under the heaviest load the tests put on the site, so by the
second mark such a rebuild has finished, and its page is marked in turn. You
see no difference when you publish — the second mark happens after the CMS
has answered you — and it costs each page one extra rebuild per publish, and
the server a few seconds awake. ADR-0017 records the decision and the
measurements behind the number.

The ten-minute age is the floor under anything else that loses a mark — a
failure we have not met yet. It does not stop one happening; it stops it
lasting.

Two things are worth knowing about the ten minutes:

- It is **not** how long publishing takes. Publishing is unaffected. The age
  only matters when something has already gone wrong.
- The real bound is ten minutes plus one rebuild. The visitor who arrives first
  after the age runs out is still served the old page while the rebuild happens
  behind them; the next one gets the new page.

If a published change has not shown up after about ten minutes, that is not the
cache — something else is wrong, and it is worth saying so rather than
publishing again.

The number lives in `src/lib/cache-age.ts` with the reasoning behind it, and
ADR-0016 records the decision. The Screen mock studio and the CMS admin have no
age: nothing a publish does can make either stale.

## One-time setup

Three steps only a person with the accounts can do. None blocks development —
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

### 3. Switch on the visitor counting and the speed measurement

Two toggles in the Vercel dashboard, on the `rabaed-website` project:

1. **Analytics → Web Analytics → Enable.** This is what counts visits, pages
   and where visitors came from.
2. **Speed Insights → Enable.** This is what measures how fast the site
   actually was for real visitors.

The site already carries both, so nothing has to be deployed afterwards: the
next production deployment starts reporting, and figures appear within a few
minutes of the first visit. Preview deployments deliberately report nothing, so
looking at a pull request never shows up as a visit.

Custom events — the ones that count form submissions and visits an AI
assistant sent — need the paid Vercel team that ticket 39a part 1 records
this project as needing.

To check it worked: open the production site, then the project's **Analytics**
tab, and look for the visit. Until one shows up there, nothing proves the two
scripts reach anyone: the suite can only hold the site to loading neither of
them anywhere else. `docs/analytics.md` says what is collected, in the words
the Privacy Policy uses.

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
   `DATABASE_URL`. It must be the transaction pooler, not the direct
   connection: "Database connections" below says why.
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
   Get-Content ~/rabaed-production.env | ForEach-Object { $n, $v = $_ -split '=', 2; Set-Item "env:$n" $v }; npm run cms:migrate
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

### Database connections

Vercel runs the site on as many servers as its traffic needs, starting more
during a spike, and each one opens its own connections to the database. Two
things keep that from running out on a busy day:

- **The address is Supabase's transaction pooler** (step 2 above). The pooler
  stands between the servers and the database and shares a few real database
  connections among many servers. Supabase's smaller plans take 200 servers'
  connections through it, against 60 connected to the database directly, and
  Supabase recommends it for exactly this kind of hosting.
- **Each server holds at most five connections**, and a request waits at most
  ten seconds for one before it gives up (ticket 83). Without the limit each
  server would hold ten, so the pooler's 200 would be used up by twenty
  servers instead of forty. Without the ten seconds, a request that found its
  server's connections all busy would wait for minutes. Past the ten seconds
  it fails, and a page that was already built goes on showing its last copy.
  That is the trade: one server handles many visitors at once, so on a very
  busy server a form or an editor's save can now fail after ten seconds, where
  before it would have waited, perhaps for minutes, perhaps for good. A form
  that fails tells the visitor to try again. A connection nobody has used
  for ten seconds is closed, so a server that has gone quiet gives its share
  back.
  The numbers live in `databasePool` in `src/cms/environment.ts`. Local
  servers and the tests keep `pg`'s own ten, with no wait limit.

**To check the address**, in Vercel open **Settings → Environment Variables**,
reveal `DATABASE_URL` for **Production**, and read only the part after the
`@`. It should end in `pooler.supabase.com:6543/postgres`. Then do the same for
**Preview**, which is a separate Supabase project. If either shows
`supabase.co:5432` (a direct connection) or `pooler.supabase.com:5432` (the
pooler's other mode, which holds a real connection per server), replace the
whole value with the one under **Connect → Transaction pooler** in that
Supabase project. Then redeploy. As in step 6, the value never goes into a
chat window or a terminal.

Both were checked on 24 September 2026, and the site now checks it for
itself: a deployment whose address is a direct connection or the pooler's
other mode fails to build, with a message saying which it found and what to
put there instead. The live site goes on running its previous version until
the address is fixed and the deployment is redeployed.

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

### The blog, and the six articles waiting in it

Articles are written under **Blog**. **Six Arabic drafts are already there**,
imported with the site (ticket 38) so that the blog is not empty on the day it
launches. Each answers one kind of question a buyer actually asks:

| Article | The question it answers |
| --- | --- |
| ما هي منصة ربائد؟ | what Rabaed is |
| ربائد مقابل واتساب والبريد الإلكتروني والإكسل | Rabaed against the tools a project uses today |
| كيف تمر المعاملة من الطلب إلى الاعتماد؟ | how a transaction actually works |
| مكتب هندسي يشرف على خمسة مشاريع… | what it looks like for one kind of customer |
| ماذا لو رفض المقاول استخدام المنصة؟ وماذا عن بياناتنا؟ | the objections that come up before signing |
| من يقف خلف ربائد؟ ومن أين تعمل؟ | who the company is |

**They are drafts, so nobody can read them yet** — not a visitor, not Google,
not an AI assistant. Every word in them is already somewhere on the site: they
were written from the pages, the FAQ answers and the company's own details, and
they state no figure or percentage that nobody can source. Nothing was invented.

Each one also **arrives with a cover picture**: the Screen mock of the screen
that article is about — the stamped approval sheet on «ما هي منصة ربائد؟», the
correspondence screen on the comparison, and so on. Change any of them for
another image if you would rather; they are there so that no article is waiting
on a picture.

**To publish one:**

1. Open it under **Blog** and read it through. Change anything you disagree
   with — the words are yours, and the point of them arriving as drafts is that
   you correct them first.
2. Fill in **الكاتب** with the name of the person who wrote it. A real person,
   not «ربائد» and not the company: an article a reader can attribute to
   somebody is worth more than one signed by a logo. The CMS refuses the
   company's name here.
3. Set **تاريخ النشر** to the day you are publishing. Each draft arrives dated
   21 September 2026, the day it was written.
4. **Preview** it, then **Publish changes**.

Step 2 is not optional: the CMS refuses to publish an article with no author,
which is what keeps any of this from reaching a visitor before you have seen it.

Once published, an article appears on `/blog`, at its own address, in
`sitemap.xml` and in `llms.txt`, and describes itself to search engines and AI
assistants as an article by its named author. Unpublishing it takes it out of
all of them again.

You do not have to publish all six, or any of them. Publish the ones you stand
behind, leave the rest as drafts, and delete any you do not want. Nothing on the
site depends on a particular article existing.

**Each of the six is also waiting in English** (ticket 43): a draft at the same
address, under `/en/blog/`, translated from the Arabic, with the English Screen
mock of the same screen as its cover. In the **Blog** list the **Translation**
column shows which articles have their English and whether it is published.
Publishing one is the same four steps — the author's name, today's date,
Preview, Publish changes — and the English article's links lead to the English
pages, except the Terms, which stay in Arabic. **If you correct an Arabic
article, correct its English too**: the column says an English one exists, not
that the two still say the same thing.

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
- Each page's last tab, **الظهور في البحث والمشاركة**, is how the page appears
  in a search result and when its link is shared: its title, the line under
  it — which is also what `/llms.txt` quotes — and, if you want one, a
  sharing image of its own (1200×630, PNG). It is published with the rest of
  the page, in the page's languages (ticket 91).
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
  studio — the Arabic screens on Arabic pages, the English ones on English
  pages. A replacement is chosen for each language separately, because a
  screen's words are in its picture: **Replacement picture, Arabic pages** and
  **Replacement picture, English pages**. It must be 1440×900, or larger in the
  same proportions (2880×1800 is sharpest); describe the new picture when
  replacing one, and remove it to bring the exported image back. Which screen a
  panel or a party shows is chosen on the page; what a mock depicts is a
  developer's to change, through the studio and `npm run mocks:export`.
- On a window just tall enough for the product page's units to travel
  sideways, a panel is only as tall as the window, so its title, line and text
  hold only what fits there.
- Every field holds only as many characters as its place in the design
  carries; the admin says so when a text is too long.
- Like an article, a change is saved as a draft, previewed on the page, and
  reaches visitors only when published. Where a button leads stays in code: an
  Editor changes what it says, not where it goes.

### The answer-first copy pass, waiting for a decision

**A rewrite of the site's opening paragraphs and all 31 answers is sitting in
the CMS as drafts, and nobody can read a word of it** (ticket 35). Every page
still says exactly what it says today, and goes on saying it until you publish
each piece yourself.

**Why.** An AI assistant quotes a paragraph, not a page. A paragraph it can
lift has to make sense on its own — and several of ours do not. «ليست ميزة
تُفعَّل» says nothing without the heading above it; «لا.» and «نعم.» say nothing
without the question. The handoff asks for this and says whose the words are:
«راجعه مع أحمد، النصّ نصّه».

**What is waiting, and where:**

| Where | What it is |
| --- | --- |
| **Pages → Home page**, under **الوحدات** and **السجل الموثّق** | An opening paragraph for each. The units had none at all. |
| **Pages → Product page**, under **لكل طرف** and **داخل كل جهة** | The same two. The parties had none at all. |
| **FAQs** — all 31 | Each answer rewritten to name its own subject, so it can be quoted without its question. Nothing is longer than it needs to be. |
| **FAQs** — five new questions, in draft | Rabaed against WhatsApp, the email and the spreadsheet — the one question buyers ask that the site never answered: the three together, and then one each. |

**Nothing in any of it is new.** Every claim is one the site already makes.
Nothing states a figure, a percentage, a client count or a testimonial that was
not already published with a source.

**To take it:**

1. Open the entry — a page under **Pages**, or a question under **FAQs**. What
   you see is the proposal; what visitors see is still what is published.
2. Read it, and change anything you disagree with. The words are yours.
3. **Preview**, then **Publish changes**. The new questions also need
   **يظهر في الصفحة** left ticked, and can be dragged up their page's list.

Take the pieces you agree with and leave the rest; nothing depends on any one
of them.

**One thing to know before you start.** A page's entry holds one proposal at a
time. If you publish something else on the home page or the product page first
— a reworded heading, a new card — the proposal is no longer what the entry
opens on, and you will find it under **Versions** instead. So read these two
pages' proposals before making other changes to them. The questions have no
such catch: each holds its own.

The two paragraph fields that were empty — the units' and the parties' — stay
empty and draw nothing until one is published, so the pages look exactly as
they do today in the meantime. Each of the four is held to a standalone answer
of **30 to 60 words**: the admin refuses a shorter or a longer one, because
that is the length an assistant quotes.

### The English header and footer, waiting for a decision

**The English pages have no header and no footer yet, and English words for
both are sitting in the CMS as a draft** (ticket 40). Publishing that draft is
what gives every English page the menu, the switch back to Arabic, and the
footer — all at once.

**Why it waits for you.** Every word in the header and footer was Arabic, and
an English page never shows Arabic in place of English it has not got. So the
English was written for you to read, not published: the words are yours.

**What is proposed.** Each is the Arabic's meaning in the room the header has.
Three are not the obvious English, because the obvious one does not fit:
**Customers** for «قصص العملاء» («Case studies» is a letter too long for the
menu), **Partners** for «الشراكات», and **Book a demo** for «احجز عرضاً حياً».
The footer's line is *Operating system for construction projects · Riyadh ·
rabaedapp.com*. The footer's four columns of links (ticket 75) are headed
*Rabaed*, *Programs*, *Resources* and *Legal*; the three legal links say
*(Arabic)* and lead straight to the Arabic document, which is never translated.

**To take it:**

1. Open **كلمات الموقع المشتركة**. What you see is the proposal — English beside
   every Arabic word, and **الإنجليزية** listed under **منشورة باللغات**. What visitors
   see is still what is published.
2. Read it, and change anything you disagree with. The Arabic is untouched.
3. To see it on a page, open `/api/preview?path=/en` while signed in — the
   **Preview** button opens the Arabic home page, which this does not change.
4. **Publish changes.**

**One thing to know before you start.** The entry holds one proposal at a
time. If you publish another change to the header or footer first, the
proposal is no longer what the entry opens on; you will find it under
**Versions**, where **Restore** brings it back.

**Two things the English site will still lack, by design.** The sign-in link
leads to the app in Arabic: its address is one for both languages, and nobody
has said what the English one is. And the six marketing pages are not in
English until you publish their English, which waits for you as the next
section says: until then each English address says so and offers the Arabic.
The Terms, the Privacy Policy and the Referral Program's terms are never
translated — the Arabic is binding — and their English address says that too.

### The English pages, waiting for a decision

**Every word of the six marketing pages is written in English and sitting in
the CMS as drafts, and nobody can read a word of it** (ticket 42). Each English
address — `/en`, `/en/product`, `/en/start`, `/en/tool`, `/en/referral`,
`/en/partnership` — goes on saying the page is not in English yet, and offers
the Arabic, until you publish that page's English yourself.

**Why it waits for you.** The words are yours, as the Arabic ones are, and the
ticket asks that nothing reach a visitor before you have read it. A page is
never shown half in English: it becomes an English page only when **everything
it reads** is published in English, and until then it is the notice.

**What is waiting, and where.** In each of these entries the draft it opens on
has English beside every Arabic word. **الإنجليزية** is *not* ticked under
**منشورة باللغات**: ticking it is how you approve a page's English, and until you
do, publishing an Arabic change to the entry publishes none of its English.

| Entry in the admin | English pages that read it | What they read there |
| --- | --- | --- |
| **الصفحة الرئيسية** | Home | Its words, and in its last tab, **الظهور في البحث والمشاركة**, its title and description in a search result |
| **صفحة المنتج** | Product | The same, for the product page |
| **صفحة ابدأ** | Start | The same, for the start page |
| **صفحة الأداة المجانية** | Tool | The same, for the tool page |
| **صفحة برنامج الإحالة** | Referral | The same, for the referral page |
| **صفحة برنامج الشراكات** | Partnership | The same, for the partnership page |
| **قسم «كيف نبدأ معك»** | Home, Product | The closing section both pages end on |
| **شاشات المنصة** | Home, Product | Each screen's description. Its English is the next section's proposal, and has **الإنجليزية** ticked already |
| **شريط الثقة** | Home, Product, Start | Its line, and each company's name |
| **كلمات الموقع المشتركة** | Home, Product, Start, Tool, Referral, Partnership | The header and the footer (the section above) |

The site decides whether a page is in English by exactly these entries, listed
once in `src/content/pages/page-entries.ts` (ticket 91); a test fails if this
table and that list disagree.

And beside them:

- **FAQs** — an English question for every Arabic one, 36 in all, each a draft.
  Filter the list by **اللغة: English** to see them. An English page shows only
  the English questions that are published.
- **Forms** — each form has an English entry, «نموذج … — بالإنجليزية», with a
  draft of its labels, messages and confirmation email. The alert address is
  one for both languages, and stays on the Arabic entry.

**To take a page:**

1. Open its entry. What you see is the proposal; what visitors see is still
   what is published. Read the English and change anything you disagree with.
2. Tick **الإنجليزية** under **منشورة باللغات**, and **Save Draft**. Do the same
   on every shared entry the page reads (the table above).
3. To see it as a page, open its English address in preview while signed in —
   for example `/api/preview?path=/en/start`. The **Preview** button opens the
   Arabic page, which this does not change.
4. **Publish changes** on the page's entry, on every shared entry it reads, and
   on its English questions. The page becomes English the moment the last of
   them is published — the header and footer's included — and appears in the
   sitemap and in the Arabic page's language switch at the same time.
5. Publish each form's English entry too. Until you do, the English form shows
   the same words the draft holds, so nothing is ever in Arabic — but they are
   yours to change only once published.

**The pages the table names least are the quickest.** The tool, referral and
partnership pages share nothing but the header and footer, so each can be the
first page in English — with its questions and its form — while you read the
rest.

**Things to know before you start:**

- **The home and product pages' drafts carry the waiting opening paragraphs**
  of the answer-first copy pass (the section above), since a page's entry holds
  one draft at a time and the English was added to the one waiting. Publishing
  the English there publishes those Arabic paragraphs too. If you do not want
  them yet, clear their Arabic and English boxes before publishing.
- **A word you have changed in Arabic since it was first imported has no
  English proposed**, because nobody here knows your new wording's English —
  the search descriptions you rewrote, the client you added to the Trust strip.
  The CMS names each empty English box when you press Publish: write it, or
  remove **الإنجليزية** from **منشورة باللغات** to publish the Arabic alone.
- **An English page's own titles, descriptions and structured data** come with
  it: its search title and description from the **الظهور في البحث والمشاركة**
  tab of its own entry, published in English with the rest of the page, and
  the company's and the product's description in English for search engines.

**Questions only you can answer.** The English says what the Arabic says, with
a few places where saying it in English asked for a choice:

- **Demos in English?** The Arabic says a demo is 30 minutes «بالعربية». The
  English leaves the language out — on the home page's line under its buttons,
  the demo form and its confirmation email — because whether the team gives
  demos in English is yours to say. If it does, add «in English» there.
- **«مسؤولية واضحة» is «Clear ownership.»** The natural English, «Clear
  accountability.», is three letters longer than the home page's heading has
  room for.
- **The Trust strip's four Arabic names** are written as the companies' names
  read in English — Nawah Real Estate Investment, Alsharq Engineering
  Consultants, Shaheen Engineering Consultants, Amak Build. Put right any a
  company writes otherwise.
- **The tool page's «واجهة عربية كاملة»** tells an Arabic reader the Pour
  Tracker is properly Arabic. To an English reader the English says what is
  true for them: it is fully English and Arabic, each the right way round.
- **The referral page promises a code «فوراً»**, straight away, while the form
  says the team will review the signup and then issue it. The English says what
  the Arabic says; both may want the same correction.
- **The Referral Program terms and the Privacy Policy stay Arabic.** The
  English signup form's consent links to them and says the Arabic is their
  binding text.

### The English screen descriptions, waiting for a decision

**Every screen now has an English picture, and English words describing it
are sitting in the CMS as a draft** (ticket 41). Each screen picture on the site
is described in words — read out by screen readers and written under the
picture — and an English page needs those words in English.

**Why it waits for you.** The words are yours, as the header's were. Nothing a
visitor sees changes when you publish: no English page shows a screen until
the English home and product pages are published (the section above). Publishing
now means they arrive with their descriptions ready.

**What is proposed.** Each description is the Arabic one's meaning — for
example *What the owner sees in Rabaed: one project dashboard with its approval
indicators and the project's parties*.

**To take it:**

1. Open **شاشات المنصة**. What you see is the proposal — English beside every
   description, and **الإنجليزية** listed under **منشورة باللغات**.
2. Read it, and change anything you disagree with. The Arabic is untouched.
3. **Publish changes.**

As with the header, the entry holds one proposal at a time: publish another
change to the screens first, and you will find the proposal under **Versions**,
where **Restore** brings it back.

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

**A migration rebuilt after a merge keeps its name unless it has to move**
after migrations merged since, which `npm run cms:rebase-migrations` says when
it happens (`docs/agents/parallel-sessions.md`). A preview database migrated
before the move knows it by its old name: run the `UPDATE payload_migrations …`
statements the command printed on it, then migrate it again.

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
them `type` by hand. After merging `main` into a branch that has one, rebuild
it with `npm run cms:rebase-migrations` instead. CI's
`npm run cms:check-migrations` fails a pull request whose configuration asks
for something no migration makes, or whose generated code is out of date.

#### What a data migration may and may not do

Beside the migrations Payload generates from the configuration, some are
written by hand to put **content** into the database: the words each page
started with, the Trust strip's marks, the six launch articles. They are the
ones with no `.json` snapshot beside them.

**A data migration writes its rows in SQL, frozen the day it is written.** It
may not write them through Payload — no `payload.updateGlobal`, no
`payload.create` for an entry or a document — because such a statement is built
from the fields the code declares *today*, not from the tables as they were
when the migration ran. Add a field to a page's entry and an untouched
migration from weeks ago starts naming a column the database has not reached
yet: every database built from scratch stops there with `column … does not
exist`, while production, which migrated before the column existed, carries on.
That cost two tickets a workaround each (33 and 26) before ticket 63 closed it.

The one exception is an **upload**. A file has to be converted and written to
storage, which no `INSERT` can do, so a migration that brings in a picture
still creates it with `payload.create({ collection: 'media', … })` — and a
field added to Images can still stop a fresh database there. Three do: the
Trust strip's marks, and the launch articles' covers in Arabic and in English.
Each uploads its pictures first and then runs the SQL for the rows that point
at them, which finds each picture by its file name rather than by the id it had
the day it was written (`excludes` in `IMPORTS`, for the two the freezer made).

To write one:

1. Write the import the readable way first, against the local API, with the
   words in a frozen module of their own beside it (`src/migrations/*-import/`).
2. Add it to `IMPORTS` in `scripts/freeze-seed.ts` and run `npm run
   cms:freeze-seed`. On an empty database it replays the chain, records what
   the import wrote, and writes the statements out as `seed.ts` beside the
   words.
3. Change the migration's `up` to `await db.execute(sql.raw(THE_SEED))`, and
   leave `down` as it was. SQL the import already ran after Payload's calls
   stays after the seed: the legal documents' two `UPDATE`s, which date them
   to the day the text was approved, are why their seed can write `now()` like
   every other.
4. Check it with `npm run cms:migrate-fresh`, which migrates a throwaway
   database from nothing in a few seconds — the only place any of this shows.

**A migration that changes content already seeded cannot use that tool, and it
says so.** The freezer writes out every row of a table that grew, so it refuses
a migration adding rows to a table an earlier import filled — which is what
proposing a change to imported content does. Ticket 35's is the first of these:
its statements are written out in `src/migrations/answer-first-proposal/seed.ts`
from the words beside them, to the same rule, with two differences the freezer
has no need of. **No row is found by an id**, because by then an Editor may have
added or removed one, so a row is found by its own words and a new one lets the
sequence name it. And **a page's entry is copied rather than listed**: a draft
of it is its published version and every row of every list inside it, which is
the one place naming today's columns would be wrong, since a column added later
and missed would propose an entry with a field wiped.

`tests/unit/data-migrations.spec.ts` holds the rule, and every data migration
keeps it: ticket 68 brought over the last eight. A new one written through
Payload fails the suite the day it merges, and so does a frozen seed that no
longer writes the words beside it.

### Forms

Every request sent from a form on the site is kept under **Forms → Form
submissions**, newest first, whether or not any email went out about it. Each
record shows what became of its two emails: the alert to the team and the
confirmation to the applicant.

What every form collects, where each answer is kept and who can reach it is
written out in plain language for the lawyer in
[`privacy-inventory.ar.md`](privacy-inventory.ar.md) and
[`privacy-inventory.md`](privacy-inventory.md) (ticket 37). **Adding a field to
a form means updating both**, and a test fails until they are.

Each form that sends has its own settings under **Forms**: its heading, button
and small print, every field's label, placeholder and error message, what the
visitor is told after sending, the confirmation email, and the **alert
address**. They follow the same Save Draft, Preview and Publish as the site
settings. Which fields a form has is fixed: each field is stored and covered by
the Privacy Policy, so adding one is a developer's change.

- **While a form's alert address is empty, it sends no email at all** — no
  alert, and no confirmation to the applicant. Requests are still stored. Set
  the address once the team is ready to answer them.
- **Each form also has an English entry**, «نموذج … — بالإنجليزية»: the same
  words for the English pages, and the confirmation sent to whoever fills the
  form in in English (ticket 42). The alert address is one for both languages,
  on the Arabic entry. A request from an English page is stored and alerted in
  Arabic like any other, with its language marked — **لغة النموذج** on the
  record, and a line in the alert — so the reply goes back in English.
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
