/**
 * «مسار الشراكة» on the partnership page: the four stages from a first meeting
 * to a first project, beside a link to the application form. The hero's «كيف
 * نبني الشراكة ↓» lands here.
 *
 * The stages are the closing section's `.tail-steps` (`shell.css`), with a
 * heading of their own in each — `.ph`, and HANDOFF §7.4's wrapping exception
 * in `programmes.css`.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
const STAGES = [
  {
    number: '01',
    title: 'اجتماع تعارف',
    text: 'جلسة نفهم فيها حجم مكتبك، طبيعة عملائك، وكيف تُبنى عروضك اليوم. ونعرض المنصة كما يستخدمها الاستشاري فعلياً.',
  },
  {
    number: '02',
    title: 'تصميم نموذج التعاون',
    text: 'نتفق على النمط، وآليات التسعير، والالتزامات المتبادلة، ومؤشرات النجاح.',
  },
  {
    number: '03',
    title: 'الاتفاقية والتأهيل',
    text: 'توقيع اتفاقية الشراكة، وتأهيل فريقك، وتجهيز المواد التي تحتاجها لعرض المنصة على عملائك.',
  },
  {
    number: '04',
    title: 'الإطلاق على أول مشروع',
    text: 'نُطلق معك على مشروع واحد كنموذج، ونتابع معك أولاً بأول حتى يستقر العمل.',
  },
] as const;

export function Path() {
  return (
    <section id="path" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tail-grid">
          <div>
            <div className="eyebrow">مسار الشراكة</div>
            <h2 style={{ fontSize: '32px' }}>من أول اجتماع إلى أول مشروع</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              أربع مراحل واضحة، ولا شيء منها يحتاج قراراً نهائياً منك قبل أن ترى المنصة كما يستخدمها الاستشاري فعلياً.
            </p>
            <div className="tz-foot">
              <a className="tz-more" href="#apply">
                اطلب اجتماع شراكة<span className="ar">←</span>
              </a>
            </div>
          </div>
          <ul className="tail-steps">
            {STAGES.map((stage) => (
              <li key={stage.number}>
                {/* The whole label in DM Mono, as the home and product pages'
                    closing steps are: `.tail-steps b` is theirs too, and waits
                    on bug 45's decision with them. One string, so the server
                    does not split it into two runs of text. */}
                <b>{`المرحلة ${stage.number}`}</b>
                <span>
                  <b className="ph">{stage.title}</b>
                  {stage.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
