import type { ProfileImpactContent } from '@/content/pages/profile-close';
import { CountUp } from './count-up';
import { Glyph } from './glyph';
import { SectionEyebrow } from './section-eyebrow';

/** Each figure's icon, by its place, as Ahmed gives them. */
const ICONS = ['clipboard.svg', 'folder-search.svg', 'history.svg', 'cycle.svg', 'gears.svg', 'classroom.svg'];

/**
 * Section 12 of the Company profile, the impact (`#impact`, ticket 109):
 * Ahmed's six figures, three to a row, each over what it measures, then the
 * line on going live and where the figures come from. Each counts up as the
 * visitor reaches it (`CountUp`, ticket 105's), from the value the server
 * already wrote; with reduced motion it stands at its value. A dark section.
 */
export function Impact({ content }: { content: ProfileImpactContent }) {
  return (
    <section id="impact" className="pad pf-impact">
      <div className="wrap">
        <SectionEyebrow number="12" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <p className="lead">{content.lead}</p>
        <ul className="pf-metrics">
          {content.figures.map(({ figure, unit, label }, index) => (
            <li key={index}>
              <Glyph file={ICONS[index]!} className="pf-metric-mark" />
              <div className="pf-metric">
                <b aria-hidden="true">
                  <span data-count-up="">{figure}</span>
                </b>
                {unit && (
                  <span className="pf-unit" aria-hidden="true">
                    {unit}
                  </span>
                )}
                <span className="vh">{unit ? `${figure} ${unit}` : figure}</span>
              </div>
              <p>{label}</p>
            </li>
          ))}
        </ul>
        <div className="pf-activation">
          <Glyph file="hurdle.svg" />
          <span>{content.activation}</span>
        </div>
        <small className="pf-impact-source">{content.source}</small>
      </div>
      <CountUp section="impact" />
    </section>
  );
}
