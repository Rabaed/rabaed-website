/**
 * Case studies as the site reads them: what is published, and — while an
 * editor is previewing — the latest saved draft instead.
 *
 * Like the blog's articles, a case study is written once per language, and a
 * translation shares its slug (`src/cms/editorial-fields.ts`).
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, type Where } from 'payload';
import { cache } from 'react';
import type { Locale } from '@/lib/locales';
import type { CaseStudy } from '@/payload-types';

const PUBLISHED: Where = { _status: { equals: 'published' } };

/**
 * Whether the section shows in a language: its index, and its link in the
 * header of every page. Hidden until the first case study there is published
 * (spec: Content model). Asked by every page's header, so cached per request.
 */
export const hasPublishedCaseStudies = cache(async (locale: Locale): Promise<boolean> => {
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.count({
    collection: 'case-studies',
    where: { and: [PUBLISHED, { locale: { equals: locale } }] },
  });
  return totalDocs > 0;
});

/**
 * A language's published case studies, newest first, all on one page: the
 * section will hold a handful for a long while, and paging can wait for more.
 */
export async function publishedCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { and: [PUBLISHED, { locale: { equals: locale } }] },
    sort: ['-publishedAt', '-createdAt'],
    pagination: false,
    depth: 1,
  });
  return docs;
}

/**
 * The case study at this address in this language, as a visitor may see it.
 * Cached per request, because the page and its metadata both ask.
 */
export const findCaseStudy = cache(async (locale: Locale, slug: string): Promise<CaseStudy | null> => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: {
      and: [{ slug: { equals: slug } }, { locale: { equals: locale } }, ...(previewing ? [] : [PUBLISHED])],
    },
    draft: previewing,
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
});

/** The languages the case study at this address is published in. */
export const publishedCaseStudyLocales = cache(async (slug: string): Promise<Locale[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    depth: 0,
    pagination: false,
  });
  return docs.map((caseStudy) => caseStudy.locale);
});

/** Every published case study, in one language or all of them. */
export async function allPublishedCaseStudies(locale?: Locale): Promise<CaseStudy[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: locale ? { and: [PUBLISHED, { locale: { equals: locale } }] } : PUBLISHED,
    depth: 0,
    pagination: false,
  });
  return docs;
}
