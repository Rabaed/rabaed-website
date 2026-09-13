/**
 * "Matches baselines at all eight widths" for the two card decks (ticket 07),
 * measured against the Reference site itself for the reasons written up in
 * `shell-matches-reference.spec.ts` — at the sixteen viewports the baselines
 * were captured at, with reduced motion on, as `home-matches-reference.spec.ts`
 * does and for the same reason.
 *
 * Every card in each pile is measured, not only the one on top. A card's box
 * includes its transform, so this is also what holds the fan — each card's
 * offset, scale and turn — to the Reference site.
 *
 * One deliberate difference shapes how the figures section is compared. The
 * rebuild leaves out the Reference site's placeholder testimonial (see
 * `src/components/home/figures.tsx`), which makes the heading's column shorter
 * and, once the columns stack below 981px, moves the deck up the section. So
 * that section is measured as three regions, each from its own origin: the
 * heading's column, the deck, and the section around them. Only the vertical
 * positions and heights the missing placeholder changes are left out — every
 * width, every colour, and everything inside the deck is still held exactly.
 *
 * The large quotation mark behind each situation is a `::before`, which has no
 * box a script can measure, so it is the one part of either deck this cannot
 * see.
 */
import { test, expect } from '@playwright/test';
import { EVERYTHING_BUT_ACROSS, measureRegion, type Region } from './geometry';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

type DeckRegion = Region & {
  /** Whether differences within ROUNDING are forgiven. Only where rounding drift has been measured. */
  readonly forgiving?: boolean;
};

const REGIONS: readonly DeckRegion[] = [
  {
    name: 'the situations section',
    root: '#pain',
    parts: [
      '.pain-2col',
      '.pain-copy',
      '.eyebrow',
      'h2',
      '.pain-close',
      '.pain-close span',
      '.deck-wrap',
      '.deck',
      '.pcard',
      '.pcard .n',
      '.pcard q',
      '.pcard .cost',
      '.pcard .cost .ct',
      '.pcard .cost .ct svg',
      '.deck-ui',
      '.deck-ui button',
      '.deck-count',
      '.deck-count b',
      '.deck-hint',
    ],
  },
  {
    name: 'the figures deck',
    root: '#proof .deck-wrap',
    forgiving: true,
    parts: [
      '.deck',
      '.pcard',
      '.phead',
      '.topic',
      '.ic',
      '.ic svg',
      '.chead',
      '.pbody',
      'b.big',
      'b.txtnum',
      '.mark',
      '.mark span',
      '.mark em',
      '.src',
      '.src svg',
      '.deck-ui',
      '.deck-ui button',
      '.deck-count',
      '.deck-count b',
      '.deck-hint',
    ],
  },
  {
    name: "the figures section's heading",
    root: '#proof .proof-copy',
    // The placeholder testimonial left out makes the column shorter.
    omitFromRoot: EVERYTHING_BUT_ACROSS,
    parts: ['.eyebrow', 'h2', '.lead'],
  },
  {
    name: 'the figures section',
    root: '#proof',
    // Everything here moves or changes height with the placeholder left out.
    omitFromRoot: EVERYTHING_BUT_ACROSS,
    parts: [
      { selector: '.proof-2col', omit: EVERYTHING_BUT_ACROSS },
      { selector: '.proof-copy', omit: EVERYTHING_BUT_ACROSS },
      { selector: '.deck-wrap', omit: EVERYTHING_BUT_ACROSS },
    ],
  },
];

/**
 * How far apart two measurements may be and still count as the same, in CSS
 * pixels — for the figures deck only.
 *
 * It is for rounding, not slack in the layout. A box inside a turned card is
 * measured *after* the turn, and where a turn lands depends on where the card
 * sits on the page. The figures section sits lower on the Reference page than
 * on the rebuild's — tickets 08-10 have not filled in what comes before it yet,
 * and the placeholder testimonial is left out — so the same card, turned by the
 * same amount, is measured at a different height and rounds differently.
 *
 * Measured before this existed: ten viewports failed, every one by 0.01px —
 * less than one of the browser's 1/64px layout units — always a `top` or a
 * `height`, only inside the figures deck, and never in the situations deck,
 * which sits at the same height on both pages and is still compared exactly.
 * 0.05px is about three layout units. A change that moved nothing by more than
 * that would pass; each of the three deliberate breaks recorded in ticket 07,
 * one pixel apiece, was caught.
 */
const ROUNDING = 0.05;

/**
 * `actual`, with every number within ROUNDING of its counterpart in `expected`
 * replaced by that counterpart. What follows is then still an exact `toEqual`,
 * so a real difference fails with the whole readable diff around it rather
 * than a bare "expected to be close to".
 */
function forgiveRounding(actual: unknown, expected: unknown): unknown {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) <= ROUNDING ? expected : actual;
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    // A missing or extra element is left alone, so the count still fails.
    return actual.map((item, index) => forgiveRounding(item, expected[index]));
  }
  if (actual && expected && typeof actual === 'object' && typeof expected === 'object') {
    const counterpart = expected as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(actual).map(([key, value]) => [key, forgiveRounding(value, counterpart[key])]),
    );
  }
  return actual;
}

test.describe('the card decks match the Reference site', () => {
  let site: ReferenceSite;

  test.beforeAll(async () => {
    site = await startReferenceSite();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => site.server.close(resolve));
  });

  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        const { reference, rebuilt } = pages;

        for (const region of REGIONS) {
          const expected = await measureRegion(reference, region);
          const actual = await measureRegion(rebuilt, region);
          expect(region.forgiving ? forgiveRounding(actual, expected) : actual, region.name).toEqual(
            expected,
          );
        }
      } finally {
        await pages.close();
      }
    });
  }
});
