import type { Page } from '@playwright/test';

/**
 * Reading the home page's delay-cost calculator (ticket 10) — shared by the
 * spec that asserts its behaviour and the one that compares it with the
 * Reference site, whose markup carries the same class names for every part
 * read here.
 */

/**
 * What the calculator says — the cost, the line splitting it in two, and each
 * slider's reading, each as one run of words — and how far each slider's track
 * is coloured, with the value that colouring stands for.
 */
export function readCalculator(page: Page) {
  return page.evaluate(() => {
    const text = (element: Element) => element.textContent!.replace(/\s+/g, ' ').trim();
    const calculator = document.getElementById('calc')!;
    const [label, parts] = [...calculator.querySelectorAll('.out small')].map(text);
    return {
      cost: text(calculator.querySelector('.out b')!),
      label,
      parts,
      readings: [...calculator.querySelectorAll('.lr b')].map(text),
      tracks: [...calculator.querySelectorAll<HTMLInputElement>('input[type="range"]')].map((input) => ({
        value: input.value,
        painted: getComputedStyle(input).backgroundImage,
      })),
    };
  });
}
