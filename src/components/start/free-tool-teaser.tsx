import type { PageLink } from '@/components/page-link';

export type StartFreeToolTeaserContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly text: string;
  readonly link: PageLink;
};

/**
 * The Pour Tracker, offered free, under the start page's questions. The
 * Reference site's button goes nowhere (`href="#"`); here it leads to the tool
 * page, which describes the tool and delivers it (CONTEXT.md).
 */
export function FreeToolTeaser({ content }: { content: StartFreeToolTeaserContent }) {
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
