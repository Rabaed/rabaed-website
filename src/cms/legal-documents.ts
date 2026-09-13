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
  const document = previewing ? await latestSaved(slug) : await latestPublished(slug);

  // Every database is given the three documents by a migration. A page with
  // no document is a database that was not migrated, and says so.
  if (!document) {
    throw new Error(`The legal document "${slug}" is not in the CMS: run the migrations (docs/deployment.md).`);
  }
  return document;
});

/** What an Editor previewing the page sees: the latest save, draft or not. */
async function latestSaved(slug: LegalSlug): Promise<LegalDocument | undefined> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'legal-documents',
    where: { slug: { equals: slug } },
    draft: true,
    depth: 0,
    limit: 1,
    pagination: false,
  });
  return docs[0];
}

/**
 * What visitors see: the newest version that was published, read from the
 * version history rather than the document itself. The document can be left
 * holding a draft without anyone publishing — restoring an earlier draft does
 * exactly that — and a page read from it would show that draft the next time
 * it is rebuilt. Read from the history, only Publish changes what visitors
 * see, and the date shown is the published version's own.
 */
async function latestPublished(slug: LegalSlug): Promise<LegalDocument | undefined> {
  const payload = await getPayload({ config });
  const { docs } = await payload.findVersions({
    collection: 'legal-documents',
    where: { and: [{ 'version.slug': { equals: slug } }, { 'version._status': { equals: 'published' } }] },
    sort: '-updatedAt',
    depth: 0,
    limit: 1,
    pagination: false,
  });
  const [published] = docs;
  return published && { ...published.version, updatedAt: published.updatedAt };
}
