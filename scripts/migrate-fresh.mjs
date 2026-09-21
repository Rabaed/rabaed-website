/**
 * Runs every migration against a database built from scratch — the one place
 * an older data migration meeting a newer schema ever shows up (ticket 63).
 *
 *   npm run cms:migrate-fresh
 *
 * A throwaway Postgres in the system's temporary directory, migrated from
 * nothing and thrown away again. The test server does the same before it
 * builds the site (`scripts/test-server.mjs`), but a whole suite takes
 * minutes; this takes seconds and says the same thing about the migrations.
 */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PAYLOAD_BIN, freshDatabasePort, repoRoot, runNode, startDatabase } from './local-database.mjs';

const directory = await mkdtemp(path.join(tmpdir(), 'rabaed-migrate-fresh-'));
const port = freshDatabasePort(repoRoot);
const database = await startDatabase({ directory: path.join(directory, 'postgres'), port });
console.log(`Empty database on port ${port}.`);

let failure = null;
try {
  await runNode([PAYLOAD_BIN, 'migrate'], {
    ...process.env,
    DATABASE_URL: database.url,
    PAYLOAD_SECRET: 'local-development-only',
    // Anything a migration uploads goes to the throwaway directory, not into
    // the checkout.
    MEDIA_DIR: path.join(directory, 'media'),
    SHARING_IMAGE_DIR: path.join(directory, 'sharing-images'),
  });
} catch (error) {
  failure = error;
}

await database.stop().catch(() => {});
await rm(directory, { recursive: true, force: true }).catch(() => {});

if (failure) {
  console.error(`\nThe migrations do not run on a database built from scratch: ${failure.message}`);
  process.exit(1);
}
console.log('\nEvery migration ran on a database built from scratch.');
