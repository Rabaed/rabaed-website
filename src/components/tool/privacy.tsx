import type { InlineText } from '@/components/inline-text';
import { TickList } from '@/components/tool/parts';

/** A line of the folder tree: a file or folder the tool writes. */
export type TreeEntry = {
  /** Latin, so it is set left to right. */
  readonly name: string;
  /** What it holds, beside it; the attachments inside the folder go without. */
  readonly description?: string;
  /** Inside the folder above it, and indented under it. */
  readonly nested: boolean;
};

export type ToolPrivacyContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly points: readonly InlineText[];
  /** The folder the tool writes, drawn as a tree under the project's name. */
  readonly tree: {
    readonly project: string;
    readonly entries: readonly TreeEntry[];
    readonly caption: string;
  };
};

/**
 * «الخصوصية»: why the visitor's files never leave their computer, beside the
 * folder the tool writes, drawn as a tree. File names are Latin, so each is set
 * left to right.
 */
export function Privacy({ content }: { content: ToolPrivacyContent }) {
  return (
    <section id="data" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tl-2">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 style={{ fontSize: '28px', lineHeight: 1.4, margin: 0 }}>{content.heading}</h2>
            <TickList lines={content.points} />
          </div>
          <div>
            <div className="tl-tree">
              <div className="rt">
                <span className="fo" />
                {content.tree.project}
              </div>
              {content.tree.entries.map((entry, index) => (
                <div key={index} className={entry.nested ? 'ln sub' : 'ln'}>
                  <span className="fn mono" dir="ltr">
                    {entry.name}
                  </span>
                  {entry.description === undefined ? null : <span className="ds">{entry.description}</span>}
                </div>
              ))}
            </div>
            <p className="tl-cap">{content.tree.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
