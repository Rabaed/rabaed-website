/**
 * Starts an empty database and runs `scripts/freeze-seed.ts` against it, which
 * is where what that script does is written down.
 *
 *   npm run cms:freeze-seed
 *
 * An empty one on purpose: the frozen SQL is the statements an import makes on
 * a database built from scratch, which is the only database any of them ever
 * meets again.
 */
import { PAYLOAD_BIN, runNode, withThrowawayDatabase } from './local-database.mjs';

const failure = await withThrowawayDatabase('freeze-seed', (env) =>
  runNode([PAYLOAD_BIN, 'run', 'scripts/freeze-seed.ts'], env),
);

if (failure) {
  console.error(`\nNothing was frozen: ${failure.message}`);
  process.exit(1);
}
