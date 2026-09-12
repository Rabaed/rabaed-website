import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
// Relative, with the extension — see the note in `registry.ts`.
import { LOCALE_CODES, type Locale } from '../lib/locales.ts';
import type { ScreenMock } from './registry.ts';

/**
 * Reads a Screen mock's markup off disk, at request time, from the server.
 *
 * Read rather than imported on purpose. The eight mocks are 260 KB of
 * hand-built markup between them, and ADR-0002's whole point is that none of
 * it reaches production pages. Importing them would put every byte into a
 * bundle; reading them leaves them as files that only the studio route ever
 * opens. `next.config.ts` lists the directory under `outputFileTracingIncludes`
 * so the deployment still carries them.
 *
 * The markup is trusted: it is in this repository, written by the co-founder
 * and reviewed like any other file, and is the only thing ever passed to
 * `dangerouslySetInnerHTML` in this codebase. It takes a `ScreenMock` rather
 * than an id so that the filename can only ever come from the registry — a
 * string parameter would put that guarantee in a comment, where the next
 * caller is free to ignore it.
 */
const mocksDir = path.join(process.cwd(), 'src', 'screen-mocks');

export async function readScreenMockMarkup(locale: Locale, mock: ScreenMock): Promise<string> {
  return readFile(path.join(mocksDir, locale, `${mock.id}.html`), 'utf8');
}

/**
 * The locales that actually have a set of mocks on disk. Arabic today; English
 * when ticket 41 produces it. Read rather than declared, so a half-finished
 * locale cannot be announced by a constant nobody updated.
 */
export async function screenMockLocales(): Promise<Locale[]> {
  const entries = await readdir(mocksDir, { withFileTypes: true });
  const present = new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name));
  return LOCALE_CODES.filter((locale) => present.has(locale));
}
