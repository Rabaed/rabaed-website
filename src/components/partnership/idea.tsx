import { localePath } from '@/lib/locales';

/**
 * «الفكرة» on the partnership page: why an office is offered a partnership
 * rather than a referral fee, and the note that sends a visitor who wants the
 * simpler arrangement to the Referral Program.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
export function Idea() {
  return (
    <section id="idea" className="light pad">
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">الفكرة</div>
          <h2>لماذا شراكة، لا عمولة؟</h2>
        </div>
        <div className="lead-block">
          <p>
            المكتب الذي يشرف على عشرة مشاريع في وقت واحد ليس «مُحيلاً». هو الطرف الذي يعيش على المنصة يومياً، ويُدخل الاعتمادات والملاحظات وتقارير الموقع، وهو من يقنع المالك بأسلوب عمل أفضل.
          </p>
          <p>
            ولذلك لا نعرض على المكاتب عمولة على ترشيح. نجلس معك، ونفهم كيف تبيع خدماتك اليوم وكيف تفوتر عميلك، ثم نبني نموذج تعاون يناسب ذلك — تسعير شريك، رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.
          </p>
        </div>
        {/* One string, its trailing space included, for the reason the
            referral page's audience note gives. */}
        <div className="gain" style={{ marginTop: '22px' }}>
          {'تبحث عن ترتيب فردي أبسط — كود تشاركه وتستلم عنه مبلغاً ثابتاً؟ '}
          <a className="inl" href={localePath('ar', '/referral')}>
            انتقل إلى برنامج الإحالة ←
          </a>
        </div>
      </div>
    </section>
  );
}
