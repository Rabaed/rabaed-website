/**
 * Each Arabic word of the English pages' entries with its English (ticket 42),
 * by walking an Arabic words module and its English twin side by side.
 *
 * An Arabic word is a string with an Arabic letter in it, or a `{ ar }` pair
 * as the imports write one; whatever else a module holds — a number, a time,
 * a reference like SUB-031, a screen, a switch — is the same in both
 * languages and has no English of its own. An English twin that leaves an
 * Arabic word without English, or gives it something that is not words, is
 * refused here, when the migration is built, rather than proposed half done.
 */

/** Anything with an Arabic letter in it. */
const ARABIC_LETTER = /[\u0600-\u06FF]/;

/** One Arabic word with its English, and where it was found. */
export type Pair = { readonly entry: string; readonly path: readonly (string | number)[]; readonly ar: string; readonly en: string };

function arabicOf(value: unknown): string | null {
  if (typeof value === 'string') return ARABIC_LETTER.test(value) ? value : null;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === 'ar') {
      const ar = (value as { ar: unknown }).ar;
      return typeof ar === 'string' && ar.trim() !== '' ? ar : null;
    }
  }
  return null;
}

/** Whether a value is a `{ ar }` pair with nothing in it: a place left empty in Arabic, which needs no English. */
function isEmptyPair(value: unknown): boolean {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    (value as { ar?: unknown }).ar === ''
  );
}

/** Every Arabic word in `arabic`, with the English at the same place in `english`. */
export function pairs(entry: string, arabic: unknown, english: unknown, path: (string | number)[] = []): Pair[] {
  const where = `${entry} ${path.join('.') || '(the whole entry)'}`;
  const ar = arabicOf(arabic);
  if (ar !== null) {
    if (typeof english !== 'string' || english.trim() === '') throw new Error(`No English for ${where}: «${ar}»`);
    if (ARABIC_LETTER.test(english)) throw new Error(`The English for ${where} has Arabic in it: ${english}`);
    return [{ entry, path, ar, en: english }];
  }
  if (isEmptyPair(arabic)) return [];
  // A place with no Arabic word anywhere in it needs nothing in English.
  if (!ARABIC_LETTER.test(JSON.stringify(arabic ?? null))) return [];
  if (Array.isArray(arabic)) {
    if (!Array.isArray(english) || english.length !== arabic.length) {
      throw new Error(`The English for ${where} is not a list of ${arabic.length}`);
    }
    return arabic.flatMap((item, index) => pairs(entry, item, english[index], [...path, index]));
  }
  if (arabic && typeof arabic === 'object') {
    return Object.entries(arabic).flatMap(([key, value]) => {
      const inEnglish = english && typeof english === 'object' ? (english as Record<string, unknown>)[key] : undefined;
      return pairs(entry, value, inEnglish, [...path, key]);
    });
  }
  return [];
}

/**
 * The English of every Arabic word, once each. The same Arabic in two places
 * is given the same English in both — which is what lets the migration find a
 * word's English by its Arabic alone — so two different Englishes for one
 * Arabic word are refused.
 */
export function dictionary(all: readonly Pair[]): Map<string, string> {
  const english = new Map<string, string>();
  const seenAt = new Map<string, Pair>();
  for (const pair of all) {
    const earlier = seenAt.get(pair.ar);
    if (earlier && english.get(pair.ar) !== pair.en) {
      throw new Error(
        `«${pair.ar}» is «${english.get(pair.ar)}» in ${earlier.entry} ${earlier.path.join('.')} and «${pair.en}» in ${pair.entry} ${pair.path.join('.')}`,
      );
    }
    english.set(pair.ar, pair.en);
    seenAt.set(pair.ar, pair);
  }
  return english;
}
