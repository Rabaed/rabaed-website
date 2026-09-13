import { StepCards, type StepCard } from '@/components/step-cards';

/**
 * «كيف يعمل» on the referral page: the four steps, each in a card of its own,
 * the payout last and marked out. The cards are the start and tool pages'
 * (`StepCards`), four across rather than three (`programmes.css`).
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
const STEPS: readonly StepCard[] = [
  {
    number: '01',
    label: 'سجّل',
    title: 'دقيقة واحدة',
    text: 'املأ نموذجاً من دقيقة واحدة، ويصلك كودك الخاص فوراً على جوالك وبريدك.',
    markedOut: false,
  },
  {
    number: '02',
    label: 'شارك الكود',
    title: 'مع صاحب القرار',
    text: 'الكود يمنحه خصم 10% على اشتراك مشروعه — فهو سبب حقيقي ليستخدمه، لا مجرد معرّف لك.',
    markedOut: false,
  },
  {
    number: '03',
    label: 'نتولّى الباقي',
    title: 'لا متابعة ولا بيع',
    text: 'يطلب العرض التوضيحي ويُدخل الكود. فريقنا يتواصل معه، ويعرض المنصة، ويتفق على التفاصيل.',
    markedOut: false,
  },
  {
    number: '04',
    label: 'استلم مستحقاتك',
    title: 'خلال 7 أيام عمل',
    text: 'عند تحصيل قيمة الاشتراك، تُحوَّل 2,000 ريال على حسابك خلال 7 أيام عمل من نهاية ذلك الشهر.',
    // The payout.
    markedOut: true,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="light pad">
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">كيف يعمل</div>
          <h2>أربع خطوات، وينتهي دورك بعد الثانية</h2>
        </div>
        <StepCards steps={STEPS} columns="four" />
      </div>
    </section>
  );
}
