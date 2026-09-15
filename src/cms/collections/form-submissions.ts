import type { CollectionAfterDeleteHook, CollectionConfig, FieldHook } from 'payload';
import { FORM_IDS } from '../../forms/definition';
import { DOCUMENT_LINK_MINUTES, documentLink } from '../../forms/document-links';
import { documentStore } from '../../forms/documents';
import { FORMS } from '../../forms/registry';
import { signedIn } from '../access';
import { FORMS_GROUP } from '../globals/form-settings';

/**
 * A fresh signed link to a document each time its record is read, which only a
 * signed-in editor can do (ADR-0004). Nothing stores it.
 */
const linkToDocument: FieldHook = ({ originalDoc, data, siblingData }) => {
  const id = ((originalDoc ?? data) as { id?: unknown } | undefined)?.id;
  const field = (siblingData as { field?: unknown } | undefined)?.field;
  return typeof id === 'number' && typeof field === 'string' ? documentLink(id, field) : null;
};

/**
 * A submission deleted takes its documents with it: a person who asks for their
 * details to be removed means the certificates too.
 */
const removeDocuments: CollectionAfterDeleteHook = async ({ doc }) => {
  const keys = ((doc as { documents?: { key?: string | null }[] | null }).documents ?? [])
    .map((document) => document.key)
    .filter((key): key is string => Boolean(key));
  if (keys.length === 0) return;
  try {
    await documentStore()?.remove(keys);
  } catch (error) {
    console.error(`Submission ${String(doc.id)} was deleted, but its documents could not be:`, keys, error);
  }
};

/** What became of one of a submission's emails. */
const MAIL_OUTCOMES = [
  { value: 'sent', label: { ar: 'أُرسلت', en: 'Sent' } },
  {
    value: 'skipped',
    label: { ar: 'لم تُرسل — لا بريد للتنبيهات أو لا حساب بريد', en: 'Not sent — no alert address, or no mailbox' },
  },
  { value: 'failed', label: { ar: 'تعذّر إرسالها', en: 'Sending failed' } },
];

/**
 * Every request sent from a form on the site (spec: Forms), stored before
 * anything is emailed about it, so that nothing depends on an inbox.
 *
 * A record, not a draft: nobody creates or edits one from the admin, and the
 * site writes one through the submission pipeline only
 * (`src/forms/submission.ts`). An Editor can delete one — a person may ask for
 * their details to be removed.
 *
 * Who asked is kept in three columns of its own, so the list can be searched;
 * every answer is kept under the words the form showed, with a choice's value
 * beside its Arabic text.
 */
export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: { ar: 'طلب', en: 'Form submission' },
    plural: { ar: 'طلبات النماذج', en: 'Form submissions' },
  },
  access: {
    read: signedIn,
    create: () => false,
    update: () => false,
    delete: signedIn,
  },
  defaultSort: '-createdAt',
  hooks: {
    afterDelete: [removeDocuments],
  },
  admin: {
    group: FORMS_GROUP,
    useAsTitle: 'name',
    defaultColumns: ['name', 'form', 'email', 'phone', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    description: {
      ar: 'كل طلب أُرسل من نماذج الموقع، الأحدث أولاً.',
      en: 'Every request sent from the site’s forms, newest first.',
    },
  },
  fields: [
    {
      name: 'form',
      type: 'select',
      required: true,
      index: true,
      options: FORM_IDS.map((id) => ({ value: id, label: FORMS[id].title })),
      label: { ar: 'النموذج', en: 'Form' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: { ar: 'الاسم', en: 'Name' }, admin: { readOnly: true } },
        { name: 'email', type: 'email', index: true, label: { ar: 'البريد الإلكتروني', en: 'Email' }, admin: { readOnly: true } },
        { name: 'phone', type: 'text', label: { ar: 'الجوال', en: 'Phone' }, admin: { readOnly: true } },
      ],
    },
    {
      name: 'answers',
      type: 'array',
      label: { ar: 'الإجابات', en: 'Answers' },
      labels: { singular: { ar: 'إجابة', en: 'Answer' }, plural: { ar: 'الإجابات', en: 'Answers' } },
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: { ar: 'الحقل', en: 'Field' } },
            { name: 'value', type: 'textarea', label: { ar: 'الإجابة', en: 'Answer' } },
            { name: 'option', type: 'text', label: { ar: 'نص الخيار', en: 'Option shown' } },
          ],
        },
        { name: 'field', type: 'text', label: { ar: 'اسم الحقل في النظام', en: 'Field name' } },
      ],
    },
    {
      // Documents are kept in private storage (`src/forms/documents.ts`); the
      // record holds where, and what each is.
      name: 'documents',
      type: 'array',
      label: { ar: 'المستندات', en: 'Documents' },
      labels: { singular: { ar: 'مستند', en: 'Document' }, plural: { ar: 'المستندات', en: 'Documents' } },
      admin: {
        readOnly: true,
        description: {
          ar: `يُفتح كل مستند برابط صالح لـ${DOCUMENT_LINK_MINUTES} دقائق، ولمن سجّل الدخول فقط. أعد فتح الطلب إن انتهت صلاحية الرابط.`,
          en: `Each document opens through a link that lasts ${DOCUMENT_LINK_MINUTES} minutes, for signed-in editors only. Open the record again if a link has expired.`,
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: { ar: 'المستند', en: 'Document' } },
            { name: 'fileName', type: 'text', label: { ar: 'اسم الملف', en: 'File name' } },
            {
              name: 'link',
              type: 'text',
              virtual: true,
              label: { ar: 'الرابط', en: 'Link' },
              admin: { components: { Field: '/cms/components/document-link#DocumentLink' } },
              hooks: { afterRead: [linkToDocument] },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'contentType', type: 'text', label: { ar: 'النوع', en: 'Type' } },
            { name: 'size', type: 'number', label: { ar: 'الحجم بالبايت', en: 'Size in bytes' } },
            { name: 'field', type: 'text', label: { ar: 'اسم الحقل في النظام', en: 'Field name' } },
          ],
        },
        // Where it is kept, in private storage.
        { name: 'key', type: 'text', admin: { hidden: true } },
      ],
    },
    {
      name: 'alert',
      type: 'select',
      options: MAIL_OUTCOMES,
      label: { ar: 'تنبيه الفريق', en: 'Team alert' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'confirmation',
      type: 'select',
      options: MAIL_OUTCOMES,
      label: { ar: 'تأكيد مقدّم الطلب', en: 'Applicant confirmation' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      // The form's one-off value for this request (`TOKEN_FIELD`): a second
      // copy of the same request finds it and is not stored again.
      name: 'token',
      type: 'text',
      unique: true,
      admin: { hidden: true },
    },
    {
      // Where the request came from, as a one-way hash of its network address
      // — enough to count requests from one address, and not the address.
      name: 'sourceHash',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
  ],
};
