import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Gives a submission's confirmation an outcome of its own (ticket 81,
 * ADR-0022): withheld, because its address or the site had been sent as many
 * confirmations as the limit allows. The request is stored and alerted all the
 * same, and the team replies by hand.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_form_submissions_confirmation" ADD VALUE 'withheld';`);
}

/** A confirmation withheld goes back to having no outcome recorded, which the old type allows. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ALTER COLUMN "confirmation" SET DATA TYPE text;
  UPDATE "form_submissions" SET "confirmation" = NULL WHERE "confirmation" = 'withheld';
  DROP TYPE "public"."enum_form_submissions_confirmation";
  CREATE TYPE "public"."enum_form_submissions_confirmation" AS ENUM('sent', 'skipped', 'failed');
  ALTER TABLE "form_submissions" ALTER COLUMN "confirmation" SET DATA TYPE "public"."enum_form_submissions_confirmation" USING "confirmation"::"public"."enum_form_submissions_confirmation";`);
}
