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
import type { PartnershipPageContent } from '@/content/pages/partnership';
import { LOCALES, type Locale } from '@/lib/locales';

/**
 * The Partnership Program page, for engineering offices and project
 * management companies — a different programme from the Referral Program, for
 * a different audience (CONTEXT.md) — in either language. In the Reference
 * site's order: the page hero with its figures, the idea, who it is for, the
 * modes, what a partner gets, the path to joining, the questions, and the
 * application form.
 *
 * Its words come from its entry in the CMS, through
 * `src/content/pages/partnership.ts` (ticket 55), in the language asked for
 * (ticket 42).
 *
 * Nothing on it moves but the header, so it loads no other animation code
 * (spec: Analytics and performance). The application form is the only other
 * client code: it checks the answers, and sends them with the commercial
 * registration (ticket 29).
 */
export async function PartnershipPage({
  locale,
  locales,
  content,
}: {
  locale: Locale;
  /** The languages the page is published in, for the switcher. */
  locales: readonly Locale[];
  content: PartnershipPageContent;
}) {
  const direction = LOCALES[locale].dir;

  return (
    <PageShell locale={locale} path="/partnership" locales={locales}>
      <PageHero content={content.hero} />
      {content.idea.shows && <Idea content={content.idea} />}
      {content.audience.shows && <Audience content={content.audience} />}
      {content.modes.shows && <Modes content={content.modes} />}
      {content.benefits.shows && <Benefits content={content.benefits} />}
      <Path content={content.path} direction={direction} />
      {content.questions.shows && <Questions content={content.questions} direction={direction} />}
      <Apply content={content.apply} form={content.applicationForm} />
      <StructuredData data={await breadcrumbData(locale, [{ name: content.meta.name, path: '/partnership' }])} />
      <StructuredData data={faqData(content.questions)} />
    </PageShell>
  );
}
