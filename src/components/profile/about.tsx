import { SectionEyebrow } from './section-eyebrow';

export type ProfileAboutContent = {
  readonly eyebrow: string;
  /** The heading's first line, and the line in colour under it. */
  readonly title: { readonly line: string; readonly accent: string };
  readonly body: string;
  readonly quote: string;
};

/**
 * Section 04 of the Company profile, "Who we are" (`#about`, ticket 105):
 * Ahmed's two-line heading, the second line in the accent, his paragraph, and
 * the quote that closes it under a large quotation mark. A dark section.
 */
export function About({ content }: { content: ProfileAboutContent }) {
  return (
    <section id="about" className="pad pf-about">
      <div className="wrap">
        <SectionEyebrow number="04" words={content.eyebrow} />
        <h2>
          {content.title.line}
          <br />
          <span>{content.title.accent}</span>
        </h2>
        <p className="lead">{content.body}</p>
        <blockquote>
          <i className="pf-icon pf-icon-quote" aria-hidden="true" />
          <p>{content.quote}</p>
        </blockquote>
      </div>
    </section>
  );
}
