/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260914_194144_publish_demo_request_wording` (ticket 63).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const DEMO_REQUEST_SEED = `
INSERT INTO "_demo_request_form_v" ("id", "version_alert_address", "version_heading", "version_lead", "version_submit", "version_fine_print", "version_fields_name_label", "version_fields_name_placeholder", "version_fields_name_message", "version_fields_email_label", "version_fields_email_placeholder", "version_fields_email_message", "version_fields_role_label", "version_fields_role_placeholder", "version_fields_role_message", "version_fields_role_options_option_owner", "version_fields_role_options_option_consultant", "version_fields_role_options_option_contractor", "version_fields_phone_label", "version_fields_phone_placeholder", "version_fields_phone_message", "version_fields_company_label", "version_fields_company_placeholder", "version_fields_company_message", "version_fields_active_projects_label", "version_fields_active_projects_placeholder", "version_fields_active_projects_message", "version_received", "version_refused", "version_failed", "version_confirmation_subject", "version_confirmation_body", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', NULL, 'احجز عرضاً حياً على مشروعك', '30 دقيقة · بالعربية · على مشروع من مشاريعك', 'احجز عرضاً حياً', 'نستخدم بياناتك لتحديد موعد العرض فقط، ولا نشاركها مع أي طرف ثالث.', 'الاسم الكامل', 'الاسم الكامل', 'اكتب اسمك الكامل (حرفان على الأقل)', 'البريد الإلكتروني', 'البريد الإلكتروني', 'اكتب بريداً إلكترونياً صحيحاً', 'دورك في المشروع', 'دورك في المشروع', 'اختر دورك في المشروع', 'مالك / مطوّر', 'استشاري', 'مقاول', 'رقم الجوال', 'رقم الجوال', 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)', 'اسم الشركة', 'اسم الشركة', 'اسم الشركة أطول من اللازم', 'عدد المشاريع النشطة', 'عدد المشاريع النشطة', 'اكتب عدد المشاريع أرقاماً فقط', 'وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.', 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.', 'لم يُحفظ طلبك بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.', 'ربائد — وصلنا طلبك للعرض الحي', 'مرحباً {الاسم}،

وصلنا طلبك لعرض حي لمنصة ربائد على مشروع من مشاريعك. سيتواصل معك فريقنا خلال يوم عمل لتحديد الموعد.

العرض 30 دقيقة، بالعربية.

فريق ربائد', 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_demo_request_form_v"', 'id'), (SELECT max("id") FROM "_demo_request_form_v"));

INSERT INTO "demo_request_form" ("id", "alert_address", "heading", "lead", "submit", "fine_print", "fields_name_label", "fields_name_placeholder", "fields_name_message", "fields_email_label", "fields_email_placeholder", "fields_email_message", "fields_role_label", "fields_role_placeholder", "fields_role_message", "fields_role_options_option_owner", "fields_role_options_option_consultant", "fields_role_options_option_contractor", "fields_phone_label", "fields_phone_placeholder", "fields_phone_message", "fields_company_label", "fields_company_placeholder", "fields_company_message", "fields_active_projects_label", "fields_active_projects_placeholder", "fields_active_projects_message", "received", "refused", "failed", "confirmation_subject", "confirmation_body", "_status", "updated_at", "created_at")
VALUES ('1', NULL, 'احجز عرضاً حياً على مشروعك', '30 دقيقة · بالعربية · على مشروع من مشاريعك', 'احجز عرضاً حياً', 'نستخدم بياناتك لتحديد موعد العرض فقط، ولا نشاركها مع أي طرف ثالث.', 'الاسم الكامل', 'الاسم الكامل', 'اكتب اسمك الكامل (حرفان على الأقل)', 'البريد الإلكتروني', 'البريد الإلكتروني', 'اكتب بريداً إلكترونياً صحيحاً', 'دورك في المشروع', 'دورك في المشروع', 'اختر دورك في المشروع', 'مالك / مطوّر', 'استشاري', 'مقاول', 'رقم الجوال', 'رقم الجوال', 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)', 'اسم الشركة', 'اسم الشركة', 'اسم الشركة أطول من اللازم', 'عدد المشاريع النشطة', 'عدد المشاريع النشطة', 'اكتب عدد المشاريع أرقاماً فقط', 'وصلنا طلبك — سنتواصل خلال يوم عمل لتحديد الموعد.', 'تعذّر استلام طلبك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.', 'لم يُحفظ طلبك بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.', 'ربائد — وصلنا طلبك للعرض الحي', 'مرحباً {الاسم}،

وصلنا طلبك لعرض حي لمنصة ربائد على مشروع من مشاريعك. سيتواصل معك فريقنا خلال يوم عمل لتحديد الموعد.

العرض 30 دقيقة، بالعربية.

فريق ربائد', 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"demo_request_form"', 'id'), (SELECT max("id") FROM "demo_request_form"));
`;
