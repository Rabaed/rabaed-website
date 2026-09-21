/**
 * What `20260920_182914_import_site_words_and_index_leads` wrote, as the
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
export const SITE_WORDS_SEED = `
INSERT INTO "_index_leads_v" ("id", "version_blog_lead_ar", "version_blog_lead_en", "version_case_studies_lead_ar", "version_case_studies_lead_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'مقالات عن إدارة مشاريع الإنشاء في السعودية: المراسلات والطلبات والاعتمادات، وكيف يبقى سجل المشروع واحداً بين المالك والاستشاري والمقاول.', 'Articles on running construction projects in Saudi Arabia: correspondence, requests and approvals, and keeping one project record between owner, consultant and contractor.', 'مشاريع إنشاء حقيقية انتقلت فيها الطلبات والاعتمادات إلى سجل واحد بين المالك والاستشاري والمقاول — ما كان التحدي، وما الذي تغيّر، وما النتيجة.', 'Real construction projects that moved their requests and approvals onto one record between owner, consultant and contractor — the challenge, what changed, and the outcome.', 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_index_leads_v"', 'id'), (SELECT max("id") FROM "_index_leads_v"));

INSERT INTO "_site_words_v" ("id", "version_header_partnerships_label_ar", "version_header_partnerships_label_en", "version_header_sign_in_label_ar", "version_header_sign_in_label_en", "version_header_sign_in_url", "version_header_demo_label_ar", "version_header_demo_label_en", "version_footer_tagline_ar", "version_footer_tagline_en", "version_footer_rights_ar", "version_footer_rights_en", "version_not_found_heading_ar", "version_not_found_heading_en", "version_not_found_lead_ar", "version_not_found_lead_en", "version_not_found_home_label_ar", "version_not_found_home_label_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'الشراكات', NULL, 'تسجيل الدخول', NULL, 'https://rabaedapp.com/signin?lang=ar_ar', 'احجز عرضاً حياً', NULL, 'نظام تشغيل مشاريع الإنشاء · الرياض · rabaedapp.com', NULL, 'ربائد · جميع الحقوق محفوظة', NULL, 'الصفحة غير موجودة', NULL, 'الرابط الذي طلبته غير متاح.', NULL, 'العودة إلى الصفحة الرئيسية', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_site_words_v"', 'id'), (SELECT max("id") FROM "_site_words_v"));

INSERT INTO "index_leads" ("id", "blog_lead_ar", "blog_lead_en", "case_studies_lead_ar", "case_studies_lead_en", "_status", "updated_at", "created_at")
VALUES ('1', 'مقالات عن إدارة مشاريع الإنشاء في السعودية: المراسلات والطلبات والاعتمادات، وكيف يبقى سجل المشروع واحداً بين المالك والاستشاري والمقاول.', 'Articles on running construction projects in Saudi Arabia: correspondence, requests and approvals, and keeping one project record between owner, consultant and contractor.', 'مشاريع إنشاء حقيقية انتقلت فيها الطلبات والاعتمادات إلى سجل واحد بين المالك والاستشاري والمقاول — ما كان التحدي، وما الذي تغيّر، وما النتيجة.', 'Real construction projects that moved their requests and approvals onto one record between owner, consultant and contractor — the challenge, what changed, and the outcome.', 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"index_leads"', 'id'), (SELECT max("id") FROM "index_leads"));

INSERT INTO "site_words" ("id", "header_partnerships_label_ar", "header_partnerships_label_en", "header_sign_in_label_ar", "header_sign_in_label_en", "header_sign_in_url", "header_demo_label_ar", "header_demo_label_en", "footer_tagline_ar", "footer_tagline_en", "footer_rights_ar", "footer_rights_en", "not_found_heading_ar", "not_found_heading_en", "not_found_lead_ar", "not_found_lead_en", "not_found_home_label_ar", "not_found_home_label_en", "_status", "updated_at", "created_at")
VALUES ('1', 'الشراكات', NULL, 'تسجيل الدخول', NULL, 'https://rabaedapp.com/signin?lang=ar_ar', 'احجز عرضاً حياً', NULL, 'نظام تشغيل مشاريع الإنشاء · الرياض · rabaedapp.com', NULL, 'ربائد · جميع الحقوق محفوظة', NULL, 'الصفحة غير موجودة', NULL, 'الرابط الذي طلبته غير متاح.', NULL, 'العودة إلى الصفحة الرئيسية', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"site_words"', 'id'), (SELECT max("id") FROM "site_words"));

INSERT INTO "_index_leads_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

INSERT INTO "_index_leads_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('2', '1', 'en', '2');

SELECT setval(pg_get_serial_sequence('"_index_leads_v_version_languages"', 'id'), (SELECT max("id") FROM "_index_leads_v_version_languages"));

INSERT INTO "_site_words_v_version_footer_legal_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path", "_uuid")
VALUES ('1', '1', '1', 'الشروط والأحكام', NULL, '/terms', '6ab0c5b0653728afc0fbe931');

INSERT INTO "_site_words_v_version_footer_legal_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path", "_uuid")
VALUES ('2', '1', '2', 'سياسة الخصوصية', NULL, '/privacy', '6ab0c5b0653728afc0fbe932');

SELECT setval(pg_get_serial_sequence('"_site_words_v_version_footer_legal_links"', 'id'), (SELECT max("id") FROM "_site_words_v_version_footer_legal_links"));

INSERT INTO "_site_words_v_version_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path", "_uuid")
VALUES ('1', '1', '1', 'الرئيسية', NULL, '/', '6ab0c5b0653728afc0fbe92b');

INSERT INTO "_site_words_v_version_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path", "_uuid")
VALUES ('2', '1', '2', 'المنتج', NULL, '/product', '6ab0c5b0653728afc0fbe92c');

INSERT INTO "_site_words_v_version_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path", "_uuid")
VALUES ('3', '1', '3', 'قصص العملاء', NULL, '/case-studies', '6ab0c5b0653728afc0fbe92d');

INSERT INTO "_site_words_v_version_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path", "_uuid")
VALUES ('4', '1', '4', 'ابدأ', NULL, '/start', '6ab0c5b0653728afc0fbe92e');

SELECT setval(pg_get_serial_sequence('"_site_words_v_version_header_links"', 'id'), (SELECT max("id") FROM "_site_words_v_version_header_links"));

INSERT INTO "_site_words_v_version_header_partnerships" ("_order", "_parent_id", "id", "label_ar", "label_en", "summary_ar", "summary_en", "path", "_uuid")
VALUES ('1', '1', '1', 'برنامج الإحالة', NULL, 'شارك كودك مع مطوّر تعرفه', NULL, '/referral', '6ab0c5b0653728afc0fbe92f');

INSERT INTO "_site_words_v_version_header_partnerships" ("_order", "_parent_id", "id", "label_ar", "label_en", "summary_ar", "summary_en", "path", "_uuid")
VALUES ('2', '1', '2', 'برنامج الشراكات', NULL, 'للمكاتب الهندسية وشركات إدارة المشاريع', NULL, '/partnership', '6ab0c5b0653728afc0fbe930');

SELECT setval(pg_get_serial_sequence('"_site_words_v_version_header_partnerships"', 'id'), (SELECT max("id") FROM "_site_words_v_version_header_partnerships"));

INSERT INTO "_site_words_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_site_words_v_version_languages"', 'id'), (SELECT max("id") FROM "_site_words_v_version_languages"));

INSERT INTO "index_leads_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

INSERT INTO "index_leads_languages" ("order", "parent_id", "value", "id")
VALUES ('2', '1', 'en', '2');

SELECT setval(pg_get_serial_sequence('"index_leads_languages"', 'id'), (SELECT max("id") FROM "index_leads_languages"));

INSERT INTO "site_words_footer_legal_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe931', 'الشروط والأحكام', NULL, '/terms');

INSERT INTO "site_words_footer_legal_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe932', 'سياسة الخصوصية', NULL, '/privacy');

INSERT INTO "site_words_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe92b', 'الرئيسية', NULL, '/');

INSERT INTO "site_words_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe92c', 'المنتج', NULL, '/product');

INSERT INTO "site_words_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
VALUES ('3', '1', '6ab0c5b0653728afc0fbe92d', 'قصص العملاء', NULL, '/case-studies');

INSERT INTO "site_words_header_links" ("_order", "_parent_id", "id", "label_ar", "label_en", "path")
VALUES ('4', '1', '6ab0c5b0653728afc0fbe92e', 'ابدأ', NULL, '/start');

INSERT INTO "site_words_header_partnerships" ("_order", "_parent_id", "id", "label_ar", "label_en", "summary_ar", "summary_en", "path")
VALUES ('1', '1', '6ab0c5b0653728afc0fbe92f', 'برنامج الإحالة', NULL, 'شارك كودك مع مطوّر تعرفه', NULL, '/referral');

INSERT INTO "site_words_header_partnerships" ("_order", "_parent_id", "id", "label_ar", "label_en", "summary_ar", "summary_en", "path")
VALUES ('2', '1', '6ab0c5b0653728afc0fbe930', 'برنامج الشراكات', NULL, 'للمكاتب الهندسية وشركات إدارة المشاريع', NULL, '/partnership');

INSERT INTO "site_words_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"site_words_languages"', 'id'), (SELECT max("id") FROM "site_words_languages"));
`;
