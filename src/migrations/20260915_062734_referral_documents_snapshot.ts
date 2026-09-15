import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Changes nothing. It exists for its snapshot, `20260915_062734_referral_documents_snapshot.json`.
 *
 * Ticket 28's tables — the documents on each submission and the Referral
 * Program signup's settings — are created by
 * `20260914_222808_referral_signup_documents`, which was written before ticket
 * 53's start page migrations reached `main` and so sorts before them. The next
 * `npm run cms:migration` diffs against the newest snapshot. Without this one,
 * that would be the start page's, which has none of ticket 28's tables, so the
 * next migration would try to create them again. This migration's snapshot is
 * the schema with all of them.
 *
 * Ticket 28's migration was not regenerated on top instead
 * (`docs/agents/parallel-sessions.md`), for the reason
 * `20260914_215019_form_settings_snapshot` gives: the preview database already
 * ran it under its name, and a renamed copy would fail there creating tables
 * that exist.
 *
 * Its generated statements were ticket 28's tables again, and were removed.
 */
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}
