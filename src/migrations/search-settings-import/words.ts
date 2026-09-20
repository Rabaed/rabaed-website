/**
 * How each page appeared in a search result until ticket 26, as the six
 * content modules stated it: verbatim from `src/content/pages/*.ts`, which
 * took them verbatim from the Reference site's own `<head>`.
 *
 * **Frozen.** This is the entry's first published version, and the site does
 * not read it: it reads the CMS, where Ahmed has changed it since.
 *
 * The referral page's two lines name the Referral Program's amounts rather
 * than stating them — `{payout}` and `{clientDiscount}` — exactly as the page
 * quoted them in code before (ticket 56), so that changing an amount still
 * changes every mention.
 */

const arabic = (text: string) => ({ ar: text });

export const SEARCH_SETTINGS = {
  home: {
    title: arabic('ربائد · ثلاثة أطراف. سجل واحد.'),
    description: arabic('منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.'),
  },
  product: {
    title: arabic('ربائد · المنتج — من الطلب إلى الاعتماد'),
    description: arabic('كيف تمر معاملة واحدة من الطلب إلى الاعتماد، وماذا يرى كل طرف حين يفتح المنصة.'),
  },
  start: {
    title: arabic('ربائد · ابدأ — كيف نبدأ والأسئلة الشائعة'),
    description: arabic('ثلاث خطوات حتى التشغيل، الضمان، الاشتراك، والأسئلة الشائعة.'),
  },
  tool: {
    title: arabic('ربائد · متتبّع الصبّات واختبارات الكسر — أداة مجانية'),
    description: arabic(
      'ملف HTML واحد يفتح بنقرتين. سجّل الصبّة واعرف موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر. بدون حساب، بدون سيرفر، بياناتك تبقى على جهازك.',
    ),
  },
  referral: {
    title: arabic('ربائد · برنامج الإحالة — {payout} ريال عن كل مشروع'),
    description: arabic('أحِل مشروعاً واحداً واكسب {payout} ريال صافية، ويحصل عميلك على خصم {clientDiscount} على اشتراك مشروعه.'),
  },
  partnership: {
    title: arabic('ربائد · برنامج الشراكات للمكاتب الهندسية'),
    description: arabic('شراكة تُصمَّم معك: تسعير شريك، أو رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.'),
  },
};
