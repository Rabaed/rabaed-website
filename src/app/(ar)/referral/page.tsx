import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { Audience } from '@/components/referral/audience';
import { HowItWorks } from '@/components/referral/how-it-works';
import { Offer } from '@/components/referral/offer';
import { Questions } from '@/components/referral/questions';
import { Signup } from '@/components/referral/signup';
import { TermsSummary } from '@/components/referral/terms-summary';
import { WhatIsReferred } from '@/components/referral/what-is-referred';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  path: '/referral',
  title: 'ربائد · برنامج الإحالة — 2,000 ريال عن كل مشروع',
  description: 'أحِل مشروعاً واحداً واكسب 2,000 ريال صافية، ويحصل عميلك على خصم 10% على اشتراك مشروعه.',
});

/**
 * The Arabic Referral Program page, in the Reference site's order: the page
 * hero with the programme's three figures, how it works, the offer, who it is
 * for, what is referred, the terms in eight points, the questions, and the
 * signup form.
 *
 * **The amounts — 2,000 SAR a project, 10% off for the client — are written
 * into the copy**, as the Reference site writes them, here and in the Referral
 * Terms. Ticket 21 moves them into one place in the CMS that drives both. They
 * are not in the header menu, by the founders' decision (HANDOFF §2).
 *
 * Nothing on it moves but the header, so it loads no other animation code
 * (spec: Analytics and performance). The document fields in the form are the
 * only other client code: they show the file chosen.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
export default function ReferralPage() {
  return (
    <PageShell locale="ar" path="/referral">
      <section className="phero dark">
        <div className="pglow" />
        <div className="wrap">
          <div className="eyebrow">برنامج الإحالة</div>
          <h1>أحِل مشروعاً واحداً. اكسب 2,000 ريال.</h1>
          <p className="lead">
            تعرف مطوّراً يدير مشروعه على الإيميل والواتساب؟ شارك كودك، واحصل على 2,000 ريال عن كل مشروع يبدأ معنا — ويحصل هو على خصم على اشتراكه.
          </p>
          <div className="ctas">
            {/* Both land further down this page. */}
            <a className="btn p" href="#signup">
              سجّل واحصل على كودك
            </a>
            <a className="btn g" href="#how">
              كيف يعمل البرنامج ↓
            </a>
          </div>
          {/* Only the numerals are `.mono`: DM Mono has no Arabic glyphs
              (spec: Design system). See `programmes.css`. */}
          <div className="pstats">
            <div className="pstat">
              <b>
                <span className="mono">2,000</span> ريال
              </b>
              <span>عن كل مشروع</span>
            </div>
            <div className="pstat">
              <b>
                <span className="mono">10%</span>
              </b>
              <span>خصم لعميلك</span>
            </div>
            <div className="pstat">
              <b>بلا حد</b>
              <span>عدد المشاريع</span>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Offer />
      <Audience />
      <WhatIsReferred />
      <TermsSummary />
      <Questions />
      <Signup />
    </PageShell>
  );
}
