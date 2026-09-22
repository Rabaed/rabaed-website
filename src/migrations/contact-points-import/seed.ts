/**
 * The statements that seeded this import, as it made them on the day it was
 * written: `20260913_191346_publish_contact_points` (ticket 68).
 *
 * **Generated, and frozen.** `npm run cms:freeze-seed` produced this from the
 * import as it ran, and nothing regenerates it: the column names below are the
 * ones these tables had at that point in the chain, which is the whole point of
 * the file. A field added to this entry later belongs in a migration of its
 * own, never here.
 *
 * The words themselves are in `words.ts` beside this, which is what to read.
 */
export const CONTACT_POINTS_SEED = `
INSERT INTO "_site_settings_v" ("id", "version_whatsapp_number", "version_email", "version_phone", "version_social_linkedin", "version_social_x", "version_social_facebook", "version_social_instagram", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest")
VALUES ('1', '966576767900', 'ahmed.s@rabaedapp.com', '+966576767900', NULL, NULL, NULL, NULL, 'published', now(), now(), now(), now(), 'true');

SELECT setval(pg_get_serial_sequence('"_site_settings_v"', 'id'), (SELECT max("id") FROM "_site_settings_v"));

INSERT INTO "site_settings" ("id", "whatsapp_number", "email", "phone", "social_linkedin", "social_x", "social_facebook", "social_instagram", "_status", "updated_at", "created_at")
VALUES ('1', '966576767900', 'ahmed.s@rabaedapp.com', '+966576767900', NULL, NULL, NULL, NULL, 'published', now(), now());

SELECT setval(pg_get_serial_sequence('"site_settings"', 'id'), (SELECT max("id") FROM "site_settings"));
`;
