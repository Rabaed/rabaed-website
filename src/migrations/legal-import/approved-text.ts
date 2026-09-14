/**
 * The approved text of the three legal documents as the site carried it
 * before the CMS (ticket 17), and how it becomes their first version in the
 * CMS (ticket 25, ADR-0003).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads these files: the legal documents are edited, versioned and published
 * in the CMS. Changing a word here changes nothing anyone sees.
 *
 * **The words are the approved text, verbatim** — including the three
 * misspellings of the name in the Terms. Nothing here is copy to be tidied.
 */

/** A run of text inside a line: plain words, a bold phrase, or a link. A link to a page of this site is written as its path, `/privacy`. */
export type Inline =
  | string
  | { readonly strong: string }
  | { readonly link: string; readonly href: string; readonly dir?: 'ltr' };

/** One paragraph's or one list item's worth of text. */
export type Line = readonly Inline[];

export type Block =
  | { readonly kind: 'paragraph'; readonly text: Line }
  | { readonly kind: 'list'; readonly items: readonly Line[] }
  /** The box of contact details, always the last block of its clause. */
  | { readonly kind: 'contact'; readonly lines: readonly Line[] };

/** A numbered clause. Its number is its place in the document, so it is not written here. */
export type Clause = {
  readonly heading: string;
  /** Whether the contents list at the top names it. The Referral Terms leave out their last clause, the contact details. */
  readonly inContents: boolean;
  readonly blocks: readonly Block[];
};

export type ApprovedDocument = {
  /** The browser tab's title and the search result's. */
  readonly metaTitle: string;
  readonly description: string;
  /** The page's heading, and the line under it. */
  readonly title: string;
  readonly lead: string;
  readonly intro: readonly Line[];
  readonly clauses: readonly Clause[];
  /** The line at the foot pointing on to the other documents. */
  readonly seeAlso: Line;
};

/*
 * The CMS keeps legal text as the rich text of its editor, Lexical: a tree of
 * paragraphs, lists, text and links, written out below as the editor itself
 * saves them.
 */

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
    type: 'link',
    version: 3,
    direction: 'rtl' as const,
    format: '' as const,
    indent: 0,
    fields: { linkType: 'custom', url: piece.href, newTab: false, ltr: piece.dir === 'ltr' },
    children: [text(piece.link)],
  };
};

const paragraph = (line: Line) => ({
  type: 'paragraph',
  version: 1,
  direction: 'rtl' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  children: line.map(inline),
});

const list = (items: readonly Line[]) => ({
  type: 'list',
  version: 1,
  direction: 'rtl' as const,
  format: '' as const,
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, index) => ({
    type: 'listitem',
    version: 1,
    direction: 'rtl' as const,
    format: '' as const,
    indent: 0,
    value: index + 1,
    children: item.map(inline),
  })),
});

type Node = ReturnType<typeof paragraph> | ReturnType<typeof list>;

const richText = (children: Node[]) => ({
  root: { type: 'root', version: 1, direction: 'rtl' as const, format: '' as const, indent: 0, children },
});

/** A legal document's fields in the CMS, holding exactly the approved text. */
export function toLegalDocumentFields(document: ApprovedDocument) {
  return {
    metaTitle: document.metaTitle,
    description: document.description,
    title: document.title,
    lead: document.lead,
    intro: richText(document.intro.map(paragraph)),
    clauses: document.clauses.map((clause) => {
      const body: Node[] = [];
      let contact: ReturnType<typeof richText> | null = null;
      for (const block of clause.blocks) {
        if (contact) throw new Error(`«${clause.heading}»: the contact box must be the last block of its clause.`);
        if (block.kind === 'paragraph') body.push(paragraph(block.text));
        else if (block.kind === 'list') body.push(list(block.items));
        else contact = richText(block.lines.map(paragraph));
      }
      return {
        heading: clause.heading,
        inContents: clause.inContents,
        body: body.length > 0 ? richText(body) : null,
        contact,
      };
    }),
    seeAlso: richText([paragraph(document.seeAlso)]),
  };
}
