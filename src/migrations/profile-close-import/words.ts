/**
 * The words of the Company profile's close (ticket 109) — sections 10 to 14,
 * the contact section and the floating WhatsApp button — in the shape of its
 * entry: Ahmed's, from his profile (`.scratch/company-profile/source/ar.json`,
 * `en.json` and `site.json`), each language from its own file, since his
 * English is a rewrite rather than a translation.
 *
 * **Frozen.** This is data for the migration that writes it, and a migration
 * must do the same thing on every database it ever runs on. The site never
 * reads this file: the profile's words are edited and published in the CMS.
 *
 * Where they differ from his:
 *
 * - his section numbers, «10» to «14», and his cards' and steps' «01» to «03»,
 *   are not words: they are places in his order, which is fixed;
 * - each of 12's figures is its number and its sign together, «3.6×», as 02's
 *   are, and his « دقيقة» after 15 is the word after the figure, «دقيقة»;
 * - the source line under 12's figures is not in his files: the spec gives it,
 *   «المصدر: بيانات مشاريع ربائد» / "Source: Rabaed project data";
 * - the buttons' links are the site's own: the demo goes to the home page's
 *   form, and WhatsApp, left empty, to the site's number in the site settings,
 *   never his 966579012646 (spec: Buttons and links);
 * - his English apostrophes are the curly ones the site's English is written
 *   with.
 */

const both = (ar: string, en: string) => ({ ar, en });

export const PROFILE_CLOSE_WORDS = {
  templates: {
    eyebrow: both('نماذج جاهزة', 'Pre-made templates'),
    title: both('نماذج جاهزة للاستخدام مباشرة.', 'Forms, ready out of the box.'),
    lead: both(
      'النماذج المعتمدة في قطاع المقاولات السعودي التي يستخدمها فريقك: جاهزة بالعربية، تُوجَّه وتُتابَع تلقائياً، وتُصدَّر إلى PDF بنقرة. لا داعي لإنشائها من الصفر.',
      'Every Saudi construction form your team already uses: pre-built, routed and tracked, and exported to a clean PDF in one click. No setup, no template engineering.',
    ),
    hint: both('اضغط على أي نموذج لترى استخدامه', 'Tap any form to see what it is for'),
    cards: [
      {
        code: 'SAR',
        name: both('طلب اعتماد مورّد', 'Supplier Approval Request'),
        text: both(
          'اعتماد المورّد أو المصنّع قبل التوريد، مع وثائق التأهيل.',
          'Approve the supplier or manufacturer before delivery, with prequalification documents.',
        ),
      },
      {
        code: 'MAR',
        name: both('طلب اعتماد مواد', 'Material Approval Request'),
        text: both('اعتماد المواد بالمواصفات والعينات وشهادات الاختبار.', 'Approve materials with specifications, samples and test certificates.'),
      },
      {
        code: 'DAR',
        name: both('طلب اعتماد مخططات', 'Drawing Approval Request'),
        text: both(
          'اعتماد المخططات التنفيذية بإصداراتها وملاحظات الاستشاري.',
          'Approve shop drawings across revisions, with the consultant’s comments.',
        ),
      },
      {
        code: 'MIR',
        name: both('طلب استلام مواد', 'Material Inspection Request'),
        text: both('فحص المواد عند وصولها إلى الموقع ومطابقتها للمعتمد.', 'Inspect materials on arrival at site against what was approved.'),
      },
      {
        code: 'WIR',
        name: both('طلب استلام أعمال', 'Work Inspection Request'),
        text: both('استلام الأعمال المنفذة قبل الانتقال إلى المرحلة التالية.', 'Hand over completed work before moving to the next stage.'),
      },
      {
        code: 'RFI',
        name: both('طلب معلومات', 'Request for Information'),
        text: both(
          'استفسار فني موثّق من المقاول إلى الاستشاري، مع مدة الرد.',
          'A documented technical query from contractor to consultant, with a reply deadline.',
        ),
      },
      {
        code: 'DAS',
        name: both('طلب اعتماد مستند', 'Document Approval Submittal'),
        text: both('اعتماد المستندات العامة مثل خطط الجودة والسلامة.', 'Approve general documents such as quality and safety plans.'),
      },
      {
        code: 'NPD',
        name: both('إشعار بتأخير محتمل', 'Notice of Possible Delay'),
        text: both(
          'إشعار مبكر موثّق بتأخير محتمل، يحفظ الحق قبل وقوعه.',
          'An early, documented notice of a possible delay that protects your rights.',
        ),
      },
      {
        code: 'NPV',
        name: both('إشعار بتغيير محتمل', 'Notice of Possible Variation'),
        text: both('إشعار مبكر موثّق بتغيير محتمل في النطاق أو التكلفة.', 'An early, documented notice of a possible change in scope or cost.'),
      },
    ],
  },
  why: {
    eyebrow: both('لماذا ربائد', 'Why Rabaed wins'),
    title: both('ثلاث ميزات لا يجمعها منافس في آن واحد.', 'Three things no competitor can claim at once.'),
    reasons: [
      {
        name: both('واجهة عربية سهلة الاستخدام', 'User-friendly Arabic interface'),
        text: both(
          'واجهة عربية بالكامل وشاشات بسيطة. أي مهندس موقع يستخدمها من اليوم الأول، دون تدريب طويل. وللفرق غير العربية واجهة إنجليزية.',
          'A fully Arabic interface with simple screens. Any site engineer can use it from day one, with no long training. Non-Arabic teams get an English interface.',
        ),
      },
      {
        name: both('دعم ميداني في موقعك', 'Onsite support'),
        text: both(
          'فريقنا يأتي إلى موقعك في السعودية: يؤسس النظام، ويدرّب فريقك، ويحل المشكلات بسرعة. نفس اللغة، ونفس المنطقة الزمنية.',
          'Our team comes to your site in Saudi Arabia: we set it up, train your people and fix problems fast. Same language, same time zone.',
        ),
      },
      {
        name: both('مبني ومسعّر للشركات الصغيرة والمتوسطة', 'Built and priced for SMEs'),
        text: both(
          'مصمّم للشركات والمكاتب التي تدير من 2 إلى 10 مشاريع، كلها من حساب واحد. اشتراك سنوي واضح، بدون عقود ضخمة ولا رسوم خفية.',
          'Made for firms running 2 to 10 projects, all from one account. One clear yearly subscription, with no big contracts and no hidden fees.',
        ),
      },
    ],
  },
  impact: {
    eyebrow: both('الأثر', 'The impact'),
    title: both('تأثير موثّق بالأرقام.', 'Proven impact, in numbers.'),
    lead: both(
      'مقارنةً بالدورة الورقية على المشروع نفسه، بعد عمل المالك والاستشاري والمقاول على المنصة.',
      'Against the paper cycle on the same project, once the owner, the consultant and the contractor work on the platform.',
    ),
    figures: [
      { figure: '3.6×', unit: both('', ''), label: both('أسرع في الاعتمادات والاستلامات', 'Faster approvals and handovers') },
      { figure: '7×', unit: both('', ''), label: both('أسرع في استرجاع الوثائق', 'Faster document retrieval') },
      { figure: '31%', unit: both('', ''), label: both('توفير في وقت المهام الإدارية', 'Time saved on admin tasks') },
      { figure: '22%', unit: both('', ''), label: both('تحسّن في حوكمة الوثائق', 'Better document control') },
      { figure: '+1,900', unit: both('', ''), label: both('معاملة اعتماد موثّقة على المنصة', 'Approvals documented on the platform') },
      { figure: '15', unit: both('دقيقة', 'min'), label: both('جلسة تعريفية واحدة لكل فريق', 'One introductory session per team') },
    ],
    activation: both('تفعيل ميداني كامل خلال أيام، دون توقف العمل.', 'Fully live on site within days, with no stoppage.'),
    source: both('المصدر: بيانات مشاريع ربائد', 'Source: Rabaed project data'),
  },
  plans: {
    eyebrow: both('الباقات', 'Plans'),
    title: both(
      'باقات الاشتراك مرنة، مُفصَّلة، ولا تقارن بالبرامج العالمية المشابهة.',
      'Flexible, tailored plans, priced well below comparable global software.',
    ),
    badge: both('الأكثر طلباً', 'Most requested'),
    tiers: [
      {
        kicker: both('البداية', 'Starter'),
        name: both('الأساسية', 'Basic'),
        features: [
          both('مشروع نشط واحد', 'One active project'),
          both('قوالب عربية قياسية', 'Standard Arabic templates'),
          both('ضمان استرداد خلال 60 يوماً', '60-day money-back guarantee'),
        ],
      },
      {
        kicker: both('الأكثر اختياراً', 'Most chosen'),
        name: both('النمو', 'Growth'),
        features: [
          both('حتى 5 مشاريع نشطة', 'Up to 5 active projects'),
          both('مستخدمون غير محدودين', 'Unlimited users'),
          both('تخزين سحابي غير محدود', 'Unlimited cloud storage'),
          both('دعم مخصّص', 'Dedicated support'),
        ],
      },
      {
        kicker: both('رسوم سنوية ثابتة', 'Fixed annual fee'),
        name: both('الاحترافية', 'Professional'),
        features: [
          both('مشاريع ومستخدمون بلا حدود', 'Unlimited projects and users'),
          both('دعم ميداني مخصّص', 'Dedicated onsite support'),
          both('سير عمل وهوية بصرية مخصّصة', 'Custom workflows and branding'),
          both('ضمان توفّر الدعم', 'Guaranteed support availability'),
          both('توطين البيانات', 'Data localization'),
        ],
      },
    ],
  },
  start: {
    eyebrow: both('كيف نبدأ', 'How we start'),
    title: both(
      'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.',
      'Our team on your site. All three parties on the platform within days.',
    ),
    steps: [
      {
        name: both('إعداد', 'Set up'),
        text: both(
          'نُعدّ المشروع والنماذج، وندعو المالك والاستشاري والمقاول، و15 دقيقة مع كل فريق.',
          'We set up the project and its forms, invite the owner, the consultant and the contractor, and spend 15 minutes with each team.',
        ),
      },
      {
        name: both('تشغيل', 'Go live'),
        text: both(
          'خلال أيام، دون توقف العمل. يبدأ الجميع من حيث وصل المشروع، ونستورد الجدول الزمني من Primavera P6 أو MS Project.',
          'Within days, with no stoppage. Everyone starts from where the project has got to, and we import the schedule from Primavera P6 or MS Project.',
        ),
      },
      {
        name: both('ضمان 60 يوماً', '60-day guarantee'),
        text: both(
          'لم تروا فرقاً بعد التفعيل؟ نعيد كامل المبلغ ونسلّمكم نسخة من السجل.',
          'Not seeing a difference after activation? We refund the full amount and hand you a copy of the record.',
        ),
      },
    ],
    cardTitle: both('احجز عرضاً حياً بأمثلة من مشروعك', 'Book a live demo with examples from your project'),
    cardLine: both(
      '30 دقيقة · بالعربية · شاركنا اعتماداً واحداً ونريك ما كان ربائد سيفعله',
      '30 minutes · walk us through one approval and we’ll show you what Rabaed would have done',
    ),
    demoLabel: both('احجز عرضاً حياً', 'Book a live demo'),
    whatsappLabel: both('تواصل واتساب', 'WhatsApp us'),
    demoLink: both('/#demo', '/en#demo'),
    whatsappLink: both('', ''),
  },
  contact: {
    tagline: both('نسعى لتشكيل مستقبل تكنولوجيا الإنشاءات.', 'We shape the future of construction technology.'),
    name: both('أحمد السوسي', 'Ahmed Alsosi'),
    phoneLabel: both('الجوال', 'Mobile'),
    phone: '+966 59 600 6615',
    emailLabel: both('البريد', 'Email'),
    email: 'Ahmed.s@rabaedapp.com',
    whatsappLabel: both('واتساب الشركة', 'Company WhatsApp'),
    location: both('الرياض، المملكة العربية السعودية', 'Riyadh, Saudi Arabia'),
  },
  whatsappButton: {
    label: both('تواصل واتساب', 'WhatsApp us'),
    link: both('', ''),
  },
} as const;
