import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives each Screen mock a Phone crop an Editor can upload beside each of its
 * replacement pictures, one for the Arabic pages and one for the English
 * (ticket 79). Empty here: until an Editor uploads one, phones show what they
 * showed before.
 *
 * Postgres cuts an index's name to 63 characters, and Payload numbers the
 * names that come out the same; adding two such indexes a mock renumbers the
 * version table's, which is why some are dropped and made again.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_screen_mocks_v_version_correspondence_version_corresp_1_idx";
  DROP INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_1_idx";
  DROP INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__1_idx";
  DROP INDEX "_screen_mocks_v_version_approvals_table_version_approv_1_idx";
  ALTER TABLE "screen_mocks" ADD COLUMN "correspondence_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "correspondence_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "kanban_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "kanban_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "daily_report_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "daily_report_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "documents_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "documents_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "stamped_sheet_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "stamped_sheet_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "overview_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "overview_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "approvals_table_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "approvals_table_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "submittal_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD COLUMN "submittal_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_correspondence_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_correspondence_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_kanban_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_kanban_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_daily_report_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_daily_report_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_documents_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_documents_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_stamped_sheet_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_stamped_sheet_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_overview_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_overview_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_approvals_table_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_approvals_table_english_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_submittal_phone_crop_id" integer;
  ALTER TABLE "_screen_mocks_v" ADD COLUMN "version_submittal_english_phone_crop_id" integer;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_correspondence_phone_crop_id_media_id_fk" FOREIGN KEY ("correspondence_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_correspondence_english_phone_crop_id_media_id_fk" FOREIGN KEY ("correspondence_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_kanban_phone_crop_id_media_id_fk" FOREIGN KEY ("kanban_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_kanban_english_phone_crop_id_media_id_fk" FOREIGN KEY ("kanban_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_daily_report_phone_crop_id_media_id_fk" FOREIGN KEY ("daily_report_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_daily_report_english_phone_crop_id_media_id_fk" FOREIGN KEY ("daily_report_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_documents_phone_crop_id_media_id_fk" FOREIGN KEY ("documents_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_documents_english_phone_crop_id_media_id_fk" FOREIGN KEY ("documents_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_stamped_sheet_phone_crop_id_media_id_fk" FOREIGN KEY ("stamped_sheet_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_stamped_sheet_english_phone_crop_id_media_id_fk" FOREIGN KEY ("stamped_sheet_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_overview_phone_crop_id_media_id_fk" FOREIGN KEY ("overview_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_overview_english_phone_crop_id_media_id_fk" FOREIGN KEY ("overview_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_approvals_table_phone_crop_id_media_id_fk" FOREIGN KEY ("approvals_table_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_approvals_table_english_phone_crop_id_media_id_fk" FOREIGN KEY ("approvals_table_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_submittal_phone_crop_id_media_id_fk" FOREIGN KEY ("submittal_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_mocks" ADD CONSTRAINT "screen_mocks_submittal_english_phone_crop_id_media_id_fk" FOREIGN KEY ("submittal_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_correspondence_phone_crop_id_media_id_fk" FOREIGN KEY ("version_correspondence_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_correspondence_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_correspondence_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_kanban_phone_crop_id_media_id_fk" FOREIGN KEY ("version_kanban_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_kanban_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_kanban_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_daily_report_phone_crop_id_media_id_fk" FOREIGN KEY ("version_daily_report_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_daily_report_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_daily_report_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_documents_phone_crop_id_media_id_fk" FOREIGN KEY ("version_documents_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_documents_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_documents_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_stamped_sheet_phone_crop_id_media_id_fk" FOREIGN KEY ("version_stamped_sheet_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_stamped_sheet_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_stamped_sheet_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_overview_phone_crop_id_media_id_fk" FOREIGN KEY ("version_overview_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_overview_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_overview_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_approvals_table_phone_crop_id_media_id_fk" FOREIGN KEY ("version_approvals_table_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_approvals_table_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_approvals_table_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_submittal_phone_crop_id_media_id_fk" FOREIGN KEY ("version_submittal_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_screen_mocks_v" ADD CONSTRAINT "_screen_mocks_v_version_submittal_english_phone_crop_id_media_id_fk" FOREIGN KEY ("version_submittal_english_phone_crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "screen_mocks_correspondence_correspondence_phone_crop_idx" ON "screen_mocks" USING btree ("correspondence_phone_crop_id");
  CREATE INDEX "screen_mocks_correspondence_correspondence_english_phone_idx" ON "screen_mocks" USING btree ("correspondence_english_phone_crop_id");
  CREATE INDEX "screen_mocks_kanban_kanban_phone_crop_idx" ON "screen_mocks" USING btree ("kanban_phone_crop_id");
  CREATE INDEX "screen_mocks_kanban_kanban_english_phone_crop_idx" ON "screen_mocks" USING btree ("kanban_english_phone_crop_id");
  CREATE INDEX "screen_mocks_daily_report_daily_report_phone_crop_idx" ON "screen_mocks" USING btree ("daily_report_phone_crop_id");
  CREATE INDEX "screen_mocks_daily_report_daily_report_english_phone_cro_idx" ON "screen_mocks" USING btree ("daily_report_english_phone_crop_id");
  CREATE INDEX "screen_mocks_documents_documents_phone_crop_idx" ON "screen_mocks" USING btree ("documents_phone_crop_id");
  CREATE INDEX "screen_mocks_documents_documents_english_phone_crop_idx" ON "screen_mocks" USING btree ("documents_english_phone_crop_id");
  CREATE INDEX "screen_mocks_stamped_sheet_stamped_sheet_phone_crop_idx" ON "screen_mocks" USING btree ("stamped_sheet_phone_crop_id");
  CREATE INDEX "screen_mocks_stamped_sheet_stamped_sheet_english_phone_c_idx" ON "screen_mocks" USING btree ("stamped_sheet_english_phone_crop_id");
  CREATE INDEX "screen_mocks_overview_overview_phone_crop_idx" ON "screen_mocks" USING btree ("overview_phone_crop_id");
  CREATE INDEX "screen_mocks_overview_overview_english_phone_crop_idx" ON "screen_mocks" USING btree ("overview_english_phone_crop_id");
  CREATE INDEX "screen_mocks_approvals_table_approvals_table_phone_crop_idx" ON "screen_mocks" USING btree ("approvals_table_phone_crop_id");
  CREATE INDEX "screen_mocks_approvals_table_approvals_table_english_pho_idx" ON "screen_mocks" USING btree ("approvals_table_english_phone_crop_id");
  CREATE INDEX "screen_mocks_submittal_submittal_phone_crop_idx" ON "screen_mocks" USING btree ("submittal_phone_crop_id");
  CREATE INDEX "screen_mocks_submittal_submittal_english_phone_crop_idx" ON "screen_mocks" USING btree ("submittal_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_correspondence_version_corresp_2_idx" ON "_screen_mocks_v" USING btree ("version_correspondence_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_correspondence_version_corresp_3_idx" ON "_screen_mocks_v" USING btree ("version_correspondence_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_kanban_version_kanban_phone_crop_idx" ON "_screen_mocks_v" USING btree ("version_kanban_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_kanban_version_kanban_english_ph_idx" ON "_screen_mocks_v" USING btree ("version_kanban_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_2_idx" ON "_screen_mocks_v" USING btree ("version_daily_report_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_3_idx" ON "_screen_mocks_v" USING btree ("version_daily_report_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_documents_version_documents_phon_idx" ON "_screen_mocks_v" USING btree ("version_documents_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_documents_version_documents_en_1_idx" ON "_screen_mocks_v" USING btree ("version_documents_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__2_idx" ON "_screen_mocks_v" USING btree ("version_stamped_sheet_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__3_idx" ON "_screen_mocks_v" USING btree ("version_stamped_sheet_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_overview_version_overview_phone__idx" ON "_screen_mocks_v" USING btree ("version_overview_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_overview_version_overview_engl_1_idx" ON "_screen_mocks_v" USING btree ("version_overview_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_approvals_table_version_approv_2_idx" ON "_screen_mocks_v" USING btree ("version_approvals_table_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_approvals_table_version_approv_3_idx" ON "_screen_mocks_v" USING btree ("version_approvals_table_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_submittal_version_submittal_phon_idx" ON "_screen_mocks_v" USING btree ("version_submittal_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_submittal_version_submittal_en_1_idx" ON "_screen_mocks_v" USING btree ("version_submittal_english_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_correspondence_version_corresp_1_idx" ON "_screen_mocks_v" USING btree ("version_correspondence_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_1_idx" ON "_screen_mocks_v" USING btree ("version_daily_report_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__1_idx" ON "_screen_mocks_v" USING btree ("version_stamped_sheet_phone_crop_id");
  CREATE INDEX "_screen_mocks_v_version_approvals_table_version_approv_1_idx" ON "_screen_mocks_v" USING btree ("version_approvals_table_phone_crop_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_correspondence_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_correspondence_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_kanban_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_kanban_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_daily_report_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_daily_report_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_documents_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_documents_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_stamped_sheet_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_stamped_sheet_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_overview_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_overview_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_approvals_table_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_approvals_table_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_submittal_phone_crop_id_media_id_fk";
  
  ALTER TABLE "screen_mocks" DROP CONSTRAINT "screen_mocks_submittal_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_correspondence_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_correspondence_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_kanban_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_kanban_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_daily_report_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_daily_report_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_documents_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_documents_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_stamped_sheet_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_stamped_sheet_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_overview_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_overview_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_approvals_table_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_approvals_table_english_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_submittal_phone_crop_id_media_id_fk";
  
  ALTER TABLE "_screen_mocks_v" DROP CONSTRAINT "_screen_mocks_v_version_submittal_english_phone_crop_id_media_id_fk";
  
  DROP INDEX "screen_mocks_correspondence_correspondence_phone_crop_idx";
  DROP INDEX "screen_mocks_correspondence_correspondence_english_phone_idx";
  DROP INDEX "screen_mocks_kanban_kanban_phone_crop_idx";
  DROP INDEX "screen_mocks_kanban_kanban_english_phone_crop_idx";
  DROP INDEX "screen_mocks_daily_report_daily_report_phone_crop_idx";
  DROP INDEX "screen_mocks_daily_report_daily_report_english_phone_cro_idx";
  DROP INDEX "screen_mocks_documents_documents_phone_crop_idx";
  DROP INDEX "screen_mocks_documents_documents_english_phone_crop_idx";
  DROP INDEX "screen_mocks_stamped_sheet_stamped_sheet_phone_crop_idx";
  DROP INDEX "screen_mocks_stamped_sheet_stamped_sheet_english_phone_c_idx";
  DROP INDEX "screen_mocks_overview_overview_phone_crop_idx";
  DROP INDEX "screen_mocks_overview_overview_english_phone_crop_idx";
  DROP INDEX "screen_mocks_approvals_table_approvals_table_phone_crop_idx";
  DROP INDEX "screen_mocks_approvals_table_approvals_table_english_pho_idx";
  DROP INDEX "screen_mocks_submittal_submittal_phone_crop_idx";
  DROP INDEX "screen_mocks_submittal_submittal_english_phone_crop_idx";
  DROP INDEX "_screen_mocks_v_version_correspondence_version_corresp_2_idx";
  DROP INDEX "_screen_mocks_v_version_correspondence_version_corresp_3_idx";
  DROP INDEX "_screen_mocks_v_version_kanban_version_kanban_phone_crop_idx";
  DROP INDEX "_screen_mocks_v_version_kanban_version_kanban_english_ph_idx";
  DROP INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_2_idx";
  DROP INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_3_idx";
  DROP INDEX "_screen_mocks_v_version_documents_version_documents_phon_idx";
  DROP INDEX "_screen_mocks_v_version_documents_version_documents_en_1_idx";
  DROP INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__2_idx";
  DROP INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__3_idx";
  DROP INDEX "_screen_mocks_v_version_overview_version_overview_phone__idx";
  DROP INDEX "_screen_mocks_v_version_overview_version_overview_engl_1_idx";
  DROP INDEX "_screen_mocks_v_version_approvals_table_version_approv_2_idx";
  DROP INDEX "_screen_mocks_v_version_approvals_table_version_approv_3_idx";
  DROP INDEX "_screen_mocks_v_version_submittal_version_submittal_phon_idx";
  DROP INDEX "_screen_mocks_v_version_submittal_version_submittal_en_1_idx";
  DROP INDEX "_screen_mocks_v_version_correspondence_version_corresp_1_idx";
  DROP INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_1_idx";
  DROP INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__1_idx";
  DROP INDEX "_screen_mocks_v_version_approvals_table_version_approv_1_idx";
  CREATE INDEX "_screen_mocks_v_version_correspondence_version_corresp_1_idx" ON "_screen_mocks_v" USING btree ("version_correspondence_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_daily_report_version_daily_rep_1_idx" ON "_screen_mocks_v" USING btree ("version_daily_report_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_stamped_sheet_version_stamped__1_idx" ON "_screen_mocks_v" USING btree ("version_stamped_sheet_english_picture_id");
  CREATE INDEX "_screen_mocks_v_version_approvals_table_version_approv_1_idx" ON "_screen_mocks_v" USING btree ("version_approvals_table_english_picture_id");
  ALTER TABLE "screen_mocks" DROP COLUMN "correspondence_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "correspondence_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "kanban_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "kanban_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "daily_report_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "daily_report_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "documents_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "documents_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "stamped_sheet_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "stamped_sheet_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "overview_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "overview_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "approvals_table_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "approvals_table_english_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "submittal_phone_crop_id";
  ALTER TABLE "screen_mocks" DROP COLUMN "submittal_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_correspondence_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_correspondence_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_kanban_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_kanban_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_daily_report_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_daily_report_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_documents_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_documents_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_stamped_sheet_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_stamped_sheet_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_overview_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_overview_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_approvals_table_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_approvals_table_english_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_submittal_phone_crop_id";
  ALTER TABLE "_screen_mocks_v" DROP COLUMN "version_submittal_english_phone_crop_id";`)
}
