import { Tick, TickList } from '@/components/tool/parts';

/**
 * «الخصوصية»: why the visitor's files never leave their computer, beside the
 * folder the tool writes, drawn as a tree. File names are Latin, so each is set
 * left to right.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
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
