import { HeroLoop } from '@/components/home/hero-loop';
import { HERO_JOURNEY, HERO_STATIONS, HERO_START } from '@/components/home/hero-stations';

/**
 * The home page's opening screen: the promise in three lines, and beside it a
 * document travelling between the Owner, the Consultant and the Contractor.
 *
 * A server component. Every word, every building and the document itself are
 * in the first response at their starting positions; `HeroLoop` only sets them
 * moving (ADR-0001). With JavaScript off, or motion turned down, what remains
 * is a complete and legible diagram of the three parties.
 *
 * The diagram is decorative to a screen reader — three cropped drawings and a
 * moving sprite say nothing when read aloud — so the images carry an empty
 * `alt` and the `.vh` line states in words what the picture states in pictures.
 */
export function Hero() {
  return (
    <section id="hero" className="dark">
      <div className="glow" />
      <div className="glow2" />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">نظام تشغيل مشاريع الإنشاء · ربائد</div>
            <h1>
              ثلاثة أطراف.
              <br />
              سجل واحد.
              <br />
              <span>مسؤولية واضحة.</span>
            </h1>
            <p className="lead">
              ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات
              وطلبات فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة
              باسم من قام بها.
            </p>
            <div className="ctas">
              {/* Both anchors point at sections later tickets build: the demo
                  form is ticket 27, inside the closing section of ticket 11,
                  and the journey is ticket 08. Until then they behave as the
                  Reference site's own do on its sub-pages — they go nowhere. */}
              <a className="btn p" href="#demo">
                احجز عرضاً حياً
              </a>
              <a className="btn g" href="#journey">
                استكشف المنصة ↓
              </a>
            </div>
            <div className="trust">عرض على مشروع حقيقي · 30 دقيقة · بالعربية</div>
            {/* Only the numeral is `.mono`: DM Mono has no Arabic glyphs, so
                setting "يوماً" in it drops the word to a last-resort monospace
                face (spec: Design system). The Reference site wraps both. */}
            <div className="guar">
              <b>
                <span className="mono">60</span> يوماً
              </b>{' '}
              ضمان استرجاع كامل المبلغ
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-art" id="hero-art">
              {/* The three dashed routes between the buildings, drawn in the
                  art box's own 600×360 coordinates so they scale with it. */}
              <svg className="hlines" viewBox="0 0 600 360" fill="none" aria-hidden="true">
                <g
                  stroke="rgba(255,255,255,.2)"
                  strokeWidth="1.6"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                >
                  <line x1="202" y1="272" x2="400" y2="272" />
                  <line x1="421" y1="214" x2="358" y2="161" />
                  <line x1="242" y1="161" x2="180" y2="214" />
                </g>
              </svg>

              {Object.entries(HERO_STATIONS).map(([key, station]) => (
                <img
                  key={key}
                  className="bld"
                  src={station.building.src}
                  alt=""
                  aria-hidden="true"
                  width={station.building.intrinsic.width}
                  height={station.building.intrinsic.height}
                  style={{ left: `${station.left}%`, top: `${station.top}%`, width: `${station.building.width}%` }}
                />
              ))}

              <span
                className="hpulse"
                id="h-pulse"
                style={{ left: `${HERO_START.left}%`, top: `${HERO_START.top}%` }}
              />
              <img
                className="spr"
                id="h-doc"
                src="/hero/hero-doc.webp"
                alt=""
                aria-hidden="true"
                width={107}
                height={133}
                style={{ left: `${HERO_START.left}%`, top: `${HERO_START.top}%`, width: '7%' }}
              />

              {Object.entries(HERO_STATIONS).map(([key, station]) => (
                <span
                  key={key}
                  className="party"
                  style={{ left: `${station.left}%`, top: `${station.labelTop}%` }}
                >
                  {station.name}
                </span>
              ))}

              <span className="vh">
                المالك والاستشاري والمقاول على سجل واحد: كل معاملة تنتقل بين الأطراف الثلاثة
                موثّقة ومؤرخة باسم من قام بها.
              </span>
            </div>

            {/* The pill the loop rewrites as the document arrives somewhere.
                It opens on the first step's own text, so the diagram reads
                correctly before — and without — any script. */}
            <div className="hero-status">
              <i />
              <b id="h-status">{HERO_JOURNEY[0].status}</b>
            </div>
          </div>
        </div>
      </div>

      <HeroLoop />
    </section>
  );
}
