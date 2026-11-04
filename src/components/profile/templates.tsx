import type { ProfileTemplatesContent } from '@/content/pages/profile-close';
import { FlipCard } from './flip-card';
import { SectionEyebrow } from './section-eyebrow';

/**
 * Section 10 of the Company profile, the pre-made templates (`#templates`,
 * ticket 109): Ahmed's form cards, each turned over by a click or a key to
 * show what the form is for. A dark section, as Ahmed has it.
 */
export function Templates({ content }: { content: ProfileTemplatesContent }) {
  return (
    <section id="templates" className="pad pf-templates">
      <div className="wrap">
        <SectionEyebrow number="10" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <p className="lead">{content.lead}</p>
        <p className="pf-hint">{content.hint}</p>
        <ul className="pf-cards">
          {content.cards.map((card, index) => (
            <li key={index}>
              <FlipCard {...card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
