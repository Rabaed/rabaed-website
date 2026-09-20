import { TrustStripMarquee } from '@/components/home/trust-strip-marquee';

export type TrustStripLogo = {
  /** Its place in the list, which is what tells two marks of one group apart. */
  readonly key: string;
  /** The company's name, which is the image's `alt` and its text fallback. */
  readonly name: string;
  /** Drawn height in CSS pixels. */
  readonly height: number;
  /** Where the file is, as the CMS serves it. */
  readonly source: string;
  /** Intrinsic size of the file, for the aspect ratio — a vector has none. */
  readonly intrinsic: { readonly width: number; readonly height: number } | null;
  /** The company's own site, where an Editor has given one. */
  readonly href: string | null;
};

export type TrustStripContent = {
  /** The line printed beside the marks, which a visitor reads. */
  readonly caption: string;
  /** The section's own name, which only a screen reader announces. */
  readonly sectionName: string;
  readonly logos: readonly TrustStripLogo[];
};

/**
 * The Trust strip: a bar of the marks of companies already working on Rabaed,
 * travelling slowly past the label that names them (CONTEXT.md).
 *
 * A server component. Every mark and every company name is in the first
 * response; `TrustStripMarquee` sets the rail moving and swaps a mark that
 * fails to load for the company's name in text.
 *
 * **It moves, where the Reference site's does not.** The Reference site lets
 * eight logos wrap onto as many lines as they need. The spec asks for a strip
 * that travels and pauses under the pointer, and the reason is the list's
 * future rather than its present: this is CMS content from ticket 20 onward,
 * and a bar that grows a row taller with every client signed is a bar that
 * eventually pushes the page around. A rail of fixed height does not.
 *
 * **The row is rendered twice.** A marquee that loops without a seam needs the
 * end of the list to be followed by its own beginning, so the second copy is
 * exactly that — the same marks again, hidden from assistive technology, which
 * would otherwise read the client list out twice.
 */
export function TrustStrip({ content }: { content: TrustStripContent }) {
  return (
    <section className="logos dark" aria-label={content.sectionName}>
      <div className="wrap">
        <span className="lbl">{content.caption}</span>
        <div className="logos-rail">
          <div className="logos-track">
            <LogoRow logos={content.logos} />
            <LogoRow logos={content.logos} copy />
          </div>
        </div>
      </div>
      <TrustStripMarquee />
    </section>
  );
}

/**
 * One mark. A company that gave its address is a link; one that did not is a
 * picture, as every mark was before ticket 20. The copy row's links are out of
 * the tab order as well as hidden from assistive technology: the same eight
 * companies are already reachable a row above.
 */
function Slot({ logo, copy }: { logo: TrustStripLogo; copy: boolean }) {
  const mark = (
    <>
      {/* The name is the `alt`, so a browser that cannot fetch the file still
          says whose mark is missing — and the `<b>` beside it is the same
          name, drawn the way the strip draws text, for when a mark fails after
          the page has already been laid out. */}
      <img
        src={logo.source}
        alt={copy ? '' : logo.name}
        width={logo.intrinsic?.width}
        height={logo.intrinsic?.height}
        style={{ height: `${logo.height}px` }}
      />
      <b hidden>{logo.name}</b>
    </>
  );

  return (
    <span className="slot">
      {logo.href ? (
        <a href={logo.href} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined}>
          {mark}
        </a>
      ) : (
        mark
      )}
    </span>
  );
}

function LogoRow({ logos, copy = false }: { logos: readonly TrustStripLogo[]; copy?: boolean }) {
  return (
    <div className={copy ? 'logos-row copy' : 'logos-row'} aria-hidden={copy || undefined}>
      {logos.map((logo) => (
        <Slot key={logo.key} logo={logo} copy={copy} />
      ))}
    </div>
  );
}
