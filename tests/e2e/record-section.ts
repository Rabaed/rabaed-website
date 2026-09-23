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
 * Scrolls to `progress` through the stretch the section holds still for: 0
 * where its top meets the window's top and it begins to hold, 1 where it lets
 * go. On a desktop window that ends where the section's bottom meets the
 * window's — the Reference site's own measure, which its cycle is written
 * against — because the box that holds is the window's height. Below 981px
 * the box also carries the paragraph that follows the card, so it lets go
 * sooner than that, by the paragraph's height (ticket 80).
 */
export async function scrollToProgress(page: Page, progress: number) {
  await page.evaluate((through) => {
    window.scrollTo(0, Math.round(heldFrom() + through * heldFor()));

    function heldFrom() {
      return document.getElementById('record')!.getBoundingClientRect().top + window.scrollY;
    }
    function heldFor() {
      const section = document.getElementById('record')!;
      return section.offsetHeight - section.querySelector<HTMLElement>('.sticky')!.offsetHeight;
    }
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
