/**
 * What `20260920_211936_import_search_settings` wrote, as the
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
export const SEARCH_SETTINGS_SEED = `
INSERT INTO "_search_settings_v" ("id", "version_home_title_ar", "version_home_title_en", "version_home_description_ar", "version_home_description_en", "version_home_sharing_image_id", "version_product_title_ar", "version_product_title_en", "version_product_description_ar", "version_product_description_en", "version_product_sharing_image_id", "version_start_title_ar", "version_start_title_en", "version_start_description_ar", "version_start_description_en", "version_start_sharing_image_id", "version_tool_title_ar", "version_tool_title_en", "version_tool_description_ar", "version_tool_description_en", "version_tool_sharing_image_id", "version_referral_title_ar", "version_referral_title_en", "version_referral_description_ar", "version_referral_description_en", "version_referral_sharing_image_id", "version_partnership_title_ar", "version_partnership_title_en", "version_partnership_description_ar", "version_partnership_description_en", "version_partnership_sharing_image_id", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'ربائد · ثلاثة أطراف. سجل واحد.', NULL, 'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.', NULL, NULL, 'ربائد · المنتج — من الطلب إلى الاعتماد', NULL, 'كيف تمر معاملة واحدة من الطلب إلى الاعتماد، وماذا يرى كل طرف حين يفتح المنصة.', NULL, NULL, 'ربائد · ابدأ — كيف نبدأ والأسئلة الشائعة', NULL, 'ثلاث خطوات حتى التشغيل، الضمان، الاشتراك، والأسئلة الشائعة.', NULL, NULL, 'ربائد · متتبّع الصبّات واختبارات الكسر — أداة مجانية', NULL, 'ملف HTML واحد يفتح بنقرتين. سجّل الصبّة واعرف موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر. بدون حساب، بدون سيرفر، بياناتك تبقى على جهازك.', NULL, NULL, 'ربائد · برنامج الإحالة — {payout} ريال عن كل مشروع', NULL, 'أحِل مشروعاً واحداً واكسب {payout} ريال صافية، ويحصل عميلك على خصم {clientDiscount} على اشتراك مشروعه.', NULL, NULL, 'ربائد · برنامج الشراكات للمكاتب الهندسية', NULL, 'شراكة تُصمَّم معك: تسعير شريك، أو رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.', NULL, NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_search_settings_v"', 'id'), (SELECT max("id") FROM "_search_settings_v"));

INSERT INTO "search_settings" ("id", "home_title_ar", "home_title_en", "home_description_ar", "home_description_en", "home_sharing_image_id", "product_title_ar", "product_title_en", "product_description_ar", "product_description_en", "product_sharing_image_id", "start_title_ar", "start_title_en", "start_description_ar", "start_description_en", "start_sharing_image_id", "tool_title_ar", "tool_title_en", "tool_description_ar", "tool_description_en", "tool_sharing_image_id", "referral_title_ar", "referral_title_en", "referral_description_ar", "referral_description_en", "referral_sharing_image_id", "partnership_title_ar", "partnership_title_en", "partnership_description_ar", "partnership_description_en", "partnership_sharing_image_id", "_status", "updated_at", "created_at")
VALUES ('1', 'ربائد · ثلاثة أطراف. سجل واحد.', NULL, 'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.', NULL, NULL, 'ربائد · المنتج — من الطلب إلى الاعتماد', NULL, 'كيف تمر معاملة واحدة من الطلب إلى الاعتماد، وماذا يرى كل طرف حين يفتح المنصة.', NULL, NULL, 'ربائد · ابدأ — كيف نبدأ والأسئلة الشائعة', NULL, 'ثلاث خطوات حتى التشغيل، الضمان، الاشتراك، والأسئلة الشائعة.', NULL, NULL, 'ربائد · متتبّع الصبّات واختبارات الكسر — أداة مجانية', NULL, 'ملف HTML واحد يفتح بنقرتين. سجّل الصبّة واعرف موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر. بدون حساب، بدون سيرفر، بياناتك تبقى على جهازك.', NULL, NULL, 'ربائد · برنامج الإحالة — {payout} ريال عن كل مشروع', NULL, 'أحِل مشروعاً واحداً واكسب {payout} ريال صافية، ويحصل عميلك على خصم {clientDiscount} على اشتراك مشروعه.', NULL, NULL, 'ربائد · برنامج الشراكات للمكاتب الهندسية', NULL, 'شراكة تُصمَّم معك: تسعير شريك، أو رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.', NULL, NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"search_settings"', 'id'), (SELECT max("id") FROM "search_settings"));

INSERT INTO "_search_settings_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_search_settings_v_version_languages"', 'id'), (SELECT max("id") FROM "_search_settings_v_version_languages"));

INSERT INTO "search_settings_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"search_settings_languages"', 'id'), (SELECT max("id") FROM "search_settings_languages"));
`;
