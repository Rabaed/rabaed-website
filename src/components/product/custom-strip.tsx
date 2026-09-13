/**
 * «ومشروعك يحتاج أكثر؟» — the two things Rabaed builds for a project that
 * needs them, each pointing at the demo where they are asked about.
 *
 * A server component with no behaviour. All copy is verbatim from
 * `reference/site/product.html`.
 */

const ON_REQUEST = [
  {
    title: 'الجداول الزمنية ومتابعة الإنجاز',
    body: 'استيراد جداول Primavera P6 و MS Project، المسار الحرج، وأثر كل تحديث زمني على موعد التسليم.',
  },
  {
    title: 'جدول الكميات والمستخلصات',
    body: 'جدول كميات تفاعلي ومستخلصات مبنية على الطلبات المعتمدة فعلاً — لا على ما يُكتب في نهاية الشهر.',
  },
];

export function CustomStrip() {
  return (
    <section id="custom" className="light">
      <div className="wrap">
        <div className="eyebrow">يُخصَّص حسب المشروع</div>
        <h2>ومشروعك يحتاج أكثر؟</h2>
        <div className="strip">
          {ON_REQUEST.map((feature) => (
            <div className="c" key={feature.title}>
              <span className="badge">حسب المشروع</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              {/* The demo request form, in the closing section at the foot of
                  this page. */}
              <a href="#demo">اسأل عنها في العرض التوضيحي ←</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
