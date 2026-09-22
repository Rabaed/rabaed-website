/**
 * How a launch article's body is written (ticket 38).
 *
 * An article's body is written here as blocks — a heading, a paragraph, a
 * list, a quotation — rather than as Lexical's own tree, so that the words in
 * `articles.ts` stay readable beside the words an Editor would type. What the
 * editor allows is fixed by `editorialEditor` in `src/cms/editorial-fields.ts`:
 * headings at the second and third level, bold, links, lists and quotations,
 * and nothing else. Anything written in these shapes, that editor can edit.
 *
 * How the blocks became Lexical's tree is no longer written out here: the
 * import built it through Payload, and the rows that made are frozen in
 * `seed.ts` beside this (ticket 68), which is what every database gets.
 */

/** A run of text inside a line: plain words, a bold phrase, or a link. A link to a page of this site is written as its path, `/start`. */
export type Inline = string | { readonly strong: string } | { readonly link: string; readonly href: string };

/** One paragraph's, heading's or list item's worth of text. */
export type Line = readonly Inline[];

export type Block =
  /**
   * A section heading. The title is the page's first level, so an article's
   * own are the second — the editor offers a third, and no article needs one.
   */
  | { readonly kind: 'heading'; readonly text: Line }
  | { readonly kind: 'paragraph'; readonly text: Line }
  | { readonly kind: 'list'; readonly items: readonly Line[] }
  | { readonly kind: 'quote'; readonly text: Line };
