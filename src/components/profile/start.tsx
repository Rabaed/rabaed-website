import { newTabIfAway } from '@/components/page-link';
import type { ProfileStartContent } from '@/content/pages/profile-close';
import { Glyph } from './glyph';
import { Place } from './place';
import { SectionEyebrow } from './section-eyebrow';

/** Each step's icon, by its place: set up, go live, the guarantee. */
const ICONS = ['gears.svg', 'chart.png', 'shield.png'];

/**
 * Section 14 of the Company profile, how we start (`#start`, ticket 109):
 * Ahmed's three steps, then his closing card, a dark one on the light ground,
 * with "Book a live demo" and "WhatsApp us". Each button's words and link are
 * an Editor's; one that leaves the site opens in a new tab.
 */
export function Start({ content }: { content: ProfileStartContent }) {
  const { card } = content;
  return (
    <section id="start" className="pad light pf-start">
      <div className="wrap">
        <SectionEyebrow number="14" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <ol className="pf-steps">
          {content.steps.map(({ name, text }, index) => (
            <li key={index}>
              <Glyph file={ICONS[index]!} className="pf-step-mark" />
              <Place index={index} />
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="pf-cta">
          <div>
            <h3>{card.title}</h3>
            <p>{card.line}</p>
          </div>
          <div className="ctas">
            <a className="btn p" href={card.demo.href} {...newTabIfAway(card.demo.href)}>
              {card.demo.label}
            </a>
            <a className="btn g" href={card.whatsapp.href} {...newTabIfAway(card.whatsapp.href)}>
              <Glyph file="wa.png" className="pf-btn-mark" />
              {card.whatsapp.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
