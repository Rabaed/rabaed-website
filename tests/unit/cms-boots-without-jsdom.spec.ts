/**
 * The CMS starts without loading jsdom (ticket 65).
 *
 * jsdom is a whole HTML engine, and the SVG sanitiser needs one — but only
 * when an Editor uploads a drawing. It has no business being loaded to answer
 * a request for the admin's sign-in page, and the day it was, it took the
 * admin, the CMS's own API and every form on the site off the internet at
 * once: the deployment could not load jsdom at all, and the Payload config
 * would not evaluate without it. `src/cms/svg-sanitiser.ts` tells that story.
 *
 * So this asks the one question that would have caught it: **what does the
 * CMS load in order to start?** Not how the Media collection reaches the
 * sanitiser, which is free to change — only that starting the CMS does not
 * drag jsdom in behind it.
 *
 * Two things make it a real question rather than a comfortable one. It runs
 * in a process of its own, because what a fresh start loads is not something
 * a worker that has already run another spec can answer. And it asks the same
 * question of the sanitiser itself, which must answer the other way: a probe
 * that could only ever say "no" would pass just as happily on the code that
 * caused the outage.
 *
 * The config is loaded through Payload's own runner — the one
 * `npm run cms:create-editor` uses — because that is what can resolve the
 * config's imports, and because it is the way the CMS is really started from
 * a command line.
 */
import { test, expect } from '@playwright/test';
import { runProbe } from './payload-probe';

/**
 * Imports `module` — a specifier relative to the probe — in a new Node
 * process, and answers whether jsdom was loaded along with it.
 *
 * `VERCEL_ENV` is cleared so the config does not also demand the five
 * storage variables a deployment needs (`src/cms/environment.ts`).
 */
function loadsJsdom(module: string): boolean {
  const answer = runProbe('cms-boot.probe.ts', { MODULE_UNDER_TEST: module, VERCEL_ENV: '' });
  if (answer !== 'jsdom' && answer !== 'no-jsdom') {
    throw new Error(`loading ${module} said "${answer}", which is neither answer.`);
  }
  return answer === 'jsdom';
}

// Loading a Payload config and an HTML engine are both slower than the test
// runner's own deadline expects, and this does each of them twice.
test.slow();

test('starting the CMS does not load jsdom', () => {
  expect(loadsJsdom('../../src/payload.config')).toBe(false);
});

test('the sanitiser does load jsdom, so the question above is a real one', () => {
  expect(loadsJsdom('../../src/cms/svg-sanitiser')).toBe(true);
});
