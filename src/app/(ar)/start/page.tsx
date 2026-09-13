import type { Metadata } from 'next';
import { TrustStrip } from '@/components/home/trust-strip';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/start/questions';
import { Steps } from '@/components/start/steps';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  path: '/start',
  title: 'ربائد · ابدأ — كيف نبدأ والأسئلة الشائعة',
  description: 'ثلاث خطوات حتى التشغيل، الضمان، الاشتراك، والأسئلة الشائعة.',
});

/**
 * The Arabic start page, in the Reference site's order: the page hero, the
 * Trust strip, the three steps to going live, and the questions with the demo
 * request form beside them and the free tool teaser under both.
 *
 * **Nothing on it moves but the header and the Trust strip**, so it loads no
 * other animation code: the Reference start page carries the whole animation
 * bundle, hero loop and card decks and journey included, for elements it does
 * not contain (spec: Analytics and performance). Everything here is a server
 * component, and `tests/e2e/start-page.spec.ts` checks the scripts it loads.
 *
 * All copy is verbatim from `reference/site/start.html`.
 */
export default function StartPage() {
  return (
    <PageShell locale="ar" path="/start">
      <section className="phero dark">
        <div className="pglow" />
        <div className="wrap">
          <div className="eyebrow">ابدأ</div>
          <h1>كيف نبدأ معك — وكل ما قد تسأل عنه.</h1>
          <p className="lead">
            ثلاث خطوات حتى التشغيل، وإجابات صريحة عن الاشتراك والضمان والنماذج والسجل بعد نهاية المشروع.
          </p>
          <div className="ctas">
            {/* Both land further down this page: the form, and the questions. */}
            <a className="btn p" href="#demo">
              احجز عرضاً حياً
            </a>
            <a className="btn g" href="#faq">
              الأسئلة الشائعة ↓
            </a>
          </div>
        </div>
      </section>

      {/* The Reference site's start page carries the same strip as its home
          page, under the same label. */}
      <TrustStrip />
      <Steps />
      <Questions />
    </PageShell>
  );
}
