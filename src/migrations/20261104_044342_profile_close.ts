import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives the Company profile's entry its close (ticket 109): sections 10 to 14
 * — the templates' flip cards, why Rabaed, the impact's six figures, the three
 * plans and how we start, with its two buttons — then the contact section and
 * the floating WhatsApp button, each section with its switch.
 *
 * The words are empty here. `20261104_044343_import_profile_close` writes
 * Ahmed's in.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_page_templates_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "profile_page_why_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "profile_page_impact_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"unit_ar" varchar,
  	"unit_en" varchar,
  	"label_ar" varchar,
  	"label_en" varchar
  );
  
  CREATE TABLE "profile_page_plans_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_ar" varchar,
  	"feature_en" varchar
  );
  
  CREATE TABLE "profile_page_plans_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker_ar" varchar,
  	"kicker_en" varchar,
  	"name_ar" varchar,
  	"name_en" varchar
  );
  
  CREATE TABLE "profile_page_start_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_templates_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_why_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_impact_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"unit_ar" varchar,
  	"unit_en" varchar,
  	"label_ar" varchar,
  	"label_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_plans_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature_ar" varchar,
  	"feature_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_plans_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker_ar" varchar,
  	"kicker_en" varchar,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_profile_page_v_version_start_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar,
  	"name_en" varchar,
  	"text_ar" varchar,
  	"text_en" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "profile_page" ADD COLUMN "templates_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "templates_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_lead_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_lead_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_hint_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "templates_hint_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "why_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "why_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "why_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "why_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "why_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "impact_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_lead_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_lead_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_activation_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_activation_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_source_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "impact_source_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "plans_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "plans_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "plans_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "plans_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "plans_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "plans_badge_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "plans_badge_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "start_eyebrow_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_eyebrow_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_card_title_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_card_title_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_card_line_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_card_line_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_demo_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_demo_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_whatsapp_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_whatsapp_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_demo_link_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_demo_link_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_whatsapp_link_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "start_whatsapp_link_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_shows" boolean DEFAULT true;
  ALTER TABLE "profile_page" ADD COLUMN "contact_tagline_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_tagline_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_name_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_name_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_phone_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_phone_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_email_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_email_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_whatsapp_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_whatsapp_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_location_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "contact_location_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "whatsapp_button_label_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "whatsapp_button_label_en" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "whatsapp_button_link_ar" varchar;
  ALTER TABLE "profile_page" ADD COLUMN "whatsapp_button_link_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_lead_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_lead_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_hint_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_templates_hint_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_why_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_why_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_why_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_why_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_why_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_lead_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_lead_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_activation_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_activation_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_source_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_impact_source_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_badge_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_plans_badge_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_eyebrow_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_eyebrow_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_card_title_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_card_title_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_card_line_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_card_line_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_demo_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_demo_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_whatsapp_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_whatsapp_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_demo_link_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_demo_link_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_whatsapp_link_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_start_whatsapp_link_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_shows" boolean DEFAULT true;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_tagline_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_tagline_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_name_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_name_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_phone_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_phone_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_phone" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_email_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_email_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_email" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_whatsapp_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_whatsapp_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_location_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_contact_location_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_whatsapp_button_label_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_whatsapp_button_label_en" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_whatsapp_button_link_ar" varchar;
  ALTER TABLE "_profile_page_v" ADD COLUMN "version_whatsapp_button_link_en" varchar;
  ALTER TABLE "profile_page_templates_cards" ADD CONSTRAINT "profile_page_templates_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_why_reasons" ADD CONSTRAINT "profile_page_why_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_impact_figures" ADD CONSTRAINT "profile_page_impact_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_plans_tiers_features" ADD CONSTRAINT "profile_page_plans_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page_plans_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_plans_tiers" ADD CONSTRAINT "profile_page_plans_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_page_start_steps" ADD CONSTRAINT "profile_page_start_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_templates_cards" ADD CONSTRAINT "_profile_page_v_version_templates_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_why_reasons" ADD CONSTRAINT "_profile_page_v_version_why_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_impact_figures" ADD CONSTRAINT "_profile_page_v_version_impact_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_plans_tiers_features" ADD CONSTRAINT "_profile_page_v_version_plans_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v_version_plans_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_plans_tiers" ADD CONSTRAINT "_profile_page_v_version_plans_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_page_v_version_start_steps" ADD CONSTRAINT "_profile_page_v_version_start_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_page_templates_cards_order_idx" ON "profile_page_templates_cards" USING btree ("_order");
  CREATE INDEX "profile_page_templates_cards_parent_id_idx" ON "profile_page_templates_cards" USING btree ("_parent_id");
  CREATE INDEX "profile_page_why_reasons_order_idx" ON "profile_page_why_reasons" USING btree ("_order");
  CREATE INDEX "profile_page_why_reasons_parent_id_idx" ON "profile_page_why_reasons" USING btree ("_parent_id");
  CREATE INDEX "profile_page_impact_figures_order_idx" ON "profile_page_impact_figures" USING btree ("_order");
  CREATE INDEX "profile_page_impact_figures_parent_id_idx" ON "profile_page_impact_figures" USING btree ("_parent_id");
  CREATE INDEX "profile_page_plans_tiers_features_order_idx" ON "profile_page_plans_tiers_features" USING btree ("_order");
  CREATE INDEX "profile_page_plans_tiers_features_parent_id_idx" ON "profile_page_plans_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "profile_page_plans_tiers_order_idx" ON "profile_page_plans_tiers" USING btree ("_order");
  CREATE INDEX "profile_page_plans_tiers_parent_id_idx" ON "profile_page_plans_tiers" USING btree ("_parent_id");
  CREATE INDEX "profile_page_start_steps_order_idx" ON "profile_page_start_steps" USING btree ("_order");
  CREATE INDEX "profile_page_start_steps_parent_id_idx" ON "profile_page_start_steps" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_templates_cards_order_idx" ON "_profile_page_v_version_templates_cards" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_templates_cards_parent_id_idx" ON "_profile_page_v_version_templates_cards" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_why_reasons_order_idx" ON "_profile_page_v_version_why_reasons" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_why_reasons_parent_id_idx" ON "_profile_page_v_version_why_reasons" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_impact_figures_order_idx" ON "_profile_page_v_version_impact_figures" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_impact_figures_parent_id_idx" ON "_profile_page_v_version_impact_figures" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_plans_tiers_features_order_idx" ON "_profile_page_v_version_plans_tiers_features" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_plans_tiers_features_parent_id_idx" ON "_profile_page_v_version_plans_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_plans_tiers_order_idx" ON "_profile_page_v_version_plans_tiers" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_plans_tiers_parent_id_idx" ON "_profile_page_v_version_plans_tiers" USING btree ("_parent_id");
  CREATE INDEX "_profile_page_v_version_start_steps_order_idx" ON "_profile_page_v_version_start_steps" USING btree ("_order");
  CREATE INDEX "_profile_page_v_version_start_steps_parent_id_idx" ON "_profile_page_v_version_start_steps" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_page_templates_cards" CASCADE;
  DROP TABLE "profile_page_why_reasons" CASCADE;
  DROP TABLE "profile_page_impact_figures" CASCADE;
  DROP TABLE "profile_page_plans_tiers_features" CASCADE;
  DROP TABLE "profile_page_plans_tiers" CASCADE;
  DROP TABLE "profile_page_start_steps" CASCADE;
  DROP TABLE "_profile_page_v_version_templates_cards" CASCADE;
  DROP TABLE "_profile_page_v_version_why_reasons" CASCADE;
  DROP TABLE "_profile_page_v_version_impact_figures" CASCADE;
  DROP TABLE "_profile_page_v_version_plans_tiers_features" CASCADE;
  DROP TABLE "_profile_page_v_version_plans_tiers" CASCADE;
  DROP TABLE "_profile_page_v_version_start_steps" CASCADE;
  ALTER TABLE "profile_page" DROP COLUMN "templates_shows";
  ALTER TABLE "profile_page" DROP COLUMN "templates_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "templates_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "templates_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "templates_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "templates_lead_ar";
  ALTER TABLE "profile_page" DROP COLUMN "templates_lead_en";
  ALTER TABLE "profile_page" DROP COLUMN "templates_hint_ar";
  ALTER TABLE "profile_page" DROP COLUMN "templates_hint_en";
  ALTER TABLE "profile_page" DROP COLUMN "why_shows";
  ALTER TABLE "profile_page" DROP COLUMN "why_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "why_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "why_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "why_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "impact_shows";
  ALTER TABLE "profile_page" DROP COLUMN "impact_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "impact_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "impact_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "impact_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "impact_lead_ar";
  ALTER TABLE "profile_page" DROP COLUMN "impact_lead_en";
  ALTER TABLE "profile_page" DROP COLUMN "impact_activation_ar";
  ALTER TABLE "profile_page" DROP COLUMN "impact_activation_en";
  ALTER TABLE "profile_page" DROP COLUMN "impact_source_ar";
  ALTER TABLE "profile_page" DROP COLUMN "impact_source_en";
  ALTER TABLE "profile_page" DROP COLUMN "plans_shows";
  ALTER TABLE "profile_page" DROP COLUMN "plans_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "plans_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "plans_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "plans_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "plans_badge_ar";
  ALTER TABLE "profile_page" DROP COLUMN "plans_badge_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_shows";
  ALTER TABLE "profile_page" DROP COLUMN "start_eyebrow_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_eyebrow_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_card_title_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_card_title_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_card_line_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_card_line_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_demo_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_demo_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_whatsapp_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_whatsapp_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_demo_link_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_demo_link_en";
  ALTER TABLE "profile_page" DROP COLUMN "start_whatsapp_link_ar";
  ALTER TABLE "profile_page" DROP COLUMN "start_whatsapp_link_en";
  ALTER TABLE "profile_page" DROP COLUMN "contact_shows";
  ALTER TABLE "profile_page" DROP COLUMN "contact_tagline_ar";
  ALTER TABLE "profile_page" DROP COLUMN "contact_tagline_en";
  ALTER TABLE "profile_page" DROP COLUMN "contact_name_ar";
  ALTER TABLE "profile_page" DROP COLUMN "contact_name_en";
  ALTER TABLE "profile_page" DROP COLUMN "contact_phone_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "contact_phone_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "contact_phone";
  ALTER TABLE "profile_page" DROP COLUMN "contact_email_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "contact_email_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "contact_email";
  ALTER TABLE "profile_page" DROP COLUMN "contact_whatsapp_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "contact_whatsapp_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "contact_location_ar";
  ALTER TABLE "profile_page" DROP COLUMN "contact_location_en";
  ALTER TABLE "profile_page" DROP COLUMN "whatsapp_button_label_ar";
  ALTER TABLE "profile_page" DROP COLUMN "whatsapp_button_label_en";
  ALTER TABLE "profile_page" DROP COLUMN "whatsapp_button_link_ar";
  ALTER TABLE "profile_page" DROP COLUMN "whatsapp_button_link_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_lead_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_lead_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_hint_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_templates_hint_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_why_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_why_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_why_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_why_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_why_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_lead_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_lead_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_activation_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_activation_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_source_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_impact_source_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_badge_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_plans_badge_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_eyebrow_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_eyebrow_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_card_title_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_card_title_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_card_line_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_card_line_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_demo_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_demo_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_whatsapp_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_whatsapp_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_demo_link_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_demo_link_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_whatsapp_link_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_start_whatsapp_link_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_shows";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_tagline_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_tagline_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_name_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_name_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_phone_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_phone_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_phone";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_email_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_email_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_email";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_whatsapp_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_whatsapp_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_location_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_contact_location_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_whatsapp_button_label_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_whatsapp_button_label_en";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_whatsapp_button_link_ar";
  ALTER TABLE "_profile_page_v" DROP COLUMN "version_whatsapp_button_link_en";`)
}
