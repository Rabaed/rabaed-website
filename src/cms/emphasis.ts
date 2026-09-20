/**
 * Emphasis inside words an Editor writes (ticket 58): a phrase in bold between
 * two asterisks — `*اسحب المقبض*`, as WhatsApp marks it — and a line break
 * wherever the Editor starts a new line. A textarea shows both, where it cannot
 * show a typeface. The home page's before-and-after writes both.
 *
 * Imported by the CMS configuration, so it imports relatively.
 */
import type { InlinePart, InlineText } from '../components/inline-text';
import type { Words } from './page-fields';

const LINES = /\r?\n/;

/** Why a text's emphasis cannot be drawn as written, for the Editor — or `null` when it can. */
export function emphasisProblem(text: string): Words | null {
  for (const line of text.split(LINES)) {
    if ((line.match(/\*/g) ?? []).length % 2 === 1) {
      return {
        ar: 'علامة * بلا إغلاق. ضع ما يُكتب بخط عريض بين علامتين على السطر نفسه، مثل *اسحب المقبض*.',
        en: 'A * with no closing mark. Put what is set in bold between two, on one line, like *drag the handle*.',
      };
    }
    // Between asterisks is every second piece.
    if (line.split('*').some((piece, index) => index % 2 === 1 && piece.trim() === '')) {
      return {
        ar: 'لا شيء بين علامتي *. اكتب بينهما ما يُكتب بخط عريض، أو احذفهما.',
        en: 'Nothing between two * marks. Write what is set in bold between them, or remove them.',
      };
    }
  }
  return null;
}

/** The text as the page draws it: its bold phrases, and its line breaks. */
export function withEmphasis(text: string): InlineText {
  if (!text.includes('*') && !LINES.test(text)) return text;

  return text.split(LINES).flatMap((line, index): InlinePart[] => [
    ...(index > 0 ? [{ lineBreak: true } as const] : []),
    ...line
      .split('*')
      .map((piece, position): InlinePart => (position % 2 === 1 ? { strong: piece } : piece))
      .filter((part) => part !== ''),
  ]);
}
