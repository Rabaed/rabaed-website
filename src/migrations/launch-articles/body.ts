/**
 * How a launch article's body is written, and how it becomes the rich text
 * the CMS stores (ticket 38).
 *
 * An article's body is written here as blocks — a heading, a paragraph, a
 * list, a quotation — rather than as Lexical's own tree, so that the words in
 * `articles.ts` stay readable beside the words an Editor would type. What the
 * editor allows is fixed by `editorialEditor` in `src/cms/editorial-fields.ts`:
 * headings at the second and third level, bold, links, lists and quotations,
 * and nothing else. Anything this file can build, that editor can edit.
 *
 * `src/migrations/legal-import/approved-text.ts` writes Lexical too, and is
 * deliberately not shared with: it is frozen data for a migration that has
 * already run everywhere, it builds nodes this one does not (its contact box,
 * its left-to-right links) and lacks the two this one needs (headings and
 * quotations). One copy reading straight is worth more here than one shared
 * builder answering to both.
 */

/** A run of text inside a line: plain words, a bold phrase, or a link. A link to a page of this site is written as its path, `/start`. */
export type Inline = string | { readonly strong: string } | { readonly link: string; readonly href: string };

/** One paragraph's, heading's or list item's worth of text. */
export type Line = readonly Inline[];

export type Block =
  /** A section heading. The title is the page's first level, so an article's own start at the second. */
  | { readonly kind: 'heading'; readonly level: 2 | 3; readonly text: Line }
  | { readonly kind: 'paragraph'; readonly text: Line }
  | { readonly kind: 'list'; readonly items: readonly Line[] }
  | { readonly kind: 'quote'; readonly text: Line };

const RTL = { direction: 'rtl' as const, format: '' as const, indent: 0, version: 1 };

const text = (words: string, bold = false) => ({
  type: 'text',
  version: 1,
  detail: 0,
  // Lexical's formatting bit field; 1 is bold.
  format: bold ? 1 : 0,
  mode: 'normal',
  style: '',
  text: words,
});

const inline = (piece: Inline) => {
  if (typeof piece === 'string') return text(piece);
  if ('strong' in piece) return text(piece.strong, true);
  return {
    ...RTL,
    type: 'link',
    version: 3,
    fields: { linkType: 'custom', url: piece.href, newTab: false },
    children: [text(piece.link)],
  };
};

const paragraph = (line: Line) => ({ ...RTL, type: 'paragraph', textFormat: 0, textStyle: '', children: line.map(inline) });

const heading = (level: 2 | 3, line: Line) => ({ ...RTL, type: 'heading', tag: `h${level}`, children: line.map(inline) });

const quote = (line: Line) => ({ ...RTL, type: 'quote', children: line.map(inline) });

const list = (items: readonly Line[]) => ({
  ...RTL,
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, index) => ({ ...RTL, type: 'listitem', value: index + 1, children: item.map(inline) })),
});

function node(block: Block) {
  switch (block.kind) {
    case 'heading':
      return heading(block.level, block.text);
    case 'paragraph':
      return paragraph(block.text);
    case 'list':
      return list(block.items);
    case 'quote':
      return quote(block.text);
  }
}

/** An article's body as the rich text field holds it. */
export function toRichText(blocks: readonly Block[]) {
  return { root: { ...RTL, type: 'root', children: blocks.map(node) } };
}
