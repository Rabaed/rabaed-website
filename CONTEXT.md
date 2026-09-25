# Rabaed Website

The public marketing website for Rabaed (ربائد), a Saudi construction-project collaboration platform. Separate from the Rabaed product app, which will live at `app.rabaedapp.com`.

## Language

### The company and its product

**Rabaed** (ربائد):
The company and the product. Legal entity: شركة ربائد البناء, unified number 7050078786, Riyadh, Saudi Arabia.
_Avoid_: رَبَاعِد (a misspelling in `reference/site/pour-tracker.html`), "V site", Rabaed App as a company name.

**Record** (السجل):
The single documented, timestamped history of every request and approval on a construction project. The product's core promise: one record shared by all three parties.
_Avoid_: log, history, audit trail (all fine in prose, but the product concept is the Record).

**The three parties**:
**Owner** (المالك), **Consultant** (الاستشاري), **Contractor** (المقاول). The three roles a construction project has, and the roles the product brings onto one Record.
_Avoid_: client, supplier, vendor.

**Request** (طلب) and **Approval** (اعتماد):
The two events that make up the Record. A Request is raised by one party; an Approval is the documented decision on it.

### The website

**Marketing site**:
This project: the public pages at `rabaedapp.com`. Distinct from the **product app** (`app.rabaedapp.com`), which is a separate system this site links to and does not contain.
_Avoid_: "the website" unqualified, when the app is also in scope.

**Page registry**:
The one list of the Marketing site's pages, written out by hand in `src/lib/page-registry.ts`: each page's address, its short name, its entry in the CMS and the entries it shares, and where its questions are; and, beside them, the files crawlers read and the routes that are not pages. Every other list of pages — the sitemap, `llms.txt`, the pages questions are filed under — is read from it, and a test fails when a route is in neither it nor its list of exclusions (ticket 92).
_Avoid_: sitemap (the file search engines read, built from this), route list (`tests/e2e/routes.ts`, which the tests restate on purpose).

**Reference site**:
The nine hand-built HTML pages in `reference/site/`, written by the co-founder. The source of design, animation and content for the rebuild — never the source of technical guidance.
_Avoid_: prototype, old site, v1.

**Screen mock**:
A depiction of a Rabaed app screen shown on the marketing site. Exists in the Reference site as hand-written HTML; in the rebuild it becomes an exported image. Not a photograph of the real app, which does not exist yet.
_Avoid_: screenshot (implies a real app), mockup, demo.

**Phone crop**:
A second picture of a Screen mock, zoomed in on the part of the screen that matters, shown in its place on a phone, where the whole screen would be too small to read. Tapping it shows the whole screen. A cut from the same screen, never a phone-app layout, which would depict an app that does not exist.
_Avoid_: mobile screenshot, mobile version (both suggest a phone app).

**Footer directory**:
The columns of links at the foot of every page, through which every page of the Marketing site can be reached, including those the header has no room for. Its columns and links are an Editor's.
_Avoid_: sitemap, which is the file search engines read (`/sitemap.xml`), a different thing with a different audience.

**Trust strip** (شريط الثقة):
The moving bar of client and partner logos. Content managed in the CMS so logos can be added over time.

**Sharing image** (صورة المشاركة):
The picture a page shows when its link is shared — on WhatsApp, on LinkedIn, in a search result's card. Always 1200×630 and a PNG, because everywhere that unfurls a link crops to that shape and draws that kind. The site's own is `public/og-rabaed.png`; a page an Editor has given one of its own uses that instead (ticket 26).

**Referral Program** (برنامج الإحالة):
The programme paying SAR 2,000 per project to an individual who refers a client, who in turn receives 10% off. Has its own page and its own terms page.
_Avoid_: affiliate program.

**Partnership Program** (برنامج الشراكات):
The programme for engineering offices (المكاتب الهندسية) and project management companies. Distinct from the Referral Program: different audience, different application form.

**Referral Program values**:
The two numbers the Referral Program promises: the **referral payout** to the referrer (SAR 2,000 per project) and the **client discount** to the referred client (10%). Held once and shown wherever the Marketing site quotes them; the Referral Terms state them in their own binding text.
_Avoid_: commission, reward, affiliate fee.

**Case study** (قصة عميل، والقسم: قصص العملاء):
A real client's story, published with their agreement: the challenge, what changed, the outcome, and optionally figures and a quote. The section is hidden, link and all, until the first one is published.
_Avoid_: success story, testimonial (a quote is one part of a case study, not the whole), دراسة حالة in the site's Arabic.

**Pour Tracker** (متتبّع الصبّات):
The free downloadable tool — a single self-contained HTML file for tracking concrete pours and break tests — offered as a lead magnet. Distinct from `tool.html`, the marketing page that describes and delivers it.

**Form definition**:
A form described once in code: its fields, what counts as an acceptable answer to each, and the words it starts with. The browser and the server both check answers against it. Which fields exist is fixed there; what they say is an Editor's.

**Submission** (طلب):
One request sent from a form, stored before anything is emailed about it. Every form's submissions go through the one submission pipeline and are kept together under Form submissions. In visitor-facing Arabic it is a طلب, as in «طلب عرض حي»; in code and docs it is a Submission, never a Request, which is the Record's event.
_Avoid_: lead, entry, response.

**Alert address**:
Where a form's alert emails go, set by an Editor per form. While it is empty the form sends no email at all, and still stores every Submission.

### The CMS

**Editor**:
Anyone given access to the CMS. Every Editor can change everything, legal pages included. People who never log in, such as the lawyer, send their changes to an Editor.
_Avoid_: owner or owner account (the Owner is one of the three parties), admin, user.

### Visibility

**SEO**:
Being found in conventional search results, primarily Google.

**GEO** (Generative Engine Optimization):
Being cited inside answers generated by AI assistants — ChatGPT, Claude, Perplexity, Google AI Overviews. A distinct discipline from SEO with its own techniques, not a synonym for it.
_Avoid_: geographic targeting, geolocation, local SEO (all different things).

**Opening answer** (الجواب المباشر):
The first paragraph under a heading, written so that it can be lifted and quoted on its own: a standalone answer of 30 to 60 words, understood without reading a word above it. An answer engine quotes a paragraph, not a page, so this is the paragraph that gets cited. Required of every article and case study since ticket 23, and of the four sections `reference/HANDOFF.md` §6.4 names since ticket 35; the rule itself is `src/cms/answer-first.ts`. In code it is the section's `lead`, as every paragraph under a heading is, and `.lead` on the page — the Reference site's own class name, which the design system keeps (spec: Design system).
_Avoid_: intro, blurb, and **summary**, which is a field of its own: the line or two shown under a title on an index and as the description in a search result.

**Retrieval crawler** (زاحف الاسترجاع):
A crawler that fetches a page at the moment somebody asks an AI assistant a question, and names the source in the answer — `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot` and the rest. What decides whether Rabaed is quoted **now**. Always allowed in `robots.txt`; no switch can refuse one.
_Avoid_: bot; “AI crawler” for either kind on its own — the distinction from a Training crawler is the whole point, and the term belongs only where both are meant, as the CMS section named for them is.

**Training crawler** (زاحف التدريب):
A crawler that copies pages to train an AI model — `GPTBot`, `ClaudeBot`, `CCBot`, `Meta-ExternalAgent`. What decides whether a model knows Rabaed from the inside in a year or two, with no citation, visit or link. Allowing them is a business decision, not a technical one: one switch in the CMS, allowed by default.

**llms.txt**:
A short Markdown file at the site's root summarising what Rabaed is and where its pages are, for an AI assistant to read instead of crawling the site. An emerging convention, not a standard. Generated from the descriptions the pages themselves declare, never written out by hand.
_Avoid_: treating it as a ranking signal, or as a second sitemap (it is prose, and it is for assistants).
