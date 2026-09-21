/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260915_063744_import_product_page_closing_section_and_screen_mocks` (ticket 63).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const PRODUCT_PAGE_SEED = `
INSERT INTO "_closing_section_v" ("id", "version_closing_eyebrow_ar", "version_closing_eyebrow_en", "version_closing_heading_ar", "version_closing_heading_en", "version_closing_more_label_ar", "version_closing_more_label_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'كيف نبدأ معك', NULL, 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.', NULL, 'التفاصيل والأسئلة الشائعة ←', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_closing_section_v"', 'id'), (SELECT max("id") FROM "_closing_section_v"));

INSERT INTO "_product_page_v" ("id", "version_hero_eyebrow_ar", "version_hero_eyebrow_en", "version_hero_title_ar", "version_hero_title_en", "version_hero_lead_ar", "version_hero_lead_en", "version_hero_primary_label_ar", "version_hero_primary_label_en", "version_hero_secondary_label_ar", "version_hero_secondary_label_en", "version_trust_strip_shows", "version_journey_eyebrow_ar", "version_journey_eyebrow_en", "version_journey_heading_ar", "version_journey_heading_en", "version_journey_output_label_ar", "version_journey_output_label_en", "version_custom_strip_shows", "version_custom_strip_eyebrow_ar", "version_custom_strip_eyebrow_en", "version_custom_strip_heading_ar", "version_custom_strip_heading_en", "version_custom_strip_badge_ar", "version_custom_strip_badge_en", "version_custom_strip_ask_label_ar", "version_custom_strip_ask_label_en", "version_roles_shows", "version_roles_eyebrow_ar", "version_roles_eyebrow_en", "version_roles_heading_ar", "version_roles_heading_en", "version_inner_cycle_shows", "version_inner_cycle_eyebrow_ar", "version_inner_cycle_eyebrow_en", "version_inner_cycle_heading_ar", "version_inner_cycle_heading_en", "version_inner_cycle_lead_ar", "version_inner_cycle_lead_en", "version_inner_cycle_private_tag_ar", "version_inner_cycle_private_tag_en", "version_inner_cycle_crosses_label_ar", "version_inner_cycle_crosses_label_en", "version_inner_cycle_review_again_ar", "version_inner_cycle_review_again_en", "version_inner_cycle_stays_inside_label_ar", "version_inner_cycle_stays_inside_label_en", "version_inner_cycle_stays_inside_text_ar", "version_inner_cycle_stays_inside_text_en", "version_inner_cycle_stays_inside_emphasis_ar", "version_inner_cycle_stays_inside_emphasis_en", "version_inner_cycle_crosses_out_label_ar", "version_inner_cycle_crosses_out_label_en", "version_inner_cycle_crosses_out_text_ar", "version_inner_cycle_crosses_out_text_en", "version_inner_cycle_crosses_out_emphasis_ar", "version_inner_cycle_crosses_out_emphasis_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'المنتج', NULL, 'وحدات ربائد — وما يراه كل طرف منها.', NULL, 'أربع وحدات تغطي كل ما يمر بين الأطراف، ثم ما يراه كل طرف حين يفتح المنصة، ثم ما يبقى داخل جهته ولا يعبر إلى الآخرين.', NULL, 'احجز عرضاً حياً', NULL, 'ابدأ من الوحدات ↓', NULL, 'true', 'المنصة', NULL, 'أربع وحدات. سجل واحد يجمعها.', NULL, 'المخرَج', NULL, 'true', 'يُخصَّص حسب المشروع', NULL, 'ومشروعك يحتاج أكثر؟', NULL, 'حسب المشروع', NULL, 'اسأل عنها في العرض التوضيحي ←', NULL, 'true', 'لكل طرف', NULL, 'ماذا يرى كل طرف حين يفتح المنصة؟', NULL, 'true', 'داخل كل جهة', NULL, 'ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟', NULL, 'لكل جهة دورة مراجعة واعتماد داخلية كاملة قبل أن ترسل شيئاً. هذه الدورة لا يراها الطرفان الآخران إطلاقاً — لا مسوداتها، ولا ملاحظاتها، ولا كم مرة أُعيدت. ما يعبر هو المعاملة الرسمية وحدها.', NULL, 'دورة داخلية · محجوبة', NULL, 'ما يعبر رسمياً', NULL, 'إعادة ومراجعة داخلية — بلا حد، وبلا أثر خارج الجهة', NULL, 'ما يبقى داخل جهتك', NULL, 'المسودات، الملاحظات الداخلية، الاعتراضات، وعدد دورات المراجعة.', NULL, 'تعمل بحرية داخل حدودك — ولا يُحسب عليك ما لم تُرسله.', NULL, 'ما يعبر إلى الآخرين', NULL, 'المعاملة الرسمية فقط، بلحظة إرسالها واسم من أرسلها.', NULL, 'ومن تلك اللحظة تصبح جزءاً من السجل الموثّق.', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_product_page_v"', 'id'), (SELECT max("id") FROM "_product_page_v"));

INSERT INTO "_screen_mocks_v" ("id", "version_correspondence_picture_id", "version_correspondence_description_ar", "version_correspondence_description_en", "version_kanban_picture_id", "version_kanban_description_ar", "version_kanban_description_en", "version_daily_report_picture_id", "version_daily_report_description_ar", "version_daily_report_description_en", "version_documents_picture_id", "version_documents_description_ar", "version_documents_description_en", "version_stamped_sheet_picture_id", "version_stamped_sheet_description_ar", "version_stamped_sheet_description_en", "version_overview_picture_id", "version_overview_description_ar", "version_overview_description_en", "version_approvals_table_picture_id", "version_approvals_table_description_ar", "version_approvals_table_description_en", "version_submittal_picture_id", "version_submittal_description_ar", "version_submittal_description_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', NULL, 'شاشة المراسلات الرسمية في ربائد: خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف', NULL, NULL, 'لوحة كانبان للاعتمادات في ربائد: مسودة، مراجعة داخلية بمسارَي مهندس المقاول ومدير المشروع، ثم انتظار الموافقة والمعتمدة', NULL, NULL, 'تفاصيل التقرير اليومي في ربائد: الطقس والموقع، جدولا الفريق الإداري والعمالة بالعدد والساعات، والأنشطة والصور', NULL, NULL, 'مستودع المستندات في ربائد: المجلدات وجدول الملفات بالإصدار والنوع ومعرف المصدر ومن رفعه', NULL, NULL, 'ورقة الاعتماد المختومة في ربائد: أربعة توقيعات بالدور والشركة ووقت الفعل، ورمز الاعتماد B، والختم', NULL, NULL, 'ما يراه المالك في ربائد: لوحة مشروع واحدة بمؤشرات الاعتمادات وأطراف المشروع', NULL, NULL, 'ما يراه الاستشاري في ربائد: جدول الاعتمادات والطلبات بحالاتها وتخصصاتها وأنواعها', NULL, NULL, 'ما يراه المقاول في ربائد: تفاصيل الطلب وقسم الموافقات باسم كل من تصرّف ووقته', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_screen_mocks_v"', 'id'), (SELECT max("id") FROM "_screen_mocks_v"));

INSERT INTO "closing_section" ("id", "closing_eyebrow_ar", "closing_eyebrow_en", "closing_heading_ar", "closing_heading_en", "closing_more_label_ar", "closing_more_label_en", "_status", "updated_at", "created_at")
VALUES ('1', 'كيف نبدأ معك', NULL, 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.', NULL, 'التفاصيل والأسئلة الشائعة ←', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"closing_section"', 'id'), (SELECT max("id") FROM "closing_section"));

INSERT INTO "product_page" ("id", "hero_eyebrow_ar", "hero_eyebrow_en", "hero_title_ar", "hero_title_en", "hero_lead_ar", "hero_lead_en", "hero_primary_label_ar", "hero_primary_label_en", "hero_secondary_label_ar", "hero_secondary_label_en", "trust_strip_shows", "journey_eyebrow_ar", "journey_eyebrow_en", "journey_heading_ar", "journey_heading_en", "journey_output_label_ar", "journey_output_label_en", "custom_strip_shows", "custom_strip_eyebrow_ar", "custom_strip_eyebrow_en", "custom_strip_heading_ar", "custom_strip_heading_en", "custom_strip_badge_ar", "custom_strip_badge_en", "custom_strip_ask_label_ar", "custom_strip_ask_label_en", "roles_shows", "roles_eyebrow_ar", "roles_eyebrow_en", "roles_heading_ar", "roles_heading_en", "inner_cycle_shows", "inner_cycle_eyebrow_ar", "inner_cycle_eyebrow_en", "inner_cycle_heading_ar", "inner_cycle_heading_en", "inner_cycle_lead_ar", "inner_cycle_lead_en", "inner_cycle_private_tag_ar", "inner_cycle_private_tag_en", "inner_cycle_crosses_label_ar", "inner_cycle_crosses_label_en", "inner_cycle_review_again_ar", "inner_cycle_review_again_en", "inner_cycle_stays_inside_label_ar", "inner_cycle_stays_inside_label_en", "inner_cycle_stays_inside_text_ar", "inner_cycle_stays_inside_text_en", "inner_cycle_stays_inside_emphasis_ar", "inner_cycle_stays_inside_emphasis_en", "inner_cycle_crosses_out_label_ar", "inner_cycle_crosses_out_label_en", "inner_cycle_crosses_out_text_ar", "inner_cycle_crosses_out_text_en", "inner_cycle_crosses_out_emphasis_ar", "inner_cycle_crosses_out_emphasis_en", "_status", "updated_at", "created_at")
VALUES ('1', 'المنتج', NULL, 'وحدات ربائد — وما يراه كل طرف منها.', NULL, 'أربع وحدات تغطي كل ما يمر بين الأطراف، ثم ما يراه كل طرف حين يفتح المنصة، ثم ما يبقى داخل جهته ولا يعبر إلى الآخرين.', NULL, 'احجز عرضاً حياً', NULL, 'ابدأ من الوحدات ↓', NULL, 'true', 'المنصة', NULL, 'أربع وحدات. سجل واحد يجمعها.', NULL, 'المخرَج', NULL, 'true', 'يُخصَّص حسب المشروع', NULL, 'ومشروعك يحتاج أكثر؟', NULL, 'حسب المشروع', NULL, 'اسأل عنها في العرض التوضيحي ←', NULL, 'true', 'لكل طرف', NULL, 'ماذا يرى كل طرف حين يفتح المنصة؟', NULL, 'true', 'داخل كل جهة', NULL, 'ماذا يبقى عندك، وماذا يعبر إلى الطرف الآخر؟', NULL, 'لكل جهة دورة مراجعة واعتماد داخلية كاملة قبل أن ترسل شيئاً. هذه الدورة لا يراها الطرفان الآخران إطلاقاً — لا مسوداتها، ولا ملاحظاتها، ولا كم مرة أُعيدت. ما يعبر هو المعاملة الرسمية وحدها.', NULL, 'دورة داخلية · محجوبة', NULL, 'ما يعبر رسمياً', NULL, 'إعادة ومراجعة داخلية — بلا حد، وبلا أثر خارج الجهة', NULL, 'ما يبقى داخل جهتك', NULL, 'المسودات، الملاحظات الداخلية، الاعتراضات، وعدد دورات المراجعة.', NULL, 'تعمل بحرية داخل حدودك — ولا يُحسب عليك ما لم تُرسله.', NULL, 'ما يعبر إلى الآخرين', NULL, 'المعاملة الرسمية فقط، بلحظة إرسالها واسم من أرسلها.', NULL, 'ومن تلك اللحظة تصبح جزءاً من السجل الموثّق.', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"product_page"', 'id'), (SELECT max("id") FROM "product_page"));

INSERT INTO "screen_mocks" ("id", "correspondence_picture_id", "correspondence_description_ar", "correspondence_description_en", "kanban_picture_id", "kanban_description_ar", "kanban_description_en", "daily_report_picture_id", "daily_report_description_ar", "daily_report_description_en", "documents_picture_id", "documents_description_ar", "documents_description_en", "stamped_sheet_picture_id", "stamped_sheet_description_ar", "stamped_sheet_description_en", "overview_picture_id", "overview_description_ar", "overview_description_en", "approvals_table_picture_id", "approvals_table_description_ar", "approvals_table_description_en", "submittal_picture_id", "submittal_description_ar", "submittal_description_en", "_status", "updated_at", "created_at")
VALUES ('1', NULL, 'شاشة المراسلات الرسمية في ربائد: خطابات بأرقام مرجعية وحالات الرد ومدة الانتظار بين الأطراف', NULL, NULL, 'لوحة كانبان للاعتمادات في ربائد: مسودة، مراجعة داخلية بمسارَي مهندس المقاول ومدير المشروع، ثم انتظار الموافقة والمعتمدة', NULL, NULL, 'تفاصيل التقرير اليومي في ربائد: الطقس والموقع، جدولا الفريق الإداري والعمالة بالعدد والساعات، والأنشطة والصور', NULL, NULL, 'مستودع المستندات في ربائد: المجلدات وجدول الملفات بالإصدار والنوع ومعرف المصدر ومن رفعه', NULL, NULL, 'ورقة الاعتماد المختومة في ربائد: أربعة توقيعات بالدور والشركة ووقت الفعل، ورمز الاعتماد B، والختم', NULL, NULL, 'ما يراه المالك في ربائد: لوحة مشروع واحدة بمؤشرات الاعتمادات وأطراف المشروع', NULL, NULL, 'ما يراه الاستشاري في ربائد: جدول الاعتمادات والطلبات بحالاتها وتخصصاتها وأنواعها', NULL, NULL, 'ما يراه المقاول في ربائد: تفاصيل الطلب وقسم الموافقات باسم كل من تصرّف ووقته', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"screen_mocks"', 'id'), (SELECT max("id") FROM "screen_mocks"));

INSERT INTO "_closing_section_v_version_closing_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'إعداد', NULL, 'نُعدّ المشروع والنماذج، وندعو المالك والاستشاري والمقاول — و15 دقيقة مع كل فريق.', NULL, '6ab0c5af653728afc0fbe85e');

INSERT INTO "_closing_section_v_version_closing_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'تشغيل', NULL, 'أقل من يوم، دون توقف للعمل. يبدأ الجميع من حيث وصل المشروع.', NULL, '6ab0c5af653728afc0fbe85f');

INSERT INTO "_closing_section_v_version_closing_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'ضمان', NULL, '60 يوماً من التفعيل — أو نعيد كامل المبلغ، ونسلّمكم نسخة كاملة من السجل.', NULL, '6ab0c5af653728afc0fbe860');

SELECT setval(pg_get_serial_sequence('"_closing_section_v_version_closing_steps"', 'id'), (SELECT max("id") FROM "_closing_section_v_version_closing_steps"));

INSERT INTO "_closing_section_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_closing_section_v_version_languages"', 'id'), (SELECT max("id") FROM "_closing_section_v_version_languages"));

INSERT INTO "_product_page_v_version_custom_strip_features" ("_order", "_parent_id", "id", "title_ar", "title_en", "body_ar", "body_en", "_uuid")
VALUES ('1', '1', '1', 'الجداول الزمنية ومتابعة الإنجاز', NULL, 'استيراد جداول Primavera P6 و MS Project، المسار الحرج، وأثر كل تحديث زمني على موعد التسليم.', NULL, '6ab0c5af653728afc0fbe872');

INSERT INTO "_product_page_v_version_custom_strip_features" ("_order", "_parent_id", "id", "title_ar", "title_en", "body_ar", "body_en", "_uuid")
VALUES ('2', '1', '2', 'جدول الكميات والمستخلصات', NULL, 'جدول كميات تفاعلي ومستخلصات مبنية على الطلبات المعتمدة فعلاً — لا على ما يُكتب في نهاية الشهر.', NULL, '6ab0c5af653728afc0fbe873');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_custom_strip_features"', 'id'), (SELECT max("id") FROM "_product_page_v_version_custom_strip_features"));

INSERT INTO "_product_page_v_version_inner_cycle_cycles" ("_order", "_parent_id", "id", "party_ar", "party_en", "note_ar", "note_en", "crosses_ar", "crosses_en", "_uuid")
VALUES ('1', '1', '1', 'المقاول', NULL, 'يجهّز الطلب قبل أن يرسله.', NULL, 'طلب تسليم أعمال · اعتماد مادة · خطاب — بتاريخه ومن أرسله.', NULL, '6ab0c5af653728afc0fbe87f');

INSERT INTO "_product_page_v_version_inner_cycle_cycles" ("_order", "_parent_id", "id", "party_ar", "party_en", "note_ar", "note_en", "crosses_ar", "crosses_en", "_uuid")
VALUES ('2', '1', '2', 'الاستشاري', NULL, 'يراجع ويقرر قبل أن يرد.', NULL, 'اعتماد أو رفض بملاحظات · عدم مطابقة · تعليمات موقع.', NULL, '6ab0c5af653728afc0fbe883');

INSERT INTO "_product_page_v_version_inner_cycle_cycles" ("_order", "_parent_id", "id", "party_ar", "party_en", "note_ar", "note_en", "crosses_ar", "crosses_en", "_uuid")
VALUES ('3', '1', '3', 'المالك / المطوّر', NULL, 'يدرس أثر القرار قبل أن يعتمد.', NULL, 'موافقة · رد على خطاب · اعتماد مستخلص.', NULL, '6ab0c5af653728afc0fbe887');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_inner_cycle_cycles"', 'id'), (SELECT max("id") FROM "_product_page_v_version_inner_cycle_cycles"));

INSERT INTO "_product_page_v_version_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen", "_uuid")
VALUES ('1', '1', '1', 'false', 'المراسلات الرسمية', NULL, 'خطاب برقم مرجعي، وإشعار استلام لا يُنكر.', NULL, 'خطابات، محاضر اجتماعات، استفسارات RFI — بترقيم مرجعي آلي، وإشعار استلام تلقائي يسجّل من استلم ومتى.', NULL, 'correspondence', '6ab0c5af653728afc0fbe863');

INSERT INTO "_product_page_v_version_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen", "_uuid")
VALUES ('2', '1', '2', 'false', 'الاعتمادات والطلبات', NULL, 'من اعتماد المادة إلى طلب التسليم: مسار واحد بين المقاول والاستشاري.', NULL, 'اعتمادات الموردين والمواد والمخططات والمستندات · طلبات تسليم الأعمال WIR وفحص المواد MIR وإذن الأعمال · وبالاتجاه المقابل: عدم المطابقة NCR، تعليمات الموقع، وملاحظات التسليم النهائي.', NULL, 'kanban', '6ab0c5af653728afc0fbe868');

INSERT INTO "_product_page_v_version_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen", "_uuid")
VALUES ('3', '1', '3', 'false', 'التقرير اليومي للموقع', NULL, 'ما حدث في الموقع اليوم، عند المالك قبل أن ينتهي اليوم.', NULL, 'العمالة، المعدات، الطقس، إنتاجية اليوم، الصور — يُرفع من الجوال في الموقع ويظهر في لوحة المالك فوراً.', NULL, 'daily-report', '6ab0c5af653728afc0fbe86c');

INSERT INTO "_product_page_v_version_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen", "_uuid")
VALUES ('4', '1', '4', 'false', 'المستندات والإصدارات', NULL, 'الجميع على آخر إصدار معتمد — ولا أحد يرى أكثر مما يخصه.', NULL, 'مستودع واحد للمشروع: المخططات والمستندات بإصداراتها، الإصدار المعتمد فقط هو الظاهر للموقع، وصلاحيات محددة لكل جهة.', NULL, 'documents', '6ab0c5af653728afc0fbe870');

INSERT INTO "_product_page_v_version_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen", "_uuid")
VALUES ('5', '1', '5', 'true', 'السجل الموثّق', NULL, 'ثلاثة أطراف. سجل واحد.', NULL, 'كل مستند في ربائد يحمل تاريخه كاملاً: متى أُرسل، من استلمه، من دققه، من اعتمده — وبأي ملاحظات ومتى. ليس ميزة تُفعَّل، بل نتيجة كل خطوة.', NULL, 'stamped-sheet', '6ab0c5af653728afc0fbe871');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_journey_panels"', 'id'), (SELECT max("id") FROM "_product_page_v_version_journey_panels"));

INSERT INTO "_product_page_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_languages"', 'id'), (SELECT max("id") FROM "_product_page_v_version_languages"));

INSERT INTO "_product_page_v_version_roles_roles" ("_order", "_parent_id", "id", "party_ar", "party_en", "promise_ar", "promise_en", "body_ar", "body_en", "objection_ar", "objection_en", "answer_ar", "answer_en", "screen", "_uuid")
VALUES ('1', '1', '1', 'المالك / المطوّر', NULL, 'لوحة واحدة لكل مشاريعك.', NULL, 'ما ينتظر اعتمادك، ما تجاوز مهلته، وما حدث في الموقع اليوم — بلا اجتماع متابعة، وبلا ملف إكسل يحتاج من يحدّثه.', NULL, '«ما عندي وقت أتابع نظاماً جديداً.»', NULL, 'لا تدخله لتتابع، بل لتعتمد. وما عدا ذلك يصلك مقروءاً في لوحة واحدة.', NULL, 'overview', '6ab0c5af653728afc0fbe874');

INSERT INTO "_product_page_v_version_roles_roles" ("_order", "_parent_id", "id", "party_ar", "party_en", "promise_ar", "promise_en", "body_ar", "body_en", "objection_ar", "objection_en", "answer_ar", "answer_en", "screen", "_uuid")
VALUES ('2', '1', '2', 'الاستشاري', NULL, 'طلبات المقاول في قائمة واحدة.', NULL, 'كل طلبات التسليم والفحص والاعتماد أمامك بحالتها. تعتمد بملاحظاتك من المكتب أو من الموقع، وتُصدر NCR وتعليمات الموقع من الجوال — وكلها موثّقة باسمك ووقتك.', NULL, '«سيُحمّلنا مسؤولية التأخير.»', NULL, 'بالعكس: يوثّق أنك رددت في وقتك، ويوثّق الطلب الذي وصلك ناقصاً كما وصل.', NULL, 'approvals-table', '6ab0c5af653728afc0fbe875');

INSERT INTO "_product_page_v_version_roles_roles" ("_order", "_parent_id", "id", "party_ar", "party_en", "promise_ar", "promise_en", "body_ar", "body_en", "objection_ar", "objection_en", "answer_ar", "answer_en", "screen", "_uuid")
VALUES ('3', '1', '3', 'المقاول', NULL, 'طلب واحد بدل خمس رسائل.', NULL, 'ترفع الطلب، تعرف من استلمه ومتى، وتعرف حالته دون مكالمة. وإن تأخر الاعتماد — سجلك جاهز يُظهر متى أرسلت ومتى وصل.', NULL, '«سيُستخدم ضدنا.»', NULL, 'السجل واحد للجميع: يوثّق تقديمك في موعده كما يوثّق تأخر الرد عليه.', NULL, 'submittal', '6ab0c5af653728afc0fbe876');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_roles_roles"', 'id'), (SELECT max("id") FROM "_product_page_v_version_roles_roles"));

INSERT INTO "_product_page_v_version_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en", "_uuid")
VALUES ('1', '1', '1', 'نماذج عربية بالمعايير السعودية', NULL, '6ab0c5af653728afc0fbe877');

INSERT INTO "_product_page_v_version_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en", "_uuid")
VALUES ('2', '1', '2', 'إصدار واحد معتمد', NULL, '6ab0c5af653728afc0fbe878');

INSERT INTO "_product_page_v_version_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en", "_uuid")
VALUES ('3', '1', '3', 'صلاحيات لكل جهة', NULL, '6ab0c5af653728afc0fbe879');

INSERT INTO "_product_page_v_version_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en", "_uuid")
VALUES ('4', '1', '4', 'يعمل من الجوال', NULL, '6ab0c5af653728afc0fbe87a');

INSERT INTO "_product_page_v_version_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en", "_uuid")
VALUES ('5', '1', '5', 'يدعم الإنجليزية للفرق غير العربية', NULL, '6ab0c5af653728afc0fbe87b');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_roles_shared_promises"', 'id'), (SELECT max("id") FROM "_product_page_v_version_roles_shared_promises"));

INSERT INTO "_screen_mocks_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_screen_mocks_v_version_languages"', 'id'), (SELECT max("id") FROM "_screen_mocks_v_version_languages"));

INSERT INTO "closing_section_closing_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe85e', 'إعداد', NULL, 'نُعدّ المشروع والنماذج، وندعو المالك والاستشاري والمقاول — و15 دقيقة مع كل فريق.', NULL);

INSERT INTO "closing_section_closing_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe85f', 'تشغيل', NULL, 'أقل من يوم، دون توقف للعمل. يبدأ الجميع من حيث وصل المشروع.', NULL);

INSERT INTO "closing_section_closing_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe860', 'ضمان', NULL, '60 يوماً من التفعيل — أو نعيد كامل المبلغ، ونسلّمكم نسخة كاملة من السجل.', NULL);

INSERT INTO "closing_section_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"closing_section_languages"', 'id'), (SELECT max("id") FROM "closing_section_languages"));

INSERT INTO "product_page_custom_strip_features" ("_order", "_parent_id", "id", "title_ar", "title_en", "body_ar", "body_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe872', 'الجداول الزمنية ومتابعة الإنجاز', NULL, 'استيراد جداول Primavera P6 و MS Project، المسار الحرج، وأثر كل تحديث زمني على موعد التسليم.', NULL);

INSERT INTO "product_page_custom_strip_features" ("_order", "_parent_id", "id", "title_ar", "title_en", "body_ar", "body_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe873', 'جدول الكميات والمستخلصات', NULL, 'جدول كميات تفاعلي ومستخلصات مبنية على الطلبات المعتمدة فعلاً — لا على ما يُكتب في نهاية الشهر.', NULL);

INSERT INTO "product_page_inner_cycle_cycles" ("_order", "_parent_id", "id", "party_ar", "party_en", "note_ar", "note_en", "crosses_ar", "crosses_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe87f', 'المقاول', NULL, 'يجهّز الطلب قبل أن يرسله.', NULL, 'طلب تسليم أعمال · اعتماد مادة · خطاب — بتاريخه ومن أرسله.', NULL);

INSERT INTO "product_page_inner_cycle_cycles" ("_order", "_parent_id", "id", "party_ar", "party_en", "note_ar", "note_en", "crosses_ar", "crosses_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe883', 'الاستشاري', NULL, 'يراجع ويقرر قبل أن يرد.', NULL, 'اعتماد أو رفض بملاحظات · عدم مطابقة · تعليمات موقع.', NULL);

INSERT INTO "product_page_inner_cycle_cycles" ("_order", "_parent_id", "id", "party_ar", "party_en", "note_ar", "note_en", "crosses_ar", "crosses_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe887', 'المالك / المطوّر', NULL, 'يدرس أثر القرار قبل أن يعتمد.', NULL, 'موافقة · رد على خطاب · اعتماد مستخلص.', NULL);

INSERT INTO "product_page_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen")
VALUES ('1', '1', '6ab0c5af653728afc0fbe863', 'false', 'المراسلات الرسمية', NULL, 'خطاب برقم مرجعي، وإشعار استلام لا يُنكر.', NULL, 'خطابات، محاضر اجتماعات، استفسارات RFI — بترقيم مرجعي آلي، وإشعار استلام تلقائي يسجّل من استلم ومتى.', NULL, 'correspondence');

INSERT INTO "product_page_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen")
VALUES ('2', '1', '6ab0c5af653728afc0fbe868', 'false', 'الاعتمادات والطلبات', NULL, 'من اعتماد المادة إلى طلب التسليم: مسار واحد بين المقاول والاستشاري.', NULL, 'اعتمادات الموردين والمواد والمخططات والمستندات · طلبات تسليم الأعمال WIR وفحص المواد MIR وإذن الأعمال · وبالاتجاه المقابل: عدم المطابقة NCR، تعليمات الموقع، وملاحظات التسليم النهائي.', NULL, 'kanban');

INSERT INTO "product_page_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen")
VALUES ('3', '1', '6ab0c5af653728afc0fbe86c', 'false', 'التقرير اليومي للموقع', NULL, 'ما حدث في الموقع اليوم، عند المالك قبل أن ينتهي اليوم.', NULL, 'العمالة، المعدات، الطقس، إنتاجية اليوم، الصور — يُرفع من الجوال في الموقع ويظهر في لوحة المالك فوراً.', NULL, 'daily-report');

INSERT INTO "product_page_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen")
VALUES ('4', '1', '6ab0c5af653728afc0fbe870', 'false', 'المستندات والإصدارات', NULL, 'الجميع على آخر إصدار معتمد — ولا أحد يرى أكثر مما يخصه.', NULL, 'مستودع واحد للمشروع: المخططات والمستندات بإصداراتها، الإصدار المعتمد فقط هو الظاهر للموقع، وصلاحيات محددة لكل جهة.', NULL, 'documents');

INSERT INTO "product_page_journey_panels" ("_order", "_parent_id", "id", "final", "title_ar", "title_en", "tagline_ar", "tagline_en", "body_ar", "body_en", "screen")
VALUES ('5', '1', '6ab0c5af653728afc0fbe871', 'true', 'السجل الموثّق', NULL, 'ثلاثة أطراف. سجل واحد.', NULL, 'كل مستند في ربائد يحمل تاريخه كاملاً: متى أُرسل، من استلمه، من دققه، من اعتمده — وبأي ملاحظات ومتى. ليس ميزة تُفعَّل، بل نتيجة كل خطوة.', NULL, 'stamped-sheet');

INSERT INTO "product_page_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"product_page_languages"', 'id'), (SELECT max("id") FROM "product_page_languages"));

INSERT INTO "product_page_roles_roles" ("_order", "_parent_id", "id", "party_ar", "party_en", "promise_ar", "promise_en", "body_ar", "body_en", "objection_ar", "objection_en", "answer_ar", "answer_en", "screen")
VALUES ('1', '1', '6ab0c5af653728afc0fbe874', 'المالك / المطوّر', NULL, 'لوحة واحدة لكل مشاريعك.', NULL, 'ما ينتظر اعتمادك، ما تجاوز مهلته، وما حدث في الموقع اليوم — بلا اجتماع متابعة، وبلا ملف إكسل يحتاج من يحدّثه.', NULL, '«ما عندي وقت أتابع نظاماً جديداً.»', NULL, 'لا تدخله لتتابع، بل لتعتمد. وما عدا ذلك يصلك مقروءاً في لوحة واحدة.', NULL, 'overview');

INSERT INTO "product_page_roles_roles" ("_order", "_parent_id", "id", "party_ar", "party_en", "promise_ar", "promise_en", "body_ar", "body_en", "objection_ar", "objection_en", "answer_ar", "answer_en", "screen")
VALUES ('2', '1', '6ab0c5af653728afc0fbe875', 'الاستشاري', NULL, 'طلبات المقاول في قائمة واحدة.', NULL, 'كل طلبات التسليم والفحص والاعتماد أمامك بحالتها. تعتمد بملاحظاتك من المكتب أو من الموقع، وتُصدر NCR وتعليمات الموقع من الجوال — وكلها موثّقة باسمك ووقتك.', NULL, '«سيُحمّلنا مسؤولية التأخير.»', NULL, 'بالعكس: يوثّق أنك رددت في وقتك، ويوثّق الطلب الذي وصلك ناقصاً كما وصل.', NULL, 'approvals-table');

INSERT INTO "product_page_roles_roles" ("_order", "_parent_id", "id", "party_ar", "party_en", "promise_ar", "promise_en", "body_ar", "body_en", "objection_ar", "objection_en", "answer_ar", "answer_en", "screen")
VALUES ('3', '1', '6ab0c5af653728afc0fbe876', 'المقاول', NULL, 'طلب واحد بدل خمس رسائل.', NULL, 'ترفع الطلب، تعرف من استلمه ومتى، وتعرف حالته دون مكالمة. وإن تأخر الاعتماد — سجلك جاهز يُظهر متى أرسلت ومتى وصل.', NULL, '«سيُستخدم ضدنا.»', NULL, 'السجل واحد للجميع: يوثّق تقديمك في موعده كما يوثّق تأخر الرد عليه.', NULL, 'submittal');

INSERT INTO "product_page_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe877', 'نماذج عربية بالمعايير السعودية', NULL);

INSERT INTO "product_page_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe878', 'إصدار واحد معتمد', NULL);

INSERT INTO "product_page_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe879', 'صلاحيات لكل جهة', NULL);

INSERT INTO "product_page_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe87a', 'يعمل من الجوال', NULL);

INSERT INTO "product_page_roles_shared_promises" ("_order", "_parent_id", "id", "promise_ar", "promise_en")
VALUES ('5', '1', '6ab0c5af653728afc0fbe87b', 'يدعم الإنجليزية للفرق غير العربية', NULL);

INSERT INTO "screen_mocks_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"screen_mocks_languages"', 'id'), (SELECT max("id") FROM "screen_mocks_languages"));

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('1', '1', '1', 'مهندس الموقع', NULL, '6ab0c5af653728afc0fbe87c');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('2', '1', '2', 'المكتب الفني', NULL, '6ab0c5af653728afc0fbe87d');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('3', '1', '3', 'مدير المشروع', NULL, '6ab0c5af653728afc0fbe87e');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('1', '2', '4', 'مهندس التخصص', NULL, '6ab0c5af653728afc0fbe880');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('2', '2', '5', 'مدير المراقبة', NULL, '6ab0c5af653728afc0fbe881');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('3', '2', '6', 'مدير المشروع', NULL, '6ab0c5af653728afc0fbe882');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('1', '3', '7', 'مدير المشروع', NULL, '6ab0c5af653728afc0fbe884');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('2', '3', '8', 'إدارة العقود', NULL, '6ab0c5af653728afc0fbe885');

INSERT INTO "_product_page_reviewers_v" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en", "_uuid")
VALUES ('3', '3', '9', 'صاحب القرار', NULL, '6ab0c5af653728afc0fbe886');

SELECT setval(pg_get_serial_sequence('"_product_page_reviewers_v"', 'id'), (SELECT max("id") FROM "_product_page_reviewers_v"));

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('1', '1', '1', 'أي طرف', NULL, 'towards', '6ab0c5af653728afc0fbe861');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('2', '1', '2', 'أي طرف', NULL, 'none', '6ab0c5af653728afc0fbe862');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('1', '2', '3', 'المقاول', NULL, 'towards', '6ab0c5af653728afc0fbe864');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('2', '2', '4', 'الاستشاري', NULL, 'then', '6ab0c5af653728afc0fbe865');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('3', '2', '5', 'الاستشاري', NULL, 'towards', '6ab0c5af653728afc0fbe866');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('4', '2', '6', 'المقاول', NULL, 'none', '6ab0c5af653728afc0fbe867');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('1', '3', '7', 'الموقع', NULL, 'towards', '6ab0c5af653728afc0fbe869');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('2', '3', '8', 'الاستشاري', NULL, 'towards', '6ab0c5af653728afc0fbe86a');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('3', '3', '9', 'المالك', NULL, 'none', '6ab0c5af653728afc0fbe86b');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('1', '4', '10', 'المالك', NULL, 'none', '6ab0c5af653728afc0fbe86d');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('2', '4', '11', 'الاستشاري', NULL, 'none', '6ab0c5af653728afc0fbe86e');

INSERT INTO "_product_page_v_version_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after", "_uuid")
VALUES ('3', '4', '12', 'المقاول', NULL, 'none', '6ab0c5af653728afc0fbe86f');

SELECT setval(pg_get_serial_sequence('"_product_page_v_version_journey_panels_flow"', 'id'), (SELECT max("id") FROM "_product_page_v_version_journey_panels_flow"));

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('1', '6ab0c5af653728afc0fbe863', '6ab0c5af653728afc0fbe861', 'أي طرف', NULL, 'towards');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('2', '6ab0c5af653728afc0fbe863', '6ab0c5af653728afc0fbe862', 'أي طرف', NULL, 'none');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('1', '6ab0c5af653728afc0fbe868', '6ab0c5af653728afc0fbe864', 'المقاول', NULL, 'towards');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('2', '6ab0c5af653728afc0fbe868', '6ab0c5af653728afc0fbe865', 'الاستشاري', NULL, 'then');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('3', '6ab0c5af653728afc0fbe868', '6ab0c5af653728afc0fbe866', 'الاستشاري', NULL, 'towards');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('4', '6ab0c5af653728afc0fbe868', '6ab0c5af653728afc0fbe867', 'المقاول', NULL, 'none');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('1', '6ab0c5af653728afc0fbe86c', '6ab0c5af653728afc0fbe869', 'الموقع', NULL, 'towards');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('2', '6ab0c5af653728afc0fbe86c', '6ab0c5af653728afc0fbe86a', 'الاستشاري', NULL, 'towards');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('3', '6ab0c5af653728afc0fbe86c', '6ab0c5af653728afc0fbe86b', 'المالك', NULL, 'none');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('1', '6ab0c5af653728afc0fbe870', '6ab0c5af653728afc0fbe86d', 'المالك', NULL, 'none');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('2', '6ab0c5af653728afc0fbe870', '6ab0c5af653728afc0fbe86e', 'الاستشاري', NULL, 'none');

INSERT INTO "product_page_journey_panels_flow" ("_order", "_parent_id", "id", "party_ar", "party_en", "after")
VALUES ('3', '6ab0c5af653728afc0fbe870', '6ab0c5af653728afc0fbe86f', 'المقاول', NULL, 'none');

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('1', '6ab0c5af653728afc0fbe87f', '6ab0c5af653728afc0fbe87c', 'مهندس الموقع', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('2', '6ab0c5af653728afc0fbe87f', '6ab0c5af653728afc0fbe87d', 'المكتب الفني', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('3', '6ab0c5af653728afc0fbe87f', '6ab0c5af653728afc0fbe87e', 'مدير المشروع', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('1', '6ab0c5af653728afc0fbe883', '6ab0c5af653728afc0fbe880', 'مهندس التخصص', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('2', '6ab0c5af653728afc0fbe883', '6ab0c5af653728afc0fbe881', 'مدير المراقبة', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('3', '6ab0c5af653728afc0fbe883', '6ab0c5af653728afc0fbe882', 'مدير المشروع', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('1', '6ab0c5af653728afc0fbe887', '6ab0c5af653728afc0fbe884', 'مدير المشروع', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('2', '6ab0c5af653728afc0fbe887', '6ab0c5af653728afc0fbe885', 'إدارة العقود', NULL);

INSERT INTO "product_page_reviewers" ("_order", "_parent_id", "id", "reviewer_ar", "reviewer_en")
VALUES ('3', '6ab0c5af653728afc0fbe887', '6ab0c5af653728afc0fbe886', 'صاحب القرار', NULL);
`;
