/**
 * What `20260920_204226_import_trust_strip` wrote, as the
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
export const TRUST_STRIP_SEED = `
INSERT INTO "_trust_strip_v" ("id", "version_strip_caption_ar", "version_strip_caption_en", "version_strip_section_name_ar", "version_strip_section_name_en", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', 'أطراف نشطة حالياً تستخدم ربائد', NULL, 'جهات تعمل على ربائد', NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_trust_strip_v"', 'id'), (SELECT max("id") FROM "_trust_strip_v"));

INSERT INTO "trust_strip" ("id", "strip_caption_ar", "strip_caption_en", "strip_section_name_ar", "strip_section_name_en", "_status", "updated_at", "created_at")
VALUES ('1', 'أطراف نشطة حالياً تستخدم ربائد', NULL, 'جهات تعمل على ربائد', NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"trust_strip"', 'id'), (SELECT max("id") FROM "trust_strip"));

INSERT INTO "_trust_strip_v_version_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"_trust_strip_v_version_languages"', 'id'), (SELECT max("id") FROM "_trust_strip_v_version_languages"));

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('1', '1', '1', 'true', 'نواة للاستثمار العقاري', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'nawah.webp'), '32', NULL, '6ab0c5b1653728afc0fbe933');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('2', '1', '2', 'true', 'Staterra', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'staterra.webp'), '26', NULL, '6ab0c5b1653728afc0fbe934');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('3', '1', '3', 'true', 'شركة الشرق للاستشارات الهندسية', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'alsharq.webp'), '42', NULL, '6ab0c5b1653728afc0fbe935');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('4', '1', '4', 'true', 'شاهين للاستشارات الهندسية', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'shaheen.webp'), '42', NULL, '6ab0c5b1653728afc0fbe936');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('5', '1', '5', 'true', 'North Injazat', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'north-injazat.webp'), '42', NULL, '6ab0c5b1653728afc0fbe937');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('6', '1', '6', 'true', 'شركة أماك بيلد', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'amak.webp'), '38', NULL, '6ab0c5b1653728afc0fbe938');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('7', '1', '7', 'true', 'Smart Directions', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'smart-directions.webp'), '32', NULL, '6ab0c5b1653728afc0fbe939');

INSERT INTO "_trust_strip_v_version_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link", "_uuid")
VALUES ('8', '1', '8', 'true', 'Sika', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'sika.webp'), '42', NULL, '6ab0c5b1653728afc0fbe93a');

SELECT setval(pg_get_serial_sequence('"_trust_strip_v_version_strip_logos"', 'id'), (SELECT max("id") FROM "_trust_strip_v_version_strip_logos"));

INSERT INTO "trust_strip_languages" ("order", "parent_id", "value", "id")
VALUES ('1', '1', 'ar', '1');

SELECT setval(pg_get_serial_sequence('"trust_strip_languages"', 'id'), (SELECT max("id") FROM "trust_strip_languages"));

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('1', '1', '6ab0c5b1653728afc0fbe933', 'true', 'نواة للاستثمار العقاري', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'nawah.webp'), '32', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('2', '1', '6ab0c5b1653728afc0fbe934', 'true', 'Staterra', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'staterra.webp'), '26', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('3', '1', '6ab0c5b1653728afc0fbe935', 'true', 'شركة الشرق للاستشارات الهندسية', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'alsharq.webp'), '42', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('4', '1', '6ab0c5b1653728afc0fbe936', 'true', 'شاهين للاستشارات الهندسية', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'shaheen.webp'), '42', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('5', '1', '6ab0c5b1653728afc0fbe937', 'true', 'North Injazat', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'north-injazat.webp'), '42', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('6', '1', '6ab0c5b1653728afc0fbe938', 'true', 'شركة أماك بيلد', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'amak.webp'), '38', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('7', '1', '6ab0c5b1653728afc0fbe939', 'true', 'Smart Directions', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'smart-directions.webp'), '32', NULL);

INSERT INTO "trust_strip_strip_logos" ("_order", "_parent_id", "id", "shows", "name_ar", "name_en", "mark_id", "height", "link")
VALUES ('8', '1', '6ab0c5b1653728afc0fbe93a', 'true', 'Sika', NULL, (SELECT "id" FROM "media" WHERE "filename" = 'sika.webp'), '42', NULL);
`;
