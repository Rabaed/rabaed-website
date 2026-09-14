/**
 * A link as page content: the words on it and where it goes. A page of this
 * site arrives already given its locale (`localePath`), and a place on the
 * same page as its `#id`, so a section draws the address it is handed.
 */
export type PageLink = {
  readonly label: string;
  readonly href: string;
};
