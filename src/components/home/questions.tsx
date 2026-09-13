import { Faq, type FaqEntry } from '@/components/faq';
import type { HeroLink } from '@/components/page-hero';

export type HomeQuestionsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly entries: readonly FaqEntry[];
  /** The link on to every question, on the start page. */
  readonly more: HeroLink;
};

/**
 * «قبل أن تسأل» — three questions a visitor asks before booking a demo, and a
 * link to the rest of them on the start page.
 */
export function Questions({ content }: { content: HomeQuestionsContent }) {
  return (
    <section id="fq" className="light pad">
      <div className="wrap">
        <div className="tz-head">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2>{content.heading}</h2>
          </div>
        </div>

        <Faq entries={content.entries} />

        <div className="tz-foot">
          <a className="tz-more" href={content.more.href}>
            <span>{content.more.label}</span>
            <span className="ar">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
