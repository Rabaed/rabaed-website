/**
 * A link as page content: the words on it and where it goes. A page of this
 * site arrives already given its locale (`localePath`), and a place on the
 * same page as its `#id`, so a section draws the address it is handed.
 */
export type PageLink = {
  readonly label: string;
  readonly href: string;
};

/**
 * A button that leaves the site — the Company profile's, whose links an Editor
 * sets (tickets 102, 106) — opens in a new tab, as the footer's WhatsApp link
 * does, so the page it was pressed on stays open. The home page's buttons stay
 * on the page, and are drawn as they always were.
 */
export function newTabIfAway(href: string): { target?: '_blank'; rel?: 'noopener' } {
  return /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener' } : {};
}
