import { fetchedSharingImage } from '@/cms/fetched-media';
import { wordsIn } from '@/cms/pages';
import type { PageMeta } from '@/content/pages/page-content';
import { withValues, type ReferralProgramValues } from '@/cms/referral-program-values';
import type { Locale } from '@/lib/locales';
import type { HomePage } from '@/payload-types';

/**
 * How a page appears in a search result and when its link is shared
 * (ticket 26): the title, the line under it, and the picture the card draws.
 *
 * The **Search and sharing** tab of the page's own entry (ticket 91,
 * `src/cms/search-fields.ts`), which each page's module has already read, so
 * this reads nothing: it words what the module hands it in `locale`.
 *
 * The page's short name is not here: it names the page inside the site, in a
 * breadcrumb trail, rather than saying anything to a search engine, and it
 * stays in the page's own module.
 */

/** The tab as the CMS holds it: the same on each of the six pages. */
export type SearchTab = HomePage['search'];

export function pageMeta(
  locale: Locale,
  search: SearchTab,
  options: { readonly name: string; readonly values?: ReferralProgramValues },
): PageMeta {
  // The referral page's title and description quote the Referral Program's
  // own amounts, which an Editor writes as `{payout}` (ticket 56).
  const words = (stored: Parameters<typeof wordsIn>[1]) => {
    const written = wordsIn(locale, stored);
    return options.values ? withValues(written, options.values) : written;
  };
  return {
    name: options.name,
    title: words(search.title),
    description: words(search.description),
    sharingImage: fetchedSharingImage(search.sharingImage),
  };
}
