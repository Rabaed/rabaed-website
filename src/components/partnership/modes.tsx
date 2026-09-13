import { StepCards, type StepCard } from '@/components/step-cards';

/**
 * «أنماط التعاون» on the partnership page: the three ways an office can work
 * with Rabaed, each in the start page's step card with a line on who it suits,
 * and the note that the terms of each are agreed, not listed.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
const MODES: readonly StepCard[] = [
  {
    number: '01',
    label: 'التضمين في العرض',
    title: 'المنصة ضمن نطاق خدماتك',
    text: 'تُدرج المنصة ضمن نطاق خدماتك في العرض الذي تقدّمه للمالك، وتفوترها ضمن أتعابك. يحصل المكتب على تسعير شريك، وتبقى علاقة العميل التعاقدية معك.',
    markedOut: false,
    fit: 'مناسب لـ: المكاتب التي تريد تمييز عرضها الفني وإضافة مصدر دخل ضمن الأتعاب.',
  },
  {
    number: '02',
    label: 'رخصة المكتب',
    title: 'اشتراك على مستوى المكتب',
    text: 'يغطي مشاريعه القائمة والجديدة تحت مظلة واحدة، بلوحة إشراف موحّدة على كل المشاريع.',
    markedOut: false,
    fit: 'مناسب لـ: المكاتب التي تدير عدداً ثابتاً من المشاريع وتريد توحيد أسلوب العمل عليها كلها.',
  },
  {
    number: '03',
    label: 'الترشيح المعتمد',
    title: 'نتعاقد نحن مع المالك',
    text: 'ترشّح المنصة للمالك ونتعاقد نحن معه مباشرة، مع ترتيب متفق عليه للمكتب وأولوية في الدعم على مشاريعه.',
    markedOut: false,
    fit: 'مناسب لـ: المكاتب التي تفضّل ألا تدخل المنصة في فوترتها مع العميل.',
  },
];

export function Modes() {
  return (
    <section id="modes" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">أنماط التعاون</div>
          <h2>ثلاثة أنماط — ونختار معك ما يناسب طريقة عملك</h2>
        </div>
        <StepCards steps={MODES} />
        {/* Each run of text one string, so the bold lands where the Reference
            site's does. */}
        <div className="gain" style={{ marginTop: '22px' }}>
          {'شروط كل نمط — التسعير، مدى الحصرية، حدود الجغرافيا أو نوع العميل — تُحدَّد في اتفاقية الشراكة بعد اجتماع تصميم النموذج. '}
          <b>لا نضع تسعيراً موحّداً</b>
          {' لأن المكاتب تختلف في حجمها وطبيعة عملائها.'}
        </div>
      </div>
    </section>
  );
}
