/**
 * A legal document as its page shows it: the version an Editor last
 * published — or the latest saved, when an Editor is previewing the site.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import type { LegalDocument } from '../payload-types';
import type { LegalSlug } from './legal-pages';

/** Once per request, though both the page and its metadata ask. */
export const getLegalDocument = cache(async (slug: LegalSlug): Promise<LegalDocument> => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'legal-documents',
    where: { slug: { equals: slug } },
    draft: previewing,
    depth: 0,
    limit: 1,
    pagination: false,
  });

  // Every database is given the three documents by a migration. A page with
  // no document is a database that was not migrated, and says so.
  const [document] = docs;
  if (!document) {
    throw new Error(`The legal document "${slug}" is not in the CMS: run the migrations (docs/deployment.md).`);
  }
  return document;
});
