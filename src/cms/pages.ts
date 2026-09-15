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

/** The pages whose words are in the CMS so far; tickets 54–59 add theirs. */
type PageSlug = Extract<GlobalSlug, 'start-page' | 'tool-page'>;

/** A word as the CMS stores it: its Arabic and its English, either possibly empty. */
type StoredWords = { readonly ar?: string | null; readonly en?: string | null } | null | undefined;

/**
 * Once per request, per page and language, though the page and its metadata
 * both ask.
 *
 * What visitors see is read from the version history rather than the entry
 * itself: restoring an earlier version writes it into the entry whether it was
 * published or not, and a page read from the entry would then show it the next
 * time it is rebuilt (`src/cms/legal-documents.ts` found the same).
 */
const cachedEntry = cache(async (slug: PageSlug, locale: Locale) => {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });

  const entry = previewing
    ? await payload.findGlobal({ slug, draft: true, depth: 0 })
    : (
        await payload.findGlobalVersions({
          slug,
          where: { 'version._status': { equals: 'published' } },
          sort: '-updatedAt',
          limit: 1,
          pagination: false,
          depth: 0,
        })
      ).docs[0]?.version;

  // Every database is given each page by a migration. A page with nothing
  // published is a database that was not migrated, and says so.
  if (!entry) throw new Error(`The ${slug} page is not in the CMS: run the migrations (docs/deployment.md).`);

  // Never another language's words in its place (spec: Routing and
  // localisation): a page is shown only in the languages it is published in.
  if (!(entry.languages ?? []).includes(locale)) throw new ContentNotInLocale(slug, locale);
  return entry;
});

/** The entry of the page asked for, typed as that page's: `cache` keeps one function for every page. */
export function pageEntry<Slug extends PageSlug>(slug: Slug, locale: Locale): Promise<DataFromGlobalSlug<Slug>> {
  return cachedEntry(slug, locale) as Promise<DataFromGlobalSlug<Slug>>;
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
