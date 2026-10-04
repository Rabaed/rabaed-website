import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { FORMS_GROUP } from './form-settings';

export const CONFIRMATION_EMAIL_SLUG = 'confirmation-email';

/**
 * What every form's confirmation email shares: its banner (ADR-0028). Each
 * form's own words, and its button, are in that form's settings.
 *
 * No drafts: a banner chosen is a banner sent, and each form's preview shows
 * it as soon as it is saved.
 */
export const ConfirmationEmail: GlobalConfig = {
  slug: CONFIRMATION_EMAIL_SLUG,
  label: { ar: 'تصميم رسائل التأكيد', en: 'Confirmation email design' },
  access: {
    read: signedIn,
    update: signedIn,
  },
  admin: {
    group: FORMS_GROUP,
    description: {
      ar: 'الشعار الذي تبدأ به رسالة التأكيد في كل النماذج. نص كل رسالة وزرّها في إعدادات نموذجها.',
      en: 'The banner every form’s confirmation email opens with. Each email’s text and button are in its form’s settings.',
    },
  },
  fields: [
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'email-images',
      label: { ar: 'الشعار (اختياري)', en: 'Banner (optional)' },
      admin: {
        description: {
          ar: 'صورة عريضة، 1200 × 400 بكسل مثلاً. من غيرها يبدأ البريد باسم ربائد على شريط داكن.',
          en: 'A wide image, 1200 × 400 pixels for example. Without one, the email opens with Rabaed’s name on a dark band.',
        },
      },
    },
  ],
};
