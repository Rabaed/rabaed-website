import { DemoRequestForm } from '@/components/demo-request-form';
import type { PageLink } from '@/components/page-link';

export type ClosingStep = {
  /** «01 · إعداد». */
  readonly label: string;
  readonly text: string;
};

export type ClosingSectionContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly steps: readonly ClosingStep[];
  /** The link on to the start page's fuller steps and questions. */
  readonly more: PageLink;
};

/**
 * «كيف نبدأ معك» — the block the home and product pages end on: the three
 * steps to going live beside the demo request form.
 *
 * Ticket 04 built the steps inside the home page; ticket 11 added the form
 * beside them, which fills the column that had stood empty (bug 44), and moved
 * the block here so the product page can end on the same one. The start page
 * has no such block — its form stands beside its questions instead.
 *
 * The form's own wording is ticket 27's to move, and stays in the form.
 */
export function ClosingSection({ content }: { content: ClosingSectionContent }) {
  return (
    <section id="tail" className="light pad">
      <div className="wrap tail-grid">
        <div>
          <div className="eyebrow">{content.eyebrow}</div>
          <h2 style={{ fontSize: '29px', lineHeight: 1.4 }}>{content.heading}</h2>
          <ul className="tail-steps">
            {content.steps.map((step) => (
              <li key={step.label}>
                <b>{step.label}</b>
                <span>{step.text}</span>
              </li>
            ))}
          </ul>
          <a className="tail-more" href={content.more.href}>
            {content.more.label}
          </a>
        </div>

        <DemoRequestForm />
      </div>
    </section>
  );
}
