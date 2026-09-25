/**
 * One suite at a time on the second test server (ticket 89): the suites that
 * publish what others would notice, or hold what others would wait for, each
 * take this server to themselves from their first test to their last.
 *
 *   test.describe.configure({ mode: 'default' });
 *   oneSuiteAtATime(test);
 *
 * `playwright.config.ts` asks for one worker for the project that runs them,
 * and that was meant to be enough. It is not, in Playwright 1.56 as this repo
 * runs it: a full run on 25 September 2026 had the site words suite's draft
 * and the English pages suite's previews side by side, and the site words
 * suite's preview showed words it had not drafted. With this lock in place,
 * each of the next two full runs had eight of the nine suites start while
 * another held the server, and wait for it, from 1.5 to 47 seconds.
 *
 * So each suite also takes a lock, a directory that only one process can
 * create, in the server's own scratch directory, which the server empties
 * when it starts (`scripts/test-server.mjs`). A suite that finds it taken
 * waits for it, however long the suite holding it takes; one whose holder's
 * process has gone takes it over, since that suite will never let it go.
 *
 * Registered before any other hook of the suite, so that no suite's own
 * `beforeAll` changes anything while another suite holds the server.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { TestInfo } from '@playwright/test';
import { testServerScratch } from './forms';

/** The two hooks this needs from a suite's `test`, whichever `test` the suite imports. */
type Hooks = {
  beforeAll(inner: (args: object, info: TestInfo) => Promise<void>): void;
  afterAll(inner: (args: object, info: TestInfo) => Promise<void>): void;
};

/** How often a suite waiting for the server asks again. */
const ASKED_EVERY = 250;

export function oneSuiteAtATime(test: Hooks): void {
  let held: string | undefined;

  test.beforeAll(async ({}, info) => {
    // However long the suite before takes: that is its own tests' deadlines to bound.
    info.setTimeout(0);
    const lock = path.join(testServerScratch(Number(new URL(info.project.use.baseURL!).port)), 'one-suite-at-a-time');
    for (;;) {
      try {
        await mkdir(lock);
        await writeFile(path.join(lock, 'holder'), String(process.pid));
        held = lock;
        return;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      }
      if (!(await holderAlive(lock))) await rm(lock, { recursive: true, force: true });
      else await new Promise((resolve) => setTimeout(resolve, ASKED_EVERY));
    }
  });

  test.afterAll(async () => {
    if (held) await rm(held, { recursive: true, force: true });
    held = undefined;
  });
}

/**
 * Whether the process holding the lock is still running. A lock with no
 * holder written yet is one being taken this moment, and counts as held.
 */
async function holderAlive(lock: string): Promise<boolean> {
  let pid: number;
  try {
    pid = Number(await readFile(path.join(lock, 'holder'), 'utf8'));
  } catch {
    return true;
  }
  if (!Number.isInteger(pid) || pid <= 0) return true;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM is a process that exists but is not ours to signal.
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}
