import { getContactPoints } from '@/cms/contact-points';
import { pageEntry, wordsIn } from '@/cms/pages';
import type { DelayCalculatorContent } from '@/components/home/delay-calculator';
import type { HomeHeroContent } from '@/components/home/hero';
import type { TrustStripContent } from '@/components/home/trust-strip';
import { numeralsInMono } from '@/components/inline-text';
import { getDelayCalculator } from '@/content/delay-calculator';
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
  /** Section 05 (`#cost`): the shared Delay-cost calculator, with the profile's own button: its words, where written, and its link. */
  readonly cost: Section<DelayCalculatorContent>;
  /** The header's Download PDF button (ticket 104): its words, and the page's language's two files. */
  readonly pdf: ProfilePdf;
};

/**
 * The Profile PDF for the page's language, one file per screen: `desktop` for
 * a screen wider than 980px, and for every screen without JavaScript; `phone`
 * for one 980px wide or less (spec: Profile PDFs).
 */
export type ProfilePdf = { readonly label: string; readonly desktop: string; readonly phone: string };

/**
 * The picture a shared link to the profile unfurls as until an Editor gives it
 * another: Ahmed's, one per language (`public/profile/`), described in his
 * words.
 */
const SHARING_IMAGE: Readonly<Record<Locale, SharingImage>> = {
  ar: { url: '/profile/og-ar.png', alt: 'ربائد: ثلاثة أطراف. سجل واحد. مسؤولية واضحة.' },
  en: { url: '/profile/og-en.png', alt: 'Rabaed: Three parties. One record. Clear ownership.' },
};

/**
 * Ahmed's four Profile PDFs (`PDF/` in his folder), kept with the code as the
 * defaults, as `public/hero/` keeps the hero's drawings. Each downloads under
 * its own name.
 */
const DEFAULT_PDFS: Readonly<Record<Locale, Omit<ProfilePdf, 'label'>>> = {
  ar: { desktop: '/profile/pdf/Rabaed-Profile-V4-AR.pdf', phone: '/profile/pdf/Rabaed-Profile-V4-AR-mobile.pdf' },
  en: { desktop: '/profile/pdf/Rabaed-Profile-V4-EN.pdf', phone: '/profile/pdf/Rabaed-Profile-V4-EN-mobile.pdf' },
};

type Screen = keyof Omit<ProfilePdf, 'label'>;

/** Where an Editor's replacement for each file is kept in the entry (`src/cms/globals/profile-page.ts`). */
const UPLOADED = {
  ar: { desktop: 'arabic', phone: 'arabicPhone' },
  en: { desktop: 'english', phone: 'englishPhone' },
} as const satisfies Record<Locale, Record<Screen, Exclude<keyof ProfilePage['pdf'], 'label'>>>;

/** An uploaded file's address, where the entry names one that is there. */
function uploadedFile(value: ProfilePage['pdf']['arabic']): string | null {
  return value && typeof value === 'object' && value.url ? value.url : null;
}

/**
 * The one place the four files come from: the page's language's pair, each
 * an Editor's replacement where one is uploaded (`profile-files`, served as
 * uploaded, under its own name) and otherwise Ahmed's default.
 */
function profilePdfs(locale: Locale, pdf: ProfilePage['pdf']): Omit<ProfilePdf, 'label'> {
  const file = (screen: Screen) => uploadedFile(pdf[UPLOADED[locale][screen]]) ?? DEFAULT_PDFS[locale][screen];
  return { desktop: file('desktop'), phone: file('phone') };
}

/** The hero's four statuses, which the drawing's loop counts, filled out to four for a draft being previewed. */
function fourStatuses(statuses: readonly string[]): HomeHeroContent['statuses'] {
  const [first = '', second = '', third = '', fourth = ''] = statuses;
  return [first, second, third, fourth];
}

/**
 * The Company profile's content in `locale`: its words from its entry in the
 * CMS (ticket 102), the Trust strip's marks from the entry every page shares,
 * the Delay-cost calculator's words from the one it shares with the home page
 * (ticket 106) —
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
  const link = (
    stored: ProfilePage['hero']['demoLink'] | ProfilePage['hero']['whatsappLink'] | ProfilePage['cost']['callToActionLink'],
  ) => words(stored).trim();
  const { hero, cost } = entry;
  // Its words the entry both pages read; its button's, where written, and where it goes, this page's.
  const calculator = await getDelayCalculator(locale, link(cost.callToActionLink));
  const ownLabel = words(cost.callToActionLabel).trim();
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
    cost: {
      ...calculator,
      callToAction: { ...calculator.callToAction, label: ownLabel || calculator.callToAction.label },
      shows: cost.shows !== false,
    },
    pdf: { label: words(entry.pdf.label), ...profilePdfs(locale, entry.pdf) },
  };
}
