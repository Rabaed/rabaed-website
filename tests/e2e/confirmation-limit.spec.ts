/**
 * The whole site sends thirty confirmations an hour at most, however many
 * addresses its requests come from (ticket 81, ADR-0022). A confirmation goes
 * to whatever address was typed, so this is what bounds a script that types a
 * new one each time. Past the thirtieth, a request is still stored and the
 * team still alerted; only its confirmation is withheld.
 *
 * Runs against the second test server, one suite at a time
 * (`playwright.config.ts`, ticket 89): filling the site's hour would withhold
 * the confirmation any suite beside it expects. It deletes what it sent when
 * it is done, which frees the hour again for the suites that follow it there.
 *
 * The thirty is restated rather than imported from `src/forms/submission.ts`,
 * for the reason `routes.ts` gives.
 */
import { test, expect, type APIRequestContext } from '@playwright/test';
import { signIn } from './editors';
import { postDemoRequest, publishDemoSettings, readDemoSettings } from './demo-request-api';
import { mailTo, readerDelete, readerGet, submissionsFrom, uniqueApplicant, type StoredSubmission } from './forms';
import { oneSuiteAtATime } from './one-suite-at-a-time';

oneSuiteAtATime(test);

const FROM_THE_SITE_AN_HOUR = 30;

/** How many confirmations the site has sent, or tried to, in the last hour: what the limit counts. */
async function confirmationsThisHour(request: APIRequestContext): Promise<number> {
  const since = new Date(Date.now() - 60 * 60_000).toISOString();
  const response = await readerGet(
    request,
    `/api/form-submissions?where[confirmation][in]=sending,sent,failed&where[createdAt][greater_than]=${since}&limit=0&depth=0`,
  );
  expect(response.ok()).toBe(true);
  return (await response.json()).totalDocs;
}

test('the site sends thirty confirmations an hour at most; a request past them is still stored and alerted', async ({
  request,
  baseURL,
}) => {
  await signIn(request);
  const original = await readDemoSettings(request);
  const team = uniqueApplicant('team').email;

  // Whatever the suites before this one on the server sent this hour counts
  // too, so the requests fill what is left and go one past it — each from an
  // address and a network address of its own, as a script would send them.
  const room = FROM_THE_SITE_AN_HOUR - (await confirmationsThisHour(request));
  expect(room, 'the suites before this one on the server have spent the hour already').toBeGreaterThan(0);
  const applicants = Array.from({ length: room + 1 }, () => uniqueApplicant('site-limit'));
  const stored = async (): Promise<StoredSubmission[]> =>
    (await Promise.all(applicants.map(({ email }) => submissionsFrom(request, email)))).flat();

  try {
    await publishDemoSettings(request, { ...original, alertAddress: team });
    for (const applicant of applicants) {
      expect((await postDemoRequest(request, baseURL!, applicant)).outcome).toBe('received');
    }

    // Every request stored and alerted; all but one confirmed.
    await expect
      .poll(async () => (await stored()).map(({ confirmation }) => confirmation).sort())
      .toEqual([...Array(room).fill('sent'), 'withheld']);
    expect((await stored()).map(({ alert }) => alert)).toEqual(Array(room + 1).fill('sent'));
    expect(await confirmationsThisHour(request)).toBe(FROM_THE_SITE_AN_HOUR);

    // The one withheld is sent no mail; every other is sent one.
    const mailed = await Promise.all(applicants.map(async ({ email }) => (await mailTo(email)).length));
    expect(mailed.sort()).toEqual([0, ...Array(room).fill(1)]);
  } finally {
    await publishDemoSettings(request, original);
    for (const { id } of await stored()) {
      expect((await readerDelete(request, `/api/form-submissions/${id}`)).ok()).toBe(true);
    }
  }
});
