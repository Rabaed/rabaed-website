/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260921_035306_publish_tool_download_wording` (ticket 68).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const TOOL_DOWNLOAD_SEED = `
INSERT INTO "_tool_download_form_v" ("id", "version_alert_address", "version_heading", "version_lead", "version_submit", "version_fine_print", "version_fields_first_name_label", "version_fields_first_name_placeholder", "version_fields_first_name_message", "version_fields_last_name_label", "version_fields_last_name_placeholder", "version_fields_last_name_message", "version_fields_country_code_label", "version_fields_country_code_placeholder", "version_fields_country_code_message", "version_fields_country_code_options_option_966", "version_fields_country_code_options_option_971", "version_fields_country_code_options_option_965", "version_fields_country_code_options_option_974", "version_fields_country_code_options_option_973", "version_fields_country_code_options_option_968", "version_fields_country_code_options_option_962", "version_fields_country_code_options_option_20", "version_fields_country_code_options_option_90", "version_fields_country_code_options_option_other", "version_fields_phone_label", "version_fields_phone_placeholder", "version_fields_phone_message", "version_fields_email_label", "version_fields_email_placeholder", "version_fields_email_message", "version_fields_company_label", "version_fields_company_placeholder", "version_fields_company_message", "version_received", "version_refused", "version_failed", "version_confirmation_subject", "version_confirmation_body", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', NULL, 'بيانات التحميل', 'حقل الشركة اختياري. البقية مطلوبة لتفعيل زر التحميل.', 'حمّل الأداة الآن', 'بالضغط على زر التحميل توافق على أن نتواصل معك بخصوص الأداة وتحديثاتها. لن نشارك بياناتك مع أي جهة أخرى.', 'الاسم الأول', 'الاسم الأول *', 'اكتب الاسم الأول (حرفان على الأقل)', 'اسم العائلة', 'اسم العائلة *', 'اكتب اسم العائلة (حرفان على الأقل)', 'مفتاح الدولة', 'مفتاح الدولة', 'اختر مفتاح الدولة', '‎+966 السعودية', '‎+971 الإمارات', '‎+965 الكويت', '‎+974 قطر', '‎+973 البحرين', '‎+968 عُمان', '‎+962 الأردن', '‎+20 مصر', '‎+90 تركيا', 'أخرى', 'رقم الجوال', '5X XXX XXXX *', 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)', 'البريد الإلكتروني', 'البريد الإلكتروني *', 'اكتب بريداً إلكترونياً صحيحاً', 'اسم الشركة', 'اسم الشركة (اختياري)', 'اسم الشركة أطول من اللازم', 'تم — التحميل بدأ', 'تعذّر التحميل الآن. حاول مرة أخرى بعد قليل.', 'تعذّر التحميل بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل.', 'ربائد — متتبّع الصبّات', 'مرحباً {الاسم}،

شكراً لتحميلك متتبّع الصبّات. الملف اسمه Rabaed-Pour-Tracker.html، وهو صفحة واحدة تفتح بنقرتين في Chrome أو Edge.

ثلاث خطوات حتى أول صبّة:
١. احفظ الملف في مكان ثابت — سطح المكتب أو مجلد المشروع، لا مجلد التنزيلات.
٢. افتحه بنقرتين.
٣. اختر مجلداً للمشروع عند أول تشغيل.

بياناتك تبقى على جهازك: الأداة لا ترسل شيئاً إلى أي خادم.

إن لم يصلك الملف، أعد التحميل من الصفحة نفسها.

فريق ربائد', 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_tool_download_form_v"', 'id'), (SELECT max("id") FROM "_tool_download_form_v"));

INSERT INTO "tool_download_form" ("id", "alert_address", "heading", "lead", "submit", "fine_print", "fields_first_name_label", "fields_first_name_placeholder", "fields_first_name_message", "fields_last_name_label", "fields_last_name_placeholder", "fields_last_name_message", "fields_country_code_label", "fields_country_code_placeholder", "fields_country_code_message", "fields_country_code_options_option_966", "fields_country_code_options_option_971", "fields_country_code_options_option_965", "fields_country_code_options_option_974", "fields_country_code_options_option_973", "fields_country_code_options_option_968", "fields_country_code_options_option_962", "fields_country_code_options_option_20", "fields_country_code_options_option_90", "fields_country_code_options_option_other", "fields_phone_label", "fields_phone_placeholder", "fields_phone_message", "fields_email_label", "fields_email_placeholder", "fields_email_message", "fields_company_label", "fields_company_placeholder", "fields_company_message", "received", "refused", "failed", "confirmation_subject", "confirmation_body", "_status", "updated_at", "created_at")
VALUES ('1', NULL, 'بيانات التحميل', 'حقل الشركة اختياري. البقية مطلوبة لتفعيل زر التحميل.', 'حمّل الأداة الآن', 'بالضغط على زر التحميل توافق على أن نتواصل معك بخصوص الأداة وتحديثاتها. لن نشارك بياناتك مع أي جهة أخرى.', 'الاسم الأول', 'الاسم الأول *', 'اكتب الاسم الأول (حرفان على الأقل)', 'اسم العائلة', 'اسم العائلة *', 'اكتب اسم العائلة (حرفان على الأقل)', 'مفتاح الدولة', 'مفتاح الدولة', 'اختر مفتاح الدولة', '‎+966 السعودية', '‎+971 الإمارات', '‎+965 الكويت', '‎+974 قطر', '‎+973 البحرين', '‎+968 عُمان', '‎+962 الأردن', '‎+20 مصر', '‎+90 تركيا', 'أخرى', 'رقم الجوال', '5X XXX XXXX *', 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)', 'البريد الإلكتروني', 'البريد الإلكتروني *', 'اكتب بريداً إلكترونياً صحيحاً', 'اسم الشركة', 'اسم الشركة (اختياري)', 'اسم الشركة أطول من اللازم', 'تم — التحميل بدأ', 'تعذّر التحميل الآن. حاول مرة أخرى بعد قليل.', 'تعذّر التحميل بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل.', 'ربائد — متتبّع الصبّات', 'مرحباً {الاسم}،

شكراً لتحميلك متتبّع الصبّات. الملف اسمه Rabaed-Pour-Tracker.html، وهو صفحة واحدة تفتح بنقرتين في Chrome أو Edge.

ثلاث خطوات حتى أول صبّة:
١. احفظ الملف في مكان ثابت — سطح المكتب أو مجلد المشروع، لا مجلد التنزيلات.
٢. افتحه بنقرتين.
٣. اختر مجلداً للمشروع عند أول تشغيل.

بياناتك تبقى على جهازك: الأداة لا ترسل شيئاً إلى أي خادم.

إن لم يصلك الملف، أعد التحميل من الصفحة نفسها.

فريق ربائد', 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"tool_download_form"', 'id'), (SELECT max("id") FROM "tool_download_form"));
`;
