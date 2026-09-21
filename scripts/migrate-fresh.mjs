/**
 * Runs every migration against a database built from scratch — the one place
 * an older data migration meeting a newer schema ever shows up (ticket 63).
 *
 *   npm run cms:migrate-fresh
 *
 * The test server does the same before it builds the site
 * (`scripts/test-server.mjs`), but a whole suite takes minutes; this takes
 * seconds and says the same thing about the migrations.
 */
import { PAYLOAD_BIN, runNode, withThrowawayDatabase } from './local-database.mjs';

const failure = await withThrowawayDatabase('migrate-fresh', (env) => runNode([PAYLOAD_BIN, 'migrate'], env));

if (failure) {
  console.error(`\nThe migrations do not run on a database built from scratch: ${failure.message}`);
  process.exit(1);
}
console.log('\nEvery migration ran on a database built from scratch.');
