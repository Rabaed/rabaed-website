import { getContactPoints } from '@/cms/contact-points';
import { fetchedMedia } from '@/cms/fetched-media';
import { pageEntry, wordsIn } from '@/cms/pages';
import type { HomeHeroContent } from '@/components/home/hero';
import type { TrustStripContent } from '@/components/home/trust-strip';
import { numeralsInMono } from '@/components/inline-text';
import type { ProfileAboutContent } from '@/components/profile/about';
import { COMPARISON_DEFAULTS, type ProfileCompareContent } from '@/components/profile/compare';
import type { ProfileNumbersContent } from '@/components/profile/numbers';
import type { ProfilePartiesContent } from '@/components/profile/parties';
import { PLATFORM_UNITS, type ProfilePlatformContent } from '@/components/profile/platform';
import type { ProfileRecordContent } from '@/components/profile/record';
import type { ProfileTrapContent } from '@/components/profile/trap';
import { DEFAULT_PAPER_PHOTO, type PaperPhoto, type ProfileTruthContent } from '@/components/profile/truth';
import { getScreenMocks } from '@/content/screen-mocks';
import { pageMeta } from '@/content/search-settings';
import { getTrustStrip } from '@/content/trust-strip';
import type { Locale } from '@/lib/locales';
import { MARKETING_PAGES } from '@/lib/page-registry';
import { COMPARISONS } from '@/lib/profile-comparisons';
import type { Media, ProfileFile, ProfilePage } from '@/payload-types';
import type { PageMeta, Section, SharingImage } from './page-content';

export type ProfilePageContent = {
  readonly meta: PageMeta;
  /** The home page's hero, with Ahmed's words and the profile's two buttons. */
  readonly hero: HomeHeroContent;
  readonly trustStrip: Section<TrustStripContent>;
  /** Ahmed's sections 01 to 04 (ticket 105). */
  readonly truth: Section<ProfileTruthContent>;
  readonly numbers: Section<ProfileNumbersContent>;
  readonly trap: Section<ProfileTrapContent>;
  readonly about: Section<ProfileAboutContent>;
  /** Ahmed's sections 06 to 08 (ticket 107). */
  readonly parties: Section<ProfilePartiesContent>;
  readonly platform: Section<ProfilePlatformContent>;
  readonly record: Section<ProfileRecordContent>;
  /** Section 09, the before-and-after videos (ticket 108), which always shows: the Profile PDFs link to it. */
  readonly compare: ProfileCompareContent;
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
 * The photo an Editor put in place of Ahmed's, at the sizes it was stored in,
 * or `null` for his.
 */
function replacementPhoto(value: number | Media | null | undefined): PaperPhoto | null {
  const image = fetchedMedia(value);
  if (!image?.url || !image.width || !image.height) return null;
  const copies = [image.sizes?.small, image.sizes?.medium, image.sizes?.large].flatMap((copy) =>
    copy?.url && copy.width ? [`${copy.url} ${copy.width}w`] : [],
  );
  return {
    src: image.url,
    srcSet: [...copies, `${image.url} ${image.width}w`].join(', '),
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
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
  const [entry, trustStrip, contact, screenOf] = await Promise.all([
    pageEntry('profile-page', locale),
    getTrustStrip(locale),
    getContactPoints(),
    getScreenMocks(locale),
  ]);
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);
  const link = (stored: ProfilePage['hero']['demoLink'] | ProfilePage['hero']['whatsappLink']) => words(stored).trim();
  const { hero, truth, numbers, trap, about, parties, platform, record, compare } = entry;
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
    truth: {
      shows: truth.shows !== false,
      eyebrow: words(truth.eyebrow),
      title: words(truth.title),
      body: words(truth.body),
      photo: replacementPhoto(truth.photo) ?? DEFAULT_PAPER_PHOTO,
      caption: words(truth.caption),
      notes: [words(truth.noteRevision), words(truth.noteComments), words(truth.noteWho)],
    },
    numbers: {
      shows: numbers.shows !== false,
      eyebrow: words(numbers.eyebrow),
      title: words(numbers.title),
      figures: numbers.figures.map((each) => ({ figure: each.figure, label: words(each.label) })),
      source: words(numbers.source),
    },
    trap: {
      shows: trap.shows !== false,
      eyebrow: words(trap.eyebrow),
      title: words(trap.title),
      body: words(trap.body),
      kicker: words(trap.kicker),
      tools: trap.tools.map((tool) => ({ name: words(tool.name), text: words(tool.text) })),
    },
    about: {
      shows: about.shows !== false,
      eyebrow: words(about.eyebrow),
      title: { line: words(about.title), accent: words(about.titleAccent) },
      body: words(about.body),
      quote: words(about.quote),
    },
    parties: {
      shows: parties.shows !== false,
      eyebrow: words(parties.eyebrow),
      title: words(parties.title),
      lead: words(parties.lead),
      cards: parties.cards.map((card) => ({ name: words(card.name), want: words(card.want) })),
      record: words(parties.record),
      footer: words(parties.footer),
    },
    platform: {
      shows: platform.shows !== false,
      eyebrow: words(platform.eyebrow),
      title: words(platform.title),
      lead: words(platform.lead),
      // Each tab's screen is fixed by its place; a fifth row, which the CMS
      // refuses to publish, has none to show and is left out of a preview.
      units: platform.units.slice(0, PLATFORM_UNITS.length).map((unit, index) => ({
        name: words(unit.name),
        text: words(unit.text),
        screen: screenOf(PLATFORM_UNITS[index]!.screen),
      })),
      output: words(platform.output),
    },
    record: {
      shows: record.shows !== false,
      eyebrow: words(record.eyebrow),
      title: words(record.title),
      body: words(record.body),
      document: { code: record.code, name: words(record.document), example: words(record.example) },
      steps: record.steps.map((step) => ({ verb: words(step.verb), who: words(step.who), time: step.time })),
      summary: words(record.summary),
    },
    // Every word an Editor's, and each video and poster an Editor's where one
    // has been chosen, Ahmed's where not.
    compare: {
      eyebrow: words(compare.eyebrow),
      title: words(compare.title),
      lead: words(compare.lead),
      beforeLabel: words(compare.beforeLabel),
      afterLabel: words(compare.afterLabel),
      playLabel: words(compare.playLabel),
      comparisons: COMPARISONS.map((id) => {
        const stored = compare[id];
        const defaults = COMPARISON_DEFAULTS[id];
        const video = fetchedMedia<ProfileFile>(stored.video);
        const poster = fetchedMedia(stored.poster);
        return {
          id,
          module: words(stored.module),
          question: words(stored.question),
          rows: [stored.firstRow, stored.secondRow, stored.thirdRow].map((row) => ({
            label: words(row.label),
            before: words(row.before),
            after: words(row.after),
          })),
          note: words(stored.note),
          video: video?.url || `/profile/clips/${defaults.clip}`,
          poster:
            poster?.url && poster.width && poster.height
              ? { url: poster.url, width: poster.width, height: poster.height }
              : { url: `/profile/clips/${defaults.poster}`, width: defaults.width, height: defaults.height },
        };
      }),
    },
  };
}
