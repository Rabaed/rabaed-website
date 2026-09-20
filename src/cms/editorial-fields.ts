/**
 * What the blog's articles (ticket 23) and case studies (ticket 24) share. The
 * spec requires the same of both — title, slug, locale, summary, body, author,
 * published date and an answer-first opening paragraph — and both are written
 * once per language, drafted, previewed and published at their own address.
 *
 * One entry per language: a translation is an entry of its own, in the other
 * language, with the same slug — so each language is drafted, previewed and
 * published on its own, and an entry missing in one language is never filled
 * in from the other (spec: Routing and localisation). Payload's per-field
 * localisation was not used: it shares one draft/publish state across both
 * languages, so publishing the Arabic would publish an empty English.
 *
 * Every field the spec requires is required to publish. A draft may be
 * unfinished — Payload checks the rules only when an entry is published.
 */
import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  Field,
  RichTextField,
  TextareaFieldValidation,
  TextFieldSingleValidation,
} from 'payload';
import { text, textarea } from 'payload/shared';
import { COMPANY } from '../content/company';
import { localePath } from '../lib/locales';
import { signedIn } from './access';
import { refreshSite } from './revalidation';

type Label = { ar: string; en: string };

/** The collections written this way. */
type EditorialCollection = 'posts' | 'case-studies';

/**
 * What reaches the public API. The site's own pages read through the local
 * API, which skips these rules: what keeps drafts off them is the published
 * filter in `src/cms/blog.ts` and `src/cms/case-studies.ts`.
 */
export const editorialAccess: CollectionConfig['access'] = {
  read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  readVersions: signedIn,
  create: signedIn,
  update: signedIn,
  delete: signedIn,
};

export const editorialVersions: CollectionConfig['versions'] = {
  drafts: true,
  maxPerDoc: 50,
};

/**
 * An entry is on its own page, its index, the sitemap and its translation's
 * alternates — and the first published case study puts a link in every
 * page's header — so a change to one that is, or was until now, published
 * rebuilds the site (`refreshSite`). That covers unpublishing and a changed
 * slug too, whose old address must stop answering. Saving a draft of an entry
 * never published changes nothing a visitor can see.
 */
const refreshOnPublish: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (doc._status === 'published' || previousDoc?._status === 'published') refreshSite(req);
  return doc;
};

const refreshOnDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (doc._status === 'published') refreshSite(req);
  return doc;
};

export const editorialHooks: CollectionConfig['hooks'] = {
  afterChange: [refreshOnPublish],
  afterDelete: [refreshOnDelete],
};

/** The admin's Preview button: the entry at its own address, in its own language. */
export function previewAt(entryPath: (slug: string) => string): NonNullable<CollectionConfig['admin']>['preview'] {
  return (doc) =>
    typeof doc.slug === 'string' && doc.slug
      ? `/api/preview?path=${encodeURIComponent(localePath(doc.locale === 'en' ? 'en' : 'ar', entryPath(doc.slug)))}`
      : null;
}

/**
 * The rich text an entry's body is written in: what the page is styled for
 * (`src/styles/editorial.css`) and nothing more. No heading above the second
 * level, which is the title's; a text sitting under a heading of the page's
 * own offers fewer. Links go to addresses only;
 * linking to another CMS entry would need the page to know how to find it. No
 * images inside the text: nothing asked for them.
 */
export function editorialEditor(options: {
  headings: ('h2' | 'h3')[];
  quotes: boolean;
}): RichTextField['editor'] {
  return lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: options.headings }),
      BoldFeature(),
      ItalicFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ...(options.quotes ? [BlockquoteFeature()] : []),
      LinkFeature({ enabledCollections: [] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  });
}

export const titleField: Field = {
  name: 'title',
  type: 'text',
  required: true,
  maxLength: 120,
  label: { ar: 'العنوان', en: 'Title' },
};

/**
 * The spec's rule for every major heading, held here for the one an entry
 * opens with: a standalone answer of 30 to 60 words (spec: SEO and GEO). Words
 * are counted between spaces, which is how both Arabic and English separate
 * them.
 */
const answerValidation: TextareaFieldValidation = async (value, options) => {
  const base = await textarea(value, options);
  if (base !== true || !value) return base;

  const words = value.trim().split(/\s+/).length;
  if (words >= 30 && words <= 60) return true;
  return `اكتب جواباً مستقلاً من 30 إلى 60 كلمة. عدد الكلمات الآن: ${words}.`;
};

export function answerField(question: Label): Field {
  return {
    name: 'answer',
    type: 'textarea',
    required: true,
    label: { ar: 'الجواب المباشر (الفقرة الأولى)', en: 'Answer-first opening paragraph' },
    admin: {
      description: {
        ar: `أول فقرة تحت العنوان: جواب مستقل من 30 إلى 60 كلمة عن ${question.ar}، يُفهم دون قراءة ما بعده. هذا ما تقتبسه محركات البحث والمساعدات الذكية.`,
        en: `The first paragraph under the title: a standalone answer of 30 to 60 words to ${question.en}. It is what search engines and AI assistants quote.`,
      },
    },
    validate: answerValidation,
  };
}

export function summaryField(shownOn: Label): Field {
  return {
    name: 'summary',
    type: 'textarea',
    required: true,
    maxLength: 220,
    label: { ar: 'الملخص', en: 'Summary' },
    admin: {
      description: {
        ar: `سطر أو سطران يظهران تحت العنوان في ${shownOn.ar}، ووصفاً في نتائج البحث.`,
        en: `A line or two shown under the title on ${shownOn.en}, and as the description in search results.`,
      },
    },
  };
}

/**
 * A slug is the entry's address, and a translation shares it, so it is unique
 * within a language rather than across the collection. Latin letters, digits
 * and hyphens only: an address that survives being pasted into WhatsApp or an
 * email without turning into percent signs.
 *
 * `reserved` names words the section's own addresses use; `another` is what
 * the message calls the entry already at the address («مقالة أخرى»).
 */
export function slugField(options: {
  collection: EditorialCollection;
  section: string;
  another: string;
  reserved?: string[];
}): Field {
  const { collection, section, another, reserved = [] } = options;

  const validate: TextFieldSingleValidation = async (value, validationOptions) => {
    const base = await text(value, validationOptions);
    if (base !== true || !value) return base;

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'حروف إنجليزية صغيرة وأرقام وشرطات فقط، بلا مسافات — مثل rabaed-vs-whatsapp.';
    }
    if (reserved.includes(value)) return `«${value}» محجوز لعناوين القسم نفسه. اختر عنواناً آخر.`;

    const { id, req, siblingData } = validationOptions;
    const { totalDocs } = await req.payload.count({
      collection,
      where: {
        and: [
          { slug: { equals: value } },
          { locale: { equals: (siblingData as { locale?: string }).locale } },
          ...(id === undefined ? [] : [{ id: { not_equals: id } }]),
        ],
      },
      req,
    });
    return totalDocs === 0 ? true : `هذا العنوان مستخدم ل${another} بنفس اللغة.`;
  };

  return {
    name: 'slug',
    type: 'text',
    required: true,
    index: true,
    label: { ar: 'عنوان الرابط', en: 'Slug' },
    admin: {
      position: 'sidebar',
      description: {
        ar: `آخر جزء في الرابط: rabaedapp.com${section}/… — الترجمة تستخدم العنوان نفسه.`,
        en: `The end of the address: rabaedapp.com${section}/… — a translation uses the same slug.`,
      },
    },
    validate,
  };
}

export const localeField: Field = {
  name: 'locale',
  type: 'select',
  required: true,
  index: true,
  defaultValue: 'ar',
  label: { ar: 'اللغة', en: 'Language' },
  options: [
    { label: 'العربية', value: 'ar' },
    { label: 'English', value: 'en' },
  ],
  admin: { position: 'sidebar' },
};

/**
 * The company's own names, which an author is not. Read from
 * `src/content/company.ts` rather than written out again: one form of the name
 * everywhere is what keeps an answer engine reading one entity (HANDOFF §6.7),
 * and a second copy here would be the first to drift.
 */
const COMPANY_NAMES = [COMPANY.name.ar, COMPANY.name.en, COMPANY.legalName];

/**
 * An author is a person. No validator can prove that, but it can refuse the
 * one wrong answer that is actually likely — the company — which tickets 23,
 * 24 and 38 all ask for in words and nothing until now enforced. A byline a
 * reader can attribute to somebody is worth more than one signed by a logo,
 * and it is what an engine reads as an author at all.
 */
const authorValidation: TextFieldSingleValidation = async (value, options) => {
  const base = await text(value, options);
  if (base !== true || !value) return base;

  const written = value.trim();
  return COMPANY_NAMES.some((name) => written.localeCompare(name, undefined, { sensitivity: 'base' }) === 0)
    ? 'اكتب اسم الشخص الذي كتب النص، لا اسم الشركة.'
    : true;
};

export const authorField: Field = {
  name: 'author',
  type: 'text',
  required: true,
  label: { ar: 'الكاتب', en: 'Author' },
  admin: {
    position: 'sidebar',
    description: {
      ar: 'اسم الشخص الذي كتب النص، لا اسم الشركة.',
      en: 'The person who wrote it, not the company.',
    },
  },
  validate: authorValidation,
};

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  required: true,
  defaultValue: () => new Date().toISOString(),
  label: { ar: 'تاريخ النشر', en: 'Published date' },
  admin: {
    position: 'sidebar',
    date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
  },
};
