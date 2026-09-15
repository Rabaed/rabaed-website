/**
 * A Latin name inside Arabic text an Editor writes — a file name, like
 * `` `concrete_db.json` `` — marked between backticks, which a textarea can
 * show where it cannot show a typeface. The page sets it left to right in DM
 * Mono, so its dots and underscores stay where they belong. FAQ answers
 * (`faq-answer.ts`) and page text (`page-fields.ts`) share the mark.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { InlinePart, InlineText } from '../components/inline-text';
import type { Words } from './page-fields';

/** Arabic letters, which DM Mono has no glyphs for (spec: Design system). */
export const ARABIC = /[؀-ۿ]/;

/** Why a text's Latin names cannot be drawn as written, for the Editor — or `null` when they can. */
export function latinNameProblem(text: string): Words | null {
  if ((text.match(/`/g) ?? []).length % 2 === 1) {
    return {
      ar: 'علامة ` بلا إغلاق. ضع الاسم الإنجليزي بين علامتين، مثل `concrete_db.json`.',
      en: 'A ` with no closing mark. Put the Latin name between two, like `concrete_db.json`.',
    };
  }
  if (text.split('`').some((piece, index) => index % 2 === 1 && ARABIC.test(piece))) {
    return {
      ar: 'ما بين علامتي ` يُكتب بخط إنجليزي لا حروف عربية فيه. اترك النص العربي خارجهما.',
      en: 'Only Latin text goes between two ` marks, with no Arabic letters. Keep the Arabic outside them.',
    };
  }
  return null;
}

/** The text as the page draws it, its Latin names marked out. */
export function withLatinNames(text: string): InlineText {
  if (!text.includes('`')) return text;

  // Between backticks is every second piece.
  const parts: InlinePart[] = text
    .split('`')
    .map((piece, index) => (index % 2 === 1 ? { latin: piece } : piece))
    .filter((part) => part !== '');
  return parts;
}
