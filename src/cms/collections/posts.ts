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
  TextareaFieldValidation,
  TextFieldSingleValidation,
} from 'payload';
import { text, textarea } from 'payload/shared';
import { blogPostPath } from '../../lib/blog-paths';
import { localePath } from '../../lib/locales';
import { signedIn } from '../access';
import { refreshSite } from '../revalidation';

/**
 * Words a slug cannot be, because the blog's own addresses use them:
 * `/blog/page/2` is the index's second page.
 */
const RESERVED_SLUGS = ['page'];

/**
 * A slug is the article's address, and a translation shares it (`src/cms/blog.ts`),
 * so it is unique within a language rather than across the collection. Latin
 * letters, digits and hyphens only: an address that survives being pasted
 * into WhatsApp or an email without turning into percent signs.
 */
const slugValidation: TextFieldSingleValidation = async (value, options) => {
  const base = await text(value, options);
  if (base !== true || !value) return base;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'حروف إنجليزية صغيرة وأرقام وشرطات فقط، بلا مسافات — مثل rabaed-vs-whatsapp.';
  }
  if (RESERVED_SLUGS.includes(value)) return `«${value}» محجوز لعناوين المدونة نفسها. اختر عنواناً آخر.`;

  const { id, req, siblingData } = options;
  const { totalDocs } = await req.payload.count({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: value } },
        { locale: { equals: (siblingData as { locale?: string }).locale } },
        ...(id === undefined ? [] : [{ id: { not_equals: id } }]),
      ],
    },
    req,
  });
  return totalDocs === 0 ? true : 'هذا العنوان مستخدم لمقالة أخرى بنفس اللغة.';
};

/**
 * The spec's rule for every major heading, held here for the one the article
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

/**
 * An article is on its own page, the index, the sitemap and its translation's
 * alternates, so a change to one that is — or was until now — published
 * rebuilds the site (`refreshSite`). That covers unpublishing and a changed
 * slug too, whose old address must stop answering. Saving a draft of an
 * article never published changes nothing a visitor can see.
 */
const refreshOnPublish: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (doc._status === 'published' || previousDoc?._status === 'published') refreshSite(req);
  return doc;
};

const refreshOnDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (doc._status === 'published') refreshSite(req);
  return doc;
};

/**
 * The blog's articles (ticket 23). One entry per language: a translation is
 * an entry of its own, in the other language, with the same slug — so each
 * language is drafted, previewed and published on its own, and an article
 * missing in one language is never filled in from the other (spec: Routing
 * and localisation).
 *
 * Every field the spec requires is required to publish. A draft may be
 * unfinished — Payload checks the rules only when an article is published.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { ar: 'مقالة', en: 'Article' },
    plural: { ar: 'المدونة', en: 'Blog' },
  },
  access: {
    // What reaches the public API. The site's own pages read through the
    // local API, which skips these rules: what keeps drafts off them is the
    // published filter in `src/cms/blog.ts`.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    readVersions: signedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'locale', 'publishedAt', '_status'],
    // An article is previewed at its own address, in its own language.
    preview: (doc) =>
      typeof doc.slug === 'string' && doc.slug
        ? `/api/preview?path=${encodeURIComponent(localePath(doc.locale === 'en' ? 'en' : 'ar', blogPostPath(doc.slug)))}`
        : null,
  },
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [refreshOnPublish],
    afterDelete: [refreshOnDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      label: { ar: 'العنوان', en: 'Title' },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: { ar: 'الجواب المباشر (الفقرة الأولى)', en: 'Answer-first opening paragraph' },
      admin: {
        description: {
          ar: 'أول فقرة تحت العنوان: جواب مستقل من 30 إلى 60 كلمة عن سؤال المقالة، يُفهم دون قراءة ما بعده. هذا ما تقتبسه محركات البحث والمساعدات الذكية.',
          en: 'The first paragraph under the title: a standalone answer of 30 to 60 words to the question the article is about. It is what search engines and AI assistants quote.',
        },
      },
      validate: answerValidation,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { ar: 'صورة الغلاف', en: 'Cover image' },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: { ar: 'نص المقالة', en: 'Body' },
      editor: lexicalEditor({
        // What an article needs and the page is styled for (`src/styles/blog.css`).
        // Headings start at the second level: the title is the page's first.
        // Links go to addresses only; linking to another CMS entry would need
        // the page to know how to find it.
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
          LinkFeature({ enabledCollections: [] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 220,
      label: { ar: 'الملخص', en: 'Summary' },
      admin: {
        description: {
          ar: 'سطر أو سطران يظهران تحت العنوان في صفحة المدونة، ووصفاً للمقالة في نتائج البحث.',
          en: 'A line or two shown under the title on the blog index, and as the article’s description in search results.',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      label: { ar: 'عنوان الرابط', en: 'Slug' },
      admin: {
        position: 'sidebar',
        description: {
          ar: 'آخر جزء في رابط المقالة: rabaedapp.com/blog/… — الترجمة تستخدم العنوان نفسه.',
          en: 'The end of the article’s address: rabaedapp.com/blog/… — a translation uses the same slug.',
        },
      },
      validate: slugValidation,
    },
    {
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
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: { ar: 'الكاتب', en: 'Author' },
      admin: {
        position: 'sidebar',
        description: {
          ar: 'اسم الشخص الذي كتب المقالة، لا اسم الشركة.',
          en: 'The person who wrote the article, not the company.',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: { ar: 'تاريخ النشر', en: 'Published date' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
      },
    },
  ],
};
