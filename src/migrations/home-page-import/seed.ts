/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260915_211212_import_home_page` (ticket 63).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const HOME_PAGE_SEED = `
INSERT INTO "_home_page_v" ("id", "version_hero_eyebrow_ar", "version_hero_eyebrow_en", "version_hero_title_accent_ar", "version_hero_title_accent_en", "version_hero_lead_ar", "version_hero_lead_en", "version_hero_primary_label_ar", "version_hero_primary_label_en", "version_hero_secondary_label_ar", "version_hero_secondary_label_en", "version_hero_trust_ar", "version_hero_trust_en", "version_hero_guarantee_period_ar", "version_hero_guarantee_period_en", "version_hero_guarantee_promise_ar", "version_hero_guarantee_promise_en", "version_hero_parties_owner_ar", "version_hero_parties_owner_en", "version_hero_parties_consultant_ar", "version_hero_parties_consultant_en", "version_hero_parties_contractor_ar", "version_hero_parties_contractor_en", "version_hero_diagram_description_ar", "version_hero_diagram_description_en", "version_hero_status_at_rest_ar", "version_hero_status_at_rest_en", "version_hero_pictures_owner_id", "version_hero_pictures_consultant_id", "version_hero_pictures_contractor_id", "version_hero_pictures_document_id", "version_trust_strip_shows", "version_situations_shows", "version_situations_eyebrow_ar", "version_situations_eyebrow_en", "version_situations_heading_ar", "version_situations_heading_en", "version_situations_close_first_ar", "version_situations_close_first_en", "version_situations_close_second_ar", "version_situations_close_second_en", "version_situations_close_accent_ar", "version_situations_close_accent_en", "version_situations_cost_label_ar", "version_situations_cost_label_en", "version_situations_deck_label_ar", "version_situations_deck_label_en", "version_situations_deck_previous_label_ar", "version_situations_deck_previous_label_en", "version_situations_deck_next_label_ar", "version_situations_deck_next_label_en", "version_situations_deck_hint_ar", "version_situations_deck_hint_en", "version_four_units_shows", "version_four_units_eyebrow_ar", "version_four_units_eyebrow_en", "version_four_units_heading_ar", "version_four_units_heading_en", "version_four_units_tabs_label_ar", "version_four_units_tabs_label_en", "version_four_units_output_label_ar", "version_four_units_output_label_en", "version_four_units_more_label_ar", "version_four_units_more_label_en", "version_record_shows", "version_record_eyebrow_ar", "version_record_eyebrow_en", "version_record_lead_ar", "version_record_lead_en", "version_record_stamp_ar", "version_record_stamp_en", "version_before_after_shows", "version_before_after_eyebrow_ar", "version_before_after_eyebrow_en", "version_before_after_heading_ar", "version_before_after_heading_en", "version_before_after_lead_ar", "version_before_after_lead_en", "version_before_after_usual_tag_ar", "version_before_after_usual_tag_en", "version_before_after_rabaed_tag_ar", "version_before_after_rabaed_tag_en", "version_before_after_handle_label_ar", "version_before_after_handle_label_en", "version_before_after_verdicts_usual_ar", "version_before_after_verdicts_usual_en", "version_before_after_verdicts_rabaed_ar", "version_before_after_verdicts_rabaed_en", "version_before_after_verdicts_between_ar", "version_before_after_verdicts_between_en", "version_calculator_shows", "version_calculator_eyebrow_ar", "version_calculator_eyebrow_en", "version_calculator_heading_ar", "version_calculator_heading_en", "version_calculator_lead_ar", "version_calculator_lead_en", "version_calculator_slider_labels_project_value_ar", "version_calculator_slider_labels_project_value_en", "version_calculator_slider_labels_delay_days_ar", "version_calculator_slider_labels_delay_days_en", "version_calculator_slider_labels_duration_months_ar", "version_calculator_slider_labels_duration_months_en", "version_calculator_result_label_ar", "version_calculator_result_label_en", "version_calculator_breakdown_financing_ar", "version_calculator_breakdown_financing_en", "version_calculator_breakdown_site_overhead_ar", "version_calculator_breakdown_site_overhead_en", "version_calculator_assumptions_ar", "version_calculator_assumptions_en", "version_calculator_call_to_action_label_ar", "version_calculator_call_to_action_label_en", "version_calculator_currency_ar", "version_calculator_currency_en", "version_calculator_days_one_ar", "version_calculator_days_one_en", "version_calculator_days_two_ar", "version_calculator_days_two_en", "version_calculator_days_few_ar", "version_calculator_days_few_en", "version_calculator_days_many_ar", "version_calculator_days_many_en", "version_calculator_months_few_ar", "version_calculator_months_few_en", "version_calculator_months_many_ar", "version_calculator_months_many_en", "version_figures_shows", "version_figures_eyebrow_ar", "version_figures_eyebrow_en", "version_figures_heading_ar", "version_figures_heading_en", "version_figures_lead_ar", "version_figures_lead_en", "version_figures_deck_label_ar", "version_figures_deck_label_en", "version_figures_deck_previous_label_ar", "version_figures_deck_previous_label_en", "version_figures_deck_next_label_ar", "version_figures_deck_next_label_en", "version_figures_deck_hint_ar", "version_figures_deck_hint_en", "version_questions_shows", "version_questions_eyebrow_ar", "version_questions_eyebrow_en", "version_questions_heading_ar", "version_questions_heading_en", "version_questions_more_label_ar", "version_questions_more_label_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'نظام تشغيل مشاريع الإنشاء · ربائد', NULL, 'مسؤولية واضحة.', NULL, 'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة باسم من قام بها.', NULL, 'احجز عرضاً حياً', NULL, 'استكشف المنصة ↓', NULL, 'عرض على مشروع حقيقي · 30 دقيقة · بالعربية', NULL, '60 يوماً', NULL, 'ضمان استرجاع كامل المبلغ', NULL, 'المالك', NULL, 'الاستشاري', NULL, 'المقاول', NULL, 'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.', NULL, 'موثّق ومؤرخ', NULL, NULL, NULL, NULL, NULL, 'true', 'true', 'مواقف من الميدان', NULL, 'تعرف هذه المواقف؟', NULL, 'المشكلة ليست البريد الإلكتروني ولا الإكسل.', NULL, 'المشكلة أن الإجراء تحتها', NULL, 'يدوي، ومشتّت.', NULL, 'الثمن', NULL, 'مواقف من الميدان — اسحب البطاقة أو استخدم الأسهم', NULL, 'الموقف السابق', NULL, 'الموقف التالي', NULL, 'اسحب البطاقة يميناً أو يساراً · أو استخدم الأسهم', NULL, 'true', 'المنصة', NULL, 'أربع وحدات. سجل واحد يجمعها.', NULL, 'وحدات ربائد', NULL, 'المخرَج', NULL, 'شاهد الوحدات كاملة بالتفصيل', NULL, 'true', 'السجل الموثّق', NULL, 'ليست ميزة تُفعَّل — بل نتيجة كل خطوة. أي معاملة تمر في ربائد تحمل سجلها كاملاً: خطاب رسمي، اعتماد مادة، طلب تسليم أعمال، تحديث على الجدول الزمني، أو مستخلص مالي. وبعد سنة، أو بعد نهاية المشروع، السجل نفسه ما زال هناك.', NULL, '✓ سجل كامل · 4 خطوات · 3 أطراف', NULL, 'true', 'قبل وبعد ربائد', NULL, 'نفس الاعتماد… بطريقتين.', NULL, 'أربع لحظات في اعتماد مادة واحد. *اسحب المقبض* ليمرّ على الخطوات — كل خطوة تتحول أمامك من الطريقة المعتادة إلى ربائد.', NULL, 'الطريقة المعتادة', NULL, 'مع ربائد', NULL, 'اسحب للمقارنة بين الطريقتين', NULL, 'النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.', NULL, 'النتيجة: لا سؤال "من اعتمد؟" — الإجابة داخل المستند.', NULL, 'اسحب المقبض حتى النهاية لترى الخطوات الأربع في ربائد.', NULL, 'true', 'حاسبة تكلفة التأخير', NULL, 'كم يكلفك أسبوع تأخير اعتماد واحد؟', NULL, 'تقدير محافظ يشمل تكلفة التمويل والتكاليف العامة للموقع فقط — قبل أي مطالبة من المقاول.', NULL, 'قيمة المشروع', NULL, 'أيام التأخير', NULL, 'مدة المشروع', NULL, 'التكلفة التقديرية للتأخير', NULL, 'تمويل', NULL, 'تكاليف عامة للموقع', NULL, 'الافتراضات: تكلفة تمويل 8% سنوياً · تكاليف عامة للموقع 10% من قيمة المشروع موزعة على مدته. لا تشمل مطالبات المقاول ولا الغرامات.', NULL, 'احجز عرضاً لترى كيف نمنعه', NULL, 'ر.س', NULL, 'يوم', NULL, 'يومان', NULL, 'أيام', NULL, 'يوماً', NULL, 'أشهر', NULL, 'شهراً', NULL, 'true', 'الأثر', NULL, 'ماذا يتغيّر بعد التشغيل؟', NULL, 'الفرق بين إجراء يدوي مشتّت وإجراء واحد موثّق — على مشروع يعمل فيه المالك والاستشاري والمقاول على المنصة نفسها.', NULL, 'أرقام الأثر — اسحب البطاقة أو استخدم الأسهم', NULL, 'الرقم السابق', NULL, 'الرقم التالي', NULL, 'اسحب البطاقة يميناً أو يساراً · أو استخدم الأسهم', NULL, 'true', 'الأسئلة الشائعة', NULL, 'قبل أن تسأل', NULL, 'كل الأسئلة', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_home_page_v"', 'id'), (SELECT max("id") FROM "_home_page_v"));

INSERT INTO "home_page" ("id", "hero_eyebrow_ar", "hero_eyebrow_en", "hero_title_accent_ar", "hero_title_accent_en", "hero_lead_ar", "hero_lead_en", "hero_primary_label_ar", "hero_primary_label_en", "hero_secondary_label_ar", "hero_secondary_label_en", "hero_trust_ar", "hero_trust_en", "hero_guarantee_period_ar", "hero_guarantee_period_en", "hero_guarantee_promise_ar", "hero_guarantee_promise_en", "hero_parties_owner_ar", "hero_parties_owner_en", "hero_parties_consultant_ar", "hero_parties_consultant_en", "hero_parties_contractor_ar", "hero_parties_contractor_en", "hero_diagram_description_ar", "hero_diagram_description_en", "hero_status_at_rest_ar", "hero_status_at_rest_en", "hero_pictures_owner_id", "hero_pictures_consultant_id", "hero_pictures_contractor_id", "hero_pictures_document_id", "trust_strip_shows", "situations_shows", "situations_eyebrow_ar", "situations_eyebrow_en", "situations_heading_ar", "situations_heading_en", "situations_close_first_ar", "situations_close_first_en", "situations_close_second_ar", "situations_close_second_en", "situations_close_accent_ar", "situations_close_accent_en", "situations_cost_label_ar", "situations_cost_label_en", "situations_deck_label_ar", "situations_deck_label_en", "situations_deck_previous_label_ar", "situations_deck_previous_label_en", "situations_deck_next_label_ar", "situations_deck_next_label_en", "situations_deck_hint_ar", "situations_deck_hint_en", "four_units_shows", "four_units_eyebrow_ar", "four_units_eyebrow_en", "four_units_heading_ar", "four_units_heading_en", "four_units_tabs_label_ar", "four_units_tabs_label_en", "four_units_output_label_ar", "four_units_output_label_en", "four_units_more_label_ar", "four_units_more_label_en", "record_shows", "record_eyebrow_ar", "record_eyebrow_en", "record_lead_ar", "record_lead_en", "record_stamp_ar", "record_stamp_en", "before_after_shows", "before_after_eyebrow_ar", "before_after_eyebrow_en", "before_after_heading_ar", "before_after_heading_en", "before_after_lead_ar", "before_after_lead_en", "before_after_usual_tag_ar", "before_after_usual_tag_en", "before_after_rabaed_tag_ar", "before_after_rabaed_tag_en", "before_after_handle_label_ar", "before_after_handle_label_en", "before_after_verdicts_usual_ar", "before_after_verdicts_usual_en", "before_after_verdicts_rabaed_ar", "before_after_verdicts_rabaed_en", "before_after_verdicts_between_ar", "before_after_verdicts_between_en", "calculator_shows", "calculator_eyebrow_ar", "calculator_eyebrow_en", "calculator_heading_ar", "calculator_heading_en", "calculator_lead_ar", "calculator_lead_en", "calculator_slider_labels_project_value_ar", "calculator_slider_labels_project_value_en", "calculator_slider_labels_delay_days_ar", "calculator_slider_labels_delay_days_en", "calculator_slider_labels_duration_months_ar", "calculator_slider_labels_duration_months_en", "calculator_result_label_ar", "calculator_result_label_en", "calculator_breakdown_financing_ar", "calculator_breakdown_financing_en", "calculator_breakdown_site_overhead_ar", "calculator_breakdown_site_overhead_en", "calculator_assumptions_ar", "calculator_assumptions_en", "calculator_call_to_action_label_ar", "calculator_call_to_action_label_en", "calculator_currency_ar", "calculator_currency_en", "calculator_days_one_ar", "calculator_days_one_en", "calculator_days_two_ar", "calculator_days_two_en", "calculator_days_few_ar", "calculator_days_few_en", "calculator_days_many_ar", "calculator_days_many_en", "calculator_months_few_ar", "calculator_months_few_en", "calculator_months_many_ar", "calculator_months_many_en", "figures_shows", "figures_eyebrow_ar", "figures_eyebrow_en", "figures_heading_ar", "figures_heading_en", "figures_lead_ar", "figures_lead_en", "figures_deck_label_ar", "figures_deck_label_en", "figures_deck_previous_label_ar", "figures_deck_previous_label_en", "figures_deck_next_label_ar", "figures_deck_next_label_en", "figures_deck_hint_ar", "figures_deck_hint_en", "questions_shows", "questions_eyebrow_ar", "questions_eyebrow_en", "questions_heading_ar", "questions_heading_en", "questions_more_label_ar", "questions_more_label_en", "_status", "updated_at", "created_at")
VALUES ('1', 'نظام تشغيل مشاريع الإنشاء · ربائد', NULL, 'مسؤولية واضحة.', NULL, 'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة باسم من قام بها.', NULL, 'احجز عرضاً حياً', NULL, 'استكشف المنصة ↓', NULL, 'عرض على مشروع حقيقي · 30 دقيقة · بالعربية', NULL, '60 يوماً', NULL, 'ضمان استرجاع كامل المبلغ', NULL, 'المالك', NULL, 'الاستشاري', NULL, 'المقاول', NULL, 'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.', NULL, 'موثّق ومؤرخ', NULL, NULL, NULL, NULL, NULL, 'true', 'true', 'مواقف من الميدان', NULL, 'تعرف هذه المواقف؟', NULL, 'المشكلة ليست البريد الإلكتروني ولا الإكسل.', NULL, 'المشكلة أن الإجراء تحتها', NULL, 'يدوي، ومشتّت.', NULL, 'الثمن', NULL, 'مواقف من الميدان — اسحب البطاقة أو استخدم الأسهم', NULL, 'الموقف السابق', NULL, 'الموقف التالي', NULL, 'اسحب البطاقة يميناً أو يساراً · أو استخدم الأسهم', NULL, 'true', 'المنصة', NULL, 'أربع وحدات. سجل واحد يجمعها.', NULL, 'وحدات ربائد', NULL, 'المخرَج', NULL, 'شاهد الوحدات كاملة بالتفصيل', NULL, 'true', 'السجل الموثّق', NULL, 'ليست ميزة تُفعَّل — بل نتيجة كل خطوة. أي معاملة تمر في ربائد تحمل سجلها كاملاً: خطاب رسمي، اعتماد مادة، طلب تسليم أعمال، تحديث على الجدول الزمني، أو مستخلص مالي. وبعد سنة، أو بعد نهاية المشروع، السجل نفسه ما زال هناك.', NULL, '✓ سجل كامل · 4 خطوات · 3 أطراف', NULL, 'true', 'قبل وبعد ربائد', NULL, 'نفس الاعتماد… بطريقتين.', NULL, 'أربع لحظات في اعتماد مادة واحد. *اسحب المقبض* ليمرّ على الخطوات — كل خطوة تتحول أمامك من الطريقة المعتادة إلى ربائد.', NULL, 'الطريقة المعتادة', NULL, 'مع ربائد', NULL, 'اسحب للمقارنة بين الطريقتين', NULL, 'النتيجة: نزاع بلا مرجع، وكل طرف معه نسخته.', NULL, 'النتيجة: لا سؤال "من اعتمد؟" — الإجابة داخل المستند.', NULL, 'اسحب المقبض حتى النهاية لترى الخطوات الأربع في ربائد.', NULL, 'true', 'حاسبة تكلفة التأخير', NULL, 'كم يكلفك أسبوع تأخير اعتماد واحد؟', NULL, 'تقدير محافظ يشمل تكلفة التمويل والتكاليف العامة للموقع فقط — قبل أي مطالبة من المقاول.', NULL, 'قيمة المشروع', NULL, 'أيام التأخير', NULL, 'مدة المشروع', NULL, 'التكلفة التقديرية للتأخير', NULL, 'تمويل', NULL, 'تكاليف عامة للموقع', NULL, 'الافتراضات: تكلفة تمويل 8% سنوياً · تكاليف عامة للموقع 10% من قيمة المشروع موزعة على مدته. لا تشمل مطالبات المقاول ولا الغرامات.', NULL, 'احجز عرضاً لترى كيف نمنعه', NULL, 'ر.س', NULL, 'يوم', NULL, 'يومان', NULL, 'أيام', NULL, 'يوماً', NULL, 'أشهر', NULL, 'شهراً', NULL, 'true', 'الأثر', NULL, 'ماذا يتغيّر بعد التشغيل؟', NULL, 'الفرق بين إجراء يدوي مشتّت وإجراء واحد موثّق — على مشروع يعمل فيه المالك والاستشاري والمقاول على المنصة نفسها.', NULL, 'أرقام الأثر — اسحب البطاقة أو استخدم الأسهم', NULL, 'الرقم السابق', NULL, 'الرقم التالي', NULL, 'اسحب البطاقة يميناً أو يساراً · أو استخدم الأسهم', NULL, 'true', 'الأسئلة الشائعة', NULL, 'قبل أن تسأل', NULL, 'كل الأسئلة', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"home_page"', 'id'), (SELECT max("id") FROM "home_page"));

INSERT INTO "_home_page_v_blocks_commitment" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "value_ar", "value_en", "basis_ar", "basis_en", "_uuid", "block_name")
VALUES ('5', '1', 'version.figures.figures', '1', 'التفعيل', NULL, 'activation', 'تفعيل ميداني كامل دون توقّف للعمل', NULL, 'أقل من يوم', NULL, 'من أول اجتماع إلى أول معاملة موثّقة', NULL, '6ab0c5b0653728afc0fbe929', NULL);

INSERT INTO "_home_page_v_blocks_commitment" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "value_ar", "value_en", "basis_ar", "basis_en", "_uuid", "block_name")
VALUES ('6', '1', 'version.figures.figures', '2', 'التأهيل', NULL, 'onboarding', 'جلسة تعريفية واحدة لكل فريق', NULL, '15 دقيقة', NULL, 'جلسة واحدة لكل فريق، ثم العمل الفعلي', NULL, '6ab0c5b0653728afc0fbe92a', NULL);

SELECT setval(pg_get_serial_sequence('"_home_page_v_blocks_commitment"', 'id'), (SELECT max("id") FROM "_home_page_v_blocks_commitment"));

INSERT INTO "_home_page_v_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "_uuid", "block_name")
VALUES ('1', '1', 'version.figures.figures', '1', 'دورة الاعتماد', NULL, 'approval', 'أسرع في الاعتمادات والاستلامات', NULL, '3.6×', 'يدوي', NULL, '20', 'ربائد', NULL, '70', 'مقارنةً بالدورة الورقية على المشروع نفسه', NULL, NULL, '6ab0c5b0653728afc0fbe925', NULL);

INSERT INTO "_home_page_v_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "_uuid", "block_name")
VALUES ('2', '1', 'version.figures.figures', '2', 'استرجاع الوثائق', NULL, 'retrieval', 'أسرع في استرجاع الوثائق', NULL, '7×', 'يدوي', NULL, '10', 'ربائد', NULL, '70', 'زمن الوصول إلى آخر نسخة معتمدة', NULL, NULL, '6ab0c5b0653728afc0fbe926', NULL);

INSERT INTO "_home_page_v_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "_uuid", "block_name")
VALUES ('3', '1', 'version.figures.figures', '3', 'الوقت الإداري', NULL, 'time', 'توفير في وقت المهام الإدارية', NULL, '31%', 'قبل', NULL, '70', 'بعد', NULL, '48', 'من ساعات فريق المشروع الأسبوعية', NULL, NULL, '6ab0c5b0653728afc0fbe927', NULL);

INSERT INTO "_home_page_v_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "_uuid", "block_name")
VALUES ('4', '1', 'version.figures.figures', '4', 'حوكمة الوثائق', NULL, 'governance', 'تحسّن في حوكمة الوثائق', NULL, '22%', 'قبل', NULL, '57', 'بعد', NULL, '70', 'اكتمال أثر كل معاملة: من أرسل، من اعتمد، ومتى', NULL, NULL, '6ab0c5b0653728afc0fbe928', NULL);

SELECT setval(pg_get_serial_sequence('"_home_page_v_blocks_comparison"', 'id'), (SELECT max("id") FROM "_home_page_v_blocks_comparison"));

INSERT INTO "_home_page_v_version_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en", "_uuid")
VALUES ('1', '1', '1', 'الطلب', NULL, 'ورق', NULL, 'يُطبع، يُوقَّع باليد، ويُصوَّر بالجوال.', NULL, 'ربائد', NULL, 'طلب اعتماد *SUB-031* برقم مرجعي ومرفقاته.', NULL, '6ab0c5b0653728afc0fbe921');

INSERT INTO "_home_page_v_version_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en", "_uuid")
VALUES ('2', '1', '2', 'الاستلام', NULL, 'واتساب', NULL, '"أرسله إيميل رسمي" — الطلب يصير محادثة.', NULL, 'تلقائي', NULL, 'إشعار استلام *بالاسم والوقت* — لا أحد ينكره.', NULL, '6ab0c5b0653728afc0fbe922');

INSERT INTO "_home_page_v_version_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en", "_uuid")
VALUES ('3', '1', '3', 'الاعتماد', NULL, 'إيميل', NULL, 'رد بعد أسبوع… في ثريد آخر لا أحد يجده.', NULL, 'موثّق', NULL, 'اعتماد بملاحظات، *والمالك يرى الحالة لحظياً*.', NULL, '6ab0c5b0653728afc0fbe923');

INSERT INTO "_home_page_v_version_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en", "_uuid")
VALUES ('4', '1', '4', 'بعد شهرين', NULL, 'إكسل', NULL, '"ما وصلتني الموافقة."
الدليل: لقطة شاشة واتساب.', NULL, 'السجل', NULL, 'يُفتح المستند: أُرسل، استُلم، دُقق، اعتُمد.
*الدليل: السجل نفسه.*', NULL, '6ab0c5b0653728afc0fbe924');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_before_after_steps"', 'id'), (SELECT max("id") FROM "_home_page_v_version_before_after_steps"));

INSERT INTO "_home_page_v_version_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen", "_uuid")
VALUES ('1', '1', '1', 'false', 'المراسلات الرسمية', NULL, 'correspondence', '6ab0c5b0653728afc0fbe8fd');

INSERT INTO "_home_page_v_version_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen", "_uuid")
VALUES ('2', '1', '2', 'false', 'الاعتمادات والطلبات', NULL, 'kanban', '6ab0c5b0653728afc0fbe8fe');

INSERT INTO "_home_page_v_version_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen", "_uuid")
VALUES ('3', '1', '3', 'false', 'التقرير اليومي للموقع', NULL, 'daily-report', '6ab0c5b0653728afc0fbe8ff');

INSERT INTO "_home_page_v_version_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen", "_uuid")
VALUES ('4', '1', '4', 'false', 'المستندات والإصدارات', NULL, 'documents', '6ab0c5b0653728afc0fbe900');

INSERT INTO "_home_page_v_version_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen", "_uuid")
VALUES ('5', '1', '5', 'true', 'السجل الموثّق', NULL, 'stamped-sheet', '6ab0c5b0653728afc0fbe901');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_four_units_tabs"', 'id'), (SELECT max("id") FROM "_home_page_v_version_four_units_tabs"));

INSERT INTO "_home_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('1', '1', '1', 'أُرسل · 07:12', NULL, '6ab0c5b0653728afc0fbe8f3');

INSERT INTO "_home_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('2', '1', '2', 'روجع · 09:20', NULL, '6ab0c5b0653728afc0fbe8f4');

INSERT INTO "_home_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('3', '1', '3', 'اعتُمد · 12:05', NULL, '6ab0c5b0653728afc0fbe8f5');

INSERT INTO "_home_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('4', '1', '4', 'وصل السجل للأطراف الثلاثة', NULL, '6ab0c5b0653728afc0fbe8f6');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_hero_statuses"', 'id'), (SELECT max("id") FROM "_home_page_v_version_hero_statuses"));

INSERT INTO "_home_page_v_version_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en", "_uuid")
VALUES ('1', '1', '1', 'ثلاثة أطراف.', NULL, '6ab0c5b0653728afc0fbe8f1');

INSERT INTO "_home_page_v_version_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en", "_uuid")
VALUES ('2', '1', '2', 'سجل واحد.', NULL, '6ab0c5b0653728afc0fbe8f2');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_hero_title_lines"', 'id'), (SELECT max("id") FROM "_home_page_v_version_hero_title_lines"));

INSERT INTO "_home_page_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_languages"', 'id'), (SELECT max("id") FROM "_home_page_v_version_languages"));

INSERT INTO "_home_page_v_version_record_heading_lines" ("_order", "_parent_id", "id", "line_ar", "line_en", "_uuid")
VALUES ('1', '1', '1', 'لا نسأل "من اعتمد؟"', NULL, '6ab0c5b0653728afc0fbe902');

INSERT INTO "_home_page_v_version_record_heading_lines" ("_order", "_parent_id", "id", "line_ar", "line_en", "_uuid")
VALUES ('2', '1', '2', 'نفتح المعاملة.', NULL, '6ab0c5b0653728afc0fbe903');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_record_heading_lines"', 'id'), (SELECT max("id") FROM "_home_page_v_version_record_heading_lines"));

INSERT INTO "_home_page_v_version_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en", "_uuid")
VALUES ('1', '1', '1', 'من طلب؟', NULL, '6ab0c5b0653728afc0fbe904');

INSERT INTO "_home_page_v_version_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en", "_uuid")
VALUES ('2', '1', '2', 'من استلم؟', NULL, '6ab0c5b0653728afc0fbe905');

INSERT INTO "_home_page_v_version_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en", "_uuid")
VALUES ('3', '1', '3', 'من اعتمد؟', NULL, '6ab0c5b0653728afc0fbe906');

INSERT INTO "_home_page_v_version_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en", "_uuid")
VALUES ('4', '1', '4', 'ومتى؟', NULL, '6ab0c5b0653728afc0fbe907');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_record_questions"', 'id'), (SELECT max("id") FROM "_home_page_v_version_record_questions"));

INSERT INTO "_home_page_v_version_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "_uuid")
VALUES ('1', '1', '1', 'خطاب رسمي', NULL, 'LTR-088 · خطاب — طلب تمديد مدة', NULL, '6ab0c5b0653728afc0fbe90c');

INSERT INTO "_home_page_v_version_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "_uuid")
VALUES ('2', '1', '2', 'اعتماد مادة (MIR)', NULL, 'SUB-031 · اعتماد مادة — بلاط الواجهات', NULL, '6ab0c5b0653728afc0fbe911');

INSERT INTO "_home_page_v_version_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "_uuid")
VALUES ('3', '1', '3', 'طلب تسليم أعمال (WIR)', NULL, 'WIR-0142 · طلب تسليم أعمال — حديد سقف الدور 3', NULL, '6ab0c5b0653728afc0fbe916');

INSERT INTO "_home_page_v_version_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "_uuid")
VALUES ('4', '1', '4', 'تحديث جدول زمني', NULL, 'SCH-04 · تحديث الجدول الزمني — أغسطس', NULL, '6ab0c5b0653728afc0fbe91b');

INSERT INTO "_home_page_v_version_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "_uuid")
VALUES ('5', '1', '5', 'مستخلص مالي (IPC)', NULL, 'IPC-06 · مستخلص مالي — الدفعة السادسة', NULL, '6ab0c5b0653728afc0fbe920');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_record_types"', 'id'), (SELECT max("id") FROM "_home_page_v_version_record_types"));

INSERT INTO "_home_page_v_version_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en", "_uuid")
VALUES ('1', '1', '1', 'المقاول يقول الاستشاري مأخّر الشغل… والاستشاري يقول ما وصله شي.', NULL, 'نزاع بلا مرجع، وكل طرف معه نسخته.', NULL, '6ab0c5b0653728afc0fbe8f7');

INSERT INTO "_home_page_v_version_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en", "_uuid")
VALUES ('2', '1', '2', 'الداشبورد يقرأ من ملف إكسل… والمهندس ما فضي يحدّثه.', NULL, 'قرار مبني على رقم قديم.', NULL, '6ab0c5b0653728afc0fbe8f8');

INSERT INTO "_home_page_v_version_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en", "_uuid")
VALUES ('3', '1', '3', 'ملفين إكسل، تاريخين لنفس المستند… ونرجع للنسخة الورقية نتأكد.', NULL, 'ساعات ضائعة على سؤال واحد: وين وقف الموضوع؟', NULL, '6ab0c5b0653728afc0fbe8f9');

INSERT INTO "_home_page_v_version_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en", "_uuid")
VALUES ('4', '1', '4', 'الاعتماد وصل بالإيميل قبل شهور… وما أحد يلقاه.', NULL, 'اعتماد موجود ولا يمكن إثباته.', NULL, '6ab0c5b0653728afc0fbe8fa');

INSERT INTO "_home_page_v_version_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en", "_uuid")
VALUES ('5', '1', '5', 'الجدول الزمني تحدّث… والمطوّر ما يدري وش أثره على التسليم.', NULL, 'المفاجأة في موعد التسليم، لا في اجتماع المتابعة.', NULL, '6ab0c5b0653728afc0fbe8fb');

INSERT INTO "_home_page_v_version_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en", "_uuid")
VALUES ('6', '1', '6', 'بعد نهاية المشروع احتجنا اعتماداً قديماً… والشيرفولدر مقفولة صلاحياته.', NULL, 'سجل المشروع يضيع مع انتهاء المشروع.', NULL, '6ab0c5b0653728afc0fbe8fc');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_situations_situations"', 'id'), (SELECT max("id") FROM "_home_page_v_version_situations_situations"));

INSERT INTO "home_page_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe921', 'الطلب', NULL, 'ورق', NULL, 'يُطبع، يُوقَّع باليد، ويُصوَّر بالجوال.', NULL, 'ربائد', NULL, 'طلب اعتماد *SUB-031* برقم مرجعي ومرفقاته.', NULL);

INSERT INTO "home_page_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe922', 'الاستلام', NULL, 'واتساب', NULL, '"أرسله إيميل رسمي" — الطلب يصير محادثة.', NULL, 'تلقائي', NULL, 'إشعار استلام *بالاسم والوقت* — لا أحد ينكره.', NULL);

INSERT INTO "home_page_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe923', 'الاعتماد', NULL, 'إيميل', NULL, 'رد بعد أسبوع… في ثريد آخر لا أحد يجده.', NULL, 'موثّق', NULL, 'اعتماد بملاحظات، *والمالك يرى الحالة لحظياً*.', NULL);

INSERT INTO "home_page_before_after_steps" ("_order", "_parent_id", "id", "name_ar", "name_en", "usual_channel_ar", "usual_channel_en", "usual_words_ar", "usual_words_en", "rabaed_channel_ar", "rabaed_channel_en", "rabaed_words_ar", "rabaed_words_en")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe924', 'بعد شهرين', NULL, 'إكسل', NULL, '"ما وصلتني الموافقة."
الدليل: لقطة شاشة واتساب.', NULL, 'السجل', NULL, 'يُفتح المستند: أُرسل، استُلم، دُقق، اعتُمد.
*الدليل: السجل نفسه.*', NULL);

INSERT INTO "home_page_blocks_commitment" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "value_ar", "value_en", "basis_ar", "basis_en", "block_name")
VALUES ('5', '1', 'figures.figures', '6ab0c5b0653728afc0fbe929', 'التفعيل', NULL, 'activation', 'تفعيل ميداني كامل دون توقّف للعمل', NULL, 'أقل من يوم', NULL, 'من أول اجتماع إلى أول معاملة موثّقة', NULL, NULL);

INSERT INTO "home_page_blocks_commitment" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "value_ar", "value_en", "basis_ar", "basis_en", "block_name")
VALUES ('6', '1', 'figures.figures', '6ab0c5b0653728afc0fbe92a', 'التأهيل', NULL, 'onboarding', 'جلسة تعريفية واحدة لكل فريق', NULL, '15 دقيقة', NULL, 'جلسة واحدة لكل فريق، ثم العمل الفعلي', NULL, NULL);

INSERT INTO "home_page_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "block_name")
VALUES ('1', '1', 'figures.figures', '6ab0c5b0653728afc0fbe925', 'دورة الاعتماد', NULL, 'approval', 'أسرع في الاعتمادات والاستلامات', NULL, '3.6×', 'يدوي', NULL, '20', 'ربائد', NULL, '70', 'مقارنةً بالدورة الورقية على المشروع نفسه', NULL, NULL, NULL);

INSERT INTO "home_page_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "block_name")
VALUES ('2', '1', 'figures.figures', '6ab0c5b0653728afc0fbe926', 'استرجاع الوثائق', NULL, 'retrieval', 'أسرع في استرجاع الوثائق', NULL, '7×', 'يدوي', NULL, '10', 'ربائد', NULL, '70', 'زمن الوصول إلى آخر نسخة معتمدة', NULL, NULL, NULL);

INSERT INTO "home_page_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "block_name")
VALUES ('3', '1', 'figures.figures', '6ab0c5b0653728afc0fbe927', 'الوقت الإداري', NULL, 'time', 'توفير في وقت المهام الإدارية', NULL, '31%', 'قبل', NULL, '70', 'بعد', NULL, '48', 'من ساعات فريق المشروع الأسبوعية', NULL, NULL, NULL);

INSERT INTO "home_page_blocks_comparison" ("_order", "_parent_id", "_path", "id", "topic_ar", "topic_en", "icon", "claim_ar", "claim_en", "figure", "before_label_ar", "before_label_en", "before_height", "after_label_ar", "after_label_en", "after_height", "basis_ar", "basis_en", "source", "block_name")
VALUES ('4', '1', 'figures.figures', '6ab0c5b0653728afc0fbe928', 'حوكمة الوثائق', NULL, 'governance', 'تحسّن في حوكمة الوثائق', NULL, '22%', 'قبل', NULL, '57', 'بعد', NULL, '70', 'اكتمال أثر كل معاملة: من أرسل، من اعتمد، ومتى', NULL, NULL, NULL);

INSERT INTO "home_page_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe8fd', 'false', 'المراسلات الرسمية', NULL, 'correspondence');

INSERT INTO "home_page_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe8fe', 'false', 'الاعتمادات والطلبات', NULL, 'kanban');

INSERT INTO "home_page_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe8ff', 'false', 'التقرير اليومي للموقع', NULL, 'daily-report');

INSERT INTO "home_page_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe900', 'false', 'المستندات والإصدارات', NULL, 'documents');

INSERT INTO "home_page_four_units_tabs" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "screen")
VALUES ('5', '1', '6ab0c5b0653728afc0fbe901', 'true', 'السجل الموثّق', NULL, 'stamped-sheet');

INSERT INTO "home_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe8f3', 'أُرسل · 07:12', NULL);

INSERT INTO "home_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe8f4', 'روجع · 09:20', NULL);

INSERT INTO "home_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe8f5', 'اعتُمد · 12:05', NULL);

INSERT INTO "home_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe8f6', 'وصل السجل للأطراف الثلاثة', NULL);

INSERT INTO "home_page_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe8f1', 'ثلاثة أطراف.', NULL);

INSERT INTO "home_page_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe8f2', 'سجل واحد.', NULL);

INSERT INTO "home_page_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"home_page_languages"', 'id'), (SELECT max("id") FROM "home_page_languages"));

INSERT INTO "home_page_record_heading_lines" ("_order", "_parent_id", "id", "line_ar", "line_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe902', 'لا نسأل "من اعتمد؟"', NULL);

INSERT INTO "home_page_record_heading_lines" ("_order", "_parent_id", "id", "line_ar", "line_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe903', 'نفتح المعاملة.', NULL);

INSERT INTO "home_page_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe904', 'من طلب؟', NULL);

INSERT INTO "home_page_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe905', 'من استلم؟', NULL);

INSERT INTO "home_page_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe906', 'من اعتمد؟', NULL);

INSERT INTO "home_page_record_questions" ("_order", "_parent_id", "id", "question_ar", "question_en")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe907', 'ومتى؟', NULL);

INSERT INTO "home_page_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe90c', 'خطاب رسمي', NULL, 'LTR-088 · خطاب — طلب تمديد مدة', NULL);

INSERT INTO "home_page_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe911', 'اعتماد مادة (MIR)', NULL, 'SUB-031 · اعتماد مادة — بلاط الواجهات', NULL);

INSERT INTO "home_page_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe916', 'طلب تسليم أعمال (WIR)', NULL, 'WIR-0142 · طلب تسليم أعمال — حديد سقف الدور 3', NULL);

INSERT INTO "home_page_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe91b', 'تحديث جدول زمني', NULL, 'SCH-04 · تحديث الجدول الزمني — أغسطس', NULL);

INSERT INTO "home_page_record_types" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en")
VALUES ('5', '1', '6ab0c5b0653728afc0fbe920', 'مستخلص مالي (IPC)', NULL, 'IPC-06 · مستخلص مالي — الدفعة السادسة', NULL);

INSERT INTO "home_page_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe8f7', 'المقاول يقول الاستشاري مأخّر الشغل… والاستشاري يقول ما وصله شي.', NULL, 'نزاع بلا مرجع، وكل طرف معه نسخته.', NULL);

INSERT INTO "home_page_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe8f8', 'الداشبورد يقرأ من ملف إكسل… والمهندس ما فضي يحدّثه.', NULL, 'قرار مبني على رقم قديم.', NULL);

INSERT INTO "home_page_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe8f9', 'ملفين إكسل، تاريخين لنفس المستند… ونرجع للنسخة الورقية نتأكد.', NULL, 'ساعات ضائعة على سؤال واحد: وين وقف الموضوع؟', NULL);

INSERT INTO "home_page_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe8fa', 'الاعتماد وصل بالإيميل قبل شهور… وما أحد يلقاه.', NULL, 'اعتماد موجود ولا يمكن إثباته.', NULL);

INSERT INTO "home_page_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en")
VALUES ('5', '1', '6ab0c5b0653728afc0fbe8fb', 'الجدول الزمني تحدّث… والمطوّر ما يدري وش أثره على التسليم.', NULL, 'المفاجأة في موعد التسليم، لا في اجتماع المتابعة.', NULL);

INSERT INTO "home_page_situations_situations" ("_order", "_parent_id", "id", "quote_ar", "quote_en", "cost_ar", "cost_en")
VALUES ('6', '1', '6ab0c5b0653728afc0fbe8fc', 'بعد نهاية المشروع احتجنا اعتماداً قديماً… والشيرفولدر مقفولة صلاحياته.', NULL, 'سجل المشروع يضيع مع انتهاء المشروع.', NULL);

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('1', '1', '1', 'أُرسل', NULL, 'م. فهد — المقاول', NULL, '08:15', '6ab0c5b0653728afc0fbe908');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('2', '1', '2', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '08:15', '6ab0c5b0653728afc0fbe909');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('3', '1', '3', 'دُقق', NULL, 'م. سارة — الاستشاري', NULL, '13:40', '6ab0c5b0653728afc0fbe90a');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('4', '1', '4', 'رُدَّ عليه', NULL, '“يُمنح 14 يوماً” — المالك', NULL, '11:05', '6ab0c5b0653728afc0fbe90b');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('1', '2', '5', 'أُرسل', NULL, 'م. فهد — المقاول', NULL, '08:15', '6ab0c5b0653728afc0fbe90d');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('2', '2', '6', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '08:15', '6ab0c5b0653728afc0fbe90e');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('3', '2', '7', 'دُقق', NULL, 'م. سارة — الاستشاري', NULL, '13:40', '6ab0c5b0653728afc0fbe90f');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('4', '2', '8', 'اعتُمد بملاحظات', NULL, '“عينة لون إضافية” — م. خالد', NULL, '10:02', '6ab0c5b0653728afc0fbe910');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('1', '3', '9', 'أُرسل', NULL, 'م. فهد — المقاول', NULL, '07:50', '6ab0c5b0653728afc0fbe912');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('2', '3', '10', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '07:50', '6ab0c5b0653728afc0fbe913');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('3', '3', '11', 'فُحص في الموقع', NULL, 'م. سارة · 4 صور', NULL, '11:20', '6ab0c5b0653728afc0fbe914');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('4', '3', '12', 'اعتُمد', NULL, '“مطابق — يُسمح بالصب”', NULL, '12:05', '6ab0c5b0653728afc0fbe915');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('1', '4', '13', 'رُفع التحديث', NULL, 'مخطط المقاول', NULL, '09:10', '6ab0c5b0653728afc0fbe917');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('2', '4', '14', 'استُلم', NULL, 'الاستشاري والمالك', NULL, '09:10', '6ab0c5b0653728afc0fbe918');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('3', '4', '15', 'رُوجع الأثر', NULL, 'تأخر 6 أيام على التسليم', NULL, '14:25', '6ab0c5b0653728afc0fbe919');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('4', '4', '16', 'اعتُمد التحديث', NULL, 'بملاحظة على المسار الحرج', NULL, '16:40', '6ab0c5b0653728afc0fbe91a');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('1', '5', '17', 'قُدِّم', NULL, 'المقاول — بالكميات المنفذة', NULL, '08:00', '6ab0c5b0653728afc0fbe91c');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('2', '5', '18', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '08:00', '6ab0c5b0653728afc0fbe91d');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('3', '5', '19', 'دُقق', NULL, 'مطابقة مع الطلبات المعتمدة', NULL, '12:30', '6ab0c5b0653728afc0fbe91e');

INSERT INTO "_home_page_v_version_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time", "_uuid")
VALUES ('4', '5', '20', 'اعتُمد للصرف', NULL, 'بعد خصم بند غير مطابق', NULL, '09:15', '6ab0c5b0653728afc0fbe91f');

SELECT setval(pg_get_serial_sequence('"_home_page_v_version_record_types_steps"', 'id'), (SELECT max("id") FROM "_home_page_v_version_record_types_steps"));

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('1', '6ab0c5b0653728afc0fbe90c', '6ab0c5b0653728afc0fbe908', 'أُرسل', NULL, 'م. فهد — المقاول', NULL, '08:15');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('2', '6ab0c5b0653728afc0fbe90c', '6ab0c5b0653728afc0fbe909', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '08:15');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('3', '6ab0c5b0653728afc0fbe90c', '6ab0c5b0653728afc0fbe90a', 'دُقق', NULL, 'م. سارة — الاستشاري', NULL, '13:40');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('4', '6ab0c5b0653728afc0fbe90c', '6ab0c5b0653728afc0fbe90b', 'رُدَّ عليه', NULL, '“يُمنح 14 يوماً” — المالك', NULL, '11:05');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('1', '6ab0c5b0653728afc0fbe911', '6ab0c5b0653728afc0fbe90d', 'أُرسل', NULL, 'م. فهد — المقاول', NULL, '08:15');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('2', '6ab0c5b0653728afc0fbe911', '6ab0c5b0653728afc0fbe90e', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '08:15');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('3', '6ab0c5b0653728afc0fbe911', '6ab0c5b0653728afc0fbe90f', 'دُقق', NULL, 'م. سارة — الاستشاري', NULL, '13:40');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('4', '6ab0c5b0653728afc0fbe911', '6ab0c5b0653728afc0fbe910', 'اعتُمد بملاحظات', NULL, '“عينة لون إضافية” — م. خالد', NULL, '10:02');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('1', '6ab0c5b0653728afc0fbe916', '6ab0c5b0653728afc0fbe912', 'أُرسل', NULL, 'م. فهد — المقاول', NULL, '07:50');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('2', '6ab0c5b0653728afc0fbe916', '6ab0c5b0653728afc0fbe913', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '07:50');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('3', '6ab0c5b0653728afc0fbe916', '6ab0c5b0653728afc0fbe914', 'فُحص في الموقع', NULL, 'م. سارة · 4 صور', NULL, '11:20');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('4', '6ab0c5b0653728afc0fbe916', '6ab0c5b0653728afc0fbe915', 'اعتُمد', NULL, '“مطابق — يُسمح بالصب”', NULL, '12:05');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('1', '6ab0c5b0653728afc0fbe91b', '6ab0c5b0653728afc0fbe917', 'رُفع التحديث', NULL, 'مخطط المقاول', NULL, '09:10');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('2', '6ab0c5b0653728afc0fbe91b', '6ab0c5b0653728afc0fbe918', 'استُلم', NULL, 'الاستشاري والمالك', NULL, '09:10');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('3', '6ab0c5b0653728afc0fbe91b', '6ab0c5b0653728afc0fbe919', 'رُوجع الأثر', NULL, 'تأخر 6 أيام على التسليم', NULL, '14:25');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('4', '6ab0c5b0653728afc0fbe91b', '6ab0c5b0653728afc0fbe91a', 'اعتُمد التحديث', NULL, 'بملاحظة على المسار الحرج', NULL, '16:40');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('1', '6ab0c5b0653728afc0fbe920', '6ab0c5b0653728afc0fbe91c', 'قُدِّم', NULL, 'المقاول — بالكميات المنفذة', NULL, '08:00');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('2', '6ab0c5b0653728afc0fbe920', '6ab0c5b0653728afc0fbe91d', 'استُلم', NULL, 'إشعار استلام تلقائي', NULL, '08:00');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('3', '6ab0c5b0653728afc0fbe920', '6ab0c5b0653728afc0fbe91e', 'دُقق', NULL, 'مطابقة مع الطلبات المعتمدة', NULL, '12:30');

INSERT INTO "home_page_record_types_steps" ("_order", "_parent_id", "id", "action_ar", "action_en", "by_ar", "by_en", "time")
VALUES ('4', '6ab0c5b0653728afc0fbe920', '6ab0c5b0653728afc0fbe91f', 'اعتُمد للصرف', NULL, 'بعد خصم بند غير مطابق', NULL, '09:15');
`;
