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
import { test, expect, type Page } from '@playwright/test';
import {
  BASELINE_VIEWPORTS,
  freezeTransitions,
  openReferencePage,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

type Region = {
  /** Names the region when a comparison fails. */
  name: string;
  /** Everything in the region is measured from this element's top-left corner. */
  root: string;
  /** Measured in full: position, size, colour and type. */
  parts: readonly string[];
  /** Measured across only — horizontal position, width and colour — because the placeholder moves them vertically. */
  across?: readonly string[];
  /** Whether the root itself is measured across only. */
  rootAcross?: boolean;
  /** Whether differences within ROUNDING are forgiven. Only where rounding drift has been measured. */
  forgiving?: boolean;
};

const REGIONS: readonly Region[] = [
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
    parts: ['.eyebrow', 'h2', '.lead'],
    rootAcross: true,
  },
  {
    name: 'the figures section',
    root: '#proof',
    parts: [],
    across: ['.proof-2col', '.proof-copy', '.deck-wrap'],
    rootAcross: true,
  },
];

async function measure(page: Page, region: Region) {
  return page.evaluate(
    ({ root, parts, across, rootAcross }) => {
      const base = document.querySelector(root);
      if (!base) return null;
      const origin = base.getBoundingClientRect();
      const round = (n: number) => Math.round(n * 100) / 100;

      const of = (element: Element, acrossOnly: boolean) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const shape = {
          left: round(box.left - origin.left),
          width: round(box.width),
          color: style.color,
          background: style.backgroundColor,
          borderColor: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(' '),
        };
        if (acrossOnly) return shape;
        return {
          ...shape,
          top: round(box.top - origin.top),
          height: round(box.height),
          font: `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${style.fontFamily}`,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
        };
      };

      // Every match, not the first: the six cards are six comparisons each,
      // and a card that went missing fails on the count.
      const result: Record<string, unknown> = { self: of(base, rootAcross) };
      for (const part of parts) {
        result[part] = [...base.querySelectorAll(part)].map((element) => of(element, false));
      }
      for (const part of across) {
        result[part] = [...base.querySelectorAll(part)].map((element) => of(element, true));
      }
      return result;
    },
    {
      root: region.root,
      parts: [...region.parts],
      across: [...(region.across ?? [])],
      rootAcross: region.rootAcross ?? false,
    },
  );
}

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
      const options = { viewport, reducedMotion: 'reduce' as const };
      const referenceContext = await browser.newContext(options);
      const rebuiltContext = await browser.newContext(options);

      try {
        const reference = await referenceContext.newPage();
        await openReferencePage(reference, site, 'index.html');
        await freezeTransitions(reference);

        const rebuilt = await rebuiltContext.newPage();
        await rebuilt.goto(baseURL!);
        await rebuilt.evaluate(() => document.fonts.ready);
        await freezeTransitions(rebuilt);

        for (const region of REGIONS) {
          const expected = await measure(reference, region);
          const actual = await measure(rebuilt, region);
          expect(region.forgiving ? forgiveRounding(actual, expected) : actual, region.name).toEqual(
            expected,
          );
        }
      } finally {
        await referenceContext.close();
        await rebuiltContext.close();
      }
    });
  }
});
