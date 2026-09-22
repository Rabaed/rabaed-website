import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { REFERRAL_SIGNUP_SEED } from './referral-signup-import/seed';

/**
 * Publishes the Referral Program signup form's words — the Reference site's,
 * and the messages ticket 28 added — so that every database, production's
 * included, starts with the form as built, and Editors change it from there.
 *
 * Written out in `referral-signup-import/words.ts` rather than read from
 * `src/forms/referral-signup.ts`, so that a later change to the form cannot
 * change what this migration did; and frozen as the SQL in `seed.ts` beside
 * them (ticket 68), so that a later field cannot make it write a column the
 * tables do not have yet.
 *
 * No alert address: none has been supplied, and until one is set the form
 * sends no email at all.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(REFERRAL_SIGNUP_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_referral_signup_form_v";
    DELETE FROM "referral_signup_form";
  `);
}
