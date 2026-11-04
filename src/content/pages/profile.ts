import { getContactPoints } from '@/cms/contact-points';
import { pageEntry, wordsIn } from '@/cms/pages';
import type { HomeHeroContent } from '@/components/home/hero';
import type { TrustStripContent } from '@/components/home/trust-strip';
import { numeralsInMono } from '@/components/inline-text';
import { pageMeta } from '@/content/search-settings';
import { getTrustStrip } from '@/content/trust-strip';
import type { Locale } from '@/lib/locales';
import { MARKETING_PAGES } from '@/lib/page-registry';
import type { ProfilePage } from '@/payload-types';
import type { PageMeta, Section, SharingImage } from './page-content';

export type ProfilePageContent = {
  readonly meta: PageMeta;
  /** The home page's hero, with Ahmed's words and the profile's two buttons. */
  readonly hero: HomeHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
};

/**
 * The picture a shared link to the profile unfurls as until an Editor gives it
 * another: Ahmed's, one per language (`public/profile/`), described in his
 * words.
 */
const SHARING_IMAGE: Readonly<Record<Locale, SharingImage>> = {
  ar: { url: '/profile/og-ar.png', alt: 'ربائد: ثلاثة أطراف. سجل واحد. مسؤولية واضحة.' },
  en: { url: '/profile/og-en.png', alt: 'Rabaed: Three parties. One record. Clear ownership.' },
};

/** The hero's four statuses, which the drawing's loop counts, filled out to four for a draft being previewed. */
function fourStatuses(statuses: readonly string[]): HomeHeroContent['statuses'] {
  const [first = '', second = '', third = '', fourth = ''] = statuses;
  return [first, second, third, fourth];
}

/**
 * The Company profile's content in `locale`: its words from its entry in the
 * CMS (ticket 102), the Trust strip's marks from the entry every page shares —
 * or a refusal, where the page is not published in `locale`, which until the
 * founder publishes it it is in neither.
 *
 * **Where its buttons go is the CMS's too**, unlike every other page's (spec:
 * Buttons and links). The WhatsApp button left without a link is the site's
 * one WhatsApp address, from the site settings, so that changing the number
 * there changes it here.
 */
export async function getProfilePage(locale: Locale): Promise<ProfilePageContent> {
  const [entry, trustStrip, contact] = await Promise.all([
    pageEntry('profile-page', locale),
    getTrustStrip(locale),
    getContactPoints(),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);
  const link = (stored: ProfilePage['hero']['demoLink'] | ProfilePage['hero']['whatsappLink']) => words(stored).trim();
  const { hero } = entry;
  const meta = pageMeta(locale, entry.search, { name: MARKETING_PAGES.profile.name[locale] });

  return {
    meta: { ...meta, sharingImage: meta.sharingImage ?? SHARING_IMAGE[locale] },
    hero: {
      eyebrow: words(hero.eyebrow),
      title: { lines: hero.titleLines.map((each) => words(each.line)), accent: words(hero.titleAccent) },
      lead: words(hero.lead),
      primary: { label: words(hero.demoLabel), href: link(hero.demoLink) },
      secondary: { label: words(hero.whatsappLabel), href: link(hero.whatsappLink) || contact.whatsappUrl },
      trust: words(hero.trust),
      guarantee: { period: numeralsInMono(words(hero.guaranteePeriod)), promise: words(hero.guaranteePromise) },
      parties: {
        owner: words(hero.parties.owner),
        contractor: words(hero.parties.contractor),
        consultant: words(hero.parties.consultant),
      },
      diagramDescription: words(hero.diagramDescription),
      statuses: fourStatuses(hero.statuses.map((each) => words(each.status))),
      statusAtRest: words(hero.statusAtRest),
      // The drawings the home page ships with.
      pictures: { owner: null, contractor: null, consultant: null, document: null },
    },
    // The Trust strip's marks are ticket 20's; the page chooses only whether it shows.
    trustStrip: { ...trustStrip, shows: entry.trustStrip?.shows !== false },
  };
}
