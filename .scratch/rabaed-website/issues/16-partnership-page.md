# 16: Partnership page

**What to build:** The Partnership Program page for engineering offices and project management companies: the idea, who it is for, the partnership modes, benefits, the path to joining, the FAQ, and the application form.

**Blocked by:** 04, 11

**Status:** resolved

- [x] All sections match baselines at all eight widths — measured against the Reference site itself, at all sixteen baseline viewports; see below for what is left out and why
- [x] The application form is marked up as a real form with all its fields, including the commercial registration upload
- [x] No fake success behaviour is carried over
- [x] Zero console errors, zero failed requests, zero horizontal overflow

## Comments

**Ticket 11 added as a blocker on 13 September 2026**, when the founder chose to run several sessions at once. Ticket 11 builds the FAQ's native disclosure pattern and the form markup this page reuses; taking this page before it would build them twice, in two lanes at the same time.

**The closing steps' wrapping exception is this page's (noted by ticket 11).** The handoff lists `.tail-steps .ph { white-space: normal; min-width: 0 }` among the CSS exceptions that must survive. It exists only on the referral and partnership pages, where each step carries a small `.ph` heading — the home page's closing steps have none, so ticket 11 had nothing to apply it to. Carry the rule over with this page's steps, and comment it in place as a deliberate exception.

**`.tail-steps .ph` is this page's alone (noted by ticket 15).** `referral.html` carries the rule in its stylesheet, but it has no `.tail-steps` markup, so ticket 15 had nothing to apply it to.

Ticket 15 started `src/styles/programmes.css` for both programme pages. This page's rules belong there too:

- `.tail-steps .ph`
- `.rt-row.two`
- `.start .s .fit`
- `.form textarea`

Already there: `.pstats`, `.lead-block`, `.t8`, `.ben-row`, `.sign-grid`, `.chk`, `.declar` and `.upl`.

The file field is `src/components/referral/upload-field.tsx`, ready to reuse for the commercial registration.

**What was built.** `/partnership`, in the Reference site's order: the page hero «منصّة إدارة المشروع… ضمن عرضك أنت» with its three figures, «لماذا شراكة، لا عمولة؟», the four audiences, the three modes, the eight commitments, the path in four stages, the six questions «قبل الاجتماع الأول», and the application «خلّنا نجلس ونصمّم النموذج المناسب لمكتبك» with its form. Every word, the title and the description are verbatim from `reference/site/partnership.html` and in the first response.

The sections are server components in `src/components/partnership/`; the hero is in `src/app/(ar)/partnership/page.tsx`. The page's own rules — `.start .s .fit`, `.rt-row.two`, `.tail-steps .ph` and `.form textarea` — are in `src/styles/programmes.css`, the two HANDOFF §7.4 exceptions marked in place.

- **The modes** are `StepCards`, which now takes an optional `fit`: the «مناسب لـ» line under each.
- **The questions** are `PARTNERSHIP_FAQ` in `src/content/faq.ts`, in ticket 11's `Faq`.
- **The stages** are the closing section's `.tail-steps`, each with a `.ph` heading. `.tail-steps .ph` keeps `white-space: normal; min-width: 0`, as the handoff requires.
- **The document field moved** to `src/components/upload-field.tsx`, now that two forms use it. The referral form's import follows; ticket 28's note is updated.

### The form

- **It is a real `<form>`**, `method="post"` and `multipart/form-data`, labelled by its heading. Its thirteen fields are named and in the Reference site's order (HANDOFF §4.ج).
- **Every starred field and the commercial registration are `required`.** The free text is optional, as its placeholder says. Each list's first option is its prompt with an empty value, so `required` makes the visitor choose.
- **The lists send English values.** The Reference site's options had none, so they would have sent their Arabic text. Noted on ticket 29, which stores them.
- **No fake success.** The Reference site's «وصلنا طلبك. يتواصل معك فريق الشراكات خلال يومي عمل…» and `data-fake-send` are gone. As on the referral form, the submit button stays disabled until ticket 29.
- **The small print «نموذج أولي — لا يُرسل فعلياً في هذه النسخة.» is kept word for word**, because it is true.

### Deliberate differences from the Reference site

- **Arabic set in DM Mono**, as on the referral page. The figures «3 أنماط», «4 مراحل» and «بلا رسوم», the modes' labels «01 · التضمين في العرض» and the rest, and «يوما عمل» in the guarantee pill keep the Arabic face, with only numerals `.mono`.
- **Not the stage labels «المرحلة 01» to «04».** They are `.tail-steps b`, which the home and product pages' closing steps share, so they keep DM Mono with them until bug 45 decides. Noted there.
- **The file input is hidden from sight, not from the keyboard**, as on the referral page.
- **«اطلب اجتماع شراكة»** (the hero's and the path's) and **«كيف نبني الشراكة ↓»** land on `#apply` and `#path` 78px short, with `scroll-margin-top` instead of the Reference site's script.
- **The disabled submit button** is 2px taller because of its border.

### Tests

**`tests/e2e/partnership-page.spec.ts`** checks:

- Every section and every answer in the first response, with no fake confirmation.
- The hero's figures.
- The audiences two to a row at 1280px, one at 980px.
- The modes with their «مناسب لـ» lines.
- The eight commitments.
- The stages in order.
- Each question a `<details>` that opens with JavaScript off.
- The form's thirteen fields, with their types, `accept` and `required`.
- Every list's choices, and the free text.
- The commercial registration showing the chosen file, and reached by Tab.
- Nothing pretending to send.
- All three in-page links landing clear of the header.
- The link to the Referral Program.
- The header marking the page.
- The form beside its copy at 1280px, under it at 980px.
- None of the home or product pages' animations loaded.
- No sideways scrolling at all sixteen viewports.

**`tests/e2e/partnership-matches-reference.spec.ts`** compares every section part by part at all sixteen viewports, and the commercial registration with a file chosen at 360 and 1280px. It leaves out, as ticket 15's does:

- the Arabic labels' typeface, and the width and place their words set;
- the size and place of the hero's figure cards;
- the disabled button's colours and the 2px its border adds;
- the file input itself.

The stage labels are measured in full. The hero's decorative glow is not measured, on either programme page.

**`/partnership` is in `tests/e2e/routes.ts`**, so the server-rendering, health, fonts, indexing and localisation suites cover it. The full suite is green: 715 tests.

**Verified by falsification.** One build carried four breaks: `.rt-row.two` removed, the `.ph` wrapping removed, `#path`'s scroll margin removed, and the free text's padding 1px larger. Exactly the expected 19 tests failed, and nothing else:

- all 16 comparisons, for the free text;
- the comparisons at 981px and up, for the audiences as well;
- the audiences test;
- the «كيف نبني الشراكة ↓» test;
- the stages test.

**The `.ph` exception is held by its computed style alone.** Today's four headings fit their column on one line with or without it, so nothing drawn shows it gone. The test says so, and checks the style so that a longer heading from the CMS (ticket 21) still wraps.

### What the review changed

Two reviews, standards and spec.

Changed:

- **Ticket 28 pointed at the document field's old path.**
- **Two comments said only the home page shares `.tail-steps b`.** The product page does too.
- **The figures' DIVERGENCE comment missed «بلا رسوم».**
- **This ticket was not written up, and ticket 29 did not know the lists' values.**

Checked and left:

- **The same test file is built in both specs, as in the referral ones.** It follows the one-spec-per-page habit.
- **Some tests read class names and a computed style.** As the referral spec does; the one computed style is explained above.
