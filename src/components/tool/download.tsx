import { DownloadForm } from '@/components/tool/download-form';
import { Tick, TickList } from '@/components/tool/sections';

/**
 * «حمّل الأداة الآن»: what the visitor gets, beside the form that gets it.
 *
 * The copy says the download starts as soon as the details are complete. That
 * is what ticket 30 builds; until then the form unlocks but delivers nothing
 * (`download-form.tsx`), and the words describe the page as it will be.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function Download() {
  return (
    <section id="get" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="tl-get">
          <div>
            <div className="eyebrow">التحميل</div>
            <h2 style={{ fontSize: '32px', lineHeight: 1.35, margin: 0 }}>حمّل الأداة الآن</h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              أكمل البيانات ويبدأ التحميل مباشرة. نستخدمها لإرسال التحديثات وتحسينات الأداة — لا أكثر.
            </p>
            <TickList>
              <Tick>نسخة كاملة لمشروع واحد، بلا حد زمني ولا علامة مائية</Tick>
              <Tick>ملف واحد — لا تثبيت ولا حساب ولا اشتراك</Tick>
              <Tick>تعمل بدون إنترنت، وبياناتك تبقى في مجلدك</Tick>
              <Tick>واجهة عربية كاملة من اليمين لليسار</Tick>
            </TickList>
            <div className="guar" style={{ marginTop: '18px' }}>
              <b>دقيقتان</b> من التحميل إلى أول صبّة مسجّلة
            </div>
          </div>

          <DownloadForm />
        </div>
      </div>
    </section>
  );
}
