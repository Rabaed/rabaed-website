import { DemoRequestForm } from '@/components/demo-request-form';
import { FaqEntries, type FaqEntry } from '@/components/faq';
import type { PageLink } from '@/components/page-link';
import type { FormPageWording } from '@/forms/definition';
import type { DemoRequestField } from '@/forms/demo-request';

export type StartFreeToolTeaserContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly text: string;
  readonly link: PageLink;
};

export type StartQuestionsContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly entries: readonly FaqEntry[];
  readonly freeTool: StartFreeToolTeaserContent;
};

/**
 * «قبل أن تسأل» on the start page: every question, with the demo request form
 * beside them, and under both the free tool teaser.
 *
 * This is where the home page's «كل الأسئلة» link lands (`#faq`), and the
 * hero's «الأسئلة الشائعة ↓». The form is the one form the home and product
 * pages carry too, with its words from the CMS (ticket 27).
 */
export function Questions({ content, form }: { content: StartQuestionsContent; form: FormPageWording<DemoRequestField> }) {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="faq-grid">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '32px' }}>{content.heading}</h2>
            <div style={{ marginTop: '20px' }}>
              <FaqEntries entries={content.entries} />
            </div>
          </div>

          <DemoRequestForm wording={form} />
        </div>

        <FreeToolTeaser content={content.freeTool} />
      </div>
    </section>
  );
}

/**
 * The Pour Tracker, offered free. The Reference site's button goes nowhere
 * (`href="#"`); here it leads to the tool page, which describes the tool and
 * delivers it (CONTEXT.md).
 */
function FreeToolTeaser({ content }: { content: StartFreeToolTeaserContent }) {
  return (
    <div className="free">
      <div>
        <div className="eyebrow" style={{ marginBottom: '6px' }}>
          {content.eyebrow}
        </div>
        <h3>{content.heading}</h3>
        <p>{content.text}</p>
      </div>
      <a className="btn o" href={content.link.href}>
        {content.link.label}
      </a>
    </div>
  );
}
