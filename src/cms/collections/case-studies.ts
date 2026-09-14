import type { CollectionConfig, TextareaFieldValidation, TextFieldSingleValidation } from 'payload';
import { text, textarea } from 'payload/shared';
import { caseStudyPath, CASE_STUDIES_PATH } from '../../lib/case-study-paths';
import {
  answerField,
  authorField,
  editorialAccess,
  editorialEditor,
  editorialHooks,
  editorialVersions,
  localeField,
  previewAt,
  publishedAtField,
  slugField,
  summaryField,
  titleField,
} from '../editorial-fields';

/**
 * Each part of the story sits under a heading of the page's own (التحدي, ما
 * الذي تغيّر, النتيجة), so the text inside offers a third-level heading at
 * most, and no quotes: the client's words have a field of their own.
 */
const storyEditor = editorialEditor({ headings: ['h3'], quotes: false });

/** A quote says who said it. Checked on the name, so the message sits beside the field left empty. */
const quoteNameValidation: TextFieldSingleValidation = async (value, options) => {
  const base = await text(value, options);
  if (base !== true) return base;
  const quote = (options.siblingData as { text?: string | null }).text;
  return quote?.trim() && !value?.trim() ? 'اكتب اسم صاحب الاقتباس. لا يُنشر اقتباس لا يُعرف قائله.' : true;
};

/** And a name has a quote to go with it, rather than being dropped from the page without a word. */
const quoteTextValidation: TextareaFieldValidation = async (value, options) => {
  const base = await textarea(value, options);
  if (base !== true) return base;
  const { name, role } = options.siblingData as { name?: string | null; role?: string | null };
  return (name?.trim() || role?.trim()) && !value?.trim() ? 'اكتب نص الاقتباس، أو امسح اسم صاحبه وصفته.' : true;
};

/**
 * Case studies (ticket 24): the place Rabaed's real client stories live. The
 * section — its index, its pages and its link in the header — is hidden in a
 * language until a case study is published in it (`src/cms/case-studies.ts`).
 * Nothing is seeded: the first entry is a real one.
 *
 * The spec's body is the story in three parts — the challenge, what changed,
 * the outcome — each required to publish. A cover, figures, a quote and further
 * images are optional: a real story may have no photograph cleared for use and
 * no numbers, and the spec allows no invented figures or testimonials. A figure that is given says how it was measured;
 * a quote that is given says who said it.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: { ar: 'قصة عميل', en: 'Case study' },
    plural: { ar: 'قصص العملاء', en: 'Case studies' },
  },
  access: editorialAccess,
  versions: editorialVersions,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'locale', 'publishedAt', '_status'],
    preview: previewAt(caseStudyPath),
  },
  defaultSort: '-publishedAt',
  hooks: editorialHooks,
  fields: [
    titleField,
    answerField({ ar: 'ما حققه العميل مع ربائد', en: 'what the client achieved with Rabaed' }),
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'text',
          required: true,
          maxLength: 80,
          label: { ar: 'العميل', en: 'Client' },
          admin: {
            description: {
              ar: 'اسم العميل كما وافق على ظهوره.',
              en: 'The client’s name, as they agreed to have it shown.',
            },
          },
        },
        {
          name: 'sector',
          type: 'text',
          required: true,
          maxLength: 60,
          label: { ar: 'القطاع', en: 'Sector' },
          admin: {
            description: { ar: 'مثل: مشاريع سكنية، مبانٍ تجارية.', en: 'For example: residential, commercial buildings.' },
          },
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: { ar: 'صورة الغلاف (اختيارية)', en: 'Cover image (optional)' },
    },
    {
      name: 'challenge',
      type: 'richText',
      required: true,
      label: { ar: 'التحدي', en: 'The challenge' },
      editor: storyEditor,
    },
    {
      name: 'whatChanged',
      type: 'richText',
      required: true,
      label: { ar: 'ما الذي تغيّر', en: 'What changed' },
      editor: storyEditor,
    },
    {
      name: 'outcome',
      type: 'richText',
      required: true,
      label: { ar: 'النتيجة', en: 'The outcome' },
      editor: storyEditor,
    },
    {
      name: 'figures',
      type: 'array',
      maxRows: 4,
      label: { ar: 'الأرقام (اختيارية)', en: 'Figures (optional)' },
      labels: {
        singular: { ar: 'رقم', en: 'Figure' },
        plural: { ar: 'الأرقام', en: 'Figures' },
      },
      admin: {
        description: {
          ar: 'لا تُضف رقماً إلا إن قيس فعلاً في مشروع العميل. تُنشر القصة دون أي رقم.',
          en: 'Add a figure only if it was actually measured on the client’s project. A case study publishes without any.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, maxLength: 12, label: { ar: 'الرقم', en: 'Value' } },
            { name: 'label', type: 'text', required: true, maxLength: 60, label: { ar: 'ما يقيسه', en: 'What it measures' } },
          ],
        },
        {
          name: 'basis',
          type: 'text',
          required: true,
          maxLength: 140,
          label: { ar: 'كيف قيس', en: 'How it was measured' },
          admin: {
            description: {
              ar: 'يظهر تحت الرقم: على أي مشروع، وعلى أي مدة.',
              en: 'Shown under the figure: on which project, over what period.',
            },
          },
        },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      label: { ar: 'اقتباس من العميل (اختياري)', en: 'Client quote (optional)' },
      admin: {
        description: {
          ar: 'بكلمات العميل نفسه وبإذنه. اتركه فارغاً إن لم يوجد.',
          en: 'In the client’s own words, with their permission. Leave it empty if there is none.',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          maxLength: 400,
          label: { ar: 'نص الاقتباس', en: 'Quote' },
          validate: quoteTextValidation,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              maxLength: 80,
              label: { ar: 'صاحب الاقتباس', en: 'Said by' },
              validate: quoteNameValidation,
            },
            { name: 'role', type: 'text', maxLength: 80, label: { ar: 'صفته', en: 'Role' } },
          ],
        },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 6,
      label: { ar: 'صور أخرى (اختيارية)', en: 'More images (optional)' },
    },
    summaryField({ ar: 'صفحة قصص العملاء', en: 'the case studies index' }),
    slugField({ collection: 'case-studies', section: CASE_STUDIES_PATH, another: 'قصة أخرى' }),
    localeField,
    authorField,
    publishedAtField,
  ],
};
