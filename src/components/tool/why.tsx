import { Card, TeaserHead } from '@/components/tool/parts';

/**
 * «لماذا هذه الأداة»: the three reasons a concrete file runs late.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function Why() {
  return (
    <section id="why" className="light pad">
      <div className="wrap">
        <TeaserHead
          eyebrow="لماذا هذه الأداة"
          title="الصبّة تُنفَّذ في ساعة. متابعتها تستمر شهراً."
          lead="ثلاثة أشياء تجعل ملف الخرسانة يتأخر — ولا واحد منها له علاقة بجودة الخرسانة نفسها."
        />
        <div className="rt-row">
          <Card
            label="01"
            title="٧ و ٢٨ يوماً تمرّ بصمت"
            text="التاريخ الوحيد الذي تتذكره هو تاريخ الصبّة. مواعيد كسر المكعبات تمرّ داخل البرنامج الأسبوعي بلا تنبيه، وتكتشف التأخير في اللحظة التي يسأل فيها الاستشاري."
          />
          <Card
            label="02"
            title="التقرير موجود… في مكان ما"
            text="تقرير المختبر في واتساب، وموافقة الاستشاري في الإيميل، وصورة الصبّة في جوال المراقب. عند إعداد ملف التسليم تبحث في ثلاثة أماكن مختلفة."
          />
          <Card
            label="03"
            title="الجدول لا يطاردك"
            text="إكسل ممتاز في التخزين، وسيّئ في التذكير. لا يعرف أن اختبار اليوم متأخر، ولا يفرّق بين اختبار عند المختبر واختبار عند الاستشاري."
          />
        </div>
      </div>
    </section>
  );
}
