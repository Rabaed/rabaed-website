import type { Field, GlobalAfterChangeHook, GlobalConfig } from 'payload';
import { fieldNames, type FormDefinition, type FormId } from '../../forms/definition';
import { signedIn } from '../access';
import { refreshSite } from '../revalidation';

/** Where the forms sit in the admin's menu. */
export const FORMS_GROUP = { ar: 'النماذج', en: 'Forms' };

/** The CMS global holding a form's settings. */
export function formSettingsSlug(id: FormId): string {
  return `${id}-form`;
}

/** A list option's value as a field name, since `+966` cannot be one. */
export function optionFieldName(value: string): string {
  return `option_${value.replace(/[^A-Za-z0-9]/g, '_')}`;
}

/**
 * The wording shows on pages, so publishing it rebuilds the site; a saved
 * draft leaves the pages alone, as for the site settings.
 */
const refreshPagesOnPublish: GlobalAfterChangeHook = ({ doc, req }) => {
  if (doc._status === 'published') refreshSite(req);
  return doc;
};

type Words = { readonly ar: string; readonly en: string };

/**
 * A line of the form's wording. Required, because a form with an empty label
 * or message is a broken form; and held to a length the design carries (spec:
 * Content model).
 */
function wordingField(name: string, label: Words, maxLength: number, description?: Words): Field {
  const common = { name, required: true, maxLength, label, admin: description ? { description } : undefined };
  // Room for paragraphs only where the words run to them: the email's text.
  return maxLength > 200 ? { ...common, type: 'textarea' } : { ...common, type: 'text' };
}

/** One field's wording: what it is called, its placeholder, its message, and the text of each option. */
function fieldWording(definition: FormDefinition, name: string): Field {
  const field = definition.fields[name];
  const wording = definition.wording.fields[name];
  return {
    name,
    type: 'group',
    label: wording.label,
    fields: [
      {
        type: 'row',
        fields: [
          wordingField('label', { ar: 'اسم الحقل', en: 'Label' }, 40, {
            ar: 'يسمعه من يستخدم قارئ الشاشة، ويظهر في «طلبات النماذج».',
            en: 'Read out by screen readers, and shown in Form submissions.',
          }),
          wordingField('placeholder', { ar: 'النص داخل الحقل', en: 'Placeholder' }, 40),
        ],
      },
      wordingField('message', { ar: 'رسالة الخطأ', en: 'Error message' }, 80, {
        ar: 'تظهر تحت الحقل حين تكون إجابته غير مقبولة.',
        en: 'Shown under the field while its answer is not acceptable.',
      }),
      ...(field.options
        ? [
            {
              name: 'options',
              type: 'group',
              label: { ar: 'الخيارات', en: 'Options' },
              fields: field.options.map((value) => wordingField(optionFieldName(value), { ar: value, en: value }, 40)),
            } satisfies Field,
          ]
        : []),
    ],
  };
}

/**
 * A form's settings, as an Editor changes them (spec: Forms): where its alerts
 * go, and every word it shows or sends — its heading, button and small print,
 * each field's label, placeholder and message, what the visitor is told after
 * sending, and the confirmation email.
 *
 * Built from the form's definition, so it always has exactly the fields the
 * form has. Which fields those are is not an Editor's to change
 * (`src/forms/definition.ts`).
 */
export function formSettingsGlobal(definition: FormDefinition): GlobalConfig {
  return {
    slug: formSettingsSlug(definition.id),
    label: { ar: `نموذج ${definition.title.ar}`, en: `${definition.title.en} form` },
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
      preview: () => `/api/preview?path=${definition.previewPath}`,
    },
    hooks: {
      afterChange: [refreshPagesOnPublish],
    },
    fields: [
      {
        name: 'alertAddress',
        type: 'email',
        label: { ar: 'بريد التنبيهات', en: 'Alert address' },
        admin: {
          description: {
            ar: 'يصله تنبيه بكل طلب يُرسَل من هذا النموذج. ما دام فارغاً لا يُرسَل أي بريد — لا تنبيه ولا تأكيد لمقدّم الطلب — ويبقى كل طلب محفوظاً في «طلبات النماذج».',
            en: 'Every request sent from this form is alerted here. While it is empty no email is sent at all — no alert, and no confirmation to the applicant — and every request is still kept under Form submissions.',
          },
        },
      },
      {
        type: 'tabs',
        tabs: [
          {
            label: { ar: 'على الصفحة', en: 'On the page' },
            fields: [
              wordingField('heading', { ar: 'العنوان', en: 'Heading' }, 60),
              wordingField('lead', { ar: 'السطر تحت العنوان', en: 'Line under the heading' }, 80),
              wordingField('submit', { ar: 'زر الإرسال', en: 'Submit button' }, 30),
              wordingField('finePrint', { ar: 'النص الصغير تحت الزر', en: 'Small print under the button' }, 200),
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
                fields: fieldNames(definition).map((name) => fieldWording(definition, name)),
              },
            ],
          },
          {
            label: { ar: 'بعد الإرسال', en: 'After sending' },
            fields: [
              wordingField('received', { ar: 'حين يصل الطلب', en: 'When the request arrives' }, 160),
              wordingField('refused', { ar: 'حين يُرفض الطلب', en: 'When the request is turned away' }, 160, {
                ar: 'لطلب يبدو آلياً، أو لطلبات كثيرة من العنوان نفسه خلال ساعة.',
                en: 'For a request that looks automated, or too many from one address within an hour.',
              }),
              wordingField('failed', { ar: 'حين يتعذّر الحفظ', en: 'When the request cannot be saved' }, 160),
            ],
          },
          {
            label: { ar: 'رسالة التأكيد', en: 'Confirmation email' },
            description: {
              ar: 'تُرسَل إلى مقدّم الطلب فور وصوله، ما دام «بريد التنبيهات» معبّأً.',
              en: 'Sent to the applicant as soon as the request arrives, while an alert address is set.',
            },
            fields: [
              wordingField('confirmationSubject', { ar: 'الموضوع', en: 'Subject' }, 120),
              wordingField('confirmationBody', { ar: 'النص', en: 'Text' }, 3000, {
                ar: 'اكتب {الاسم} حيث يوضع اسم مقدّم الطلب.',
                en: 'Write {الاسم} where the applicant’s name goes.',
              }),
            ],
          },
        ],
      },
    ],
  };
}
