/**
 * A marketing page's CMS entry as the site shows it (ticket 53): the newest
 * version an Editor published — or, while an Editor is previewing, the latest
 * saved — if the page is published in the language asked for, and otherwise a
 * refusal.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, type DataFromGlobalSlug, type GlobalSlug } from 'payload';
import { cache } from 'react';
import { ContentNotInLocale } from '@/content/pages/page-content';
import type { Locale } from '@/lib/locales';
import type { MarketingPageEntry, SharedEntry } from '@/lib/page-registry';

/**
 * The marketing pages' entries and the entries they share, as the page
 * registry lists them (ticket 92, `src/lib/page-registry.ts`): the sections
 * and pictures of tickets 53–58 and the words every page shares (ticket 59).
 * And the indexes' lines, which the blog and the case studies read.
 */
export type PageSlug = Extract<GlobalSlug, MarketingPageEntry | SharedEntry | 'index-leads'>;

/**
 * One level deep, so that a picture comes with the image it names rather than
 * only its id (ticket 57). One constant for what visitors see and what an
 * Editor previews, so that a picture the preview shows is the picture
 * publishing shows: only the preview can be tested without a visitor seeing it.
 */
const DEPTH = 1;

/** A word as the CMS stores it: its Arabic and its English, either possibly empty. */
type StoredWords = { readonly ar?: string | null; readonly en?: string | null } | null | undefined;

/**
 * Once per request, per page, though the page, its metadata and the question
 * of which languages it is published in all ask.
 *
 * What visitors see is read from the version history rather than the entry
 * itself: restoring an earlier version writes it into the entry whether it was
 * published or not, and a page read from the entry would then show it the next
 * time it is rebuilt (`src/cms/legal-documents.ts` found the same).
 */
const newestEntry = cache(async (slug: PageSlug) => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });

  const entry = previewing
    ? await payload.findGlobal({ slug, draft: true, depth: DEPTH })
    : (
        await payload.findGlobalVersions({
          slug,
          where: { 'version._status': { equals: 'published' } },
          sort: '-updatedAt',
          limit: 1,
          pagination: false,
          depth: DEPTH,
        })
      ).docs[0]?.version;

  // Every database is given each page by a migration. A page with nothing
  // published is a database that was not migrated, and says so.
  if (!entry) throw new Error(`The ${slug} page is not in the CMS: run the migrations (docs/deployment.md).`);
  return entry;
});

/**
 * The languages an entry is published in — or, while an Editor is previewing,
 * saved in. Read with the entry itself, so asking costs nothing more than the
 * page reading it (ticket 91, `src/content/pages/languages.ts`).
 */
export async function entryLanguages(slug: PageSlug): Promise<readonly Locale[]> {
  return (await newestEntry(slug)).languages ?? [];
}

/** The entry of the page asked for, typed as that page's: `cache` keeps one function for every page. */
export async function pageEntry<Slug extends PageSlug>(slug: Slug, locale: Locale): Promise<DataFromGlobalSlug<Slug>> {
  const entry = await newestEntry(slug);
  // Never another language's words in its place (spec: Routing and
  // localisation): a page is shown only in the languages it is published in.
  if (!(entry.languages ?? []).includes(locale)) throw new ContentNotInLocale(slug, locale);
  return entry as DataFromGlobalSlug<Slug>;
}

/**
 * A word in the page's language. A page is published in a language only with
 * every word written in it (`src/cms/page-fields.ts`), so an empty one here is
 * a draft being previewed, and shows as nothing rather than as the other
 * language.
 */
export function wordsIn(locale: Locale, words: StoredWords): string {
  return words?.[locale] ?? '';
}
