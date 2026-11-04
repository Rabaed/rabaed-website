import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { PROFILE_COST_SEED } from './profile-cost-import/seed';
import { PROFILE_COST_WORDS } from './profile-cost-import/words';

/**
 * Sends the Company profile's Delay-cost calculator button to the home page's
 * demo request form (ticket 106), `/#demo` and `/en#demo`, as the profile's
 * hero sends its own. Written into the entry, its newest version and its
 * newest published one, where each is still empty. The profile stays as
 * unpublished as it was: this publishes nothing.
 *
 * The statements are in `profile-cost-import/seed.ts`, and the links in
 * `profile-cost-import/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROFILE_COST_SEED));
}

/** Takes the link back off, wherever it is still this one. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  const statements = (['ar', 'en'] as const).map((language) => {
    const link = `'${PROFILE_COST_WORDS.callToActionLink[language]}'`;
    return `
UPDATE "profile_page" SET "cost_call_to_action_link_${language}" = NULL WHERE "cost_call_to_action_link_${language}" = ${link};
UPDATE "_profile_page_v" SET "version_cost_call_to_action_link_${language}" = NULL WHERE "version_cost_call_to_action_link_${language}" = ${link};`;
  });
  await db.execute(sql.raw(statements.join('\n')));
}
