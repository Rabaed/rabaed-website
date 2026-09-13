import type { ReactNode } from 'react';
import { StepCards, type StepCard } from '@/components/step-cards';

/**
 * The tool page's reading sections, between its hero and its download form:
 * why the tool exists, what it does, the three steps to a first pour, where
 * its files live, and what it needs to run. Server components, with nothing
 * that moves.
 *
 * All copy is verbatim from `reference/site/tool.html`, Arabic-Indic numerals
 * included where the Reference site writes them.
 */

/** A section's heading, with the line under it. */
function TeaserHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="tz-head">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {lead && (
        <p className="lead" style={{ marginTop: '12px' }}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** A card of the three-across row: its label, title and text. */
function Card({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="rt-c">
      <div className="k">{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/** A list of ticked lines, here and beside the download form. */
export function TickList({ children }: { children: ReactNode }) {
  return <ul className="tl-tick">{children}</ul>;
}

/** A ticked line: an optional bold opening, then the rest. */
export function Tick({ children }: { children: ReactNode }) {
  return (
    <li>
      <i>✓</i>
      <span>{children}</span>
    </li>
  );
}

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

/** The five states a test can be in, as the first card's legend draws them. */
const STATES = [
  { tone: 'idle', label: 'بعيد' },
  { tone: 'warn', label: '٣ أيام أو أقل' },
  { tone: 'bad', label: 'متأخر' },
  { tone: 'info', label: 'عند الاستشاري' },
  { tone: 'ok', label: 'معتمد' },
] as const;

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
          {[
            'عناصر متعددة في الصبّة الواحدة، مع وسم المبنى والدور',
            'صور الموقع تُصغَّر قبل الحفظ حتى لا ينتفخ المجلد',
            'تصدير CSV لكامل السجل بضغطة واحدة',
            'بحث وفلاتر حسب الحالة والعنصر والمورّد والتاريخ',
          ].map((also) => (
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

export function Privacy() {
  return (
    <section id="data" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tl-2">
          <div>
            <div className="eyebrow">الخصوصية</div>
            <h2 style={{ fontSize: '28px', lineHeight: 1.4, margin: 0 }}>
              ملفاتك لا تغادر جهازك — لأنه لا يوجد مكان تذهب إليه
            </h2>
            <TickList>
              <Tick>
                <b>لا يوجد سيرفر نرفع إليه شيئاً.</b> لا حساب، لا تسجيل دخول، لا قاعدة بيانات عندنا. الأداة لا تعرف عنك
                شيئاً.
              </Tick>
              <Tick>
                <b>مجلد واحد يملكه المشروع.</b> تختاره أنت، ويحوي ملف السجل ومجلد المرفقات. انسخه، ارفعه على الشبكة
                الداخلية، أو خذه معك — يعمل كما هو.
              </Tick>
              <Tick>
                <b>ملف نصي مفتوح، وليس صندوقاً مغلقاً.</b>{' '}
                <span className="mono" dir="ltr">
                  concrete_db.json
                </span>{' '}
                تقرؤه، تنسخه احتياطياً، وتفتحه بأي أداة. لا شيء محبوس في مخزن متصفح لا تصل إليه.
              </Tick>
              <Tick>
                <b>تعمل والإنترنت مقطوع.</b> في القبو، في موقع بعيد، أو في طائرة. (الخطوط فقط تُجلب من الإنترنت في أول
                فتح — بدونها يتغيّر شكل الخط ويبقى كل شيء يعمل.)
              </Tick>
            </TickList>
          </div>
          <div>
            <div className="tl-tree">
              <div className="rt">
                <span className="fo" />
                برج النخيل — المرحلة ٢
              </div>
              <div className="ln">
                <span className="fn mono" dir="ltr">
                  concrete_db.json
                </span>
                <span className="ds">كل صبّة واختبار وحالة</span>
              </div>
              <div className="ln">
                <span className="fn mono" dir="ltr">
                  attachments/
                </span>
                <span className="ds">التقارير والموافقات والصور</span>
              </div>
              <div className="ln sub">
                <span className="fn mono" dir="ltr">
                  ANT-014 d7 lab report.pdf
                </span>
              </div>
              <div className="ln sub">
                <span className="fn mono" dir="ltr">
                  ANT-014 photo IMG_4471.jpg
                </span>
              </div>
            </div>
            <p className="tl-cap">هذا هو كل ما تنتجه الأداة على جهازك. لا شيء غيره، ولا شيء في مكان آخر.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Requirements() {
  return (
    <section id="req" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow="المتطلبات" title="ما الذي تحتاجه لتشغيلها" />
        <div className="rt-row">
          <Card label="النظام" title="سطح المكتب" text="ويندوز أو ماك أو لينكس." />
          <Card label="التجربة الكاملة" title="Chrome أو Edge" text="مع حفظ المرفقات داخل مجلد المشروع." />
          <Card label="وضع مبسّط" title="Firefox و Safari" text="السجلات داخل المتصفح والمرفقات معطّلة." />
        </div>
      </div>
    </section>
  );
}
