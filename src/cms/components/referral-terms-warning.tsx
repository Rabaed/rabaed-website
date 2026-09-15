import type { Payload } from 'payload';
import type { LegalDocument } from '../../payload-types';
import type { Words } from '../page-fields';
import { amountsOf, formatValues, valuesNotStated, type ValueName } from '../referral-program-values';

/** Link nodes sit inside a paragraph's run of text; every other node with children is a block of its own. */
const INLINE = new Set(['link', 'autolink']);

type LexicalNode = { readonly type?: string; readonly text?: string; readonly children?: readonly LexicalNode[] };

/** The words of a rich text node as a reader meets them: a paragraph's pieces joined, paragraphs apart. */
function nodeWords(node: LexicalNode | undefined): string {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  if (!node.children) return node.type === 'linebreak' ? '\n' : '';
  const inline = node.children.every((child) => typeof child.text === 'string' || child.type === 'linebreak' || INLINE.has(child.type ?? ''));
  return node.children.map(nodeWords).join(inline ? '' : '\n');
}

/** The words of a rich text field, as its root node holds them. */
const richTextWords = (value: unknown) => nodeWords((value as { readonly root: LexicalNode } | null | undefined)?.root);

/** Everything a legal document says, as one text. */
function documentWords(document: LegalDocument): string {
  return [
    document.title,
    document.lead,
    richTextWords(document.intro),
    ...document.clauses.flatMap((clause) => [clause.heading, richTextWords(clause.body), richTextWords(clause.contact)]),
    richTextWords(document.seeAlso),
  ].join('\n');
}

/**
 * The published Referral Program values the published Referral Terms do not
 * state, or `null` when they state both — or when either is not in the CMS
 * yet, which is a database not migrated and no disagreement.
 */
async function unstatedValues(payload: Payload) {
  const [values, terms] = await Promise.all([
    payload.findGlobalVersions({
      slug: 'referral-program',
      where: { 'version._status': { equals: 'published' } },
      sort: '-updatedAt',
      limit: 1,
      pagination: false,
      depth: 0,
    }),
    payload.findVersions({
      collection: 'legal-documents',
      where: { and: [{ 'version.slug': { equals: 'referral-terms' } }, { 'version._status': { equals: 'published' } }] },
      sort: '-updatedAt',
      limit: 1,
      pagination: false,
      depth: 0,
    }),
  ]);
  const amounts = amountsOf(values.docs[0]?.version);
  const publishedTerms = terms.docs[0];
  if (!amounts || !publishedTerms) return null;

  const missing = valuesNotStated(documentWords(publishedTerms.version as LegalDocument), amounts);
  if (missing.length === 0) return null;
  const parent = publishedTerms.parent as number | { id: number };
  return { missing, values: formatValues(amounts), termsId: typeof parent === 'object' ? parent.id : parent };
}

/**
 * The warning that the Referral Terms do not say what the site quotes
 * (ADR-0008): on the dashboard, on the Referral Program values and on the
 * Referral Terms, while the published terms do not state the published
 * values. It blocks nothing, and rewrites nothing: an Editor publishes a
 * version of the terms that states them, and it goes.
 *
 * A server component: it reads the CMS each time the admin draws it.
 */
export async function ReferralTermsWarning({ payload, i18n }: { payload: Payload; i18n: { language: string } }) {
  const unstated = await unstatedValues(payload);
  if (!unstated) return null;

  const language: keyof Words = i18n.language === 'en' ? 'en' : 'ar';
  const { payout, clientDiscount } = unstated.values;
  const named: Record<ValueName, Words> = {
    payout: { ar: `مبلغ الإحالة ${payout} ريال`, en: `the payout of ${payout} riyals` },
    clientDiscount: { ar: `خصم العميل ${clientDiscount}`, en: `the client discount of ${clientDiscount}` },
  };
  const missing = unstated.missing.map((name) => named[name][language]).join(language === 'en' ? ' and ' : ' و');
  const message: Record<'heading' | 'text' | 'values' | 'terms', Words> = {
    heading: {
      ar: 'الشروط والأحكام المنشورة لبرنامج الإحالة لا تذكر قيم البرنامج الحالية.',
      en: 'The published Referral Terms do not state the Referral Program values.',
    },
    text: {
      ar: `يذكر الموقع ${missing}، ولا تذكر الشروط ذلك. لا يُعدَّل نص الشروط تلقائياً: انشر نسخة من الشروط والأحكام تذكر هذه القيم. النشر غير ممنوع في الأثناء.`,
      en: `The site quotes ${missing}; the terms do not say so. They are never rewritten by themselves: publish a version of the Referral Terms that states the values. Publishing is not blocked meanwhile.`,
    },
    values: { ar: 'قيم برنامج الإحالة', en: 'Referral Program values' },
    terms: { ar: 'شروط برنامج الإحالة', en: 'Referral Terms' },
  };
  const admin = payload.config.routes.admin;

  return (
    <div
      role="alert"
      style={{
        marginBottom: 'var(--base)',
        padding: 'calc(var(--base) * 0.75) var(--base)',
        border: '1px solid var(--theme-warning-500)',
        borderRadius: 'var(--style-radius-m)',
        background: 'var(--theme-warning-100)',
        color: 'var(--theme-elevation-1000)',
      }}
    >
      <strong>{message.heading[language]}</strong>
      <p style={{ margin: '6px 0' }}>{message.text[language]}</p>
      <a href={`${admin}/globals/referral-program`}>{message.values[language]}</a>
      {' · '}
      <a href={`${admin}/collections/legal-documents/${unstated.termsId}`}>{message.terms[language]}</a>
    </div>
  );
}
