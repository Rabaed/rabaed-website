import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives a submission's confirmation the state it is in between being counted
 * against the limit and being sent (ticket 81, ADR-0022): sending. Counted as
 * sent, so the next request sees it; replaced by what became of the mail, so
 * the record never says sent before it is.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_form_submissions_confirmation" ADD VALUE 'sending';`);
}

/** A confirmation left sending goes back to having no outcome recorded, which the old type allows. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ALTER COLUMN "confirmation" SET DATA TYPE text;
  UPDATE "form_submissions" SET "confirmation" = NULL WHERE "confirmation" = 'sending';
  DROP TYPE "public"."enum_form_submissions_confirmation";
  CREATE TYPE "public"."enum_form_submissions_confirmation" AS ENUM('sent', 'skipped', 'failed', 'withheld');
  ALTER TABLE "form_submissions" ALTER COLUMN "confirmation" SET DATA TYPE "public"."enum_form_submissions_confirmation" USING "confirmation"::"public"."enum_form_submissions_confirmation";`);
}
