import { Card, TeaserHead } from '@/components/tool/parts';

/** The five states a test can be in, as the first card's legend draws them. */
const STATES = [
  { tone: 'idle', label: 'بعيد' },
  { tone: 'warn', label: '٣ أيام أو أقل' },
  { tone: 'bad', label: 'متأخر' },
  { tone: 'info', label: 'عند الاستشاري' },
  { tone: 'ok', label: 'معتمد' },
] as const;

const ALSO = [
  'عناصر متعددة في الصبّة الواحدة، مع وسم المبنى والدور',
  'صور الموقع تُصغَّر قبل الحفظ حتى لا ينتفخ المجلد',
  'تصدير CSV لكامل السجل بضغطة واحدة',
  'بحث وفلاتر حسب الحالة والعنصر والمورّد والتاريخ',
] as const;

/**
 * «ما الذي تفعله»: six cards, the first with the legend of a test's states,
 * and four more things it does under them.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function Features() {
  return (
    <section id="features" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead
          eyebrow="ما الذي تفعله"
          title="ستة أشياء تختصر عليك متابعة شهر كامل"
          lead="كل ما تحتاجه لملف خرسانة نظيف — في ملف واحد على جهازك."
        />
        <div className="rt-row tl-feat">
          <div className="rt-c">
            <div className="k">01</div>
            <h3>عدّ تنازلي يحسب نفسه</h3>
            <p>أدخل تاريخ الصبّة فقط. الأداة تحسب موعد ٧ و ٢٨ يوماً وتعطي كل اختبار لوناً يقول حالته من مسافة متر.</p>
            <div className="tl-legend">
              {STATES.map((state) => (
                <span key={state.tone} className={`tl-s lt ${state.tone}`}>
                  <i />
                  {state.label}
                </span>
              ))}
            </div>
          </div>
          <Card
            label="02"
            title="المرفق هو الذي يحرّك الحالة"
            text="أرفق تقرير المختبر فتصبح الحالة «مستلم من المختبر» ويختفي زر تذكير المختبر. أرفق موافقة الاستشاري فيُغلق الاختبار أخضر. الحركة للأمام فقط — الاختبار المرفوض لا ينقلب معتمداً بصمت لأن أحدهم أسقط ملفاً."
          />
          <Card
            label="03"
            title="تذكير المختبر بنقرة"
            text="زر واحد يفتح بريدك أنت، بالموضوع والنص جاهزين، موجّهاً إلى بريد المختبر المسجّل في بيانات المشروع. الرسالة تخرج من عنوانك — وهذا ما يجعل المطالبة تصل فعلاً. كل تذكير يُسجَّل في تاريخ الاختبار."
          />
          <Card
            label="04"
            title="بوالص التوريد كما تصل"
            text="البوالص تصل طوال الصباح بعد تسجيل الصبّة بوقت طويل. أضف صفاً وقتما تشاء، أو الصق دفعة كاملة من جدولك: رقم البوليصة، الكمية، رقم الخلاطة، الوقت. يُحفظ فوراً ويحدّث إجمالي الكمية."
          />
          <Card
            label="05"
            title="ورقة اعتماد A4 جاهزة"
            text="كل بيانات الصبّة والعناصر والاختبارات والصور، مرتّبة في ورقة واحدة بخانات التواقيع الثلاث. اضغط طباعة وسلّمها كما هي، أو احفظها PDF."
          />
          <Card
            label="06"
            title="عربية وإنجليزية بالكامل"
            text="واجهة عربية بترتيب من اليمين لليسار — لا ترجمة نصف مكتملة ولا حقول مقلوبة. اختيار اللغة محفوظ لكل من يفتح الملف."
          />
        </div>
        <ul className="tl-also">
          {ALSO.map((also) => (
            <li key={also}>
              <i>+</i>
              <span>{also}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
