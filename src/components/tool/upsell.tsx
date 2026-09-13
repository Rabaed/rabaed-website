import { localePath } from '@/lib/locales';

const CLOUD_ADDS = [
  'كل مشاريعك في لوحة واحدة، مع مقارنة بينها',
  'اعتماد إلكتروني فوري من الاستشاري — بدون بريد',
  'حساب للمختبر يرفع تقريره مباشرة',
  'ربط مع منصة ربائد: الوثائق، التقارير اليومية، المراسلات',
  'سجل تدقيق موثّق لكل تغيير ومن قام به',
] as const;

/**
 * «الخطوة التالية»: the end of the tool page, for a visitor who needs more than
 * one project — what Rabaed adds, and the way to the start and product pages.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function Upsell() {
  return (
    <section id="up" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tl-up">
          <div>
            <div className="eyebrow">الخطوة التالية</div>
            <h2 style={{ fontSize: '28px', lineHeight: 1.38, margin: 0 }}>تحتاج أكثر من مشروع واحد؟</h2>
            <p className="lead" style={{ marginTop: '12px' }}>
              الأداة المجانية تصل إلى حدها الطبيعي عندما يدخل شخص ثانٍ على السجل. عندها تبدأ النسخة السحابية.
            </p>
            <div className="ctas" style={{ marginTop: '20px' }}>
              <a className="btn p" href={localePath('ar', '/start')}>
                اطلب النسخة السحابية
              </a>
              <a className="btn o" href={localePath('ar', '/product')}>
                تعرّف على المنصة
              </a>
            </div>
          </div>
          <ul className="tl-up-list">
            {CLOUD_ADDS.map((line) => (
              <li key={line}>
                <i>✦</i>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="tl-foot-line">صُنعت في ربائد لمهندسي المواقع. الأداة مجانية — استخدمها كما تشاء.</p>
      </div>
    </section>
  );
}
