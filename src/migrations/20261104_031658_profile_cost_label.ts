import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the Company profile's Delay-cost calculator button words of its own
 * (ticket 106), for a campaign, which change the profile's button and leave
 * the home page's alone. They arrive empty, which is the shared entry's words,
 * «احجز عرضاً لترى كيف نمنعه», so nothing needs writing in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" ADD COLUMN "cost_call_to_action_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "cost_call_to_action_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_cost_call_to_action_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_cost_call_to_action_label_en" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" DROP COLUMN "cost_call_to_action_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "cost_call_to_action_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_cost_call_to_action_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_cost_call_to_action_label_en";`);
}
