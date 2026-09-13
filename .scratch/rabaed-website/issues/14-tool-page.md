# 14: Tool page

**What to build:** The landing page for the free Pour Tracker: why it exists, what it does, how it works, what it requires, the download section and the FAQ, ending with the upsell to Rabaed.

**Blocked by:** 04, 11

**Status:** resolved

- [x] All sections match baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports, and the form in three states; see below
- [x] The download form is marked up as a real form with named fields; it starts working in ticket 30
- [x] The Reference site's validation behaviour is the model: the submit button stays disabled until the form is valid
- [x] Arabic-Indic numerals render as on the Reference site
- [x] Phone and email fields keep their left-to-right override inside the right-to-left layout
- [x] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.

**What was built.** `/tool`, in the Reference site's order:

1. the hero «سجّل الصبّة اليوم، واعرف متى يحين اختبار الكسر — قبل أن يتأخر», with its drawing of the tool
2. why the tool exists
3. what it does
4. the three steps
5. where its files live
6. what it needs
7. the download section and its form
8. the six questions «قبل أن تحمّل»
9. the upsell «تحتاج أكثر من مشروع واحد؟»

Every word, the title and the description are verbatim from `reference/site/tool.html`, Arabic-Indic numerals and left-to-right marks included, and in the first response.

The sections are server components in `src/components/tool/`, one file per section, with the pieces three of them share — a section's heading, a card, a ticked line — in `parts.tsx`. The styles are `src/styles/tool.css`. Only the form is a client component.

- **Shared with other pages.**
  - **The step cards** are now `src/components/step-cards.tsx`, taken from the start page, whose three steps take the same shape.
  - **The three-across cards** (`.rt-row`, `.rt-c`) join `tokens.css` beside the teaser head.
  - **A field's message and red border** (`.form .er`, `.bad`) join the form rules in `shell.css`.
- **The questions** are ticket 11's row of `<details>`. One answer names two files, `concrete_db.json` and `attachments`, which the Reference site sets left to right. An answer in `src/content/faq.ts` can now carry such names; ticket 32 joins its parts back into one text for the structured data.

### The download form

`src/components/tool/download-form.tsx`, with its rules and messages in `download-details.ts`, apart from the form, so ticket 30 checks the same ones on the server.

- **Named fields:** `firstName`, `lastName`, `countryCode`, `phone`, `email`, `company`. The first four are `required`. The form is `noValidate`, so only the Arabic messages ever show, never the browser's.
- **The Reference site's validation, exactly:**
  - Two letters for each name, after trimming.
  - Six to fifteen digits for the phone, whatever else is typed.
  - An address with an @, a dot, and two letters after the dot.
  - The button stays locked, reading «أكمل البيانات لتفعيل التحميل», until all four are valid, when it reads «حمّل الأداة الآن». It locks again the moment one stops being valid.
  - The bar above fills a quarter for each valid detail.
  - A field shows its message only once the visitor has been into it and out again, and clears as soon as it is put right.
  - With JavaScript off, the button stays locked.
- **Phone and email keep their override:** typed left to right, aligned right.
- **Once unlocked, pressing it sends nothing and delivers nothing.**
  - On the Reference site, submit logs the details to the console, downloads the file without keeping them, and swaps the form for «تم — التحميل بدأ».
  - The spec forbids that: "The Pour Tracker download is delivered only after the submission is recorded." Recording it is ticket 30's.
  - So there is no download, no confirmation, and nothing in the address bar.
  - The two sentences that promise the download starts at once — beside the form, and in the first step — describe the page once ticket 30 is done.
  - The Reference site's confirmation panel and its styles are left for ticket 30, noted there.

### Deliberate differences from the Reference site

- **Arabic labels in the Arabic face:**
  - The three steps' «01 · حمّل الملف» and its like, with only the numeral in DM Mono, as on the start page.
  - The requirement cards' «النظام», «التجربة الكاملة», «وضع مبسّط».
  - «دقيقتان» in the guarantee pill, through the rule ticket 06 already changed.

  The Reference site sets all of them in DM Mono, which has no Arabic glyphs. They keep its letter-spacing; noted on bug 45 with the rest.
- **The hero's two links** land on `#get` and `#how` 78px short, with `scroll-margin-top` instead of the Reference site's script, instantly rather than smoothly.
- **«أخرى» among the country codes is sent as `other`** rather than the Reference site's `+other`.
- **Field messages are tied to their fields** with `aria-invalid` and `aria-describedby`, which the Reference site's are not. Both appear only while the message shows.
- **The hero's drawing of the tool stays markup**, hidden from assistive technology, as on the Reference site. ADR-0002 makes Rabaed app screens into pictures because they are thousands of lines of machine-made markup. This is a few dozen lines drawing the Pour Tracker, and every claim in it is made in words beside it. Its `.tiles` and `.tile` rules are scoped to it, since the screens that shared them are pictures now.

### Animation code

The page moves nothing but the header, and loads none of the home or product pages' animation code. It does load GSAP and ScrollTrigger, which the header's colour toggle is built on — where the Reference tool page does the same toggle with a scroll listener and loads no GSAP. Rebuilding the toggle changes every page's header, so it is noted on ticket 36, whose check it is, rather than done here.

### Tests

- **`tests/e2e/tool-page.spec.ts`**
  - Every section and every answer in the first response.
  - Each question a `<details>` that opens with JavaScript off.
  - The numerals exactly as the Reference site writes them, in the page and in its description.
  - The form's named fields, their autocomplete and which are required, and the country codes.
  - Phone and email left to right and aligned right, in a right-to-left form.
  - The button locked with JavaScript off.
  - The button unlocking only once all four details are valid, the bar filling with them, and locking again.
  - Each rule, one field at a time, against the values the Reference site refuses and accepts.
  - A message showing only once its field is left, and clearing when put right.
  - An unlocked button sending nothing, delivering nothing and claiming nothing.
  - Both hero links landing clear of the header; the upsell's links; the drawing hidden from assistive technology.
  - No sideways scrolling at all sixteen baseline viewports.
- **`tests/e2e/tool-matches-reference.spec.ts`** compares, part by part, at all sixteen baseline viewports:
  - every section
  - the drawing on its own
  - the download form three times: untouched, with a field left wrong, and with every detail valid

  Left out, and only where they reach: the three kinds of Arabic label's typeface, and the guarantee pill's width and place across.
- **`/tool` is in `tests/e2e/routes.ts`**, so the server-rendering, health, fonts, indexing and localisation suites cover it.

**Verified by falsification.** The first break was one build with six changes, each aimed at a different test, and it failed exactly those 21 tests:

- A hero chip's padding off by a pixel failed all sixteen comparisons.
- The first name accepting one letter failed exactly that field's rule test.
- The phone field losing `dir="ltr"` failed exactly the left-to-right test.
- `#get` losing its scroll margin failed exactly its link's test.
- Messages showing while typing failed exactly the "once left" test.
- A valid submit fetching the file failed exactly the "sends nothing" test.
- After the review added the form's other two states, a field message's margin off by a pixel failed all sixteen viewports, each only in «with a field left wrong».

The tests and the page were written in the same pass, rather than the tests first, which is why every test was proved this way.

### What the review changed

Two reviews, standards and spec. The spec review checked every string, digit, minus sign and left-to-right mark against the Reference page and found them verbatim, and the validation rules identical. The standards review checked every CSS value and found them exact. What they did find:

- **This ticket was not written up**, and the form's success panel had no owner. It is now, and ticket 30 has the panel, the two sentences, and where the form is.
- **GSAP on this page** was not recorded anywhere. It is on ticket 36.
- **The comparison measured the form only untouched.** It now measures it with a field left wrong and with every detail valid too.
- **Two sections to a file.** `sections.tsx` and `closing.tsx` are one file per section, as the product and start pages are.
- **No `required` on the required fields.** They have it.
- **Names.** `left`, the fields a visitor had left, read as a direction on a right-to-left page: `touched`. `required()` returned a field's props and its message: `requiredField()`.
- **The first-response test** looked for two answers; it looks for all six.
- **The message count** was found by a class name; it is found by the messages' text.
- **Comments.**
  - `start.css` still called the marked-out step the guarantee.
  - The drawing was "thirty lines".
  - `tool.css` pointed at one divergence where there are three.

Checked and left:

- **`text-align: right` on the phone and email**, physical where the stylesheet is logical. It is the Reference site's inline override inside a `dir="ltr"` field. Where it should align on the English site is ticket 42's.
- **The drawing's two colours, written as hex** where `--gold` and `--acc` exist — verbatim from the Reference markup.
- **The hero links' landing test repeats the start page's.** Each page's spec says what its own links do.
