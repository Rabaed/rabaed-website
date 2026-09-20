import { pageEntry, wordsIn } from '@/cms/pages';
import type { PageMeta } from '@/content/pages/page-content';
import { withValues } from '@/cms/referral-program-values';
import type { Locale } from '@/lib/locales';
import type { SearchSetting } from '@/payload-types';

/**
 * How a page appears in a search result and when its link is shared
 * (ticket 26): the title, the line under it, and the picture the card draws.
 *
 * One entry holds all six marketing pages — `src/cms/globals/search-settings.ts`
 * says why it is not on each page's own entry — so a page asks for its own
 * section by name, and the per-request cache answers all six from one read.
 *
 * The page's short name is not here: it names the page inside the site, in a
 * breadcrumb trail, rather than saying anything to a search engine, and it
 * stays in the page's own module.
 */
export type SearchPage = Exclude<keyof SearchSetting, 'id' | 'languages' | 'updatedAt' | 'createdAt' | '_status'>;

export async function getSearchSettings(
  locale: Locale,
  page: SearchPage,
  options: { readonly name: string; readonly values?: Parameters<typeof withValues>[1] } = { name: '' },
): Promise<PageMeta> {
  const entry = await pageEntry('search-settings', locale);
  const section = entry[page];
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  // The referral page's title and description quote the Referral Program's
  // own amounts, which an Editor writes as `{payout}` (ticket 56).
  const filled = (written: string) => (options.values ? withValues(written, options.values) : written);
  const image = typeof section.sharingImage === 'object' ? section.sharingImage : null;

  return {
    name: options.name,
    title: filled(words(section.title)),
    description: filled(words(section.description)),
    sharingImage: image?.url ? { url: image.url, alt: image.alt } : null,
  };
}
