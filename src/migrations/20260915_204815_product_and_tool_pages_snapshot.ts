import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

/**
 * Changes nothing. It exists for its snapshot, `20260915_204815_product_and_tool_pages_snapshot.json`.
 *
 * Ticket 57's tables — the product page, the closing section and the Screen
 * mocks — are created by
 * `20260915_063743_product_page_closing_section_and_screen_mocks`, which was
 * written before ticket 54's tool page migrations reached `main` and so sorts
 * before them. The next `npm run cms:migration` diffs against the newest
 * snapshot. Without this one, that would be the tool page's, which has none of
 * ticket 57's tables, so ticket 58's home page migration tried to create them
 * again. This migration's snapshot is the schema with all of them.
 *
 * Ticket 57's migration was not regenerated on top instead
 * (`docs/agents/parallel-sessions.md`), for the reason
 * `20260914_215019_form_settings_snapshot` gives: the preview database already
 * ran it under its name, and a renamed copy would fail there creating tables
 * that exist.
 *
 * Its generated statements were ticket 57's tables again, and were removed.
 */
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}
