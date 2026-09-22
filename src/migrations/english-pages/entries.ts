/**
 * The entries the English pages read, each with its Arabic as it was imported
 * or proposed and its English twin (ticket 42) — which `pairs.ts` walks side
 * by side into each Arabic word's English.
 *
 * Every entry a marketing page reads is here, because a page is published in
 * English only once everything it reads is (`src/content/pages/*.ts`): the six
 * pages' own, the closing section, the Screen mocks, the Trust strip and the
 * search settings. The words every page shares — the header and the footer —
 * are ticket 40's, proposed already.
 */
import { SECTION_OPENERS } from '../answer-first-proposal/words';
import { HOME_PAGE_WORDS } from '../home-page-import/words';
import { PARTNERSHIP_PAGE_WORDS } from '../partnership-page-import/words';
import { CLOSING_SECTION_WORDS, PRODUCT_PAGE_WORDS, SCREEN_MOCK_DESCRIPTIONS } from '../product-page-import/words';
import { REFERRAL_PAGE_WORDS } from '../referral-page-import/words';
import { SEARCH_SETTINGS } from '../search-settings-import/words';
import { START_PAGE_WORDS } from '../start-page-import/words';
import { TOOL_PAGE_WORDS } from '../tool-page-import/words';
import { TRUST_STRIP_LOGOS, TRUST_STRIP_WORDS } from '../trust-strip-import/logos';
import { ENGLISH_HOME_PAGE } from './home';
import { dictionary, pairs, type Pair } from './pairs';
import { ENGLISH_PARTNERSHIP_PAGE } from './partnership';
import { ENGLISH_CLOSING_SECTION, ENGLISH_PRODUCT_PAGE, ENGLISH_SCREEN_MOCK_DESCRIPTIONS } from './product';
import { ENGLISH_REFERRAL_PAGE } from './referral';
import { ENGLISH_SEARCH_SETTINGS, ENGLISH_SECTION_OPENERS, ENGLISH_TRUST_STRIP } from './shared';
import { ENGLISH_START_PAGE } from './start';
import { ENGLISH_TOOL_PAGE } from './tool';

/** An entry: its slug, and its words in Arabic and in English, in the shape of its data. */
export type EnglishEntry = {
  readonly slug: string;
  readonly twins: readonly (readonly [arabic: unknown, english: unknown])[];
};

/**
 * The Screen mocks' descriptions, keyed as the entry keys its tabs: a mock's
 * id in camel case, `daily-report` as `dailyReport`. The rule is written out
 * here rather than read from `src/cms/screen-mock-fields.ts`, and the mocks
 * are the frozen import's rather than the registry's, so that nothing added to
 * the site later changes what this migration proposes.
 */
function screenMocks(descriptions: Readonly<Record<string, string>>) {
  const tab = (id: string) => id.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase());
  return Object.fromEntries(Object.entries(descriptions).map(([id, description]) => [tab(id), { description }]));
}

export const ENGLISH_ENTRIES: readonly EnglishEntry[] = [
  {
    slug: 'home-page',
    twins: [
      [HOME_PAGE_WORDS, ENGLISH_HOME_PAGE],
      // The two openers ticket 35 proposed, which a draft of the page may hold.
      [
        { fourUnits: { lead: SECTION_OPENERS.homeFourUnits }, record: { lead: SECTION_OPENERS.homeRecord } },
        { fourUnits: { lead: ENGLISH_SECTION_OPENERS.homeFourUnits }, record: { lead: ENGLISH_SECTION_OPENERS.homeRecord } },
      ],
    ],
  },
  {
    slug: 'product-page',
    twins: [
      [PRODUCT_PAGE_WORDS, ENGLISH_PRODUCT_PAGE],
      [
        { roles: { lead: SECTION_OPENERS.productRoles }, innerCycle: { lead: SECTION_OPENERS.productInnerCycle } },
        { roles: { lead: ENGLISH_SECTION_OPENERS.productRoles }, innerCycle: { lead: ENGLISH_SECTION_OPENERS.productInnerCycle } },
      ],
    ],
  },
  { slug: 'start-page', twins: [[START_PAGE_WORDS, ENGLISH_START_PAGE]] },
  { slug: 'tool-page', twins: [[TOOL_PAGE_WORDS, ENGLISH_TOOL_PAGE]] },
  { slug: 'referral-page', twins: [[REFERRAL_PAGE_WORDS, ENGLISH_REFERRAL_PAGE]] },
  { slug: 'partnership-page', twins: [[PARTNERSHIP_PAGE_WORDS, ENGLISH_PARTNERSHIP_PAGE]] },
  { slug: 'closing-section', twins: [[{ closing: CLOSING_SECTION_WORDS }, { closing: ENGLISH_CLOSING_SECTION }]] },
  {
    slug: 'screen-mocks',
    twins: [[screenMocks(SCREEN_MOCK_DESCRIPTIONS), screenMocks(ENGLISH_SCREEN_MOCK_DESCRIPTIONS)]],
  },
  {
    slug: 'trust-strip',
    twins: [
      [{ strip: { ...TRUST_STRIP_WORDS, logos: TRUST_STRIP_LOGOS.map((logo) => ({ name: logo.name })) } }, ENGLISH_TRUST_STRIP],
    ],
  },
  { slug: 'search-settings', twins: [[SEARCH_SETTINGS, ENGLISH_SEARCH_SETTINGS]] },
];

/** Every Arabic word of every entry, with its English and where it is. */
export const ENGLISH_PAIRS: readonly Pair[] = ENGLISH_ENTRIES.flatMap((entry) =>
  entry.twins.flatMap(([arabic, english]) => pairs(entry.slug, arabic, english)),
);

/** Each Arabic word's English, once — the same across every entry. */
export const ENGLISH_WORDS: ReadonlyMap<string, string> = dictionary(ENGLISH_PAIRS);
