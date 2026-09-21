import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the home page's units and the product page's parties somewhere to
 * carry the standalone answer their heading asks for (ticket 35).
 *
 * Both sections open on their tabs in the Reference site, with no paragraph
 * between them and the heading, while `reference/HANDOFF.md` §6.4 names both
 * among the four that must open with one. The column is added empty, and the
 * section is drawn exactly as the baselines have it until somebody writes the
 * paragraph — so nothing a visitor sees changes here.
 *
 * The words themselves are the next migration's, and are proposed rather than
 * published: the ticket asks for the founder's approval before any of them
 * reaches a visitor.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "product_page" ADD COLUMN "roles_lead_ar" varchar;
    ALTER TABLE "product_page" ADD COLUMN "roles_lead_en" varchar;
    ALTER TABLE "_product_page_v" ADD COLUMN "version_roles_lead_ar" varchar;
    ALTER TABLE "_product_page_v" ADD COLUMN "version_roles_lead_en" varchar;
    ALTER TABLE "home_page" ADD COLUMN "four_units_lead_ar" varchar;
    ALTER TABLE "home_page" ADD COLUMN "four_units_lead_en" varchar;
    ALTER TABLE "_home_page_v" ADD COLUMN "version_four_units_lead_ar" varchar;
    ALTER TABLE "_home_page_v" ADD COLUMN "version_four_units_lead_en" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "product_page" DROP COLUMN "roles_lead_ar";
    ALTER TABLE "product_page" DROP COLUMN "roles_lead_en";
    ALTER TABLE "_product_page_v" DROP COLUMN "version_roles_lead_ar";
    ALTER TABLE "_product_page_v" DROP COLUMN "version_roles_lead_en";
    ALTER TABLE "home_page" DROP COLUMN "four_units_lead_ar";
    ALTER TABLE "home_page" DROP COLUMN "four_units_lead_en";
    ALTER TABLE "_home_page_v" DROP COLUMN "version_four_units_lead_ar";
    ALTER TABLE "_home_page_v" DROP COLUMN "version_four_units_lead_en";`);
}
