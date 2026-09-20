import { fetchedMedia } from '@/cms/fetched-media';
import { pageEntry, wordsIn } from '@/cms/pages';
import type { TrustStripContent, TrustStripLogo } from '@/components/home/trust-strip';
import type { Locale } from '@/lib/locales';

/**
 * The Trust strip: the companies already working on Rabaed, in the order the
 * CMS lists them (CONTEXT.md, ticket 20). One entry for the three pages that
 * carry the strip, so a client signed today appears on all three at once;
 * each page keeps its own switch for whether the strip shows there.
 *
 * Permission to show these marks is cleared by the founders, covered by the
 * existing contracts (spec: Further Notes).
 *
 * A mark an Editor has unticked is left out here rather than hidden in the
 * page: what the bar travels past is the list a visitor sees, and the marquee
 * measures it.
 */
export async function getTrustStrip(locale: Locale): Promise<TrustStripContent> {
  const { strip } = await pageEntry('trust-strip', locale);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  const logos = strip.logos
    .filter((logo) => logo.shows !== false)
    .map((logo, index): TrustStripLogo | null => {
      const mark = fetchedMedia(logo.mark);
      if (!mark?.url) return null;

      return {
        // The row is rendered twice, so a key of its own rather than the
        // file's: the same mark may be listed twice, for two companies of one
        // group.
        key: `${index}-${mark.id}`,
        name: words(logo.name),
        height: logo.height,
        source: mark.url,
        // An SVG carries no pixel size; the strip draws it at its height and
        // lets the width follow (ADR-0010).
        intrinsic: mark.width && mark.height ? { width: mark.width, height: mark.height } : null,
        href: logo.link ?? null,
      };
    })
    .filter((logo): logo is TrustStripLogo => logo !== null);

  return { caption: words(strip.caption), sectionName: words(strip.sectionName), logos };
}
