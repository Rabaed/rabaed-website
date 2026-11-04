import { CountUp } from './count-up';
import { SectionEyebrow } from './section-eyebrow';

export type ProfileFigure = {
  /** Latin, the same in either language: «35%». */
  readonly figure: string;
  readonly label: string;
};

export type ProfileNumbersContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly figures: readonly ProfileFigure[];
  /** Where the figures come from, under them: Rabaed's own project data (spec: Sections, in order). */
  readonly source: string;
};

/**
 * Section 02 of the Company profile, "The real site" (`#numbers`, ticket 105):
 * Ahmed's three figures, large in the accent, each over what it measures, and
 * one line under them saying where they come from. Each counts up as the
 * visitor reaches it (`CountUp`), from the value the server already wrote. A
 * dark section, on the second dark ground, as Ahmed has it.
 */
export function Numbers({ content }: { content: ProfileNumbersContent }) {
  return (
    <section id="numbers" className="pad pf-numbers">
      <div className="wrap">
        <SectionEyebrow number="02" words={content.eyebrow} />
        <h2>{content.title}</h2>
        <ul className="pf-figures">
          {content.figures.map(({ figure, label }, index) => (
            <li key={index}>
              <b>
                <span aria-hidden="true" data-count-up="">
                  {figure}
                </span>
                <span className="vh">{figure}</span>
              </b>
              <p>{label}</p>
            </li>
          ))}
        </ul>
        <p className="pf-source">{content.source}</p>
      </div>
      <CountUp section="numbers" />
    </section>
  );
}
