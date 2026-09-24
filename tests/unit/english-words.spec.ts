/**
 * The English proposed for the six marketing pages (ticket 42), held to the
 * Arabic it translates and to the CMS it will be published through.
 *
 * Here rather than in `tests/e2e`, like `data-migrations.spec.ts`, because what
 * it reads is source in the repository — the Arabic as the imports wrote it,
 * the English beside it, and the fields that will hold each word — which no
 * running application serves. That the drafts reach the CMS, and that a page
 * published from them is a page of the site, is `tests/e2e/english-pages.spec.ts`.
 */
import { test, expect } from '@playwright/test';
import { FAQ_REWRITES, COMPARISON_QUESTIONS } from '../../src/migrations/answer-first-proposal/words';
import { ENGLISH_PAIRS, ENGLISH_WORDS } from '../../src/migrations/english-pages/entries';
import { ENGLISH_QUESTIONS } from '../../src/migrations/english-pages/faqs';
import { MARKS } from '../../src/migrations/english-pages/seed';
import { IMPORTED_FAQ_ENTRIES } from '../../src/migrations/faq-import/entries';
import { runProbe } from './payload-probe';

/**
 * What `english-fields.probe.ts` found the CMS would refuse. It opens no
 * database: the fields are checked as the configuration declares them, and
 * none of them reads one.
 */
function refusedEnglish(): string[] {
  return JSON.parse(runProbe('english-fields.probe.ts')) as string[];
}

test.describe('the English pages’ words', () => {
  test('give every Arabic word of every entry the pages read its English, once', () => {
    // `pairs.ts` refuses an Arabic word left without English, English with
    // Arabic in it, and one Arabic word given two Englishes; importing the
    // pairs is what runs those checks. What is left to say is that they are
    // all there.
    expect(new Set(ENGLISH_PAIRS.map((pair) => pair.entry))).toEqual(
      new Set([
        'home-page',
        'product-page',
        'start-page',
        'tool-page',
        'referral-page',
        'partnership-page',
        'closing-section',
        'trust-strip',
        'search-settings',
      ]),
    );
    expect(ENGLISH_WORDS.size).toBeGreaterThan(400);
  });

  test('are every one accepted by the field that will hold it', () => {
    // Loading the CMS's configuration is slower than the runner's own deadline expects.
    test.slow();
    // Its length above all — English runs longer than Arabic, and each field
    // holds a word to what its place in the design carries — and its marks,
    // and an opening answer's 30 to 60 words: what the CMS asks of it when the
    // founder presses Publish with English among the page's languages.
    expect(refusedEnglish()).toEqual([]);
  });

  test('keep every amount named, so that changing a value changes the English too', () => {
    for (const pair of ENGLISH_PAIRS) {
      const names = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
      expect(names(pair.en), `${pair.entry} ${pair.path.join('.')}`).toEqual(names(pair.ar));
    }
  });

  test('mark each proposal by a word it proposes', () => {
    const proposed = new Set(ENGLISH_WORDS.values());
    for (const [versions, mark] of Object.entries(MARKS)) {
      expect(proposed.has(mark.english), `${versions}'s mark is not a word proposed`).toBe(true);
    }
  });
});

test.describe('the English questions', () => {
  /** Every Arabic question on the six pages, imported or proposed, as `page: question`. */
  const arabic = [...IMPORTED_FAQ_ENTRIES, ...FAQ_REWRITES, ...COMPARISON_QUESTIONS].map(
    (entry) => `${entry.page}: ${entry.question}`,
  );

  test('ask every Arabic question in English, once on each page that asks it', () => {
    const english = ENGLISH_QUESTIONS.map((entry) => `${entry.page}: ${entry.arabic}`);
    expect(new Set(english).size, 'an Arabic question asked twice in English').toBe(english.length);
    expect(new Set(english)).toEqual(new Set(arabic));
  });

  test('are English, and keep what an answer marks', () => {
    for (const entry of ENGLISH_QUESTIONS) {
      expect(entry.question, entry.arabic).not.toMatch(/[\u0600-\u06FF]/);
      expect(entry.answer, entry.arabic).not.toMatch(/[\u0600-\u06FF]/);
      // The FAQ collection holds a question to 160 characters and an answer
      // to 800 (`src/cms/collections/faq-entries.ts`).
      expect(entry.question.length, entry.question).toBeLessThanOrEqual(160);
      expect(entry.answer.length, entry.question).toBeLessThanOrEqual(800);
    }
    const payout = ENGLISH_QUESTIONS.filter((entry) => entry.answer.includes('{payout}'));
    expect(payout.map((entry) => entry.arabic)).toEqual(
      IMPORTED_FAQ_ENTRIES.filter((entry) => entry.answer.includes('{payout}')).map((entry) => entry.question),
    );
  });
});
