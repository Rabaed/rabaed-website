# 26: Search settings in the CMS

**What to build:** Ahmed controls how each page appears in Google and when shared on WhatsApp or LinkedIn — its title, its description and its sharing image.

**Blocked by:** 19, 31

**Status:** resolved

- [x] Every page, post and case study carries editable title, description and sharing image fields
- [x] Sensible defaults are generated when a field is left empty, so nothing is ever blank
- [x] Length guidance is shown in the admin so titles and descriptions are not silently cut off in results
- [x] Changes are reflected in the page's tags, in the sitemap entry and in the sharing preview

## Comments

**The founder's answer (20 September 2026).** **The fields are one entry of their own, not three fields on each page's entry.** Ticket 33's warning below is real and this ticket confirmed it: a data migration that writes through Payload selects every column the schema declares today, so a field added to `home_page` makes `import_home_page` fail on any database built from scratch. Fixing that properly means rewriting eight data migrations, the home page's several hundred frozen words among them; the founder chose the smaller, safer change. **Ticket 63 is the fix itself**, and after it these fields could move onto the pages they describe.

**Decided while building (20 September 2026).**

- **A sharing image is a collection of its own**, not a picture in `media`. It is the one picture here the site does not draw: `media` re-encodes everything to WebP, which is right for a photograph on a page and wrong for a card WhatsApp fetches for itself; the narrower copies it makes are for a browser to choose between, and nothing chooses here. It takes a 1200×630 PNG and stores it exactly as it arrived. A picture of another shape is refused with its own size in the message, because «حدث خطأ ما» would leave an Editor resizing at random.
- **1200×630 exactly, not «that size or larger»**, which is what `pictureField` asks of a picture on a page. Everywhere that unfurls a link crops to that shape, and each of them crops a different shape differently — the one thing a sharing image must not be.
- **The page's short name stays in code.** It names the page inside the site, in a breadcrumb trail (ticket 32), rather than saying anything to a search engine, so only the title, the description and the picture moved.
- **The referral page's title and description still name the Referral Program's amounts** rather than stating them — `{payout}`, `{clientDiscount}` — so changing an amount still changes every mention (ticket 56). A name the site does not hold is refused on that tab.
- **`/llms.txt` followed without being touched**, as ticket 33 said it would: it is built from each page's description by way of the content module, so moving the description into the CMS moved the file's source with it.
- **An empty search title or description is refused, not filled in.** The criterion asked for a generated default; the founder chose refusal on 20 September 2026. A generated description is a guess, and two pages guessing from similar headings produce the same line, which a search engine reads as two copies of one page — while nothing looks broken. The sharing image is the exception: left empty, a page shares the site's own, which is a real picture rather than a guess.
- **The length a result actually shows is said where the Editor types.** Payload draws no counter, so each field says it: about 60 characters of a title and 160 of a description are shown before the rest is cut, and the limits are a little above that, because the words past the cut still count when a search engine decides what a page is about.
- **A sitemap entry carries the day the settings were last published.** A sitemap has nowhere to put a title or a description — an entry is an address and a date — so the date is what a change to a page's description can show there, and it is the one thing a crawler reads it for.
- **The blog index, the case studies index and the three legal pages get no sharing image of their own.** Their words are already in the CMS, but the field would have to go on `index-leads` or on the legal documents, both of which are seeded by a data migration: the very trap this ticket went round (ticket 63). They share the site's own picture until ticket 63 lands.
- **The six pages are covered; the blog and case studies keep what they had.** Their lines are already in the CMS (`index-leads`, ticket 59) and their titles wait for ticket 42's English site. The legal pages have had their own search title and description since ticket 25. A post and a case study gain a sharing image, their title and summary having served as the other two all along.

**From ticket 31 (15 September 2026).** Every page's title, description, canonical, Open Graph and Twitter tags come from one function, `pageMetadata` in `src/lib/metadata.ts`. It uses one sharing image for all pages, `public/og-rabaed.png` (drawn by `npm run brand:export`); a page's own image belongs as an optional argument there, falling back to that one. Keep `openGraph` and `twitter` set whole in that function — Next.js merges metadata shallowly, so setting part of either anywhere else drops the rest. `tests/e2e/search-foundations.spec.ts` holds every page to a unique title and description and to an image of exactly 1200×630.

**From ticket 33 (20 September 2026).** Two things waiting here.

1. **`llms.txt` follows this ticket without being touched.** It is generated from each page's `meta.description` — the same value `pageMetadata` puts in the page's `<meta name="description">` — by way of the page's content module (`src/content/pages/*.ts`). Move those descriptions into the CMS and `llms.txt` becomes CMS-driven with no edit to `src/app/llms.txt/route.ts`. `tests/e2e/ai-crawlers.spec.ts` asserts the two agree, so a description that reaches the page but not the file fails.

2. **Adding a field to a page global will break every fresh database, and production will not tell you.** A data migration that writes through Payload's local API — `20260915_040105_import_start_page` and its five siblings — selects every column the *current* schema declares. Add a column to `start_page` today and that migration, written before the column existed, fails with `column "..." does not exist` on any database built from scratch: the test server, a preview, a new deployment. Production is unaffected, because it applied the migration before the column existed.

   Ticket 33 hit this on `site-settings` and went around it by giving its one field a global of its own. This ticket cannot go around it: the fields belong on the page globals the `import_*` migrations seed. The fix is to make those data migrations schema-independent — raw SQL naming the columns that existed when they were written — before adding the fields, or the whole suite goes red on a database nobody can debug from production.
