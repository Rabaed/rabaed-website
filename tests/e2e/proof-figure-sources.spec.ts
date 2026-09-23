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
 * cards off again.
 *
 * It signs in as an editor of its own (`cms.ts`).
 */
import { test, expect } from '@playwright/test';
import { PROOF_FIGURES_EDITOR, logInByApi } from './cms';
import { PROOF_FIGURE_SOURCE, SOURCED_FIGURES } from '../../src/migrations/20260923_150000_publish_proof_figure_sources';

type Figure = { blockType: 'comparison' | 'commitment'; figure?: string; source?: string | null };

test('the four proof figures carry their source, in what is published and in the draft waiting to be', async ({
  request,
}) => {
  await logInByApi(request, PROOF_FIGURES_EDITOR);

  for (const [what, query] of [
    ['what is published', ''],
    ['the draft', '&draft=true'],
  ] as const) {
    const response = await request.get(`/api/globals/home-page?depth=0${query}`);
    expect(response.ok(), what).toBe(true);
    const entry: { figures: { figures: Figure[] } } = await response.json();

    const sources = new Map(
      entry.figures.figures.filter((card) => card.blockType === 'comparison').map((card) => [card.figure, card.source]),
    );
    for (const figure of SOURCED_FIGURES) {
      expect(sources.get(figure), `the source of ${figure}, in ${what}`).toBe(PROOF_FIGURE_SOURCE);
    }
  }
});
