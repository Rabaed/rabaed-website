import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the Company profile's entry its header's Download PDF button (ticket
 * 104): the words on it, in Arabic and English, and the four Profile PDFs an
 * Editor may upload in place of Ahmed's, each a file in the profile's own
 * collection (`profile-files`, ticket 108). An empty file is Ahmed's, kept in
 * `public/profile/pdf/`.
 *
 * The words are empty here. `20261104_034953_import_profile_pdf_label` writes
 * «تنزيل PDF» and "Download PDF" in.
 *
 * **Its statements are this entry's alone, by hand.** Ticket 108's
 * `profile_files` was written beside ticket 103's `delay_calculator` rather
 * than after it, so its snapshot lacks the calculator's tables, and Payload,
 * diffing against that snapshot, wrote 103's statements again in front of
 * these. They were taken out; the snapshot beside this one is the whole
 * configuration, as Payload wrote it.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" ADD COLUMN "pdf_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "pdf_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "pdf_arabic_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "pdf_arabic_phone_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "pdf_english_id" integer;
  ALTER TABLE "profile_page" ADD COLUMN "pdf_english_phone_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_arabic_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_arabic_phone_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_english_id" integer;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_pdf_english_phone_id" integer;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_pdf_arabic_id_profile_files_id_fk" FOREIGN KEY ("pdf_arabic_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_pdf_arabic_phone_id_profile_files_id_fk" FOREIGN KEY ("pdf_arabic_phone_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_pdf_english_id_profile_files_id_fk" FOREIGN KEY ("pdf_english_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_page" ADD CONSTRAINT "profile_page_pdf_english_phone_id_profile_files_id_fk" FOREIGN KEY ("pdf_english_phone_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_pdf_arabic_id_profile_files_id_fk" FOREIGN KEY ("version_pdf_arabic_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_pdf_arabic_phone_id_profile_files_id_fk" FOREIGN KEY ("version_pdf_arabic_phone_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_pdf_english_id_profile_files_id_fk" FOREIGN KEY ("version_pdf_english_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_page_v" ADD CONSTRAINT "_profile_page_v_version_pdf_english_phone_id_profile_files_id_fk" FOREIGN KEY ("version_pdf_english_phone_id") REFERENCES "public"."profile_files"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "profile_page_pdf_pdf_arabic_idx" ON "profile_page" USING btree ("pdf_arabic_id");
  CREATE INDEX "profile_page_pdf_pdf_arabic_phone_idx" ON "profile_page" USING btree ("pdf_arabic_phone_id");
  CREATE INDEX "profile_page_pdf_pdf_english_idx" ON "profile_page" USING btree ("pdf_english_id");
  CREATE INDEX "profile_page_pdf_pdf_english_phone_idx" ON "profile_page" USING btree ("pdf_english_phone_id");
  CREATE INDEX "_profile_page_v_version_pdf_version_pdf_arabic_idx" ON "_profile_page_v" USING btree ("version_pdf_arabic_id");
  CREATE INDEX "_profile_page_v_version_pdf_version_pdf_arabic_phone_idx" ON "_profile_page_v" USING btree ("version_pdf_arabic_phone_id");
  CREATE INDEX "_profile_page_v_version_pdf_version_pdf_english_idx" ON "_profile_page_v" USING btree ("version_pdf_english_id");
  CREATE INDEX "_profile_page_v_version_pdf_version_pdf_english_phone_idx" ON "_profile_page_v" USING btree ("version_pdf_english_phone_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_pdf_arabic_id_profile_files_id_fk";
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_pdf_arabic_phone_id_profile_files_id_fk";
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_pdf_english_id_profile_files_id_fk";
  ALTER TABLE "profile_page" DROP CONSTRAINT "profile_page_pdf_english_phone_id_profile_files_id_fk";
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_pdf_arabic_id_profile_files_id_fk";
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_pdf_arabic_phone_id_profile_files_id_fk";
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_pdf_english_id_profile_files_id_fk";
  ALTER TABLE "_profile_page_v" DROP CONSTRAINT "_profile_page_v_version_pdf_english_phone_id_profile_files_id_fk";
  DROP INDEX "profile_page_pdf_pdf_arabic_idx";
  DROP INDEX "profile_page_pdf_pdf_arabic_phone_idx";
  DROP INDEX "profile_page_pdf_pdf_english_idx";
  DROP INDEX "profile_page_pdf_pdf_english_phone_idx";
  DROP INDEX "_profile_page_v_version_pdf_version_pdf_arabic_idx";
  DROP INDEX "_profile_page_v_version_pdf_version_pdf_arabic_phone_idx";
  DROP INDEX "_profile_page_v_version_pdf_version_pdf_english_idx";
  DROP INDEX "_profile_page_v_version_pdf_version_pdf_english_phone_idx";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_arabic_id";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_arabic_phone_id";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_english_id";
  ALTER TABLE "profile_page" DROP COLUMN "pdf_english_phone_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_arabic_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_arabic_phone_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_english_id";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_pdf_english_phone_id";`);
}
