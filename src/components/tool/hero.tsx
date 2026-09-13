/**
 * The tool page's hero: what the Pour Tracker does, its two calls to action,
 * four promises, and beside them a drawing of the tool's own screen.
 *
 * **The drawing is markup, not an exported Screen mock**, and hidden from
 * assistive technology, as on the Reference site. ADR-0002 turns Rabaed app
 * screens into images because they are thousands of lines of machine-made
 * markup; this is a few dozen lines drawing the Pour Tracker, a tool the visitor
 * downloads, and every claim in it — the countdowns to 7 and 28 days, a test
 * running late — is said in words beside it.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function ToolHero() {
  return (
    <section className="phero dark">
      <div className="pglow" />
      <div className="wrap">
        <div className="tl-hero">
          <div>
            <div className="eyebrow">أداة مجانية · بدون حساب · بدون اشتراك</div>
            <h1>
              سجّل الصبّة اليوم، واعرف متى يحين اختبار الكسر — <span style={{ color: 'var(--acc)' }}>قبل أن يتأخر</span>
            </h1>
            <p className="lead">
              ملف HTML واحد يفتح بنقرتين على جهازك. تختار له مجلداً، ومن تلك اللحظة كل صبّة تسجّلها تُكتب هناك: العدّ
              التنازلي لـ ٧ و ٢٨ يوماً، تقارير المختبر، موافقات الاستشاري، وورقة اعتماد A4 جاهزة للطباعة.
            </p>
            <div className="ctas">
              {/* Both land further down this page: the form, and the steps. */}
              <a className="btn p" href="#get">
                حمّل الأداة مجاناً
              </a>
              <a className="btn g" href="#how">
                كيف تعمل؟ ↓
              </a>
            </div>
            <div className="tl-chips">
              {['مجانية بالكامل', 'تعمل بدون إنترنت', 'بياناتك تبقى عندك', 'عربي / English'].map((promise) => (
                <span key={promise} className="tl-chip">
                  <i>✓</i>
                  {promise}
                </span>
              ))}
            </div>
          </div>

          <div className="tl-mock" aria-hidden="true">
            <div className="tl-mh">
              <span className="d" />
              <span className="d" />
              <span className="d" />
              <b>برج النخيل — المرحلة الثانية</b>
            </div>
            <div className="tiles">
              <div className="tile">
                <b>12</b>
                <small>صبّة مسجّلة</small>
              </div>
              <div className="tile">
                <b style={{ color: '#CCA840' }}>3</b>
                <small>اختبار قريب</small>
              </div>
              <div className="tile">
                <b style={{ color: '#F95738' }}>1</b>
                <small>اختبار متأخر</small>
              </div>
            </div>
            <div className="tl-row">
              <span className="rf">ANT-014</span>
              <span className="rn">أساسات — قاعدة F12، المنسوب −٣٫٥</span>
              <div className="rm">
                <div>
                  <span className="mk">كسر ٧ أيام</span>
                  <span className="tl-s warn">
                    <i />
                    بعد يومين
                  </span>
                </div>
                <div>
                  <span className="mk">كسر ٢٨ يوماً</span>
                  <span className="tl-s idle">
                    <i />
                    لم يحن بعد
                  </span>
                </div>
              </div>
            </div>
            <div className="tl-row">
              <span className="rf">ANT-013</span>
              <span className="rn">أعمدة — الدور الأرضي، C1 إلى C6</span>
              <div className="rm">
                <div>
                  <span className="mk">كسر ٧ أيام</span>
                  <span className="tl-s ok">
                    <i />
                    معتمد
                  </span>
                </div>
                <div>
                  <span className="mk">كسر ٢٨ يوماً</span>
                  <span className="tl-s bad">
                    <i />
                    متأخر ٣ أيام
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
