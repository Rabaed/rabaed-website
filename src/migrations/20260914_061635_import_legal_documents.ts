import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { LEGAL_DOCUMENTS_SEED } from './legal-import/seed';

/** Midnight on 1 September 2026 in Riyadh. */
const APPROVED_ON = '2026-09-01T00:00:00+03:00';

/**
 * Imports the Terms, the Privacy Policy and the Referral Program Terms into
 * the CMS, verbatim and misspellings included, as each document's first
 * published version (ticket 25, ADR-0003). From here on they are edited only
 * in the CMS; the Word documents in `reference/legal-source/` stay as the
 * pre-launch archive. Each first version records its author as `IMPORTED_BY`
 * (`legal-import/approved-text.ts`): no Editor made them.
 *
 * The first versions are dated 1 September 2026, not the day this runs: that
 * is the date the approved text carries, and the date its pages gave before
 * the CMS existed. The first version an Editor publishes is dated the day it
 * is published.
 *
 * The statements are frozen in `legal-import/seed.ts`, naming the columns the
 * legal documents' tables had on the day this was written (ticket 68); the
 * text is read in `terms.ts`, `privacy.ts` and `referral-terms.ts` beside it.
 * The seed dates every row the day the database is built, as every frozen
 * seed does, and the two statements after it date these back to the day the
 * text was approved — as they did when the import went through Payload.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(LEGAL_DOCUMENTS_SEED));

  await db.execute(sql`UPDATE "legal_documents" SET "created_at" = ${APPROVED_ON}, "updated_at" = ${APPROVED_ON}`);
  // A version holds its own timestamps and a copy of the document's; a draft
  // being previewed is dated by the copy.
  await db.execute(sql`
    UPDATE "_legal_documents_v"
    SET "created_at" = ${APPROVED_ON}, "updated_at" = ${APPROVED_ON},
        "version_created_at" = ${APPROVED_ON}, "version_updated_at" = ${APPROVED_ON}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_legal_documents_v_version_clauses";
    DELETE FROM "_legal_documents_v";
    DELETE FROM "legal_documents_clauses";
    DELETE FROM "legal_documents";
  `);
}
