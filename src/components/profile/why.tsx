import type { ProfileWhyContent } from '@/content/pages/profile-close';
import { Glyph } from './glyph';
import { Place } from './place';
import { SectionEyebrow } from './section-eyebrow';

/** Each card's icon, by its place: the Arabic interface, onsite support, the price. */
const ICONS = ['ui.svg', 'worker.svg', 'coins.svg'];

/**
 * Section 11 of the Company profile, why Rabaed (`#why`, ticket 109): Ahmed's
 * three cards, each with its icon and its number. A light section.
 */
export function Why({ content }: { content: ProfileWhyContent }) {
  return (
    <section id="why" className="pad light pf-why">
      <div className="wrap">
        <SectionEyebrow number="11" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <ul className="pf-reasons">
          {content.reasons.map(({ name, text }, index) => (
            <li key={index}>
              <Glyph file={ICONS[index]!} className="pf-reason-mark" />
              <Place index={index} />
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
