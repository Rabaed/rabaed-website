import type { Metadata } from 'next';
import { Fragment, type ReactNode } from 'react';
import { clauseId, LEGAL_PAGES } from '@/cms/legal-pages';
import { ArabicDate } from '@/components/arabic-date';
import { PageShell } from '@/components/page-shell';
import { breadcrumbData, StructuredData } from '@/components/structured-data';
import { riyadhDay } from '@/lib/dates';
import { localePath } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';
import type { LegalDocument } from '@/payload-types';

/** A legal document's title and description, and its one address: it exists in Arabic alone. */
export function legalMetadata(document: LegalDocument): Metadata {
  return pageMetadata({
    locale: 'ar',
    locales: ['ar'],
    path: LEGAL_PAGES[document.slug].path,
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
 * are one page three times over, and it draws whichever version of a document
 * the CMS hands it (ticket 25).
 *
 * A server component with no behaviour: every word is in the first response,
 * the contents list is plain links to the clauses, and the header's colour
 * change over the pale document is the site-wide one (`nav-behaviour.tsx`).
 *
 * Arabic only. The legal documents are not translated — the Arabic is binding
 * (spec: Out of Scope) — so there is no locale to pass.
 */
export async function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const page = LEGAL_PAGES[document.slug];

  return (
    <PageShell locale="ar" path={page.path}>
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
          {/* The date the shown version was published. Only the numerals are
              `.mono`: DM Mono has no Arabic glyphs (spec: Design system). The
              Reference site sets the whole line in it. */}
          <span className="updated">
            آخر تحديث: <ArabicDate date={riyadhDay(document.updatedAt)} />
          </span>

          <div className="intro">
            <Blocks text={document.intro} />
          </div>

          <div className="toc">
            {document.clauses.map((clause, index) =>
              clause.inContents ? (
                <a key={index} href={`#${clauseId(document.slug, index)}`}>
                  {clause.heading}
                </a>
              ) : null,
            )}
          </div>

          {document.clauses.map((clause, index) => (
            <Fragment key={index}>
              <h2 id={clauseId(document.slug, index)}>{`${index + 1}. ${clause.heading}`}</h2>
              <Blocks text={clause.body} />
              {hasWords(clause.contact) ? (
                <div className="contact-box">
                  <Blocks text={clause.contact} />
                </div>
              ) : null}
            </Fragment>
          ))}

          <div className="xref">
            {linesOf(document.seeAlso).map((line, index) => (
              <Fragment key={index}>
                {index > 0 ? <br /> : null}
                <Inlines nodes={line.children} />
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <StructuredData data={await breadcrumbData('ar', [{ name: page.label.ar, path: page.path }])} />
    </PageShell>
  );
}

/**
 * A node of the CMS's rich text, as much of it as the page reads. The editor
 * allows paragraphs, bulleted lists, bold and links (`cms/collections/legal-documents.ts`);
 * anything else pasted in is drawn as its plain words.
 */
type TextNode = {
  type: string;
  children?: TextNode[];
  text?: string;
  /** Lexical's formatting bit field; 1 is bold. */
  format?: number | string;
  fields?: { url?: string; newTab?: boolean; ltr?: boolean };
};

type RichText = { root: { children: unknown[] } } | null | undefined;

const BOLD = 1;

function nodesOf(text: RichText): TextNode[] {
  return (text?.root.children ?? []) as TextNode[];
}

/**
 * The lines of a field drawn as one run of text, the see-also line: each
 * paragraph is a line, and so is each item of a list, so that nothing typed
 * into it goes missing from the page.
 */
function linesOf(text: RichText): TextNode[] {
  return nodesOf(text)
    .flatMap((node) => (node.type === 'list' ? (node.children ?? []) : [node]))
    .filter(hasWordsIn);
}

function hasWordsIn(node: TextNode): boolean {
  return Boolean(node.text?.trim()) || (node.children ?? []).some(hasWordsIn);
}

function hasWords(text: RichText): boolean {
  return nodesOf(text).some(hasWordsIn);
}

/**
 * Paragraphs and lists. An empty paragraph — what the editor leaves in a field
 * that was opened and never written in — is not drawn, so it cannot open a gap
 * in the document.
 */
function Blocks({ text }: { text: RichText }) {
  return nodesOf(text).map((node, index) => {
    if (!hasWordsIn(node)) return null;
    if (node.type === 'list') {
      return (
        <ul key={index}>
          {(node.children ?? []).map((item, position) => (
            <li key={position}>
              <Inlines nodes={item.children} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={index}>
        <Inlines nodes={node.children} />
      </p>
    );
  });
}

/** Where a link may point: the web, an email address, a phone number, or a page or clause of this site. */
const SAFE_LINK = /^(?:https?:|mailto:|tel:|\/|#)/i;

/**
 * The runs of text in one line — plain words, bold phrases, links and line
 * breaks — with a link to this site given its locale. Anything else is drawn
 * as the words inside it.
 */
function Inlines({ nodes = [] }: { nodes?: TextNode[] }): ReactNode {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return Number(node.format) & BOLD ? <b key={index}>{node.text}</b> : <Fragment key={index}>{node.text}</Fragment>;
      case 'linebreak':
        return <br key={index} />;
      case 'tab':
        return <Fragment key={index}>{'\t'}</Fragment>;
      case 'link':
      case 'autolink': {
        const url = node.fields?.url ?? '';
        if (!SAFE_LINK.test(url)) return <Inlines key={index} nodes={node.children} />;
        // A page of this site is written as its path, and given the locale here.
        const href = url.startsWith('/') ? localePath('ar', url) : url;
        return (
          <a
            key={index}
            href={href}
            dir={node.fields?.ltr ? 'ltr' : undefined}
            {...(node.fields?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Inlines nodes={node.children} />
          </a>
        );
      }
      default:
        return <Inlines key={index} nodes={node.children} />;
    }
  });
}
