import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Changes nothing. It exists for its snapshot, `20260914_215019_form_settings_snapshot.json`.
 *
 * Ticket 27's tables are created by `20260914_194143_form_foundation`, which
 * was written before the FAQ and case studies migrations reached `main` and so
 * sorts between them. The next `npm run cms:migration` diffs against the
 * newest snapshot. Without this one, that would be case studies' snapshot,
 * which has no form tables, so the next migration would try to create them
 * again. This migration's snapshot is the schema with all of them.
 *
 * The repository's usual answer is to regenerate ticket 27's migration on top
 * (`docs/agents/parallel-sessions.md`). It was not taken, because the preview
 * database already ran `20260914_194143_form_foundation` under that name, and a
 * renamed copy would fail there creating tables that exist.
 *
 * Its generated statements were the form tables again, and were removed.
 */
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}
