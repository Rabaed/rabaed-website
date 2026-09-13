import { localePath } from '@/lib/locales';

/**
 * «ما الذي تُحيله» on the referral page: Rabaed in two paragraphs, for a
 * referrer who has to explain it to someone else, and a link to the product
 * page.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
export function WhatIsReferred() {
  return (
    <section id="what" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">ما الذي تُحيله</div>
          <h2>ما الذي تُحيله بالضبط؟</h2>
        </div>
        <div className="lead-block">
          <p>
            ربائد منصّة تجمع المالك والاستشاري والمقاول على سجل واحد للمشروع: المراسلات الرسمية ومحاضر الاجتماعات وطلبات المعلومات، والاعتمادات وطلبات الفحص والتفتيش، والتقرير اليومي للموقع، ومستودع مستندات بأحدث نسخة معتمدة.
          </p>
          <p>
            كل مستند يحمل معه متى أُرسل، ومن اعتمده، وبأي ملاحظة، ومتى — فيبقى سجل المشروع كاملاً بعد تسليمه، لا مبعثراً بين بريد وواتساب ومجلدات مشتركة انتهت صلاحيتها.
          </p>
        </div>
        <div className="tz-foot">
          <a className="tz-more" href={localePath('ar', '/product')}>
            تعرّف على المنصة<span className="ar">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
