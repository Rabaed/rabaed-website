import { Fragment } from 'react';

/**
 * A run of page text that is more than plain words: numerals set in DM Mono,
 * a Latin name set left to right, a bold phrase, a line break. Page text is
 * handed to a section in this shape, so the section never has to be written
 * with the words inside it.
 *
 * Only the numerals and the Latin runs are `.mono`: DM Mono has no Arabic
 * glyphs (spec: Design system).
 */
export type InlinePart =
  | string
  /** Numerals inside Arabic text, set in DM Mono: «60» in «60 يوماً». */
  | { readonly mono: string }
  /** Latin text inside Arabic text — a file name — set in DM Mono, left to right, so its dots stay put. */
  | { readonly latin: string }
  | { readonly strong: string }
  | { readonly lineBreak: true };

export type InlineText = string | readonly InlinePart[];

/** The text alone, as a visitor reads it: for an `alt`, a label, or structured data. */
export function plainText(text: InlineText): string {
  if (typeof text === 'string') return text;
  return text
    .map((part) => {
      if (typeof part === 'string') return part;
      if ('mono' in part) return part.mono;
      if ('latin' in part) return part.latin;
      if ('strong' in part) return part.strong;
      return ' ';
    })
    .join('');
}

export function Inline({ text }: { text: InlineText }) {
  if (typeof text === 'string') return text;
  return text.map((part, index) => {
    if (typeof part === 'string') return <Fragment key={index}>{part}</Fragment>;
    if ('mono' in part)
      return (
        <span key={index} className="mono">
          {part.mono}
        </span>
      );
    if ('latin' in part)
      return (
        <span key={index} className="mono" dir="ltr">
          {part.latin}
        </span>
      );
    if ('strong' in part) return <b key={index}>{part.strong}</b>;
    return <br key={index} />;
  });
}
