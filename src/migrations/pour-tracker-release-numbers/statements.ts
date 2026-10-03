/**
 * Records the Pour Tracker releases kept before there was anywhere to record
 * them (ticket 101). Ticket 100 kept releases from 3 October 2026, and the
 * record of release numbers came a migration later, so a number used then is
 * written into it now — or the first file to claim it afterwards would get it.
 *
 * Each number goes to the first file the entry's history named under it: the
 * one it has named for good. Frozen SQL, as every data migration here is
 * (`tests/unit/data-migrations.spec.ts`).
 */
export const RECORD_KEPT = `
INSERT INTO "pour_tracker_releases" ("release_number", "sha256", "size", "file_name", "created_at", "updated_at")
SELECT DISTINCT ON ("version_release_number")
  "version_release_number", "version_sha256", "version_size", "version_file_name", "created_at", "created_at"
FROM "_pour_tracker_v"
WHERE "version_release_number" IS NOT NULL AND "version_sha256" IS NOT NULL AND "version_size" IS NOT NULL
ORDER BY "version_release_number", "created_at"
ON CONFLICT ("release_number") DO NOTHING;
`;

/** Nothing to undo: the record's own table goes with the migration before this one. */
export const RECORD_KEPT_UNDONE = `SELECT 1;`;
