/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260914_193520_import_faq_entries` (ticket 68).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `entries.ts` beside this, which is what to read.
 */
export const FAQ_ENTRIES_SEED = `
INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('1', 'a0', 'كيف يعمل الاشتراك؟', 'الاشتراك سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.', 'home', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('2', 'a1', 'وإن لم يناسبنا بعد التشغيل؟', 'ضمان 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.', 'home', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('3', 'a2', 'كم يحتاج التشغيل؟', 'أيام لا شهور. فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.', 'home', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('4', 'a3', 'كيف يعمل الاشتراك؟', 'الاشتراك سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('5', 'a4', 'وإن لم يناسبنا بعد التشغيل؟', 'ضمان 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('6', 'a5', 'كم يحتاج التشغيل؟', 'أيام لا شهور. فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('7', 'a6', 'هل النماذج سعودية؟', 'نعم. طلبات تسليم الأعمال WIR وفحص المواد MIR وعدم المطابقة NCR والاعتمادات والخطابات — بالعربية وبالصيغ المتعارف عليها في مشاريعنا، وتُخصَّص لكل مشروع.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('8', 'a7', 'مشروعنا قائم منذ سنة — ينفع؟', 'نعم. نبدأ من حيث وصلتم: تُرفع المستندات المعتمدة الحالية، وتبدأ الطلبات الجديدة من اليوم الأول على المنصة.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('9', 'a8', 'ماذا يحدث للسجل بعد نهاية المشروع أو الاشتراك؟', 'السجل ملكك. تختار إما استمرار الوصول إليه باشتراك سنوي رمزي يُحسب حسب حجم البيانات عند نهاية المشروع، أو استلام نسخة كاملة منه على قرص خارجي.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('10', 'a9', 'هل يدعم الإنجليزية للفرق غير العربية؟', 'نعم. الواجهة عربية أولاً، وتتوفر بالإنجليزية للمهندسين غير الناطقين بالعربية في نفس المشروع.', 'start', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('11', 'aa', 'هل هي مجانية فعلاً؟', 'نعم. نسخة كاملة تعمل لمشروع واحد، بلا حد زمني ولا نسخة تجريبية ولا علامة مائية على الطباعة. نحن نصنع نسخة سحابية مدفوعة للفرق التي تدير عدة مشاريع، وهذه الأداة هي نصفها الفردي — تعمل وحدها بالكامل.', 'tool', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('12', 'ab', 'أين تُحفظ بياناتي بالضبط؟', 'في المجلد الذي تختاره أنت على جهازك: ملف \`concrete_db.json\` يحوي كل صبّة واختبار وحالة وتاريخ، ومجلد \`attachments\` يحوي نسخاً من التقارير والصور. لا شيء يُرفع إلى أي خادم — لا يوجد خادم أصلاً.', 'tool', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('13', 'ac', 'هل تعمل بدون إنترنت؟', 'نعم، بالكامل. الشيء الوحيد الذي يُجلب من الإنترنت هو ملفا الخطوط عند أول فتح. بدون إنترنت يستخدم المتصفح خط النظام، ويبقى كل شيء — الحفظ، المرفقات، الطباعة — يعمل كما هو.', 'tool', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('14', 'ad', 'كم مشروعاً تدعم؟', 'مجلد واحد = مشروع واحد. تقدر تفتح مجلداً آخر لمشروع آخر، لكن كل مجلد مستقل بذاته. لو تحتاج كل مشاريعك في لوحة واحدة مع مقارنة بينها، هذا ما تفعله النسخة السحابية.', 'tool', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('15', 'ae', 'هل أقدر أشاركها مع فريقي؟', 'الملف نفسه نعم — أرسله لمن تشاء، لا يوجد ترخيص ولا مفتاح تفعيل. لكن انتبه: كل نسخة تعمل على مجلدها الخاص، فلا يوجد سجل مشترك بين شخصين ولا اعتماد إلكتروني من الاستشاري. المشاركة الحقيقية هي ما تضيفه النسخة السحابية.', 'tool', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('16', 'af', 'ما الفرق بينها وبين النسخة السحابية؟', 'النسخة المجانية تحل مشكلة المهندس الفرد على مشروع واحد. النسخة السحابية تحل مشكلة الشركة: كل المشاريع في لوحة واحدة، اعتماد إلكتروني فوري من الاستشاري، حساب للمختبر يرفع تقريره بنفسه، ربط مع بقية منصة ربائد (إدارة الوثائق والتقارير اليومية والمراسلات)، وسجل تدقيق موثّق.', 'tool', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('17', 'ag', 'هل أحتاج سجلاً تجارياً؟', 'لا. البرنامج مفتوح للأفراد. يكفي أن تسجّل بياناتك وترفع شهادة الآيبان. وإن كان لديك سجل تجاري وشهادة تسجيل ضريبي، يمكنك إرفاقهما اختيارياً.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('18', 'ah', 'متى بالضبط أستلم المبلغ؟', 'عند تحصيل قيمة الاشتراك من العميل. يُصرف المبلغ خلال 7 أيام عمل من نهاية ذلك الشهر.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('19', 'ai', 'هل أحتاج أن أبيع أو أتابع العميل؟', 'لا. دورك ينتهي عند مشاركة الكود. فريقنا يتولّى العرض والتفاوض والتعاقد والتفعيل.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('20', 'aj', 'عميلي عنده أكثر من مشروع — كيف تُحتسب؟', 'الإحالة بالمشروع. إن استُخدم كودك عند بدء مشروع ثانٍ، تُحتسب إحالة جديدة بـ {payout} ريال أخرى.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('21', 'ak', 'ماذا لو استخدم شخصان كودين مختلفين لنفس المشروع؟', 'يُعتمد الكود الذي وصلنا أولاً مع طلب العرض التوضيحي.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('22', 'al', 'هل هناك حد أقصى للمبالغ؟', 'لا. لا حد على عدد المشاريع ولا على إجمالي ما تستلمه.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('23', 'am', 'هل أستطيع نشر كودي على حساباتي؟', 'الكود شخصي ومخصص لمشاركته مباشرة مع من تعرفه. نشره كإعلان عام للخصم غير مسموح، ويحق لنا إيقاف الكود في هذه الحالة.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('24', 'an', 'كم يستغرق الأمر من مشاركة الكود حتى الاستحقاق؟', 'يعتمد على المطوّر ودورة قراره. في المتوسط بين ثلاثة وثمانية أسابيع من أول عرض توضيحي.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('25', 'ao', 'أعمل لدى جهة قد يُعدّ هذا تعارضاً معها — ماذا أفعل؟', 'مسؤوليتك أن تتأكد من عدم وجود ما يمنعك من قبول المقابل، وهذا ما يغطّيه الإقرار الذي توقّعه عند التسجيل.', 'referral', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('26', 'ap', 'كم تكلفة الشراكة؟', 'لا توجد رسوم انضمام. أما تسعير المنصة للشريك فيُحدَّد في اجتماع تصميم النموذج، لأنه يختلف باختلاف النمط وحجم المحفظة.', 'partnership', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('27', 'aq', 'هل تتعاملون مباشرة مع عملائي؟', 'يعتمد على النمط. في نمط التضمين تبقى العلاقة التعاقدية معك بالكامل، ونتعامل نحن مع فريق المشروع فنياً فقط.', 'partnership', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('28', 'ar', 'ماذا يحدث للمشروع إذا انتهت علاقتي بالعميل في منتصفه؟', 'هذه إحدى النقاط التي تُعالَج صراحةً في اتفاقية الشراكة، بما يضمن استمرار المشروع دون انقطاع وحفظ حقوق الطرفين.', 'partnership', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('29', 'as', 'هل هناك حد أدنى من المشاريع للانضمام؟', 'لا حد معلن. لكن الأنماط تختلف بحسب حجم المحفظة، وسنقترح عليك الأنسب بعد الاجتماع الأول.', 'partnership', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('30', 'at', 'هل يمكن الجمع بين أكثر من نمط؟', 'نعم، بعض الشركاء يبدأون بالترشيح المعتمد وينتقلون إلى التضمين بعد أول مشروعين.', 'partnership', 'ar', 'true', now(), now(), 'published');

INSERT INTO "faq_entries" ("id", "_order", "question", "answer", "page", "locale", "shows", "updated_at", "created_at", "_status")
VALUES ('31', 'au', 'نحن مكتب صغير — هل البرنامج لنا؟', 'نعم. المشاريع المتوسطة هي تركيزنا، والمكاتب المتوسطة والصغيرة هي شريحتنا الأساسية.', 'partnership', 'ar', 'true', now(), now(), 'published');

SELECT setval(pg_get_serial_sequence('"faq_entries"', 'id'), (SELECT max("id") FROM "faq_entries"));

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('1', '1', 'a0', 'كيف يعمل الاشتراك؟', 'الاشتراك سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.', 'home', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('2', '2', 'a1', 'وإن لم يناسبنا بعد التشغيل؟', 'ضمان 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.', 'home', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('3', '3', 'a2', 'كم يحتاج التشغيل؟', 'أيام لا شهور. فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.', 'home', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('4', '4', 'a3', 'كيف يعمل الاشتراك؟', 'الاشتراك سنوي لكل مشروع، ويغطي جميع أطرافه ومستخدميه بلا تكلفة إضافية عليهم. وإن كان لديكم أكثر من مشروع نشط، فهناك خصم للمشاريع المتعددة يزيد كلما زاد عددها.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('5', '5', 'a4', 'وإن لم يناسبنا بعد التشغيل؟', 'ضمان 60 يوماً من تاريخ التفعيل: إن قررتم التوقف خلالها نعيد كامل المبلغ المدفوع، ونسلّمكم نسخة كاملة من سجل مشروعكم. السجل ملككم في كل الأحوال.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('6', '6', 'a5', 'كم يحتاج التشغيل؟', 'أيام لا شهور. فريقنا يأتي إلى موقعك، يُعدّ المشروع والنماذج والأطراف، ويبدأ الجميع من حيث وصل المشروع.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('7', '7', 'a6', 'هل النماذج سعودية؟', 'نعم. طلبات تسليم الأعمال WIR وفحص المواد MIR وعدم المطابقة NCR والاعتمادات والخطابات — بالعربية وبالصيغ المتعارف عليها في مشاريعنا، وتُخصَّص لكل مشروع.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('8', '8', 'a7', 'مشروعنا قائم منذ سنة — ينفع؟', 'نعم. نبدأ من حيث وصلتم: تُرفع المستندات المعتمدة الحالية، وتبدأ الطلبات الجديدة من اليوم الأول على المنصة.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('9', '9', 'a8', 'ماذا يحدث للسجل بعد نهاية المشروع أو الاشتراك؟', 'السجل ملكك. تختار إما استمرار الوصول إليه باشتراك سنوي رمزي يُحسب حسب حجم البيانات عند نهاية المشروع، أو استلام نسخة كاملة منه على قرص خارجي.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('10', '10', 'a9', 'هل يدعم الإنجليزية للفرق غير العربية؟', 'نعم. الواجهة عربية أولاً، وتتوفر بالإنجليزية للمهندسين غير الناطقين بالعربية في نفس المشروع.', 'start', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('11', '11', 'aa', 'هل هي مجانية فعلاً؟', 'نعم. نسخة كاملة تعمل لمشروع واحد، بلا حد زمني ولا نسخة تجريبية ولا علامة مائية على الطباعة. نحن نصنع نسخة سحابية مدفوعة للفرق التي تدير عدة مشاريع، وهذه الأداة هي نصفها الفردي — تعمل وحدها بالكامل.', 'tool', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('12', '12', 'ab', 'أين تُحفظ بياناتي بالضبط؟', 'في المجلد الذي تختاره أنت على جهازك: ملف \`concrete_db.json\` يحوي كل صبّة واختبار وحالة وتاريخ، ومجلد \`attachments\` يحوي نسخاً من التقارير والصور. لا شيء يُرفع إلى أي خادم — لا يوجد خادم أصلاً.', 'tool', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('13', '13', 'ac', 'هل تعمل بدون إنترنت؟', 'نعم، بالكامل. الشيء الوحيد الذي يُجلب من الإنترنت هو ملفا الخطوط عند أول فتح. بدون إنترنت يستخدم المتصفح خط النظام، ويبقى كل شيء — الحفظ، المرفقات، الطباعة — يعمل كما هو.', 'tool', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('14', '14', 'ad', 'كم مشروعاً تدعم؟', 'مجلد واحد = مشروع واحد. تقدر تفتح مجلداً آخر لمشروع آخر، لكن كل مجلد مستقل بذاته. لو تحتاج كل مشاريعك في لوحة واحدة مع مقارنة بينها، هذا ما تفعله النسخة السحابية.', 'tool', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('15', '15', 'ae', 'هل أقدر أشاركها مع فريقي؟', 'الملف نفسه نعم — أرسله لمن تشاء، لا يوجد ترخيص ولا مفتاح تفعيل. لكن انتبه: كل نسخة تعمل على مجلدها الخاص، فلا يوجد سجل مشترك بين شخصين ولا اعتماد إلكتروني من الاستشاري. المشاركة الحقيقية هي ما تضيفه النسخة السحابية.', 'tool', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('16', '16', 'af', 'ما الفرق بينها وبين النسخة السحابية؟', 'النسخة المجانية تحل مشكلة المهندس الفرد على مشروع واحد. النسخة السحابية تحل مشكلة الشركة: كل المشاريع في لوحة واحدة، اعتماد إلكتروني فوري من الاستشاري، حساب للمختبر يرفع تقريره بنفسه، ربط مع بقية منصة ربائد (إدارة الوثائق والتقارير اليومية والمراسلات)، وسجل تدقيق موثّق.', 'tool', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('17', '17', 'ag', 'هل أحتاج سجلاً تجارياً؟', 'لا. البرنامج مفتوح للأفراد. يكفي أن تسجّل بياناتك وترفع شهادة الآيبان. وإن كان لديك سجل تجاري وشهادة تسجيل ضريبي، يمكنك إرفاقهما اختيارياً.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('18', '18', 'ah', 'متى بالضبط أستلم المبلغ؟', 'عند تحصيل قيمة الاشتراك من العميل. يُصرف المبلغ خلال 7 أيام عمل من نهاية ذلك الشهر.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('19', '19', 'ai', 'هل أحتاج أن أبيع أو أتابع العميل؟', 'لا. دورك ينتهي عند مشاركة الكود. فريقنا يتولّى العرض والتفاوض والتعاقد والتفعيل.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('20', '20', 'aj', 'عميلي عنده أكثر من مشروع — كيف تُحتسب؟', 'الإحالة بالمشروع. إن استُخدم كودك عند بدء مشروع ثانٍ، تُحتسب إحالة جديدة بـ {payout} ريال أخرى.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('21', '21', 'ak', 'ماذا لو استخدم شخصان كودين مختلفين لنفس المشروع؟', 'يُعتمد الكود الذي وصلنا أولاً مع طلب العرض التوضيحي.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('22', '22', 'al', 'هل هناك حد أقصى للمبالغ؟', 'لا. لا حد على عدد المشاريع ولا على إجمالي ما تستلمه.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('23', '23', 'am', 'هل أستطيع نشر كودي على حساباتي؟', 'الكود شخصي ومخصص لمشاركته مباشرة مع من تعرفه. نشره كإعلان عام للخصم غير مسموح، ويحق لنا إيقاف الكود في هذه الحالة.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('24', '24', 'an', 'كم يستغرق الأمر من مشاركة الكود حتى الاستحقاق؟', 'يعتمد على المطوّر ودورة قراره. في المتوسط بين ثلاثة وثمانية أسابيع من أول عرض توضيحي.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('25', '25', 'ao', 'أعمل لدى جهة قد يُعدّ هذا تعارضاً معها — ماذا أفعل؟', 'مسؤوليتك أن تتأكد من عدم وجود ما يمنعك من قبول المقابل، وهذا ما يغطّيه الإقرار الذي توقّعه عند التسجيل.', 'referral', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('26', '26', 'ap', 'كم تكلفة الشراكة؟', 'لا توجد رسوم انضمام. أما تسعير المنصة للشريك فيُحدَّد في اجتماع تصميم النموذج، لأنه يختلف باختلاف النمط وحجم المحفظة.', 'partnership', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('27', '27', 'aq', 'هل تتعاملون مباشرة مع عملائي؟', 'يعتمد على النمط. في نمط التضمين تبقى العلاقة التعاقدية معك بالكامل، ونتعامل نحن مع فريق المشروع فنياً فقط.', 'partnership', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('28', '28', 'ar', 'ماذا يحدث للمشروع إذا انتهت علاقتي بالعميل في منتصفه؟', 'هذه إحدى النقاط التي تُعالَج صراحةً في اتفاقية الشراكة، بما يضمن استمرار المشروع دون انقطاع وحفظ حقوق الطرفين.', 'partnership', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('29', '29', 'as', 'هل هناك حد أدنى من المشاريع للانضمام؟', 'لا حد معلن. لكن الأنماط تختلف بحسب حجم المحفظة، وسنقترح عليك الأنسب بعد الاجتماع الأول.', 'partnership', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('30', '30', 'at', 'هل يمكن الجمع بين أكثر من نمط؟', 'نعم، بعض الشركاء يبدأون بالترشيح المعتمد وينتقلون إلى التضمين بعد أول مشروعين.', 'partnership', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

INSERT INTO "_faq_entries_v" ("id", "parent_id", "version__order", "version_question", "version_answer", "version_page", "version_locale", "version_shows", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest")
VALUES ('31', '31', 'au', 'نحن مكتب صغير — هل البرنامج لنا؟', 'نعم. المشاريع المتوسطة هي تركيزنا، والمكاتب المتوسطة والصغيرة هي شريحتنا الأساسية.', 'partnership', 'ar', 'true', now(), now(), 'published', now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_faq_entries_v"', 'id'), (SELECT max("id") FROM "_faq_entries_v"));
`;
