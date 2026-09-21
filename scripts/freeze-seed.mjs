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
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PAYLOAD_BIN, freshDatabasePort, repoRoot, runNode, startDatabase } from './local-database.mjs';

const directory = await mkdtemp(path.join(tmpdir(), 'rabaed-freeze-seed-'));
const port = freshDatabasePort(repoRoot) + 1;
const database = await startDatabase({ directory: path.join(directory, 'postgres'), port });

let failure = null;
try {
  await runNode([PAYLOAD_BIN, 'run', 'scripts/freeze-seed.ts'], {
    ...process.env,
    DATABASE_URL: database.url,
    PAYLOAD_SECRET: 'local-development-only',
    // The marks the Trust strip import uploads go to the throwaway directory,
    // not into the checkout.
    MEDIA_DIR: path.join(directory, 'media'),
    SHARING_IMAGE_DIR: path.join(directory, 'sharing-images'),
  });
} catch (error) {
  failure = error;
}

await database.stop().catch(() => {});
await rm(directory, { recursive: true, force: true }).catch(() => {});

if (failure) {
  console.error(`\nNothing was frozen: ${failure.message}`);
  process.exit(1);
}
