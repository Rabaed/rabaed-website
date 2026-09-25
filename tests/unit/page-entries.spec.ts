/**
 * Which entries decide each page's English is written once, in
 * `src/lib/page-registry.ts`, the page registry (tickets 91 and 92), and the table in
 * `docs/deployment.md` that tells the founder what to publish for a page to be
 * in English is held to it here: a page given a new shared entry, and the
 * table not told, would leave him publishing everything it names and the page
 * still a notice.
 *
 * Here rather than in `tests/e2e` because it opens no browser: what it reads
 * is source in the repository (spec: Testing Decisions). That the list is the
 * entries each page really reads is `tests/e2e/english-pages.spec.ts`'s to
 * show, which publishes each page's English by it.
 */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { MARKETING_PAGES, MARKETING_PAGE_KEYS, entriesRead, type MarketingPage } from '../../src/lib/page-registry';

/**
 * Each entry by the name the admin gives it, which is the name the table uses:
 * the pages' own as the registry names them, and the entries they share.
 */
const ENTRY_NAMED: Readonly<Record<string, string>> = {
  ...Object.fromEntries(MARKETING_PAGE_KEYS.map((page) => [MARKETING_PAGES[page].entry.label.ar, MARKETING_PAGES[page].entry.slug])),
  'قسم «كيف نبدأ معك»': 'closing-section',
  'شاشات المنصة': 'screen-mocks',
  'شريط الثقة': 'trust-strip',
  'كلمات الموقع المشتركة': 'site-words',
};

/** Each page by the name the table gives it. */
const PAGE_NAMED: Readonly<Record<string, MarketingPage>> = {
  Home: 'home',
  Product: 'product',
  Start: 'start',
  Tool: 'tool',
  Referral: 'referral',
  Partnership: 'partnership',
};

const HEADER = '| Entry in the admin | English pages that read it | What they read there |';

/** The table's rows: each entry, and the pages it names. */
async function tableRows(): Promise<{ entry: string; pages: string[] }[]> {
  const guide = await readFile(path.resolve(import.meta.dirname, '..', '..', 'docs', 'deployment.md'), 'utf8');
  const lines = guide.split(/\r?\n/);
  const start = lines.indexOf(HEADER);
  expect(start, 'docs/deployment.md has no table of the entries the English pages read').toBeGreaterThanOrEqual(0);
  const rows = lines.slice(start + 2);
  return rows.slice(0, rows.findIndex((line) => !line.startsWith('|'))).map((line) => {
    const [entry, pages] = line.split('|').slice(1, 3).map((cell) => cell.trim());
    return { entry: entry!.replaceAll('**', ''), pages: pages!.split(',').map((page) => page.trim()) };
  });
}

test('the guide names, for each page, the entries that decide whether it is in English', async () => {
  const rows = await tableRows();
  for (const row of rows) {
    expect(Object.keys(ENTRY_NAMED), `an entry the table names`).toContain(row.entry);
    for (const page of row.pages) expect(Object.keys(PAGE_NAMED), `a page the table names`).toContain(page);
  }

  const table = (page: MarketingPage) =>
    rows.filter((row) => row.pages.some((named) => PAGE_NAMED[named] === page)).map((row) => ENTRY_NAMED[row.entry]);
  for (const page of MARKETING_PAGE_KEYS) expect(table(page).sort(), page).toEqual([...entriesRead(page)].sort());
});
