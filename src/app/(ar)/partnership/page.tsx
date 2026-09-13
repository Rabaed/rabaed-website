import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { Apply } from '@/components/partnership/apply';
import { Audience } from '@/components/partnership/audience';
import { Benefits } from '@/components/partnership/benefits';
import { Idea } from '@/components/partnership/idea';
import { Modes } from '@/components/partnership/modes';
import { Path } from '@/components/partnership/path';
import { Questions } from '@/components/partnership/questions';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  path: '/partnership',
  title: 'ربائد · برنامج الشراكات للمكاتب الهندسية',
  description: 'شراكة تُصمَّم معك: تسعير شريك، أو رخصة على مستوى المكتب، أو تضمين المنصة في عرضك للمالك.',
});

/**
 * The Arabic Partnership Program page, for engineering offices and project
 * management companies — a different programme from the Referral Program, for
 * a different audience (CONTEXT.md). In the Reference site's order: the page
 * hero with its three figures, the idea, who it is for, the three modes, what a
 * partner gets, the path to joining, the questions, and the application form.
 *
 * Nothing on it moves but the header, so it loads no other animation code
 * (spec: Analytics and performance). The commercial registration field in the
 * form is the only other client code: it shows the file chosen.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
export default function PartnershipPage() {
  return (
    <PageShell locale="ar" path="/partnership">
      <section className="phero dark">
        <div className="pglow" />
        <div className="wrap">
          <div className="eyebrow">برنامج الشراكات</div>
          <h1>منصّة إدارة المشروع… ضمن عرضك أنت</h1>
          <p className="lead">
            شراكة ربائد للمكاتب الهندسية وشركات إدارة المشاريع ومجموعات المقاولات — نموذج تعاون يُصمَّم معك، لا باقة جاهزة تُعرض عليك.
          </p>
          <div className="ctas">
            {/* Both land further down this page. */}
            <a className="btn p" href="#apply">
              اطلب اجتماع شراكة
            </a>
            <a className="btn g" href="#path">
              كيف نبني الشراكة ↓
            </a>
          </div>
          {/* Only the numerals are `.mono`: DM Mono has no Arabic glyphs
              (spec: Design system). See `programmes.css`. */}
          <div className="pstats">
            <div className="pstat">
              <b>
                <span className="mono">3</span> أنماط
              </b>
              <span>للتعاون، تختار معنا الأنسب</span>
            </div>
            <div className="pstat">
              <b>
                <span className="mono">4</span> مراحل
              </b>
              <span>من أول اجتماع إلى أول مشروع</span>
            </div>
            <div className="pstat">
              <b>بلا رسوم</b>
              <span>لا رسوم انضمام للبرنامج</span>
            </div>
          </div>
        </div>
      </section>

      <Idea />
      <Audience />
      <Modes />
      <Benefits />
      <Path />
      <Questions />
      <Apply />
    </PageShell>
  );
}
