import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { Apply } from '@/components/partnership/apply';
import { Audience } from '@/components/partnership/audience';
import { Benefits } from '@/components/partnership/benefits';
import { Idea } from '@/components/partnership/idea';
import { Modes } from '@/components/partnership/modes';
import { Path } from '@/components/partnership/path';
import { Questions } from '@/components/questions';
import { breadcrumbData, faqData, StructuredData } from '@/components/structured-data';
import { getPartnershipPage } from '@/content/pages/partnership';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getPartnershipPage('ar');
  // Arabic alone until English is switched on (tickets 40 and 42).
  return pageMetadata({ locale: 'ar', locales: ['ar'], path: '/partnership', ...meta });
}

/**
 * The Arabic Partnership Program page, for engineering offices and project
 * management companies — a different programme from the Referral Program, for
 * a different audience (CONTEXT.md). In the Reference site's order: the page
 * hero with its figures, the idea, who it is for, the modes, what a partner
 * gets, the path to joining, the questions, and the application form.
 *
 * Its words come from its entry in the CMS, through
 * `src/content/pages/partnership.ts` (ticket 55).
 *
 * Nothing on it moves but the header, so it loads no other animation code
 * (spec: Analytics and performance). The commercial registration field in the
 * form is the only other client code: it shows the file chosen.
 */
export default async function PartnershipPage() {
  const content = await getPartnershipPage('ar');

  return (
    <PageShell locale="ar" path="/partnership">
      <PageHero content={content.hero} />
      {content.idea.shows && <Idea content={content.idea} />}
      {content.audience.shows && <Audience content={content.audience} />}
      {content.modes.shows && <Modes content={content.modes} />}
      {content.benefits.shows && <Benefits content={content.benefits} />}
      <Path content={content.path} />
      {content.questions.shows && <Questions content={content.questions} />}
      <Apply content={content.apply} />
      <StructuredData data={breadcrumbData('ar', [{ name: content.meta.name, path: '/partnership' }])} />
      <StructuredData data={faqData(content.questions)} />
    </PageShell>
  );
}
