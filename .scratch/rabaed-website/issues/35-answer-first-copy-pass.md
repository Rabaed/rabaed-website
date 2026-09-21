# 35: Answer-first copy pass

**What to build:** The first sentence under every major heading becomes a standalone answer that an AI assistant can lift and quote directly, without changing what the page says or how it looks.

**Blocked by:** 53, 54, 55, 56, 57, 58

**Status:** ready-for-human — every rewrite is written and waiting in the CMS as a draft; publishing them needs the founder's approval, see below

- [x] Each major section opens with a self-contained 30–60 word answer
- [x] Applied across the Home and Product sections the handoff names, and across every FAQ answer
- [x] Comparison content added where it is weakest: Rabaed against WhatsApp, email and spreadsheets — the most-asked question and the biggest current gap
- [ ] Every rewrite is proposed to Ahmed for approval before publishing; the words are his
- [x] **No figure, percentage, client count or testimonial is invented.** Claims are added only when supplied and attributable
- [x] Changes are made through the CMS, not in code

## Comments

**Built on 21 September 2026.** The one box left unticked is the founder's, and it is a gate rather than a note: every word of this is in the CMS as an **unpublished draft**, so no visitor, search engine or AI assistant can reach any of it until he opens each piece, reads it and presses Publish. `docs/deployment.md` has what he does, in plain language, under «The answer-first copy pass, waiting for a decision».

**The four sections are the four the handoff names.** HANDOFF §6.4 states the rule — «أول جملة تحت كل `h2` يجب أن تكون جواباً مستقلاً قابلاً للاقتباس (30–60 كلمة)» — and names where to apply it: `#jt` and `#record` on the home page, `#roles` and `#inner` on the product page, «وكل أقسام الأسئلة الشائعة». It also says who the words belong to: «هذا تعديل نصّي لا يمسّ التصميم — راجعه مع أحمد، النصّ نصّه».

- **Two of the four had no paragraph at all.** The Reference site opens `#jt` and `#roles` straight on their tabs. Each now has a field for one, **optional and empty**, so the page is drawn exactly as the baselines have it until a paragraph is published — which is how the ticket's «without changing … how it looks» and the handoff's «apply it to `#jt`» are both kept. `home-text.spec.ts` and `product-text.spec.ts` each check both halves: nothing under the heading today, and the paragraph drawn between the heading and the tabs once one is written.
- **The other two were already 30–60 words and still could not be quoted.** «ليست ميزة تُفعَّل — بل نتيجة كل خطوة» is not an answer without the heading above it, because nothing in it says what «it» is. Both now name their subject and otherwise say exactly what they said.

**The rule is the CMS's now, not a note in a ticket.** `src/cms/answer-first.ts` holds it once — 30 to 60 words, counted between the spaces — and both places that need it use it: the opening paragraph of those four sections (`openingAnswerField`) and an article's or a case study's opening answer, which had its own copy of the same range since ticket 23. An Editor who shortens one of the four to a line is refused, in Arabic, with the count. The two page-text suites own those refusals, as they own those entries.

**The 31 answers are rewritten to stand alone, and not one is padded.** An FAQ answer is quoted without its question, so «لا.» and «نعم.» and «أيام لا شهور.» say nothing once lifted, and «الاشتراك سنوي لكل مشروع» does not say whose. Each now names its own subject in its first clause and then says what it said. The founder chose this over making all 31 a uniform 30–60 words: HANDOFF §6.9 warns against filling an answer out, and six were already that long without it. The suite holds the shape rather than the words — no rewrite may open on a bare «لا.» or «نعم.», where several of the published answers do.

**The comparison gap is closed where a buyer asks it.** HANDOFF §6.5 breaks a buyer's question into seven kinds and finds one missing — «فئة «المقارنة» هي الأضعف حالياً وهي الأكثر طلباً في محركات التوليد». Ticket 38 answered it once, as a launch article; five new questions answer it in the FAQs: the three tools together, on both the home page's short list and the start page's full one, and then WhatsApp, the email and the spreadsheet each on their own. Every line of every answer comes from the home page's own «قبل وبعد ربائد» and «مواقف من الميدان», which already compare exactly these three step by step.

**Nothing invented, and the suite says so.** Every claim is one the site already makes. None of the four proof figures nobody can source (ticket 47) appears in any proposed word, which `answer-first-copy.spec.ts` asserts across the openers, the rewrites and the new questions — the same check ticket 38 put on the launch articles, for the same reason: these paragraphs are exactly what an assistant lifts a number out of.

**The migration writes SQL, and writes it differently from the nine before it.** Ticket 63's rule holds: no `payload.updateGlobal`, no `payload.create`, and `tests/unit/data-migrations.spec.ts` covers this one like the rest. But `npm run cms:freeze-seed` could not produce it, and says so itself — it refuses a migration that adds rows to a table an earlier import already filled, which is exactly what proposing a change to imported content does. So `answer-first-proposal/seed.ts` writes the statements, to the same rule and with two differences the tool has no need of:

- **No row is found by an id.** The nine imports ran into empty tables and could use the ids of their moment. This one runs after an Editor may have added or removed a question, so a question is found by its page and its words, and a new one lets the sequence give it an id.
- **A page's entry is copied rather than listed.** A draft of the home page is its published version and every row of every list inside it — 26 tables — with two paragraphs changed. Naming 157 columns would be the one place the frozen rule bites back: a column added later and missed would propose an entry with a field wiped. So the copy reads the columns the table actually has, which is right on every schema it will ever meet.

Every statement is guarded, **per paragraph rather than per page**: each carries the words it expects to find published, so a section the founder has already rewritten costs that section's proposal and no other's — the units are still offered their opener even where the Record's has been replaced. A question is left alone unless its published answer is still ticket 22's with nothing of its own already waiting. Running the whole seed twice changes nothing, and `down` puts a database back exactly as it found it — both checked by running them.

**What the suite caught, and it was not one of these tests.** The four new questions go at the end of their list on a key derived from the last one — and the first version of that derivation appended a `0`. `_order` is a fractional index, and Payload refuses a key whose fraction ends in the lowest digit; worse, it refuses it while *reading* the last key to make the next one, so those four rows stopped an Editor adding any question at all, anywhere, with «Something went wrong». Three tests in `faqs.spec.ts` went red and none of them is about this ticket. The digit is a `1` now, and `answer-first-copy.spec.ts` names the rule so the symptom is not the only thing watching for it.

**Two of the four sections cannot have an opening answer without changing how they look, and that is now written down.** The ticket asks for the copy pass «without changing … how it looks», and HANDOFF §6.4 says «لا يمسّ التصميم» — but the same sentence names `#jt` and `#roles`, which have no paragraph under their heading to change. Both cannot be had. **ADR-0011** records the decision: a paragraph may appear there, set in `.lead` and bringing no design with it, as ADR-0002's caption already does. Its consequence is recorded too — published, those two sections no longer match the Reference site, and the comparison suites will not say so, because they run against the test server's own database where the paragraph is an unpublished draft. Nothing breaks; the divergence is simply unpoliced, which is the reason to write it down rather than the reason not to do it.

**One catch worth knowing, and it is Payload's.** A page's entry holds one draft at a time. Publishing anything else on the home or product page before reading the proposal moves it into **Versions** rather than losing it, but it is no longer what the entry opens on. `docs/deployment.md` says so where the founder will read it, and `answer-first-copy.spec.ts` looks for each proposal among the entry's versions rather than as the latest one — which is also what makes it safe to run beside the two suites that edit those entries all the while.

**Nothing for the founder before merging** beyond the usual: a separate preview database needs `npm run cms:migrate` against it, as `docs/deployment.md` says, before this pull request's preview can build.
