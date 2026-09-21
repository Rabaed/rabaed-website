/**
 * What `20260915_200328_import_referral_page` wrote, as the
 * statements that wrote it (ticket 63).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const REFERRAL_PAGE_SEED = `
INSERT INTO "_referral_page_v" ("id", "version_hero_eyebrow_ar", "version_hero_eyebrow_en", "version_hero_title_ar", "version_hero_title_en", "version_hero_lead_ar", "version_hero_lead_en", "version_hero_primary_label_ar", "version_hero_primary_label_en", "version_hero_secondary_label_ar", "version_hero_secondary_label_en", "version_how_it_works_eyebrow_ar", "version_how_it_works_eyebrow_en", "version_how_it_works_heading_ar", "version_how_it_works_heading_en", "version_offer_shows", "version_offer_eyebrow_ar", "version_offer_eyebrow_en", "version_offer_heading_ar", "version_offer_heading_en", "version_audience_shows", "version_audience_eyebrow_ar", "version_audience_eyebrow_en", "version_audience_heading_ar", "version_audience_heading_en", "version_audience_lead_ar", "version_audience_lead_en", "version_audience_partnership_text_ar", "version_audience_partnership_text_en", "version_audience_partnership_bold_ar", "version_audience_partnership_bold_en", "version_audience_partnership_after_ar", "version_audience_partnership_after_en", "version_audience_partnership_link_label_ar", "version_audience_partnership_link_label_en", "version_what_is_referred_shows", "version_what_is_referred_eyebrow_ar", "version_what_is_referred_eyebrow_en", "version_what_is_referred_heading_ar", "version_what_is_referred_heading_en", "version_what_is_referred_link_label_ar", "version_what_is_referred_link_label_en", "version_terms_summary_shows", "version_terms_summary_eyebrow_ar", "version_terms_summary_eyebrow_en", "version_terms_summary_heading_ar", "version_terms_summary_heading_en", "version_terms_summary_link_label_ar", "version_terms_summary_link_label_en", "version_questions_shows", "version_questions_eyebrow_ar", "version_questions_eyebrow_en", "version_questions_heading_ar", "version_questions_heading_en", "version_signup_eyebrow_ar", "version_signup_eyebrow_en", "version_signup_heading_ar", "version_signup_heading_en", "version_signup_lead_ar", "version_signup_lead_en", "version_signup_guarantee_figure_ar", "version_signup_guarantee_figure_en", "version_signup_guarantee_text_ar", "version_signup_guarantee_text_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'برنامج الإحالة', NULL, 'أحِل مشروعاً واحداً. اكسب {payout} ريال.', NULL, 'تعرف مطوّراً يدير مشروعه على الإيميل والواتساب؟ شارك كودك، واحصل على {payout} ريال عن كل مشروع يبدأ معنا — ويحصل هو على خصم على اشتراكه.', NULL, 'سجّل واحصل على كودك', NULL, 'كيف يعمل البرنامج ↓', NULL, 'كيف يعمل', NULL, 'أربع خطوات، وينتهي دورك بعد الثانية', NULL, 'true', 'المبلغ والخصم', NULL, 'مبلغ ثابت. بلا شرائح، بلا حسابات.', NULL, 'true', 'لمن هذا البرنامج', NULL, 'إذا كنت داخل قطاع البناء، فأنت تعرف على الأرجح مطوّراً يحتاجنا', NULL, 'البرنامج مفتوح لكل من يعمل في محيط مشاريع التطوير العقاري في السعودية:', NULL, 'إن كنت', NULL, 'مكتباً هندسياً أو شركة إدارة مشاريع', NULL, 'وتريد ترتيباً أوسع من الإحالة الفردية، فبرنامج الشراكات هو الأنسب لك.', NULL, 'انتقل إلى برنامج الشراكات ←', NULL, 'true', 'ما الذي تُحيله', NULL, 'ما الذي تُحيله بالضبط؟', NULL, 'تعرّف على المنصة', NULL, 'true', 'الشروط باختصار', NULL, 'الشروط في ثماني نقاط', NULL, 'الشروط والأحكام الكاملة', NULL, 'true', 'الأسئلة الشائعة', NULL, 'قبل أن تسجّل', NULL, 'التسجيل', NULL, 'كودك جاهز خلال دقيقة', NULL, 'سجّل الآن، وشارك الكود مع أول مطوّر يخطر ببالك.', NULL, '7 أيام عمل', NULL, 'مدة الصرف من نهاية شهر الاستحقاق', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_referral_page_v"', 'id'), (SELECT max("id") FROM "_referral_page_v"));

INSERT INTO "_referral_program_v" ("id", "version_payout_riyals", "version_client_discount_percent", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', '2000', '10', 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_referral_program_v"', 'id'), (SELECT max("id") FROM "_referral_program_v"));

INSERT INTO "referral_page" ("id", "hero_eyebrow_ar", "hero_eyebrow_en", "hero_title_ar", "hero_title_en", "hero_lead_ar", "hero_lead_en", "hero_primary_label_ar", "hero_primary_label_en", "hero_secondary_label_ar", "hero_secondary_label_en", "how_it_works_eyebrow_ar", "how_it_works_eyebrow_en", "how_it_works_heading_ar", "how_it_works_heading_en", "offer_shows", "offer_eyebrow_ar", "offer_eyebrow_en", "offer_heading_ar", "offer_heading_en", "audience_shows", "audience_eyebrow_ar", "audience_eyebrow_en", "audience_heading_ar", "audience_heading_en", "audience_lead_ar", "audience_lead_en", "audience_partnership_text_ar", "audience_partnership_text_en", "audience_partnership_bold_ar", "audience_partnership_bold_en", "audience_partnership_after_ar", "audience_partnership_after_en", "audience_partnership_link_label_ar", "audience_partnership_link_label_en", "what_is_referred_shows", "what_is_referred_eyebrow_ar", "what_is_referred_eyebrow_en", "what_is_referred_heading_ar", "what_is_referred_heading_en", "what_is_referred_link_label_ar", "what_is_referred_link_label_en", "terms_summary_shows", "terms_summary_eyebrow_ar", "terms_summary_eyebrow_en", "terms_summary_heading_ar", "terms_summary_heading_en", "terms_summary_link_label_ar", "terms_summary_link_label_en", "questions_shows", "questions_eyebrow_ar", "questions_eyebrow_en", "questions_heading_ar", "questions_heading_en", "signup_eyebrow_ar", "signup_eyebrow_en", "signup_heading_ar", "signup_heading_en", "signup_lead_ar", "signup_lead_en", "signup_guarantee_figure_ar", "signup_guarantee_figure_en", "signup_guarantee_text_ar", "signup_guarantee_text_en", "_status", "updated_at", "created_at")
VALUES ('1', 'برنامج الإحالة', NULL, 'أحِل مشروعاً واحداً. اكسب {payout} ريال.', NULL, 'تعرف مطوّراً يدير مشروعه على الإيميل والواتساب؟ شارك كودك، واحصل على {payout} ريال عن كل مشروع يبدأ معنا — ويحصل هو على خصم على اشتراكه.', NULL, 'سجّل واحصل على كودك', NULL, 'كيف يعمل البرنامج ↓', NULL, 'كيف يعمل', NULL, 'أربع خطوات، وينتهي دورك بعد الثانية', NULL, 'true', 'المبلغ والخصم', NULL, 'مبلغ ثابت. بلا شرائح، بلا حسابات.', NULL, 'true', 'لمن هذا البرنامج', NULL, 'إذا كنت داخل قطاع البناء، فأنت تعرف على الأرجح مطوّراً يحتاجنا', NULL, 'البرنامج مفتوح لكل من يعمل في محيط مشاريع التطوير العقاري في السعودية:', NULL, 'إن كنت', NULL, 'مكتباً هندسياً أو شركة إدارة مشاريع', NULL, 'وتريد ترتيباً أوسع من الإحالة الفردية، فبرنامج الشراكات هو الأنسب لك.', NULL, 'انتقل إلى برنامج الشراكات ←', NULL, 'true', 'ما الذي تُحيله', NULL, 'ما الذي تُحيله بالضبط؟', NULL, 'تعرّف على المنصة', NULL, 'true', 'الشروط باختصار', NULL, 'الشروط في ثماني نقاط', NULL, 'الشروط والأحكام الكاملة', NULL, 'true', 'الأسئلة الشائعة', NULL, 'قبل أن تسجّل', NULL, 'التسجيل', NULL, 'كودك جاهز خلال دقيقة', NULL, 'سجّل الآن، وشارك الكود مع أول مطوّر يخطر ببالك.', NULL, '7 أيام عمل', NULL, 'مدة الصرف من نهاية شهر الاستحقاق', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"referral_page"', 'id'), (SELECT max("id") FROM "referral_page"));

INSERT INTO "referral_program" ("id", "payout_riyals", "client_discount_percent", "_status", "updated_at", "created_at")
VALUES ('1', '2000', '10', 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"referral_program"', 'id'), (SELECT max("id") FROM "referral_program"));

INSERT INTO "_referral_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'مهندسون ومديرو مشاريع', NULL, 'تعرف من قرب كيف تضيع المراسلات والاعتمادات.', NULL, '6ab0c5af653728afc0fbe8de');

INSERT INTO "_referral_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'استشاريون مستقلون', NULL, 'تنتقل بين مشاريع ومطوّرين مختلفين.', NULL, '6ab0c5af653728afc0fbe8df');

INSERT INTO "_referral_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'مقاولون ومكاتب تنفيذ', NULL, 'تعمل مع أكثر من مالك في وقت واحد.', NULL, '6ab0c5af653728afc0fbe8e0');

INSERT INTO "_referral_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('4', '1', '4', 'مستشارو تطوير عقاري ووسطاء', NULL, 'علاقتك بالمطوّرين هي أصلك الحقيقي.', NULL, '6ab0c5af653728afc0fbe8e1');

INSERT INTO "_referral_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('5', '1', '5', 'صنّاع محتوى متخصصون', NULL, 'جمهورك من أهل القطاع.', NULL, '6ab0c5af653728afc0fbe8e2');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_audience_kinds"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_audience_kinds"));

INSERT INTO "_referral_page_v_version_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en", "_uuid")
VALUES ('1', '1', '1', '{payout} ريال', NULL, 'عن كل مشروع', NULL, '6ab0c5af653728afc0fbe8d3');

INSERT INTO "_referral_page_v_version_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en", "_uuid")
VALUES ('2', '1', '2', '{clientDiscount}', NULL, 'خصم لعميلك', NULL, '6ab0c5af653728afc0fbe8d4');

INSERT INTO "_referral_page_v_version_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en", "_uuid")
VALUES ('3', '1', '3', 'بلا حد', NULL, 'عدد المشاريع', NULL, '6ab0c5af653728afc0fbe8d5');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_hero_figures"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_hero_figures"));

INSERT INTO "_referral_page_v_version_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('1', '1', '1', 'سجّل', NULL, 'دقيقة واحدة', NULL, 'املأ نموذجاً من دقيقة واحدة، ويصلك كودك الخاص فوراً على جوالك وبريدك.', NULL, 'false', '6ab0c5af653728afc0fbe8d6');

INSERT INTO "_referral_page_v_version_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('2', '1', '2', 'شارك الكود', NULL, 'مع صاحب القرار', NULL, 'الكود يمنحه خصم {clientDiscount} على اشتراك مشروعه — فهو سبب حقيقي ليستخدمه، لا مجرد معرّف لك.', NULL, 'false', '6ab0c5af653728afc0fbe8d7');

INSERT INTO "_referral_page_v_version_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('3', '1', '3', 'نتولّى الباقي', NULL, 'لا متابعة ولا بيع', NULL, 'يطلب العرض التوضيحي ويُدخل الكود. فريقنا يتواصل معه، ويعرض المنصة، ويتفق على التفاصيل.', NULL, 'false', '6ab0c5af653728afc0fbe8d8');

INSERT INTO "_referral_page_v_version_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('4', '1', '4', 'استلم مستحقاتك', NULL, 'خلال 7 أيام عمل', NULL, 'عند تحصيل قيمة الاشتراك، تُحوَّل {payout} ريال على حسابك خلال 7 أيام عمل من نهاية ذلك الشهر.', NULL, 'true', '6ab0c5af653728afc0fbe8d9');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_how_it_works_steps"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_how_it_works_steps"));

INSERT INTO "_referral_page_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_languages"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_languages"));

INSERT INTO "_referral_page_v_version_offer_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en", "bold_ar", "bold_en", "after_ar", "after_en", "_uuid")
VALUES ('1', '1', '1', 'اخترنا مبلغاً ثابتاً معلوماً بدل النسب المتغيّرة:', NULL, '{payout} ريال صافية عن كل مشروع', NULL, 'يبدأ اشتراكه بكودك — سواء كان مشروعاً من عشرة آلاف متر أو ثلاثين ألفاً. تعرف ما ستستلمه قبل أن تُحيل، ولا تحتاج أن تسأل عن قيمة الاشتراك.', NULL, '6ab0c5af653728afc0fbe8da');

INSERT INTO "_referral_page_v_version_offer_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en", "bold_ar", "bold_en", "after_ar", "after_en", "_uuid")
VALUES ('2', '1', '2', 'ولا يوجد حد أقصى لعدد المشاريع التي تُحيلها في السنة.', NULL, '', NULL, '', NULL, '6ab0c5af653728afc0fbe8db');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_offer_paragraphs"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_offer_paragraphs"));

INSERT INTO "_referral_page_v_version_offer_sides" ("_order", "_parent_id", "id", "badge_ar", "badge_en", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'لك', NULL, '{payout} ريال صافية', NULL, 'عن كل مشروع، تُحوَّل على حسابك البنكي مباشرة.', NULL, '6ab0c5af653728afc0fbe8dc');

INSERT INTO "_referral_page_v_version_offer_sides" ("_order", "_parent_id", "id", "badge_ar", "badge_en", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'لعميلك', NULL, 'خصم {clientDiscount}', NULL, 'على اشتراك المشروع، بمجرّد استخدام كودك.', NULL, '6ab0c5af653728afc0fbe8dd');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_offer_sides"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_offer_sides"));

INSERT INTO "_referral_page_v_version_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'يصلك الكود فوراً على جوالك وبريدك', NULL, '6ab0c5af653728afc0fbe8ed');

INSERT INTO "_referral_page_v_version_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'لا رسوم انضمام، ولا التزام بعدد إحالات', NULL, '6ab0c5af653728afc0fbe8ee');

INSERT INTO "_referral_page_v_version_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'دورك ينتهي عند مشاركة الكود', NULL, '6ab0c5af653728afc0fbe8ef');

INSERT INTO "_referral_page_v_version_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('4', '1', '4', '{payout} ريال صافية عن كل مشروع، بلا حد أقصى', NULL, '6ab0c5af653728afc0fbe8f0');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_signup_benefits"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_signup_benefits"));

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('1', '1', '1', 'الإحالة بالمشروع لا بالعميل.', NULL, 'تُحتسب عن كل مشروع جديد يبدأ اشتراكه بكودك.', NULL, '6ab0c5af653728afc0fbe8e5');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('2', '1', '2', 'يُقدَّم الكود عند طلب العرض التوضيحي', NULL, '، أي قبل بدء التفاوض — لا عند التوقيع.', NULL, '6ab0c5af653728afc0fbe8e6');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('3', '1', '3', 'لا يُقبل الكود لعميل قائم', NULL, 'أو لمشروع سبق أن تواصلنا بشأنه مع المالك.', NULL, '6ab0c5af653728afc0fbe8e7');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('4', '1', '4', 'الاشتراك السنوي المدفوع مقدماً', NULL, 'هو ما يُحتسب عليه المبلغ.', NULL, '6ab0c5af653728afc0fbe8e8');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('5', '1', '5', 'الاستحقاق عند تحصيل قيمة الاشتراك', NULL, '، لا عند التوقيع.', NULL, '6ab0c5af653728afc0fbe8e9');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('6', '1', '6', 'الصرف خلال 7 أيام عمل', NULL, 'من نهاية الشهر الذي تحقق فيه الاستحقاق، على الآيبان المسجّل.', NULL, '6ab0c5af653728afc0fbe8ea');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('7', '1', '7', 'الإلغاء والاسترداد', NULL, 'خلال فترة الاسترداد النظامية يُلغي المبلغ أو يُخصم من مستحقات لاحقة.', NULL, '6ab0c5af653728afc0fbe8eb');

INSERT INTO "_referral_page_v_version_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en", "_uuid")
VALUES ('8', '1', '8', 'إقرار عدم التعارض', NULL, 'يُوقَّع إلكترونياً عند التسجيل.', NULL, '6ab0c5af653728afc0fbe8ec');

SELECT setval(pg_get_serial_sequence('"_referral_page_v_version_terms_summary_points"', 'id'), (SELECT max("id") FROM "_referral_page_v_version_terms_summary_points"));

INSERT INTO "_referral_page_what_paragraphs_v" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'ربائد منصّة تجمع المالك والاستشاري والمقاول على سجل واحد للمشروع: المراسلات الرسمية ومحاضر الاجتماعات وطلبات المعلومات، والاعتمادات وطلبات الفحص والتفتيش، والتقرير اليومي للموقع، ومستودع مستندات بأحدث نسخة معتمدة.', NULL, '6ab0c5af653728afc0fbe8e3');

INSERT INTO "_referral_page_what_paragraphs_v" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'كل مستند يحمل معه متى أُرسل، ومن اعتمده، وبأي ملاحظة، ومتى — فيبقى سجل المشروع كاملاً بعد تسليمه، لا مبعثراً بين بريد وواتساب ومجلدات مشتركة انتهت صلاحيتها.', NULL, '6ab0c5af653728afc0fbe8e4');

SELECT setval(pg_get_serial_sequence('"_referral_page_what_paragraphs_v"', 'id'), (SELECT max("id") FROM "_referral_page_what_paragraphs_v"));

INSERT INTO "referral_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8de', 'مهندسون ومديرو مشاريع', NULL, 'تعرف من قرب كيف تضيع المراسلات والاعتمادات.', NULL);

INSERT INTO "referral_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8df', 'استشاريون مستقلون', NULL, 'تنتقل بين مشاريع ومطوّرين مختلفين.', NULL);

INSERT INTO "referral_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8e0', 'مقاولون ومكاتب تنفيذ', NULL, 'تعمل مع أكثر من مالك في وقت واحد.', NULL);

INSERT INTO "referral_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8e1', 'مستشارو تطوير عقاري ووسطاء', NULL, 'علاقتك بالمطوّرين هي أصلك الحقيقي.', NULL);

INSERT INTO "referral_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('5', '1', '6ab0c5af653728afc0fbe8e2', 'صنّاع محتوى متخصصون', NULL, 'جمهورك من أهل القطاع.', NULL);

INSERT INTO "referral_page_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8d3', '{payout} ريال', NULL, 'عن كل مشروع', NULL);

INSERT INTO "referral_page_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8d4', '{clientDiscount}', NULL, 'خصم لعميلك', NULL);

INSERT INTO "referral_page_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8d5', 'بلا حد', NULL, 'عدد المشاريع', NULL);

INSERT INTO "referral_page_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8d6', 'سجّل', NULL, 'دقيقة واحدة', NULL, 'املأ نموذجاً من دقيقة واحدة، ويصلك كودك الخاص فوراً على جوالك وبريدك.', NULL, 'false');

INSERT INTO "referral_page_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8d7', 'شارك الكود', NULL, 'مع صاحب القرار', NULL, 'الكود يمنحه خصم {clientDiscount} على اشتراك مشروعه — فهو سبب حقيقي ليستخدمه، لا مجرد معرّف لك.', NULL, 'false');

INSERT INTO "referral_page_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8d8', 'نتولّى الباقي', NULL, 'لا متابعة ولا بيع', NULL, 'يطلب العرض التوضيحي ويُدخل الكود. فريقنا يتواصل معه، ويعرض المنصة، ويتفق على التفاصيل.', NULL, 'false');

INSERT INTO "referral_page_how_it_works_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8d9', 'استلم مستحقاتك', NULL, 'خلال 7 أيام عمل', NULL, 'عند تحصيل قيمة الاشتراك، تُحوَّل {payout} ريال على حسابك خلال 7 أيام عمل من نهاية ذلك الشهر.', NULL, 'true');

INSERT INTO "referral_page_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"referral_page_languages"', 'id'), (SELECT max("id") FROM "referral_page_languages"));

INSERT INTO "referral_page_offer_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en", "bold_ar", "bold_en", "after_ar", "after_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8da', 'اخترنا مبلغاً ثابتاً معلوماً بدل النسب المتغيّرة:', NULL, '{payout} ريال صافية عن كل مشروع', NULL, 'يبدأ اشتراكه بكودك — سواء كان مشروعاً من عشرة آلاف متر أو ثلاثين ألفاً. تعرف ما ستستلمه قبل أن تُحيل، ولا تحتاج أن تسأل عن قيمة الاشتراك.', NULL);

INSERT INTO "referral_page_offer_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en", "bold_ar", "bold_en", "after_ar", "after_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8db', 'ولا يوجد حد أقصى لعدد المشاريع التي تُحيلها في السنة.', NULL, '', NULL, '', NULL);

INSERT INTO "referral_page_offer_sides" ("_order", "_parent_id", "id", "badge_ar", "badge_en", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8dc', 'لك', NULL, '{payout} ريال صافية', NULL, 'عن كل مشروع، تُحوَّل على حسابك البنكي مباشرة.', NULL);

INSERT INTO "referral_page_offer_sides" ("_order", "_parent_id", "id", "badge_ar", "badge_en", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8dd', 'لعميلك', NULL, 'خصم {clientDiscount}', NULL, 'على اشتراك المشروع، بمجرّد استخدام كودك.', NULL);

INSERT INTO "referral_page_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8ed', 'يصلك الكود فوراً على جوالك وبريدك', NULL);

INSERT INTO "referral_page_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8ee', 'لا رسوم انضمام، ولا التزام بعدد إحالات', NULL);

INSERT INTO "referral_page_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8ef', 'دورك ينتهي عند مشاركة الكود', NULL);

INSERT INTO "referral_page_signup_benefits" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8f0', '{payout} ريال صافية عن كل مشروع، بلا حد أقصى', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8e5', 'الإحالة بالمشروع لا بالعميل.', NULL, 'تُحتسب عن كل مشروع جديد يبدأ اشتراكه بكودك.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8e6', 'يُقدَّم الكود عند طلب العرض التوضيحي', NULL, '، أي قبل بدء التفاوض — لا عند التوقيع.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8e7', 'لا يُقبل الكود لعميل قائم', NULL, 'أو لمشروع سبق أن تواصلنا بشأنه مع المالك.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8e8', 'الاشتراك السنوي المدفوع مقدماً', NULL, 'هو ما يُحتسب عليه المبلغ.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('5', '1', '6ab0c5af653728afc0fbe8e9', 'الاستحقاق عند تحصيل قيمة الاشتراك', NULL, '، لا عند التوقيع.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('6', '1', '6ab0c5af653728afc0fbe8ea', 'الصرف خلال 7 أيام عمل', NULL, 'من نهاية الشهر الذي تحقق فيه الاستحقاق، على الآيبان المسجّل.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('7', '1', '6ab0c5af653728afc0fbe8eb', 'الإلغاء والاسترداد', NULL, 'خلال فترة الاسترداد النظامية يُلغي المبلغ أو يُخصم من مستحقات لاحقة.', NULL);

INSERT INTO "referral_page_terms_summary_points" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "rest_ar", "rest_en")
VALUES ('8', '1', '6ab0c5af653728afc0fbe8ec', 'إقرار عدم التعارض', NULL, 'يُوقَّع إلكترونياً عند التسجيل.', NULL);

INSERT INTO "referral_page_what_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8e3', 'ربائد منصّة تجمع المالك والاستشاري والمقاول على سجل واحد للمشروع: المراسلات الرسمية ومحاضر الاجتماعات وطلبات المعلومات، والاعتمادات وطلبات الفحص والتفتيش، والتقرير اليومي للموقع، ومستودع مستندات بأحدث نسخة معتمدة.', NULL);

INSERT INTO "referral_page_what_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8e4', 'كل مستند يحمل معه متى أُرسل، ومن اعتمده، وبأي ملاحظة، ومتى — فيبقى سجل المشروع كاملاً بعد تسليمه، لا مبعثراً بين بريد وواتساب ومجلدات مشتركة انتهت صلاحيتها.', NULL);
`;
