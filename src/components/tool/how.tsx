import { StepCards, type StepCard } from '@/components/step-cards';
import { TeaserHead } from '@/components/tool/parts';

/**
 * The first step says the download starts as soon as the details are filled
 * in. That is what ticket 30 builds; until then the form unlocks but delivers
 * nothing (`download-form.tsx`), and the words describe the page as it will be.
 */
const STEPS: readonly StepCard[] = [
  {
    number: '01',
    label: 'حمّل الملف',
    title: 'ملف واحد',
    text: 'املأ البيانات بالأسفل ويبدأ التحميل مباشرة. ملف HTML واحد — احفظه في أي مكان على جهازك.',
    markedOut: false,
  },
  {
    number: '02',
    label: 'افتحه بنقرتين',
    title: 'بدون أي خادم',
    text: 'في Chrome أو Edge. يعمل من الملف مباشرة بدون أي خادم. لو نقلته لجهاز آخر يعمل هناك أيضاً.',
    markedOut: false,
  },
  {
    number: '03',
    label: 'اختر مجلد المشروع',
    title: 'مرة واحدة فقط',
    text: 'الأداة تطلب منك مجلداً مرة واحدة. من تلك اللحظة كل ما تسجّله يُكتب داخله، وتفتحه في المرة القادمة بنقرة واحدة.',
    markedOut: true,
  },
];

/**
 * «ثلاث خطوات»: from the download to a first pour, in the start page's step
 * cards.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function How() {
  return (
    <section id="how" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead
          eyebrow="ثلاث خطوات"
          title="من التحميل إلى أول صبّة مسجّلة — دقيقتان"
          lead="لا تثبيت، لا حساب، لا سيرفر محلي، لا Node، لا خطوة بناء."
        />
        <StepCards steps={STEPS} />
      </div>
    </section>
  );
}
