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

/**
 * The sections deliberately a different height, the windows where they are,
 * and why. Each `why` names the ticket that decided it and says what the
 * difference is, so a new entry here has to be argued rather than added.
 */
const DELIBERATELY_DIFFERENT: readonly { section: string; where: (viewport: Viewport) => boolean; why: string }[] = [
  {
    section: '.logos.dark',
    where: ({ width }) => width <= 980,
    why: 'Ticket 06: the Trust strip is a rail of one row that moves, where the Reference site lets its logos wrap onto as many rows as they need; below 981px they need more than one.',
  },
  {
    section: 'jt',
    where: () => true,
    why: 'Ticket 08 and ADR-0002: every Screen mock has a caption under it saying in words what the picture shows. The Reference site has none.',
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

        const differences = rebuilt
          .map((section, index) => ({ ...section, reference: reference[index].height }))
          .filter((section) => section.height !== section.reference)
          .filter((section) => !DELIBERATELY_DIFFERENT.some((known) => known.section === section.name && known.where(viewport)))
          .map((section) => `${section.name}: ${section.height} against ${section.reference}`);
        expect(differences, 'sections a different height from the Reference site').toEqual([]);
      } finally {
        await pages.close();
      }
    });
  }
});
