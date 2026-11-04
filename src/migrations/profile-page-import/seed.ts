/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20261104_010825_import_profile_page` (ticket 102).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const PROFILE_PAGE_SEED = `
INSERT INTO "_profile_page_v" ("id", "version_hero_eyebrow_ar", "version_hero_eyebrow_en", "version_hero_title_accent_ar", "version_hero_title_accent_en", "version_hero_lead_ar", "version_hero_lead_en", "version_hero_demo_label_ar", "version_hero_demo_label_en", "version_hero_whatsapp_label_ar", "version_hero_whatsapp_label_en", "version_hero_demo_link_ar", "version_hero_demo_link_en", "version_hero_whatsapp_link_ar", "version_hero_whatsapp_link_en", "version_hero_trust_ar", "version_hero_trust_en", "version_hero_guarantee_period_ar", "version_hero_guarantee_period_en", "version_hero_guarantee_promise_ar", "version_hero_guarantee_promise_en", "version_hero_parties_owner_ar", "version_hero_parties_owner_en", "version_hero_parties_consultant_ar", "version_hero_parties_consultant_en", "version_hero_parties_contractor_ar", "version_hero_parties_contractor_en", "version_hero_diagram_description_ar", "version_hero_diagram_description_en", "version_hero_status_at_rest_ar", "version_hero_status_at_rest_en", "version_trust_strip_shows", "version_search_title_ar", "version_search_title_en", "version_search_description_ar", "version_search_description_en", "version_search_sharing_image_id", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'نظام تشغيل مشاريع الإنشاء · المملكة العربية السعودية', 'The construction project OS · Saudi Arabia', 'مسؤولية واضحة.', 'Clear ownership.', 'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الموقع. كل خطوة موثّقة ومؤرخة باسم من قام بها، والتشغيل خلال أيام.', 'Rabaed puts owner, consultant and contractor on one platform: approved correspondence, approvals and inspections, documents at their latest revision, and daily site reports. Every step is dated, with the name of who took it, and you go live within days.', 'احجز عرضاً حياً', 'Book a live demo', 'تواصل واتساب', 'WhatsApp us', '/#demo', '/en#demo', '', '', 'عرض حي · 30 دقيقة · بالعربية', 'Live demo · 30 minutes', '60 يوماً', '60-day', 'ضمان استرجاع كامل المبلغ', 'full money-back guarantee', 'المالك', 'Owner', 'الاستشاري', 'Consultant', 'المقاول', 'Contractor', 'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.', 'The owner, the consultant and the contractor on one record: every transaction that passes between the three parties is documented and dated with the name of whoever took it.', 'موثّق ومؤرخ', 'Documented and dated', 'true', 'الملف التعريفي · ربائد', 'Company profile · Rabaed', 'ربائد تجمع المالك والاستشاري والمقاول على سجل واحد موثّق: مراسلات، اعتمادات، تقارير يومية، ومستندات. جاهزة خلال أيام.', 'Rabaed puts owner, consultant and contractor on one documented record: correspondence, approvals, daily site reports and documents. Live within days.', NULL, 'draft', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_profile_page_v"', 'id'), (SELECT max("id") FROM "_profile_page_v"));

INSERT INTO "profile_page" ("id", "hero_eyebrow_ar", "hero_eyebrow_en", "hero_title_accent_ar", "hero_title_accent_en", "hero_lead_ar", "hero_lead_en", "hero_demo_label_ar", "hero_demo_label_en", "hero_whatsapp_label_ar", "hero_whatsapp_label_en", "hero_demo_link_ar", "hero_demo_link_en", "hero_whatsapp_link_ar", "hero_whatsapp_link_en", "hero_trust_ar", "hero_trust_en", "hero_guarantee_period_ar", "hero_guarantee_period_en", "hero_guarantee_promise_ar", "hero_guarantee_promise_en", "hero_parties_owner_ar", "hero_parties_owner_en", "hero_parties_consultant_ar", "hero_parties_consultant_en", "hero_parties_contractor_ar", "hero_parties_contractor_en", "hero_diagram_description_ar", "hero_diagram_description_en", "hero_status_at_rest_ar", "hero_status_at_rest_en", "trust_strip_shows", "search_title_ar", "search_title_en", "search_description_ar", "search_description_en", "search_sharing_image_id", "_status", "updated_at", "created_at")
VALUES ('1', 'نظام تشغيل مشاريع الإنشاء · المملكة العربية السعودية', 'The construction project OS · Saudi Arabia', 'مسؤولية واضحة.', 'Clear ownership.', 'ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الموقع. كل خطوة موثّقة ومؤرخة باسم من قام بها، والتشغيل خلال أيام.', 'Rabaed puts owner, consultant and contractor on one platform: approved correspondence, approvals and inspections, documents at their latest revision, and daily site reports. Every step is dated, with the name of who took it, and you go live within days.', 'احجز عرضاً حياً', 'Book a live demo', 'تواصل واتساب', 'WhatsApp us', '/#demo', '/en#demo', '', '', 'عرض حي · 30 دقيقة · بالعربية', 'Live demo · 30 minutes', '60 يوماً', '60-day', 'ضمان استرجاع كامل المبلغ', 'full money-back guarantee', 'المالك', 'Owner', 'الاستشاري', 'Consultant', 'المقاول', 'Contractor', 'المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة موثّقة ومؤرخة باسم من قام بها.', 'The owner, the consultant and the contractor on one record: every transaction that passes between the three parties is documented and dated with the name of whoever took it.', 'موثّق ومؤرخ', 'Documented and dated', 'true', 'الملف التعريفي · ربائد', 'Company profile · Rabaed', 'ربائد تجمع المالك والاستشاري والمقاول على سجل واحد موثّق: مراسلات، اعتمادات، تقارير يومية، ومستندات. جاهزة خلال أيام.', 'Rabaed puts owner, consultant and contractor on one documented record: correspondence, approvals, daily site reports and documents. Live within days.', NULL, 'draft', now(), now());

SELECT setval(pg_get_serial_sequence('"profile_page"', 'id'), (SELECT max("id") FROM "profile_page"));

INSERT INTO "_profile_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('1', '1', '1', 'أُرسل · 07:12', 'Sent · 07:12', '6aea85eceefa064f2c622f17');

INSERT INTO "_profile_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('2', '1', '2', 'روجع · 09:20', 'Reviewed · 09:20', '6aea85eceefa064f2c622f18');

INSERT INTO "_profile_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('3', '1', '3', 'اعتُمد · 12:05', 'Approved · 12:05', '6aea85eceefa064f2c622f19');

INSERT INTO "_profile_page_v_version_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en", "_uuid")
VALUES ('4', '1', '4', 'وصل السجل للأطراف الثلاثة', 'Record reaches all three', '6aea85eceefa064f2c622f1a');

SELECT setval(pg_get_serial_sequence('"_profile_page_v_version_hero_statuses"', 'id'), (SELECT max("id") FROM "_profile_page_v_version_hero_statuses"));

INSERT INTO "_profile_page_v_version_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en", "_uuid")
VALUES ('1', '1', '1', 'ثلاثة أطراف.', 'Three parties.', '6aea85eceefa064f2c622f15');

INSERT INTO "_profile_page_v_version_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en", "_uuid")
VALUES ('2', '1', '2', 'سجل واحد.', 'One record.', '6aea85eceefa064f2c622f16');

SELECT setval(pg_get_serial_sequence('"_profile_page_v_version_hero_title_lines"', 'id'), (SELECT max("id") FROM "_profile_page_v_version_hero_title_lines"));

INSERT INTO "_profile_page_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_profile_page_v_version_languages"', 'id'), (SELECT max("id") FROM "_profile_page_v_version_languages"));

INSERT INTO "profile_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('1', '1', '6aea85eceefa064f2c622f17', 'أُرسل · 07:12', 'Sent · 07:12');

INSERT INTO "profile_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('2', '1', '6aea85eceefa064f2c622f18', 'روجع · 09:20', 'Reviewed · 09:20');

INSERT INTO "profile_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('3', '1', '6aea85eceefa064f2c622f19', 'اعتُمد · 12:05', 'Approved · 12:05');

INSERT INTO "profile_page_hero_statuses" ("_order", "_parent_id", "id", "status_ar", "status_en")
VALUES ('4', '1', '6aea85eceefa064f2c622f1a', 'وصل السجل للأطراف الثلاثة', 'Record reaches all three');

INSERT INTO "profile_page_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en")
VALUES ('1', '1', '6aea85eceefa064f2c622f15', 'ثلاثة أطراف.', 'Three parties.');

INSERT INTO "profile_page_hero_title_lines" ("_order", "_parent_id", "id", "line_ar", "line_en")
VALUES ('2', '1', '6aea85eceefa064f2c622f16', 'سجل واحد.', 'One record.');

INSERT INTO "profile_page_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"profile_page_languages"', 'id'), (SELECT max("id") FROM "profile_page_languages"));
`;
