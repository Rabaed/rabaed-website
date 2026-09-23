/**
 * "The homepage as a whole now matches baselines at all eight widths"
 * (ticket 10, handed on from ticket 11), measured against the Reference site
 * itself at all sixteen baseline viewports, for the reasons in
 * `shell-matches-reference.spec.ts`: a whole-page image cannot be compared
 * here, and geometry can.
 *
 * Every section already has a comparison of its own, part by part, from its
 * own top corner: the header and footer, the hero, the two decks, the four
 * units, the Record, the before-and-after and the calculator, the questions
 * and the closing section. What none of them can say is whether the page they
 * make up is the Reference site's page. This does: the same sections, in the
 * same order, each as tall as the Reference site's — so that each section's
 * own comparison, measured from its own top, places everything in it where the
 * Reference site has it on the page.
 *
 * Where a section is deliberately a different height, it is listed below with
 * the ticket that decided it, at the windows where it reaches, and its height
 * is not compared there. Everything else's is.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  BASELINE_VIEWPORTS,
  openBothPages,
  startReferenceSite,
  type ReferenceSite,
} from './reference-site';

type Viewport = { width: number; height: number };

/** How much taller than the Reference site's a section may be, in pixels. */
type Allowance = { readonly atLeast: number; readonly atMost: number };

/**
 * The sections deliberately a different height, the windows where they are,
 * and why. Each `why` names the ticket that decided it and says what the
 * difference is, so a new entry here has to be argued rather than added.
 *
 * Where the size of the difference can be stated, `allowance` states it, and
 * the section is held to it rather than let off: a section that differs at
 * every window would otherwise never have its height compared at all.
 */
const DELIBERATELY_DIFFERENT: readonly {
  section: string;
  where: (viewport: Viewport) => boolean;
  why: string;
  allowance?: (rebuilt: Page) => Promise<Allowance>;
}[] = [
  {
    section: 'hero',
    where: ({ width, height }) => width > 980 && height > 700,
    why: 'Ticket 71 and ADR-0019: the Reference site\'s hero is the window\'s height; this one is the window less the Trust strip under it, between its 760px floor and 860px, so that the strip is on the first screen and a tall monitor is not left mostly empty.',
    // Exactly that, and so shorter than the Reference site's: the strip's own
    // rendered height is what the hero is meant to leave room for.
    allowance: (rebuilt) =>
      rebuilt.evaluate(() => {
        const tall = innerHeight;
        const strip = document.querySelector('#hero + .logos')!.getBoundingClientRect().height;
        const taller = Math.min(Math.max(760, tall - strip), 860) - Math.max(tall, 760);
        return { atLeast: taller, atMost: taller };
      }),
  },
  {
    section: '.logos.dark',
    where: ({ width }) => width <= 980,
    why: 'Ticket 06: the Trust strip is a rail of one row that moves, where the Reference site lets its logos wrap onto as many rows as they need; below 981px they need more than one.',
  },
  {
    section: 'jt',
    where: () => true,
    why: 'Ticket 08 and ADR-0002: every Screen mock has a caption under it saying in words what the picture shows. The Reference site has none.',
    // No taller than the caption and the space above it; no taller at all
    // where the column of tabs beside the screen is what sets the height.
    allowance: (rebuilt) =>
      rebuilt.evaluate(() => {
        const caption = [...document.querySelectorAll<HTMLElement>('#jt .jt-hint')].find((hint) => !hint.hidden)!;
        return { atLeast: 0, atMost: caption.getBoundingClientRect().height + parseFloat(getComputedStyle(caption).marginTop) };
      }),
  },
  {
    section: 'record',
    where: ({ width }) => width <= 980,
    why: 'Ticket 09: below 981px the section is padded and as tall as its content, where the Reference site holds it to the window and lets the content spill over the sections either side.',
  },
  {
    section: 'calc',
    where: ({ width }) => width <= 700,
    why: 'Ticket 10: «ر.س» is set in the Arabic face rather than DM Mono, which is narrower, so on a phone the cost fits on one line where the Reference site wraps it onto two.',
  },
  {
    section: 'proof',
    where: ({ width }) => width <= 980,
    why: 'Ticket 07 and ticket 47: the placeholder testimonial — a play button that plays nothing — is left out until a real one is recorded. Below 981px it stands above the deck and adds its height; above, the deck beside it is taller.',
  },
  {
    section: 'tail',
    where: () => true,
    why: 'Ticket 11: the demo request button is disabled until ticket 27 gives the form somewhere to send, and a disabled button has a 1px border above and below that the Reference site\'s does not.',
    allowance: async () => ({ atLeast: 2, atMost: 2 }),
  },
];

/** Every section of the page and the footer, top to bottom, named by its id — or, for the Trust strip, which has none, its class. */
function readSections(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('section, footer')]
      .filter((element) => !element.parentElement?.closest('section, footer'))
      .map((element) => ({
        name: element.id || (element.tagName === 'FOOTER' ? 'footer' : `.${[...element.classList].join('.')}`),
        height: Math.round(element.getBoundingClientRect().height * 100) / 100,
      })),
  );
}

let site: ReferenceSite;

test.beforeAll(async () => {
  site = await startReferenceSite();
});

test.afterAll(async () => {
  await new Promise((resolve) => site.server.close(resolve));
});

test.describe('the home page as a whole matches the Reference site', () => {
  for (const viewport of BASELINE_VIEWPORTS) {
    test(`at ${viewport.width}x${viewport.height}`, async ({ browser, baseURL }) => {
      const pages = await openBothPages(browser, baseURL!, site, viewport);

      try {
        const reference = await readSections(pages.reference);
        const rebuilt = await readSections(pages.rebuilt);

        expect(rebuilt.map((section) => section.name), 'the sections, in order').toEqual(
          reference.map((section) => section.name),
        );

        const differences: string[] = [];
        for (const [index, section] of rebuilt.entries()) {
          const taller = Math.round((section.height - reference[index].height) * 100) / 100;
          const known = DELIBERATELY_DIFFERENT.find((entry) => entry.section === section.name && entry.where(viewport));
          const described = `${section.name}: ${section.height} against ${reference[index].height}`;
          if (!known) {
            if (taller !== 0) differences.push(described);
          } else if (known.allowance) {
            // Half a pixel either way, for the rounding of two measurements.
            const { atLeast, atMost } = await known.allowance(pages.rebuilt);
            if (taller < atLeast - 0.5 || taller > atMost + 0.5) {
              differences.push(`${described}, where ${atLeast}–${Math.round(atMost * 100) / 100}px taller is expected`);
            }
          }
        }
        expect(differences, 'sections a different height from the Reference site').toEqual([]);
      } finally {
        await pages.close();
      }
    });
  }
});
