/**
 * The English of the four forms (ticket 42): every word each shows on an
 * English page, what it says once sent, and the confirmation email — as
 * proposed to the founder for his approval. Written as a draft of each form's
 * English entry and published by nobody but him, as the English pages' words
 * are.
 *
 * **Frozen.** This is what the migration proposed on the day it ran. The site
 * does not read it: it reads the CMS, and until the founder publishes an
 * English entry, the English each form's definition was written with
 * (`src/forms/*.ts`), which says the same today. A word here is changed only
 * to correct what this migration wrote.
 *
 * Keyed by each form's id, and shaped as its settings are: a field's words,
 * and for a list the text of each option by its value. A consent has only its
 * label and its message, as its settings do.
 */

/** The two refusals every document field gives. */
const TOO_LARGE_EN = 'The file is larger than 10 MB — choose a smaller one';
const WRONG_TYPE_EN = 'Upload a PDF, or a PNG or JPG image';

export const ENGLISH_FORM_WORDING = {
  'demo-request': {
    heading: 'Book a live demo on your project',
    lead: '30 minutes · on one of your own projects',
    submit: 'Book a live demo',
    finePrint: 'We use your details only to arrange the demo, and never share them with any third party.',
    fields: {
      name: { label: 'Full name', placeholder: 'Full name', message: 'Enter your full name (at least two letters)' },
      email: { label: 'Email', placeholder: 'Email', message: 'Enter a valid email address' },
      role: {
        label: 'Your role on the project',
        placeholder: 'Your role on the project',
        message: 'Choose your role on the project',
        options: { owner: 'Owner / developer', consultant: 'Consultant', contractor: 'Contractor' },
      },
      phone: { label: 'Mobile number', placeholder: 'Mobile number', message: 'Enter a valid mobile number (6 to 15 digits)' },
      company: { label: 'Company name', placeholder: 'Company name', message: 'The company name is too long' },
      activeProjects: {
        label: 'Number of active projects',
        placeholder: 'Number of active projects',
        message: 'Enter the number of projects in figures only',
      },
    },
    received: 'We have your request — we will contact you within one working day to arrange a time.',
    refused: 'We could not take your request just now. Please try again shortly, or message us on WhatsApp.',
    failed: 'Your request was not saved because of an error on our side. Please try again shortly, or message us on WhatsApp.',
    confirmationSubject: 'Rabaed — we have your demo request',
    confirmationBody: [
      'Hello {name},',
      '',
      'We have your request for a live demo of Rabaed on one of your projects. Our team will contact you within one working day to arrange a time.',
      '',
      'The demo takes 30 minutes.',
      '',
      'The Rabaed team',
    ].join('\n'),
  },
  'referral-signup': {
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
        message: 'You need to agree to the terms and conditions and the privacy policy',
      },
      declareNoConflict: {
        label: 'No-conflict declaration',
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
  'tool-download': {
    heading: 'Download details',
    lead: 'The company is optional. The rest unlock the download button.',
    submit: 'Download the tool now',
    finePrint:
      'By pressing the download button you agree that we may contact you about the tool and its updates. We will not share your details with anyone else.',
    fields: {
      firstName: { label: 'First name', placeholder: 'First name *', message: 'Enter your first name (at least two letters)' },
      lastName: { label: 'Last name', placeholder: 'Last name *', message: 'Enter your last name (at least two letters)' },
      countryCode: {
        label: 'Country code',
        placeholder: 'Country code',
        message: 'Choose a country code',
        options: {
          '+966': '+966 Saudi Arabia',
          '+971': '+971 UAE',
          '+965': '+965 Kuwait',
          '+974': '+974 Qatar',
          '+973': '+973 Bahrain',
          '+968': '+968 Oman',
          '+962': '+962 Jordan',
          '+20': '+20 Egypt',
          '+90': '+90 Türkiye',
          other: 'Other',
        },
      },
      phone: { label: 'Mobile number', placeholder: '5X XXX XXXX *', message: 'Enter a valid mobile number (6 to 15 digits)' },
      email: { label: 'Email', placeholder: 'Email *', message: 'Enter a valid email address' },
      company: { label: 'Company name', placeholder: 'Company name (optional)', message: 'The company name is too long' },
    },
    received: 'Done — your download has started',
    refused: 'The download is not available just now. Please try again shortly.',
    failed: 'The download failed because of an error on our side. Please try again shortly.',
    confirmationSubject: 'Rabaed — Pour Tracker',
    confirmationBody:
      'Hello {name},\n\n' +
      'Thank you for downloading the Pour Tracker. The file is called Rabaed-Pour-Tracker.html: a single page that opens with a double-click in Chrome or Edge.\n\n' +
      'Three steps to your first pour:\n' +
      '1. Save the file somewhere permanent — your desktop or the project folder, not your downloads folder.\n' +
      '2. Double-click it to open it.\n' +
      '3. Choose a folder for the project the first time it runs.\n\n' +
      'Your data stays on your computer: the tool sends nothing to any server.\n\n' +
      'If the file did not arrive, download it again from the same page.\n\n' +
      'The Rabaed team',
  },
  'partnership-application': {
    heading: 'Request a partnership meeting',
    lead: 'Your office’s details help us suggest the best-fitting model before we meet.',
    submit: 'Request a partnership meeting',
    finePrint:
      'Your commercial registration is kept in private storage only the Rabaed team can reach, and is used only to assess your application.',
    fields: {
      company: { label: 'Office or company name', placeholder: 'Office / company name *', message: 'Enter the name of your office or company' },
      commercialRegistration: {
        label: 'Commercial registration',
        placeholder: 'PDF or image',
        message: 'Attach your commercial registration',
        tooLarge: TOO_LARGE_EN,
        wrongType: WRONG_TYPE_EN,
      },
      city: { label: 'City', placeholder: 'City *', message: 'Enter your city' },
      name: { label: 'Applicant’s name', placeholder: 'Applicant’s name *', message: 'Enter your full name (at least two letters)' },
      jobTitle: { label: 'Job title', placeholder: 'Job title *', message: 'Enter your position at the office' },
      phone: { label: 'Mobile number', placeholder: 'Mobile number *', message: 'Enter a valid mobile number (6 to 15 digits)' },
      email: { label: 'Email', placeholder: 'Email *', message: 'Enter a valid email address' },
      activity: {
        label: 'Type of business',
        placeholder: 'Type of business *',
        message: 'Choose your office’s type of business',
        options: {
          'consulting-office': 'Consulting office',
          'project-management': 'Project management',
          contracting: 'Contracting',
          'real-estate-development': 'Real estate development',
          other: 'Other',
        },
      },
      activeProjects: {
        label: 'Projects under supervision now',
        placeholder: 'Projects under supervision *',
        message: 'Choose how many projects you supervise',
        options: { '1-3': '1–3', '4-10': '4–10', '11-25': '11–25', 'over-25': 'More than 25' },
      },
      clientType: {
        label: 'Main type of client',
        placeholder: 'Main type of client *',
        message: 'Choose your main type of client',
        options: {
          'individual-developers': 'Individual developers',
          'development-companies': 'Development companies',
          government: 'Government bodies',
          mixed: 'A mix',
        },
      },
      projectArea: {
        label: 'Average project area',
        placeholder: 'Average project area *',
        message: 'Choose your average project area',
        options: {
          'under-5000': 'Under 5,000 m²',
          '5000-20000': '5,000–20,000 m²',
          '20000-50000': '20,000–50,000 m²',
          'over-50000': 'Over 50,000 m²',
        },
      },
      partnershipMode: {
        label: 'Preferred way of working together',
        placeholder: 'Preferred way of working together *',
        message: 'Choose a preferred way of working together',
        options: {
          'embedded-in-proposal': 'Built into your proposal',
          'office-licence': 'Office licence',
          'approved-referral': 'Approved referral',
          undecided: 'Not decided yet',
        },
      },
      goals: {
        label: 'What you want from the partnership',
        placeholder: 'What do you want from the partnership? (optional)',
        message: 'What you have written is too long',
      },
    },
    received: 'We have your application. The partnerships team will contact you within two working days to arrange an introductory meeting.',
    refused: 'We could not take your application just now. Please try again shortly, or message us on WhatsApp.',
    failed: 'Your application was not saved because of an error on our side. Please try again shortly, or message us on WhatsApp.',
    confirmationSubject: 'Rabaed — we have your partnership application',
    confirmationBody: [
      'Hello {name},',
      '',
      'We have your office’s application to join the Partnership Program. The partnerships team will review your details and your commercial registration, and contact you within two working days to arrange an introductory meeting.',
      '',
      'The first meeting includes a demo of the platform, and commits you to nothing.',
      '',
      'The Rabaed team',
    ].join('\n'),
  },
};
