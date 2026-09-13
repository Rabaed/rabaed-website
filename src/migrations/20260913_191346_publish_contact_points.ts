import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/globals/site-settings';

/**
 * Publishes the contact points the site carried before the CMS existed, so
 * that every database — production's included — starts with the footer the
 * Reference site has, and Ahmed changes it from there.
 *
 * The WhatsApp number is the Reference site's own. The email and phone are
 * the ones the approved legal documents give (`src/migrations/legal-import/`). The
 * social accounts start empty: none has been supplied (spec: Further Notes).
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      whatsappNumber: '966576767900',
      email: 'ahmed.s@rabaedapp.com',
      phone: '+966576767900',
      _status: 'published',
    },
    // A migration runs outside the site, where there are no pages to
    // refresh (`src/cms/globals/site-settings.ts`).
    context: { [SKIP_REVALIDATION]: true },
    req,
  });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_site_settings_v";
    DELETE FROM "site_settings";
  `);
}
