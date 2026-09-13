import type { Page } from '@playwright/test';

/**
 * Reading the home page's Record section (ticket 09) while it is scrolled —
 * shared by the spec that asserts its behaviour and the one that compares it
 * with the Reference site, whose markup carries the same class names for every
 * part read here.
 */

/** Two frames: long enough for a scroll to reach every trigger and for GSAP to draw what they set. */
export async function settle(page: Page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

/**
 * Scrolls to `progress` through the section on a desktop window, where it holds
 * still while the visitor scrolls: 0 where its top meets the window's top, 1
 * where its bottom meets the window's bottom — the Reference site's own
 * measure, which its cycle is written against.
 */
export async function scrollToProgress(page: Page, progress: number) {
  await page.evaluate((through) => {
    const section = document.getElementById('record')!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.round(top + through * (section.offsetHeight - window.innerHeight)));
  }, progress);
  await settle(page);
}

/** Scrolls until the window's top is `fraction` of the section's height into it — the measure its colour changes use. */
export async function scrollIntoSection(page: Page, fraction: number) {
  await page.evaluate((through) => {
    const section = document.getElementById('record')!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.round(top + through * section.offsetHeight));
  }, fraction);
  await settle(page);
}

/**
 * The transaction type marked, and whether the stamp is on — the stamp from its
 * class rather than its opacity, which takes 0.4s to fade and would still read
 * "on" while the types behind it had moved on.
 */
export function readCycle(page: Page) {
  return page.evaluate(() => ({
    chosen: [...document.querySelectorAll('#record .rec-types span')].findIndex((chip) => chip.classList.contains('on')),
    stamped: document.querySelector('#record .stamp')!.classList.contains('on'),
  }));
}

/** The section's ground and words, and the card's ground and edge. */
export function readColours(page: Page) {
  return page.evaluate(() => {
    const section = getComputedStyle(document.getElementById('record')!);
    const card = getComputedStyle(document.querySelector('#record .rec-card')!);
    return {
      section: section.backgroundColor,
      text: section.color,
      card: card.backgroundColor,
      cardBorder: card.borderTopColor,
    };
  });
}
