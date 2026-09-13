import { revalidatePath } from 'next/cache';
import type { GlobalAfterChangeHook, GlobalConfig } from 'payload';
import { signedIn } from '../access';

/**
 * Set on `context` by anything that writes CMS content outside a request to
 * the running site — a migration, a script — where there is no page cache to
 * refresh and Next refuses to be asked. Site settings and the legal documents
 * both honour it.
 */
export const SKIP_REVALIDATION = 'skipRevalidation';

/**
 * Pages are built ahead of time, so a published change reaches visitors only
 * when the pages are rebuilt. Site settings appear in every page's footer, so
 * every page is marked stale and rebuilt on its next visit. A saved draft
 * changes nothing a visitor can see, so it leaves the pages alone.
 */
const refreshPagesOnPublish: GlobalAfterChangeHook = ({ doc, req }) => {
  if (doc._status === 'published' && !req.context[SKIP_REVALIDATION]) {
    revalidatePath('/', 'layout');
  }
  return doc;
};

function internationalNumber(value: null | string | undefined): string | true {
  if (!value || /^[1-9]\d{7,14}$/.test(value)) return true;
  return 'اكتب الرقم بالصيغة الدولية، أرقاماً فقط بلا + ولا مسافات — مثل 966576767900.';
}

function dialableNumber(value: null | string | undefined): string | true {
  if (!value || /^\+[1-9]\d{7,14}$/.test(value)) return true;
  return 'اكتب الرقم بالصيغة الدولية مسبوقاً بـ + — مثل ‎+966576767900.';
}

function webAddress(value: null | string | undefined): string | true {
  if (!value || /^https:\/\/[^\s]+$/.test(value)) return true;
  return 'اكتب الرابط كاملاً، يبدأ بـ https://';
}

function socialLink(name: string, ar: string, en: string) {
  return { name, type: 'text' as const, label: { ar, en }, validate: webAddress };
}

/**
 * The contact points every page carries (spec: Content model). Drafts and
 * publishing apply: a saved draft can be previewed on the site from the admin
 * and reaches visitors only when published (spec: user story 41).
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { ar: 'إعدادات الموقع', en: 'Site settings' },
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
    // Every page shows these, so the home page previews them as well as any.
    preview: () => '/api/preview?path=/',
  },
  hooks: {
    afterChange: [refreshPagesOnPublish],
  },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      label: { ar: 'رقم واتساب', en: 'WhatsApp number' },
      admin: {
        description: {
          ar: 'بالصيغة الدولية، أرقاماً فقط — مثل 966576767900. يظهر في تذييل كل صفحة.',
          en: 'International format, digits only — for example 966576767900. Shown in every page footer.',
        },
      },
      validate: internationalNumber,
    },
    {
      // Nothing renders these two yet: the Reference site shows neither in
      // its shell. They are kept here, once, for the forms that will need
      // them (ticket 27) rather than hard-coded there.
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: { ar: 'البريد الإلكتروني للتواصل', en: 'Contact email' },
        },
        {
          name: 'phone',
          type: 'text',
          label: { ar: 'رقم الهاتف للتواصل', en: 'Contact phone' },
          admin: {
            description: { ar: 'مثل ‎+966576767900', en: 'For example +966576767900' },
          },
          validate: dialableNumber,
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: { ar: 'حسابات التواصل الاجتماعي', en: 'Social accounts' },
      admin: {
        description: {
          ar: 'اترك الحقل فارغاً إن لم يكن الحساب جاهزاً بعد.',
          en: 'Leave a field empty if the account is not ready yet.',
        },
      },
      fields: [
        socialLink('linkedin', 'لينكدإن', 'LinkedIn'),
        socialLink('x', 'إكس', 'X'),
        socialLink('facebook', 'فيسبوك', 'Facebook'),
        socialLink('instagram', 'إنستجرام', 'Instagram'),
      ],
    },
  ],
};
