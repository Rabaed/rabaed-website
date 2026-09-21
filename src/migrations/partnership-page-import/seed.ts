/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260915_195430_import_partnership_page` (ticket 63).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const PARTNERSHIP_PAGE_SEED = `
INSERT INTO "_partnership_page_v" ("id", "version_hero_eyebrow_ar", "version_hero_eyebrow_en", "version_hero_title_ar", "version_hero_title_en", "version_hero_lead_ar", "version_hero_lead_en", "version_hero_primary_label_ar", "version_hero_primary_label_en", "version_hero_secondary_label_ar", "version_hero_secondary_label_en", "version_idea_shows", "version_idea_eyebrow_ar", "version_idea_eyebrow_en", "version_idea_heading_ar", "version_idea_heading_en", "version_idea_referral_note_text_ar", "version_idea_referral_note_text_en", "version_idea_referral_note_link_label_ar", "version_idea_referral_note_link_label_en", "version_audience_shows", "version_audience_eyebrow_ar", "version_audience_eyebrow_en", "version_audience_heading_ar", "version_audience_heading_en", "version_modes_shows", "version_modes_eyebrow_ar", "version_modes_eyebrow_en", "version_modes_heading_ar", "version_modes_heading_en", "version_modes_note_before_ar", "version_modes_note_before_en", "version_modes_note_bold_ar", "version_modes_note_bold_en", "version_modes_note_after_ar", "version_modes_note_after_en", "version_benefits_shows", "version_benefits_eyebrow_ar", "version_benefits_eyebrow_en", "version_benefits_heading_ar", "version_benefits_heading_en", "version_path_eyebrow_ar", "version_path_eyebrow_en", "version_path_heading_ar", "version_path_heading_en", "version_path_lead_ar", "version_path_lead_en", "version_path_link_label_ar", "version_path_link_label_en", "version_path_stage_label_ar", "version_path_stage_label_en", "version_questions_shows", "version_questions_eyebrow_ar", "version_questions_eyebrow_en", "version_questions_heading_ar", "version_questions_heading_en", "version_apply_eyebrow_ar", "version_apply_eyebrow_en", "version_apply_heading_ar", "version_apply_heading_en", "version_apply_lead_ar", "version_apply_lead_en", "version_apply_response_time_bold_ar", "version_apply_response_time_bold_en", "version_apply_response_time_text_ar", "version_apply_response_time_text_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'برنامج الشراكات', NULL, 'منصّة إدارة المشروع… ضمن عرضك أنت', NULL, 'شراكة ربائد للمكاتب الهندسية وشركات إدارة المشاريع ومجموعات المقاولات — نموذج تعاون يُصمَّم معك، لا باقة جاهزة تُعرض عليك.', NULL, 'اطلب اجتماع شراكة', NULL, 'كيف نبني الشراكة ↓', NULL, 'true', 'الفكرة', NULL, 'لماذا شراكة، لا عمولة؟', NULL, 'تبحث عن ترتيب فردي أبسط — كود تشاركه وتستلم عنه مبلغاً ثابتاً؟', NULL, 'انتقل إلى برنامج الإحالة ←', NULL, 'true', 'لمن هذا البرنامج', NULL, 'لمن هذا البرنامج', NULL, 'true', 'أنماط التعاون', NULL, 'ثلاثة أنماط — ونختار معك ما يناسب طريقة عملك', NULL, 'شروط كل نمط — التسعير، مدى الحصرية، حدود الجغرافيا أو نوع العميل — تُحدَّد في اتفاقية الشراكة بعد اجتماع تصميم النموذج.', NULL, 'لا نضع تسعيراً موحّداً', NULL, 'لأن المكاتب تختلف في حجمها وطبيعة عملائها.', NULL, 'true', 'ما يحصل عليه الشريك', NULL, 'ثمانية التزامات من طرفنا، مكتوبة في الاتفاقية', NULL, 'مسار الشراكة', NULL, 'من أول اجتماع إلى أول مشروع', NULL, 'أربع مراحل واضحة، ولا شيء منها يحتاج قراراً نهائياً منك قبل أن ترى المنصة كما يستخدمها الاستشاري فعلياً.', NULL, 'اطلب اجتماع شراكة', NULL, 'المرحلة', NULL, 'true', 'الأسئلة الشائعة', NULL, 'قبل الاجتماع الأول', NULL, 'طلب شراكة', NULL, 'خلّنا نجلس ونصمّم النموذج المناسب لمكتبك', NULL, 'املأ النموذج، ويتواصل معك فريق الشراكات خلال يومي عمل.', NULL, 'يوما عمل', NULL, 'مدة الرد على طلبك', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v"', 'id'), (SELECT max("id") FROM "_partnership_page_v"));

INSERT INTO "partnership_page" ("id", "hero_eyebrow_ar", "hero_eyebrow_en", "hero_title_ar", "hero_title_en", "hero_lead_ar", "hero_lead_en", "hero_primary_label_ar", "hero_primary_label_en", "hero_secondary_label_ar", "hero_secondary_label_en", "idea_shows", "idea_eyebrow_ar", "idea_eyebrow_en", "idea_heading_ar", "idea_heading_en", "idea_referral_note_text_ar", "idea_referral_note_text_en", "idea_referral_note_link_label_ar", "idea_referral_note_link_label_en", "audience_shows", "audience_eyebrow_ar", "audience_eyebrow_en", "audience_heading_ar", "audience_heading_en", "modes_shows", "modes_eyebrow_ar", "modes_eyebrow_en", "modes_heading_ar", "modes_heading_en", "modes_note_before_ar", "modes_note_before_en", "modes_note_bold_ar", "modes_note_bold_en", "modes_note_after_ar", "modes_note_after_en", "benefits_shows", "benefits_eyebrow_ar", "benefits_eyebrow_en", "benefits_heading_ar", "benefits_heading_en", "path_eyebrow_ar", "path_eyebrow_en", "path_heading_ar", "path_heading_en", "path_lead_ar", "path_lead_en", "path_link_label_ar", "path_link_label_en", "path_stage_label_ar", "path_stage_label_en", "questions_shows", "questions_eyebrow_ar", "questions_eyebrow_en", "questions_heading_ar", "questions_heading_en", "apply_eyebrow_ar", "apply_eyebrow_en", "apply_heading_ar", "apply_heading_en", "apply_lead_ar", "apply_lead_en", "apply_response_time_bold_ar", "apply_response_time_bold_en", "apply_response_time_text_ar", "apply_response_time_text_en", "_status", "updated_at", "created_at")
VALUES ('1', 'برنامج الشراكات', NULL, 'منصّة إدارة المشروع… ضمن عرضك أنت', NULL, 'شراكة ربائد للمكاتب الهندسية وشركات إدارة المشاريع ومجموعات المقاولات — نموذج تعاون يُصمَّم معك، لا باقة جاهزة تُعرض عليك.', NULL, 'اطلب اجتماع شراكة', NULL, 'كيف نبني الشراكة ↓', NULL, 'true', 'الفكرة', NULL, 'لماذا شراكة، لا عمولة؟', NULL, 'تبحث عن ترتيب فردي أبسط — كود تشاركه وتستلم عنه مبلغاً ثابتاً؟', NULL, 'انتقل إلى برنامج الإحالة ←', NULL, 'true', 'لمن هذا البرنامج', NULL, 'لمن هذا البرنامج', NULL, 'true', 'أنماط التعاون', NULL, 'ثلاثة أنماط — ونختار معك ما يناسب طريقة عملك', NULL, 'شروط كل نمط — التسعير، مدى الحصرية، حدود الجغرافيا أو نوع العميل — تُحدَّد في اتفاقية الشراكة بعد اجتماع تصميم النموذج.', NULL, 'لا نضع تسعيراً موحّداً', NULL, 'لأن المكاتب تختلف في حجمها وطبيعة عملائها.', NULL, 'true', 'ما يحصل عليه الشريك', NULL, 'ثمانية التزامات من طرفنا، مكتوبة في الاتفاقية', NULL, 'مسار الشراكة', NULL, 'من أول اجتماع إلى أول مشروع', NULL, 'أربع مراحل واضحة، ولا شيء منها يحتاج قراراً نهائياً منك قبل أن ترى المنصة كما يستخدمها الاستشاري فعلياً.', NULL, 'اطلب اجتماع شراكة', NULL, 'المرحلة', NULL, 'true', 'الأسئلة الشائعة', NULL, 'قبل الاجتماع الأول', NULL, 'طلب شراكة', NULL, 'خلّنا نجلس ونصمّم النموذج المناسب لمكتبك', NULL, 'املأ النموذج، ويتواصل معك فريق الشراكات خلال يومي عمل.', NULL, 'يوما عمل', NULL, 'مدة الرد على طلبك', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"partnership_page"', 'id'), (SELECT max("id") FROM "partnership_page"));

INSERT INTO "_partnership_page_v_version_apply_reassurances" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'لا رسوم انضمام، ولا التزام قبل اجتماع التعارف', NULL, '6ab0c5af653728afc0fbe8d0');

INSERT INTO "_partnership_page_v_version_apply_reassurances" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'الاجتماع الأول يشمل عرض المنصة', NULL, '6ab0c5af653728afc0fbe8d1');

INSERT INTO "_partnership_page_v_version_apply_reassurances" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'نموذج التعاون يُكتب في اتفاقية، لا في وعد شفهي', NULL, '6ab0c5af653728afc0fbe8d2');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_apply_reassurances"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_apply_reassurances"));

INSERT INTO "_partnership_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'المكاتب الهندسية الاستشارية', NULL, 'التي تشرف على مشاريع مطوّرين من القطاع الخاص.', NULL, '6ab0c5af653728afc0fbe8bd');

INSERT INTO "_partnership_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'شركات إدارة المشاريع (PMC)', NULL, 'التي تدير محافظ مشاريع لعملاء متعددين.', NULL, '6ab0c5af653728afc0fbe8be');

INSERT INTO "_partnership_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'مجموعات المقاولات', NULL, 'التي تنفّذ عدة مشاريع بالتوازي وتحتاج سجلاً موحّداً مع الاستشاري.', NULL, '6ab0c5af653728afc0fbe8bf');

INSERT INTO "_partnership_page_v_version_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('4', '1', '4', 'مطوّرون عقاريون متعددو المشاريع', NULL, 'الذين يريدون ترتيباً على مستوى المحفظة لا المشروع الواحد.', NULL, '6ab0c5af653728afc0fbe8c0');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_audience_kinds"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_audience_kinds"));

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'تسعير شريك', NULL, 'متفق عليه في الاتفاقية', NULL, '6ab0c5af653728afc0fbe8c4');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'مدير حساب مخصص', NULL, 'ونقطة تواصل واحدة', NULL, '6ab0c5af653728afc0fbe8c5');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'تأهيل فريقك', NULL, 'على المنصة، وإعادة التأهيل عند انضمام موظفين جدد', NULL, '6ab0c5af653728afc0fbe8c6');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('4', '1', '4', 'دعم فني بأولوية', NULL, 'لمشاريعك ولعملائك', NULL, '6ab0c5af653728afc0fbe8c7');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('5', '1', '5', 'إعداد المشروع نيابةً عنك', NULL, 'عند الإطلاق: هيكل المستندات، الصلاحيات، أرقام المرجع', NULL, '6ab0c5af653728afc0fbe8c8');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('6', '1', '6', 'لوحة شريك', NULL, 'تعرض مشاريعك النشطة وحالة كل منها', NULL, '6ab0c5af653728afc0fbe8c9');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('7', '1', '7', 'تسويق مشترك', NULL, '— ورش عمل، محتوى، وظهور مشترك في فعاليات القطاع', NULL, '6ab0c5af653728afc0fbe8ca');

INSERT INTO "_partnership_page_v_version_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en", "_uuid")
VALUES ('8', '1', '8', 'أولوية في خارطة الطريق', NULL, 'لطلبات التطوير المتكررة من مشاريعك', NULL, '6ab0c5af653728afc0fbe8cb');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_benefits_benefits"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_benefits_benefits"));

INSERT INTO "_partnership_page_v_version_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en", "_uuid")
VALUES ('1', '1', '1', '3 أنماط', NULL, 'للتعاون، تختار معنا الأنسب', NULL, '6ab0c5af653728afc0fbe8b8');

INSERT INTO "_partnership_page_v_version_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en", "_uuid")
VALUES ('2', '1', '2', '4 مراحل', NULL, 'من أول اجتماع إلى أول مشروع', NULL, '6ab0c5af653728afc0fbe8b9');

INSERT INTO "_partnership_page_v_version_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en", "_uuid")
VALUES ('3', '1', '3', 'بلا رسوم', NULL, 'لا رسوم انضمام للبرنامج', NULL, '6ab0c5af653728afc0fbe8ba');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_hero_figures"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_hero_figures"));

INSERT INTO "_partnership_page_v_version_idea_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'المكتب الذي يشرف على عشرة مشاريع في وقت واحد ليس «مُحيلاً». هو الطرف الذي يعيش على المنصة يومياً، ويُدخل الاعتمادات والملاحظات وتقارير الموقع، وهو من يقنع المالك بأسلوب عمل أفضل.', NULL, '6ab0c5af653728afc0fbe8bb');

INSERT INTO "_partnership_page_v_version_idea_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'ولذلك لا نعرض على المكاتب عمولة على ترشيح. نجلس معك، ونفهم كيف تبيع خدماتك اليوم وكيف تفوتر عميلك، ثم نبني نموذج تعاون يناسب ذلك — تسعير شريك، رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.', NULL, '6ab0c5af653728afc0fbe8bc');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_idea_paragraphs"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_idea_paragraphs"));

INSERT INTO "_partnership_page_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_languages"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_languages"));

INSERT INTO "_partnership_page_v_version_modes_modes" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "fit_ar", "fit_en", "_uuid")
VALUES ('1', '1', '1', 'التضمين في العرض', NULL, 'المنصة ضمن نطاق خدماتك', NULL, 'تُدرج المنصة ضمن نطاق خدماتك في العرض الذي تقدّمه للمالك، وتفوترها ضمن أتعابك. يحصل المكتب على تسعير شريك، وتبقى علاقة العميل التعاقدية معك.', NULL, 'مناسب لـ: المكاتب التي تريد تمييز عرضها الفني وإضافة مصدر دخل ضمن الأتعاب.', NULL, '6ab0c5af653728afc0fbe8c1');

INSERT INTO "_partnership_page_v_version_modes_modes" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "fit_ar", "fit_en", "_uuid")
VALUES ('2', '1', '2', 'رخصة المكتب', NULL, 'اشتراك على مستوى المكتب', NULL, 'يغطي مشاريعه القائمة والجديدة تحت مظلة واحدة، بلوحة إشراف موحّدة على كل المشاريع.', NULL, 'مناسب لـ: المكاتب التي تدير عدداً ثابتاً من المشاريع وتريد توحيد أسلوب العمل عليها كلها.', NULL, '6ab0c5af653728afc0fbe8c2');

INSERT INTO "_partnership_page_v_version_modes_modes" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "fit_ar", "fit_en", "_uuid")
VALUES ('3', '1', '3', 'الترشيح المعتمد', NULL, 'نتعاقد نحن مع المالك', NULL, 'ترشّح المنصة للمالك ونتعاقد نحن معه مباشرة، مع ترتيب متفق عليه للمكتب وأولوية في الدعم على مشاريعه.', NULL, 'مناسب لـ: المكاتب التي تفضّل ألا تدخل المنصة في فوترتها مع العميل.', NULL, '6ab0c5af653728afc0fbe8c3');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_modes_modes"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_modes_modes"));

INSERT INTO "_partnership_page_v_version_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('1', '1', '1', 'اجتماع تعارف', NULL, 'جلسة نفهم فيها حجم مكتبك، طبيعة عملائك، وكيف تُبنى عروضك اليوم. ونعرض المنصة كما يستخدمها الاستشاري فعلياً.', NULL, '6ab0c5af653728afc0fbe8cc');

INSERT INTO "_partnership_page_v_version_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('2', '1', '2', 'تصميم نموذج التعاون', NULL, 'نتفق على النمط، وآليات التسعير، والالتزامات المتبادلة، ومؤشرات النجاح.', NULL, '6ab0c5af653728afc0fbe8cd');

INSERT INTO "_partnership_page_v_version_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('3', '1', '3', 'الاتفاقية والتأهيل', NULL, 'توقيع اتفاقية الشراكة، وتأهيل فريقك، وتجهيز المواد التي تحتاجها لعرض المنصة على عملائك.', NULL, '6ab0c5af653728afc0fbe8ce');

INSERT INTO "_partnership_page_v_version_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en", "_uuid")
VALUES ('4', '1', '4', 'الإطلاق على أول مشروع', NULL, 'نُطلق معك على مشروع واحد كنموذج، ونتابع معك أولاً بأول حتى يستقر العمل.', NULL, '6ab0c5af653728afc0fbe8cf');

SELECT setval(pg_get_serial_sequence('"_partnership_page_v_version_path_stages"', 'id'), (SELECT max("id") FROM "_partnership_page_v_version_path_stages"));

INSERT INTO "partnership_page_apply_reassurances" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8d0', 'لا رسوم انضمام، ولا التزام قبل اجتماع التعارف', NULL);

INSERT INTO "partnership_page_apply_reassurances" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8d1', 'الاجتماع الأول يشمل عرض المنصة', NULL);

INSERT INTO "partnership_page_apply_reassurances" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8d2', 'نموذج التعاون يُكتب في اتفاقية، لا في وعد شفهي', NULL);

INSERT INTO "partnership_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8bd', 'المكاتب الهندسية الاستشارية', NULL, 'التي تشرف على مشاريع مطوّرين من القطاع الخاص.', NULL);

INSERT INTO "partnership_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8be', 'شركات إدارة المشاريع (PMC)', NULL, 'التي تدير محافظ مشاريع لعملاء متعددين.', NULL);

INSERT INTO "partnership_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8bf', 'مجموعات المقاولات', NULL, 'التي تنفّذ عدة مشاريع بالتوازي وتحتاج سجلاً موحّداً مع الاستشاري.', NULL);

INSERT INTO "partnership_page_audience_kinds" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8c0', 'مطوّرون عقاريون متعددو المشاريع', NULL, 'الذين يريدون ترتيباً على مستوى المحفظة لا المشروع الواحد.', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8c4', 'تسعير شريك', NULL, 'متفق عليه في الاتفاقية', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8c5', 'مدير حساب مخصص', NULL, 'ونقطة تواصل واحدة', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8c6', 'تأهيل فريقك', NULL, 'على المنصة، وإعادة التأهيل عند انضمام موظفين جدد', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8c7', 'دعم فني بأولوية', NULL, 'لمشاريعك ولعملائك', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('5', '1', '6ab0c5af653728afc0fbe8c8', 'إعداد المشروع نيابةً عنك', NULL, 'عند الإطلاق: هيكل المستندات، الصلاحيات، أرقام المرجع', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('6', '1', '6ab0c5af653728afc0fbe8c9', 'لوحة شريك', NULL, 'تعرض مشاريعك النشطة وحالة كل منها', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('7', '1', '6ab0c5af653728afc0fbe8ca', 'تسويق مشترك', NULL, '— ورش عمل، محتوى، وظهور مشترك في فعاليات القطاع', NULL);

INSERT INTO "partnership_page_benefits_benefits" ("_order", "_parent_id", "id", "bold_ar", "bold_en", "text_ar", "text_en")
VALUES ('8', '1', '6ab0c5af653728afc0fbe8cb', 'أولوية في خارطة الطريق', NULL, 'لطلبات التطوير المتكررة من مشاريعك', NULL);

INSERT INTO "partnership_page_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8b8', '3 أنماط', NULL, 'للتعاون، تختار معنا الأنسب', NULL);

INSERT INTO "partnership_page_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8b9', '4 مراحل', NULL, 'من أول اجتماع إلى أول مشروع', NULL);

INSERT INTO "partnership_page_hero_figures" ("_order", "_parent_id", "id", "figure_ar", "figure_en", "label_ar", "label_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8ba', 'بلا رسوم', NULL, 'لا رسوم انضمام للبرنامج', NULL);

INSERT INTO "partnership_page_idea_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8bb', 'المكتب الذي يشرف على عشرة مشاريع في وقت واحد ليس «مُحيلاً». هو الطرف الذي يعيش على المنصة يومياً، ويُدخل الاعتمادات والملاحظات وتقارير الموقع، وهو من يقنع المالك بأسلوب عمل أفضل.', NULL);

INSERT INTO "partnership_page_idea_paragraphs" ("_order", "_parent_id", "id", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8bc', 'ولذلك لا نعرض على المكاتب عمولة على ترشيح. نجلس معك، ونفهم كيف تبيع خدماتك اليوم وكيف تفوتر عميلك، ثم نبني نموذج تعاون يناسب ذلك — تسعير شريك، رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.', NULL);

INSERT INTO "partnership_page_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"partnership_page_languages"', 'id'), (SELECT max("id") FROM "partnership_page_languages"));

INSERT INTO "partnership_page_modes_modes" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "fit_ar", "fit_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8c1', 'التضمين في العرض', NULL, 'المنصة ضمن نطاق خدماتك', NULL, 'تُدرج المنصة ضمن نطاق خدماتك في العرض الذي تقدّمه للمالك، وتفوترها ضمن أتعابك. يحصل المكتب على تسعير شريك، وتبقى علاقة العميل التعاقدية معك.', NULL, 'مناسب لـ: المكاتب التي تريد تمييز عرضها الفني وإضافة مصدر دخل ضمن الأتعاب.', NULL);

INSERT INTO "partnership_page_modes_modes" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "fit_ar", "fit_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8c2', 'رخصة المكتب', NULL, 'اشتراك على مستوى المكتب', NULL, 'يغطي مشاريعه القائمة والجديدة تحت مظلة واحدة، بلوحة إشراف موحّدة على كل المشاريع.', NULL, 'مناسب لـ: المكاتب التي تدير عدداً ثابتاً من المشاريع وتريد توحيد أسلوب العمل عليها كلها.', NULL);

INSERT INTO "partnership_page_modes_modes" ("_order", "_parent_id", "id", "label_ar", "label_en", "title_ar", "title_en", "text_ar", "text_en", "fit_ar", "fit_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8c3', 'الترشيح المعتمد', NULL, 'نتعاقد نحن مع المالك', NULL, 'ترشّح المنصة للمالك ونتعاقد نحن معه مباشرة، مع ترتيب متفق عليه للمكتب وأولوية في الدعم على مشاريعه.', NULL, 'مناسب لـ: المكاتب التي تفضّل ألا تدخل المنصة في فوترتها مع العميل.', NULL);

INSERT INTO "partnership_page_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('1', '1', '6ab0c5af653728afc0fbe8cc', 'اجتماع تعارف', NULL, 'جلسة نفهم فيها حجم مكتبك، طبيعة عملائك، وكيف تُبنى عروضك اليوم. ونعرض المنصة كما يستخدمها الاستشاري فعلياً.', NULL);

INSERT INTO "partnership_page_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('2', '1', '6ab0c5af653728afc0fbe8cd', 'تصميم نموذج التعاون', NULL, 'نتفق على النمط، وآليات التسعير، والالتزامات المتبادلة، ومؤشرات النجاح.', NULL);

INSERT INTO "partnership_page_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('3', '1', '6ab0c5af653728afc0fbe8ce', 'الاتفاقية والتأهيل', NULL, 'توقيع اتفاقية الشراكة، وتأهيل فريقك، وتجهيز المواد التي تحتاجها لعرض المنصة على عملائك.', NULL);

INSERT INTO "partnership_page_path_stages" ("_order", "_parent_id", "id", "title_ar", "title_en", "text_ar", "text_en")
VALUES ('4', '1', '6ab0c5af653728afc0fbe8cf', 'الإطلاق على أول مشروع', NULL, 'نُطلق معك على مشروع واحد كنموذج، ونتابع معك أولاً بأول حتى يستقر العمل.', NULL);
`;
