import { Inline, type InlineText } from '@/components/inline-text';
import { DownloadForm } from '@/components/tool/download-form';
import type { FormPageWording } from '@/forms/definition';
import type { ToolDownloadField } from '@/forms/tool-download';
import { TickList } from '@/components/tool/parts';

export type ToolDownloadContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  /** What the visitor gets. */
  readonly ticks: readonly InlineText[];
  /** The line under them, its figure in bold. */
  readonly promise: InlineText;
};

/**
 * «حمّل الأداة الآن»: what the visitor gets, beside the form that gets it.
 *
 * The form keeps its own words (ticket 27).
 */
export function Download({ content, form }: { content: ToolDownloadContent; form: FormPageWording<ToolDownloadField> }) {
  return (
    <section id="get" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tl-get">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '32px', lineHeight: 1.35, margin: 0 }}>{content.heading}</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              {content.lead}
            </p>
            <TickList lines={content.ticks} />
            <div className="guar" style={{ marginTop: '18px' }}>
              <Inline text={content.promise} />
            </div>
          </div>

          <DownloadForm wording={form} />
        </div>
      </div>
    </section>
  );
}
