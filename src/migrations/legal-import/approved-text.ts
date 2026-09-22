/**
 * The shape the approved text of the three legal documents is written in, as
 * the site carried it before the CMS (ticket 17) and as it became their first
 * version in the CMS (ticket 25, ADR-0003).
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site no longer
 * reads these files: the legal documents are edited, versioned and published
 * in the CMS. Changing a word here changes nothing anyone sees.
 *
 * **The words are the approved text, verbatim** — including the three
 * misspellings of the name in the Terms. Nothing here is copy to be tidied.
 *
 * How the words became the rich text the CMS stores is no longer written out
 * here: the import built it through Payload, and the rows that made are frozen
 * in `seed.ts` beside this (ticket 68), which is what every database gets.
 */

/** What the first versions record as their author: no Editor made them. */
export const IMPORTED_BY = 'استيراد النص المعتمد قبل الإطلاق';

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
