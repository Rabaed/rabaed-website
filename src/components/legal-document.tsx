import type { Metadata } from 'next';
import { Fragment } from 'react';
import { PageShell } from '@/components/page-shell';
import { clauseId, type Block, type LegalDocument, type Line } from '@/content/legal/document';
import { localePath } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

/** The Gregorian months, as the approved documents write them. */
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

/** A legal document's title and description, and its one address: it exists in Arabic alone. */
export function legalMetadata(document: LegalDocument): Metadata {
  return pageMetadata({
    locale: 'ar',
    locales: ['ar'],
    path: document.path,
    title: document.metaTitle,
    description: document.description,
  });
}

/**
 * A legal document as a page: the compact hero, then the document on the pale
 * ground — when it last changed, its introduction, a contents list, the
 * numbered clauses, and a line pointing on to the other documents.
 *
 * One component for all three documents, because on the Reference site they
 * are one page three times over, and because ticket 25 hands this whatever
 * version of a document the CMS has published.
 *
 * A server component with no behaviour: every word is in the first response,
 * the contents list is plain links to the clauses, and the header's colour
 * change over the pale document is the site-wide one (`nav-behaviour.tsx`).
 *
 * Arabic only. The legal documents are not translated — the Arabic is binding
 * (spec: Out of Scope) — so there is no locale to pass.
 */
export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <PageShell locale="ar" path={document.path}>
      <section className="phero dark">
        <div className="pglow" />
        <div className="wrap">
          <div className="eyebrow">المستندات النظامية</div>
          <h1>{document.title}</h1>
          <p className="lead">{document.lead}</p>
        </div>
      </section>

      <section className="legal">
        <div className="wrap">
          {/* Only the numerals are `.mono`: DM Mono has no Arabic glyphs
              (spec: Design system). The Reference site sets the whole line in it. */}
          <span className="updated">
            آخر تحديث: <span className="mono">{document.updated.day}</span> {MONTHS[document.updated.month - 1]}{' '}
            <span className="mono">{document.updated.year}</span>
          </span>

          <div className="intro">
            {document.intro.map((line, index) => (
              <p key={index}>
                <Runs line={line} />
              </p>
            ))}
          </div>

          <div className="toc">
            {document.clauses.map((clause, index) =>
              clause.inContents ? (
                <a key={index} href={`#${clauseId(document, index)}`}>
                  {clause.heading}
                </a>
              ) : null,
            )}
          </div>

          {document.clauses.map((clause, index) => (
            <Fragment key={index}>
              <h2 id={clauseId(document, index)}>{`${index + 1}. ${clause.heading}`}</h2>
              {clause.blocks.map((block, position) => (
                <ClauseBlock key={position} block={block} />
              ))}
            </Fragment>
          ))}

          <div className="xref">
            <Runs line={document.seeAlso} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ClauseBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case 'paragraph':
      return (
        <p>
          <Runs line={block.text} />
        </p>
      );
    case 'list':
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <Runs line={item} />
            </li>
          ))}
        </ul>
      );
    case 'contact':
      return (
        <div className="contact-box">
          {block.lines.map((line, index) => (
            <p key={index}>
              <Runs line={line} />
            </p>
          ))}
        </div>
      );
  }
}

/** The runs of text in one line — plain words, bold phrases and links — with a link to this site given its locale. */
function Runs({ line }: { line: Line }) {
  return line.map((piece, index) => {
    if (typeof piece === 'string') return <Fragment key={index}>{piece}</Fragment>;
    if ('strong' in piece) return <b key={index}>{piece.strong}</b>;
    // A page of this site is written as its path, and given the locale here.
    const href = piece.href.startsWith('/') ? localePath('ar', piece.href) : piece.href;
    return (
      <a key={index} href={href} dir={piece.dir}>
        {piece.link}
      </a>
    );
  });
}
