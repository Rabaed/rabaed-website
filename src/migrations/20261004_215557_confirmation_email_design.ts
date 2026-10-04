import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "email_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_email_url" varchar,
  	"sizes_email_width" numeric,
  	"sizes_email_height" numeric,
  	"sizes_email_mime_type" varchar,
  	"sizes_email_filesize" numeric,
  	"sizes_email_filename" varchar
  );
  
  CREATE TABLE "confirmation_email" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_images_id" integer;
  ALTER TABLE "demo_request_form" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "demo_request_form" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "demo_request_form" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_demo_request_form_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_demo_request_form_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_demo_request_form_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "demo_request_form_en" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "demo_request_form_en" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "demo_request_form_en" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_demo_request_form_en_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_demo_request_form_en_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_demo_request_form_en_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "referral_signup_form" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "referral_signup_form" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "referral_signup_form" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_referral_signup_form_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_referral_signup_form_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_referral_signup_form_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "referral_signup_form_en" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "referral_signup_form_en" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "referral_signup_form_en" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_referral_signup_form_en_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_referral_signup_form_en_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_referral_signup_form_en_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "tool_download_form" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "tool_download_form" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "tool_download_form" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_tool_download_form_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_tool_download_form_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_tool_download_form_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "tool_download_form_en" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "tool_download_form_en" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "tool_download_form_en" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_tool_download_form_en_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_tool_download_form_en_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_tool_download_form_en_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "partnership_application_form" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "partnership_application_form" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "partnership_application_form" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_partnership_application_form_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_partnership_application_form_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_partnership_application_form_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "partnership_application_form_en" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "partnership_application_form_en" ADD COLUMN "confirmation_button_label" varchar;
  ALTER TABLE "partnership_application_form_en" ADD COLUMN "confirmation_button_link" varchar;
  ALTER TABLE "_partnership_application_form_en_v" ADD COLUMN "version_confirmation_message" jsonb;
  ALTER TABLE "_partnership_application_form_en_v" ADD COLUMN "version_confirmation_button_label" varchar;
  ALTER TABLE "_partnership_application_form_en_v" ADD COLUMN "version_confirmation_button_link" varchar;
  ALTER TABLE "confirmation_email" ADD CONSTRAINT "confirmation_email_banner_id_email_images_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."email_images"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "email_images_updated_at_idx" ON "email_images" USING btree ("updated_at");
  CREATE INDEX "email_images_created_at_idx" ON "email_images" USING btree ("created_at");
  CREATE UNIQUE INDEX "email_images_filename_idx" ON "email_images" USING btree ("filename");
  CREATE INDEX "email_images_sizes_email_sizes_email_filename_idx" ON "email_images" USING btree ("sizes_email_filename");
  CREATE INDEX "confirmation_email_banner_idx" ON "confirmation_email" USING btree ("banner_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_images_fk" FOREIGN KEY ("email_images_id") REFERENCES "public"."email_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_email_images_id_idx" ON "payload_locked_documents_rels" USING btree ("email_images_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "confirmation_email" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "email_images" CASCADE;
  DROP TABLE "confirmation_email" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_images_fk";
  
  DROP INDEX "payload_locked_documents_rels_email_images_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_images_id";
  ALTER TABLE "demo_request_form" DROP COLUMN "confirmation_message";
  ALTER TABLE "demo_request_form" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "demo_request_form" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_demo_request_form_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_demo_request_form_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_demo_request_form_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "demo_request_form_en" DROP COLUMN "confirmation_message";
  ALTER TABLE "demo_request_form_en" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "demo_request_form_en" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_demo_request_form_en_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_demo_request_form_en_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_demo_request_form_en_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "referral_signup_form" DROP COLUMN "confirmation_message";
  ALTER TABLE "referral_signup_form" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "referral_signup_form" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_referral_signup_form_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_referral_signup_form_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_referral_signup_form_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "referral_signup_form_en" DROP COLUMN "confirmation_message";
  ALTER TABLE "referral_signup_form_en" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "referral_signup_form_en" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_referral_signup_form_en_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_referral_signup_form_en_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_referral_signup_form_en_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "tool_download_form" DROP COLUMN "confirmation_message";
  ALTER TABLE "tool_download_form" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "tool_download_form" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_tool_download_form_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_tool_download_form_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_tool_download_form_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "tool_download_form_en" DROP COLUMN "confirmation_message";
  ALTER TABLE "tool_download_form_en" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "tool_download_form_en" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_tool_download_form_en_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_tool_download_form_en_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_tool_download_form_en_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "partnership_application_form" DROP COLUMN "confirmation_message";
  ALTER TABLE "partnership_application_form" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "partnership_application_form" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_partnership_application_form_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_partnership_application_form_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_partnership_application_form_v" DROP COLUMN "version_confirmation_button_link";
  ALTER TABLE "partnership_application_form_en" DROP COLUMN "confirmation_message";
  ALTER TABLE "partnership_application_form_en" DROP COLUMN "confirmation_button_label";
  ALTER TABLE "partnership_application_form_en" DROP COLUMN "confirmation_button_link";
  ALTER TABLE "_partnership_application_form_en_v" DROP COLUMN "version_confirmation_message";
  ALTER TABLE "_partnership_application_form_en_v" DROP COLUMN "version_confirmation_button_label";
  ALTER TABLE "_partnership_application_form_en_v" DROP COLUMN "version_confirmation_button_link";`)
}
