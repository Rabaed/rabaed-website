import { localePath } from '@/lib/locales';

/**
 * «لمن هذا البرنامج» on the referral page: the five kinds of people it is open
 * to, and the note that sends engineering offices and project management
 * companies to the Partnership Program instead — a different programme for a
 * different audience (CONTEXT.md).
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
const AUDIENCE = [
  { title: 'مهندسون ومديرو مشاريع', text: 'تعرف من قرب كيف تضيع المراسلات والاعتمادات.' },
  { title: 'استشاريون مستقلون', text: 'تنتقل بين مشاريع ومطوّرين مختلفين.' },
  { title: 'مقاولون ومكاتب تنفيذ', text: 'تعمل مع أكثر من مالك في وقت واحد.' },
  { title: 'مستشارو تطوير عقاري ووسطاء', text: 'علاقتك بالمطوّرين هي أصلك الحقيقي.' },
  { title: 'صنّاع محتوى متخصصون', text: 'جمهورك من أهل القطاع.' },
] as const;

export function Audience() {
  return (
    <section id="who" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tz-head">
          <div className="eyebrow">لمن هذا البرنامج</div>
          <h2>إذا كنت داخل قطاع البناء، فأنت تعرف على الأرجح مطوّراً يحتاجنا</h2>
          <p className="lead" style={{ marginTop: '12px' }}>
            البرنامج مفتوح لكل من يعمل في محيط مشاريع التطوير العقاري في السعودية:
          </p>
        </div>
        <div className="rt-row">
          {AUDIENCE.map((kind, index) => (
            <div key={kind.title} className="rt-c">
              <div className="k">{String(index + 1).padStart(2, '0')}</div>
              <h3>{kind.title}</h3>
              <p>{kind.text}</p>
            </div>
          ))}
        </div>
        {/* The sentence after the bold is one string, its trailing space
            included: split in two, the server marks the join with a comment,
            the browser lays out two runs of text, and the link lands a
            hundredth of a pixel off the Reference site's. */}
        <div className="gain" style={{ marginTop: '22px' }}>
          إن كنت <b>مكتباً هندسياً أو شركة إدارة مشاريع</b>
          {' وتريد ترتيباً أوسع من الإحالة الفردية، فبرنامج الشراكات هو الأنسب لك. '}
          <a className="inl" href={localePath('ar', '/partnership')}>
            انتقل إلى برنامج الشراكات ←
          </a>
        </div>
      </div>
    </section>
  );
}
