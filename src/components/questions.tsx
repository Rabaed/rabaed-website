import type { ReactNode } from 'react';
import { Faq, FaqEntries, type FaqEntry } from '@/components/faq';
import type { PageLink } from '@/components/page-link';

export type QuestionsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  /** The page's questions, as published in the CMS (`src/cms/faqs.ts`). */
  readonly entries: readonly FaqEntry[];
  /** A link on to more questions, under the cards: the home page's, to the start page's full list. */
  readonly more?: PageLink;
};

/**
 * «الأسئلة الشائعة» — the questions on every page that has them: the home,
 * start, tool, referral and partnership pages (ticket 22).
 *
 * Two layouts, the two the Reference site uses. On its own, the questions sit
 * in a row of cards under the heading. With something `beside` them — the
 * start page's demo request form — they stack in a column next to it, under a
 * larger heading.
 *
 * A section of cards with no questions left to show is left out, rather than a
 * heading over nothing. The start page's is not: its hero and the home page
 * link to it, and its form stands in it whatever the questions.
 */
export function Questions({
  id,
  content,
  ruled = true,
  beside,
  children,
}: {
  /** The id links land on (`src/cms/faq-pages.ts`). */
  id: string;
  content: QuestionsContent;
  /** A rule across the top. The home page's section has none, as on the Reference site. */
  ruled?: boolean;
  /** Stood beside the questions, which then stack in a column. */
  beside?: ReactNode;
  /** Under the questions, full width: the start page's free tool teaser. */
  children?: ReactNode;
}) {
  if (beside === undefined && content.entries.length === 0) return null;

  return (
    <section id={id} className="light pad" style={ruled ? { borderTop: '1px solid var(--line)' } : undefined}>
      <div className="wrap">
        {beside === undefined ? (
          <>
            <div className="tz-head">
              <div className="eyebrow">{content.eyebrow}</div>
              <h2>{content.heading}</h2>
            </div>

            <Faq entries={content.entries} />

            {content.more === undefined ? null : (
              <div className="tz-foot">
                <a className="tz-more" href={content.more.href}>
                  <span>{content.more.label}</span>
                  <span className="ar">←</span>
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="faq-grid">
            <div>
              <div className="eyebrow">{content.eyebrow}</div>
              <h2 style={{ fontSize: '32px' }}>{content.heading}</h2>
              <div style={{ marginTop: '20px' }}>
                <FaqEntries entries={content.entries} />
              </div>
            </div>

            {beside}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
