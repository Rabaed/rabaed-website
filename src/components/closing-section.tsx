import { DemoRequestForm } from '@/components/demo-request-form';
import { Inline, numeralsInMono } from '@/components/inline-text';
import type { PageLink } from '@/components/page-link';
import type { FormPageWording } from '@/forms/definition';
import type { DemoRequestField } from '@/forms/demo-request';

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
 * The form's words are its settings in the CMS (ticket 27), handed down beside
 * the section's own.
 */
export function ClosingSection({
  content,
  form,
}: {
  content: ClosingSectionContent;
  form: FormPageWording<DemoRequestField>;
}) {
  return (
    <section id="tail" className="light pad">
      {/* `#contact` is where the downloaded Pour Tracker sends someone who
          asks for the cloud version (ticket 49): the steps and the form. */}
      <div id="contact" className="wrap tail-grid">
        <div>
          <div className="eyebrow">{content.eyebrow}</div>
          <h2 style={{ fontSize: '29px', lineHeight: 1.4 }}>{content.heading}</h2>
          <ul className="tail-steps">
            {content.steps.map((step, index) => (
              <li key={index}>
                {/* The Arabic in the label face and the numeral in DM Mono,
                    as on the step cards (ADR-0018). */}
                <b>
                  <Inline text={numeralsInMono(step.label)} />
                </b>
                <span>{step.text}</span>
              </li>
            ))}
          </ul>
          <a className="tail-more" href={content.more.href}>
            {content.more.label}
          </a>
        </div>

        <DemoRequestForm wording={form} />
      </div>
    </section>
  );
}
