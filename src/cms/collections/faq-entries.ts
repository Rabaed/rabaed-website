import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, TextareaFieldValidation } from 'payload';
import { textarea } from 'payload/shared';
import { signedIn } from '../access';
import { answerProblem } from '../faq-answer';
import { FAQ_PAGE_KEYS, FAQ_PAGES, type FaqPageKey } from '../faq-pages';
import { refreshSite } from '../revalidation';

const answerValidation: TextareaFieldValidation = async (value, options) => {
  const base = await textarea(value, options);
  if (base !== true || !value) return base;
  return answerProblem(value) ?? true;
};

/**
 * A question is on a page, so a change to one that is — or was until now —
 * published rebuilds the site (`refreshSite`). That covers hiding, moving and
 * unpublishing. Saving a draft of a question never published changes nothing
 * a visitor can see.
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
 * The questions and answers on the site's pages (ticket 22), each on the page
 * it belongs to: Home, Start, Tool, Referral and Partnership.
 *
 * One entry per question, per language, as the spec keeps FAQs (spec: Content
 * model). Their order is dragged in the list (`orderable`), and a question can
 * be hidden without losing its place or its words. Like an article, a
 * question is saved as a draft, previewed on its page, and reaches visitors
 * only when published.
 *
 * Every page's questions sit closed in native disclosure elements, so a crawler
 * reads every answer (`components/faq.tsx`).
 */
export const Faqs: CollectionConfig = {
  slug: 'faq-entries',
  labels: {
    singular: { ar: 'سؤال شائع', en: 'FAQ entry' },
    plural: { ar: 'الأسئلة الشائعة', en: 'FAQs' },
  },
  // Nothing on the site reads questions through the API: pages read the
  // published ones through the local API (`src/cms/faqs.ts`).
  access: {
    read: signedIn,
    readVersions: signedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  orderable: true,
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'page', 'shows', '_status'],
    listSearchableFields: ['question', 'answer'],
    description: {
      ar: 'اسحب الأسئلة في القائمة لترتيبها. كل صفحة تعرض أسئلتها بهذا الترتيب، بعد النشر.',
      en: 'Drag questions in the list to order them. Each page shows its questions in that order, once published.',
    },
    // Previewed on its page, at its questions.
    preview: (doc) => {
      const faqPage = FAQ_PAGES[doc.page as FaqPageKey];
      return faqPage ? `/api/preview?path=${encodeURIComponent(`${faqPage.path}#${faqPage.sectionId}`)}` : null;
    },
  },
  hooks: {
    afterChange: [refreshOnPublish],
    afterDelete: [refreshOnDelete],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      // The longest question the Reference site asks is about 50 characters.
      maxLength: 160,
      label: { ar: 'السؤال', en: 'Question' },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      maxLength: 800,
      label: { ar: 'الجواب', en: 'Answer' },
      admin: {
        rows: 5,
        description: {
          ar: 'اسم ملف أو نص إنجليزي يُكتب بين علامتي ` ليُعرض من اليسار إلى اليمين، مثل `concrete_db.json`. ولذكر مبلغ الإحالة اكتب {payout}، ولخصم العميل {clientDiscount}: يُدرج الموقع القيمة المعتمدة بدل كتابة الرقم.',
          en: 'Put a file name or other English text between backticks to set it left to right, like `concrete_db.json`. Write {payout} for the referral payout and {clientDiscount} for the client discount: the site inserts the current value instead of a typed number.',
        },
      },
      validate: answerValidation,
    },
    {
      name: 'page',
      type: 'select',
      required: true,
      index: true,
      options: FAQ_PAGE_KEYS.map((key) => ({ value: key, label: FAQ_PAGES[key].label })),
      label: { ar: 'الصفحة', en: 'Page' },
      admin: { position: 'sidebar' },
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
      name: 'shows',
      type: 'checkbox',
      defaultValue: true,
      label: { ar: 'يظهر في الصفحة', en: 'Shows on the page' },
      admin: {
        position: 'sidebar',
        description: {
          ar: 'ألغِ التحديد لإخفاء السؤال مع بقاء نصه وترتيبه.',
          en: 'Untick to hide the question, keeping its words and its place.',
        },
      },
    },
  ],
};
