/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260915_040105_import_start_page` (ticket 63).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const START_PAGE_SEED = `
INSERT INTO "_start_page_v" ("id", "version_hero_eyebrow_ar", "version_hero_eyebrow_en", "version_hero_title_ar", "version_hero_title_en", "version_hero_lead_ar", "version_hero_lead_en", "version_hero_primary_label_ar", "version_hero_primary_label_en", "version_hero_secondary_label_ar", "version_hero_secondary_label_en", "version_trust_strip_shows", "version_steps_shows", "version_steps_eyebrow_ar", "version_steps_eyebrow_en", "version_steps_heading_ar", "version_steps_heading_en", "version_questions_eyebrow_ar", "version_questions_eyebrow_en", "version_questions_heading_ar", "version_questions_heading_en", "version_free_tool_shows", "version_free_tool_eyebrow_ar", "version_free_tool_eyebrow_en", "version_free_tool_heading_ar", "version_free_tool_heading_en", "version_free_tool_text_ar", "version_free_tool_text_en", "version_free_tool_link_label_ar", "version_free_tool_link_label_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'ابدأ', NULL, 'كيف نبدأ معك — وكل ما قد تسأل عنه.', NULL, 'ثلاث خطوات حتى التشغيل، وإجابات صريحة عن الاشتراك والضمان والنماذج والسجل بعد نهاية المشروع.', NULL, 'احجز عرضاً حياً', NULL, 'الأسئلة الشائعة ↓', NULL, 'true', 'true', 'كيف نبدأ معك', NULL, 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.', NULL, 'الأسئلة الشائعة', NULL, 'قبل أن تسأل', NULL, 'true', 'أداة مجانية', NULL, 'سجل صبّات الخرسانة ونتائج التكسير', NULL, 'أداة مستقلة تعمل بلا حساب وبلا إنترنت — للمهندس في الموقع. من فريق ربائد.', NULL, 'تحميل الأداة', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_start_page_v"', 'id'), (SELECT max("id") FROM "_start_page_v"));

INSERT INTO "start_page" ("id", "hero_eyebrow_ar", "hero_eyebrow_en", "hero_title_ar", "hero_title_en", "hero_lead_ar", "hero_lead_en", "hero_primary_label_ar", "hero_primary_label_en", "hero_secondary_label_ar", "hero_secondary_label_en", "trust_strip_shows", "steps_shows", "steps_eyebrow_ar", "steps_eyebrow_en", "steps_heading_ar", "steps_heading_en", "questions_eyebrow_ar", "questions_eyebrow_en", "questions_heading_ar", "questions_heading_en", "free_tool_shows", "free_tool_eyebrow_ar", "free_tool_eyebrow_en", "free_tool_heading_ar", "free_tool_heading_en", "free_tool_text_ar", "free_tool_text_en", "free_tool_link_label_ar", "free_tool_link_label_en", "_status", "updated_at", "created_at")
VALUES ('1', 'ابدأ', NULL, 'كيف نبدأ معك — وكل ما قد تسأل عنه.', NULL, 'ثلاث خطوات حتى التشغيل، وإجابات صريحة عن الاشتراك والضمان والنماذج والسجل بعد نهاية المشروع.', NULL, 'احجز عرضاً حياً', NULL, 'الأسئلة الشائعة ↓', NULL, 'true', 'true', 'كيف نبدأ معك', NULL, 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.', NULL, 'الأسئلة الشائعة', NULL, 'قبل أن تسأل', NULL, 'true', 'أداة مجانية', NULL, 'سجل صبّات الخرسانة ونتائج التكسير', NULL, 'أداة مستقلة تعمل بلا حساب وبلا إنترنت — للمهندس في الموقع. من فريق ربائد.', NULL, 'تحميل الأداة', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"start_page"', 'id'), (SELECT max("id") FROM "start_page"));

INSERT INTO "_start_page_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_start_page_v_version_languages"', 'id'), (SELECT max("id") FROM "_start_page_v_version_languages"));

INSERT INTO "_start_page_v_version_steps_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('1', '1', '1', 'إعداد', NULL, 'المشروع، الأطراف، النماذج', NULL, 'فريقنا يُعدّ المشروع ويدعو المالك والاستشاري والمقاول، ويجلس مع كل فريق 15 دقيقة.', NULL, 'false', '6ab0c5ae653728afc0fbe85b');

INSERT INTO "_start_page_v_version_steps_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('2', '1', '2', 'تشغيل', NULL, 'أقل من يوم — دون توقف للعمل', NULL, 'يبدأ الجميع من حيث وصل المشروع. لا تدريب، ولا فترة انتقالية.', NULL, 'false', '6ab0c5ae653728afc0fbe85c');

INSERT INTO "_start_page_v_version_steps_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out", "_uuid")
VALUES ('3', '1', '3', 'ضمان', NULL, '60 يوماً — أو نعيد المبلغ', NULL, 'شغّلوها على مشروع حقيقي. إن قررتم التوقف خلال 60 يوماً من التفعيل، نعيد كامل المبلغ.', NULL, 'true', '6ab0c5ae653728afc0fbe85d');

SELECT setval(pg_get_serial_sequence('"_start_page_v_version_steps_steps"', 'id'), (SELECT max("id") FROM "_start_page_v_version_steps_steps"));

INSERT INTO "start_page_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"start_page_languages"', 'id'), (SELECT max("id") FROM "start_page_languages"));

INSERT INTO "start_page_steps_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('1', '1', '6ab0c5ae653728afc0fbe85b', 'إعداد', NULL, 'المشروع، الأطراف، النماذج', NULL, 'فريقنا يُعدّ المشروع ويدعو المالك والاستشاري والمقاول، ويجلس مع كل فريق 15 دقيقة.', NULL, 'false');

INSERT INTO "start_page_steps_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('2', '1', '6ab0c5ae653728afc0fbe85c', 'تشغيل', NULL, 'أقل من يوم — دون توقف للعمل', NULL, 'يبدأ الجميع من حيث وصل المشروع. لا تدريب، ولا فترة انتقالية.', NULL, 'false');

INSERT INTO "start_page_steps_steps" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "marked_out")
VALUES ('3', '1', '6ab0c5ae653728afc0fbe85d', 'ضمان', NULL, '60 يوماً — أو نعيد المبلغ', NULL, 'شغّلوها على مشروع حقيقي. إن قررتم التوقف خلال 60 يوماً من التفعيل، نعيد كامل المبلغ.', NULL, 'true');
`;
