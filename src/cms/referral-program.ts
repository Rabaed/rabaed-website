/**
 * The Referral Program values as the site inserts them (ticket 56): the newest
 * version an Editor published — or, while an Editor is previewing, the latest
 * saved — as the page writes them.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import { amountsOf, formatValues, type ReferralProgramValues } from './referral-program-values';

/**
 * Once per request, though the page, its metadata and its questions all ask.
 * Read from the version history for visitors, as a page is (`pages.ts`).
 */
export const referralProgramValues = cache(async (): Promise<ReferralProgramValues> => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });

  const entry = previewing
    ? await payload.findGlobal({ slug: 'referral-program', draft: true, depth: 0 })
    : (
        await payload.findGlobalVersions({
          slug: 'referral-program',
          where: { 'version._status': { equals: 'published' } },
          sort: '-updatedAt',
          limit: 1,
          pagination: false,
          depth: 0,
        })
      ).docs[0]?.version;

  // Every database is given the values by a migration.
  const amounts = amountsOf(entry);
  if (!amounts) throw new Error('The Referral Program values are not in the CMS: run the migrations (docs/deployment.md).');
  return formatValues(amounts);
});
