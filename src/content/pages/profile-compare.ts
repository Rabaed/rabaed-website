import { wordsIn } from '@/cms/pages';
import { COMPARISONS, type Comparison } from '@/cms/globals/profile-compare';
import type { Locale } from '@/lib/locales';
import type { Media, ProfileFile, ProfilePage } from '@/payload-types';

/** One of the five comparisons, as its tab and panel draw it. */
export type CompareItem = {
  readonly id: Comparison;
  /** The tab's name, and the line above the question. */
  readonly module: string;
  readonly question: string;
  readonly rows: readonly { readonly label: string; readonly before: string; readonly after: string }[];
  readonly note: string;
  /** The mark beside the module's name, a mask in `public/profile/icons/`. */
  readonly icon: string;
  /** Where the video is fetched from, once it is due. */
  readonly video: string;
  /** What stands in the video's place until it starts; its shape is the frame's. */
  readonly poster: { readonly url: string; readonly width: number; readonly height: number };
};

export type ProfileCompareContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly beforeLabel: string;
  readonly afterLabel: string;
  readonly playLabel: string;
  readonly comparisons: readonly CompareItem[];
};

/**
 * Ahmed's videos and posters, the defaults an Editor's replace
 * (`public/profile/clips/`), with each frame's size: his Approvals clip is a
 * tall page, 720×1020, and the other four are 1552×1030 screens.
 */
const DEFAULTS: Readonly<Record<Comparison, { clip: string; icon: string; width: number; height: number }>> = {
  approvals: { clip: '01-approvals', icon: 'approvals.png', width: 720, height: 1020 },
  documents: { clip: '02-documents', icon: 'folder-search.svg', width: 1552, height: 1030 },
  correspondence: { clip: '03-correspondence', icon: 'mail-open.png', width: 1552, height: 1030 },
  dashboard: { clip: '04-dashboard', icon: 'gauge.png', width: 1552, height: 1030 },
  dailyReport: { clip: '05-daily-report', icon: 'chart.png', width: 1552, height: 1030 },
};

/** An upload as a page can use it: the file, when it was fetched along with its entry, or nothing. */
function fetched<T extends { url?: string | null }>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' && value.url ? value : null;
}

/**
 * The before-and-after section's content in `locale` (ticket 108), from the
 * profile's entry: every word an Editor's, and each video and poster an
 * Editor's where one has been chosen, Ahmed's where not.
 */
export function profileCompare(locale: Locale, compare: ProfilePage['compare']): ProfileCompareContent {
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);

  return {
    eyebrow: words(compare.eyebrow),
    title: words(compare.title),
    lead: words(compare.lead),
    beforeLabel: words(compare.beforeLabel),
    afterLabel: words(compare.afterLabel),
    playLabel: words(compare.playLabel),
    comparisons: COMPARISONS.map((id) => {
      const stored = compare[id];
      const defaults = DEFAULTS[id];
      const video = fetched<ProfileFile>(stored.video);
      const poster = fetched<Media>(stored.poster);
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
        icon: `/profile/icons/${defaults.icon}`,
        video: video?.url ?? `/profile/clips/${defaults.clip}.mp4`,
        poster:
          poster && poster.width && poster.height
            ? { url: poster.url!, width: poster.width, height: poster.height }
            : { url: `/profile/clips/poster-${defaults.clip.slice(0, 2)}.webp`, width: defaults.width, height: defaults.height },
      };
    }),
  };
}
