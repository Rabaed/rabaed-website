import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the Company profile its Delay-cost calculator (ticket 106): the page's
 * own switch to show it, which arrives showing it, and where its button goes,
 * in each language. Its words are the calculator's shared entry's
 * (`20261104_020004_delay_calculator`), which this leaves as it is.
 *
 * Empty here. `20261104_023539_import_profile_cost` writes the button's link in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" ADD COLUMN "cost_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "cost_call_to_action_link_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "cost_call_to_action_link_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_cost_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_cost_call_to_action_link_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_cost_call_to_action_link_en" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" DROP COLUMN "cost_shows";
  ALTER TABLE "profile_page" DROP COLUMN "cost_call_to_action_link_ar";
  ALTER TABLE "profile_page" DROP COLUMN "cost_call_to_action_link_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_cost_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_cost_call_to_action_link_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_cost_call_to_action_link_en";`);
}
