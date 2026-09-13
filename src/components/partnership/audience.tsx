/**
 * «لمن هذا البرنامج» on the partnership page: the four kinds of firm it is
 * for, two to a row at desktop widths (`programmes.css`).
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
const AUDIENCE = [
  { title: 'المكاتب الهندسية الاستشارية', text: 'التي تشرف على مشاريع مطوّرين من القطاع الخاص.' },
  { title: 'شركات إدارة المشاريع (PMC)', text: 'التي تدير محافظ مشاريع لعملاء متعددين.' },
  { title: 'مجموعات المقاولات', text: 'التي تنفّذ عدة مشاريع بالتوازي وتحتاج سجلاً موحّداً مع الاستشاري.' },
  { title: 'مطوّرون عقاريون متعددو المشاريع', text: 'الذين يريدون ترتيباً على مستوى المحفظة لا المشروع الواحد.' },
] as const;

export function Audience() {
  return (
    <section id="who" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">لمن هذا البرنامج</div>
          <h2>لمن هذا البرنامج</h2>
        </div>
        <div className="rt-row two">
          {AUDIENCE.map((kind, index) => (
            <div key={kind.title} className="rt-c">
              <div className="k">{String(index + 1).padStart(2, '0')}</div>
              <h3>{kind.title}</h3>
              <p>{kind.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
