/**
 * Runs a probe — a script in `tests/unit` that loads the Payload config, or
 * something the config loads — in a Node process of its own, through Payload's
 * own runner, and returns the last line it printed.
 *
 * A process of its own because what a fresh start loads, or reads from its
 * environment, is settled the first time: a worker that has already run
 * another spec cannot answer. Payload's runner because it is what resolves the
 * config's imports, and how the CMS is really started from a command line.
 *
 * The database and secret are named but never reached: the Postgres adapter
 * opens no connection until something asks it for data, and no probe does.
 * `environment` is laid over them.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const PAYLOAD_BIN = path.join('node_modules', 'payload', 'bin.js');

export function runProbe(probe: string, environment: Record<string, string> = {}): string {
  const { status, stdout, stderr } = spawnSync(process.execPath, [PAYLOAD_BIN, 'run', path.join('tests', 'unit', probe)], {
    encoding: 'utf8',
    cwd: repoRoot,
    env: {
      ...process.env,
      DATABASE_URL: 'postgres://unused:unused@127.0.0.1:1/unused',
      PAYLOAD_SECRET: 'unused-in-this-test',
      ...environment,
    },
  });

  if (status !== 0) throw new Error(`${probe} failed:\n${stdout}\n${stderr}`);
  return stdout.trim().split(/\r?\n/).at(-1) ?? '';
}
