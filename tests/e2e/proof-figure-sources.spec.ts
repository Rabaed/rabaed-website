/**
 * The home page's four proof figures have their source (ticket 47), which is
 * what puts their cards on a public deployment (`src/components/home/figures.tsx`).
 *
 * Read from the CMS rather than the page, because the test suite is not a
 * public deployment and draws every card whether it is sourced or not: what
 * decides the public site is the entry. The test database is migrated the way
 * production's was, so the home page has drafts waiting on it — ticket 35's
 * openers inside ticket 42's English — and the source has to be in what is
 * published and in the draft both, or publishing the draft would take the
 * cards off again — and so does the first card's corrected basis, or
 * publishing the draft would put the old one back.
 *
 * It signs in as an editor of its own (`editors.ts`).
 */
import { test, expect } from '@playwright/test';
import { signIn } from './editors';
import {
  CORRECTED_BASIS,
  PROOF_FIGURE_SOURCE,
  SOURCED_FIGURES,
} from '../../src/migrations/20260923_150000_publish_proof_figure_sources';

type Words = { ar: string; en?: string | null };
type Figure = { blockType: 'comparison' | 'commitment'; figure?: string; source?: string | null; basis: Words };

test('the four proof figures carry their source, and the first its corrected basis, in what is published and in the draft waiting to be', async ({
  request,
}) => {
  await signIn(request);

  for (const [what, query] of [
    ['what is published', ''],
    ['the draft', '&draft=true'],
  ] as const) {
    const response = await request.get(`/api/globals/home-page?depth=0${query}`);
    expect(response.ok(), what).toBe(true);
    const entry: { figures: { figures: Figure[] } } = await response.json();

    const cards = new Map(
      entry.figures.figures.filter((card) => card.blockType === 'comparison').map((card) => [card.figure, card]),
    );
    for (const figure of SOURCED_FIGURES) {
      expect(cards.get(figure)?.source, `the source of ${figure}, in ${what}`).toBe(PROOF_FIGURE_SOURCE);
    }

    // The figures compare two of the customer's projects, and the first card
    // said one project before and after. Its English, drafted by ticket 42,
    // exists only in a draft — and the home page's other suites save drafts of
    // their own beside this one, made from what is published, with no English
    // at all. So whatever English the draft has must not be the old claim.
    const basis = cards.get(CORRECTED_BASIS.figure)?.basis;
    expect(basis?.ar, `the basis of ${CORRECTED_BASIS.figure}, in ${what}`).toBe(CORRECTED_BASIS.becomes.ar);
    expect(basis?.en ?? null, `its English, in ${what}`).not.toBe(CORRECTED_BASIS.was.en);
  }
});
