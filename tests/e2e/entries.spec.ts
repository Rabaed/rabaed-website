/**
 * The adapter the page-text suites edit entries through (`entries.ts`, ticket
 * 90) puts back what a test changed when it ends, whether it passed or not —
 * and signs in as the suite's own account, which nobody listed.
 *
 * Each "fails" test below fails on purpose (`test.fail`), after changing the
 * entry; the test after it reads what was left. They run in order, one after
 * another, and against the second server (`playwright.config.ts`): they
 * publish, and nothing else runs there while they do.
 *
 * The entry is the closing section's, which the suites that read it read on
 * the other server.
 */
import { test, expect, fields, type Entry } from './entries';
import { signIn, signedIn, suiteEditor } from './editors';

test.describe.configure({ mode: 'default' });

const SLUG = 'closing-section';

/** The entry with a space at the end of its heading, which no page draws. */
const changed = (entry: Entry<typeof SLUG>): Entry<typeof SLUG> => ({
  ...entry,
  closing: { ...entry.closing, heading: { ...entry.closing.heading, ar: heading(entry) } },
});
const heading = (entry: Entry<typeof SLUG>) => `${entry.closing.heading.ar} `;

/** The entry as published before any test here ran, which only an editor may read. */
let before: Entry<typeof SLUG>;
test.beforeAll(async ({ request }) => {
  const response = await signedIn(request).get(`/api/globals/${SLUG}?depth=0`);
  expect(response.ok(), await response.text()).toBe(true);
  before = fields(await response.json());
});

/**
 * What each failing test got as far as before failing on purpose. A test
 * marked to fail passes however it fails, so the test after it checks this
 * rather than pass on a change that was never made.
 */
const reached = { draft: false, publish: false };

test('signs in as an account of the suite’s own, invited on its first sign-in', async ({ page, cms }) => {
  expect(await cms.entry(SLUG).published()).toEqual(before);
  const me = await (await page.request.get('/api/users/me')).json();
  expect(me.user?.email).toBe(suiteEditor().email);
  expect(suiteEditor().email).toMatch(/^entries-\d+@rabaed\.test$/);
});

test('fails after saving a draft', async ({ cms }) => {
  test.fail();
  const entry = cms.entry(SLUG);
  await entry.draft(changed(await entry.published()));
  reached.draft = true;
  expect(true, 'failing on purpose, with the draft saved').toBe(false);
});

test('the draft a failed test saved is discarded when it ends', async ({ page }) => {
  expect(reached.draft, 'the test before never saved its draft').toBe(true);
  await signIn(page.request);
  // What the admin would open: the latest version, the published one again.
  const draft = await (await page.request.get(`/api/globals/${SLUG}?draft=true&depth=0`)).json();
  expect(fields(draft)).toEqual(before);
});

test('fails after publishing a change', async ({ cms }) => {
  test.fail();
  const entry = cms.entry(SLUG);
  await entry.publish(changed(await entry.published()));
  expect((await entry.published()).closing.heading.ar).toBe(heading(before));
  reached.publish = true;
  expect(true, 'failing on purpose, with the change published').toBe(false);
});

test('the change a failed test published is published back when it ends', async ({ cms }) => {
  expect(reached.publish, 'the test before never published its change').toBe(true);
  expect(await cms.entry(SLUG).published()).toEqual(before);
});

/** Never run: what `npm run typecheck` says of a field the CMS does not have. */
export function typedFromTheSchema(entry: Entry<typeof SLUG>): Entry<typeof SLUG> {
  // @ts-expect-error — `ending` is not a field of the closing section's entry.
  return { ...entry, ending: entry.closing };
}
