import { localePath } from '@/lib/locales';

/**
 * «الشروط باختصار» on the referral page: the Referral Terms in eight points,
 * and a link to the full terms, which are binding where this is a summary
 * (ticket 17).
 *
 * Each point is its lead phrase in bold and the rest of its sentence, which
 * begins with whatever follows the bold on the Reference site — a space or a
 * comma.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
const TERMS = [
  { lead: 'الإحالة بالمشروع لا بالعميل.', rest: ' تُحتسب عن كل مشروع جديد يبدأ اشتراكه بكودك.' },
  { lead: 'يُقدَّم الكود عند طلب العرض التوضيحي', rest: '، أي قبل بدء التفاوض — لا عند التوقيع.' },
  { lead: 'لا يُقبل الكود لعميل قائم', rest: ' أو لمشروع سبق أن تواصلنا بشأنه مع المالك.' },
  { lead: 'الاشتراك السنوي المدفوع مقدماً', rest: ' هو ما يُحتسب عليه المبلغ.' },
  { lead: 'الاستحقاق عند تحصيل قيمة الاشتراك', rest: '، لا عند التوقيع.' },
  { lead: 'الصرف خلال 7 أيام عمل', rest: ' من نهاية الشهر الذي تحقق فيه الاستحقاق، على الآيبان المسجّل.' },
  { lead: 'الإلغاء والاسترداد', rest: ' خلال فترة الاسترداد النظامية يُلغي المبلغ أو يُخصم من مستحقات لاحقة.' },
  { lead: 'إقرار عدم التعارض', rest: ' يُوقَّع إلكترونياً عند التسجيل.' },
] as const;

export function TermsSummary() {
  return (
    <section id="terms" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">الشروط باختصار</div>
          <h2>الشروط في ثماني نقاط</h2>
        </div>
        <ol className="t8">
          {TERMS.map((term, index) => (
            <li key={term.lead}>
              <i>{index + 1}</i>
              <span>
                <b>{term.lead}</b>
                {term.rest}
              </span>
            </li>
          ))}
        </ol>
        <div className="tz-foot">
          <a className="tz-more" href={localePath('ar', '/referral-terms')}>
            الشروط والأحكام الكاملة<span className="ar">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
