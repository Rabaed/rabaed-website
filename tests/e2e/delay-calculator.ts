import type { Page } from '@playwright/test';

/**
 * Reading the Delay-cost calculator (ticket 10, ticket 103) — shared by the
 * spec that asserts its behaviour, the Company profile's (ticket 106), and the
 * ones that compare it with the Reference site, whose markup carries the
 * same class names for every part read here. The comparison leaves out how the tracks are painted, which
 * the rebuild does differently (ticket 72).
 */

/**
 * What the calculator says — the cost, the line under it saying what has been
 * spent, and each slider's reading, each as one run of words — and how far
 * each slider's track is coloured, with the value that colouring stands for.
 * `id` is its section's: the home page's `calc`, the Company profile's `cost`.
 */
export function readCalculator(page: Page, id = 'calc') {
  return page.evaluate((id) => {
    const text = (element: Element) => element.textContent!.replace(/\s+/g, ' ').trim();
    const calculator = document.getElementById(id)!;
    const [label, spent] = [...calculator.querySelectorAll('.out small')].map(text);
    return {
      cost: text(calculator.querySelector('.out b')!),
      label,
      spent,
      readings: [...calculator.querySelectorAll('.lr b')].map(text),
      tracks: [...calculator.querySelectorAll<HTMLInputElement>('input[type="range"]')].map((input) => ({
        value: input.value,
        painted: getComputedStyle(input).backgroundImage,
      })),
    };
  }, id);
}

/**
 * Writes the rebuilt calculator's words and figures into the Reference site's,
 * part for part, so that the two can be measured against each other.
 *
 * **Why the Reference site is given other words** (ADR-0029): the calculator
 * counts the cost of money on what has been spent, in Ahmed's words, where the
 * Reference site's counts financing and site overhead in its own. The method
 * and its words differ on purpose; the look must not. With the same words in
 * both, every box the comparison measures is the one the design draws for
 * them, and a difference is the design's.
 */
export async function giveReferenceTheRebuiltWords(reference: Page, rebuilt: Page): Promise<void> {
  const words = await rebuilt.evaluate(() => {
    const text = (element: Element) => element.textContent!.replace(/\s+/g, ' ').trim();
    const calculator = document.getElementById('calc')!;
    const one = (selector: string) => text(calculator.querySelector(selector)!);
    const all = (selector: string) => [...calculator.querySelectorAll(selector)].map(text);
    return {
      eyebrow: one('.eyebrow'),
      heading: one('h2'),
      lead: one('.lead'),
      // A slider's name is its reading's line without the reading.
      names: [...calculator.querySelectorAll('.lr')].map((line) => text(line).slice(0, -text(line.querySelector('b')!).length).trim()),
      readings: all('.lr b'),
      smalls: all('.out small'),
      cost: one('.out b'),
      note: one('.out .n'),
      button: one('.out .btn'),
    };
  });

  await reference.evaluate((words) => {
    const calculator = document.getElementById('calc')!;
    const set = (selector: string, value: string) => (calculator.querySelector(selector)!.textContent = value);
    set('.eyebrow', words.eyebrow);
    set('h2', words.heading);
    set('.lead', words.lead);
    calculator.querySelectorAll('.lr').forEach((line, index) => {
      line.firstChild!.textContent = `${words.names[index]} `;
      line.querySelector('b')!.textContent = words.readings[index];
    });
    calculator.querySelectorAll('.out small').forEach((small, index) => (small.textContent = words.smalls[index]));
    set('.out b', words.cost);
    set('.out .n', words.note);
    set('.out .btn', words.button);
  }, words);
}
