import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { SKIP_REVALIDATION } from '../cms/globals/site-settings';
import { toLegalDocumentFields } from './legal-import/approved-text';
import { PRIVACY_POLICY } from './legal-import/privacy';
import { REFERRAL_TERMS } from './legal-import/referral-terms';
import { TERMS } from './legal-import/terms';

/** What the first versions record as their author: no Editor made them. */
const IMPORTED_BY = 'استيراد النص المعتمد قبل الإطلاق';

/** Midnight on 1 September 2026 in Riyadh. */
const APPROVED_ON = '2026-09-01T00:00:00+03:00';

/**
 * Imports the Terms, the Privacy Policy and the Referral Program Terms into
 * the CMS, verbatim and misspellings included, as each document's first
 * published version (ticket 25, ADR-0003). From here on they are edited only
 * in the CMS; the Word documents in `reference/legal-source/` stay as the
 * pre-launch archive.
 *
 * The first versions are dated 1 September 2026, not the day this runs: that
 * is the date the approved text carries, and the date its pages gave before
 * the CMS existed. The first version an Editor publishes is dated the day it
 * is published.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const documents = [
    ['terms', TERMS],
    ['privacy', PRIVACY_POLICY],
    ['referral-terms', REFERRAL_TERMS],
  ] as const;

  for (const [slug, document] of documents) {
    await payload.create({
      collection: 'legal-documents',
      data: { slug, editedBy: IMPORTED_BY, ...toLegalDocumentFields(document), _status: 'published' },
      // A migration runs outside the site, where there are no pages to
      // refresh (`src/cms/globals/site-settings.ts`).
      context: { [SKIP_REVALIDATION]: true },
      req,
    });
  }

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
