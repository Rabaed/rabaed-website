import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the Company profile's entry the words on its header's Download PDF
 * button (ticket 104), in Arabic and English.
 *
 * Empty here. `20261104_023920_import_profile_pdf_label` writes «تنزيل PDF» and
 * "Download PDF" in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" ADD COLUMN "pdf_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "pdf_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_label_en" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" DROP COLUMN "pdf_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_label_en";`);
}
