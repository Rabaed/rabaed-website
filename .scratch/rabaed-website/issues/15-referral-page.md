# 15: Referral page

**What to build:** The Referral Program page: how it works, the offer, who qualifies, what is required, the summarised terms, the FAQ, and the signup form with its document uploads.

**Blocked by:** 04, 11

**Status:** resolved

- [x] All sections match baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports; see below for what is left out and why
- [x] The SAR 2,000 per project and 10% client discount appear as on the Reference site, and are not repeated in the header menu
- [x] The signup form is marked up as a real form, including both consent checkboxes and the upload fields
- [x] Upload fields keep the Reference site's label structure and selected-state styling; wiring happens in ticket 28
- [x] The hardcoded fake referral code and fake success message are **not** carried over
- [x] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.

**The closing steps' wrapping exception is this page's (noted by ticket 11).** The handoff lists `.tail-steps .ph { white-space: normal; min-width: 0 }` among the CSS exceptions that must survive. It exists only on the referral and partnership pages, where each step carries a small `.ph` heading — the home page's closing steps have none, so ticket 11 had nothing to apply it to. Carry the rule over with this page's steps, and comment it in place as a deliberate exception.

**What was built.** `/referral`, in the Reference site's order: the page hero «أحِل مشروعاً واحداً. اكسب 2,000 ريال.» with its three figures, how it works in four steps, the offer, who the programme is for, what is referred, the terms in eight points, the nine questions «قبل أن تسجّل», and the signup «كودك جاهز خلال دقيقة» with its form. Every word, the title and the description are verbatim from `reference/site/referral.html` and in the first response.

The sections are server components in `src/components/referral/`; the page hero is in `src/app/(ar)/referral/page.tsx`. The only client component is `upload-field.tsx`. The styles are `src/styles/programmes.css`, named for both programme pages because the Reference site gives them one shared block; ticket 16 adds what only the partnership page uses.

- **The amounts** are written into the copy, as on the Reference site and in the Referral Terms. Ticket 21 moves them into one place that drives both. A test reads the whole header, dropdown and mobile panel included, and finds none of «2,000», «2000», «10%» or «ريال».
- **The questions** are ticket 11's `Faq`, in a row of cards. The nine are `REFERRAL_FAQ` in `src/content/faq.ts`.
- **The step cards** are ticket 14's `StepCards`, which now takes `columns="four"`: four across only at desktop widths. `.start.four` sits inside `@media (min-width: 981px)`, commented in place as HANDOFF §7.4's exception.
- **`.strip` and `.gain` moved into `tokens.css`**, out of `product.css`'s `#custom` and `#roles`, because the referral page uses both. The product page's comparison still passes. The audience cards are `.rt-row` and `.rt-c`, which ticket 14 had already put there.

### The form

- **It is a real `<form>`**, `method="post"` and `multipart/form-data`, labelled by its heading. Its twelve fields are named and in the Reference site's order.
- **The starred fields, the IBAN certificate and both consents are `required`** (HANDOFF §4.ب). The profession list leaves the choice to the visitor.
- **The declaration is the non-conflict checkbox's accessible description**, so a screen reader hears what the box declares.
- **No fake success.** The Reference site's «تم تسجيلك. كودك هو RB-A47K» and `data-fake-send` are gone. As in the demo request form, the submit button stays disabled until ticket 28, so neither the button nor Enter sends anything.
- **The small print «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.» is kept word for word**, because it is true. Ticket 28 replaces it.

### Document fields

`UploadField` keeps the Reference site's `.upl` structure: a label wrapping the file input, the arrow, the document's name and note, and `.nm`. Choosing a file adds `.has`, so the card turns green and shows the file's name, as the Reference site's script did. Uploading, progress and rejection are ticket 28's.

### Deliberate differences from the Reference site

- **Arabic set in DM Mono.** The step labels «01 · سجّل», the figures «2,000 ريال» and «بلا حد», the badges «لك» and «لعميلك», and «7 أيام عمل» in the guarantee pill keep the Arabic face, with only numerals `.mono`. The Reference site sets them wholly in DM Mono, which has no Arabic glyphs. The eyebrows are still `.eyebrow`, waiting on bug 45.
- **The file inputs are hidden from sight, not from the keyboard.** The Reference site's `hidden` takes them out of the tab order: a visitor without a mouse could not attach the required IBAN certificate, and its own `:focus-within` outline could never show. Here they are clipped to nothing but still take focus.
- **«كيف يعمل البرنامج ↓» and «سجّل واحصل على كودك»** land on `#how` and `#signup` 78px short, with `scroll-margin-top` instead of the Reference site's script. `#how`'s margin is `tool.css`'s, which the tool page's `#how` already needed.
- **The disabled submit button**, as in ticket 11, is 2px taller because of its border.
- **The header's «احجز عرضاً حياً»** goes nowhere here, as on the Reference site's sub-pages.

### Not carried over, because it is not on this page

**`.tail-steps .ph` is in `referral.html`'s stylesheet, but the page has no `.tail-steps` markup**: its steps are `.start.four .s`. Only `partnership.html` uses the rule, so it is left to ticket 16 and noted there.

### For the founder

The page promises the code instantly, in three places:

- «ويصلك كودك الخاص فوراً على جوالك وبريدك»
- «يصلك الكود فوراً على جوالك وبريدك»
- «كودك جاهز خلال دقيقة»

No ticket issues referral codes. Ticket 28 stores the application and its documents, and nothing sends a code by text message or email. Before the form goes live, either something issues codes or the copy changes.

### Tests

**`tests/e2e/referral-page.spec.ts`** checks:

- Every section and every answer in the first response, with no fake code or confirmation.
- The amounts, and none of them in the header.
- The steps in order: four across at 1280px, two across at 980px.
- The eight terms.
- Each question a `<details>` that opens with JavaScript off.
- The form's twelve fields, with their types, `accept` and `required`.
- The profession list.
- Both consents, with their links and description.
- A document field showing the chosen file, and clearing again.
- A document field reached by Tab, with its outline showing.
- Nothing pretending to send.
- Both hero links landing clear of the header.
- The page's links.
- The form beside its copy at 1280px, and under it at 980px.
- None of the home or product pages' animations loaded.
- No sideways scrolling at all sixteen viewports.

**`tests/e2e/referral-matches-reference.spec.ts`** compares every section part by part at all sixteen viewports, and a document field with a file chosen at 360 and 1280px. It leaves out only:

- the Arabic labels' typeface, and the width and place their words set;
- the size and place of the hero's three figure cards. On the Reference site their Arabic falls back to whatever face the operating system supplies. On Linux, where CI runs, that face wraps «2,000 ريال» at 390px and widens the first card at desktop widths; on Windows it does not. This was found by CI, after every comparison had passed locally;
- the disabled button's colours and the 2px its border adds;
- the file inputs themselves, which draw nothing on either page.

**`tests/e2e/animation-code.ts`** holds the animation markers and `scriptsOf`, moved out of `start-page.spec.ts` so both pages use them.

**`/referral` is in `tests/e2e/routes.ts`**, so the server-rendering, health, fonts, indexing and localisation suites cover it.

**Verified by falsification.** One build carried three breaks: `.start.four` at three columns, `hidden` put back on the file input, and `#how`'s scroll margin removed. Exactly the expected 15 tests failed, and nothing else:

- the 12 comparisons at widths of 981px and up;
- the one-row steps test;
- the keyboard test;
- the «كيف يعمل البرنامج ↓» test.

### What the review changed

Two reviews, standards and spec.

Changed:

- **Two wrong comments.** The animation test said the Reference referral page carries no animation code, but it carries all of it. The `.start.four` note cited HANDOFF §5 for what is in §7.4.
- **The stylesheet header claimed every value was compared.** Hover states and transitions are not, and it now says so.
- **The document field took its visible name separately.** It is now derived from its label.
- **The selected state was held by one colour.** A comparison of a field with a file chosen now covers it.
- **The `.ph` hand-off was recorded nowhere.** It is now recorded here and on ticket 16.

Checked and left:

- **«`.form .upl` is a prefix the Reference site does not use».** It does, at `referral.html:810`.
- **The sections repeat the Reference site's inline top border**, as the start page does.

Resolved by merging main:

- **The step-card markup repeated the start page's.** Ticket 14 had meanwhile made it `StepCards`, and the referral page's steps now use it.
