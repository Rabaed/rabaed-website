import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { CONTACT_POINTS_SEED } from './contact-points-import/seed';

/**
 * Publishes the contact points the site carried before the CMS existed, so
 * that every database — production's included — starts with the footer the
 * Reference site has, and Ahmed changes it from there.
 *
 * The WhatsApp number is the Reference site's own. The email and phone are
 * the ones the approved legal documents give (`src/migrations/legal-import/`). The
 * social accounts start empty: none has been supplied (spec: Further Notes).
 *
 * The statements are frozen in `contact-points-import/seed.ts`, naming the
 * columns the site settings' tables had on the day this was written (ticket
 * 68); `contact-points-import/words.ts` is where the values are read.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(CONTACT_POINTS_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_site_settings_v";
    DELETE FROM "site_settings";
  `);
}
