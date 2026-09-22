import type { Field, GlobalConfig } from 'payload';
import { fieldNames, NAME_PLACEHOLDER, type FormDefinition, type FormId } from '../../forms/definition';
import { localePath, type Locale } from '../../lib/locales';
import { signedIn } from '../access';
import { refreshSiteWhenPublished } from '../revalidation';

/** Where the forms sit in the admin's menu. */
export const FORMS_GROUP = { ar: 'النماذج', en: 'Forms' };

/**
 * The CMS global holding a form's settings in a language: the Arabic, with the
 * form's alert address, and the English, with its words alone (ticket 42).
 *
 * **One entry per language, not the English beside the Arabic in one.** Each
 * is drafted and published on its own, so English proposed for the founder's
 * approval waits without burying a draft of the Arabic or holding up a change
 * to the alert address; and the English entry's columns are named exactly as
 * the Arabic one's, which the longest option names need — nested one group
 * deeper, as `en`, they run past what Postgres allows (`optionFieldName`).
 */
export function formSettingsSlug(id: FormId, locale: Locale = 'ar'): string {
  return locale === 'ar' ? `${id}-form` : `${id}-form-${locale}`;
}

/** What Postgres allows an identifier: it cuts a longer one short without saying so. */
const IDENTIFIER_LIMIT = 63;

/**
 * A list option's value as a field name, since `+966` cannot be one — and so
 * as a column name, since Payload names a group's columns after its fields
 * (`dbName` reaches only the tables it makes, not these).
 *
 * The longest column a form's wording makes is one of these in the versions
 * table. Where `option_` would push it past what Postgres allows, the whole
 * list takes the shorter `o_` — the whole list, so that one list never names
 * its options two ways. A list too long even for that is Payload's own warning
 * when the CMS starts, and would need shorter values.
 *
 * `options` is the definition's own list of values, so that this file and
 * `src/forms/settings.ts`, which reads what the CMS stored, always agree on
 * which prefix a list took.
 */
export function optionFieldName(field: string, value: string, options: readonly string[]): string {
  const identifier = (each: string) => each.replace(/[^A-Za-z0-9]/g, '_');
  const column = (name: string) => `version_fields_${columnName(field)}_options_${name}`;
  const prefix = options.some((each) => column(`option_${identifier(each)}`).length > IDENTIFIER_LIMIT) ? 'o_' : 'option_';
  return `${prefix}${identifier(value)}`;
}

/** A field name as Payload names its column. */
function columnName(field: string): string {
  return field.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

type Words = { readonly ar: string; readonly en: string };

/**
 * A line of the form's wording. Required, because a form with an empty label
 * or message is a broken form; and held to a length the design carries (spec:
 * Content model). Written in its language's direction, so the English entry's
 * boxes run left to right in an admin laid out right to left.
 */
function wordingField(locale: Locale, name: string, label: Words, maxLength: number, description?: Words): Field {
  const common = { name, required: true, maxLength, label, admin: { description, rtl: locale === 'ar' } };
  // Room for paragraphs only where the words run to them: the email's text.
  return maxLength > 200 ? { ...common, type: 'textarea' } : { ...common, type: 'text' };
}

/**
 * One field's wording: what it is called and its message; for typed text its
 * placeholder and the text of each option; for a document the note under its
 * name and what it says when a file is refused. A consent's own sentence is
 * what the applicant agrees to, not wording, and stays in the form.
 */
function fieldWording(definition: FormDefinition, locale: Locale, name: string): Field {
  const field = definition.fields[name];
  const words = (fieldName: string, label: Words, maxLength: number, description?: Words) =>
    wordingField(locale, fieldName, label, maxLength, description);
  // The field named as the Editor knows it, in whichever language the admin is in.
  const groupLabel: Words = { ar: definition.wording.ar.fields[name].label, en: definition.wording.en.fields[name].label };
  const label = words('label', { ar: 'اسم الحقل', en: 'Label' }, 40, {
    ar: 'يسمعه من يستخدم قارئ الشاشة، ويظهر في «طلبات النماذج».',
    en: 'Read out by screen readers, and shown in Form submissions.',
  });

  if (field.kind === 'consent') {
    return {
      name,
      type: 'group',
      label: groupLabel,
      fields: [
        label,
        words('message', { ar: 'رسالة الخطأ', en: 'Error message' }, 80, {
          ar: 'تظهر تحت المربع ما دام لم يُعلَّم.',
          en: 'Shown under the box while it is not ticked.',
        }),
      ],
    };
  }

  if (field.kind === 'document') {
    return {
      name,
      type: 'group',
      label: groupLabel,
      fields: [
        { type: 'row', fields: [label, words('placeholder', { ar: 'الملاحظة تحت اسم المستند', en: 'Note under the name' }, 40)] },
        words('message', { ar: 'حين لا يُرفق المستند', en: 'When the document is missing' }, 80),
        {
          type: 'row',
          fields: [
            words('tooLarge', { ar: 'حين يتجاوز الملف 10 ميجابايت', en: 'When the file is over 10 MB' }, 80),
            words('wrongType', { ar: 'حين لا يكون الملف PDF أو صورة', en: 'When the file is not a PDF or an image' }, 80),
          ],
        },
      ],
    };
  }

  return {
    name,
    type: 'group',
    label: groupLabel,
    fields: [
      // 60 rather than 40, because the Reference site's own placeholder for
      // the partnership application's free text — a whole question — is 41
      // characters, and a form must be able to carry its words as written.
      { type: 'row', fields: [label, words('placeholder', { ar: 'النص داخل الحقل', en: 'Placeholder' }, 60)] },
      words('message', { ar: 'رسالة الخطأ', en: 'Error message' }, 80, {
        ar: 'تظهر تحت الحقل حين تكون إجابته غير مقبولة.',
        en: 'Shown under the field while its answer is not acceptable.',
      }),
      ...(field.options
        ? [
            {
              name: 'options',
              type: 'group',
              label: { ar: 'الخيارات', en: 'Options' },
              fields: field.options.map((value) => words(optionFieldName(name, value, field.options!), { ar: value, en: value }, 40)),
            } satisfies Field,
          ]
        : []),
    ],
  };
}

/** Where alerts go: the Arabic entry's alone, since it is one address whichever language a form is filled in. */
const alertAddressField: Field = {
  name: 'alertAddress',
  type: 'email',
  label: { ar: 'بريد التنبيهات', en: 'Alert address' },
  admin: {
    description: {
      ar: 'يصله تنبيه بكل طلب يُرسَل من هذا النموذج، بالعربية أو بالإنجليزية. ما دام فارغاً لا يُرسَل أي بريد — لا تنبيه ولا تأكيد لمقدّم الطلب — ويبقى كل طلب محفوظاً في «طلبات النماذج».',
      en: 'Every request sent from this form, in Arabic or in English, is alerted here. While it is empty no email is sent at all — no alert, and no confirmation to the applicant — and every request is still kept under Form submissions.',
    },
  },
};

/** What each language's entry is called, and says about itself. */
const ENTRY = {
  ar: {
    label: (title: Words): Words => ({ ar: `نموذج ${title.ar}`, en: `${title.en} form` }),
    description: undefined,
  },
  en: {
    label: (title: Words): Words => ({ ar: `نموذج ${title.ar} — بالإنجليزية`, en: `${title.en} form — English` }),
    description: {
      ar: 'كلمات النموذج في الصفحات الإنجليزية ورسالة التأكيد لمن يملؤه بالإنجليزية. أما بريد التنبيهات فواحد للغتين، وهو في نموذج العربية.',
      en: 'The form’s words on the English pages, and the confirmation sent to whoever fills it in in English. The alert address is one for both languages, and is on the Arabic form.',
    },
  },
} as const satisfies Record<Locale, unknown>;

/**
 * A form's settings in one language, as an Editor changes them (spec: Forms):
 * every word it shows or sends — its heading, button and small print, each
 * field's label, placeholder and message, what the visitor is told after
 * sending, and the confirmation email — and, on the Arabic entry, where its
 * alerts go (see `formSettingsSlug` for why English is an entry of its own).
 *
 * Built from the form's definition, so it always has exactly the fields the
 * form has. Which fields those are is not an Editor's to change
 * (`src/forms/definition.ts`).
 */
export function formSettingsGlobal(definition: FormDefinition, locale: Locale = 'ar'): GlobalConfig {
  const words = (name: string, label: Words, maxLength: number, description?: Words) =>
    wordingField(locale, name, label, maxLength, description);
  const entry = ENTRY[locale];

  return {
    slug: formSettingsSlug(definition.id, locale),
    label: entry.label(definition.title),
    access: {
      read: signedIn,
      readVersions: signedIn,
      update: signedIn,
    },
    versions: {
      drafts: true,
      max: 100,
    },
    admin: {
      group: FORMS_GROUP,
      description: entry.description,
      preview: () => `/api/preview?path=${encodeURIComponent(localePath(locale, definition.previewPath))}`,
    },
    // The wording shows on pages.
    hooks: {
      afterChange: [refreshSiteWhenPublished],
    },
    fields: [
      ...(locale === 'ar' ? [alertAddressField] : []),
      {
        type: 'tabs',
        tabs: [
          {
            label: { ar: 'على الصفحة', en: 'On the page' },
            fields: [
              words('heading', { ar: 'العنوان', en: 'Heading' }, 60),
              words('lead', { ar: 'السطر تحت العنوان', en: 'Line under the heading' }, 80),
              words('submit', { ar: 'زر الإرسال', en: 'Submit button' }, 30),
              words('finePrint', { ar: 'النص الصغير تحت الزر', en: 'Small print under the button' }, 200),
            ],
          },
          {
            label: { ar: 'الحقول', en: 'Fields' },
            description: {
              ar: 'كلمات كل حقل. أما الحقول نفسها فثابتة: كل حقل يُحفظ ويُذكر في سياسة الخصوصية، فإضافته أو حذفه عمل مطوّر.',
              en: 'The words of each field. The fields themselves are fixed: each is stored and covered by the Privacy Policy, so adding or removing one is a developer’s change.',
            },
            fields: [
              {
                name: 'fields',
                type: 'group',
                label: false,
                fields: fieldNames(definition).map((name) => fieldWording(definition, locale, name)),
              },
            ],
          },
          {
            label: { ar: 'بعد الإرسال', en: 'After sending' },
            fields: [
              words('received', { ar: 'حين يصل الطلب', en: 'When the request arrives' }, 160),
              words('refused', { ar: 'حين يُرفض الطلب', en: 'When the request is turned away' }, 160, {
                ar: 'لطلب يبدو آلياً، أو لطلبات كثيرة من العنوان نفسه خلال ساعة.',
                en: 'For a request that looks automated, or too many from one address within an hour.',
              }),
              words('failed', { ar: 'حين يتعذّر الحفظ', en: 'When the request cannot be saved' }, 160),
            ],
          },
          {
            label: { ar: 'رسالة التأكيد', en: 'Confirmation email' },
            description: {
              ar: 'تُرسَل إلى مقدّم الطلب فور وصوله، ما دام «بريد التنبيهات» معبّأً.',
              en: 'Sent to the applicant as soon as the request arrives, while an alert address is set.',
            },
            fields: [
              words('confirmationSubject', { ar: 'الموضوع', en: 'Subject' }, 120),
              words('confirmationBody', { ar: 'النص', en: 'Text' }, 3000, {
                ar: `اكتب ${NAME_PLACEHOLDER[locale]} حيث يوضع اسم مقدّم الطلب.`,
                en: `Write ${NAME_PLACEHOLDER[locale]} where the applicant’s name goes.`,
              }),
            ],
          },
        ],
      },
    ],
  };
}
