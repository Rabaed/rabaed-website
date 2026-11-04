import { newTabIfAway, type PageLink } from '@/components/page-link';
import { Glyph } from './glyph';

/**
 * The WhatsApp button that floats over the Company profile, and no other page
 * (ticket 109, spec: Buttons and links): at the bottom corner on the side
 * lines end on, as in Ahmed's design. An icon without words, so its name is
 * for screen readers.
 */
export function WhatsappButton({ link }: { link: PageLink }) {
  return (
    <a className="pf-wa" href={link.href} aria-label={link.label} {...newTabIfAway(link.href)}>
      <Glyph file="wa.png" />
    </a>
  );
}
