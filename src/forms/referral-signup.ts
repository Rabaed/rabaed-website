import { RULES, type FormDefinition } from './definition';

export type ReferralSignupField =
  | 'name'
  | 'phone'
  | 'email'
  | 'city'
  | 'profession'
  | 'employer'
  | 'ibanCertificate'
  | 'accountHolder'
  | 'commercialRegistration'
  | 'taxRegistrationCertificate'
  | 'acceptTerms'
  | 'declareNoConflict';

/** The three document fields' messages: the same two refusals for each. */
const TOO_LARGE = 'الملف أكبر من 10 ميجابايت — اختر ملفاً أصغر';
const WRONG_TYPE = 'ارفع ملف PDF أو صورة PNG أو JPG';
const TOO_LARGE_EN = 'The file is larger than 10 MB — choose a smaller one';
const WRONG_TYPE_EN = 'Upload a PDF, or a PNG or JPG image';

/**
 * The Referral Program signup form (`src/components/referral/signup-form.tsx`).
 *
 * The fields are the Reference site's, in its order, and so are what it stars:
 * everything but the employer and the two registrations. The referrer's bank
 * details arrive as a document — the IBAN certificate, required — rather than
 * typed numbers, and both consents must be given (HANDOFF §4.ب). Professions
 * are stored by value, not by their Arabic text.
 *
 * Every placeholder, the heading and the line under it are verbatim from
 * `reference/site/referral.html`. The Reference site had no messages; the
 * name, phone and email ones are the other forms', for the same rules. Its
 * small print said the form was a prototype that sends nothing; it now says
 * what happens to the documents. Its confirmation promised a referral code no
 * ticket issues, so what is received says the team will issue one.
 */
export const REFERRAL_SIGNUP: FormDefinition<ReferralSignupField> = {
  id: 'referral-signup',
  title: { ar: 'التسجيل في برنامج الإحالة', en: 'Referral Program signup' },
  previewPath: '/referral',
  fields: {
    name: { required: true, maxLength: 120, accepts: RULES.name },
    phone: { required: true, maxLength: 30, accepts: RULES.phone },
    email: { required: true, maxLength: 254, accepts: RULES.email },
    city: { required: true, maxLength: 60, accepts: RULES.name },
    profession: {
      required: true,
      maxLength: 40,
      options: ['engineer', 'project-manager', 'independent-consultant', 'contractor', 'real-estate-advisor', 'content-creator', 'other'],
    },
    employer: { required: false, maxLength: 120 },
    ibanCertificate: { kind: 'document', required: true },
    accountHolder: { required: true, maxLength: 120, accepts: RULES.name },
    commercialRegistration: { kind: 'document', required: false },
    taxRegistrationCertificate: { kind: 'document', required: false },
    acceptTerms: { kind: 'consent' },
    declareNoConflict: { kind: 'consent' },
  },
  applicant: (answers) => ({ name: answers.name, email: answers.email, phone: answers.phone }),
  wording: {
    ar: {
      heading: 'سجّل في برنامج الإحالة',
      lead: 'البيانات والمستندات تُستخدم لإصدار كودك وتحويل مستحقاتك فقط.',
      submit: 'سجّل في برنامج الإحالة',
      finePrint: 'تُحفظ مستنداتك في مساحة خاصة لا يصل إليها إلا فريق ربائد، ولا تُستخدم إلا لإصدار كودك وتحويل مستحقاتك.',
      fields: {
        name: { label: 'الاسم الكامل', placeholder: 'الاسم الكامل *', message: 'اكتب اسمك الكامل (حرفان على الأقل)' },
        phone: { label: 'رقم الجوال', placeholder: 'رقم الجوال *', message: 'اكتب رقم جوال صحيح (٦ إلى ١٥ رقماً)' },
        email: { label: 'البريد الإلكتروني', placeholder: 'البريد الإلكتروني *', message: 'اكتب بريداً إلكترونياً صحيحاً' },
        city: { label: 'المدينة', placeholder: 'المدينة *', message: 'اكتب اسم مدينتك' },
        profession: {
          label: 'الصفة المهنية',
          placeholder: 'الصفة المهنية *',
          message: 'اختر صفتك المهنية',
          options: {
            engineer: 'مهندس',
            'project-manager': 'مدير مشروع',
            'independent-consultant': 'استشاري مستقل',
            contractor: 'مقاول',
            'real-estate-advisor': 'مستشار تطوير عقاري',
            'content-creator': 'صانع محتوى',
            other: 'أخرى',
          },
        },
        employer: { label: 'جهة العمل', placeholder: 'جهة العمل (اختياري)', message: 'اسم جهة العمل أطول من اللازم' },
        ibanCertificate: {
          label: 'شهادة الآيبان',
          placeholder: 'PDF أو صورة',
          message: 'أرفق شهادة الآيبان',
          tooLarge: TOO_LARGE,
          wrongType: WRONG_TYPE,
        },
        accountHolder: {
          label: 'اسم صاحب الحساب البنكي',
          placeholder: 'اسم صاحب الحساب البنكي *',
          message: 'اكتب اسم صاحب الحساب كما في شهادة الآيبان',
        },
        commercialRegistration: {
          label: 'السجل التجاري',
          placeholder: 'اختياري · PDF أو صورة',
          message: 'أرفق السجل التجاري',
          tooLarge: TOO_LARGE,
          wrongType: WRONG_TYPE,
        },
        taxRegistrationCertificate: {
          label: 'شهادة التسجيل الضريبي',
          placeholder: 'اختياري · PDF أو صورة',
          message: 'أرفق شهادة التسجيل الضريبي',
          tooLarge: TOO_LARGE,
          wrongType: WRONG_TYPE,
        },
        acceptTerms: {
          label: 'الموافقة على الشروط والأحكام',
          placeholder: 'الموافقة على الشروط والأحكام',
          message: 'يلزم الموافقة على الشروط والأحكام وسياسة الخصوصية',
        },
        declareNoConflict: {
          label: 'إقرار عدم التعارض',
          placeholder: 'إقرار عدم التعارض',
          message: 'يلزم الإقرار بعدم التعارض',
        },
      },
      received: 'وصلنا تسجيلك — سنراجع بياناتك ومستنداتك ونتواصل معك لإصدار كودك.',
      refused: 'تعذّر استلام تسجيلك الآن. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
      failed: 'لم يُحفظ تسجيلك بسبب خطأ من جهتنا. حاول مرة أخرى بعد قليل، أو راسلنا على واتساب.',
      confirmationSubject: 'ربائد — وصلنا تسجيلك في برنامج الإحالة',
      confirmationBody: [
        'مرحباً {الاسم}،',
        '',
        'وصلنا تسجيلك في برنامج الإحالة. سيراجع فريقنا بياناتك ومستنداتك، ونتواصل معك لإصدار كودك.',
        '',
        'فريق ربائد',
      ].join('\n'),
    },
    // The English: ticket 42's, proposed to the founder with the English site.
    en: {
      heading: 'Join the Referral Program',
      lead: 'Your details and documents are used only to issue your code and pay you.',
      submit: 'Join the Referral Program',
      finePrint:
        'Your documents are kept in private storage only the Rabaed team can reach, and are used only to issue your code and pay what you are owed.',
      fields: {
        name: { label: 'Full name', placeholder: 'Full name *', message: 'Enter your full name (at least two letters)' },
        phone: { label: 'Mobile number', placeholder: 'Mobile number *', message: 'Enter a valid mobile number (6 to 15 digits)' },
        email: { label: 'Email', placeholder: 'Email *', message: 'Enter a valid email address' },
        city: { label: 'City', placeholder: 'City *', message: 'Enter your city' },
        profession: {
          label: 'Profession',
          placeholder: 'Profession *',
          message: 'Choose your profession',
          options: {
            engineer: 'Engineer',
            'project-manager': 'Project manager',
            'independent-consultant': 'Independent consultant',
            contractor: 'Contractor',
            'real-estate-advisor': 'Property development adviser',
            'content-creator': 'Content creator',
            other: 'Other',
          },
        },
        employer: { label: 'Employer', placeholder: 'Employer (optional)', message: 'The employer’s name is too long' },
        ibanCertificate: {
          label: 'IBAN certificate',
          placeholder: 'PDF or image',
          message: 'Attach your IBAN certificate',
          tooLarge: TOO_LARGE_EN,
          wrongType: WRONG_TYPE_EN,
        },
        accountHolder: {
          label: 'Bank account holder’s name',
          placeholder: 'Bank account holder’s name *',
          message: 'Enter the holder’s name as it is on the IBAN certificate',
        },
        commercialRegistration: {
          label: 'Commercial registration',
          placeholder: 'Optional · PDF or image',
          message: 'Attach your commercial registration',
          tooLarge: TOO_LARGE_EN,
          wrongType: WRONG_TYPE_EN,
        },
        taxRegistrationCertificate: {
          label: 'Tax registration certificate',
          placeholder: 'Optional · PDF or image',
          message: 'Attach your tax registration certificate',
          tooLarge: TOO_LARGE_EN,
          wrongType: WRONG_TYPE_EN,
        },
        acceptTerms: {
          label: 'Agreement to the terms',
          placeholder: 'Agreement to the terms',
          message: 'You need to agree to the terms and conditions and the privacy policy',
        },
        declareNoConflict: {
          label: 'No-conflict declaration',
          placeholder: 'No-conflict declaration',
          message: 'You need to make the no-conflict declaration',
        },
      },
      received: 'We have your registration — we will review your details and documents, and contact you to issue your code.',
      refused: 'We could not take your registration just now. Please try again shortly, or message us on WhatsApp.',
      failed: 'Your registration was not saved because of an error on our side. Please try again shortly, or message us on WhatsApp.',
      confirmationSubject: 'Rabaed — we have your Referral Program registration',
      confirmationBody: [
        'Hello {name},',
        '',
        'We have your registration for the Referral Program. Our team will review your details and documents, and contact you to issue your code.',
        '',
        'The Rabaed team',
      ].join('\n'),
    },
  },
};
