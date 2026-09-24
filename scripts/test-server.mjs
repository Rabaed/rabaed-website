/**
 * The server the end-to-end suite runs against (playwright.config.ts): a
 * throwaway database, migrated and given the account that invites the suites'
 * editors (`tests/e2e/editors.ts`), then the application built and started
 * against it.
 *
 * Throwaway on purpose. The spec asks for CMS content in tests to be real
 * content in a real database, not fixtures injected at render time; starting
 * from nothing each run also means a migration that only works on a database
 * somebody has already fiddled with fails here first.
 *
 * Postgres listens on `PORT + 2000` and keeps its data in a directory named
 * after `PORT`, so copies of the repository running the suite side by side on
 * different `TEST_PORT`s never share a database (docs/agents/parallel-sessions.md).
 *
 * **`--publishing`** starts the second server, the one the suites that publish
 * run against (ticket 89). It has a database of its own like the first, but
 * does not build: Playwright starts the two one after the other, so the first
 * server's build is finished, and this one serves a copy of it. A copy rather
 * than the same folder, because a server writes the pages it rebuilds into it,
 * and the other server would then serve pages built from a database that is
 * not its own. The copy leaves out the build's cache, the one part of any size.
 * `FIRST_SERVER_PORT` says where the build was made (`playwright.config.ts`).
 */
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { cp, lstat, readdir, readFile, readlink, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NEXT_BIN, PAYLOAD_BIN, repoRoot, runNode, startDatabase } from './local-database.mjs';
import { KEYHOLDER } from '../tests/e2e/editors.ts';
import { documentsDirectory, outboxDirectory, testServerScratch } from '../tests/e2e/forms.ts';

const port = Number(process.env.PORT ?? 3100);
const scratch = testServerScratch(port);
const publishing = process.argv.includes('--publishing');
/** The build the server serves, inside the checkout as Next.js requires (`next.config.ts`). */
const buildDir = publishing ? '.next-publishing' : '.next';

// Left behind by the last run, which ends by being killed.
await rm(scratch, { recursive: true, force: true });

const database = await startDatabase({ directory: path.join(scratch, 'postgres'), port: port + 2000 });

const env = {
  ...process.env,
  DATABASE_URL: database.url,
  PAYLOAD_SECRET: randomBytes(32).toString('hex'),
  MEDIA_DIR: path.join(scratch, 'media'),
  SHARING_IMAGE_DIR: path.join(scratch, 'sharing-images'),
  // Mail is written here instead of sent, for the form suite to read
  // (`src/forms/mail.ts`). Real credentials on the machine are never used.
  MAIL_OUTBOX_DIR: outboxDirectory(port),
  // Applicant documents are written here instead of to the private bucket
  // (`src/forms/documents.ts`), for the form suite to check.
  DOCUMENTS_DIR: documentsDirectory(port),
  S3_DOCUMENTS_BUCKET: '',
  MAIL_USER: '',
  MAIL_PASSWORD: '',
  TEST_BUILD_DIR: buildDir,
};

try {
  await runNode([PAYLOAD_BIN, 'migrate'], env);
  // One account, which invites each suite's own on its first sign-in (`tests/e2e/editors.ts`).
  await runNode([PAYLOAD_BIN, 'run', 'scripts/create-editor.ts'], {
    ...env,
    EDITOR_EMAIL: KEYHOLDER.email,
    EDITOR_PASSWORD: KEYHOLDER.password,
  });
  if (publishing) {
    await copyBuild(path.join(repoRoot, '.next'), path.join(repoRoot, buildDir));
    await moveOrigin(path.join(repoRoot, buildDir), Number(process.env.FIRST_SERVER_PORT), port);
  }
  else await runNode([NEXT_BIN, 'build'], env);
} catch (error) {
  await database.stop();
  throw error;
}

const server = spawn(process.execPath, [NEXT_BIN, 'start', '--port', String(port)], {
  cwd: repoRoot,
  env,
  stdio: 'inherit',
});

async function shutDown(code) {
  server.kill();
  await database.stop().catch(() => {});
  process.exit(code);
}

server.once('exit', (code) => shutDown(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => shutDown(0));

/**
 * Copies the build at `from` to `to`, leaving out its cache and what `next
 * dev` keeps beside it. The build links a few packages in from `node_modules`;
 * each link is made again rather than copied, as a junction, which Windows
 * lets anyone make where a copied link needs an administrator.
 */
async function copyBuild(from, to) {
  await rm(to, { recursive: true, force: true });
  const links = [];
  await cp(from, to, {
    recursive: true,
    filter: async (source) => {
      const within = path.relative(from, source);
      if (within === 'cache' || within === 'dev') return false;
      if ((await lstat(source)).isSymbolicLink()) {
        links.push(within);
        return false;
      }
      return true;
    },
  });
  for (const link of links) await symlink(await readlink(path.join(from, link)), path.join(to, link), 'junction');
}

/**
 * Gives the pages the build made ahead of time this server's address in place
 * of the first server's. A page names the site's own address — its canonical
 * link, its alternates, the sitemap's entries — and the build wrote the first
 * server's, while every page this server renders from now on names its own
 * (`siteOrigin` in `src/lib/environment.ts`). Left alone, a page would change
 * address on its first rebuild.
 *
 * Every file of the build is read, not only the kinds that carry an address
 * today — `.html`, `.rsc` and `.body` — so an address a later version of Next
 * writes somewhere new is moved too. The two ports have the same number of
 * digits (`playwright.config.ts` holds `TEST_PORT` to that), so every address
 * keeps its length: the `.rsc` files count the length of the text they carry.
 * Read and written as bytes, which a change of ASCII leaves the rest of intact.
 */
async function moveOrigin(buildDir, fromPort, toPort) {
  const [before, after] = [`127.0.0.1:${fromPort}`, `127.0.0.1:${toPort}`];
  if (!Number.isInteger(fromPort) || before.length !== after.length) {
    throw new Error(`Cannot move the build from port ${fromPort} to ${toPort}: the two must have the same number of digits.`);
  }
  for (const entry of await readdir(buildDir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const file = path.join(entry.parentPath, entry.name);
    const text = (await readFile(file)).toString('latin1');
    if (text.includes(before)) await writeFile(file, Buffer.from(text.replaceAll(before, after), 'latin1'));
  }
}
