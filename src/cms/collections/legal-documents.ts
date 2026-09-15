import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  LinkFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeOperationHook,
  type CollectionConfig,
  type FieldHook,
} from 'payload';
import { signedIn } from '../access';
import { LEGAL_PAGES, LEGAL_SLUGS, type LegalSlug } from '../legal-pages';
import { refreshSite } from '../revalidation';

/**
 * What the legal text can be made of: paragraphs, bulleted lists, bold
 * phrases and links — what the approved documents use, and nothing the page
 * does not know how to draw (`components/legal-document.tsx`).
 */
const legalText = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    UnorderedListFeature(),
    LinkFeature({
      // Links to pages are written as their path, `/privacy`.
      enabledCollections: [],
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'ltr',
          type: 'checkbox',
          label: { ar: 'يُكتب من اليسار إلى اليمين', en: 'Written left to right' },
          admin: {
            description: {
              ar: 'لرقم هاتف مكتوب بمسافات، حتى لا تنقلب أجزاؤه.',
              en: 'For a phone number written with spaces, so its groups stay in order.',
            },
          },
        },
      ],
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
});

/**
 * Who made this version, written out rather than linked to the account: an
 * account can be removed later, and the record of who changed the binding text
 * must outlive it (ADR-0003). Whatever a request sends is replaced by the
 * signed-in Editor; only the import, which has no Editor, names itself.
 */
const recordEditor: FieldHook = ({ req, value }) => {
  if (!req.user) return value;
  const { email, name } = req.user as { email: string; name?: null | string };
  return name ? `${name} <${email}>` : email;
};

/**
 * A legal page always shows its newest published version
 * (`cms/legal-documents.ts`), so a document cannot be withdrawn, and the admin
 * does not offer to: Unpublish is refused rather than marking a document as
 * withdrawn while its page still shows it. A change of mind is a new version,
 * published.
 *
 * An unpublish is an update that sets the document itself back to draft; a
 * saved draft is an update made with `draft`, which leaves the published
 * document as it is.
 */
const refuseUnpublish: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation !== 'update' && operation !== 'updateByID') return;
  const { data, draft, unpublishAllLocales } = args as {
    data?: { _status?: string };
    draft?: boolean | string;
    unpublishAllLocales?: boolean | string;
  };
  const savingDraft = draft === true || draft === 'true';
  if (unpublishAllLocales || (data?._status === 'draft' && !savingDraft)) {
    throw new APIError(
      req.i18n.language === 'ar'
        ? 'لا يمكن إلغاء نشر مستند نظامي: صفحته تعرض دائماً نسخة منشورة. انشر نسخة جديدة بدلاً من ذلك.'
        : 'A legal document cannot be unpublished: its page always shows a published version. Publish a new version instead.',
      400,
      null,
      true,
    );
  }
};

/**
 * Publishing rebuilds the site (`refreshSite`), from the published version;
 * a saved draft leaves it alone.
 */
const refreshPageOnPublish: CollectionAfterChangeHook = ({ doc, req }) => {
  if (doc._status === 'published') refreshSite(req);
  return doc;
};

/**
 * The Terms, the Privacy Policy and the Referral Program Terms (ticket 25).
 *
 * The CMS is the record of what they say (ADR-0003). Every save is kept as a
 * version with its date and who made it, and none is ever discarded, so what
 * the terms said on any day can be shown. A save is a draft; only Publish
 * reaches the site — there is no autosave. Every Editor can edit them
 * (ADR-0007).
 *
 * The three documents are fixed: each is a page of the site. They are created
 * by the import migration, and nobody can add or delete one.
 */
export const LegalDocuments: CollectionConfig = {
  slug: 'legal-documents',
  labels: {
    singular: { ar: 'مستند نظامي', en: 'Legal document' },
    plural: { ar: 'المستندات النظامية', en: 'Legal documents' },
  },
  access: {
    read: signedIn,
    readVersions: signedIn,
    update: signedIn,
    create: () => false,
    delete: () => false,
  },
  versions: {
    drafts: true,
    // Every version, forever.
    maxPerDoc: 0,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt', 'editedBy'],
    description: {
      ar: 'النص العربي هو النص الملزم. كل حفظ يُسجَّل نسخةً بتاريخها واسم من حفظها، ولا يظهر في الموقع إلا بعد النشر.',
      en: 'The Arabic text is binding. Every save is kept as a version with its date and who saved it, and reaches the site only when published.',
    },
    preview: (doc) => `/api/preview?path=${LEGAL_PAGES[doc.slug as LegalSlug].path}`,
  },
  hooks: {
    beforeOperation: [refuseUnpublish],
    afterChange: [refreshPageOnPublish],
  },
  fields: [
    {
      name: 'referralTermsWarning',
      type: 'ui',
      admin: {
        // Only the Referral Terms state the Referral Program values (ADR-0008).
        condition: (data) => data?.slug === 'referral-terms',
        components: { Field: '/cms/components/referral-terms-warning#ReferralTermsWarning' },
      },
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: LEGAL_SLUGS.map((slug) => ({ value: slug, label: LEGAL_PAGES[slug].label })),
      label: { ar: 'الصفحة', en: 'Page' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'editedBy',
      type: 'text',
      label: { ar: 'آخر من عدّل', en: 'Edited by' },
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: {
          ar: 'يُسجَّل تلقائياً مع كل نسخة. سجل النسخ كاملاً في «النسخ».',
          en: 'Recorded with every version. The full history is under Versions.',
        },
      },
      hooks: { beforeChange: [recordEditor] },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { ar: 'العنوان', en: 'Title' },
    },
    {
      name: 'lead',
      type: 'textarea',
      required: true,
      label: { ar: 'السطر تحت العنوان', en: 'Line under the title' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: true,
          label: { ar: 'العنوان في نتائج البحث', en: 'Search title' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: { ar: 'الوصف في نتائج البحث', en: 'Search description' },
        },
      ],
    },
    {
      name: 'intro',
      type: 'richText',
      editor: legalText,
      required: true,
      label: { ar: 'المقدمة', en: 'Introduction' },
    },
    {
      name: 'clauses',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: { ar: 'بند', en: 'Clause' },
        plural: { ar: 'البنود', en: 'Clauses' },
      },
      admin: {
        description: {
          ar: 'تُرقَّم البنود حسب ترتيبها.',
          en: 'Clauses are numbered by their order.',
        },
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: { ar: 'عنوان البند', en: 'Heading' },
        },
        {
          name: 'inContents',
          type: 'checkbox',
          defaultValue: true,
          label: { ar: 'يظهر في قائمة المحتويات', en: 'Listed in the contents' },
        },
        {
          name: 'body',
          type: 'richText',
          editor: legalText,
          label: { ar: 'نص البند', en: 'Text' },
        },
        {
          name: 'contact',
          type: 'richText',
          editor: legalText,
          label: { ar: 'صندوق التواصل', en: 'Contact box' },
          admin: {
            description: {
              ar: 'يظهر في إطار بعد نص البند. اتركه فارغاً إن لم يكن للبند صندوق تواصل.',
              en: 'Shown framed, after the text. Leave empty for no contact box.',
            },
          },
        },
      ],
    },
    {
      name: 'seeAlso',
      type: 'richText',
      editor: legalText,
      required: true,
      label: { ar: 'اقرأ أيضاً', en: 'See also' },
    },
  ],
};
