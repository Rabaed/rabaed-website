import type { ProfilePlansContent } from '@/content/pages/profile-close';
import { Glyph } from './glyph';
import { SectionEyebrow } from './section-eyebrow';

/** Each plan's icon, by its place: basic, growth, professional. */
const ICONS = ['plan-basic.svg', 'plan-growth.svg', 'plan-pro.svg'];

/** The plan that stands out and carries the badge: the middle one, as Ahmed has it. */
const FEATURED = 1;

/**
 * Section 13 of the Company profile, the plans (`#plans`, ticket 109):
 * Ahmed's three plans and their features, the middle one raised with the
 * badge on it. Without prices (spec: Out of Scope). A light section.
 */
export function Plans({ content }: { content: ProfilePlansContent }) {
  return (
    <section id="plans" className="pad light pf-plans">
      <div className="wrap">
        <SectionEyebrow number="13" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <ul className="pf-plan-list">
          {content.tiers.map(({ kicker, name, features }, index) => (
            <li key={index} className={index === FEATURED ? 'pf-plan featured' : 'pf-plan'}>
              {index === FEATURED && <span className="pf-badge">{content.badge}</span>}
              <div className="pf-plan-head">
                <div>
                  <span className="pf-kicker-line">{kicker}</span>
                  <h3>{name}</h3>
                </div>
                <Glyph file={ICONS[index]!} className="pf-plan-mark" />
              </div>
              <ul>
                {features.map((feature, place) => (
                  <li key={place}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
