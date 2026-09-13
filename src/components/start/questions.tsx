import { DemoRequestForm } from '@/components/demo-request-form';
import { FaqEntries } from '@/components/faq';
import { START_FAQ } from '@/content/faq';
import { localePath } from '@/lib/locales';

/**
 * «قبل أن تسأل» on the start page: every question, with the demo request form
 * beside them, and under both the free tool teaser.
 *
 * This is where the home page's «كل الأسئلة» link lands (`#faq`), and the
 * hero's «الأسئلة الشائعة ↓». The form is the one form the home and product
 * pages carry too, so ticket 27 wires all three at once.
 *
 * All copy is verbatim from `reference/site/start.html`.
 */
export function Questions() {
  return (
    <section id="faq" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="faq-grid">
          <div>
            <div className="eyebrow">الأسئلة الشائعة</div>
            <h2 style={{ fontSize: '32px' }}>قبل أن تسأل</h2>
            <div style={{ marginTop: '20px' }}>
              <FaqEntries entries={START_FAQ} />
            </div>
          </div>

          <DemoRequestForm />
        </div>

        <FreeToolTeaser />
      </div>
    </section>
  );
}

/**
 * The Pour Tracker, offered free. The Reference site's button goes nowhere
 * (`href="#"`); here it leads to the tool page, which describes the tool and
 * delivers it (CONTEXT.md). Ticket 14 builds that page, so until then the link
 * reaches the 404 page, as the header's links to unbuilt pages do.
 */
function FreeToolTeaser() {
  return (
    <div className="free">
      <div>
        <div className="eyebrow" style={{ marginBottom: '6px' }}>
          أداة مجانية
        </div>
        <h3>سجل صبّات الخرسانة ونتائج التكسير</h3>
        <p>أداة مستقلة تعمل بلا حساب وبلا إنترنت — للمهندس في الموقع. من فريق ربائد.</p>
      </div>
      <a className="btn o" href={localePath('ar', '/tool')}>
        تحميل الأداة
      </a>
    </div>
  );
}
