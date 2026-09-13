/**
 * The shape of a legal document on the site: the Terms, the Privacy Policy and
 * the Referral Program Terms (ticket 17).
 *
 * **Data, not markup, on purpose.** Ticket 25 moves these documents into the
 * CMS, where every published version is kept with its date and author
 * (ADR-0003). A document written as a page component would have to be
 * unpicked into fields first; written as this, it is already the record the
 * CMS will hold, and `LegalDocumentPage` is what draws any version of it.
 *
 * **The words are the approved text, verbatim** — including the three
 * misspellings of the name in the Terms, which stay until the approved text
 * itself changes. Nothing here is copy to be tidied.
 */

/**
 * A run of text inside a line: plain words, a bold phrase, or a link. A link
 * to a page of this site is written as its path, `/privacy`, and is given its
 * locale where it is drawn.
 */
export type Inline =
  | string
  | { readonly strong: string }
  | { readonly link: string; readonly href: string; readonly dir?: 'ltr' };

/** One paragraph's or one list item's worth of text. */
export type Line = readonly Inline[];

export type Block =
  | { readonly kind: 'paragraph'; readonly text: Line }
  | { readonly kind: 'list'; readonly items: readonly Line[] }
  /** The box of contact details that closes a document. */
  | { readonly kind: 'contact'; readonly lines: readonly Line[] };

/** A numbered clause. Its number is its place in the document, so it is not written here. */
export type Clause = {
  readonly heading: string;
  /** Whether the contents list at the top names it. The Referral Terms leave out their last clause, the contact details. */
  readonly inContents: boolean;
  readonly blocks: readonly Block[];
};

export type LegalDocument = {
  /** The page's path in the Arabic locale. */
  readonly path: string;
  /** The browser tab's title and the search result's. */
  readonly metaTitle: string;
  readonly description: string;
  /** The page's heading, and the line under it. */
  readonly title: string;
  readonly lead: string;
  /** When the published text last changed. From ticket 25, the published version's date. */
  readonly updated: { readonly year: number; readonly month: number; readonly day: number };
  readonly intro: readonly Line[];
  /** Each clause is linked to as this and its number: `s3`, `r3`. The contents list and anything outside that points at a clause rely on it. */
  readonly clauseIdPrefix: string;
  readonly clauses: readonly Clause[];
  /** The line at the foot pointing on to the other documents. */
  readonly seeAlso: Line;
};

/** The id a clause is linked to by, from its place in the document. */
export function clauseId(document: LegalDocument, index: number): string {
  return `${document.clauseIdPrefix}${index + 1}`;
}
